import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { TutorMessage } from '../types';
import { PaperAirplaneIcon, SparklesIcon, MagnifyingGlassIcon } from './IconComponents';
import MarkdownRenderer from './MarkdownRenderer';

const BlinkingCursor = () => (
    <span className="inline-block w-2.5 h-5 bg-telnet-yellow animate-pulse ml-1" style={{ animationDuration: '1s' }}></span>
);

const TutorView: React.FC = () => {
    const { history, topic, sendMessage } = useAppStore(state => {
        const activeCourse = state.getters.activeCourse();
        return {
            history: activeCourse?.progress.tutorHistory?.['global'] || [],
            topic: activeCourse?.course.title ?? 'Asesoramiento General',
            sendMessage: state.sendMessageToTutor,
        }
    });

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isThinking = history.some(m => m.isStreaming);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isThinking]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  const renderMessageContent = (msg: TutorMessage) => {
    const baseClasses = "max-w-xl lg:max-w-3xl p-4 rounded-2xl";
    const roleClasses = msg.role === 'user' 
        ? 'bg-slate-700 text-white rounded-br-lg' 
        : 'bg-slate-800 text-slate-300 rounded-bl-lg';
    
    return (
      <div className={`${baseClasses} ${roleClasses}`}>
        <MarkdownRenderer content={msg.content} courseContext={topic} />
        {msg.isStreaming && <BlinkingCursor />}
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-4 h-4" />
              FUENTES
            </h4>
            <ul className="text-xs space-y-1">
              {msg.sources.map(source => (
                <li key={source.uri} className="truncate">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-telnet-yellow hover:underline">
                    {source.title || source.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden bg-slate-900/50">
      <div className="text-center mb-4 border-b border-slate-700 pb-4">
        <h1 className="text-2xl font-bold text-white">Asesor Técnico IA</h1>
        <p className="text-slate-400">Asistente experto para tu plan de desarrollo: <span className="font-semibold text-telnet-yellow">{topic}</span></p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {history.length === 0 && (
            <div className="text-center text-slate-500 pt-16">
                <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Soy tu Asesor Técnico IA de TELNET CO. <br/> Estoy aquí para ayudarte a resolver dudas y aplicar tus conocimientos en nuestros sistemas.</p>
            </div>
        )}
        {history.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-telnet-yellow flex items-center justify-center shrink-0 mt-1">
                    <SparklesIcon className="w-5 h-5 text-telnet-black" />
                </div>
            )}
            {renderMessageContent(msg)}
          </div>
        ))}
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
            placeholder={isThinking ? "El asesor está analizando..." : "Haz una pregunta técnica..."}
            className="w-full p-4 pr-16 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-telnet-yellow focus:border-telnet-yellow outline-none transition-colors resize-none"
            rows={2}
            disabled={isThinking}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={isThinking || !input.trim()}
          >
            <PaperAirplaneIcon className="w-6 h-6 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorView;
