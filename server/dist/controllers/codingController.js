"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingController = void 0;
const CodingChallenge_js_1 = require("../models/CodingChallenge.js");
const CodingSubmission_js_1 = require("../models/CodingSubmission.js");
const evaluationService_js_1 = require("../services/evaluationService.js");
const ActivityEvent_js_1 = require("../models/ActivityEvent.js");
class CodingController {
    static async getChallengesForCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const challenges = await CodingChallenge_js_1.CodingChallenge.find({ course: courseId })
                .select('-hiddenTestCases')
                .sort({ order: 1 })
                .lean();
            // If user is logged in, attach their submission status for each challenge
            let userSubmissionsMap = new Map();
            if (req.user) {
                const subs = await CodingSubmission_js_1.CodingSubmission.find({
                    user: req.user._id,
                    challenge: { $in: challenges.map((c) => c._id) },
                })
                    .sort({ submittedAt: -1 })
                    .lean();
                for (const s of subs) {
                    const key = s.challenge.toString();
                    if (!userSubmissionsMap.has(key) || s.status === 'Accepted') {
                        userSubmissionsMap.set(key, s.status);
                    }
                }
            }
            const enriched = challenges.map((c) => ({
                ...c,
                userStatus: userSubmissionsMap.get(c._id.toString()) || 'Not Started',
            }));
            res.json({
                success: true,
                data: enriched,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getChallengeById(req, res, next) {
        try {
            const { challengeId } = req.params;
            const challenge = await CodingChallenge_js_1.CodingChallenge.findById(challengeId)
                .select('-hiddenTestCases')
                .lean();
            if (!challenge) {
                res.status(404).json({ success: false, message: 'Coding challenge not found' });
                return;
            }
            let userSubmissions = [];
            if (req.user) {
                userSubmissions = await CodingSubmission_js_1.CodingSubmission.find({
                    user: req.user._id,
                    challenge: challenge._id,
                })
                    .sort({ submittedAt: -1 })
                    .limit(10)
                    .lean();
            }
            res.json({
                success: true,
                data: {
                    ...challenge,
                    submissions: userSubmissions,
                    isSolved: userSubmissions.some((s) => s.status === 'Accepted'),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async runTests(req, res, next) {
        try {
            const { challengeId } = req.params;
            const { language, sourceCode } = req.body;
            const challenge = await CodingChallenge_js_1.CodingChallenge.findById(challengeId);
            if (!challenge) {
                res.status(404).json({ success: false, message: 'Coding challenge not found' });
                return;
            }
            // Evaluate against sample test cases only
            const result = await evaluationService_js_1.EvaluationService.evaluate(language, sourceCode, challenge.sampleTestCases, false // not a final submission
            );
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async submitChallenge(req, res, next) {
        try {
            const user = req.user;
            const { challengeId } = req.params;
            const { language, sourceCode } = req.body;
            const challenge = await CodingChallenge_js_1.CodingChallenge.findById(challengeId);
            if (!challenge) {
                res.status(404).json({ success: false, message: 'Coding challenge not found' });
                return;
            }
            // Full test suite: combine sample + hidden test cases
            const allTestCases = [...challenge.sampleTestCases, ...challenge.hiddenTestCases];
            const evalResult = await evaluationService_js_1.EvaluationService.evaluate(language, sourceCode, allTestCases, true // is submission
            );
            // Save submission record
            const submission = await CodingSubmission_js_1.CodingSubmission.create({
                user: user._id,
                challenge: challenge._id,
                course: challenge.course,
                language,
                sourceCode,
                status: evalResult.status,
                testSummary: {
                    passed: evalResult.passed,
                    total: evalResult.total,
                    message: evalResult.message,
                    details: evalResult.details.map((d) => ({
                        testCase: d.testCase,
                        passed: d.passed,
                        actualOutput: d.actualOutput,
                        expectedOutput: d.expectedOutput,
                        error: d.error,
                    })),
                },
                submittedAt: new Date(),
            });
            if (evalResult.status === 'Accepted') {
                await ActivityEvent_js_1.ActivityEvent.create({
                    user: user._id,
                    eventType: 'coding_accepted',
                    course: challenge.course,
                    title: `Solved Challenge: ${challenge.title}`,
                    metadata: { challengeId: challenge._id, language },
                    timestamp: new Date(),
                });
            }
            res.json({
                success: true,
                message: evalResult.status === 'Accepted'
                    ? 'Challenge completed! All test cases passed.'
                    : 'Solution did not pass all test cases.',
                data: {
                    submissionId: submission._id,
                    status: evalResult.status,
                    passed: evalResult.passed,
                    total: evalResult.total,
                    message: evalResult.message,
                    details: evalResult.details,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMySubmissions(req, res, next) {
        try {
            const user = req.user;
            const { challengeId, courseId } = req.query;
            const filter = { user: user._id };
            if (challengeId)
                filter.challenge = challengeId;
            if (courseId)
                filter.course = courseId;
            const submissions = await CodingSubmission_js_1.CodingSubmission.find(filter)
                .populate('challenge', 'title difficulty')
                .sort({ submittedAt: -1 })
                .limit(20)
                .lean();
            res.json({
                success: true,
                data: submissions,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CodingController = CodingController;
