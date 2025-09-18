import React, { useState } from 'react';
import type { CourseTemplate } from '../types';
import { XCircleIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon, DocumentQuestionIcon, LightBulbIcon, SparklesIcon } from './IconComponents';

interface CourseTemplateDetailModalProps {
  template: CourseTemplate;
  onClose: () => void;
  onExpandModule: (moduleIndex: number) => void;
}

const CourseTemplateDetailModal: React.FC<CourseTemplateDetailModalProps> = ({ template, onClose, onExpandModule }) => {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const { course } = template;

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleIndex)
        ? prev.filter(i => i !== moduleIndex)
        : [...prev, moduleIndex]
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Detalles de la Ruta Maestra</h2>
            <p className="text-slate-400 text-sm">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-300 mb-6">{course.description}</p>
          
          <h3 className="text-lg font-bold text-white mb-4">Módulos del Curso</h3>
          <div className="space-y-3">
            {course.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="bg-slate-900/50 rounded-lg border border-slate-700">
                <button
                  onClick={() => toggleModule(moduleIndex)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <span className="font-semibold text-white">{module.moduleTitle}</span>
                  {expandedModules.includes(moduleIndex) ? (
                    <ChevronUpIcon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedModules.includes(moduleIndex) && (
                  <div className="p-4 border-t border-slate-700">
                    {module.learningObjectives && module.learningObjectives.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-telnet-yellow mb-2 flex items-center gap-2"><LightBulbIcon className="w-5 h-5" /> Objetivos de Aprendizaje</h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                          {module.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="mb-4">
                      <h4 className="font-semibold text-telnet-yellow mb-2 flex items-center gap-2"><BookOpenIcon className="w-5 h-5" /> Lecciones</h4>
                      <ul className="list-decimal list-inside text-slate-300 text-sm space-y-1">
                        {module.lessons.map((lesson, i) => <li key={i}>{lesson.lessonTitle}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-telnet-yellow mb-2 flex items-center gap-2"><DocumentQuestionIcon className="w-5 h-5" /> Prueba del Módulo</h4>
                       <ul className="space-y-2 text-sm text-slate-300">
                        {module.quiz.map((q, i) => <li key={i}>{i + 1}. {q.question}</li>)}
                      </ul>
                    </div>
                     <div className="mt-4 pt-4 border-t border-slate-600/50">
                        <button
                            onClick={() => onExpandModule(moduleIndex)}
                            className="flex items-center gap-2 text-sm bg-telnet-yellow/10 hover:bg-telnet-yellow/20 text-telnet-yellow font-semibold py-2 px-3 rounded-md transition-colors"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            Expandir Módulo con IA
                        </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTemplateDetailModal;