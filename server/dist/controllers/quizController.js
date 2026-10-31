"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const Quiz_js_1 = require("../models/Quiz.js");
const QuizAttempt_js_1 = require("../models/QuizAttempt.js");
const ActivityEvent_js_1 = require("../models/ActivityEvent.js");
class QuizController {
    static async getQuizzesForCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const quizzes = await Quiz_js_1.Quiz.find({ course: courseId })
                .select('-questions.correctAnswers -questions.explanation')
                .lean();
            res.json({
                success: true,
                data: quizzes,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getQuizById(req, res, next) {
        try {
            const { quizId } = req.params;
            const quiz = await Quiz_js_1.Quiz.findById(quizId).lean();
            if (!quiz) {
                res.status(404).json({ success: false, message: 'Quiz not found' });
                return;
            }
            // Safe client projection: remove correct answers and explanations before submission
            const safeQuestions = quiz.questions.map((q) => ({
                id: q.id,
                questionText: q.questionText,
                type: q.type,
                options: q.options,
                points: q.points || 1,
            }));
            // Check if user has previous attempts
            let previousAttempts = [];
            if (req.user) {
                previousAttempts = await QuizAttempt_js_1.QuizAttempt.find({ user: req.user._id, quiz: quiz._id })
                    .sort({ submittedAt: -1 })
                    .limit(5)
                    .lean();
            }
            res.json({
                success: true,
                data: {
                    _id: quiz._id,
                    course: quiz.course,
                    title: quiz.title,
                    instructions: quiz.instructions,
                    passThreshold: quiz.passThreshold,
                    maximumAttempts: quiz.maximumAttempts,
                    isRequired: quiz.isRequired,
                    questions: safeQuestions,
                    previousAttempts,
                    hasPassed: previousAttempts.some((a) => a.passed),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async submitQuiz(req, res, next) {
        try {
            const user = req.user;
            const { quizId } = req.params;
            const { answers } = req.body; // array of { questionId, selectedAnswers }
            const quiz = await Quiz_js_1.Quiz.findById(quizId);
            if (!quiz) {
                res.status(404).json({ success: false, message: 'Quiz not found' });
                return;
            }
            // Count prior attempts
            const attemptCount = await QuizAttempt_js_1.QuizAttempt.countDocuments({ user: user._id, quiz: quiz._id });
            if (attemptCount >= quiz.maximumAttempts) {
                res.status(400).json({
                    success: false,
                    message: `Maximum allowed attempts (${quiz.maximumAttempts}) reached for this quiz.`,
                });
                return;
            }
            // Grade answers
            const submissionMap = new Map();
            answers.forEach((ans) => {
                submissionMap.set(ans.questionId, ans.selectedAnswers || []);
            });
            let earnedPoints = 0;
            let totalPoints = 0;
            const gradedAnswers = quiz.questions.map((q) => {
                const points = q.points || 1;
                totalPoints += points;
                const userSelected = submissionMap.get(q.id) || [];
                const correctAnswers = q.correctAnswers || [];
                // Check if user answers match correct answers
                const isCorrect = userSelected.length === correctAnswers.length &&
                    userSelected.every((idx) => correctAnswers.includes(idx)) &&
                    correctAnswers.every((idx) => userSelected.includes(idx));
                if (isCorrect) {
                    earnedPoints += points;
                }
                return {
                    questionId: q.id,
                    questionText: q.questionText,
                    selectedAnswers: userSelected,
                    correctAnswers: correctAnswers, // Can reveal after submission!
                    isCorrect,
                    explanation: q.explanation || '',
                };
            });
            const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
            const passed = score >= quiz.passThreshold;
            const attempt = await QuizAttempt_js_1.QuizAttempt.create({
                user: user._id,
                quiz: quiz._id,
                course: quiz.course,
                answers: gradedAnswers,
                score,
                earnedPoints,
                totalPoints,
                passed,
                attemptNumber: attemptCount + 1,
                submittedAt: new Date(),
            });
            if (passed) {
                await ActivityEvent_js_1.ActivityEvent.create({
                    user: user._id,
                    eventType: 'quiz_passed',
                    course: quiz.course,
                    title: `Passed Quiz: ${quiz.title} (${score}%)`,
                    metadata: { score, quizId: quiz._id },
                    timestamp: new Date(),
                });
            }
            res.json({
                success: true,
                message: passed ? 'Congratulations! You passed the quiz.' : 'Quiz completed. Keep reviewing and try again.',
                data: {
                    attemptId: attempt._id,
                    score,
                    earnedPoints,
                    totalPoints,
                    passed,
                    passThreshold: quiz.passThreshold,
                    attemptNumber: attempt.attemptNumber,
                    remainingAttempts: Math.max(0, quiz.maximumAttempts - (attemptCount + 1)),
                    gradedAnswers,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyQuizAttempts(req, res, next) {
        try {
            const user = req.user;
            const { courseId } = req.query;
            const filter = { user: user._id };
            if (courseId) {
                filter.course = courseId;
            }
            const attempts = await QuizAttempt_js_1.QuizAttempt.find(filter)
                .populate('quiz', 'title passThreshold')
                .sort({ submittedAt: -1 })
                .limit(20)
                .lean();
            res.json({
                success: true,
                data: attempts,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.QuizController = QuizController;
