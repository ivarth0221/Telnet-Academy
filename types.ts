import React from 'react';

// --- CORE LEARNING CONTENT ---

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Represents the result of a quiz.
export interface QuizResult {
  score: number;
  total: number;

  answers: { [key: number]: string };
}

export interface Lesson {
  lessonTitle: string;
  initialContent: string;
  initialOptions: string[];
}

export interface Module {
  moduleTitle: string;
  description?: string;
  learningObjectives?: string[];
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface FinalProject {
    title: string;
    description: string;
    evaluationCriteria: string[];
}

export interface Course {
  title: string;
  description: string;
  modules: Module[];
  finalProject?: FinalProject;
}

// --- UI / VIEW ---

export enum View {
  LESSON,
  QUIZ,
  TUTOR,
  FINAL_PROJECT,
  FLASHCARDS,
  CERTIFICATE,
  PROFILE,
  EXAM, 
  COURSE_INTRO,
  KNOWLEDGE_BASE, // Added for the new feature
  GALLERY,
}

// --- COLLABORATION ---

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  timestamp: string;
  content: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  timestamp: string;
  title: string;
  content: string;
  replies: ForumReply[];
}


// --- PROGRESS & EVALUATION ---

export interface ProjectSubmission {
    text: string;
    imageUrl?: string; // Base64 Data URL
}


export interface FinalProjectEvaluation {
    overallScore: number;
    overallFeedback: string;
    competencies: { competency: string; score: number; feedback: string; }[];
}

export interface FinalExamState {
    status: 'not_started' | 'in_progress' | 'passed' | 'failed_remediation_needed';
    attemptsLeft: number;
    history: TutorMessage[];
    remediationPlan?: string;
    lastFeedback?: string;
}

export interface Progress {
    completedItems: Set<string>;
    finalProjectEvaluation?: FinalProjectEvaluation;
    projectSubmission?: ProjectSubmission;
    flashcards: Flashcard[];
    tutorHistory: Record<string, TutorMessage[]>; 
    quizScores?: Record<string, { score: number; total: number; competencyFeedback?: string; }>;
    finalExamState?: FinalExamState;
    hasSeenIntro?: boolean;
}

// --- INTERACTIVE & STUDY TOOLS ---

// State for the module expansion feature.
export interface ModuleExpansionState {
    moduleIndex: number;
    moduleTitle: string;
    suggestions: string[];
    isLoadingSuggestions: boolean;
    isGeneratingLesson: boolean;
    error: string | null;
}

export interface GuidedLessonStep {
  content: string;
  options: string[];
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'model';
  type: 'greeting' | 'question' | 'response' | 'feedback' | 'conclusion' | 'error';
  content: string;
  sources?: { uri: string; title: string }[];
  isStreaming?: boolean;
}

// Represents a single step in a simulated interview.
export interface InterviewStep {
    id: string;
    role: 'user' | 'model';
    content: string;
    isStreaming?: boolean;
}

// Represents a node in the mind map visualization.
export interface MindMapNode {
    concept: string;
    children?: MindMapNode[];
}

// Network topology related types.
export type NetworkDeviceType = 'router' | 'switch' | 'pc' | 'server' | 'firewall' | 'cloud' | 'olt' | 'ont' | 'splitter' | 'phone' | 'laptop' | 'printer' | 'access_point' | 'unknown';

export interface NetworkDevice {
    id: string;
    label: string;
    type: NetworkDeviceType;
    explanation: string;
}

export interface NetworkLink {
    source: string;
    target: string;
    label?: string;
    explanation: string;
}

export interface NetworkTopology {
    devices: NetworkDevice[];
    links: NetworkLink[];
}

// Defines the types of available study tools and their state.
export type StudyToolType = 'mindmap' | 'interview' | 'topology' | 'sandbox';

export interface StudyToolsState {
    toolType: StudyToolType | null;
    isLoading: boolean;
    error: string | null;
    content: MindMapNode | NetworkTopology | string | null;
    interviewHistory: InterviewStep[];
}

export interface Flashcard {
    question: string;
    answer: string;
}

export interface CertificateData {
    summary: string;
    validationId: string;
    durationHours: number;
}

export interface RemedialLesson {
    title: string;
    content: string;
}

export interface ClarifyingQuestionWithOptions {
  question: string;
  options: string[];
}

// --- KNOWLEDGE BASE ---
export interface KnowledgeBaseArticle {
    id: string;
    title: string;
    category: string;
    content: string; // Markdown content
    relatedRoles: string[];
}

// --- GALLERY ---
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'Conectores' | 'Tipos de Fibra' | 'Herramientas';
}


// --- GAMIFICATION ---

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.FC<any>;
    celebrationText: string;
}

export interface GamificationState {
    streak: number;
    lastStudiedDate: string | null;
    xp: number;
    level: number;
    achievements: string[];
}

// --- TOAST NOTIFICATION ---
export interface Toast {
    id: string;
    achievement: Achievement;
    userName: string | null;
}

// ===============================================
// V2 ARCHITECTURE: ADMIN & EMPLOYEE ROLES
// ===============================================

export interface Role {
    id: string;
    name: string;
}

export interface CourseTemplate {
    id: string;
    topic: string;
    role: string;
    depth: 'Básico' | 'Intermedio' | 'Avanzado';
    course: Course;
}

export interface SavedCourse {
    id: string; // Unique instance ID for this assignment
    templateId: string;
    course: Course;
    progress: {
        status: 'not_started' | 'in_progress' | 'pending_review' | 'completed';
        moduleStatus: Record<string, 'locked' | 'in_progress' | 'pending_review' | 'completed'>; // Key: m0, m1, ...
        moduleStartDates: Record<string, string>; // Key: m0, m1... stores ISO date string
        completedItems: string[];
        finalProjectEvaluation?: FinalProjectEvaluation;
        projectSubmission?: ProjectSubmission;
        flashcards: Flashcard[];
        tutorHistory: Record<string, TutorMessage[]>;
        quizScores?: Record<string, { score: number; total: number; competencyFeedback?: string }>;
        finalExamState?: FinalExamState;
        hasSeenIntro?: boolean;
        forums?: Record<string, ForumPost[]>; // Key: m{moduleIndex}_l{lessonIndex}
        deeperExplanationRequests?: Record<string, number>; // Key: m{moduleIndex}_l{lessonIndex}
    };
}

export interface Employee {
    id: string;
    name: string;
    role: Role;
    assignedCourses: SavedCourse[];
    gamification: GamificationState;
}

export interface AppState {
    view: 'login' | 'admin' | 'employee';
    employees: Employee[];
    courseTemplates: CourseTemplate[];
    activeEmployeeId: string | null;
    roleAssignments: Record<string, string>; // Maps role name to templateId
    roles: Role[];
    knowledgeBase: KnowledgeBaseArticle[];
    galleryItems: GalleryItem[];
}