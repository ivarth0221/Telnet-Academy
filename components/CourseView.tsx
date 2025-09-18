import React, { useEffect, useRef } from 'react';
import type { Lesson, Course, Progress } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, LightBulbIcon, ChatBubbleBottomCenterTextIcon } from './IconComponents';

interface CourseViewProps {
  lesson: Lesson;
  course: Course;
  progress: Progress;
  activeModuleIndex: number;
  activeLessonIndex: number;
  onLessonComplete: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  isFirstLessonInCourse: boolean;
  onRequestDeeperExplanation: () => void;
  isLastLessonInModule: boolean;
  isLastLessonInCourse: boolean;
  onOpenDiscussionPanel: () => void;
}

const ProgressBar: React.FC<{ title: string; value: number; label: string }> = ({ title, value, label }) => (
    <div className="flex-1">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-bold uppercase text-slate-400">{title}</span>
        <span className="text-sm font-semibold text-slate-300">{label}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div className="bg-telnet-yellow h-2 rounded-full transition-all duration-300" style={{ width: `${value}%` }}></div>
      </div>
    </div>
);


const CourseView: React.FC<CourseViewProps> = ({
  lesson,
  course,
  progress,
  activeModuleIndex,
  activeLessonIndex,
  onLessonComplete,
  onNavigate,
  isFirstLessonInCourse,
  onRequestDeeperExplanation,
  isLastLessonInModule,
  isLastLessonInCourse,
  onOpenDiscussionPanel,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentModule = course.modules[activeModuleIndex];
  const currentLesson = lesson;
  const lessonKey = `m${activeModuleIndex}_l${activeLessonIndex}`;
  const isCompleted = progress.completedItems.has(lessonKey);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeModuleIndex, activeLessonIndex]);

  const totalModules = course.modules.length;
  const currentModuleNumber = activeModuleIndex + 1;
  const moduleProgressPercentage = totalModules > 0 ? (currentModuleNumber / totalModules) * 100 : 0;

  const totalLessonsInModule = currentModule?.lessons.length ?? 0;
  const currentLessonNumber = activeLessonIndex + 1;
  const lessonProgressPercentage = totalLessonsInModule > 0 ? (currentLessonNumber / totalLessonsInModule) * 100 : 0;
  
  const getNextButtonContent = () => {
    if (isLastLessonInCourse) {
      return course.finalProject ? 'Ir al Proyecto Final' : 'Ir al Examen Final';
    }
    if (isLastLessonInModule) {
      return 'Ir a la Prueba';
    }
    return 'Siguiente Lección';
  };

  return (
    <div ref={scrollContainerRef} className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
          {currentLesson && currentModule ? (
            <>
              <div className="mb-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex flex-col sm:flex-row gap-6">
                    <ProgressBar 
                        title="Progreso del Módulo" 
                        value={moduleProgressPercentage} 
                        label={`Módulo ${currentModuleNumber} de ${totalModules}`} 
                    />
                    <ProgressBar 
                        title="Progreso de la Lección" 
                        value={lessonProgressPercentage} 
                        label={`Lección ${currentLessonNumber} de ${totalLessonsInModule}`} 
                    />
                </div>
              </div>
              
              <header className="mb-6">
                <span className="text-telnet-yellow font-semibold text-sm">{currentModule.moduleTitle}</span>
                 <div className="flex justify-between items-start gap-4">
                    <h1 className="text-4xl font-bold text-white mt-1 mb-6 flex-grow">{currentLesson.lessonTitle}</h1>
                    <button 
                        onClick={onRequestDeeperExplanation}
                        className="mt-2 flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-telnet-yellow font-semibold py-2 px-4 rounded-md transition-colors border-2 border-slate-700"
                    >
                        <LightBulbIcon className="w-5 h-5" />
                        <span>Idea Clave</span>
                    </button>
                </div>
              </header>
              
              <div className="prose-lg max-w-none flex-grow">
                  <MarkdownRenderer content={currentLesson.initialContent} courseContext={course.title} />
              </div>

              {/* Acciones y Navegación */}
              <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={onOpenDiscussionPanel}
                        className="p-4 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors font-semibold"
                    >
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    </button>
                     <button 
                      onClick={onLessonComplete}
                      className={`font-bold py-4 px-8 rounded-md transition-all duration-300 w-full flex items-center justify-center gap-3 transform hover:scale-105 ${
                          isCompleted
                              ? 'bg-green-900/50 text-green-300 border border-green-700'
                              : 'bg-telnet-yellow text-telnet-black shadow-lg shadow-telnet-yellow/30'
                      }`}
                  >
                      <CheckCircleIcon className="w-6 h-6" />
                      <span>{isCompleted ? 'Lección Completada' : 'Marcar como Completada'}</span>
                  </button>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => onNavigate('prev')} 
                        disabled={isFirstLessonInCourse} 
                        className="p-3 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Lección anterior"
                      >
                          <ChevronLeftIcon className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => onNavigate('next')}
                        disabled={!isCompleted}
                        className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 p-3 px-4 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        aria-label="Siguiente"
                      >
                        <span>{getNextButtonContent()}</span>
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                  </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 flex-grow flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold text-slate-400">Selecciona una lección para comenzar</h2>
              <p className="text-slate-500 mt-2">Usa la barra lateral para navegar por el contenido del curso.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default CourseView;