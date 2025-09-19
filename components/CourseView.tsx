import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import MarkdownRenderer from './MarkdownRenderer';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, LightBulbIcon, ChatBubbleBottomCenterTextIcon } from './IconComponents';

const CourseView: React.FC = () => {
    const {
        activeCourse,
        activeModuleIndex,
        activeLessonIndex,
        lessonComplete,
        navigateLesson,
        requestDeeperExplanation,
        openDiscussionPanel,
    } = useAppStore(state => ({
        activeCourse: state.getters.activeCourse(),
        activeModuleIndex: state.activeModuleIndex,
        activeLessonIndex: state.activeLessonIndex,
        lessonComplete: state.lessonComplete,
        navigateLesson: state.navigateLesson,
        requestDeeperExplanation: state.requestDeeperExplanation,
        openDiscussionPanel: state.openDiscussionPanel,
    }));
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollContainerRef.current?.scrollTo(0, 0);
    }, [activeModuleIndex, activeLessonIndex]);

    if (!activeCourse) {
        return <div>Error: No active course found.</div>;
    }

    const { course, progress } = activeCourse;
    const lesson = course.modules[activeModuleIndex]?.lessons[activeLessonIndex];

    const isFirstLessonInCourse = activeModuleIndex === 0 && activeLessonIndex === 0;
    const isLastLessonInModule = activeLessonIndex >= course.modules[activeModuleIndex].lessons.length - 1;
    const isLastModuleInCourse = activeModuleIndex >= course.modules.length - 1;
    const isLastLessonInCourse = isLastLessonInModule && isLastModuleInCourse;
    const lessonKey = `m${activeModuleIndex}_l${activeLessonIndex}`;
    const isCompleted = progress.completedItems.has(lessonKey);

    const getNextButtonContent = () => {
      if (isLastLessonInCourse) return 'Ir al Proyecto Final';
      if (isLastLessonInModule) return 'Ir a la Prueba';
      return 'Siguiente Lección';
    };

    return (
        <div ref={scrollContainerRef} className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900 flex flex-col">
            <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
                {lesson ? (
                    <>
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-2">{lesson.lessonTitle}</h1>
                            <p className="text-telnet-yellow font-semibold">Módulo {activeModuleIndex + 1}: {course.modules[activeModuleIndex].moduleTitle}</p>
                            <button 
                                onClick={requestDeeperExplanation}
                                className="mt-4 flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-telnet-yellow font-semibold py-2 px-4 rounded-md transition-colors border border-slate-700"
                            >
                                <LightBulbIcon className="w-5 h-5" />
                                <span>Idea Clave (Explicación IA)</span>
                            </button>
                        </header>
                        
                        <div className="prose-lg max-w-none prose-invert flex-grow text-slate-300">
                            <MarkdownRenderer content={lesson.initialContent} courseContext={course.title} />
                        </div>

                        {/* Actions & Navigation */}
                        <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={openDiscussionPanel}
                                    className="p-4 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors font-semibold"
                                    title="Abrir panel de discusión"
                                >
                                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={lessonComplete}
                                    className={`w-full font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors ${isCompleted ? 'bg-green-800/50 text-green-400 cursor-default' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                                >
                                    <CheckCircleIcon className="w-6 h-6" />
                                    <span>{isCompleted ? 'Lección Completada' : 'Marcar como Completada'}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button onClick={() => navigateLesson('prev')} disabled={isFirstLessonInCourse} className="p-3 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => navigateLesson('next')} disabled={!isCompleted} className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 font-semibold p-3 bg-telnet-yellow text-telnet-black rounded-md hover:bg-telnet-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span>{getNextButtonContent()}</span>
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <h2 className="text-2xl font-bold">Lección no encontrada</h2>
                        <p>Parece que ha habido un error al cargar esta lección.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseView;
