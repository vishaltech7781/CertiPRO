import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateSnapshot {
  courseTitle: string;
  courseCategory: string;
  learnerName: string;
  instructorName: string;
  completionDate: Date;
  estimatedDuration: string;
  skills: string[];
  gradePercent: number;
}

export interface ICertificate extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  certificateId: string;
  verificationCode: string;
  issueDate: Date;
  status: 'valid' | 'revoked';
  completionSnapshot: ICertificateSnapshot;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
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
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['valid', 'revoked'],
      default: 'valid',
      index: true,
    },
    completionSnapshot: {
      courseTitle: { type: String, required: true },
      courseCategory: { type: String, required: true },
      learnerName: { type: String, required: true },
      instructorName: { type: String, required: true },
      completionDate: { type: Date, required: true },
      estimatedDuration: { type: String, required: true },
      skills: { type: [String], default: [] },
      gradePercent: { type: Number, default: 100 },
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);

