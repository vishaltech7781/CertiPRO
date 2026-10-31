import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { Quiz } from '../models/Quiz.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { Enrollment } from '../models/Enrollment.js';
import { Certificate } from '../models/Certificate.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';

export class AdminController {
  public static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalUsers,
        totalLearners,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        completedEnrollments,
        totalCertificates,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'learner' }),
        Course.countDocuments(),
        Course.countDocuments({ isPublished: true }),
        Enrollment.countDocuments(),
        Enrollment.countDocuments({ status: 'completed' }),
        Certificate.countDocuments({ status: 'valid' }),
      ]);

      const topCourses = await Course.find()
        .sort({ enrolledCount: -1 })
        .limit(5)
        .select('title category enrolledCount ratingAvg isPublished')
        .lean();

      res.json({
        success: true,
        data: {
          totalUsers,
          totalLearners,
          totalCourses,
          publishedCourses,
          totalEnrollments,
          completedEnrollments,
          totalCertificates,
          completionRate:
            totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
          topCourses,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '20', q } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;

      const filter: any = {};
      if (q && typeof q === 'string') {
        filter.title = { $regex: q.trim(), $options: 'i' };
      }

      const [courses, total] = await Promise.all([
        Course.find(filter)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
        Course.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: courses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const existing = await Course.findOne({ slug });
      const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

      const course = await Course.create({
        ...body,
        slug: finalSlug,
      });

      res.status(201).json({
        success: true,
        message: 'Course created successfully.',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await Course.findByIdAndUpdate(courseId, req.body, { new: true });

      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      res.json({
        success: true,
        message: 'Course updated successfully.',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId);

      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      // Check if learners are enrolled; if yes, unpublish instead of breaking enrollment records
      const enrollmentCount = await Enrollment.countDocuments({ course: courseId });
      if (enrollmentCount > 0) {
        course.isPublished = false;
        await course.save();
        res.json({
          success: true,
          message: 'Course has existing enrollments and has been safely unpublished rather than deleted.',
        });
        return;
      }

      await Course.findByIdAndDelete(courseId);
      await Lesson.deleteMany({ course: courseId });
      await Quiz.deleteMany({ course: courseId });
      await CodingChallenge.deleteMany({ course: courseId });

      res.json({
        success: true,
        message: 'Course and associated curriculum deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async addModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const { title, description, order } = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      course.modules.push({
        title,
        description,
        order: order || course.modules.length + 1,
      });

      await course.save();

      res.status(201).json({
        success: true,
        message: 'Module added successfully.',
        data: course.modules,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async addLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const body = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      const lesson = await Lesson.create({
        ...body,
        course: courseId,
      });

      // Update total lessons count in active enrollments
      const totalLessons = await Lesson.countDocuments({ course: courseId });
      await Enrollment.updateMany({ course: courseId }, { totalLessonsCount: totalLessons });

      res.status(201).json({
        success: true,
        message: 'Lesson created successfully.',
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lessonId } = req.params;
      const lesson = await Lesson.findByIdAndUpdate(lessonId, req.body, { new: true });

      if (!lesson) {
        res.status(404).json({ success: false, message: 'Lesson not found' });
        return;
      }

      res.json({
        success: true,
        message: 'Lesson updated successfully.',
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lessonId } = req.params;
      const lesson = await Lesson.findByIdAndDelete(lessonId);

      if (!lesson) {
        res.status(404).json({ success: false, message: 'Lesson not found' });
        return;
      }

      // Update enrollment counts
      const totalLessons = await Lesson.countDocuments({ course: lesson.course });
      await Enrollment.updateMany({ course: lesson.course }, { totalLessonsCount: totalLessons });

      res.json({
        success: true,
        message: 'Lesson removed.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const quiz = await Quiz.create({
        ...body,
        course: body.courseId,
      });

      res.status(201).json({
        success: true,
        message: 'Quiz created successfully.',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const challenge = await CodingChallenge.create({
        ...body,
        course: body.courseId,
      });

      res.status(201).json({
        success: true,
        message: 'Coding challenge created successfully.',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '20', role } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;

      const filter: any = {};
      if (role && role !== 'all') {
        filter.role = role;
      }

      const [users, total] = await Promise.all([
        User.find(filter)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .select('-passwordHash')
          .lean(),
        User.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['learner', 'admin'].includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role.' });
        return;
      }

      const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        success: true,
        message: `User role updated to ${role}.`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await Category.find().sort({ displayOrder: 1 }).lean();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  public static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, iconName } = req.body;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const category = await Category.create({
        name,
        slug,
        description,
        iconName: iconName || 'BookOpen',
        displayOrder: 0,
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully.',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}

