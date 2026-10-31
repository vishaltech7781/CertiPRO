import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { Certificate } from '../models/Certificate.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
import { Course } from '../models/Course.js';
import { QuizAttempt } from '../models/QuizAttempt.js';

export class ProfileController {
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;

      const [enrolledCount, completedCount, certificatesCount] = await Promise.all([
        Enrollment.countDocuments({ user: user._id }),
        Enrollment.countDocuments({ user: user._id, status: 'completed' }),
        Certificate.countDocuments({ user: user._id, status: 'valid' }),
      ]);

      res.json({
        success: true,
        data: {
          ...user.toJSON(),
          stats: {
            enrolledCount,
            completedCount,
            certificatesCount,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { name, bio, learningInterests, avatar } = req.body;

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (learningInterests) user.learningInterests = learningInterests;
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { currentPassword, newPassword } = req.body;

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;

      // Mark account as suspended / deactivated and clear personal identifiable info
      user.accountStatus = 'suspended';
      user.name = 'Deactivated Learner';
      user.email = `deactivated_${user._id}@certipro.local`;
      await user.save();

      res.clearCookie('cp_token');

      res.json({
        success: true,
        message: 'Your account has been deactivated in accordance with CertiPro privacy policy.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const activities = await ActivityEvent.find({ user: user._id })
        .populate('course', 'title slug')
        .sort({ timestamp: -1 })
        .limit(20)
        .lean();

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;

      // 1. Fetch In-Progress and Enrolled courses
      const enrollments = await Enrollment.find({ user: user._id })
        .populate({
          path: 'course',
          select: 'title slug thumbnail category instructor skillLevel courseType estimatedDuration',
        })
        .sort({ lastAccessedAt: -1 })
        .lean();

      const inProgress = enrollments.filter((e) => e.status === 'in-progress');
      const completed = enrollments.filter((e) => e.status === 'completed');

      // 2. Certificates
      const certificates = await Certificate.find({ user: user._id })
        .populate('course', 'title slug thumbnail')
        .sort({ issueDate: -1 })
        .lean();

      // 3. Recent activity
      const recentActivity = await ActivityEvent.find({ user: user._id })
        .populate('course', 'title slug')
        .sort({ timestamp: -1 })
        .limit(8)
        .lean();

      // 4. Recommendations: courses matching user interests or popular in enrolled categories
      const enrolledCourseIds = enrollments.map((e: any) => e.course?._id).filter(Boolean);
      const userCategories = enrollments.map((e: any) => e.course?.category).filter(Boolean);

      const recFilter: any = {
        _id: { $nin: enrolledCourseIds },
        isPublished: true,
      };

      if (user.learningInterests && user.learningInterests.length > 0) {
        recFilter.$or = [
          { category: { $in: user.learningInterests } },
          { skills: { $in: user.learningInterests } },
        ];
      } else if (userCategories.length > 0) {
        recFilter.category = { $in: userCategories };
      }

      let recommendations = await Course.find(recFilter)
        .sort({ enrolledCount: -1 })
        .limit(4)
        .lean();

      if (recommendations.length === 0) {
        recommendations = await Course.find({
          _id: { $nin: enrolledCourseIds },
          isPublished: true,
        })
          .sort({ enrolledCount: -1 })
          .limit(4)
          .lean();
      }

      res.json({
        success: true,
        data: {
          stats: {
            totalEnrolled: enrollments.length,
            inProgressCount: inProgress.length,
            completedCount: completed.length,
            certificatesCount: certificates.length,
          },
          inProgress,
          completed,
          certificates,
          recentActivity,
          recommendations,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

