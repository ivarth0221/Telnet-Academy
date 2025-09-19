import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, Employee, CourseTemplate, SavedCourse, Achievement, Toast, Role, StudyToolsState, StudyToolType, InterviewStep, MindMapNode, NetworkTopology, GalleryItem, ProjectSubmission, ForumPost, ForumReply, Lesson, TutorMessage, FinalProjectEvaluation, CertificateData, RemedialLesson, QuizQuestion, FinalExamState, GuidedLessonStep, Progress, Flashcard, Course } from '../types';
import { View } from '../types';
import { geminiService } from '../services/geminiService';
import type { CourseWizardPayload } from '../components/TopicInput';

import { initialEmployees, initialTemplates, roleAssignments, initialRoles, initialKnowledgeBase, initialGalleryItems, defaultGamification } from '../initialData';
import { ALL_ACHIEVEMENTS, XP_FOR_LEVEL } from '../achievements';

const APP_STATE_KEY = 'telnetAcademyState_v2.6';
const THEME_KEY = 'telnetAcademyTheme_v1';
type Theme = 'light' | 'dark';

const getInitialState = (): AppState => ({
  view: 'login',
  employees: initialEmployees,
  courseTemplates: initialTemplates,
  activeEmployeeId: null,
  roleAssignments: roleAssignments,
  roles: initialRoles,
  knowledgeBase: initialKnowledgeBase,
  galleryItems: initialGalleryItems,
});

// --- STATE & ACTIONS INTERFACES ---

interface AppStoreState {
    appState: AppState;
    isInitialized: boolean;
    isGenerating: boolean;
    error: string | null;
    theme: Theme;
    
    // Employee-specific UI state
    activeCourseId: string | null;
    activeView: View;
    activeModuleIndex: number;
    activeLessonIndex: number;
    isSidebarOpen: boolean;
    
    // Modals & Panels
    expansionState: { moduleIndex: number | null; moduleTitle: string; templateId: string | null; courseId: string | null; suggestions: string[]; isLoadingSuggestions: boolean; isGeneratingLesson: boolean; error: string | null; };
    studyToolsState: StudyToolsState & { isOpen: boolean };
    explanationState: { isOpen: boolean; lessonTitle: string; content: string | null; isLoading: boolean; error: string | null; };
    discussionPanelState: { isOpen: boolean; lessonKey: string; summary: string | null; isLoadingSummary: boolean; error: string | null; };
    remedialLessonState: { isOpen: boolean, lesson: RemedialLesson | null, isLoading: boolean, error: string | null };
    reviewingProject: { employeeId: string; courseId: string } | null;
    
    // Admin loading states
    isAddingEmployee: boolean;
    isAddingRole: boolean;

    // Global UI state
    toasts: Toast[];
}

interface AppStoreActions {
    // Initialization & Theme
    initializeApp: () => void;
    toggleTheme: () => void;
    
    // Derived State Getters
    getters: {
        activeEmployee: () => Employee | undefined;
        activeCourse: () => SavedCourse | undefined;
    };

    // Utility Actions
    addToast: (achievement: Achievement, userName: string | null) => void;
    updateEmployeeState: (employeeId: string, updater: (employee: Employee) => Partial<Employee>) => void;
    updateCourseProgress: (courseId: string, updater: (progress: SavedCourse['progress']) => Partial<SavedCourse['progress']>) => void;

    // Auth & Navigation
    login: (view: 'admin' | 'employee', employeeId?: string) => void;
    logout: () => void;
    selectCourse: (courseId: string) => void;
    startCourse: () => void;
    navigateLesson: (direction: 'next' | 'prev') => void;
    selectView: (view: View, moduleIndex?: number, lessonIndex?: number) => void;
    selectProfile: () => void;
    selectGallery: () => void;
    selectKnowledgeBase: () => void;
    returnToDashboard: () => void;
    
    // Admin Actions
    createCourseTemplate: (payload: CourseWizardPayload) => Promise<void>;
    deleteTemplate: (templateId: string) => void;
    addEmployee: (name: string, roleId: string) => Promise<void>;
    addRole: (name: string) => Promise<void>;
    assignTemplateToEmployee: (employeeId: string, templateId: string) => void;
    assignTemplateToRole: (templateId: string | null, role: string) => void;
    unassignCourse: (employeeId: string, courseId: string) => void;
    saveEvaluation: (employeeId: string, courseId: string, evaluation: FinalProjectEvaluation) => void;
    setReviewingProject: (review: { employeeId: string; courseId: string } | null) => void;
    addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
    updateGalleryItem: (updatedItem: GalleryItem) => void;
    deleteGalleryItem: (itemId: string) => void;

    // Employee Course Actions
    quizComplete: (moduleIndex: number, score: number, total: number) => void;
    continueFromQuiz: () => void;
    reviewFromQuiz: () => void;
    storeFlashcards: (flashcards: Flashcard[]) => void;
    submitProject: (submission: ProjectSubmission) => Promise<void>;
    sendMessageToTutor: (message: string) => Promise<void>;
    sendExamMessage: (message: string) => Promise<void>;
    resetExamCycle: () => void;
    selfAssignCourse: (templateId: string) => void;
    lessonComplete: () => void;
    
    // UI & Modals
    setIsSidebarOpen: (isOpen: boolean) => void;
    openExpansionModal: (id: string, moduleIndex: number, type: 'template' | 'course') => Promise<void>;
    selectExpansionSuggestion: (suggestion: string) => Promise<void>;
    closeExpansionModal: () => void;
    openStudyTools: () => void;
    closeStudyTools: () => void;
    selectStudyToolType: (toolType: StudyToolType) => Promise<void>;
    generateTopology: (prompt: string) => Promise<void>;
    sendInterviewMessage: (message: string) => Promise<void>;
    simulateSandboxCommand: (command: string) => Promise<void>;
    resetStudyTool: () => void;
    requestDeeperExplanation: () => Promise<void>;
    closeExplanationModal: () => void;
    openDiscussionPanel: () => void;
    closeDiscussionPanel: () => void;
    createForumPost: (title: string, content: string) => void;
    createForumReply: (postId: string, content: string) => void;
    generateForumSummary: () => Promise<void>;
}

// --- STORE IMPLEMENTATION ---

export const useAppStore = create<AppStoreState & AppStoreActions>()(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      appState: getInitialState(),
      isInitialized: false,
      isGenerating: false,
      error: null,
      theme: 'dark',
      activeCourseId: null,
      activeView: View.LESSON,
      activeModuleIndex: 0,
      activeLessonIndex: 0,
      isSidebarOpen: false,
      reviewingProject: null,
      isAddingEmployee: false,
      isAddingRole: false,
      toasts: [],
      expansionState: { moduleIndex: null, moduleTitle: '', templateId: null, courseId: null, suggestions: [], isLoadingSuggestions: false, isGeneratingLesson: false, error: null },
      studyToolsState: { isOpen: false, toolType: null, isLoading: false, error: null, content: null, interviewHistory: [] },
      explanationState: { isOpen: false, lessonTitle: '', content: null, isLoading: false, error: null },
      discussionPanelState: { isOpen: false, lessonKey: '', summary: null, isLoadingSummary: false, error: null },
      remedialLessonState: { isOpen: false, lesson: null, isLoading: false, error: null },

      // --- GETTERS ---
      getters: {
        activeEmployee: () => get().appState.employees.find(e => e.id === get().appState.activeEmployeeId),
        activeCourse: () => get().getters.activeEmployee()?.assignedCourses.find(c => c.id === get().activeCourseId),
      },

      // --- ACTIONS ---

      initializeApp: () => {
        if (get().isInitialized) return;
        const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        set({ theme: initialTheme, isInitialized: true });
        if (initialTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      },

      toggleTheme: () => {
        set(state => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            if (newTheme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            localStorage.setItem(THEME_KEY, newTheme);
            return { theme: newTheme };
        });
      },

      addToast: (achievement, userName) => {
        const newToast = { id: Date.now().toString(), achievement, userName };
        set(state => ({ toasts: [...state.toasts, newToast] }));
        setTimeout(() => set(state => ({ toasts: state.toasts.filter(t => t.id !== newToast.id) })), 5000);
      },
      
      updateEmployeeState: (employeeId, updater) => {
        set(state => ({
            appState: {
                ...state.appState,
                employees: state.appState.employees.map(emp => emp.id === employeeId ? { ...emp, ...updater(emp) } : emp),
            }
        }));
      },

      updateCourseProgress: (courseId, updater) => {
        const activeEmployeeId = get().appState.activeEmployeeId;
        if (!activeEmployeeId) return;
        get().updateEmployeeState(activeEmployeeId, emp => ({
            assignedCourses: emp.assignedCourses.map(c => 
                c.id === courseId ? { ...c, progress: { ...c.progress, ...updater(c.progress) } } : c
            ),
        }));
      },

      login: (view, employeeId) => {
        set(state => ({ appState: { ...state.appState, view, activeEmployeeId: employeeId || null } }));
      },

      logout: () => {
        set(state => ({ appState: { ...state.appState, view: 'login', activeEmployeeId: null }, activeCourseId: null }));
      },

      selectCourse: (courseId) => {
        const course = get().getters.activeEmployee()?.assignedCourses.find(c => c.id === courseId);
        if (!course) return;
        set({
            activeCourseId: courseId,
            activeView: course.progress.hasSeenIntro ? View.LESSON : View.COURSE_INTRO,
            activeModuleIndex: 0,
            activeLessonIndex: 0,
        });
      },

      startCourse: () => {
        const { activeCourseId } = get();
        if (!activeCourseId) return;
        get().updateCourseProgress(activeCourseId, p => ({ hasSeenIntro: true }));
        set({ activeView: View.LESSON, activeModuleIndex: 0, activeLessonIndex: 0 });
      },

      navigateLesson: (direction) => {
        const activeCourse = get().getters.activeCourse();
        if (!activeCourse) return;
        const { activeModuleIndex, activeLessonIndex } = get();
        const { course } = activeCourse;

        if (direction === 'next') {
            const currentModule = course.modules[activeModuleIndex];
            if (activeLessonIndex >= currentModule.lessons.length - 1) {
                set({ activeView: View.QUIZ });
            } else {
                set({ activeLessonIndex: activeLessonIndex + 1 });
            }
        } else { // prev
            if (activeLessonIndex > 0) {
                set({ activeLessonIndex: activeLessonIndex - 1 });
            } else if (activeModuleIndex > 0) {
                const prevModuleIndex = activeModuleIndex - 1;
                const prevModule = course.modules[prevModuleIndex];
                set({ activeModuleIndex: prevModuleIndex, activeLessonIndex: prevModule.lessons.length - 1 });
            }
        }
      },
      
      selectView: (view, moduleIndex, lessonIndex) => {
        const update: Partial<AppStoreState> = { activeView: view };
        if (moduleIndex !== undefined) update.activeModuleIndex = moduleIndex;
        if (lessonIndex !== undefined) update.activeLessonIndex = lessonIndex;
        set(update);
        get().setIsSidebarOpen(false);
      },

      selectProfile: () => get().selectView(View.PROFILE),
      selectGallery: () => get().selectView(View.GALLERY),
      selectKnowledgeBase: () => get().selectView(View.KNOWLEDGE_BASE),

      returnToDashboard: () => set({ activeCourseId: null, activeModuleIndex: 0, activeLessonIndex: 0 }),

      createCourseTemplate: async (payload) => {
        set({ isGenerating: true, error: null });
        try {
            const context = payload.answers.map(a => `P: ${a.question}\nR: ${a.answer}`).join('\n\n');
            const creationPayload = { initialTopic: payload.initialTopic, context, depth: payload.depth, role: payload.role, tone: payload.tone, focus: payload.focus };
            const generatedCourse = await geminiService.generateCourse(creationPayload);
            const newTemplate: CourseTemplate = {
                id: `template_${Date.now()}`,
                topic: payload.initialTopic,
                role: payload.role,
                depth: payload.depth,
                course: generatedCourse,
            };
            set(state => ({ appState: { ...state.appState, courseTemplates: [...state.appState.courseTemplates, newTemplate] } }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            set({ isGenerating: false });
        }
      },

      deleteTemplate: (templateId) => {},
      addEmployee: async (name, roleId) => {
        if (!name.trim() || !roleId) return;
        set({ isAddingEmployee: true });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async
        const role = get().appState.roles.find(r => r.id === roleId);
        if (!role) {
            console.error("Role not found");
            set({ isAddingEmployee: false });
            return;
        }
        const newEmployee: Employee = {
            id: `emp_${Date.now()}`,
            name,
            role,
            assignedCourses: [],
            gamification: { ...defaultGamification },
        };
        set(state => ({
            appState: { ...state.appState, employees: [...state.appState.employees, newEmployee] },
            isAddingEmployee: false
        }));
      },
      addRole: async (name) => {
        if (!name.trim() || get().appState.roles.some(r => r.name.toLowerCase() === name.toLowerCase())) {
            alert("El rol no puede estar vacío o ya existe.");
            return;
        }
        set({ isAddingRole: true });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async
        const newRole: Role = { id: `role_${Date.now()}`, name };
        set(state => ({
            appState: { ...state.appState, roles: [...state.appState.roles, newRole] },
            isAddingRole: false
        }));
      },
      assignTemplateToEmployee: (employeeId, templateId) => {
        const template = get().appState.courseTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        get().updateEmployeeState(employeeId, emp => {
            const newCourse: SavedCourse = {
                id: `course_${Date.now()}`,
                templateId: template.id,
                course: template.course,
                progress: {
                    status: 'not_started',
                    moduleStatus: template.course.modules.reduce((acc, _, i) => ({...acc, [`m${i}`]: i === 0 ? 'in_progress' : 'locked'}), {}),
                    moduleStartDates: {},
                    completedItems: new Set(),
                    flashcards: [],
                    tutorHistory: {},
                }
            };
            return {
                assignedCourses: [...emp.assignedCourses, newCourse]
            }
        });
      },

      assignTemplateToRole: (templateId, role) => {},
      unassignCourse: (employeeId, courseId) => {},
      saveEvaluation: (employeeId, courseId, evaluation) => {},
      setReviewingProject: (review) => set({ reviewingProject: review }),
      addGalleryItem: (item) => {},
      updateGalleryItem: (updatedItem) => {},
      deleteGalleryItem: (itemId) => {},
      
      lessonComplete: () => {
        const { activeCourseId, activeModuleIndex, activeLessonIndex } = get();
        if (!activeCourseId) return;
        const lessonKey = `m${activeModuleIndex}_l${activeLessonIndex}`;
        get().updateCourseProgress(activeCourseId, p => ({
            completedItems: new Set(p.completedItems).add(lessonKey),
        }));
      },

      quizComplete: (moduleIndex, score, total) => {
        const { activeCourseId } = get();
        const activeCourse = get().getters.activeCourse();
        if (!activeCourseId || !activeCourse) return;

        const moduleKey = `m${moduleIndex}`;
        const passed = (score / total) >= 0.7;

        get().updateCourseProgress(activeCourseId, p => {
            const newModuleStatus = { ...p.moduleStatus };
            const newQuizScores = { ...p.quizScores };

            newQuizScores[moduleKey] = { score, total };
            
            if (passed) {
                newModuleStatus[moduleKey] = 'completed';
                const nextModuleKey = `m${moduleIndex + 1}`;
                if (activeCourse.course.modules[moduleIndex + 1]) {
                    newModuleStatus[nextModuleKey] = 'in_progress';
                }
            }
            
            return { moduleStatus: newModuleStatus, quizScores: newQuizScores };
        });
      },

      continueFromQuiz: () => {
        const activeCourse = get().getters.activeCourse();
        const { activeModuleIndex } = get();
        if (!activeCourse) return;

        const nextModuleIndex = activeModuleIndex + 1;
        if (nextModuleIndex < activeCourse.course.modules.length) {
            get().selectView(View.LESSON, nextModuleIndex, 0);
        } else {
            // Last module quiz finished
            if (activeCourse.course.finalProject) {
                get().selectView(View.FINAL_PROJECT);
            } else {
                get().selectView(View.EXAM);
            }
        }
      },

      reviewFromQuiz: () => {
        get().selectView(View.LESSON, get().activeModuleIndex, 0);
      },

      storeFlashcards: (flashcards) => {
        const { activeCourseId } = get();
        if (!activeCourseId) return;
        get().updateCourseProgress(activeCourseId, p => ({ flashcards }));
      },

      submitProject: async (submission) => {
        const { activeCourseId } = get();
        if (!activeCourseId) return;
        get().updateCourseProgress(activeCourseId, p => ({
            projectSubmission: submission,
            status: 'pending_review',
            completedItems: new Set(p.completedItems).add('final_project_submitted'),
        }));
      },
      
      selfAssignCourse: (templateId) => {
        const employeeId = get().appState.activeEmployeeId;
        if (!employeeId) return;
        get().assignTemplateToEmployee(employeeId, templateId);
      },

      // Placeholder implementations for other actions
      sendMessageToTutor: async () => {},
      sendExamMessage: async () => {},
      resetExamCycle: () => {},
      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      openExpansionModal: async (id, moduleIndex, type) => {
        let moduleTitle = '';
        let courseContext: Course | undefined;

        if (type === 'course') {
            const course = get().getters.activeCourse();
            if (course && course.id === id) {
                moduleTitle = course.course.modules[moduleIndex]?.moduleTitle || '';
                courseContext = course.course;
            }
        } else { // template
            const template = get().appState.courseTemplates.find(t => t.id === id);
            if (template) {
                moduleTitle = template.course.modules[moduleIndex]?.moduleTitle || '';
                courseContext = template.course;
            }
        }

        if (!moduleTitle || !courseContext) return;

        set({ expansionState: { ...get().expansionState, moduleIndex, moduleTitle, [type === 'course' ? 'courseId' : 'templateId']: id, isLoadingSuggestions: true, error: null, suggestions: [] } });

        try {
            const suggestions = await geminiService.getModuleExpansionSuggestions(courseContext, moduleIndex);
            set(state => ({ expansionState: { ...state.expansionState, suggestions, isLoadingSuggestions: false } }));
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to get suggestions';
            set(state => ({ expansionState: { ...state.expansionState, error, isLoadingSuggestions: false } }));
        }
      },
      selectExpansionSuggestion: async (suggestion: string) => {
        const { expansionState } = get();
        const { moduleIndex, templateId, courseId } = expansionState;
        if (moduleIndex === null) return;

        set(state => ({ expansionState: { ...state.expansionState, isGeneratingLesson: true, error: null } }));

        try {
            if (courseId) {
                const activeCourse = get().getters.activeCourse();
                if (!activeCourse) throw new Error("Active course not found.");
                
                const newLesson = await geminiService.generateExpandedLesson(activeCourse.course, expansionState.moduleTitle, suggestion);
                
                get().updateEmployeeState(get().appState.activeEmployeeId!, emp => {
                    const updatedCourses = emp.assignedCourses.map(c => {
                        if (c.id === courseId) {
                            const newModules = [...c.course.modules];
                            newModules[moduleIndex].lessons.push(newLesson);
                            return { ...c, course: { ...c.course, modules: newModules } };
                        }
                        return c;
                    });
                    return { assignedCourses: updatedCourses };
                });

            } else if (templateId) {
                const template = get().appState.courseTemplates.find(t => t.id === templateId);
                if (!template) throw new Error("Template not found.");
                const newLesson = await geminiService.generateExpandedLesson(template.course, expansionState.moduleTitle, suggestion);
                
                set(state => ({
                    appState: {
                        ...state.appState,
                        courseTemplates: state.appState.courseTemplates.map(t => {
                            if (t.id === templateId) {
                                const newModules = [...t.course.modules];
                                newModules[moduleIndex].lessons.push(newLesson);
                                return { ...t, course: { ...t.course, modules: newModules } };
                            }
                            return t;
                        })
                    }
                }));
            }
            get().closeExpansionModal();
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to generate new lesson';
            set(state => ({ expansionState: { ...state.expansionState, error, isGeneratingLesson: false } }));
        }
      },
      closeExpansionModal: () => {
        set({ expansionState: { moduleIndex: null, moduleTitle: '', templateId: null, courseId: null, suggestions: [], isLoadingSuggestions: false, isGeneratingLesson: false, error: null } });
      },
      openStudyTools: () => {},
      closeStudyTools: () => {},
      selectStudyToolType: async () => {},
      generateTopology: async () => {},
      sendInterviewMessage: async () => {},
      simulateSandboxCommand: async () => {},
      resetStudyTool: () => {},
      requestDeeperExplanation: async () => {},
      closeExplanationModal: () => {},
      openDiscussionPanel: () => {},
      closeDiscussionPanel: () => {},
      createForumPost: () => {},
      createForumReply: () => {},
      generateForumSummary: async () => {},

    }),
    {
      name: APP_STATE_KEY,
      storage: createJSONStorage(() => localStorage, {
        replacer: (key, value) => {
          if (value instanceof Set) {
            return { __type: 'Set', value: [...value] };
          }
          return value;
        },
        reviver: (key, value) => {
          if (typeof value === 'object' && value !== null && (value as any).__type === 'Set') {
            return new Set((value as any).value);
          }
          return value;
        },
      }),
    }
  )
);