import React, { useState, useMemo } from 'react';
import type { Course, SavedCourse } from '../types';
import { View } from '../types';
import { HomeIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, ChevronDownIcon, DocumentQuestionIcon, SparklesIcon, TrophyIcon, ArrowDownTrayIcon, RectangleStackIcon, PlusCircleIcon, WrenchScrewdriverIcon, AcademicCapIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon, BrainCircuitIcon, LightBulbIcon, XCircleIcon, InformationCircleIcon, ClockIcon } from './IconComponents';

interface SidebarProps {
  course: Course;
  progress: SavedCourse['progress'];
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
  onSelectQuiz: (moduleIndex: number) => void;
  onSelectTutor: () => void;
  onSelectFinalProject: () => void;
  onReturnToDashboard: () => void;
  onExportCourse: () => void;
  onSelectFlashcards: () => void;
  onExpandModuleRequest: (moduleIndex: number) => void;
  onOpenStudyTools: () => void;
  onSelectExamOrCertificate: () => void;
  onGenerateModuleDescription: (moduleIndex: number) => void;
  onSelectKnowledgeBase: () => void;
  isGeneratingDescriptionForModule: number | null;
  generatingDescriptionError: Record<number, string | null>;
  onEnrichCourse: () => void;
  isEnriching: boolean;
  activeView: View;
  activeModuleIndex: number;
  activeLessonIndex: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  course,
  progress,
  onSelectLesson,
  onSelectQuiz,
  onSelectTutor,
  onSelectFinalProject,
  onReturnToDashboard,
  onExportCourse,
  onSelectFlashcards,
  onExpandModuleRequest,
  onOpenStudyTools,
  onSelectExamOrCertificate,
  onGenerateModuleDescription,
  onSelectKnowledgeBase,
  isGeneratingDescriptionForModule,
  generatingDescriptionError,
  onEnrichCourse,
  isEnriching,
  activeView,
  activeModuleIndex,
  activeLessonIndex,
}) => {
  const [openModules, setOpenModules] = useState<number[]>(course.modules.map((_, i) => i));

  const getEligibilityDetails = useMemo(() => {
    const totalModules = course.modules.length;
    const completedModulesCount = Object.values(progress.moduleStatus || {}).filter(s => s === 'completed').length;
    
    const modulesLeft = totalModules - completedModulesCount;
    if (modulesLeft > 0) {
        return { isEligible: false, message: `Completa y aprueba ${modulesLeft} módulo${modulesLeft > 1 ? 's' : ''} más.` };
    }

    const projectNeeded = !!course.finalProject;
    const projectPassed = !!progress.finalProjectEvaluation && progress.finalProjectEvaluation.overallScore >= 70;
    if (projectNeeded && !projectPassed) {
       return { isEligible: false, message: "Completa la evaluación de competencia." };
    }

    return { isEligible: true, message: "¡Listo para el gran final!" };
  }, [course, progress]);

  const progressSummary = useMemo(() => {
    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedLessons = Array.from(progress.completedItems).filter(item => item.startsWith('m') && item.includes('_l')).length;

    let lastQuizResult: { score: number; total: number } | null = null;
    if (progress.quizScores) {
        const quizKeys = Object.keys(progress.quizScores);
        if (quizKeys.length > 0) {
            const lastModuleIndex = Math.max(...quizKeys.map(k => parseInt(k.replace('m', ''))));
            lastQuizResult = progress.quizScores[`m${lastModuleIndex}`];
        }
    }

    return {
        totalLessons,
        completedLessons,
        lastQuizResult,
        progressPercentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
    };
  }, [course, progress]);

  const renderCertificationButton = () => {
    const { isEligible, message } = getEligibilityDetails;
    const finalExamState = progress.finalExamState;
    const baseClasses = 'w-full flex flex-col items-center p-3 rounded-md transition-all text-center';

    if (isEligible) {
      let text = "Iniciar Examen Final";
      let styleClasses = "bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black";
      let disabled = false;
      
      if (finalExamState) {
          switch(finalExamState.status) {
              case 'passed':
                  text = "Generar Certificado";
                  styleClasses = "bg-brand-green hover:bg-green-500 text-white";
                  break;
              case 'failed_remediation_needed':
                  text = "Plan de Estudio Requerido";
                  styleClasses = "bg-slate-600 cursor-not-allowed text-slate-400";
                  disabled = true;
                  break;
              case 'in_progress':
                  text = "Continuar Examen Final";
                  styleClasses = "bg-amber-500 hover:bg-amber-400 text-black";
                  break;
               default:
                  if(finalExamState.attemptsLeft < 3) {
                      text = `Reintentar Examen (${finalExamState.attemptsLeft} restantes)`;
                  }
                  break;
          }
      }
       return (
          <button
            onClick={onSelectExamOrCertificate}
            disabled={disabled}
            className={`${baseClasses} ${styleClasses} ${activeView === View.EXAM || activeView === View.CERTIFICATE ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-telnet-yellow' : ''}`}
          >
            <div className="flex items-center">
                <AcademicCapIcon className="w-5 h-5 mr-3 shrink-0" />
                <span className="flex-grow font-semibold">{text}</span>
            </div>
          </button>
      );

    } else {
        const isLastStep = message.includes("evaluación"); // A simple heuristic
        return (
             <button
                disabled
                className={`${baseClasses} bg-slate-700 cursor-not-allowed text-slate-300 ${isLastStep ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-3 shrink-0" />
                    <span className="flex-grow font-semibold">Examen Bloqueado</span>
                </div>
                <span className="text-xs mt-1 text-slate-400">{message}</span>
              </button>
        );
    }
  };
  
    return (
    <div className="bg-slate-800 h-full flex flex-col p-4 border-r border-slate-700 text-slate-300">
      <header className="mb-6 shrink-0">
        <button onClick={onReturnToDashboard} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors w-full">
            <HomeIcon className="w-6 h-6" />
            <span className="font-bold text-lg">Panel Principal</span>
        </button>
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <h2 className="font-bold text-lg text-telnet-yellow line-clamp-2">{course.title}</h2>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
            <button onClick={onSelectTutor} className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${activeView === View.TUTOR ? 'bg-telnet-yellow text-telnet-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
                <span className="text-xs font-semibold mt-1">Asesor IA</span>
            </button>
            <button onClick={onSelectFlashcards} className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${activeView === View.FLASHCARDS ? 'bg-telnet-yellow text-telnet-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <RectangleStackIcon className="w-6 h-6" />
                <span className="text-xs font-semibold mt-1">Flashcards</span>
            </button>
             <button onClick={onOpenStudyTools} className={`col-span-2 flex flex-col items-center justify-center p-2 rounded-md transition-colors bg-slate-700 hover:bg-slate-600`}>
                <BrainCircuitIcon className="w-6 h-6" />
                <span className="text-xs font-semibold mt-1">Laboratorio de Simulación</span>
            </button>
        </div>
        
        {/* Modules */}
        <div className="space-y-2">
          {course.modules.map((module, moduleIndex) => {
            const moduleKey = `m${moduleIndex}`;
            const status = progress.moduleStatus?.[moduleKey] || 'locked';
            const isLocked = status === 'locked';
            const isPending = status === 'pending_review';
            const isCompleted = status === 'completed';

            return (
              <div key={moduleIndex} className={`bg-slate-700/50 rounded-lg ${isLocked || isPending ? 'opacity-60' : ''}`}>
                  <button onClick={() => setOpenModules(openModules.includes(moduleIndex) ? openModules.filter(i => i !== moduleIndex) : [...openModules, moduleIndex])} className="w-full flex justify-between items-center p-3 text-left">
                      <span className="font-semibold text-slate-300 text-sm flex items-center gap-2">
                        {isCompleted && <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" />}
                        {isPending && <ClockIcon className="w-4 h-4 text-amber-500 shrink-0" />}
                        Módulo {moduleIndex + 1}: {module.moduleTitle}
                      </span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${openModules.includes(moduleIndex) ? 'rotate-180' : ''}`} />
                  </button>
                  {openModules.includes(moduleIndex) && (
                      <div className="p-3 border-t border-slate-700">
                          <ul className="space-y-1">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const lessonKey = `m${moduleIndex}_l${lessonIndex}`;
                              const hasPosts = (progress.forums?.[lessonKey]?.length ?? 0) > 0;
                              return (
                                  <li key={lessonIndex}>
                                      <button 
                                        onClick={() => onSelectLesson(moduleIndex, lessonIndex)} 
                                        disabled={isLocked || isPending}
                                        className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${activeView === View.LESSON && activeModuleIndex === moduleIndex && activeLessonIndex === lessonIndex ? 'bg-telnet-yellow/20 text-telnet-yellow font-semibold' : 'text-slate-300 hover:bg-slate-700'} disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                                      >
                                          {progress.completedItems.includes(`m${moduleIndex}_l${lessonIndex}`) ? <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" /> : <BookOpenIcon className="w-4 h-4 text-slate-500 shrink-0" />}
                                          <span className="flex-grow">{lesson.lessonTitle}</span>
                                          {hasPosts && <span title="Esta lección tiene discusiones"><ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-sky-400 shrink-0" /></span>}
                                      </button>
                                  </li>
                              );
                            })}
                             <li key="quiz">
                                  <button 
                                    onClick={() => onSelectQuiz(moduleIndex)} 
                                    disabled={isLocked || isPending}
                                    className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${activeView === View.QUIZ && activeModuleIndex === moduleIndex ? 'bg-telnet-yellow/20 text-telnet-yellow font-semibold' : 'text-slate-300 hover:bg-slate-700'} disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                                  >
                                      {isCompleted ? <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" /> : <DocumentQuestionIcon className="w-4 h-4 text-slate-500 shrink-0" />}
                                      <span>Prueba del Módulo</span>
                                  </button>
                              </li>
                          </ul>
                           <button onClick={() => onExpandModuleRequest(moduleIndex)} className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-telnet-yellow transition-colors font-semibold p-2">
                              <PlusCircleIcon className="w-4 h-4" />
                              Expandir Módulo
                          </button>
                      </div>
                  )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-700 space-y-3 shrink-0">
         {course.finalProject && (
            <button onClick={onSelectFinalProject} className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${activeView === View.FINAL_PROJECT ? 'bg-telnet-yellow/20 text-telnet-yellow' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <WrenchScrewdriverIcon className="w-5 h-5 mr-3 shrink-0" />
                <span className="flex-grow font-semibold">Evaluación de Competencia</span>
            </button>
         )}
        {renderCertificationButton()}
      </div>
    </div>
  );
};

export default Sidebar;