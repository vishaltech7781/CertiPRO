import mongoose, { Document, Schema } from 'mongoose';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseType = 'Theory' | 'Coding' | 'Mixed';

export interface ICourseModule {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  title: string;
  description?: string;
  order: number;
}

export interface ICertificatePolicy {
  requireAllLessons: boolean;
  requireQuizzes: boolean;
  minQuizScorePercent: number;
  requireCoding: boolean;
  minCodingSolvedPercent: number;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  category: string; // e.g. "Web Development" or slug
  subcategory?: string;
  instructor: {
    name: string;
    title: string;
    bio: string;
    avatar?: string;
  };
  skillLevel: SkillLevel;
  courseType: CourseType;
  language: string;
  estimatedDuration: string; // e.g. "8 hours"
  skills: string[];
  prerequisites: string[];
  learningObjectives: string[];
  modules: ICourseModule[];
  certificatePolicy: ICertificatePolicy;
  isFree: boolean;
  price: number;
  isPublished: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  enrolledCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<ICourseModule>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const certificatePolicySchema = new Schema<ICertificatePolicy>(
  {
    requireAllLessons: { type: Boolean, default: true },
    requireQuizzes: { type: Boolean, default: true },
    minQuizScorePercent: { type: Number, default: 70 },
    requireCoding: { type: Boolean, default: false },
    minCodingSolvedPercent: { type: Number, default: 80 },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 250 },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, default: '' },
    instructor: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      bio: { type: String, required: true },
      avatar: { type: String, default: '' },
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
      index: true,
    },
    courseType: {
      type: String,
      enum: ['Theory', 'Coding', 'Mixed'],
      required: true,
      index: true,
    },
    language: { type: String, default: 'English' },
    estimatedDuration: { type: String, required: true },
    skills: { type: [String], default: [], index: true },
    prerequisites: { type: [String], default: [] },
    learningObjectives: { type: [String], default: [] },
    modules: [moduleSchema],
    certificatePolicy: {
      type: certificatePolicySchema,
      default: () => ({
        requireAllLessons: true,
        requireQuizzes: true,
        minQuizScorePercent: 70,
        requireCoding: false,
        minCodingSolvedPercent: 80,
      }),
    },
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    enrolledCount: { type: Number, default: 0, index: true },
    ratingAvg: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Text index for search
courseSchema.index(
  {
    title: 'text',
    shortDescription: 'text',
    description: 'text',
    skills: 'text',
    category: 'text',
    'instructor.name': 'text',
  },
  {
    weights: {
      title: 10,
      skills: 5,
      category: 4,
      shortDescription: 3,
      'instructor.name': 2,
      description: 1,
    },
    name: 'course_text_index',
  }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);

