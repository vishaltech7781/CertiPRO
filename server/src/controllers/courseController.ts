import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { Quiz } from '../models/Quiz.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { Enrollment } from '../models/Enrollment.js';

export class CourseController {
  public static async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        q,
        category,
        skillLevel,
        courseType,
        isFree,
        language,
        hasCertificate,
        sort = 'popular',
        page = '1',
        limit = '12',
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
      const skip = (pageNum - 1) * limitNum;

      const filter: any = { isPublished: true };

      // Search term
      if (q && typeof q === 'string' && q.trim()) {
        filter.$or = [
          { title: { $regex: q.trim(), $options: 'i' } },
          { shortDescription: { $regex: q.trim(), $options: 'i' } },
          { skills: { $regex: q.trim(), $options: 'i' } },
          { category: { $regex: q.trim(), $options: 'i' } },
          { 'instructor.name': { $regex: q.trim(), $options: 'i' } },
        ];
      }

      // Category filter
      if (category && typeof category === 'string' && category !== 'All') {
        filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
      }

      // Skill level filter
      if (skillLevel && typeof skillLevel === 'string' && skillLevel !== 'All') {
        filter.skillLevel = skillLevel;
      }

      // Course type filter
      if (courseType && typeof courseType === 'string' && courseType !== 'All') {
        filter.courseType = courseType;
      }

      // Free / Paid filter
      if (isFree !== undefined && isFree !== '') {
        filter.isFree = isFree === 'true';
      }

      // Language filter
      if (language && typeof language === 'string' && language !== 'All') {
        filter.language = language;
      }

      // Sort order
      let sortObj: any = { enrolledCount: -1 };
      if (sort === 'newest') {
        sortObj = { createdAt: -1 };
      } else if (sort === 'rating') {
        sortObj = { ratingAvg: -1, ratingCount: -1 };
      } else if (sort === 'popular') {
        sortObj = { enrolledCount: -1, isTrending: -1 };
      } else if (sort === 'relevance' && q) {
        sortObj = { enrolledCount: -1 };
      }

      const [courses, total] = await Promise.all([
        Course.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
        Course.countDocuments(filter),
      ]);

      // If user is authenticated, check their enrollment status for each course
      let enrolledCourseIds = new Set<string>();
      if (req.user) {
        const enrollments = await Enrollment.find({
          user: req.user._id,
          course: { $in: courses.map((c) => c._id) },
        })
          .select('course status progressPercent')
          .lean();

        for (const enr of enrollments) {
          enrolledCourseIds.add(enr.course.toString());
        }
      }

      const enrichedCourses = courses.map((c) => ({
        ...c,
        isEnrolled: enrolledCourseIds.has(c._id.toString()),
      }));

      res.json({
        success: true,
        data: enrichedCourses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasMore: skip + courses.length < total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const course = await Course.findOne({ slug }).lean();
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      // Fetch lessons for this course
      const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();

      // Check for quizzes and coding challenges counts
      const [quizCount, codingCount] = await Promise.all([
        Quiz.countDocuments({ course: course._id }),
        CodingChallenge.countDocuments({ course: course._id }),
      ]);

      let isEnrolled = false;
      let enrollmentData = null;

      if (req.user) {
        const enrollment = await Enrollment.findOne({
          user: req.user._id,
          course: course._id,
        }).lean();
        if (enrollment) {
          isEnrolled = true;
          enrollmentData = enrollment;
        }
      }

      res.json({
        success: true,
        data: {
          ...course,
          lessons,
          totalLessons: lessons.length,
          quizCount,
          codingCount,
          isEnrolled,
          enrollment: enrollmentData,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCurriculum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId).lean();
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 }).lean();
      const quizzes = await Quiz.find({ course: courseId }).select('-questions.correctAnswers').lean();
      const challenges = await CodingChallenge.find({ course: courseId })
        .select('-hiddenTestCases')
        .lean();

      res.json({
        success: true,
        data: {
          modules: course.modules,
          lessons,
          quizzes,
          challenges,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getTrending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trendingCourses = await Course.find({ isPublished: true, isTrending: true })
        .limit(6)
        .lean();

      res.json({
        success: true,
        data: trendingCourses,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recentCourses = await Course.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

      res.json({
        success: true,
        data: recentCourses,
      });
    } catch (error) {
      next(error);
    }
  }
}

