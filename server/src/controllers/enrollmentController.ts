import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { Lesson } from '../models/Lesson.js';
import { LessonProgress } from '../models/LessonProgress.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
import { Certificate } from '../models/Certificate.js';

export class EnrollmentController {
  public static async enroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const courseId = req.params.courseId as string;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ success: false, message: 'Invalid course ID format' });
        return;
      }

      const course = await Course.findById(courseId);
      if (!course || !course.isPublished) {
        res.status(404).json({ success: false, message: 'Course not found or not published' });
        return;
      }

      // Check existing enrollment
      const existing = await Enrollment.findOne({ user: user._id, course: course._id });
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'You are already enrolled in this course.',
          data: existing,
        });
        return;
      }

      const totalLessons = await Lesson.countDocuments({ course: course._id });

      const enrollment = await Enrollment.create({
        user: user._id,
        course: course._id,
        enrollmentDate: new Date(),
        status: 'in-progress',
        progressPercent: 0,
        completedLessonsCount: 0,
        totalLessonsCount: totalLessons,
      });

      // Increment course enrolledCount
      course.enrolledCount = (course.enrolledCount || 0) + 1;
      await course.save();

      // Record Activity
      await ActivityEvent.create({
        user: user._id,
        eventType: 'enrollment',
        course: course._id,
        title: `Enrolled in ${course.title}`,
        timestamp: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course.',
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyEnrollments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { status } = req.query;

      const filter: any = { user: user._id };
      if (status && status !== 'all') {
        filter.status = status;
      }

      const enrollments = await Enrollment.find(filter)
        .populate({
          path: 'course',
          select: 'title slug thumbnail category instructor skillLevel courseType estimatedDuration',
        })
        .sort({ lastAccessedAt: -1 })
        .lean();

      // Check which enrollments have issued certificates
      const certificates = await Certificate.find({ user: user._id }).select('course certificateId verificationCode').lean();
      const certMap = new Map<string, any>();
      certificates.forEach((c) => certMap.set(c.course.toString(), c));

      const enriched = enrollments.map((e: any) => ({
        ...e,
        certificate: e.course ? certMap.get(e.course._id.toString()) || null : null,
      }));

      res.json({
        success: true,
        data: enriched,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getEnrollmentByCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { courseId } = req.params;

      const enrollment = await Enrollment.findOne({ user: user._id, course: courseId }).lean();
      if (!enrollment) {
        res.status(404).json({ success: false, message: 'Enrollment not found for this course.' });
        return;
      }

      res.json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async completeLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { courseId, lessonId } = req.params;

      const enrollment = await Enrollment.findOne({ user: user._id, course: courseId });
      if (!enrollment) {
        res.status(403).json({ success: false, message: 'You must be enrolled in this course to mark lessons complete.' });
        return;
      }

      const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
      if (!lesson) {
        res.status(404).json({ success: false, message: 'Lesson not found in this course.' });
        return;
      }

      // Upsert LessonProgress
      const progressRecord = await LessonProgress.findOneAndUpdate(
        { user: user._id, lesson: lesson._id },
        {
          course: courseId,
          completed: true,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Recalculate progress
      const totalLessons = await Lesson.countDocuments({ course: courseId, isRequired: true });
      const completedProgress = await LessonProgress.find({
        user: user._id,
        course: courseId,
        completed: true,
      });

      const completedCount = completedProgress.length;
      const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 100;

      enrollment.completedLessonsCount = completedCount;
      enrollment.totalLessonsCount = totalLessons;
      enrollment.progressPercent = progressPercent;
      enrollment.lastAccessedAt = new Date();

      if (progressPercent >= 100 && enrollment.status !== 'completed') {
        enrollment.status = 'completed';
        enrollment.completionDate = new Date();
      }

      await enrollment.save();

      // Record Activity
      await ActivityEvent.create({
        user: user._id,
        eventType: 'lesson_completed',
        course: courseId,
        lesson: lesson._id,
        title: `Completed lesson: ${lesson.title}`,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        message: 'Lesson marked as completed.',
        data: {
          progress: progressRecord,
          enrollment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { courseId } = req.params;

      const [enrollment, progresses] = await Promise.all([
        Enrollment.findOne({ user: user._id, course: courseId }).lean(),
        LessonProgress.find({ user: user._id, course: courseId, completed: true }).lean(),
      ]);

      const completedLessonIds = progresses.map((p) => p.lesson.toString());

      res.json({
        success: true,
        data: {
          isEnrolled: !!enrollment,
          enrollment,
          completedLessonIds,
          completedCount: completedLessonIds.length,
          progressPercent: enrollment?.progressPercent || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
