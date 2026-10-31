import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { Course } from '../models/Course.js';

export class CategoryController {
  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await Category.find().sort({ displayOrder: 1 }).lean();

      // Get count of published courses per category
      const courseCounts = await Course.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      const countMap: Record<string, number> = {};
      courseCounts.forEach((c) => {
        countMap[c._id] = c.count;
      });

      const enriched = categories.map((cat) => ({
        ...cat,
        courseCount: countMap[cat.name] || 0,
      }));

      res.json({
        success: true,
        data: enriched,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await Category.findOne({ slug }).lean();

      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }

      const courses = await Course.find({
        category: category.name,
        isPublished: true,
      })
        .sort({ enrolledCount: -1 })
        .lean();

      res.json({
        success: true,
        data: {
          category,
          courses,
          courseCount: courses.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

