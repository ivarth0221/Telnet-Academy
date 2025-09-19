import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { TutorMessage, FinalExamState } from '../types';
import { PaperAirplaneIcon, SparklesIcon, AcademicCapIcon, CheckCircleIcon, XCircleIcon, BookOpenIcon } from './IconComponents';
import MarkdownRenderer from './MarkdownRenderer';
import LoadingSpinner from './LoadingSpinner';

const BlinkingCursor = () => (
    <span className="inline-block w-2.5 h-5 bg-telnet-yellow animate-pulse ml-1" style={{ animationDuration: '1s' }}></span>
);

const ExamView: React.FC = () => {
    const { 
        examState, 
        courseContext, 
        sendExamMessage, 
        resetExamCycle 
    } = useAppStore(state => {
        const activeCourse = state.getters.activeCourse();
        // FIX: Provide a default value that conforms to the FinalExamState type to avoid type errors.
        const defaultExamState: FinalExamState = { status: 'not_started', attemptsLeft: 3, history: [] };
        return {
            examState: activeCourse?.progress.finalExamState ?? defaultExamState,
            courseContext: activeCourse?.course.title ?? '',
            sendExamMessage: state.sendExamMessage,
            resetExamCycle: state.resetExamCycle,
        }
    });
    
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const isThinking = examState.history.some(m => m.isStreaming);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [examState.history, isThinking]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking || examState.status !== 'in_progress') return;
    sendExamMessage(input);
    setInput('');
  };

  const renderMessageContent = (msg: TutorMessage) => {
    const baseClasses = "max-w-xl lg:max-w-3xl p-4 rounded-2xl";
    const roleClasses = msg.role === 'user' 
        ? 'bg-slate-700 text-white rounded-br-lg' 
        : 'bg-slate-800 text-slate-300 rounded-bl-lg';
    
    return (
      <div className={`${baseClasses} ${roleClasses}`}>
        <MarkdownRenderer content={msg.content} courseContext={courseContext} />
        {msg.isStreaming && <BlinkingCursor />}
      </div>
    );
  }

  const renderExamResult = () => {
    if (examState.status === 'passed') {
        return (
            <div className="bg-green-900/50 border border-green-700 text-center p-6 rounded-lg">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">¡Examen Aprobado!</h2>
                <p className="text-slate-300 mt-2">Has demostrado exitosamente tu competencia.</p>
                {examState.lastFeedback && <div className="mt-4 text-left text-sm"><MarkdownRenderer content={examState.lastFeedback} courseContext={courseContext}/></div>}
            </div>
        );
    }
    if (examState.status === 'failed_remediation_needed') {
        return (
            <div className="bg-red-900/50 border border-red-700 text-center p-6 rounded-lg">
                <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Ciclo de Intentos Completado</h2>
                <p className="text-slate-300 mt-2">Para volver a intentarlo, primero debes estudiar tu plan de refuerzo personalizado.</p>
                <div className="mt-6 text-left bg-slate-800 p-4 rounded-md">
                     <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><BookOpenIcon className="w-5 h-5"/>Plan de Estudio de Refuerzo</h3>
                    {examState.remediationPlan ? <MarkdownRenderer content={examState.remediationPlan} courseContext={courseContext} /> : <LoadingSpinner message="Generando plan..."/> }
                </div>
                 <button 
                    onClick={resetExamCycle} 
                    disabled={!examState.remediationPlan}
                    className="mt-6 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    He estudiado, ¡listo para un nuevo ciclo!
                </button>
            </div>
        );
    }
    // Only show this feedback when the exam is NOT in progress (i.e., status is 'not_started')
    // This avoids showing old feedback when a new attempt is 'in_progress'.
    if (examState.lastFeedback && examState.status !== 'in_progress') {
         return (
            <div className="bg-yellow-900/50 border border-yellow-700 text-center p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white">Intento no superado</h2>
                <p className="text-slate-300 mt-2">Revisa el feedback para prepararte mejor. Puedes iniciar tu próximo intento desde la barra lateral cuando estés listo.</p>
                <div className="mt-4 text-left text-sm"><MarkdownRenderer content={examState.lastFeedback} courseContext={courseContext}/></div>
            </div>
        );
    }
    return null;
  }

  return (
    <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden bg-slate-900/50">
      <header className="text-center mb-4 border-b border-slate-700 pb-4">
        <AcademicCapIcon className="w-10 h-10 mx-auto text-telnet-yellow mb-2"/>
        <h1 className="text-2xl font-bold text-white">Examen de Competencia Final</h1>
        <p className="text-slate-400">Demuestra tu dominio del material para obtener tu certificado.</p>
        {examState.status !== 'passed' && examState.status !== 'failed_remediation_needed' && (
             <p className="mt-2 font-bold text-yellow-400">Intento {4 - examState.attemptsLeft} de 3</p>
        )}
      </header>

      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {examState.history.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-telnet-yellow flex items-center justify-center shrink-0 mt-1">
                    <SparklesIcon className="w-5 h-5 text-telnet-black" />
                </div>
            )}
            {renderMessageContent(msg)}
          </div>
        ))}
        {!isThinking && renderExamResult()}
         <div ref={chatEndRef} />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <form onSubmit={handleFormSubmit} className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                }
            }}
            placeholder={examState.status === 'in_progress' && !isThinking ? "Escribe tu respuesta..." : "El examinador está esperando..."}
            className="w-full p-4 pr-16 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-telnet-yellow focus:border-telnet-yellow outline-none transition-colors resize-none"
            rows={2}
            disabled={isThinking || examState.status !== 'in_progress'}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={isThinking || !input.trim() || examState.status !== 'in_progress'}
          >
            <PaperAirplaneIcon className="w-6 h-6 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamView;