export type UserRole = 'learner' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  learningInterests: string[];
  accountStatus: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseType = 'Theory' | 'Coding' | 'Mixed';

export interface CourseModule {
  _id: string;
  title: string;
  description?: string;
  order: number;
}

export interface CertificatePolicy {
  requireAllLessons: boolean;
  requireQuizzes: boolean;
  minQuizScorePercent: number;
  requireCoding: boolean;
  minCodingSolvedPercent: number;
}

export interface CourseInstructor {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  category: string;
  subcategory?: string;
  instructor: CourseInstructor;
  skillLevel: SkillLevel;
  courseType: CourseType;
  language: string;
  estimatedDuration: string;
  skills: string[];
  prerequisites: string[];
  learningObjectives: string[];
  modules: CourseModule[];
  certificatePolicy: CertificatePolicy;
  isFree: boolean;
  price: number;
  isPublished: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  enrolledCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  isEnrolled?: boolean;
}

export interface LessonResource {
  title: string;
  url: string;
}

export interface Lesson {
  _id: string;
  course: string;
  moduleId: string;
  title: string;
  description: string;
  lessonType: 'video' | 'article';
  youtubeVideoId: string;
  videoUrl?: string;
  durationMinutes: number;
  order: number;
  resources: LessonResource[];
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  courseCount?: number;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: Course;
  enrollmentDate: string;
  status: 'in-progress' | 'completed';
  lastAccessedAt: string;
  completionDate?: string;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  certificate?: {
    certificateId: string;
    verificationCode: string;
  } | null;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple-choice' | 'true-false' | 'multiple-select';
  options: string[];
  points?: number;
}

export interface Quiz {
  _id: string;
  course: string;
  title: string;
  instructions: string;
  passThreshold: number;
  maximumAttempts: number;
  isRequired: boolean;
  questions: QuizQuestion[];
  previousAttempts?: QuizAttempt[];
  hasPassed?: boolean;
}

export interface QuizAttempt {
  _id: string;
  quiz: string | { _id: string; title: string };
  course: string;
  score: number;
  earnedPoints: number;
  totalPoints: number;
  passed: boolean;
  attemptNumber: number;
  submittedAt: string;
  answers?: Array<{
    questionId: string;
    questionText?: string;
    selectedAnswers: number[];
    correctAnswers?: number[];
    isCorrect: boolean;
    explanation?: string;
  }>;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface CodingChallenge {
  _id: string;
  course: string;
  title: string;
  problemStatement: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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
  sampleTestCases: TestCase[];
  constraints: string[];
  isRequired: boolean;
  order: number;
  userStatus?: string;
  isSolved?: boolean;
}

export interface CodingSubmission {
  _id: string;
  challenge: string | { _id: string; title: string };
  course: string;
  language: string;
  sourceCode: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  testSummary: {
    passed: number;
    total: number;
    message: string;
    details?: Array<{
      testCase: number;
      passed: boolean;
      actualOutput?: string;
      expectedOutput?: string;
      error?: string;
      isSample?: boolean;
    }>;
  };
  submittedAt: string;
}

export interface Certificate {
  _id: string;
  certificateId: string;
  verificationCode: string;
  user: string;
  course: Course;
  issueDate: string;
  status: 'valid' | 'revoked';
  completionSnapshot: {
    courseTitle: string;
    courseCategory: string;
    learnerName: string;
    instructorName: string;
    completionDate: string;
    estimatedDuration: string;
    skills: string[];
    gradePercent: number;
  };
}

export interface ActivityEvent {
  _id: string;
  eventType: 'enrollment' | 'lesson_completed' | 'quiz_passed' | 'coding_accepted' | 'certificate_earned';
  title: string;
  course?: { _id: string; title: string; slug: string };
  timestamp: string;
}

