import mongoose, { Document, Schema } from 'mongoose';

export type ActivityEventType =
  | 'enrollment'
  | 'lesson_completed'
  | 'quiz_passed'
  | 'coding_accepted'
  | 'certificate_earned';

export interface IActivityEvent extends Document {
  user: mongoose.Types.ObjectId;
  eventType: ActivityEventType;
  course?: mongoose.Types.ObjectId;
  lesson?: mongoose.Types.ObjectId;
  title: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
}

const activityEventSchema = new Schema<IActivityEvent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['enrollment', 'lesson_completed', 'quiz_passed', 'coding_accepted', 'certificate_earned'],
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

activityEventSchema.index({ user: 1, timestamp: -1 });

export const ActivityEvent = mongoose.model<IActivityEvent>('ActivityEvent', activityEventSchema);

