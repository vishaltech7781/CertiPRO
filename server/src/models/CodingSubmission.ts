import mongoose, { Document, Schema } from 'mongoose';

export type SubmissionStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Runtime Error'
  | 'Compilation Error';

export interface ITestDetail {
  testCase: number;
  passed: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  error?: string;
}

export interface ICodingSubmission extends Document {
  user: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  language: string;
  sourceCode: string;
  status: SubmissionStatus;
  testSummary: {
    passed: number;
    total: number;
    message: string;
    details?: ITestDetail[];
  };
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const codingSubmissionSchema = new Schema<ICodingSubmission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'CodingChallenge',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true,
      index: true,
    },
    testSummary: {
      passed: { type: Number, required: true },
      total: { type: Number, required: true },
      message: { type: String, default: '' },
      details: [
        {
          testCase: { type: Number },
          passed: { type: Boolean },
          actualOutput: { type: String },
          expectedOutput: { type: String },
          error: { type: String },
        },
      ],
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

codingSubmissionSchema.index({ user: 1, challenge: 1, status: 1 });

export const CodingSubmission = mongoose.model<ICodingSubmission>('CodingSubmission', codingSubmissionSchema);

