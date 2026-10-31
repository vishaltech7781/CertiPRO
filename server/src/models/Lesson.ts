import mongoose, { Document, Schema } from 'mongoose';

export interface ILessonResource {
  title: string;
  url: string;
}

export interface ILesson extends Document {
  course: mongoose.Types.ObjectId;
  moduleId: string;
  title: string;
  description: string;
  lessonType: 'video' | 'article';
  youtubeVideoId: string;
  videoUrl?: string;
  durationMinutes: number;
  order: number;
  resources: ILessonResource[];
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    lessonType: {
      type: String,
      enum: ['video', 'article'],
      default: 'video',
    },
    youtubeVideoId: {
      type: String,
      default: '',
      trim: true,
    },
    videoUrl: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      default: 10,
    },
    order: {
      type: Number,
      required: true,
    },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ course: 1, moduleId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);

