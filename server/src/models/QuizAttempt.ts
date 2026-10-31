import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAnswer {
  questionId: string;
  selectedAnswers: number[];
  isCorrect: boolean;
  explanation?: string;
}

export interface IQuizAttempt extends Document {
  user: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  answers: IUserAnswer[];
  score: number; // percentage, e.g. 85
  earnedPoints: number;
  totalPoints: number;
  passed: boolean;
  attemptNumber: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IUserAnswer>(
  {
    questionId: { type: String, required: true },
    selectedAnswers: { type: [Number], required: true },
    isCorrect: { type: Boolean, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
    },
    earnedPoints: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ user: 1, quiz: 1, submittedAt: -1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);

