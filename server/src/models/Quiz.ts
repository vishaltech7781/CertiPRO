import mongoose, { Document, Schema } from 'mongoose';

export type QuestionType = 'multiple-choice' | 'true-false' | 'multiple-select';

export interface IQuizQuestion {
  id: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctAnswers: number[]; // indices of correct options
  explanation: string;
  points?: number;
}

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  moduleId?: string;
  lesson?: mongoose.Types.ObjectId;
  title: string;
  instructions: string;
  passThreshold: number; // percentage, e.g. 70
  maximumAttempts: number;
  isRequired: boolean;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuizQuestion>(
  {
    id: { type: String, required: true },
    questionText: { type: String, required: true },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'multiple-select'],
      default: 'multiple-choice',
    },
    options: { type: [String], required: true },
    correctAnswers: { type: [Number], required: true },
    explanation: { type: String, default: '' },
    points: { type: Number, default: 1 },
  },
  { _id: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      default: 'Read each question carefully and select the best answer.',
    },
    passThreshold: {
      type: Number,
      default: 70,
    },
    maximumAttempts: {
      type: Number,
      default: 5,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);

