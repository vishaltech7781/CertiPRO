import mongoose, { Document, Schema } from 'mongoose';

export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface ICodingChallenge extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  problemStatement: string;
  difficulty: ChallengeDifficulty;
  topicTags: string[];
  supportedLanguages: string[];
  starterCode: {
    javascript?: string;
    python?: string;
    sql?: string;
    java?: string;
  };
  inputFormat: string;
  outputFormat: string;
  sampleTestCases: ITestCase[];
  hiddenTestCases: ITestCase[];
  constraints: string[];
  isRequired: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const testCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const codingChallengeSchema = new Schema<ICodingChallenge>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
      index: true,
    },
    topicTags: {
      type: [String],
      default: [],
    },
    supportedLanguages: {
      type: [String],
      default: ['javascript', 'python'],
    },
    starterCode: {
      javascript: { type: String, default: '' },
      python: { type: String, default: '' },
      sql: { type: String, default: '' },
      java: { type: String, default: '' },
    },
    inputFormat: {
      type: String,
      default: '',
    },
    outputFormat: {
      type: String,
      default: '',
    },
    sampleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    constraints: {
      type: [String],
      default: [],
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const CodingChallenge = mongoose.model<ICodingChallenge>('CodingChallenge', codingChallengeSchema);

