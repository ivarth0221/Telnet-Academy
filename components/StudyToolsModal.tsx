import React, { useState } from 'react';
import type { StudyToolsState, StudyToolType, MindMapNode, InterviewStep, NetworkTopology, NetworkDevice } from '../types';
import { XCircleIcon, BriefcaseIcon, ShareIcon, ChevronLeftIcon, PaperAirplaneIcon, SparklesIcon, NetworkIcon, TerminalIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import MindMapRenderer from './MindMapRenderer';
import TopologyVisualizer from './TopologyVisualizer';

interface StudyToolsModalProps {
  state: StudyToolsState;
  onClose: () => void;
  onSelectToolType: (toolType: StudyToolType) => void;
  onGenerateTopology: (prompt: string) => void;
  onSendInterviewMessage: (message: string) => void;
  onSimulateSandboxCommand: (command: string) => void;
  onReset: () => void;
  courseContext: string;
}

const ToolButton: React.FC<{ icon: React.FC<any>, label: string, description: string, onClick: () => void, disabled?: boolean }> = ({ icon: Icon, label, description, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left p-6 bg-slate-700/50 hover:bg-telnet-yellow/20 border border-slate-600 hover:border-telnet-yellow rounded-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start gap-4">
        <Icon className="w-8 h-8 text-telnet-yellow transition-colors shrink-0 mt-1" />
        <div>
            <span className="font-semibold text-lg text-slate-200">{label}</span>
            <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
      </div>
    </button>
);

const InterviewChat: React.FC<{ history: InterviewStep[], onSendMessage: (msg: string) => void, courseContext: string }> = ({ history, onSendMessage, courseContext }) => {
    const [input, setInput] = useState('');
    const chatEndRef = React.useRef<HTMLDivElement>(null);
    const isThinking = history.some(m => m.isStreaming);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="h-[60vh] flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {history.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-telnet-yellow flex items-center justify-center shrink-0 mt-1">
                                <SparklesIcon className="w-5 h-5 text-telnet-black" />
                            </div>
                        )}
                        <div className={`p-4 rounded-lg max-w-xl ${msg.role === 'user' ? 'bg-slate-700' : 'bg-slate-900/50'}`}>
                            <MarkdownRenderer content={msg.content} courseContext={courseContext} />
                             {msg.isStreaming && <span className="inline-block w-2 h-4 bg-telnet-yellow animate-pulse ml-1"></span>}
                        </div>
                    </div>
                ))}
                 <div ref={chatEndRef} />
            </div>
             <form onSubmit={handleFormSubmit} className="relative mt-4 shrink-0">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(e); }}}
                    placeholder={isThinking ? "El entrevistador está pensando..." : "Tu respuesta..."}
                    className="w-full p-3 pr-14 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-telnet-yellow outline-none resize-none"
                    rows={2}
                    disabled={isThinking}
                />
                <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black disabled:bg-slate-600"
                    disabled={isThinking || !input.trim()}
                >
                    <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
                </button>
            </form>
        </div>
    );
};

const CommandSandbox: React.FC<{ result: string | null, isLoading: boolean, onSimulate: (command: string) => void }> = ({ result, isLoading, onSimulate }) => {
    const [command, setCommand] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isLoading) return;
        onSimulate(command);
    };

    return (
        <div className="h-[60vh] flex flex-col">
            <form onSubmit={handleSubmit} className="shrink-0">
                <label htmlFor="command-input" className="block text-sm font-medium text-slate-300 mb-2">Ingresa un comando o script para simular</label>
                <textarea
                    id="command-input"
                    value={command}
                    onChange={e => setCommand(e.target.value)}
                    placeholder="Ej: display ont info by-sn HWTCC854F9B2"
                    className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg font-mono text-sm focus:ring-2 focus:ring-telnet-yellow outline-none resize-y"
                    rows={4}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!command.trim() || isLoading}
                    className="w-full mt-2 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                    <TerminalIcon className="w-5 h-5"/>
                    {isLoading ? 'Simulando...' : 'Simular Ejecución'}
                </button>
            </form>
            <div className="mt-4 flex-grow overflow-y-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                {isLoading && <LoadingSpinner message="Generando salida..." />}
                {result && (
                    <pre className="text-sm whitespace-pre-wrap text-slate-300">
                        <code>{result}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}

const StudyToolsModal: React.FC<StudyToolsModalProps> = ({ state, onClose, onSelectToolType, onGenerateTopology, onSendInterviewMessage, onSimulateSandboxCommand, onReset, courseContext }) => {
    const [topologyPrompt, setTopologyPrompt] = useState('');

    const handleTopologySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topologyPrompt.trim()) return;
        onGenerateTopology(topologyPrompt);
    };

    const renderContent = () => {
        if (state.isLoading) {
            let message = `Generando ${state.toolType}...`;
            if (state.toolType === 'topology') message = 'Visualizando la topología de red...';
            if (state.toolType === 'interview') message = 'Preparando al entrevistador...';
            return <div className="py-16"><LoadingSpinner message={message} /></div>;
        }

        if (state.error) {
            return <div className="py-16 text-center text-red-400">Error: {state.error}</div>;
        }

        if (state.toolType === 'topology' && !state.content) {
            return (
                <form onSubmit={handleTopologySubmit} className="p-4">
                    <label htmlFor="topology-prompt" className="block text-lg font-medium text-slate-300 mb-3">
                        Describe la topología de red que quieres visualizar
                    </label>
                    <textarea
                        id="topology-prompt"
                        value={topologyPrompt}
                        onChange={(e) => setTopologyPrompt(e.target.value)}
                        placeholder="Ej: 'Una red de oficina simple con 2 VLANs, un switch y un router MikroTik conectado a internet'."
                        className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-telnet-yellow outline-none resize-y"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={!topologyPrompt.trim()}
                        className="w-full mt-4 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-700 disabled:cursor-not-allowed"
                    >
                        Generar Diagrama Interactivo
                    </button>
                </form>
            );
        }

        if (state.content || state.toolType === 'interview' || state.toolType === 'sandbox') {
             switch (state.toolType) {
                case 'mindmap':
                    return <MindMapRenderer root={state.content as MindMapNode} />;
                case 'topology':
                    return <TopologyVisualizer topology={state.content as NetworkTopology} />;
                case 'interview':
                    return <InterviewChat history={state.interviewHistory} onSendMessage={onSendInterviewMessage} courseContext={courseContext} />;
                case 'sandbox':
                    return <CommandSandbox result={state.content as string | null} isLoading={state.isLoading} onSimulate={onSimulateSandboxCommand} />;
            }
        }
        
        return (
             <div className="space-y-4">
                 <ToolButton 
                    icon={TerminalIcon} 
                    label="Laboratorio de Comandos"
                    description="Escribe comandos y scripts para que la IA simule su salida. Ideal para practicar en un entorno seguro."
                    onClick={() => onSelectToolType('sandbox')} 
                    disabled={state.isLoading} 
                />
                 <ToolButton 
                    icon={NetworkIcon} 
                    label="Visualizador de Topología"
                    description="Describe una red y la IA generará un diagrama interactivo para explicarla."
                    onClick={() => onSelectToolType('topology')} 
                    disabled={state.isLoading} 
                />
                <ToolButton 
                    icon={BriefcaseIcon} 
                    label="Simulador de Entrevista"
                    description="Pon a prueba tus conocimientos en un caso práctico simulado."
                    onClick={() => onSelectToolType('interview')} 
                    disabled={state.isLoading} 
                />
                <ToolButton 
                    icon={ShareIcon} 
                    label="Mapa Mental"
                    description="Visualiza la estructura completa del curso y sus conexiones."
                    onClick={() => onSelectToolType('mindmap')} 
                    disabled={state.isLoading} 
                />
            </div>
        );
    };

    const toolTitles: Record<StudyToolType, string> = {
        mindmap: 'Mapa Mental',
        interview: 'Simulador de Entrevista',
        topology: 'Visualizador de Topología',
        sandbox: 'Laboratorio de Comandos',
    };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-telnet-yellow/20 w-full max-w-4xl border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             {state.toolType && (
                 <button onClick={onReset} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                     <ChevronLeftIcon className="w-6 h-6" />
                 </button>
             )}
            <h2 className="text-xl font-bold text-white">{state.toolType ? toolTitles[state.toolType] : 'Laboratorio de Simulación IA'}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudyToolsModal;