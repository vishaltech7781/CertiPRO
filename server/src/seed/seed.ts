import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { Enrollment } from '../models/Enrollment.js';
import { LessonProgress } from '../models/LessonProgress.js';
import { Certificate } from '../models/Certificate.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
import { quizzesByCourseSlug } from './quizData.js';
import { challengesByCourseSlug } from './challengeData.js';

export const categoriesData = [
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Foundations of intelligent agents, neural reasoning, search heuristics, and generative architectures.', iconName: 'Bot', displayOrder: 1 },
  { name: 'Machine Learning', slug: 'machine-learning', description: 'Statistical learning methods, supervised and unsupervised modeling, feature engineering, and evaluation.', iconName: 'BrainCircuit', displayOrder: 2 },
  { name: 'Cloud Computing', slug: 'cloud-computing', description: 'Architecting resilient, distributed infrastructure on AWS, Azure, GCP, container clusters, and serverless stacks.', iconName: 'Cloud', displayOrder: 3 },
  { name: 'Web Development', slug: 'web-development', description: 'Full-stack engineering, modern reactive user interfaces, RESTful microservices, and web performance.', iconName: 'Globe', displayOrder: 4 },
  { name: 'Data Science', slug: 'data-science', description: 'Exploratory data analysis, statistical inference, quantitative visualization, and predictive pipelines.', iconName: 'BarChart2', displayOrder: 5 },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Threat modeling, network perimeter defense, cryptographic primitives, and secure application design.', iconName: 'ShieldCheck', displayOrder: 6 },
  { name: 'Programming', slug: 'programming', description: 'Core programming languages, idiomatic paradigms, memory models, and systems engineering.', iconName: 'Code', displayOrder: 7 },
  { name: 'DevOps', slug: 'devops', description: 'Continuous integration, delivery automation, infrastructure as code, container orchestration, and telemetry.', iconName: 'Workflow', displayOrder: 8 },
  { name: 'Databases', slug: 'databases', description: 'Relational schemas, SQL query optimization, transaction isolation, indexing strategies, and distributed NoSQL.', iconName: 'Database', displayOrder: 9 },
  { name: 'Software Engineering', slug: 'software-engineering', description: 'System design, modular software architecture, testing strategies, refactoring, and team collaboration.', iconName: 'Cpu', displayOrder: 10 },
  { name: 'Interview Preparation', slug: 'interview-preparation', description: 'Algorithmic problem solving, behavioral interview strategies, and architectural mock challenges.', iconName: 'CheckCircle2', displayOrder: 11 },
];

export const coursesSeedData = [
  {
    title: 'Foundations of Artificial Intelligence',
    slug: 'foundations-of-artificial-intelligence',
    shortDescription: 'Master state-space search, heuristic evaluation, constraint satisfaction, and intelligent game trees.',
    description: 'This rigorous course introduces classical and modern artificial intelligence principles. Students analyze uninformed and informed search algorithms (A* search, minimax with alpha-beta pruning), constraint satisfaction problems, and foundational knowledge representations used in autonomous problem solving.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    category: 'Artificial Intelligence',
    instructor: {
      name: 'Dr. Evelyn Vance',
      title: 'Professor of Computer Science & AI Systems',
      bio: 'Dr. Vance holds a Ph.D. in Computer Science with over 15 years of academic and applied AI research experience.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '10 hours',
    skills: ['A* Search', 'State-Space Heuristics', 'Minimax', 'Constraint Satisfaction', 'Knowledge Graphs'],
    prerequisites: ['Discrete Mathematics', 'Basic Data Structures'],
    learningObjectives: [
      'Formulate real-world problems as formal state-space search models',
      'Implement and evaluate optimal heuristic functions for A* search',
      'Apply minimax search with alpha-beta pruning to adversarial games',
      'Analyze constraint satisfaction problems and backtracking search',
    ],
    modules: [
      { order: 1, title: 'State-Space Search and Heuristics', description: 'Formulating agent goals and optimal heuristic evaluation.' },
      { order: 2, title: 'Adversarial Games & Constraint Satisfaction', description: 'Minimax search, pruning techniques, and constraint networks.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Introduction to Intelligent Agents & State Spaces',
        description: 'Understand agent architectures, environments, and formal state space definitions.',
        youtubeVideoId: 'J8Eh7RqggsU',
        durationMinutes: 24,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'Uninformed Search: BFS, DFS, and Uniform Cost',
        description: 'Detailed analysis of breadth-first, depth-first, and uniform-cost search traversal.',
        youtubeVideoId: 'b0lXW1i3qI8',
        durationMinutes: 32,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'Informed Search & The A* Algorithm',
        description: 'Heuristic design, admissibility, consistency, and time complexity proofs for A*.',
        youtubeVideoId: '6TsL9655eE0',
        durationMinutes: 38,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Adversarial Search: Minimax and Alpha-Beta Pruning',
        description: 'Game tree analysis, optimal decisions in zero-sum games, and pruning efficiency.',
        youtubeVideoId: 'l-hh51ncgDI',
        durationMinutes: 40,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Artificial Intelligence Foundations Exam',
      instructions: 'Select the optimal answer for each question regarding search, heuristics, and game trees.',
      passThreshold: 75,
      questions: [
        {
          id: 'ai-q1',
          questionText: 'What mathematical property ensures that an A* search heuristic h(n) never overestimates the actual cost to reach the goal?',
          type: 'multiple-choice',
          options: ['Consistency', 'Admissibility', 'Completeness', 'Monotonicity'],
          correctAnswers: [1],
          explanation: 'An admissible heuristic h(n) is one that never overestimates the true cost to reach the goal, guaranteeing optimality in tree search.',
          points: 1,
        },
        {
          id: 'ai-q2',
          questionText: 'In alpha-beta pruning, what does the parameter alpha represent at a MAX node?',
          type: 'multiple-choice',
          options: [
            'The minimum score that the minimizing player is assured of',
            'The highest-value choice found so far at any choice point along the path for MAX',
            'The current depth limit of the minimax recursive tree',
            'The branch factor heuristic evaluation',
          ],
          correctAnswers: [1],
          explanation: 'Alpha is the value of the best (highest-value) choice found so far at any choice point along the path for the MAX player.',
          points: 1,
        },
        {
          id: 'ai-q3',
          questionText: 'True or False: If a heuristic is consistent (monotonic), it is also guaranteed to be admissible.',
          type: 'true-false',
          options: ['True', 'False'],
          correctAnswers: [0],
          explanation: 'Consistency implies admissibility via the triangle inequality (h(n) <= c(n, a, n\') + h(n\')).',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: true,
    enrolledCount: 1420,
    ratingAvg: 4.85,
    ratingCount: 194,
  },
  {
    title: 'Machine Learning from Scratch with Python',
    slug: 'machine-learning-from-scratch-with-python',
    shortDescription: 'Implement linear regression, logistic classification, decision trees, and validation pipelines using NumPy.',
    description: 'Build an intuitive and mathematical foundation for modern machine learning. Rather than treating ML libraries as black boxes, you will derive gradient descent, vector calculus for loss surfaces, regularization, and model validation techniques from foundational principles.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
    category: 'Machine Learning',
    instructor: {
      name: 'Marcus Chen',
      title: 'Principal ML Engineer & Author',
      bio: 'Marcus has deployed production predictive systems for fintech and open-source scientific computing libraries.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '14 hours',
    skills: ['NumPy Vectorization', 'Gradient Descent', 'Loss Functions', 'Regularization (L1/L2)', 'Cross-Validation'],
    prerequisites: ['Python Fundamentals', 'Basic Linear Algebra'],
    learningObjectives: [
      'Derive and vectorize the mean squared error loss and gradient equations',
      'Implement batch, stochastic, and mini-batch gradient descent algorithms',
      'Construct a logistic regression classifier with cross-entropy loss',
      'Diagnose bias vs variance using training and validation learning curves',
    ],
    modules: [
      { order: 1, title: 'Parametric Regression Models', description: 'Loss minimization, closed form normal equations, and iterative optimization.' },
      { order: 2, title: 'Classification & Model Diagnosis', description: 'Logistic regression, decision boundaries, and overfitting prevention.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Supervised Learning Framework & Cost Surfaces',
        description: 'Mathematical formulation of hypotheses, parameter spaces, and objective functions.',
        youtubeVideoId: 'i_LwzRVP7bg',
        durationMinutes: 28,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'Vectorized Gradient Descent Implementation',
        description: 'Writing fast vector operations in NumPy without nested loops.',
        youtubeVideoId: '4b4MUYve_U8',
        durationMinutes: 35,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Binary Logistic Regression and Sigmoid Actuation',
        description: 'Probability calibration, log-likelihood, and gradient derivation.',
        youtubeVideoId: 'yIYKR4sgzI8',
        durationMinutes: 30,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Machine Learning Theory Check',
      instructions: 'Answer questions assessing your understanding of gradients, loss functions, and regularization.',
      passThreshold: 70,
      questions: [
        {
          id: 'ml-q1',
          questionText: 'What effect does increasing the L2 regularization hyperparameter (lambda) have on model parameters?',
          type: 'multiple-choice',
          options: [
            'Drives non-informative feature weights strictly to exact zero',
            'Shrinks weight coefficients towards zero, reducing variance and mitigating overfitting',
            'Increases model capacity and increases risk of overfitting',
            'Has no effect on model variance',
          ],
          correctAnswers: [1],
          explanation: 'L2 regularization (Ridge) penalizes large squared weights, shrinking parameters toward zero to control model variance.',
          points: 1,
        },
        {
          id: 'ml-q2',
          questionText: 'Which metric is best suited for evaluating a classifier on an imbalanced dataset with 99% negative cases?',
          type: 'multiple-choice',
          options: ['Raw Accuracy', 'Precision-Recall AUC / F1-Score', 'Mean Squared Error', 'Adjusted R-Squared'],
          correctAnswers: [1],
          explanation: 'On highly imbalanced datasets, raw accuracy is deceptive. Precision, Recall, and the F1-Score reflect performance on minority classes.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Compute Mean Squared Error',
        problemStatement: 'Write a JavaScript function `solution(actual, predicted)` that takes two arrays of equal length and returns the Mean Squared Error rounded to 4 decimal places.',
        difficulty: 'Easy',
        topicTags: ['Machine Learning', 'Math', 'Arrays'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(actual, predicted) {\n  // Calculate MSE: sum((actual - predicted)^2) / n\n  let sum = 0;\n  for (let i = 0; i < actual.length; i++) {\n    sum += Math.pow(actual[i] - predicted[i], 2);\n  }\n  return parseFloat((sum / actual.length).toFixed(4));\n}`,
          python: `def solution(actual, predicted):\n  # Calculate MSE\n  total = sum((a - p) ** 2 for a, p in zip(actual, predicted))\n  return round(total / len(actual), 4)`,
        },
        inputFormat: 'actual (number[]), predicted (number[])',
        outputFormat: 'number (MSE rounded to 4 decimals)',
        sampleTestCases: [
          { input: '[[1, 2, 3], [1, 2, 3]]', expectedOutput: '0', explanation: 'Predictions match actuals exactly.' },
          { input: '[[1, 2, 3], [2, 3, 4]]', expectedOutput: '1', explanation: 'Each difference is 1, 1^2 = 1, average = 1.' },
        ],
        hiddenTestCases: [
          { input: '[[10, 20, 30], [12, 18, 33]]', expectedOutput: '5.6667' },
          { input: '[[0, 0, 0], [1, 1, 1]]', expectedOutput: '1' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 70,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: false,
    enrolledCount: 1890,
    ratingAvg: 4.9,
    ratingCount: 310,
  },
  {
    title: 'Cloud Architecture & Distributed Systems on AWS',
    slug: 'cloud-architecture-and-distributed-systems-on-aws',
    shortDescription: 'Design highly available, fault-tolerant, and secure cloud infrastructures using core AWS services.',
    description: 'Learn to design resilient enterprise systems on Amazon Web Services. This course covers Virtual Private Clouds (VPC), subnet segmentation, auto-scaling compute fleets, managed relational and NoSQL databases, IAM security perimeters, and asynchronous messaging architectures.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    category: 'Cloud Computing',
    instructor: {
      name: 'Sarah Jenkins',
      title: 'AWS Certified Solutions Architect & Cloud Strategist',
      bio: 'Sarah has led cloud migration initiatives for Fortune 500 financial institutions for more than a decade.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '12 hours',
    skills: ['AWS VPC', 'IAM Policies', 'EC2 & Auto Scaling', 'RDS Multi-AZ', 'S3 Architecture', 'SQS/SNS Messaging'],
    prerequisites: ['Basic Networking Concepts', 'Linux CLI'],
    learningObjectives: [
      'Design multi-AZ VPC topologies with public, private, and isolated subnets',
      'Implement least-privilege IAM policies and cross-account role assumption',
      'Architect decoupled event-driven systems using SQS queues and SNS topics',
      'Optimize database failover configurations with RDS Multi-AZ deployments',
    ],
    modules: [
      { order: 1, title: 'Network Isolation and Compute', description: 'VPCs, security groups, network ACLs, and Auto Scaling groups.' },
      { order: 2, title: 'Data Persistence and Messaging', description: 'S3 storage tiers, RDS failover, and decoupled asynchronous messaging.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Virtual Private Cloud (VPC) Deep Dive',
        description: 'CIDR block allocation, route tables, internet gateways, and NAT gateways.',
        youtubeVideoId: 'g2JOHLHh4rI',
        durationMinutes: 34,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'Elastic Compute & Elastic Load Balancing',
        description: 'Configuring application load balancers, health checks, and target groups.',
        youtubeVideoId: 'S33k43463wM',
        durationMinutes: 30,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Decoupled Architectures with SQS and SNS',
        description: 'Dead-letter queues, fanout messaging patterns, and backpressure handling.',
        youtubeVideoId: 'mXca49_eXqI',
        durationMinutes: 28,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Cloud Architecture Verification Quiz',
      instructions: 'Test your architectural understanding of high availability, security groups, and storage tiering.',
      passThreshold: 75,
      questions: [
        {
          id: 'cloud-q1',
          questionText: 'What is the key functional difference between a Security Group and a Network ACL in AWS VPC?',
          type: 'multiple-choice',
          options: [
            'Security Groups are stateless while Network ACLs are stateful',
            'Security Groups are stateful and operate at the ENI level; Network ACLs are stateless and operate at the subnet boundary',
            'Network ACLs only support allow rules while Security Groups support deny rules',
            'Security Groups require an Internet Gateway to function',
          ],
          correctAnswers: [1],
          explanation: 'Security groups are stateful (inbound return traffic is automatically allowed) at the instance/ENI level, while NACLs are stateless at the subnet level.',
          points: 1,
        },
        {
          id: 'cloud-q2',
          questionText: 'Which S3 storage tier is most cost-effective for archival records accessed less than once a year with retrieval times of several hours?',
          type: 'multiple-choice',
          options: ['S3 Standard', 'S3 One Zone-IA', 'S3 Glacier Deep Archive', 'S3 Intelligent-Tiering'],
          correctAnswers: [2],
          explanation: 'S3 Glacier Deep Archive provides the lowest storage cost in AWS for long-term retention with 12 to 48 hour retrieval windows.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: false,
    enrolledCount: 1650,
    ratingAvg: 4.88,
    ratingCount: 220,
  },
  {
    title: 'Modern Full-Stack Engineering with MERN',
    slug: 'modern-full-stack-engineering-with-mern',
    shortDescription: 'Build end-to-end web applications with React, Node.js, Express, and MongoDB using TypeScript.',
    description: 'A comprehensive, project-driven course guiding you through building robust, enterprise-grade full-stack web platforms. Master TypeScript across client and server, JWT authentication with HTTP-only cookies, TanStack Query server-state caching, and MongoDB aggregation pipelines.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    category: 'Web Development',
    instructor: {
      name: 'Alex Rivera',
      title: 'Senior Staff Full-Stack Architect',
      bio: 'Alex has designed web architectures supporting millions of monthly active users and mentors aspiring software engineers.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '18 hours',
    skills: ['React 18', 'TypeScript', 'Express.js', 'MongoDB/Mongoose', 'TanStack Query', 'RESTful Design', 'JWT Security'],
    prerequisites: ['HTML/CSS', 'Modern JavaScript (ES6+)'],
    learningObjectives: [
      'Structure clean decoupled client-server TypeScript repositories',
      'Implement robust authentication workflows using secure HTTP-only cookies',
      'Optimize database queries using MongoDB compound indexes and aggregation pipelines',
      'Manage asynchronous server state and caching with TanStack Query',
    ],
    modules: [
      { order: 1, title: 'Backend REST API Architecture', description: 'Express middleware, MongoDB schemas, and validation.' },
      { order: 2, title: 'Frontend Architecture and Server State', description: 'React routing, typed API services, and caching.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'RESTful API Foundations & Express Routing',
        description: 'Constructing structured controllers, middleware pipelines, and error boundaries.',
        youtubeVideoId: '7CqJlxBYj-M',
        durationMinutes: 42,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'Mongoose Data Modeling & Indexing Strategies',
        description: 'Schema constraints, foreign references, compound indexing, and validation.',
        youtubeVideoId: 'DZBGEExL2KU',
        durationMinutes: 38,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'React Component Hierarchy & Custom Hooks',
        description: 'Composing presentation components, lifting state, and writing clean hooks.',
        youtubeVideoId: 'bMknfKXIFA8',
        durationMinutes: 45,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Full-Stack Engineering Assessment',
      instructions: 'Validate your understanding of REST architecture, JWT security, and state management.',
      passThreshold: 75,
      questions: [
        {
          id: 'mern-q1',
          questionText: 'Why is storing authentication JWTs in HTTP-only cookies generally safer than browser localStorage?',
          type: 'multiple-choice',
          options: [
            'HTTP-only cookies are immune to Cross-Site Scripting (XSS) script access',
            'HTTP-only cookies have unlimited storage capacity',
            'localStorage cannot send cookies across HTTP requests',
            'HTTP-only cookies do not expire',
          ],
          correctAnswers: [0],
          explanation: 'JavaScript executed via XSS cannot read HTTP-only cookies, safeguarding tokens from malicious script exfiltration.',
          points: 1,
        },
        {
          id: 'mern-q2',
          questionText: 'Which HTTP method should be used for operations that are idempotent and update an entire resource representation?',
          type: 'multiple-choice',
          options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
          correctAnswers: [1],
          explanation: 'PUT is defined as idempotent and replaces the target resource with the uploaded payload.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Parse Query String Parameters',
        problemStatement: 'Implement a function `solution(queryString)` that parses a URL query string (without the leading "?") into an object mapping parameter keys to values.',
        difficulty: 'Easy',
        topicTags: ['Web Development', 'Strings', 'Objects'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(queryString) {\n  if (!queryString) return {};\n  const params = {};\n  const pairs = queryString.split('&');\n  for (const pair of pairs) {\n    const [key, val] = pair.split('=');\n    if (key) params[decodeURIComponent(key)] = decodeURIComponent(val || '');\n  }\n  return params;\n}`,
          python: `def solution(queryString):\n  if not queryString:\n    return {}\n  res = {}\n  for item in queryString.split('&'):\n    parts = item.split('=')\n    res[parts[0]] = parts[1] if len(parts) > 1 else ''\n  return res`,
        },
        inputFormat: 'queryString (string)',
        outputFormat: 'object (key-value mapping)',
        sampleTestCases: [
          { input: '"page=1&limit=10"', expectedOutput: '{"page":"1","limit":"10"}', explanation: 'Basic query pairs.' },
          { input: '"q=react&category=web"', expectedOutput: '{"q":"react","category":"web"}', explanation: 'Two query params.' },
        ],
        hiddenTestCases: [
          { input: '""', expectedOutput: '{}' },
          { input: '"sort=newest"', expectedOutput: '{"sort":"newest"}' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: true,
    enrolledCount: 2310,
    ratingAvg: 4.92,
    ratingCount: 380,
  },
  {
    title: 'React 18 & Design System Architecture',
    slug: 'react-18-and-design-system-architecture',
    shortDescription: 'Master modern React patterns, concurrent rendering, compound components, and scalable design systems.',
    description: 'Move beyond basic React tutorials to learn real-world architecture. Master concurrent features like useTransition and Suspense, custom headless hook compositions, accessible compound component design, and performance profiling.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    category: 'Web Development',
    instructor: {
      name: 'Elena Rostova',
      title: 'Principal Frontend Engineer',
      bio: 'Elena maintains popular UI libraries and leads design engineering teams in building accessible component systems.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '12 hours',
    skills: ['React 18', 'Component Patterns', 'Context Optimization', 'ARIA Accessibility', 'Vite', 'Tailwind CSS'],
    prerequisites: ['JavaScript ES6+', 'Basic React knowledge'],
    learningObjectives: [
      'Implement compound component patterns with internal context communication',
      'Optimize re-renders using memoization, callback stability, and state collocation',
      'Build fully accessible keyboard-navigable components adhering to WAI-ARIA standards',
      'Leverage React 18 Transitions for responsive user experiences under heavy UI computation',
    ],
    modules: [
      { order: 1, title: 'Advanced Component Patterns', description: 'Headless hooks, compound components, and render props.' },
      { order: 2, title: 'Performance and Accessibility', description: 'Profiler inspection, keyboard navigation, and ARIA attributes.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Compound Components & Context Optimization',
        description: 'Designing flexible APIs that share implicit state without prop drilling.',
        youtubeVideoId: 'hQAHSlTtcmY',
        durationMinutes: 32,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Accessibility (a11y) & Focus Trapping',
        description: 'Implementing modal dialog focus traps, tab sequences, and ARIA roles.',
        youtubeVideoId: 'z8xUCzToFQ8',
        durationMinutes: 28,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'React Architecture Quiz',
      instructions: 'Demonstrate your mastery of component lifecycles, hook rules, and accessibility.',
      passThreshold: 75,
      questions: [
        {
          id: 'react-q1',
          questionText: 'What is the primary objective of React 18\'s useTransition hook?',
          type: 'multiple-choice',
          options: [
            'To trigger CSS animations between route transitions',
            'To mark state updates as non-urgent transitions, keeping the UI responsive to user input',
            'To replace the useEffect hook for asynchronous data fetching',
            'To automatically persist component state to IndexedDB',
          ],
          correctAnswers: [1],
          explanation: 'useTransition allows developers to mark state transitions as non-blocking, so critical inputs remain immediately interactive.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Class Name Combiner Utility',
        problemStatement: 'Implement a utility function `solution(...classes)` that takes any number of class arguments (strings, null, undefined, or false) and returns a clean, space-separated string of truthy class names.',
        difficulty: 'Easy',
        topicTags: ['React', 'Web Development', 'Utilities'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(...classes) {\n  return classes.filter(Boolean).join(' ');\n}`,
          python: `def solution(*classes):\n  return ' '.join([c for c in classes if c])`,
        },
        inputFormat: 'arguments list of strings/falsy values',
        outputFormat: 'string of joined class names',
        sampleTestCases: [
          { input: '["btn", "btn-primary", null, "active"]', expectedOutput: '"btn btn-primary active"', explanation: 'Null is filtered out.' },
          { input: '["card", false, "shadow-md"]', expectedOutput: '"card shadow-md"', explanation: 'False is filtered out.' },
        ],
        hiddenTestCases: [
          { input: '["a", "b", "c"]', expectedOutput: '"a b c"' },
          { input: '["", null, false]', expectedOutput: '""' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: true,
    enrolledCount: 1410,
    ratingAvg: 4.87,
    ratingCount: 185,
  },
  {
    title: 'Node.js Microservices & Distributed APIs',
    slug: 'nodejs-microservices-and-distributed-apis',
    shortDescription: 'Architect resilient event-driven microservices, message queues, and API gateways in Node.js.',
    description: 'Learn the architectural patterns required for high-throughput backend services. Topics include asynchronous event-loop mechanics, worker threads, stream processing, distributed tracing, API gateway rate limiting, and inter-service messaging.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'Web Development',
    instructor: {
      name: 'Tariq Mansoor',
      title: 'Distributed Systems Architect',
      bio: 'Tariq specializes in Node.js performance tuning and high-load payment processing infrastructure.',
    },
    skillLevel: 'Advanced',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '15 hours',
    skills: ['Node.js Event Loop', 'Worker Threads', 'Stream Pipelines', 'Message Brokering', 'Circuit Breakers'],
    prerequisites: ['Intermediate Node.js', 'Asynchronous Programming'],
    learningObjectives: [
      'Analyze and profile Node.js libuv event loop phases and microtask queues',
      'Process multi-gigabyte datasets without memory leaks using Node.js stream pipelines',
      'Implement circuit breaker patterns to prevent cascading failures across services',
    ],
    modules: [
      { order: 1, title: 'Event Loop Internals and Streams', description: 'Libuv, timers, poll phase, backpressure, and transform streams.' },
      { order: 2, title: 'Resilience and Fault Tolerance', description: 'Circuit breakers, retry policies with exponential backoff.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Deep Dive: The Node.js Event Loop & Microtasks',
        description: 'Examine nextTick, promises, timers, I/O polling, and setImmediate execution orders.',
        youtubeVideoId: 'PNa9OMajw9w',
        durationMinutes: 36,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'High-Volume Stream Pipelines & Backpressure',
        description: 'Writing custom readable, writable, and transform streams with pipeline error handling.',
        youtubeVideoId: 'Glyb3qSD1P4',
        durationMinutes: 34,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Node.js Internals Evaluation',
      instructions: 'Answer questions regarding the event loop phases and stream backpressure mechanics.',
      passThreshold: 80,
      questions: [
        {
          id: 'node-q1',
          questionText: 'In which event loop phase are process.nextTick callbacks executed?',
          type: 'multiple-choice',
          options: [
            'Immediately after the current operation finishes, before returning to the event loop',
            'During the Poll phase',
            'Exclusively in the Check phase alongside setImmediate',
            'In the Close callbacks phase',
          ],
          correctAnswers: [0],
          explanation: 'process.nextTick is processed immediately after the current operation completes, prior to continuing the event loop phases.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Calculate Exponential Backoff',
        problemStatement: 'Write a function `solution(attempt, baseDelayMs, maxDelayMs)` that calculates the delay for a given retry attempt using the formula: min(maxDelayMs, baseDelayMs * 2^attempt).',
        difficulty: 'Easy',
        topicTags: ['Node.js', 'Algorithms', 'Resilience'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(attempt, baseDelayMs, maxDelayMs) {\n  const delay = baseDelayMs * Math.pow(2, attempt);\n  return Math.min(maxDelayMs, delay);\n}`,
          python: `def solution(attempt, baseDelayMs, maxDelayMs):\n  return min(maxDelayMs, baseDelayMs * (2 ** attempt))`,
        },
        inputFormat: 'attempt (number), baseDelayMs (number), maxDelayMs (number)',
        outputFormat: 'number (calculated delay in ms)',
        sampleTestCases: [
          { input: '[0, 100, 1000]', expectedOutput: '100', explanation: '100 * 2^0 = 100' },
          { input: '[3, 100, 1000]', expectedOutput: '800', explanation: '100 * 2^3 = 800' },
          { input: '[5, 100, 1000]', expectedOutput: '1000', explanation: '100 * 32 = 3200 capped at 1000' },
        ],
        hiddenTestCases: [
          { input: '[2, 50, 500]', expectedOutput: '200' },
          { input: '[10, 100, 5000]', expectedOutput: '5000' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 80,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 980,
    ratingAvg: 4.81,
    ratingCount: 112,
  },
  {
    title: 'Python for Systems & Scientific Computing',
    slug: 'python-for-systems-and-scientific-computing',
    shortDescription: 'Master idiomatic Python, generator pipelines, concurrency with asyncio, and data processing.',
    description: 'Learn modern, clean Python 3. Focus on object data models, dunder protocols, memory optimization via slots and generators, multi-process pools, and asynchronous event loops with asyncio.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
    category: 'Programming',
    instructor: {
      name: 'Guillermo Haas',
      title: 'Python Core Contributor & Systems Engineer',
      bio: 'Guillermo has developed high-performance Python runtime utilities and data processing libraries.',
    },
    skillLevel: 'Beginner',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '10 hours',
    skills: ['Python 3', 'Generators & Iterators', 'Asyncio', 'Context Managers', 'Type Annotations'],
    prerequisites: ['Basic computer literacy'],
    learningObjectives: [
      'Write idiomatic Python leveraging list/dict comprehensions and generators',
      'Implement custom context managers using __enter__ and __exit__ protocols',
      'Construct concurrent network scrapers and tasks using asyncio and aiohttp',
    ],
    modules: [
      { order: 1, title: 'Pythonic Language Protocols', description: 'Dunder methods, iterators, and generator pipelines.' },
      { order: 2, title: 'Asynchronous Programming with Asyncio', description: 'Coroutines, event loops, tasks, and concurrency.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Iterators, Generators & Memory Efficiency',
        description: 'Yield expressions, lazy evaluation, and pipeline data streaming.',
        youtubeVideoId: 'bD05uGo_sVI',
        durationMinutes: 30,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Mastering Asyncio & Coroutines in Python',
        description: 'Asynchronous task gathering, non-blocking I/O, and cancellation semantics.',
        youtubeVideoId: 't5Bo1Je9EmE',
        durationMinutes: 35,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Python Fundamentals & Data Model',
      instructions: 'Assess your comprehension of Python datatypes, generators, and variable scopes.',
      passThreshold: 70,
      questions: [
        {
          id: 'py-q1',
          questionText: 'What is the primary benefit of using a generator expression instead of a list comprehension for large data streams?',
          type: 'multiple-choice',
          options: [
            'Generators compute values lazily on demand, using constant memory O(1) instead of allocating full lists in RAM',
            'Generators are automatically executed across multiple CPU cores',
            'Generators allow indexing elements directly like a list',
            'Generators are immutable dictionary keys',
          ],
          correctAnswers: [0],
          explanation: 'Generators yield one item at a time, preventing memory exhaustion when iterating over massive data sequences.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Validate Palindrome String',
        problemStatement: 'Write a function `solution(s)` that determines if an alphanumeric string is a palindrome, ignoring non-alphanumeric characters and letter casing.',
        difficulty: 'Easy',
        topicTags: ['Python', 'Strings', 'Algorithms'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}`,
          python: `def solution(s):\n  clean = ''.join(c.lower() for c in s if c.isalnum())\n  return clean == clean[::-1]`,
        },
        inputFormat: 's (string)',
        outputFormat: 'boolean (true if palindrome, false otherwise)',
        sampleTestCases: [
          { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', explanation: 'Ignores spaces and punctuation.' },
          { input: '"race a car"', expectedOutput: 'false', explanation: 'Not a palindrome.' },
        ],
        hiddenTestCases: [
          { input: '"Was it a car or a cat I saw?"', expectedOutput: 'true' },
          { input: '"hello"', expectedOutput: 'false' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 70,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1720,
    ratingAvg: 4.84,
    ratingCount: 205,
  },
  {
    title: 'Enterprise Java & Spring Boot Microservices',
    slug: 'enterprise-java-and-spring-boot-microservices',
    shortDescription: 'Build scalable backend services using Java 21, Spring Boot 3, Hibernate JPA, and container deployment.',
    description: 'Master the backbone of enterprise software engineering. You will learn modern Java features (Virtual Threads, Pattern Matching, Records), Spring Dependency Injection, Spring Data JPA with query optimization, Spring Security 6 with OAuth2/JWT, and containerized deployment.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    category: 'Programming',
    instructor: {
      name: 'Christian Meyer',
      title: 'Principal Enterprise Architect',
      bio: 'Christian has architected critical Java banking backbones and regularly speaks at international software conferences.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '16 hours',
    skills: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'Hibernate', 'Virtual Threads (Project Loom)', 'RESTful APIs'],
    prerequisites: ['Object-Oriented Programming Fundamentals'],
    learningObjectives: [
      'Utilize Java 21 modern language capabilities including records and virtual threads',
      'Build modular, production-ready REST APIs using Spring Boot 3 starter suites',
      'Formulate efficient Spring Data JPA queries avoiding N+1 query performance traps',
    ],
    modules: [
      { order: 1, title: 'Modern Java and Core Spring Boot', description: 'Java 21 language features, IoC container, and REST controllers.' },
      { order: 2, title: 'Data Access and Concurrency', description: 'Hibernate JPA relationships, transaction boundaries, and virtual threads.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Spring Framework Dependency Injection & Inversion of Control',
        description: 'Bean lifecycles, configuration classes, component scanning, and application contexts.',
        youtubeVideoId: '31KTdfz6351',
        durationMinutes: 38,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Spring Data JPA & Hibernate Query Optimization',
        description: 'Entity mappings, FetchType.LAZY mechanics, and resolving the N+1 problem.',
        youtubeVideoId: '8SGI_XS5OPw',
        durationMinutes: 44,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Enterprise Java & Spring Boot Exam',
      instructions: 'Demonstrate your knowledge of Spring bean scopes, transaction isolation, and JPA relationships.',
      passThreshold: 75,
      questions: [
        {
          id: 'java-q1',
          questionText: 'What is the default bean scope in the Spring Framework IoC container?',
          type: 'multiple-choice',
          options: ['Prototype', 'Singleton', 'Request', 'Session'],
          correctAnswers: [1],
          explanation: 'By default, all beans created in a Spring ApplicationContext are singletons (one shared instance per container).',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1150,
    ratingAvg: 4.82,
    ratingCount: 130,
  },
  {
    title: 'Practical Data Science & Statistical Analysis',
    slug: 'practical-data-science-and-statistical-analysis',
    shortDescription: 'Analyze complex datasets using Pandas, exploratory data analysis, hypothesis testing, and storytelling.',
    description: 'Transform raw data into actionable quantitative intelligence. Learn data wrangling with Pandas, missing value imputation strategies, statistical hypothesis testing (t-tests, ANOVA, chi-square), and clean data storytelling with Matplotlib and Seaborn.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    category: 'Data Science',
    instructor: {
      name: 'Dr. Priya Sharma',
      title: 'Chief Data Scientist',
      bio: 'Dr. Sharma leads analytical research in healthcare informatics and statistical decision support systems.',
    },
    skillLevel: 'Beginner',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '11 hours',
    skills: ['Pandas', 'Data Cleaning', 'Hypothesis Testing', 'Correlation vs Causation', 'Seaborn Visualizations'],
    prerequisites: ['Basic Python syntax'],
    learningObjectives: [
      'Clean and normalize messy tabular datasets with Pandas',
      'Formulate and execute rigorous statistical hypothesis tests (p-values, confidence intervals)',
      'Produce clear, accessible visualizations adhering to quantitative design guidelines',
    ],
    modules: [
      { order: 1, title: 'Data Cleaning and Exploratory Analysis', description: 'Pandas transformations, aggregation, and outlier detection.' },
      { order: 2, title: 'Inference and Statistical Testing', description: 'Normal distribution, p-values, and hypothesis validation.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Exploratory Data Analysis with Pandas',
        description: 'Filtering, grouping, pivoting, and handling missing values with Pandas.',
        youtubeVideoId: 'vmEHCJofslg',
        durationMinutes: 34,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Statistical Hypothesis Testing Explained',
        description: 'Null hypothesis, significance levels, type I and II errors, and two-sample testing.',
        youtubeVideoId: '0oc49DyA3hU',
        durationMinutes: 30,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Statistical Literacy & Data Science Quiz',
      instructions: 'Validate your understanding of statistical significance, distributions, and data cleaning.',
      passThreshold: 75,
      questions: [
        {
          id: 'ds-q1',
          questionText: 'In hypothesis testing, what does a p-value less than alpha (e.g., 0.05) indicate?',
          type: 'multiple-choice',
          options: [
            'There is a 95% probability that the null hypothesis is true',
            'The observed effect is statistically significant enough to reject the null hypothesis',
            'The experimental sample size was too small',
            'The data is strictly normal in distribution',
          ],
          correctAnswers: [1],
          explanation: 'When p < 0.05, the probability of observing the data given that the null hypothesis is true is very low, warranting rejection of the null.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Calculate Median of Array',
        problemStatement: 'Write a function `solution(numbers)` that calculates and returns the median of an array of numbers.',
        difficulty: 'Easy',
        topicTags: ['Data Science', 'Statistics', 'Math'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(numbers) {\n  if (!numbers || numbers.length === 0) return 0;\n  const sorted = [...numbers].sort((a, b) => a - b);\n  const mid = Math.floor(sorted.length / 2);\n  if (sorted.length % 2 !== 0) {\n    return sorted[mid];\n  }\n  return (sorted[mid - 1] + sorted[mid]) / 2;\n}`,
          python: `def solution(numbers):\n  if not numbers:\n    return 0\n  s = sorted(numbers)\n  n = len(s)\n  mid = n // 2\n  return s[mid] if n % 2 != 0 else (s[mid - 1] + s[mid]) / 2`,
        },
        inputFormat: 'numbers (number[])',
        outputFormat: 'number (median value)',
        sampleTestCases: [
          { input: '[3, 1, 2]', expectedOutput: '2', explanation: 'Sorted is [1, 2, 3], middle is 2.' },
          { input: '[4, 1, 3, 2]', expectedOutput: '2.5', explanation: 'Sorted is [1, 2, 3, 4], middle is (2 + 3) / 2 = 2.5.' },
        ],
        hiddenTestCases: [
          { input: '[10]', expectedOutput: '10' },
          { input: '[5, 15, 20, 10]', expectedOutput: '12.5' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1330,
    ratingAvg: 4.86,
    ratingCount: 160,
  },
  {
    title: 'Advanced SQL & Relational Database Design',
    slug: 'advanced-sql-and-relational-database-design',
    shortDescription: 'Master relational normal forms, complex JOINs, Window functions, indexing strategies, and ACID transactions.',
    description: 'Become proficient in designing and querying relational database management systems. Learn relational algebra, B-Tree and Hash indexing mechanics, query execution plan analysis (EXPLAIN ANALYZE), window analytical functions, and transaction isolation levels.',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    category: 'Databases',
    instructor: {
      name: 'Daniel Ortega',
      title: 'Principal Database Architect',
      bio: 'Daniel manages multi-terabyte PostgreSQL and MySQL database clusters for critical financial institutions.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '13 hours',
    skills: ['PostgreSQL', 'Window Functions', 'ACID Isolation', 'B-Tree Indexing', 'EXPLAIN ANALYZE', 'Schema Normalization'],
    prerequisites: ['Basic SQL SELECT statements'],
    learningObjectives: [
      'Write advanced analytical SQL queries utilizing OVER(), PARTITION BY, and RANK()',
      'Diagnose query bottlenecks by interpreting EXPLAIN query execution plans',
      'Design relational schemas normalized to 3rd Normal Form (3NF)',
      'Explain transaction concurrency anomalies including Dirty Reads and Non-Repeatable Reads',
    ],
    modules: [
      { order: 1, title: 'Schema Design and Analytical SQL', description: 'Normalization, CTEs, and window functions.' },
      { order: 2, title: 'Indexing, Execution Plans, and Transactions', description: 'B-Tree internals, EXPLAIN ANALYZE, and ACID isolation.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Analytical SQL: Window Functions in Depth',
        description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, and LEAD functions across partitions.',
        youtubeVideoId: 'Ww71knvhQ-s',
        durationMinutes: 38,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'PostgreSQL Indexing Internals & EXPLAIN Plans',
        description: 'How B-Tree indexes work, index scans vs sequential scans, and cost models.',
        youtubeVideoId: 'fsG1XaZEa78',
        durationMinutes: 40,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Database Architecture & SQL Quiz',
      instructions: 'Demonstrate your knowledge of transaction isolation levels, normalization, and window functions.',
      passThreshold: 75,
      questions: [
        {
          id: 'sql-q1',
          questionText: 'Under the SQL READ COMMITTED transaction isolation level, which of the following concurrency anomalies is prevented?',
          type: 'multiple-choice',
          options: ['Dirty Read', 'Non-repeatable Read', 'Phantom Read', 'Serialization Anomaly'],
          correctAnswers: [0],
          explanation: 'READ COMMITTED guarantees that transactions can only read data committed by other transactions, preventing Dirty Reads.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Find Second Highest Salary',
        problemStatement: 'Write a query or algorithm `solution(salaries)` that returns the second highest unique salary from an array of employee salary numbers. Return null if no second highest exists.',
        difficulty: 'Easy',
        topicTags: ['SQL', 'Databases', 'Algorithms'],
        supportedLanguages: ['javascript', 'python', 'sql'],
        starterCode: {
          javascript: `function solution(salaries) {\n  const unique = Array.from(new Set(salaries)).sort((a, b) => b - a);\n  return unique.length > 1 ? unique[1] : null;\n}`,
          python: `def solution(salaries):\n  u = sorted(list(set(salaries)), reverse=True)\n  return u[1] if len(u) > 1 else None`,
          sql: `SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;`,
        },
        inputFormat: 'salaries (number[])',
        outputFormat: 'number or null',
        sampleTestCases: [
          { input: '[100, 200, 300]', expectedOutput: '200', explanation: 'Highest is 300, second highest is 200.' },
          { input: '[100]', expectedOutput: 'null', explanation: 'Only one unique salary exists.' },
        ],
        hiddenTestCases: [
          { input: '[500, 500, 200, 100]', expectedOutput: '200' },
          { input: '[10, 20]', expectedOutput: '10' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1540,
    ratingAvg: 4.89,
    ratingCount: 215,
  },
  {
    title: 'Cybersecurity Fundamentals & Network Defense',
    slug: 'cybersecurity-fundamentals-and-network-defense',
    shortDescription: 'Understand security perimeters, symmetric/asymmetric cryptography, threat modeling, and OWASP Top 10.',
    description: 'Learn the defensive foundations of application and network cybersecurity. Explore symmetric AES and asymmetric RSA/ECC cryptography, TLS handshakes, threat modeling methodologies (STRIDE), and vulnerability remediation for the OWASP Top 10 web vulnerabilities.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: 'Cybersecurity',
    instructor: {
      name: 'Kenneth Wright',
      title: 'Certified Information Systems Security Professional (CISSP)',
      bio: 'Kenneth has conducted penetration tests and defensive threat assessments for governmental and corporate networks.',
    },
    skillLevel: 'Beginner',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '10 hours',
    skills: ['Cryptography Primitives', 'TLS/HTTPS Protocol', 'OWASP Top 10', 'Threat Modeling', 'Public Key Infrastructure'],
    prerequisites: ['Basic Computer Networking'],
    learningObjectives: [
      'Explain symmetric vs asymmetric encryption use cases and the hybrid TLS architecture',
      'Identify and remediate SQL injection, Cross-Site Scripting, and CSRF vulnerabilities',
      'Perform systematic threat modeling using the STRIDE framework',
    ],
    modules: [
      { order: 1, title: 'Applied Cryptography and Protocols', description: 'AES, RSA, hashing functions, HMAC, and digital certificates.' },
      { order: 2, title: 'Application Security and Defenses', description: 'OWASP Top 10, sanitization, and defense in depth.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Modern Cryptography: Symmetric vs Asymmetric',
        description: 'Mathematical foundations of key exchange, Diffie-Hellman, and public key verification.',
        youtubeVideoId: 'jhXCTbFnK8o',
        durationMinutes: 32,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'OWASP Top 10 Vulnerabilities & Remediation',
        description: 'Analyzing injection attacks, broken authentication, and security misconfigurations.',
        youtubeVideoId: 'U_P23dq_XQU',
        durationMinutes: 36,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Cybersecurity Principles Assessment',
      instructions: 'Demonstrate your understanding of cryptography, authentication, and web security defenses.',
      passThreshold: 80,
      questions: [
        {
          id: 'sec-q1',
          questionText: 'What is the primary role of a salt when hashing user passwords?',
          type: 'multiple-choice',
          options: [
            'To encrypt the password so the original text can be recovered by administrators',
            'To ensure identical passwords generate distinct hashes, defeating precomputed rainbow table attacks',
            'To compress the password hash to a smaller byte size',
            'To speed up hash computation during login verification',
          ],
          correctAnswers: [1],
          explanation: 'Salts add random data before hashing, ensuring precomputed rainbow tables cannot match duplicate passwords.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 80,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1610,
    ratingAvg: 4.88,
    ratingCount: 230,
  },
  {
    title: 'DevOps Engineering, CI/CD & Kubernetes',
    slug: 'devops-engineering-cicd-and-kubernetes',
    shortDescription: 'Automate build pipelines, containerize applications with Docker, and orchestrate deployments with Kubernetes.',
    description: 'Modern software teams release reliably through automated continuous integration and delivery. Master Docker containerization best practices, multi-stage builds, GitHub Actions CI/CD workflows, and container cluster orchestration using Kubernetes.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    category: 'DevOps',
    instructor: {
      name: 'Nadia Larsson',
      title: 'Staff Site Reliability Engineer',
      bio: 'Nadia oversees global Kubernetes deployments and automates infrastructure pipelines at scale.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '14 hours',
    skills: ['Docker Multi-Stage', 'Kubernetes Pods & Services', 'GitHub Actions CI/CD', 'Helm Charts', 'Zero-Downtime Deployments'],
    prerequisites: ['Linux CLI', 'Basic Git'],
    learningObjectives: [
      'Write optimized, minimal production Dockerfiles using multi-stage builds',
      'Construct automated GitHub Actions workflows for continuous integration and testing',
      'Deploy applications to Kubernetes using Deployments, Services, and Ingress controllers',
    ],
    modules: [
      { order: 1, title: 'Containerization with Docker', description: 'Container fundamentals, layers, volumes, and networks.' },
      { order: 2, title: 'Kubernetes Orchestration & CI/CD Pipelines', description: 'Pods, services, rolling updates, and GitHub Actions automation.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Docker Architecture & Multi-Stage Production Builds',
        description: 'Image layering, caching optimizations, non-root users, and small image sizes.',
        youtubeVideoId: 'fqMOX6JJhGo',
        durationMinutes: 38,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Kubernetes Architecture: Control Plane & Worker Nodes',
        description: 'kube-apiserver, etcd, kube-scheduler, kubelet, and declarative manifest workflows.',
        youtubeVideoId: 'X48VuDVv0do',
        durationMinutes: 44,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'DevOps & Container Orchestration Quiz',
      instructions: 'Test your understanding of containerization, image layers, and Kubernetes controllers.',
      passThreshold: 75,
      questions: [
        {
          id: 'devops-q1',
          questionText: 'What is the primary benefit of using multi-stage builds in a Dockerfile?',
          type: 'multiple-choice',
          options: [
            'Allows building images without a Docker daemon',
            'Keeps build tools and intermediary dependencies out of the final runtime image, minimizing size and attack surface',
            'Enables running multiple containers simultaneously inside one Docker image',
            'Bypasses Docker cache checks during build',
          ],
          correctAnswers: [1],
          explanation: 'Multi-stage builds allow compiling code in a heavy build stage and copying only the compiled artifacts into a lightweight final runtime image.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: false,
    enrolledCount: 1840,
    ratingAvg: 4.86,
    ratingCount: 260,
  },
  {
    title: 'Git & Professional GitHub Workflow Mastery',
    slug: 'git-and-professional-github-workflow-mastery',
    shortDescription: 'Master Git internals (objects, blobs, trees), interactive rebasing, merge strategies, and team branching.',
    description: 'Understand how Git actually works under the hood. Move past memorizing commands to understanding DAG (Directed Acyclic Graph) internals, object databases, detached HEAD states, interactive rebasing, merge conflict resolution, and pull request hygiene.',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=800&q=80',
    category: 'Software Engineering',
    instructor: {
      name: 'Samira Patel',
      title: 'Senior Developer Advocate & Open Source Maintainer',
      bio: 'Samira has trained thousands of software engineers in modern version control workflows and open-source contribution.',
    },
    skillLevel: 'Beginner',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '8 hours',
    skills: ['Git Internals', 'Interactive Rebase', 'Merge vs Rebase', 'Trunk-Based Development', 'Git Bisect'],
    prerequisites: ['Basic command line familiarity'],
    learningObjectives: [
      'Explain how Git stores data internally as immutable blobs, trees, commits, and annotated tags',
      'Clean up commit histories using interactive rebase (squash, reword, fixup)',
      'Isolate breaking regressions quickly using git bisect automated binary searching',
    ],
    modules: [
      { order: 1, title: 'Git Plumbing & Graph Internals', description: 'Objects directory, SHA-1 hashes, refs, and the staging index.' },
      { order: 2, title: 'Branching, Rebasing, and History Manipulation', description: 'Rebasing, fast-forward merges, cherry-pick, and bisect.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Git Under the Hood: Blobs, Trees, and Commits',
        description: 'Inspect the .git folder to understand the content-addressable storage model.',
        youtubeVideoId: 'lG90LZngrpr',
        durationMinutes: 28,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Mastering Interactive Rebase & History Cleanup',
        description: 'Using git rebase -i to squash commits, reword messages, and create atomic pull requests.',
        youtubeVideoId: 'ElRzTuYln0M',
        durationMinutes: 30,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Git Version Control Proficiency Quiz',
      instructions: 'Validate your knowledge of commit graphs, rebasing rules, and Git object storage.',
      passThreshold: 75,
      questions: [
        {
          id: 'git-q1',
          questionText: 'What happens to commit history when you perform a fast-forward merge in Git?',
          type: 'multiple-choice',
          options: [
            'A new merge commit is created with two parent commits',
            'The target branch pointer simply moves forward to point directly to the incoming commit, creating no new merge commit',
            'All commits on the feature branch are deleted',
            'The feature branch is converted into a tag',
          ],
          correctAnswers: [1],
          explanation: 'A fast-forward merge simply moves the branch pointer forward without creating a separate merge commit if there are no divergent changes.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1470,
    ratingAvg: 4.87,
    ratingCount: 190,
  },
  {
    title: 'Data Structures and Algorithms Masterclass',
    slug: 'data-structures-and-algorithms-masterclass',
    shortDescription: 'Master asymptotic notation, balanced trees, heaps, dynamic programming, and graph traversal.',
    description: 'A deep, rigorous dive into computer science fundamentals. Analyze Big-O time and space complexity, dynamic arrays, linked lists, hash tables with collision resolution, binary search trees, Dijkstra’s shortest path, and dynamic programming memoization.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    category: 'Programming',
    instructor: {
      name: 'Prof. Jonathan Cole',
      title: 'Senior Lecturer in Computer Science',
      bio: 'Prof. Cole has taught foundational algorithmic theory and data structure design for over twenty years.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '20 hours',
    skills: ['Big-O Analysis', 'Hash Tables', 'Binary Search Trees', 'Graph Algorithms (BFS/DFS)', 'Dynamic Programming'],
    prerequisites: ['Proficiency in at least one programming language'],
    learningObjectives: [
      'Perform formal Big-O, Big-Omega, and Big-Theta asymptotic time and space analysis',
      'Implement binary heaps and priority queues from memory arrays',
      'Formulate and solve recursive recurrence relations using dynamic programming tabulations',
    ],
    modules: [
      { order: 1, title: 'Complexity Analysis and Linear Structures', description: 'Big-O, arrays, linked lists, stacks, and queues.' },
      { order: 2, title: 'Non-Linear Structures and Dynamic Programming', description: 'Trees, heaps, graph traversals, and memoization.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Asymptotic Analysis & Big-O Notation',
        description: 'Worst-case, best-case, average-case analysis, and space complexity comparisons.',
        youtubeVideoId: 'D6xkbGLQesk',
        durationMinutes: 34,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Binary Search Trees & Tree Traversal (Inorder, Preorder, Postorder)',
        description: 'Node insertion, balanced tree heights, and depth-first tree traversals.',
        youtubeVideoId: 'fAAZ23Xd6aC',
        durationMinutes: 42,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Data Structures & Algorithms Theory',
      instructions: 'Demonstrate your understanding of algorithmic complexity and data structure trade-offs.',
      passThreshold: 75,
      questions: [
        {
          id: 'dsa-q1',
          questionText: 'What is the average time complexity for searching an element in a Hash Table with a uniform hash distribution?',
          type: 'multiple-choice',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswers: [0],
          explanation: 'Under uniform hashing and a suitable load factor, lookup, insertion, and deletion operate in O(1) amortized average time.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Two Sum Problem',
        problemStatement: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. Assume each input has exactly one solution.',
        difficulty: 'Easy',
        topicTags: ['Algorithms', 'Hash Table', 'Arrays'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
          python: `def solution(nums, target):\n  lookup = {}\n  for i, num in enumerate(nums):\n    comp = target - num\n    if comp in lookup:\n      return [lookup[comp], i]\n    lookup[num] = i\n  return []`,
        },
        inputFormat: 'nums (number[]), target (number)',
        outputFormat: 'number[] (indices [i, j])',
        sampleTestCases: [
          { input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0, 1]', explanation: 'nums[0] + nums[1] == 2 + 7 == 9' },
          { input: '[[3, 2, 4], 6]', expectedOutput: '[1, 2]', explanation: 'nums[1] + nums[2] == 2 + 4 == 6' },
        ],
        hiddenTestCases: [
          { input: '[[3, 3], 6]', expectedOutput: '[0, 1]' },
          { input: '[[1, 5, 8, 12], 20]', expectedOutput: '[2, 3]' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: true,
    enrolledCount: 3120,
    ratingAvg: 4.94,
    ratingCount: 520,
  },
  {
    title: 'Computer Networks & TCP/IP Architecture',
    slug: 'computer-networks-and-tcp-ip-architecture',
    shortDescription: 'Master the OSI 7-layer model, TCP three-way handshake, IP routing protocols, DNS, and HTTP/3.',
    description: 'An authoritative study of modern network architectures. Learn the physical, data link, network, and transport layers. Analyze packet switching, CIDR subnetting, BGP routing, TCP sliding window congestion control, and the QUIC UDP protocol powering HTTP/3.',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    category: 'Software Engineering',
    instructor: {
      name: 'Dr. Rebecca Stone',
      title: 'Professor of Telecommunications & Internet Architecture',
      bio: 'Dr. Stone has contributed to IETF internet protocol standards and network security working groups.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '12 hours',
    skills: ['OSI Model', 'TCP Handshake', 'UDP & QUIC', 'DNS Hierarchy', 'Subnetting & Routing', 'HTTP/3'],
    prerequisites: ['Basic computer architecture'],
    learningObjectives: [
      'Map protocols and network duties accurately across the 7 layers of the OSI stack',
      'Explain TCP reliability mechanisms: sequence numbers, checksums, flow control, and retransmission',
      'Calculate IPv4 subnet masks, network addresses, and broadcast boundaries',
    ],
    modules: [
      { order: 1, title: 'Network Layers and Transport Protocols', description: 'OSI model, IP packet headers, and TCP vs UDP transport.' },
      { order: 2, title: 'Routing and Application Layer Protocols', description: 'DNS resolution, BGP routing, and HTTP/2 vs HTTP/3.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'The OSI Model & TCP/IP Protocol Stack Explained',
        description: 'Layer boundaries, encapsulation, decapsulation, and packet frames.',
        youtubeVideoId: 'n2D1o-aM-2s',
        durationMinutes: 32,
        isRequired: true,
      },
      {
        moduleOrder: 1,
        title: 'TCP Connection Lifecycle: 3-Way Handshake & Teardown',
        description: 'SYN, SYN-ACK, ACK packet exchange, sequence number negotiation, and FIN/RST flags.',
        youtubeVideoId: 'bW_UILnZ0EY',
        durationMinutes: 30,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Computer Networks Comprehensive Quiz',
      instructions: 'Validate your knowledge of transport layers, handshake semantics, and DNS protocols.',
      passThreshold: 75,
      questions: [
        {
          id: 'net-q1',
          questionText: 'Which layer of the OSI model is responsible for end-to-end communication, segmentation, flow control, and error recovery?',
          type: 'multiple-choice',
          options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Session Layer'],
          correctAnswers: [1],
          explanation: 'The Transport layer (Layer 4, e.g. TCP) provides host-to-host communication services for applications.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1120,
    ratingAvg: 4.83,
    ratingCount: 135,
  },
  {
    title: 'Operating Systems Principles & Concurrency',
    slug: 'operating-systems-principles-and-concurrency',
    shortDescription: 'Explore processes, threads, CPU scheduling algorithms, virtual memory paging, and race conditions.',
    description: 'Learn how modern operating systems manage hardware resources. Examine kernel vs user space mode transitions, process control blocks (PCBs), context switching, CPU scheduling algorithms, virtual memory and page replacement, and race conditions solved via mutexes and semaphores.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    category: 'Software Engineering',
    instructor: {
      name: 'Arthur Sterling',
      title: 'Principal Systems Software Engineer',
      bio: 'Arthur has developed real-time operating system microkernels and hypervisor device drivers.',
    },
    skillLevel: 'Advanced',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '14 hours',
    skills: ['Process Management', 'Virtual Memory', 'CPU Scheduling', 'Deadlock Detection', 'Mutexes & Semaphores'],
    prerequisites: ['C or C++ Programming Basics'],
    learningObjectives: [
      'Explain the mechanics of user-to-kernel mode context switches and interrupt handling',
      'Analyze CPU scheduling algorithms including Round Robin, Multi-Level Feedback Queues, and SJF',
      'Diagnose the four Coffman conditions required for resource deadlock',
    ],
    modules: [
      { order: 1, title: 'Processes, Threads, and Scheduling', description: 'Context switching, thread pools, and CPU scheduling.' },
      { order: 2, title: 'Memory Management and Synchronization', description: 'Virtual memory, TLB, page replacement, and synchronization primitives.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Processes vs Threads: Memory Layout and Context Switching',
        description: 'Text, data, heap, and stack segments; process control blocks and registers.',
        youtubeVideoId: 'OrM7nZcxXZU',
        durationMinutes: 35,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Virtual Memory, Paging, and Page Faults',
        description: 'Address translation via page tables, translation lookaside buffers (TLB), and LRU eviction.',
        youtubeVideoId: 'qcBIvnQt0Bw',
        durationMinutes: 38,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Operating Systems Verification Exam',
      instructions: 'Demonstrate your understanding of OS virtual memory, scheduling, and concurrency locks.',
      passThreshold: 80,
      questions: [
        {
          id: 'os-q1',
          questionText: 'Which of the following is NOT one of the four Coffman conditions necessary for a system deadlock to occur?',
          type: 'multiple-choice',
          options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
          correctAnswers: [2],
          explanation: 'The condition is NO preemption (resources cannot be forcibly confiscated from a process). Allowing preemption resolves deadlocks.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 80,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: false,
    isFeatured: false,
    enrolledCount: 1040,
    ratingAvg: 4.85,
    ratingCount: 125,
  },
  {
    title: 'Software Architecture & System Design',
    slug: 'software-architecture-and-system-design',
    shortDescription: 'Design scalable, distributed systems: load balancers, caching tiers, data partitioning, and consistency models.',
    description: 'Learn the principles of designing large-scale software systems. This course prepares engineers to evaluate architectural trade-offs: the CAP theorem, horizontal scaling, read/write replication topologies, database sharding, caching tiers, and rate limiters.',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    category: 'Software Engineering',
    instructor: {
      name: 'Liam Gallagher',
      title: 'VP of Engineering & Systems Architect',
      bio: 'Liam has led engineering departments designing systems serving hundreds of thousands of concurrent transactions.',
    },
    skillLevel: 'Advanced',
    courseType: 'Theory',
    language: 'English',
    estimatedDuration: '16 hours',
    skills: ['CAP Theorem', 'Horizontal Sharding', 'Consistent Hashing', 'Caching Strategies', 'Message Queues'],
    prerequisites: ['Experience with web application backends and databases'],
    learningObjectives: [
      'Apply the CAP and PACELC theorems to evaluate distributed database trade-offs',
      'Design caching topologies using Cache-Aside, Write-Through, and Write-Back patterns',
      'Implement consistent hashing to distribute keys evenly across dynamic server nodes',
    ],
    modules: [
      { order: 1, title: 'Distributed Systems Foundations', description: 'Scalability dimensions, CAP theorem, and consistent hashing.' },
      { order: 2, title: 'Data Tier Scalability and Caching', description: 'Database sharding, replication lags, and multi-tier caching.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Scalability Fundamentals: Horizontal vs Vertical Scaling',
        description: 'Stateless servers, load balancer balancing algorithms, and session persistence.',
        youtubeVideoId: 'xpDnVSmNFX0',
        durationMinutes: 36,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Caching Strategies & Cache Invalidation Patterns',
        description: 'Redis in-memory caching, TTL policies, LRU evictions, and cache stampede prevention.',
        youtubeVideoId: 'dGAgxozNWFE',
        durationMinutes: 34,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'System Design Architecture Assessment',
      instructions: 'Demonstrate your capability to evaluate distributed scalability trade-offs.',
      passThreshold: 80,
      questions: [
        {
          id: 'sd-q1',
          questionText: 'According to the CAP Theorem, in the presence of a network partition (P), what trade-off must a distributed system make?',
          type: 'multiple-choice',
          options: [
            'Choose between Consistency (C) and Availability (A)',
            'Choose between Latency and Security',
            'Choose between Throughput and Durability',
            'No trade-off is required with modern NoSQL stores',
          ],
          correctAnswers: [0],
          explanation: 'When network partitions occur, distributed nodes must choose between returning consistent recent data or remaining available for writes/reads.',
          points: 1,
        },
      ],
    },
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 80,
      requireCoding: false,
      minCodingSolvedPercent: 0,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: true,
    enrolledCount: 2240,
    ratingAvg: 4.93,
    ratingCount: 340,
  },
  {
    title: 'Technical Interview Preparation Bootcamp',
    slug: 'technical-interview-preparation-bootcamp',
    shortDescription: 'Master coding patterns (sliding window, two pointers, fast & slow pointers) and behavioral interview techniques.',
    description: 'A comprehensive bootcamp designed to prepare software engineers for rigorous technical coding interviews. Master the 14 fundamental algorithmic patterns, time management strategies, communication frameworks for system design, and behavioral storytelling using the STAR method.',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    category: 'Interview Preparation',
    instructor: {
      name: 'Jessica Ramos',
      title: 'Former Big Tech Engineering Hiring Manager',
      bio: 'Jessica has conducted over 500 technical interviews at leading tech companies and coaches engineers worldwide.',
    },
    skillLevel: 'Intermediate',
    courseType: 'Mixed',
    language: 'English',
    estimatedDuration: '15 hours',
    skills: ['Two Pointers Technique', 'Sliding Window', 'Binary Search', 'STAR Behavioral Method', 'System Design Framework'],
    prerequisites: ['Proficiency in Data Structures and Algorithms'],
    learningObjectives: [
      'Recognize and apply the sliding window and two-pointer algorithmic patterns instantly',
      'Articulate clear problem-solving thought processes aloud during live technical interviews',
      'Formulate structured behavioral answers using the Situation, Task, Action, Result (STAR) framework',
    ],
    modules: [
      { order: 1, title: 'Algorithmic Coding Patterns', description: 'Two pointers, sliding window, and interval merging.' },
      { order: 2, title: 'Behavioral & Live Coding Strategy', description: 'Communication, edge case validation, and STAR response drafting.' },
    ],
    lessons: [
      {
        moduleOrder: 1,
        title: 'Mastering the Two Pointers & Sliding Window Patterns',
        description: 'How to reduce O(n^2) brute-force searches to O(n) optimal linear scans.',
        youtubeVideoId: 'MK-NZ4hN7Rs',
        durationMinutes: 38,
        isRequired: true,
      },
      {
        moduleOrder: 2,
        title: 'Acing the Behavioral Interview with the STAR Technique',
        description: 'Structuring leadership, conflict resolution, and technical failure stories effectively.',
        youtubeVideoId: 'uG36dZlT_Ew',
        durationMinutes: 28,
        isRequired: true,
      },
    ],
    quiz: {
      title: 'Interview Strategy Verification',
      instructions: 'Validate your understanding of algorithmic patterns and behavioral interview communication.',
      passThreshold: 75,
      questions: [
        {
          id: 'int-q1',
          questionText: 'When given a sorted array and asked to find two elements meeting a sum condition, which algorithmic pattern is optimal to achieve O(n) time and O(1) space?',
          type: 'multiple-choice',
          options: ['Two Pointers (converging from opposite ends)', 'Breadth First Search', 'Dynamic Programming Memoization', 'Radix Sort'],
          correctAnswers: [0],
          explanation: 'On a sorted array, placing one pointer at the start and one at the end allows adjusting sum directions in linear O(n) time without extra memory.',
          points: 1,
        },
      ],
    },
    challenges: [
      {
        title: 'Valid Anagram Check',
        problemStatement: 'Given two strings `s` and `t`, write a function `solution(s, t)` that returns true if `t` is an anagram of `s`, and false otherwise.',
        difficulty: 'Easy',
        topicTags: ['Interview Prep', 'Strings', 'Hash Table'],
        supportedLanguages: ['javascript', 'python'],
        starterCode: {
          javascript: `function solution(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}`,
          python: `def solution(s, t):\n  if len(s) != len(t):\n    return False\n  from collections import Counter\n  return Counter(s) == Counter(t)`,
        },
        inputFormat: 's (string), t (string)',
        outputFormat: 'boolean (true or false)',
        sampleTestCases: [
          { input: '["anagram", "nagaram"]', expectedOutput: 'true', explanation: 'Both contain identical characters with equal counts.' },
          { input: '["rat", "car"]', expectedOutput: 'false', explanation: 'Different characters.' },
        ],
        hiddenTestCases: [
          { input: '["listen", "silent"]', expectedOutput: 'true' },
          { input: '["a", "b"]', expectedOutput: 'false' },
        ],
        isRequired: true,
        order: 1,
      },
    ],
    certificatePolicy: {
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 75,
      requireCoding: true,
      minCodingSolvedPercent: 100,
    },
    isPublished: true,
    isTrending: true,
    isFeatured: true,
    enrolledCount: 2890,
    ratingAvg: 4.95,
    ratingCount: 460,
  },
];

export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Starting CertiPro database seeding...');
  await connectDB();

  // 1. Seed Categories
  console.log('[Seed] Seeding categories...');
  for (const cat of categoriesData) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
  }

  // 2. Seed Default Admin & Learner Accounts
  console.log('[Seed] Seeding default administrator and learner accounts...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin123!', salt);
  const learnerPasswordHash = await bcrypt.hash('Learner123!', salt);

  const admin = await User.findOneAndUpdate(
    { email: 'admin@certipro.dev' },
    {
      $set: {
        name: 'CertiPro Administrator',
        email: 'admin@certipro.dev',
        passwordHash: adminPasswordHash,
        role: 'admin',
        bio: 'Lead platform administrator and curriculum director at CertiPro.',
        learningInterests: ['Artificial Intelligence', 'Cloud Computing', 'Web Development'],
        accountStatus: 'active',
      },
    },
    { upsert: true, new: true }
  );

  const learner = await User.findOneAndUpdate(
    { email: 'learner@certipro.dev' },
    {
      $set: {
        name: 'Alex Mercer',
        email: 'learner@certipro.dev',
        passwordHash: learnerPasswordHash,
        role: 'learner',
        bio: 'Passionate computer science student pursuing software engineering and distributed systems.',
        learningInterests: ['Web Development', 'Programming', 'Cloud Computing'],
        accountStatus: 'active',
      },
    },
    { upsert: true, new: true }
  );

  // 3. Seed Courses, Curriculum, Quizzes, and Challenges
  // Enrich coursesSeedData with comprehensive 10-question quizzes and programming challenges
  coursesSeedData.forEach((c) => {
    if (quizzesByCourseSlug[c.slug]) {
      c.quiz = quizzesByCourseSlug[c.slug] as any;
    }
    if (challengesByCourseSlug[c.slug]) {
      c.challenges = challengesByCourseSlug[c.slug] as any;
      if (c.courseType === 'Theory') {
        c.courseType = 'Mixed';
      }
      if (c.certificatePolicy) {
        c.certificatePolicy.requireCoding = true;
        c.certificatePolicy.minCodingSolvedPercent = 100;
      }
    }
  });

  console.log(`[Seed] Seeding ${coursesSeedData.length} comprehensive courses...`);
  const seededCourses: any[] = [];

  for (const cData of coursesSeedData) {
    const { modules, lessons, ...courseFields } = cData;
    const quiz = quizzesByCourseSlug[cData.slug] || cData.quiz;
    const challenges = challengesByCourseSlug[cData.slug] || cData.challenges || [];

    if (challenges && challenges.length > 0) {
      if (courseFields.courseType === 'Theory') {
        courseFields.courseType = 'Mixed';
      }
      if (courseFields.certificatePolicy) {
        courseFields.certificatePolicy = {
          ...courseFields.certificatePolicy,
          requireCoding: true,
          minCodingSolvedPercent: 100,
        };
      }
    }

    // Create or update course
    let course = await Course.findOne({ slug: courseFields.slug });
    if (!course) {
      course = new Course({
        ...courseFields,
        modules: modules.map((m, idx) => ({
          _id: new mongoose.Types.ObjectId(),
          title: m.title,
          description: m.description,
          order: m.order || idx + 1,
        })),
      });
      await course.save();
    } else {
      // Update metadata
      Object.assign(course, courseFields);
      if (!course.modules || course.modules.length === 0) {
        course.modules = modules.map((m, idx) => ({
          _id: new mongoose.Types.ObjectId(),
          title: m.title,
          description: m.description,
          order: m.order || idx + 1,
        }));
      }
      await course.save();
    }

    seededCourses.push(course);

    // Map module order to module _id
    const moduleMap = new Map<number, string>();
    course.modules.forEach((mod) => {
      moduleMap.set(mod.order, mod._id!.toString());
    });

    // Seed Lessons
    if (lessons && lessons.length > 0) {
      for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        const moduleId = moduleMap.get(l.moduleOrder) || course.modules[0]._id!.toString();

        await Lesson.findOneAndUpdate(
          { course: course._id, title: l.title },
          {
            $set: {
              course: course._id,
              moduleId,
              title: l.title,
              description: l.description,
              lessonType: 'video',
              youtubeVideoId: l.youtubeVideoId,
              durationMinutes: l.durationMinutes,
              order: i + 1,
              isRequired: l.isRequired !== false,
            },
          },
          { upsert: true, new: true }
        );
      }
    }

    // Seed Quiz
    if (quiz) {
      await Quiz.findOneAndUpdate(
        { course: course._id },
        {
          $set: {
            course: course._id,
            title: quiz.title,
            instructions: quiz.instructions,
            passThreshold: quiz.passThreshold,
            maximumAttempts: 5,
            isRequired: true,
            questions: quiz.questions,
          },
        },
        { upsert: true, new: true }
      );
    }

    // Seed Coding Challenges
    if (challenges && challenges.length > 0) {
      for (const ch of challenges) {
        await CodingChallenge.findOneAndUpdate(
          { course: course._id, title: ch.title },
          {
            $set: {
              course: course._id,
              title: ch.title,
              problemStatement: ch.problemStatement,
              difficulty: ch.difficulty,
              topicTags: ch.topicTags,
              supportedLanguages: ch.supportedLanguages,
              starterCode: ch.starterCode,
              inputFormat: ch.inputFormat,
              outputFormat: ch.outputFormat,
              sampleTestCases: ch.sampleTestCases,
              hiddenTestCases: ch.hiddenTestCases,
              isRequired: ch.isRequired !== false,
              order: ch.order || 1,
            },
          },
          { upsert: true, new: true }
        );
      }
    }
  }

  // 4. Seed Rich Demo Learner Activity:
  // Enroll learner in 3 courses:
  // - Course 1: Full-Stack MERN -> 100% completed, quiz passed, coding challenge solved, and verified certificate issued!
  // - Course 2: React 18 -> 60% in progress, lessons partially done
  // - Course 3: DSA Masterclass -> In progress, ready to practice
  console.log('[Seed] Seeding rich progress, assessment attempts, and certificate for learner...');
  const mernCourse = seededCourses.find((c) => c.slug === 'modern-full-stack-engineering-with-mern');
  const reactCourse = seededCourses.find((c) => c.slug === 'react-18-and-design-system-architecture');
  const dsaCourse = seededCourses.find((c) => c.slug === 'data-structures-and-algorithms-masterclass');

  if (mernCourse) {
    const mernLessons = await Lesson.find({ course: mernCourse._id });
    const mernQuiz = await Quiz.findOne({ course: mernCourse._id });
    const mernChallenge = await CodingChallenge.findOne({ course: mernCourse._id });

    // 1. Mark all lessons completed
    for (const l of mernLessons) {
      await LessonProgress.findOneAndUpdate(
        { user: learner._id, lesson: l._id },
        {
          $set: {
            user: learner._id,
            course: mernCourse._id,
            lesson: l._id,
            completed: true,
            completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
        },
        { upsert: true }
      );
    }

    // 2. Mark quiz passed
    if (mernQuiz) {
      await QuizAttempt.findOneAndUpdate(
        { user: learner._id, quiz: mernQuiz._id },
        {
          $set: {
            user: learner._id,
            quiz: mernQuiz._id,
            course: mernCourse._id,
            answers: mernQuiz.questions.map((q) => ({
              questionId: q.id,
              selectedAnswers: q.correctAnswers,
              isCorrect: true,
              explanation: q.explanation,
            })),
            score: 100,
            earnedPoints: mernQuiz.questions.length,
            totalPoints: mernQuiz.questions.length,
            passed: true,
            attemptNumber: 1,
            submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        },
        { upsert: true }
      );
    }

    // 3. Mark coding challenge accepted
    if (mernChallenge) {
      await CodingSubmission.findOneAndUpdate(
        { user: learner._id, challenge: mernChallenge._id },
        {
          $set: {
            user: learner._id,
            challenge: mernChallenge._id,
            course: mernCourse._id,
            language: 'javascript',
            sourceCode: mernChallenge.starterCode.javascript || '',
            status: 'Accepted',
            testSummary: {
              passed: 4,
              total: 4,
              message: 'All test cases passed!',
            },
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        },
        { upsert: true }
      );
    }

    // 4. Create completed enrollment
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: learner._id, course: mernCourse._id },
      {
        $set: {
          user: learner._id,
          course: mernCourse._id,
          enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'completed',
          completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          progressPercent: 100,
          completedLessonsCount: mernLessons.length,
          totalLessonsCount: mernLessons.length,
        },
      },
      { upsert: true, new: true }
    );

    // 5. Generate verified Certificate
    const certificateId = 'CP-2026-F98A2C71';
    const verificationCode = 'VRF-7D2F8A1E90';

    await Certificate.findOneAndUpdate(
      { user: learner._id, course: mernCourse._id },
      {
        $set: {
          user: learner._id,
          course: mernCourse._id,
          enrollment: enrollment._id,
          certificateId,
          verificationCode,
          issueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'valid',
          completionSnapshot: {
            courseTitle: mernCourse.title,
            courseCategory: mernCourse.category,
            learnerName: learner.name,
            instructorName: mernCourse.instructor.name,
            completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            estimatedDuration: mernCourse.estimatedDuration,
            skills: mernCourse.skills,
            gradePercent: 100,
          },
        },
      },
      { upsert: true }
    );

    // Activity Events
    await ActivityEvent.create({
      user: learner._id,
      eventType: 'certificate_earned',
      course: mernCourse._id,
      title: `Earned Certificate for ${mernCourse.title}`,
      metadata: { certificateId, verificationCode },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });
  }

  // Enroll in React Course (in progress)
  if (reactCourse) {
    const reactLessons = await Lesson.find({ course: reactCourse._id });
    if (reactLessons.length > 0) {
      await LessonProgress.findOneAndUpdate(
        { user: learner._id, lesson: reactLessons[0]._id },
        {
          $set: {
            user: learner._id,
            course: reactCourse._id,
            lesson: reactLessons[0]._id,
            completed: true,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        },
        { upsert: true }
      );
    }

    await Enrollment.findOneAndUpdate(
      { user: learner._id, course: reactCourse._id },
      {
        $set: {
          user: learner._id,
          course: reactCourse._id,
          enrollmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'in-progress',
          progressPercent: 50,
          completedLessonsCount: 1,
          totalLessonsCount: reactLessons.length,
          lastAccessedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  // Enroll in DSA Course (not started)
  if (dsaCourse) {
    const dsaLessons = await Lesson.find({ course: dsaCourse._id });
    await Enrollment.findOneAndUpdate(
      { user: learner._id, course: dsaCourse._id },
      {
        $set: {
          user: learner._id,
          course: dsaCourse._id,
          enrollmentDate: new Date(),
          status: 'in-progress',
          progressPercent: 0,
          completedLessonsCount: 0,
          totalLessonsCount: dsaLessons.length,
          lastAccessedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  console.log('[Seed] Database successfully seeded with 18 courses, demo accounts, and real learning data!');
  console.log('--- Credentials ---');
  console.log('Learner: learner@certipro.dev / Learner123!');
  console.log('Admin:   admin@certipro.dev   / Admin123!');
  console.log('Verified Certificate ID: CP-2026-F98A2C71 (Code: VRF-7D2F8A1E90)');
  console.log('-------------------');
}

// Direct script execution
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed] Seeding failed:', err);
      await disconnectDB();
      process.exit(1);
    });
}

