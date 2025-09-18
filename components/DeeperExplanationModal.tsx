import React from 'react';
import { XCircleIcon, LightBulbIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

interface DeeperExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
  isLoading: boolean;
  error: string | null;
  courseContext: string;
}

const DeeperExplanationModal: React.FC<DeeperExplanationModalProps> = ({ isOpen, onClose, title, content, isLoading, error, courseContext }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-telnet-yellow/20 w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <LightBulbIcon className="w-8 h-8 text-telnet-yellow"/>
            <div>
              <h2 className="text-xl font-bold text-white">Idea Clave</h2>
              <p className="text-slate-400 text-sm line-clamp-1">{title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading && <div className="py-16"><LoadingSpinner message="Generando explicación..." /></div>}
          {error && <div className="py-16 text-center text-red-400">Error: {error}</div>}
          {content && <MarkdownRenderer content={content} courseContext={courseContext} />}
        </div>
        
        <div className="p-4 border-t border-slate-700 text-right shrink-0">
             <button
                onClick={onClose}
                className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Entendido
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeeperExplanationModal;
