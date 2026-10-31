"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const Category_js_1 = require("../models/Category.js");
const Course_js_1 = require("../models/Course.js");
class CategoryController {
    static async getCategories(req, res, next) {
        try {
            const categories = await Category_js_1.Category.find().sort({ displayOrder: 1 }).lean();
            // Get count of published courses per category
            const courseCounts = await Course_js_1.Course.aggregate([
                { $match: { isPublished: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]);
            const countMap = {};
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategoryBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const category = await Category_js_1.Category.findOne({ slug }).lean();
            if (!category) {
                res.status(404).json({ success: false, message: 'Category not found' });
                return;
            }
            const courses = await Course_js_1.Course.find({
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
