import React from 'react';
import type { ModuleExpansionState } from '../types';
import { XCircleIcon, SparklesIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

interface ModuleExpansionModalProps {
  state: ModuleExpansionState;
  onClose: () => void;
  onSelectSuggestion: (suggestion: string) => void;
}

const ModuleExpansionModal: React.FC<ModuleExpansionModalProps> = ({ state, onClose, onSelectSuggestion }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-telnet-yellow/20 w-full max-w-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Expandir Módulo</h2>
            <p className="text-slate-400">{state.moduleTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          {state.isLoadingSuggestions && (
            <div className="text-center py-8">
              <LoadingSpinner message="Buscando temas para profundizar..." />
            </div>
          )}

          {state.isGeneratingLesson && (
             <div className="text-center py-8">
                <LoadingSpinner message="Generando nueva lección..." />
             </div>
          )}

          {state.error && (
            <div className="text-center py-8 text-red-400">
              <p>Ocurrió un error:</p>
              <p className="font-mono text-sm mt-2">{state.error}</p>
            </div>
          )}

          {!state.isLoadingSuggestions && !state.isGeneratingLesson && state.suggestions.length > 0 && (
            <div>
              <p className="text-slate-300 mb-4">
                Aquí tienes algunas ideas para profundizar en este módulo. Elige una para añadirla a tu curso:
              </p>
              <ul className="space-y-3">
                {state.suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onSelectSuggestion(suggestion)}
                      className="w-full text-left p-4 bg-slate-700/50 hover:bg-telnet-yellow/20 border border-slate-600 hover:border-telnet-yellow rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-telnet-yellow transition-colors shrink-0" />
                        <span className="font-semibold text-slate-200">{suggestion}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!state.isLoadingSuggestions && !state.isGeneratingLesson && !state.error && state.suggestions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No se pudieron generar sugerencias en este momento.</p>
              <p className="text-slate-500 text-sm mt-2">Intenta expandir otro módulo o inténtalo de nuevo más tarde.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleExpansionModal;