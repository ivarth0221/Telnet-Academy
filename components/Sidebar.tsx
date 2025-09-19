import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { SavedCourse } from '../types';
import { View } from '../types';
import { HomeIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, ChevronDownIcon, DocumentQuestionIcon, SparklesIcon, TrophyIcon, ArrowDownTrayIcon, RectangleStackIcon, PlusCircleIcon, WrenchScrewdriverIcon, AcademicCapIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon, BrainCircuitIcon, LightBulbIcon, XCircleIcon, InformationCircleIcon, ClockIcon } from './IconComponents';

const Sidebar: React.FC = () => {
    const {
        activeCourse,
        activeView,
        activeModuleIndex,
        activeLessonIndex,
        returnToDashboard,
        selectView,
        openStudyTools,
        openExpansionModal
    } = useAppStore(state => ({
        activeCourse: state.getters.activeCourse(),
        activeView: state.activeView,
        activeModuleIndex: state.activeModuleIndex,
        activeLessonIndex: state.activeLessonIndex,
        returnToDashboard: state.returnToDashboard,
        selectView: state.selectView,
        openStudyTools: state.openStudyTools,
        openExpansionModal: state.openExpansionModal,
    }));
    
    const [openModules, setOpenModules] = useState<number[]>([]);

    useEffect(() => {
        // When the active course changes, reset the open modules to all be open by default.
        if (activeCourse) {
            setOpenModules(activeCourse.course.modules.map((_, i) => i));
        }
    }, [activeCourse]);
    
    if (!activeCourse) return null; // Should not happen if rendered correctly
    const { course, progress } = activeCourse;

    const getEligibilityDetails = useMemo(() => {
        // This logic remains the same as it's derived from props (which are now from the store)
        const totalModules = course.modules.length;
        const completedModulesCount = Object.values(progress.moduleStatus || {}).filter(s => s === 'completed').length;
        if (completedModulesCount < totalModules) {
            const modulesLeft = totalModules - completedModulesCount;
            return { isEligible: false, message: `Completa y aprueba ${modulesLeft} módulo${modulesLeft > 1 ? 's' : ''} más.` };
        }
        if (course.finalProject && (!progress.finalProjectEvaluation || progress.finalProjectEvaluation.overallScore < 70)) {
           return { isEligible: false, message: "Completa la evaluación de competencia." };
        }
        return { isEligible: true, message: "¡Listo para el gran final!" };
    }, [course, progress]);

    const renderCertificationButton = () => {
        const { isEligible, message } = getEligibilityDetails;
        const finalExamState = progress.finalExamState;
    
        if (finalExamState?.status === 'passed') {
            return (
                <button
                    onClick={() => selectView(View.CERTIFICATE)}
                    className={`w-full flex flex-col items-center p-3 rounded-md transition-all text-center ${activeView === View.CERTIFICATE ? 'bg-telnet-yellow/20 text-telnet-yellow' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}>
                    <TrophyIcon className="w-5 h-5 mb-1" />
                    <span className="font-semibold text-sm">Ver Certificado</span>
                </button>
            );
        }
    
        let buttonText = 'Examen Final';
        let subText = message;
        let icon = <AcademicCapIcon className="w-5 h-5 mb-1" />;
    
        if (finalExamState) {
            if (finalExamState.status === 'failed_remediation_needed') {
                buttonText = 'Estudiar Refuerzo';
                subText = 'Revisa tu plan para continuar.';
                icon = <BookOpenIcon className="w-5 h-5 mb-1" />;
            } else if (finalExamState.attemptsLeft < 3) {
                buttonText = `Reintentar Examen (${finalExamState.attemptsLeft} restantes)`;
            }
        }
    
        return (
            <div className="relative">
                <button
                    onClick={() => selectView(View.EXAM)}
                    disabled={!isEligible}
                    className={`w-full flex flex-col items-center p-3 rounded-md transition-all text-center ${!isEligible ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' : activeView === View.EXAM ? 'bg-telnet-yellow/20 text-telnet-yellow' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {icon}
                    <span className="font-semibold text-sm">{buttonText}</span>
                </button>
                {!isEligible && (
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-900 text-white text-xs rounded py-1 px-2 pointer-events-none opacity-100 z-10">
                        {subText}
                        <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                    </div>
                )}
            </div>
        );
    };
  
    return (
        <div className="bg-slate-800 h-full flex flex-col p-4 border-r border-slate-700 text-slate-300">
            <header className="mb-6 shrink-0">
                <button onClick={returnToDashboard} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors w-full">
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
                    <button onClick={() => selectView(View.TUTOR)} className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${activeView === View.TUTOR ? 'bg-telnet-yellow text-telnet-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                        <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
                        <span className="text-xs font-semibold mt-1">Asesor IA</span>
                    </button>
                    <button onClick={() => selectView(View.FLASHCARDS)} className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${activeView === View.FLASHCARDS ? 'bg-telnet-yellow text-telnet-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                        <RectangleStackIcon className="w-6 h-6" />
                        <span className="text-xs font-semibold mt-1">Flashcards</span>
                    </button>
                    <button onClick={openStudyTools} className={`col-span-2 flex flex-col items-center justify-center p-2 rounded-md transition-colors bg-slate-700 hover:bg-slate-600`}>
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
                                    <div className="pt-1 pb-3 px-3 border-t border-slate-700">
                                        <ul className="space-y-1 mt-2">
                                            {module.lessons.map((lesson, lessonIndex) => (
                                                <li key={lessonIndex}>
                                                    <button 
                                                        onClick={() => selectView(View.LESSON, moduleIndex, lessonIndex)} 
                                                        disabled={isLocked || isPending}
                                                        className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${activeView === View.LESSON && activeModuleIndex === moduleIndex && activeLessonIndex === lessonIndex ? 'bg-telnet-yellow/20 text-telnet-yellow font-semibold' : 'text-slate-300 hover:bg-slate-700'} disabled:cursor-not-allowed`}
                                                    >
                                                        {progress.completedItems.has(`m${moduleIndex}_l${lessonIndex}`) ? <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" /> : <BookOpenIcon className="w-4 h-4 text-slate-500 shrink-0" />}
                                                        <span>{lesson.lessonTitle}</span>
                                                    </button>
                                                </li>
                                            ))}
                                            <li>
                                                <button 
                                                    onClick={() => selectView(View.QUIZ, moduleIndex)} 
                                                    disabled={isLocked || isPending}
                                                    className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${activeView === View.QUIZ && activeModuleIndex === moduleIndex ? 'bg-telnet-yellow/20 text-telnet-yellow font-semibold' : 'text-slate-300 hover:bg-slate-700'} disabled:cursor-not-allowed`}
                                                >
                                                    {isCompleted ? <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" /> : <DocumentQuestionIcon className="w-4 h-4 text-slate-500 shrink-0" />}
                                                    <span>Prueba del Módulo</span>
                                                </button>
                                            </li>
                                        </ul>
                                        <button onClick={() => openExpansionModal(activeCourse.id, moduleIndex, 'course')} className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-telnet-yellow transition-colors font-semibold p-2">
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
                    <button onClick={() => selectView(View.FINAL_PROJECT)} className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${activeView === View.FINAL_PROJECT ? 'bg-telnet-yellow/20 text-telnet-yellow' : 'bg-slate-700 hover:bg-slate-600'}`}>
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