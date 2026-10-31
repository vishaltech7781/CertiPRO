import mongoose, { Document, Schema } from 'mongoose';

export type EnrollmentStatus = 'in-progress' | 'completed';

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  lastAccessedAt: Date;
  completionDate?: Date;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
      index: true,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessonsCount: {
      type: Number,
      default: 0,
    },
    totalLessonsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);

