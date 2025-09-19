import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ClipboardDocumentIcon, PlayCircleIcon, CheckCircleIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

// FIX: Declare 'hljs' on the window object for TypeScript
declare global {
    interface Window {
        hljs: any;
    }
}

interface CodeBlockProps {
  code: string;
  language: string;
  courseContext: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, courseContext }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  useEffect(() => {
    window.hljs?.highlightAll();
  }, [code, language, simulationResult]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    setSimulationResult(null);
    try {
        const result = await geminiService.simulateCommandExecution(code, courseContext);
        setSimulationResult(result);
    } catch(e) {
        setSimulationResult("Error al simular el comando.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="my-4">
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="flex justify-between items-center px-4 py-2 bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase">{language}</span>
          <div className="flex items-center gap-2">
            <button onClick={handleSimulate} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-telnet-yellow transition-colors" disabled={isLoading}>
                <PlayCircleIcon className="w-5 h-5" />
                {isLoading ? 'Simulando...' : 'Simular Ejecución'}
            </button>
            <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-telnet-yellow transition-colors">
                {isCopied ? <CheckCircleIcon className="w-5 h-5 text-brand-green" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                {isCopied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
        <pre className="p-4 text-sm overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
      
      {isLoading && (
        <div className="mt-2 p-4 bg-slate-800 rounded-lg">
          <LoadingSpinner message="Generando salida..." />
        </div>
      )}

      {simulationResult && (
        <div className="mt-2 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <pre className="text-sm whitespace-pre-wrap text-slate-300">
                <code>{simulationResult}</code>
            </pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;