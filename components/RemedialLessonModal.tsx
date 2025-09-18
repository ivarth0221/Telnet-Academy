import React from 'react';
import type { RemedialLesson } from '../types';
import { XCircleIcon, BrainCircuitIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

interface RemedialLessonModalProps {
  state: {
    isOpen: boolean;
    lesson: RemedialLesson | null;
    isLoading: boolean;
    error: string | null;
  };
  onClose: () => void;
  courseContext: string;
}

const RemedialLessonModal: React.FC<RemedialLessonModalProps> = ({ state, onClose, courseContext }) => {
  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-telnet-yellow/20 w-full max-w-3xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <BrainCircuitIcon className="w-8 h-8 text-telnet-yellow"/>
                <div>
                    <h2 className="text-xl font-bold text-white">Lección de Refuerzo de IA</h2>
                    <p className="text-slate-400 text-sm">Contenido generado para aclarar tus dudas.</p>
                </div>
            </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {state.isLoading && (
            <div className="text-center py-16">
              <LoadingSpinner message="Analizando tus respuestas y generando una lección..." />
            </div>
          )}

          {state.error && (
            <div className="text-center py-16 text-red-400">
              <p>Ocurrió un error:</p>
              <p className="font-mono text-sm mt-2">{state.error}</p>
            </div>
          )}
          
          {state.lesson && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{state.lesson.title}</h3>
              <MarkdownRenderer content={state.lesson.content} courseContext={courseContext} />
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-700 text-right">
             <button
                onClick={onClose}
                className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Entendido, ¡listo para reintentar!
            </button>
        </div>
      </div>
    </div>
  );
};

export default RemedialLessonModal;