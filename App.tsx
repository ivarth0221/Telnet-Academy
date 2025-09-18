import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Course, Progress, AppState, GamificationState, Flashcard, Lesson, TutorMessage, FinalProjectEvaluation, CertificateData, RemedialLesson, QuizQuestion, FinalExamState, GuidedLessonStep, Employee, CourseTemplate, SavedCourse, Achievement, Toast, Role, StudyToolsState, StudyToolType, InterviewStep, MindMapNode, NetworkTopology, GalleryItem, ProjectSubmission, ForumPost, ForumReply } from './types';
import { View } from './types';
// FIX: Added all missing function imports from geminiService
import { generateCourse, generateGuidedLessonStep, generateFlashcardsForCourse, getModuleExpansionSuggestions, generateExpandedLesson, streamTutorResponse, generateCertificateData, generateRemedialLesson, generateCompetencyFeedback, streamExamAttempt, generateExamRemediationPlan, generateModuleDescription, generateComplementaryLesson, generateClarifyingQuestions, generateMindMap, generateNetworkTopology, streamInterviewSimResponse, simulateCommandExecution, generateDeeperExplanation, generateForumSummary } from './services/geminiService';
import type { CourseCreationPayload } from './services/geminiService';
import type { CourseWizardPayload } from './components/TopicInput';

import LoadingSpinner from './components/LoadingSpinner';
import Sidebar from './components/Sidebar';
import CourseView from './components/CourseView';
import QuizView from './components/QuizView';
import TutorView from './components/TutorView';
import { FlashcardView } from './components/FlashcardView';
import ModuleExpansionModal from './components/ModuleExpansionModal';
import CertificateView from './components/CertificateView';
import ToastContainer from './components/ToastContainer';
import { ALL_ACHIEVEMENTS, XP_FOR_LEVEL } from './achievements';
import FinalProjectView from './components/FinalProjectView';
import RemedialLessonModal from './components/RemedialLessonModal';
import ExamView from './components/ExamView';
import CourseIntroView from './components/CourseIntroView';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import { Bars3Icon } from './components/IconComponents';
import ProfileView from './components/ProfileView';
import StudyToolsModal from './components/StudyToolsModal';
import DeeperExplanationModal from './components/DeeperExplanationModal';
import GalleryView from './components/GalleryView';
import DiscussionPanelView from './components/DiscussionPanelView';
import ThemeToggle from './components/ThemeToggle';
// FIX: Corrected import name from 'initialRoleAssignments' to 'roleAssignments'.
import { initialEmployees, initialTemplates, roleAssignments, initialRoles, initialKnowledgeBase, initialGalleryItems } from './initialData';


declare global {
  interface Window {
    marked: { parse: (markdown: string) => string; setOptions: (options: any) => void; };
    hljs: any;
    jspdf: any;
  }
}

const APP_STATE_KEY = 'telnetAcademyState_v2.5'; // Updated key for new structure
const THEME_KEY = 'telnetAcademyTheme_v1';

type Theme = 'light' | 'dark';

const getInitialState = (): AppState => ({
  view: 'login',
  employees: initialEmployees,
  courseTemplates: initialTemplates,
  activeEmployeeId: null,
  // FIX: Use correct variable 'roleAssignments'.
  roleAssignments: roleAssignments,
  roles: initialRoles,
  knowledgeBase: initialKnowledgeBase,
  galleryItems: initialGalleryItems,
});

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>(View.LESSON);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  
  const [expansionState, setExpansionState] = useState<{
    moduleIndex: number | null;
    templateId: string | null;
    courseId: string | null; // For employee course expansion
    suggestions: string[];
    isLoadingSuggestions: boolean;
    isGeneratingLesson: boolean;
    error: string | null;
  }>({ moduleIndex: null, templateId: null, courseId: null, suggestions: [], isLoadingSuggestions: false, isGeneratingLesson: false, error: null });

  const [studyToolsState, setStudyToolsState] = useState<StudyToolsState & { isOpen: boolean }>({
    isOpen: false,
    toolType: null,
    isLoading: false,
    error: null,
    content: null,
    interviewHistory: [],
  });
  
  const [explanationState, setExplanationState] = useState<{
    isOpen: boolean;
    lessonTitle: string;
    content: string | null;
    isLoading: boolean;
    error: string | null;
  }>({ isOpen: false, lessonTitle: '', content: null, isLoading: false, error: null });

  const [discussionPanelState, setDiscussionPanelState] = useState<{
    isOpen: boolean;
    lessonKey: string;
    summary: string | null;
    isLoadingSummary: boolean;
    error: string | null;
  }>({ isOpen: false, lessonKey: '', summary: null, isLoadingSummary: false, error: null });


  const [remedialLessonState, setRemedialLessonState] = useState<{ isOpen: boolean, lesson: RemedialLesson | null, isLoading: boolean, error: string | null }>({ isOpen: false, lesson: null, isLoading: false, error: null });
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<number | null>(null);
  const [generatingDescriptionError, setGeneratingDescriptionError] = useState<Record<number, string | null>>({});
  const [isEnriching, setIsEnriching] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reviewingProject, setReviewingProject] = useState<{ employeeId: string; courseId: string } | null>(null);


  const activeEmployee = useMemo(() => appState?.employees.find(e => e.id === appState.activeEmployeeId), [appState]);
  const activeCourse = useMemo(() => activeEmployee?.assignedCourses.find(c => c.id === activeCourseId), [activeEmployee, activeCourseId]);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    // App state initialization
    if (window.marked && window.hljs) {
        window.marked.setOptions({ highlight: (code, lang) => window.hljs.highlight(code, { language: window.hljs.getLanguage(lang) ? lang : 'plaintext' }).value });
    }

    try {
        const savedStateJSON = localStorage.getItem(APP_STATE_KEY);
        if (savedStateJSON) {
            let savedState: AppState = JSON.parse(savedStateJSON);
            
            // --- DATA MIGRATION ---
            savedState.employees.forEach(emp => {
                emp.assignedCourses.forEach(course => {
                    if (!course.progress.moduleStatus) {
                        console.log(`Migrating course ${course.id} for ${emp.name}`);
                        course.progress.moduleStatus = {};
                        course.course.modules.forEach((_, index) => {
                            const moduleKey = `m${index}`;
                            const quizKey = `${moduleKey}_q`;
                            if (course.progress.completedItems.includes(quizKey)) {
                                course.progress.moduleStatus[moduleKey] = 'completed';
                            } else {
                                course.progress.moduleStatus[moduleKey] = 'locked';
                            }
                        });
                        // Set the first non-completed module to 'in_progress'
                        const firstNotCompleted = course.course.modules.findIndex((_, i) => course.progress.moduleStatus[`m${i}`] !== 'completed');
                        if (firstNotCompleted !== -1) {
                            course.progress.moduleStatus[`m${firstNotCompleted}`] = 'in_progress';
                        }
                    }
                    if (!course.progress.moduleStartDates) {
                        course.progress.moduleStartDates = {};
                    }
                    if(!course.progress.status) {
                        course.progress.status = 'in_progress';
                    }
                    if (!course.progress.deeperExplanationRequests) {
                        course.progress.deeperExplanationRequests = {};
                    }
                });
            });
            setAppState(savedState);
        } else {
            setAppState(getInitialState());
        }
    } catch (e) {
        console.error("Failed to load or migrate state", e);
        setAppState(getInitialState());
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (appState !== null && !isLoading) {
        localStorage.setItem(APP_STATE_KEY, JSON.stringify(appState));
    }
  }, [appState, isLoading]);

  const updateEmployeeState = (employeeId: string, updater: (employee: Employee) => Employee) => {
    setAppState(prev => {
        if (!prev) return null;
        return {
            ...prev,
            employees: prev.employees.map(emp => emp.id === employeeId ? updater(emp) : emp),
        };
    });
  };
  
   const updateCourseProgress = useCallback((courseId: string, updater: (progress: SavedCourse['progress']) => SavedCourse['progress']) => {
        if (!activeEmployee) return;
        updateEmployeeState(activeEmployee.id, emp => ({
            ...emp,
            assignedCourses: emp.assignedCourses.map(c => {
                if (c.id === courseId) {
                    const updatedProgress = updater(c.progress);
                    return { ...c, progress: updatedProgress };
                }
                return c;
            }),
        }));
    }, [activeEmployee]);


  const addToast = useCallback((achievement: Achievement, userName: string | null) => {
    const newToast = { id: Date.now().toString(), achievement, userName };
    setToasts(currentToasts => [...currentToasts, newToast]);
    setTimeout(() => setToasts(currentToasts => currentToasts.filter(t => t.id !== newToast.id)), 5000);
  }, []);
  
  const checkAndAwardAchievements = useCallback((employee: Employee): Employee => {
    const earnedAchievements = new Set(employee.gamification.achievements);
    let changed = false;

    if (employee.assignedCourses.length > 0 && !earnedAchievements.has('pioneer')) {
        earnedAchievements.add('pioneer'); addToast(ALL_ACHIEVEMENTS.pioneer, employee.name); changed = true;
    }
    if(employee.gamification.streak >= 7 && !earnedAchievements.has('streak_7')) {
        earnedAchievements.add('streak_7'); addToast(ALL_ACHIEVEMENTS.streak_7, employee.name); changed = true;
    }
    
    if (changed) {
      return { ...employee, gamification: { ...employee.gamification, achievements: Array.from(earnedAchievements) }};
    }
    return employee;
  }, [addToast]);
  
  const handleCreateCourseTemplate = async (payload: CourseWizardPayload) => {
    setIsGenerating(true);
    setError(null);
    const context = payload.answers.map((a) => `P: ${a.question}\nR: ${a.answer}`).join('\n\n');
    const creationPayload: CourseCreationPayload = { 
        initialTopic: payload.initialTopic, 
        context, 
        depth: payload.depth, 
        role: payload.role,
        tone: payload.tone,
        focus: payload.focus
    };
    try {
      const generatedCourse = await generateCourse(creationPayload);
      const newTemplate: CourseTemplate = {
        id: Date.now().toString(),
        topic: payload.initialTopic,
        role: payload.role,
        depth: payload.depth,
        course: generatedCourse,
      };
      setAppState(prev => prev ? { ...prev, courseTemplates: [...prev.courseTemplates, newTemplate] } : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createNewCourseInstance = (template: CourseTemplate, employee: Employee): SavedCourse => {
        const moduleStatus: Record<string, 'locked' | 'in_progress' | 'pending_review' | 'completed'> = {};
        template.course.modules.forEach((_, index) => {
            moduleStatus[`m${index}`] = index === 0 ? 'in_progress' : 'locked';
        });
        const moduleStartDates: Record<string, string> = { m0: new Date().toISOString() };

        return {
            id: `${employee.id}-${template.id}-${Date.now()}`,
            templateId: template.id,
            course: JSON.parse(JSON.stringify(template.course)),
            progress: {
                completedItems: [],
                flashcards: [],
                tutorHistory: {},
                quizScores: {},
                hasSeenIntro: false,
                status: 'in_progress',
                moduleStatus,
                moduleStartDates,
                deeperExplanationRequests: {},
            }
        };
  };

  const handleDeleteTemplate = (templateId: string) => {
    setAppState(prev => {
        if (!prev) return null;
        const newAssignments = { ...prev.roleAssignments };
        Object.keys(newAssignments).forEach(role => {
            if (newAssignments[role] === templateId) {
                delete newAssignments[role];
            }
        });
        return {
            ...prev,
            courseTemplates: prev.courseTemplates.filter(t => t.id !== templateId),
            roleAssignments: newAssignments,
        };
    });
  };
  
    const handleExpandModuleRequest = async (id: string, moduleIndex: number, type: 'template' | 'course') => {
        const courseObj = type === 'template'
            ? appState?.courseTemplates.find(t => t.id === id)?.course
            : activeEmployee?.assignedCourses.find(c => c.id === id)?.course;

        if (!courseObj) return;

        setExpansionState({ 
            templateId: type === 'template' ? id : null, 
            courseId: type === 'course' ? id : null,
            moduleIndex, 
            suggestions: [], 
            isLoadingSuggestions: true, 
            isGeneratingLesson: false, 
            error: null 
        });

        try {
            const suggestions = await getModuleExpansionSuggestions(courseObj, moduleIndex);
            setExpansionState(prev => ({ ...prev, suggestions, isLoadingSuggestions: false }));
        } catch (error) {
            console.error("Failed to get expansion suggestions:", error);
            setExpansionState(prev => ({ ...prev, isLoadingSuggestions: false, error: (error as Error).message }));
        }
    };


    const handleSelectExpansionSuggestion = async (suggestion: string) => {
        const { templateId, courseId, moduleIndex } = expansionState;
        if (moduleIndex === null || (!templateId && !courseId)) return;

        setExpansionState(prev => ({...prev, isGeneratingLesson: true}));

        const courseObj = templateId 
            ? appState?.courseTemplates.find(t => t.id === templateId)?.course
            : activeEmployee?.assignedCourses.find(c => c.id === courseId)?.course;

        if (!courseObj) {
            setExpansionState({ templateId: null, courseId: null, moduleIndex: null, suggestions: [], isLoadingSuggestions: false, isGeneratingLesson: false, error: 'Course object not found' });
            return;
        }

        try {
            const newLesson = await generateExpandedLesson(courseObj, courseObj.modules[moduleIndex].moduleTitle, suggestion);
            
            if (templateId) { // Admin expanding a template
                setAppState(prev => {
                    if (!prev) return null;
                    const newTemplates = prev.courseTemplates.map(t => {
                        if (t.id === templateId) {
                            const newCourse = { ...t.course };
                            const newModules = [...newCourse.modules];
                            const targetModule = { ...newModules[moduleIndex] };
                            targetModule.lessons = [...targetModule.lessons, newLesson];
                            newModules[moduleIndex] = targetModule;
                            newCourse.modules = newModules;
                            return { ...t, course: newCourse };
                        }
                        return t;
                    });
                    return { ...prev, courseTemplates: newTemplates };
                });
            } else if (courseId && activeEmployee) { // Employee expanding their course
                updateEmployeeState(activeEmployee.id, emp => ({
                    ...emp,
                    assignedCourses: emp.assignedCourses.map(c => {
                        if (c.id === courseId) {
                            const newCourse = { ...c.course };
                            const newModules = [...newCourse.modules];
                            const targetModule = { ...newModules[moduleIndex] };
                            targetModule.lessons = [...targetModule.lessons, newLesson];
                            newModules[moduleIndex] = targetModule;
                            newCourse.modules = newModules;
                            return { ...c, course: newCourse };
                        }
                        return c;
                    })
                }));
            }
            
            handleCloseExpansionModal();
        } catch (error) {
            console.error("Failed to generate and add lesson:", error);
            setExpansionState(prev => ({ ...prev, isGeneratingLesson: false, error: (error as Error).message }));
        }
    };
  
  const handleCloseExpansionModal = () => {
    setExpansionState({ templateId: null, courseId: null, moduleIndex: null, suggestions: [], isLoadingSuggestions: false, isGeneratingLesson: false, error: null });
  };


  const handleAddEmployee = (newEmployee: Employee) => {
    setAppState(prev => {
      if (!prev) return null;
      if (prev.employees.some(e => e.name.toLowerCase() === newEmployee.name.toLowerCase())) {
          alert(`El empleado "${newEmployee.name}" ya existe.`);
          return prev;
      }
      
      // Auto-assign course based on role
      const templateIdForRole = prev.roleAssignments[newEmployee.role.name];
      if (templateIdForRole) {
          const template = prev.courseTemplates.find(t => t.id === templateIdForRole);
          if (template) {
              const newCourse = createNewCourseInstance(template, newEmployee);
              newEmployee.assignedCourses.push(newCourse);
          }
      }

      return {
        ...prev,
        employees: [...prev.employees, newEmployee],
      };
    });
  };

  const handleAddRole = (newRole: Role) => {
    setAppState(prev => {
        if (!prev) return null;
        if (prev.roles.some(r => r.name.toLowerCase() === newRole.name.toLowerCase())) {
            alert(`El rol "${newRole.name}" ya existe.`);
            return prev;
        }
        return {
            ...prev,
            roles: [...prev.roles, newRole]
        };
    });
  };

  const handleAssignTemplateToEmployee = (employeeId: string, templateId: string) => {
    setAppState(prev => {
        if (!prev) return null;
        const template = prev.courseTemplates.find(t => t.id === templateId);
        if (!template) return prev;

        const updatedEmployees = prev.employees.map(employee => {
            if (employee.id === employeeId) {
                if (employee.assignedCourses.some(c => c.templateId === templateId)) return employee;
                const newCourse = createNewCourseInstance(template, employee);
                return { ...employee, assignedCourses: [...employee.assignedCourses, newCourse] };
            }
            return employee;
        });
        return { ...prev, employees: updatedEmployees };
    });
  };
  
  const handleAssignTemplateToRole = (templateId: string | null, role: string) => {
    setAppState(prev => {
        if (!prev) return null;

        const newAssignments = { ...prev.roleAssignments };
        if (templateId) {
            newAssignments[role] = templateId;
        } else {
            delete newAssignments[role];
        }

        if (templateId) {
            const template = prev.courseTemplates.find(t => t.id === templateId);
            if (!template) return prev; 

            const updatedEmployees = prev.employees.map(employee => {
                if (employee.role.name === role && !employee.assignedCourses.some(c => c.templateId === templateId)) {
                    const newCourse = createNewCourseInstance(template, employee);
                    return { ...employee, assignedCourses: [...employee.assignedCourses, newCourse] };
                }
                return employee;
            });
            return { ...prev, roleAssignments: newAssignments, employees: updatedEmployees };
        } else {
            return { ...prev, roleAssignments: newAssignments };
        }
    });
  };

  const handleUnassignCourse = (employeeId: string, courseId: string) => {
    updateEmployeeState(employeeId, (employee) => ({
      ...employee,
      assignedCourses: employee.assignedCourses.filter(c => c.id !== courseId)
    }));
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!activeEmployee) return;
    updateEmployeeState(activeEmployee.id, (employee) => ({
      ...employee,
      assignedCourses: employee.assignedCourses.filter(c => c.id !== courseId)
    }));
    setActiveCourseId(null);
  };
  
  const handleLogin = (view: 'admin' | 'employee', employeeId?: string) => {
    setAppState(prev => prev ? { ...prev, view, activeEmployeeId: employeeId || null } : null);
  };

  const handleLogout = () => {
    setAppState(prev => prev ? { ...prev, view: 'login', activeEmployeeId: null } : null);
    setActiveCourseId(null);
  };

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    const course = activeEmployee?.assignedCourses.find(c => c.id === courseId);
    if (!course) return;

    if (course.progress.hasSeenIntro) {
        setActiveView(View.LESSON);
        setActiveModuleIndex(0);
        setActiveLessonIndex(0);
    } else {
        setActiveView(View.COURSE_INTRO);
    }
  };
  
  const handleStartCourse = () => {
    if (!activeCourseId) return;
    updateCourseProgress(activeCourseId, p => ({ ...p, hasSeenIntro: true }));
    setActiveView(View.LESSON);
    setActiveModuleIndex(0);
    setActiveLessonIndex(0);
  };
  
  const handleLessonComplete = () => {
    if (!activeEmployee || !activeCourseId) return;
    const lessonKey = `m${activeModuleIndex}_l${activeLessonIndex}`;

    updateEmployeeState(activeEmployee.id, emp => {
        let xpGained = 0;
        
        const updatedCourses = emp.assignedCourses.map(c => {
            if (c.id === activeCourseId) {
                if (!c.progress.completedItems.includes(lessonKey)) {
                    xpGained = 50;
                    return { ...c, progress: { ...c.progress, completedItems: [...c.progress.completedItems, lessonKey] } };
                }
            }
            return c;
        });
        
        if (xpGained === 0) return emp; 

        let updatedGamification = { ...emp.gamification, xp: emp.gamification.xp + xpGained };
        const earnedAchievements = new Set(updatedGamification.achievements);
      
        while (updatedGamification.xp >= XP_FOR_LEVEL(updatedGamification.level)) {
            updatedGamification.level += 1;
            const newLevel = updatedGamification.level;
            const levelAchievementId = `level_${newLevel}`;
            if (ALL_ACHIEVEMENTS[levelAchievementId] && !earnedAchievements.has(levelAchievementId)) {
                earnedAchievements.add(levelAchievementId);
                addToast(ALL_ACHIEVEMENTS[levelAchievementId], emp.name);
            }
        }
        return { ...emp, assignedCourses: updatedCourses, gamification: { ...updatedGamification, achievements: Array.from(earnedAchievements) } };
    });
  };
  
  const handleNavigateLesson = (direction: 'next' | 'prev') => {
    if (!activeCourse) return;
    const { course } = activeCourse;

    if (direction === 'next') {
        const currentModule = course.modules[activeModuleIndex];
        const isLastLessonInModule = activeLessonIndex >= currentModule.lessons.length - 1;
        if (isLastLessonInModule) {
            setActiveView(View.QUIZ);
        } else {
            setActiveLessonIndex(prev => prev + 1);
        }
    } else { // prev
        if (activeLessonIndex > 0) {
            setActiveLessonIndex(prev => prev - 1);
        } else {
            if (activeModuleIndex > 0) {
                const prevModuleIndex = activeModuleIndex - 1;
                const prevModule = course.modules[prevModuleIndex];
                setActiveModuleIndex(prevModuleIndex);
                setActiveLessonIndex(prevModule.lessons.length -1);
            }
        }
    }
  };

  const handleLessonStep = async (history: GuidedLessonStep[], userChoice: string): Promise<GuidedLessonStep> => {
    if (!activeCourse) throw new Error("No hay una ruta de habilidad activa.");
    const currentLesson = activeCourse.course.modules[activeModuleIndex].lessons[activeLessonIndex];
    return generateGuidedLessonStep(activeCourse.course, currentLesson, history, userChoice);
  };
  
  const handleGenerateCompetencyFeedback = async (moduleIndex: number) => {
    if (!activeCourse || !activeCourseId) return;
    const module = activeCourse.course.modules[moduleIndex];
    const scoreData = activeCourse.progress.quizScores?.[`m${moduleIndex}`];
    if (!module || !scoreData) return;
    
    setIsGeneratingFeedback(true);
    try {
        const feedback = await generateCompetencyFeedback(module.moduleTitle, scoreData.score, scoreData.total);
        updateCourseProgress(activeCourseId, p => ({
            ...p,
            quizScores: {
                ...p.quizScores,
                [`m${moduleIndex}`]: { ...scoreData, competencyFeedback: feedback },
            },
        }));
    } catch (e) {
        console.error("Error generating competency feedback", e);
    } finally {
        setIsGeneratingFeedback(false);
    }
  };
  
  const handleSelectExamOrCertificate = useCallback(() => {
    if (!activeCourse) return;
    const examState = activeCourse.progress.finalExamState;
    if (examState?.status === 'passed') {
        setActiveView(View.CERTIFICATE);
    } else {
        setActiveView(View.EXAM);
    }
  }, [activeCourse]);

  const handleQuizComplete = (moduleIndex: number, score: number, total: number) => {
    if (!activeCourseId || !activeCourse || !activeEmployee) return;

    const moduleKey = `m${moduleIndex}`;
    const isPassed = score / total >= 0.7;

    updateEmployeeState(activeEmployee.id, emp => {
        let updatedGamification = { ...emp.gamification };
        const updatedCourses = emp.assignedCourses.map(c => {
            if (c.id === activeCourseId) {
                const newModuleStatus = { ...c.progress.moduleStatus };
                if (isPassed) {
                    newModuleStatus[moduleKey] = 'completed';
                    updatedGamification.xp += 100;

                    const nextModuleIndex = moduleIndex + 1;
                    if (nextModuleIndex < c.course.modules.length) {
                        newModuleStatus[`m${nextModuleIndex}`] = 'in_progress';
                    }
                }
                const newProgress = {
                    ...c.progress,
                    quizScores: { ...c.progress.quizScores, [moduleKey]: { score, total } },
                    moduleStatus: newModuleStatus
                };
                return { ...c, progress: newProgress };
            }
            return c;
        });

        if (isPassed && (score / total) === 1 && !emp.gamification.achievements.includes('perfect_quiz')) {
            const earnedAchievements = new Set(emp.gamification.achievements);
            earnedAchievements.add('perfect_quiz');
            addToast(ALL_ACHIEVEMENTS.perfect_quiz, emp.name);
            updatedGamification.achievements = Array.from(earnedAchievements);
        }

        while (updatedGamification.xp >= XP_FOR_LEVEL(updatedGamification.level)) {
            updatedGamification.level += 1;
            const levelAchievementId = `level_${updatedGamification.level}`;
            if (ALL_ACHIEVEMENTS[levelAchievementId]) {
                const earnedAchievements = new Set(updatedGamification.achievements);
                earnedAchievements.add(levelAchievementId);
                addToast(ALL_ACHIEVEMENTS[levelAchievementId], emp.name);
                updatedGamification.achievements = Array.from(earnedAchievements);
            }
        }
        
        return { ...emp, assignedCourses: updatedCourses, gamification: updatedGamification };
    });

    if (!isPassed) {
        handleGenerateCompetencyFeedback(moduleIndex);
    }
  };

    const handleContinueFromQuiz = () => {
        if (!activeCourse) return;
        const nextModuleIndex = activeModuleIndex + 1;
        if (nextModuleIndex < activeCourse.course.modules.length) {
            setActiveModuleIndex(nextModuleIndex);
            setActiveLessonIndex(0);
            setActiveView(View.LESSON);
        } else {
            if (activeCourse.course.finalProject) {
                setActiveView(View.FINAL_PROJECT);
            } else {
                handleSelectExamOrCertificate();
            }
        }
    };

    const handleReviewFromQuiz = () => {
        setActiveView(View.LESSON);
        setActiveLessonIndex(0);
    };
    
    const handleGenerateRemedialLesson = async (incorrectQuestions: { question: QuizQuestion; userAnswer: string }[]) => {
        if (!activeEmployee) return;
        setRemedialLessonState({ isOpen: true, lesson: null, isLoading: true, error: null });
        try {
            const lesson = await generateRemedialLesson(incorrectQuestions);
            setRemedialLessonState(prev => ({ ...prev, lesson, isLoading: false }));

            updateEmployeeState(activeEmployee.id, emp => {
                const earnedAchievements = new Set(emp.gamification.achievements);
                if (!earnedAchievements.has('remedial_student')) {
                    earnedAchievements.add('remedial_student');
                    addToast(ALL_ACHIEVEMENTS.remedial_student, emp.name);
                    return { ...emp, gamification: { ...emp.gamification, achievements: Array.from(earnedAchievements) } };
                }
                return emp;
            });
        } catch (err) {
            setRemedialLessonState(prev => ({ ...prev, isLoading: false, error: err instanceof Error ? err.message : 'Error desconocido' }));
        }
    };
    
    const handleStoreFlashcards = (flashcards: Flashcard[]) => {
        if (!activeCourseId) return;
        updateCourseProgress(activeCourseId, p => ({ ...p, flashcards }));
    };

    const handleSubmitProject = (submission: ProjectSubmission) => {
        if (!activeCourseId || !activeEmployee) return;
        
        updateEmployeeState(activeEmployee.id, emp => {
            let updatedGamification = { ...emp.gamification };
            
            const updatedCourses = emp.assignedCourses.map(c => {
                if (c.id === activeCourseId) {
                    updatedGamification.xp += 50; // Points for submission, not approval
                    const newProgress: SavedCourse['progress'] = { ...c.progress, projectSubmission: submission, status: 'pending_review' };
                    return { ...c, progress: newProgress };
                }
                return c;
            });

            const earnedAchievements = new Set(updatedGamification.achievements);
            if (!earnedAchievements.has('builder')) {
                earnedAchievements.add('builder');
                addToast(ALL_ACHIEVEMENTS.builder, emp.name);
            }
            
            return { ...emp, assignedCourses: updatedCourses, gamification: {...updatedGamification, achievements: Array.from(earnedAchievements)} };
        });
    };

    const handleSaveEvaluation = (employeeId: string, courseId: string, evaluation: FinalProjectEvaluation) => {
        updateEmployeeState(employeeId, emp => {
            let updatedGamification = { ...emp.gamification };

            const updatedCourses = emp.assignedCourses.map(c => {
                if (c.id === courseId) {
                    if (evaluation.overallScore >= 70) updatedGamification.xp += 250; 
                    const newProgress: SavedCourse['progress'] = { ...c.progress, finalProjectEvaluation: evaluation, status: 'completed' };
                    return { ...c, progress: newProgress };
                }
                return c;
            });

            const earnedAchievements = new Set(updatedGamification.achievements);
            if (evaluation.overallScore >= 70 && !earnedAchievements.has('competency_verified')) {
                earnedAchievements.add('competency_verified');
                addToast(ALL_ACHIEVEMENTS.competency_verified, emp.name);
            }
            
            while (updatedGamification.xp >= XP_FOR_LEVEL(updatedGamification.level)) {
                updatedGamification.level += 1;
                const newLevel = updatedGamification.level;
                const levelAchievementId = `level_${newLevel}`;
                if (ALL_ACHIEVEMENTS[levelAchievementId] && !earnedAchievements.has(levelAchievementId)) {
                    earnedAchievements.add(levelAchievementId);
                    addToast(ALL_ACHIEVEMENTS[levelAchievementId], emp.name);
                }
            }

            return { ...emp, assignedCourses: updatedCourses, gamification: { ...updatedGamification, achievements: Array.from(earnedAchievements) } };
        });
        setReviewingProject(null);
    };
    
    const handleSendMessageToTutor = async (message: string) => {
        if (!activeCourse || !activeCourseId) return;
        const historyKey = `m${activeModuleIndex}`;
        const currentHistory = activeCourse.progress.tutorHistory?.[historyKey] || [];
        
        const userMessage: TutorMessage = { id: Date.now().toString(), role: 'user', type: 'question', content: message };
        
        updateCourseProgress(activeCourseId, p => ({
            ...p,
            tutorHistory: { ...p.tutorHistory, [historyKey]: [...currentHistory, userMessage] }
        }));
        
        const modelMessageId = (Date.now() + 1).toString();
        
        try {
            const workingProgress: Progress = {
                ...activeCourse.progress,
                completedItems: new Set(activeCourse.progress.completedItems),
            };
            const stream = await streamTutorResponse(activeCourse.course, workingProgress, currentHistory, message, activeModuleIndex, activeLessonIndex);
            
            let accumulatedContent = '';
            let sources: { uri: string; title: string }[] = [];
            
            for await (const chunk of stream) {
                accumulatedContent += chunk.text;
                sources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web) || sources;
                
                const modelMessage: TutorMessage = {
                    id: modelMessageId, role: 'model', type: 'response', content: accumulatedContent,
                    sources: sources, isStreaming: true,
                };

                updateCourseProgress(activeCourseId, p => {
                    const latestHistory = [...(p.tutorHistory?.[historyKey] || [])];
                    const existingModelMessageIndex = latestHistory.findIndex(m => m.id === modelMessageId);
                    if (existingModelMessageIndex !== -1) {
                        latestHistory[existingModelMessageIndex] = modelMessage;
                    } else {
                        latestHistory.push(modelMessage);
                    }
                    return { ...p, tutorHistory: { ...p.tutorHistory, [historyKey]: latestHistory } };
                });
            }

             updateCourseProgress(activeCourseId, p => {
                const finalHistory = p.tutorHistory?.[historyKey] || [];
                return { ...p, tutorHistory: { ...p.tutorHistory, [historyKey]: finalHistory.map(m => m.id === modelMessageId ? { ...m, isStreaming: false } : m) }};
            });
        } catch (e) {
            console.error("Tutor streaming error:", e);
            const errorMessage: TutorMessage = { id: modelMessageId, role: 'model', type: 'error', content: 'Lo siento, ocurrió un error al procesar tu solicitud.' };
             updateCourseProgress(activeCourseId, p => ({ ...p, tutorHistory: { ...p.tutorHistory, [historyKey]: [...(p.tutorHistory?.[historyKey] || []), errorMessage] }}));
        }
    };

  // --- DISCUSSION PANEL HANDLERS ---
  const handleOpenDiscussionPanel = () => {
    const lessonKey = `m${activeModuleIndex}_l${activeLessonIndex}`;
    setDiscussionPanelState(prev => ({ ...prev, isOpen: true, lessonKey, summary: null }));
  };

  const handleCloseDiscussionPanel = () => {
    setDiscussionPanelState({ isOpen: false, lessonKey: '', summary: null, isLoadingSummary: false, error: null });
  };

  const handleCreateForumPost = (title: string, content: string) => {
    if (!activeCourseId || !activeEmployee) return;
    const { lessonKey } = discussionPanelState;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorId: activeEmployee.id,
      authorName: activeEmployee.name,
      timestamp: new Date().toISOString(),
      title,
      content,
      replies: [],
    };

    updateCourseProgress(activeCourseId, p => {
      const newForums = { ...(p.forums || {}) };
      const currentPosts = newForums[lessonKey] || [];
      newForums[lessonKey] = [...currentPosts, newPost];
      return { ...p, forums: newForums };
    });
  };

  const handleCreateForumReply = (postId: string, content: string) => {
    if (!activeCourseId || !activeEmployee) return;
    const { lessonKey } = discussionPanelState;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorId: activeEmployee.id,
      authorName: activeEmployee.name,
      timestamp: new Date().toISOString(),
      content,
    };
    
    updateCourseProgress(activeCourseId, p => {
      const newForums = { ...(p.forums || {}) };
      const currentPosts = newForums[lessonKey] || [];
      newForums[lessonKey] = currentPosts.map(post => 
        post.id === postId ? { ...post, replies: [...post.replies, newReply] } : post
      );
      return { ...p, forums: newForums };
    });
  };

  const handleGenerateForumSummary = async () => {
    if (!activeCourse) return;
    const { lessonKey } = discussionPanelState;
    const posts = activeCourse.progress.forums?.[lessonKey] || [];
    if (posts.length === 0) {
      setDiscussionPanelState(prev => ({...prev, summary: "No hay discusiones para resumir.", error: null}));
      return;
    }

    setDiscussionPanelState(prev => ({...prev, isLoadingSummary: true, error: null}));
    try {
      const lessonTitle = activeCourse.course.modules[activeModuleIndex].lessons[activeLessonIndex].lessonTitle;
      const summary = await generateForumSummary(lessonTitle, posts);
      setDiscussionPanelState(prev => ({...prev, summary, isLoadingSummary: false}));
    } catch(e) {
      setDiscussionPanelState(prev => ({...prev, isLoadingSummary: false, error: "No se pudo generar el resumen."}));
    }
  };


    
    const handleUpdateUserName = (name: string) => {
        if (!activeEmployee) return;
        updateEmployeeState(activeEmployee.id, emp => ({ ...emp, name }));
    };
    
    const handleSendExamMessage = async (message: string) => {
        if (!activeCourse || !activeCourseId || !activeEmployee) return;
        
        const currentExamState = activeCourse.progress.finalExamState || { status: 'not_started', attemptsLeft: 3, history: [] };
        if (currentExamState.status === 'passed' || currentExamState.status === 'failed_remediation_needed') return;
        
        const userMessage: TutorMessage = { id: Date.now().toString(), role: 'user', type: 'response', content: message };
        const newHistory = [...currentExamState.history, userMessage];

        updateCourseProgress(activeCourseId, p => ({...p, finalExamState: {...currentExamState, history: newHistory, status: 'in_progress' }}));

        const modelMessageId = (Date.now() + 1).toString();
        
        try {
            const stream = await streamExamAttempt(activeCourse.course, newHistory);
            
            let accumulatedContent = '';
            for await (const chunk of stream) {
                accumulatedContent += chunk.text;
                const modelMessage: TutorMessage = {
                    id: modelMessageId, role: 'model', type: 'question', content: accumulatedContent, isStreaming: true,
                };
                updateCourseProgress(activeCourseId, p => {
                    const latestHistory = [...(p.finalExamState?.history || [])];
                    const existingIndex = latestHistory.findIndex(m => m.id === modelMessageId);
                    if (existingIndex > -1) latestHistory[existingIndex] = modelMessage;
                    else latestHistory.push(modelMessage);
                    return { ...p, finalExamState: { ...currentExamState, history: latestHistory, status: 'in_progress' } };
                });
            }

            // After stream finishes, check for JSON verdict
            const jsonMatch = accumulatedContent.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                const jsonResult = JSON.parse(jsonMatch[1]);
                const finalContent = accumulatedContent.replace(jsonMatch[0], '').trim();
                
                updateCourseProgress(activeCourseId, p => {
                    const finalHistory = [...(p.finalExamState?.history || [])].map(m => m.id === modelMessageId ? { ...m, isStreaming: false, content: finalContent } : m);
                    
                    if (jsonResult.passed) {
                         // Award achievement
                        updateEmployeeState(activeEmployee.id, emp => {
                            const earnedAchievements = new Set(emp.gamification.achievements);
                            if (!earnedAchievements.has('final_exam_passed')) {
                                earnedAchievements.add('final_exam_passed');
                                addToast(ALL_ACHIEVEMENTS.final_exam_passed, emp.name);
                            }
                            return { ...emp, gamification: { ...emp.gamification, achievements: Array.from(earnedAchievements) } };
                        });
                        return { ...p, finalExamState: { ...currentExamState, history: finalHistory, status: 'passed', lastFeedback: jsonResult.feedback }};
                    } else {
                        const newAttemptsLeft = currentExamState.attemptsLeft - 1;
                        if (newAttemptsLeft <= 0) {
                            handleGenerateExamRemediation(finalHistory);
                            return { ...p, finalExamState: { ...currentExamState, history: finalHistory, status: 'failed_remediation_needed', lastFeedback: jsonResult.feedback, attemptsLeft: 0 }};
                        } else {
                            return { ...p, finalExamState: { ...currentExamState, history: [], status: 'not_started', lastFeedback: jsonResult.feedback, attemptsLeft: newAttemptsLeft }};
                        }
                    }
                });

            } else {
                // Final update, no verdict yet
                updateCourseProgress(activeCourseId, p => ({ ...p, finalExamState: { ...p.finalExamState!, history: p.finalExamState!.history.map(m => m.id === modelMessageId ? { ...m, isStreaming: false } : m) }}));
            }
        } catch (e) {
            console.error("Exam streaming error:", e);
        }
    };
    
    const handleGenerateExamRemediation = async (history: TutorMessage[]) => {
        if (!activeCourse || !activeCourseId) return;
        const remediationPlan = await generateExamRemediationPlan(activeCourse.course.title, history);
        updateCourseProgress(activeCourseId, p => ({...p, finalExamState: {...p.finalExamState!, remediationPlan }}));
    };

    const handleResetExamCycle = () => {
        if (!activeCourseId) return;
        updateCourseProgress(activeCourseId, p => ({...p, finalExamState: { status: 'not_started', attemptsLeft: 3, history: [] }}));
    };
    
    const handleGenerateModuleDescription = async (moduleIndex: number) => {
        if (!activeCourse || !activeCourseId) return;
        const module = activeCourse.course.modules[moduleIndex];
        if (module.description) return;
        
        setGeneratingDescriptionError(prev => ({ ...prev, [moduleIndex]: null }));
        setIsGeneratingDescription(moduleIndex);
        try {
            const description = await generateModuleDescription(module.moduleTitle, module.lessons.map(l => l.lessonTitle));
            if (activeEmployee) {
                updateEmployeeState(activeEmployee.id, emp => ({
                    ...emp,
                    assignedCourses: emp.assignedCourses.map(c => {
                        if (c.id === activeCourseId) {
                            const newModules = [...c.course.modules];
                            newModules[moduleIndex] = { ...newModules[moduleIndex], description };
                            return { ...c, course: { ...c.course, modules: newModules }};
                        }
                        return c;
                    })
                }));
            }
        } catch (e) {
            console.error("Error generating module description", e);
            setGeneratingDescriptionError(prev => ({ ...prev, [moduleIndex]: 'Error al generar la idea clave.' }));
        } finally {
            setIsGeneratingDescription(null);
        }
    };
    
    const handleEnrichCourse = async () => {
        if (!activeCourse || !activeEmployee) return;
        setIsEnriching(true);
        
        try {
            const enrichedModules = await Promise.all(activeCourse.course.modules.map(async (module) => {
                const newLesson = await generateComplementaryLesson(activeCourse.course.title, module.moduleTitle, module.lessons.map(l => l.lessonTitle));
                return { ...module, lessons: [...module.lessons, newLesson] };
            }));

            updateEmployeeState(activeEmployee.id, emp => ({
                ...emp,
                assignedCourses: emp.assignedCourses.map(c =>
                    c.id === activeCourse.id
                        ? { ...c, course: { ...c.course, modules: enrichedModules } }
                        : c
                )
            }));
        } catch (e) {
            console.error("Failed to enrich course", e);
        } finally {
            setIsEnriching(false);
        }
    };

    const handleSelectProfile = () => {
        setActiveCourseId(null);
        setActiveView(View.PROFILE);
    };

    const handleReturnToDashboardFromProfile = () => {
        setActiveView(View.LESSON); // Reset to default view
    };

    const handleSelectKnowledgeBase = () => {
        setActiveCourseId(null);
        setActiveView(View.KNOWLEDGE_BASE);
    };

    const handleSelectGallery = () => {
        setActiveCourseId(null);
        setActiveView(View.GALLERY);
    };

    const handleSelfAssignCourse = (templateId: string) => {
        if (!activeEmployee) return;

        updateEmployeeState(activeEmployee.id, emp => {
            const template = appState?.courseTemplates.find(t => t.id === templateId);
            if (!template) return emp;

            if (emp.assignedCourses.some(c => c.templateId === templateId)) {
                const existingCourse = emp.assignedCourses.find(c => c.templateId === templateId);
                if(existingCourse) setActiveCourseId(existingCourse.id);
                return emp;
            }

            const newCourse = createNewCourseInstance(template, emp);
            let updatedGamification = { ...emp.gamification, xp: emp.gamification.xp + 25 };
            const earnedAchievements = new Set(updatedGamification.achievements);
          
            while (updatedGamification.xp >= XP_FOR_LEVEL(updatedGamification.level)) {
                updatedGamification.level += 1;
                const newLevel = updatedGamification.level;
                const levelAchievementId = `level_${newLevel}`;
                if (ALL_ACHIEVEMENTS[levelAchievementId] && !earnedAchievements.has(levelAchievementId)) {
                    earnedAchievements.add(levelAchievementId);
                    addToast(ALL_ACHIEVEMENTS[levelAchievementId], emp.name);
                }
            }
            return { ...emp, assignedCourses: [...emp.assignedCourses, newCourse], gamification: { ...updatedGamification, achievements: Array.from(earnedAchievements) } };
        });
    };

    // --- Study Tools Handlers ---
    const handleOpenStudyTools = () => {
        if (!activeCourse) return;
        setStudyToolsState(prev => ({ ...prev, isOpen: true }));
    };

    const handleCloseStudyTools = () => {
        setStudyToolsState({ isOpen: false, toolType: null, isLoading: false, error: null, content: null, interviewHistory: [] });
    };

    const handleSelectStudyToolType = async (toolType: StudyToolType) => {
        if (!activeCourse) return;
        setStudyToolsState(prev => ({ ...prev, toolType, isLoading: true, error: null, content: null }));

        try {
            if (toolType === 'mindmap') {
                const map = await generateMindMap(activeCourse.course);
                setStudyToolsState(prev => ({ ...prev, content: map, isLoading: false }));
            } else if (toolType === 'interview') {
                const stream = await streamInterviewSimResponse(activeCourse.course, []);
                const firstMessage: InterviewStep = { id: Date.now().toString(), role: 'model', content: '', isStreaming: true };
                setStudyToolsState(prev => ({ ...prev, interviewHistory: [firstMessage], isLoading: false }));

                for await (const chunk of stream) {
                    firstMessage.content += chunk.text;
                    setStudyToolsState(prev => ({ ...prev, interviewHistory: [...prev.interviewHistory] }));
                }
                firstMessage.isStreaming = false;
                setStudyToolsState(prev => ({ ...prev, interviewHistory: [...prev.interviewHistory] }));
            } else {
                setStudyToolsState(prev => ({ ...prev, isLoading: false })); // For topology & sandbox, wait for user input
            }
        } catch (err) {
            setStudyToolsState(prev => ({ ...prev, isLoading: false, error: (err as Error).message }));
        }
    };
    
    const handleGenerateTopology = async (prompt: string) => {
        setStudyToolsState(prev => ({...prev, isLoading: true}));
        try {
            const topology = await generateNetworkTopology(prompt);
            setStudyToolsState(prev => ({...prev, content: topology, isLoading: false}));
        } catch (err) {
            setStudyToolsState(prev => ({...prev, isLoading: false, error: (err as Error).message}));
        }
    };
    
    const handleSendInterviewMessage = async (message: string) => {
        if (!activeCourse) return;
        const userMessage: InterviewStep = { id: Date.now().toString(), role: 'user', content: message };
        const currentHistory = [...studyToolsState.interviewHistory, userMessage];
        setStudyToolsState(prev => ({ ...prev, interviewHistory: currentHistory }));

        const modelMessage: InterviewStep = { id: (Date.now() + 1).toString(), role: 'model', content: '', isStreaming: true };
        setStudyToolsState(prev => ({ ...prev, interviewHistory: [...currentHistory, modelMessage] }));
        
        try {
             const stream = await streamInterviewSimResponse(activeCourse.course, currentHistory);
             for await (const chunk of stream) {
                modelMessage.content += chunk.text;
                setStudyToolsState(prev => ({ ...prev, interviewHistory: [...prev.interviewHistory] }));
            }
        } catch (err) {
            modelMessage.content = `Error: ${(err as Error).message}`;
        } finally {
            modelMessage.isStreaming = false;
            setStudyToolsState(prev => ({ ...prev, interviewHistory: [...prev.interviewHistory] }));
        }
    };

    const handleSimulateSandboxCommand = async (command: string) => {
        if (!activeCourse) return;
        setStudyToolsState(prev => ({ ...prev, isLoading: true, content: null }));
        try {
            const result = await simulateCommandExecution(command, activeCourse.course.title);
            setStudyToolsState(prev => ({ ...prev, content: result, isLoading: false }));
        } catch (err) {
             setStudyToolsState(prev => ({ ...prev, isLoading: false, error: (err as Error).message }));
        }
    };

    const handleRequestDeeperExplanation = async () => {
        if (!activeCourse || !activeCourseId) return;
        
        const lesson = activeCourse.course.modules[activeModuleIndex].lessons[activeLessonIndex];
        
        const lessonKey = `m${activeModuleIndex}_l${activeLessonIndex}`;
        updateCourseProgress(activeCourseId, p => {
            const currentRequests = p.deeperExplanationRequests || {};
            const newCount = (currentRequests[lessonKey] || 0) + 1;
            return {
                ...p,
                deeperExplanationRequests: {
                    ...currentRequests,
                    [lessonKey]: newCount,
                }
            };
        });

        setExplanationState({
            isOpen: true,
            lessonTitle: lesson.lessonTitle,
            content: null,
            isLoading: true,
            error: null
        });

        try {
            const explanation = await generateDeeperExplanation(
                activeCourse.course.title,
                lesson.lessonTitle,
                lesson.initialContent
            );
            setExplanationState(prev => ({ ...prev, content: explanation, isLoading: false }));
        } catch (err) {
            setExplanationState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : 'Error desconocido'
            }));
        }
    };

    const handleCloseExplanationModal = () => {
        setExplanationState({ isOpen: false, lessonTitle: '', content: null, isLoading: false, error: null });
    };

    const handleAddGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
        setAppState(prev => {
            if (!prev) return null;
            const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
            return {
                ...prev,
                galleryItems: [...prev.galleryItems, newItem]
            };
        });
    };

    const handleUpdateGalleryItem = (updatedItem: GalleryItem) => {
        setAppState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                galleryItems: prev.galleryItems.map(item => item.id === updatedItem.id ? updatedItem : item)
            };
        });
    };

    const handleDeleteGalleryItem = (itemId: string) => {
        setAppState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                galleryItems: prev.galleryItems.filter(item => item.id !== itemId)
            };
        });
    };


  const renderContent = () => {
    if (isLoading || theme === null) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900"><LoadingSpinner message="Cargando entorno..." /></div>;
    if (!appState) return null;

    switch (appState.view) {
        case 'login':
            return <LoginView employees={appState.employees} onSelectEmployee={(id) => handleLogin('employee', id)} onLoginAsAdmin={() => handleLogin('admin')} theme={theme} toggleTheme={toggleTheme} />;
        case 'admin':
            return <AdminDashboard 
                        employees={appState.employees} 
                        courseTemplates={appState.courseTemplates} 
                        roleAssignments={appState.roleAssignments}
                        roles={appState.roles}
                        galleryItems={appState.galleryItems}
                        onAddGalleryItem={handleAddGalleryItem}
                        onUpdateGalleryItem={handleUpdateGalleryItem}
                        onDeleteGalleryItem={handleDeleteGalleryItem}
                        onCreateTemplate={handleCreateCourseTemplate}
                        onAddEmployee={handleAddEmployee}
                        onAddRole={handleAddRole}
                        onAssignTemplateToRole={handleAssignTemplateToRole}
                        onAssignTemplateToEmployee={handleAssignTemplateToEmployee}
                        // FIX: Corrected typo from onUnassignCourse to handleUnassignCourse
                        onUnassignCourse={handleUnassignCourse}
                        onSaveEvaluation={handleSaveEvaluation}
                        onLogout={handleLogout} 
                        isGenerating={isGenerating}
                        onDeleteTemplate={handleDeleteTemplate}
                        expansionState={expansionState}
                        onExpandModuleRequest={(templateId, moduleIndex) => handleExpandModuleRequest(templateId, moduleIndex, 'template')}
                        onSelectExpansionSuggestion={handleSelectExpansionSuggestion}
                        onCloseExpansionModal={handleCloseExpansionModal}
                        reviewingProject={reviewingProject}
                        onReviewProject={setReviewingProject}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />;
        case 'employee':
            if (!activeEmployee) return <div>Error: No hay un empleado activo.</div>;
            
            if (activeView === View.PROFILE) {
                return <ProfileView gamification={activeEmployee.gamification} userName={activeEmployee.name} onReturnToDashboard={handleReturnToDashboardFromProfile} />;
            }
            if (activeView === View.GALLERY) {
                return <GalleryView items={appState.galleryItems} onReturnToDashboard={handleReturnToDashboardFromProfile} />
            }


            if (!activeCourse) {
                return <Dashboard 
                  employee={activeEmployee} 
                  employees={appState.employees}
                  courseTemplates={appState.courseTemplates}
                  onSelectCourse={handleSelectCourse} 
                  onDeleteCourse={handleDeleteCourse} 
                  onLogout={handleLogout} 
                  onSelectProfile={handleSelectProfile} 
                  onSelectKnowledgeBase={handleSelectKnowledgeBase}
                  onSelectGallery={handleSelectGallery}
                  onSelfAssignCourse={handleSelfAssignCourse}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />;
            }
            // --- Employee is in a course ---
            const progress = activeCourse.progress;
            
            const isFirstLessonInCourse = activeModuleIndex === 0 && activeLessonIndex === 0;
            const isLastLessonInModule = activeLessonIndex >= activeCourse.course.modules[activeModuleIndex].lessons.length - 1;
            const isLastModuleInCourse = activeModuleIndex >= activeCourse.course.modules.length - 1;
            const isLastLessonInCourse = isLastLessonInModule && isLastModuleInCourse;
            
            return (
                 <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 overflow-hidden">
                    <ToastContainer toasts={toasts} />
                    {studyToolsState.isOpen && (
                        <StudyToolsModal
                            state={studyToolsState}
                            onClose={handleCloseStudyTools}
                            onSelectToolType={handleSelectStudyToolType}
                            onGenerateTopology={handleGenerateTopology}
                            onSendInterviewMessage={handleSendInterviewMessage}
                            onSimulateSandboxCommand={handleSimulateSandboxCommand}
                            onReset={() => setStudyToolsState(prev => ({...prev, toolType: null, content: null, error: null, interviewHistory: []}))}
                            courseContext={activeCourse.course.title}
                        />
                    )}
                    <DeeperExplanationModal
                        isOpen={explanationState.isOpen}
                        onClose={handleCloseExplanationModal}
                        title={explanationState.lessonTitle}
                        content={explanationState.content}
                        isLoading={explanationState.isLoading}
                        error={explanationState.error}
                        courseContext={activeCourse.course.title}
                    />
                     <RemedialLessonModal state={remedialLessonState} onClose={() => setRemedialLessonState(prev => ({...prev, isOpen: false}))} courseContext={activeCourse.course.title} />
                    {expansionState.courseId && (
                         <ModuleExpansionModal
                            state={{
                                moduleIndex: expansionState.moduleIndex!,
                                moduleTitle: activeCourse.course.modules[expansionState.moduleIndex!].moduleTitle,
                                suggestions: expansionState.suggestions,
                                isLoadingSuggestions: expansionState.isLoadingSuggestions,
                                isGeneratingLesson: expansionState.isGeneratingLesson,
                                error: expansionState.error,
                            }}
                            onClose={handleCloseExpansionModal}
                            onSelectSuggestion={handleSelectExpansionSuggestion}
                        />
                    )}
                    <DiscussionPanelView
                        isOpen={discussionPanelState.isOpen}
                        onClose={handleCloseDiscussionPanel}
                        lessonTitle={activeCourse.course.modules[activeModuleIndex]?.lessons[activeLessonIndex]?.lessonTitle || ''}
                        forumPosts={progress.forums?.[discussionPanelState.lessonKey] || []}
                        currentUser={activeEmployee}
                        onCreatePost={handleCreateForumPost}
                        onCreateReply={handleCreateForumReply}
                        onGenerateSummary={handleGenerateForumSummary}
                        summaryState={{ summary: discussionPanelState.summary, isLoading: discussionPanelState.isLoadingSummary, error: discussionPanelState.error }}
                    />
                    
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                            aria-hidden="true"
                        />
                    )}

                    <div className={`
                        fixed inset-y-0 left-0 z-30 
                        w-80 lg:w-96 h-full 
                        transform transition-transform duration-300 ease-in-out 
                        md:relative md:translate-x-0 md:w-80 lg:w-96 md:shrink-0
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <Sidebar 
                            course={activeCourse.course} 
                            progress={progress} 
                            onSelectLesson={(m, l) => { setActiveView(View.LESSON); setActiveModuleIndex(m); setActiveLessonIndex(l); setIsSidebarOpen(false);}}
                            onSelectQuiz={(m) => {setActiveView(View.QUIZ); setActiveModuleIndex(m); setIsSidebarOpen(false);}}
                            onSelectTutor={() => {setActiveView(View.TUTOR); setIsSidebarOpen(false);}}
                            onSelectFinalProject={() => {setActiveView(View.FINAL_PROJECT); setIsSidebarOpen(false);}}
                            onReturnToDashboard={() => {setActiveCourseId(null); setIsSidebarOpen(false);}}
                            onExportCourse={() => {}}
                            onSelectFlashcards={() => {setActiveView(View.FLASHCARDS); setIsSidebarOpen(false);}}
                            onExpandModuleRequest={(moduleIndex) => handleExpandModuleRequest(activeCourseId!, moduleIndex, 'course')}
                            onOpenStudyTools={handleOpenStudyTools}
                            onSelectExamOrCertificate={() => { handleSelectExamOrCertificate(); setIsSidebarOpen(false); }}
                            onGenerateModuleDescription={handleGenerateModuleDescription}
                            onSelectKnowledgeBase={() => { setActiveView(View.KNOWLEDGE_BASE); setIsSidebarOpen(false); }}
                            isGeneratingDescriptionForModule={isGeneratingDescription}
                            generatingDescriptionError={generatingDescriptionError}
                            onEnrichCourse={handleEnrichCourse}
                            isEnriching={isEnriching}
                            activeView={activeView}
                            activeModuleIndex={activeModuleIndex}
                            activeLessonIndex={activeLessonIndex}
                        />
                    </div>
                    <main className="flex-grow flex flex-col h-full overflow-hidden">
                       <div className="md:hidden flex items-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 shrink-0">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white p-2 -ml-2">
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <h2 className="ml-2 font-bold text-lg truncate text-slate-900 dark:text-white">{activeCourse.course.title}</h2>
                        </div>

                       {activeView === View.COURSE_INTRO && <CourseIntroView course={activeCourse.course} onStart={handleStartCourse} />}
                       {activeView === View.LESSON && <CourseView lesson={activeCourse.course.modules[activeModuleIndex].lessons[activeLessonIndex]} course={activeCourse.course} progress={{...progress, completedItems: new Set(progress.completedItems)}} activeModuleIndex={activeModuleIndex} activeLessonIndex={activeLessonIndex} onLessonComplete={handleLessonComplete} onNavigate={handleNavigateLesson} isFirstLessonInCourse={isFirstLessonInCourse} onRequestDeeperExplanation={handleRequestDeeperExplanation} isLastLessonInModule={isLastLessonInModule} isLastLessonInCourse={isLastLessonInCourse} onOpenDiscussionPanel={handleOpenDiscussionPanel} />}
                       {activeView === View.QUIZ && <QuizView module={activeCourse.course.modules[activeModuleIndex]} moduleIndex={activeModuleIndex} onQuizComplete={handleQuizComplete} onContinue={handleContinueFromQuiz} onReview={handleReviewFromQuiz} />}
                       {activeView === View.FLASHCARDS && <FlashcardView course={activeCourse.course} flashcards={progress.flashcards || []} onStoreFlashcards={handleStoreFlashcards} />}
                       {activeView === View.FINAL_PROJECT && activeCourse.course.finalProject && <FinalProjectView project={activeCourse.course.finalProject} progress={{...progress, completedItems: new Set(progress.completedItems)}} onSubmitProject={handleSubmitProject} courseContext={activeCourse.course.title}/>}
                       {activeView === View.CERTIFICATE && <CertificateView course={activeCourse.course} progress={{...progress, completedItems: new Set(progress.completedItems)}} userName={activeEmployee.name} onUpdateUserName={handleUpdateUserName} />}
                       {activeView === View.TUTOR && <TutorView history={progress.tutorHistory?.[`m${activeModuleIndex}`] || []} topic={activeCourse.course.title} onSendMessage={handleSendMessageToTutor} />}
                       {activeView === View.EXAM && <ExamView examState={progress.finalExamState || { status: 'not_started', attemptsLeft: 3, history: [] }} onSendMessage={handleSendExamMessage} onResetCycle={handleResetExamCycle} courseContext={activeCourse.course.title} />}
                    </main>
                 </div>
            );
    }
  };

  return <div className="h-screen w-screen">{renderContent()}</div>;
};

export default App;