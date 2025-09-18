import React, { useState } from 'react';
import { SparklesIcon, ChatBubbleBottomCenterTextIcon, WrenchScrewdriverIcon, LightBulbIcon } from './IconComponents';
import { generateClarifyingQuestions } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import type { ClarifyingQuestionWithOptions } from '../types';

type DepthLevel = 'Básico' | 'Intermedio' | 'Avanzado';

export interface CourseWizardPayload {
  initialTopic: string;
  role: string;
  depth: DepthLevel;
  tone: string;
  focus: string;
  answers: { question: string; answer: string }[];
}

interface TopicInputProps {
  onTopicSubmit: (submission: CourseWizardPayload) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const roleOptions = [
    {
        title: 'Todos los cargos',
        description: 'Una ruta de habilidad general, aplicable a cualquier colaborador en la empresa.'
    },
    {
        title: 'Agente de Soporte Nivel 1',
        description: 'Primer punto de contacto. Resuelve problemas básicos y registra casos en Splynx.'
    },
    {
        title: 'Auxiliar NOC (Soporte Nivel 2)',
        description: 'Diagnostica y resuelve problemas de red de forma remota usando OLT Cloud.'
    },
    {
        title: 'Técnico Instalador FTTH',
        description: 'Ejecuta instalaciones y reparaciones en campo, garantizando la calidad de la señal.'
    },
    {
        title: 'Ingeniero de Red (Nivel 3)',
        description: 'Máximo experto técnico. Diseña, optimiza y resuelve problemas complejos de la red.'
    },
    {
        title: 'Coordinador Técnico de Proyecto',
        description: 'Gestiona y supervisa la ejecución de proyectos de despliegue y mantenimiento.'
    },
    {
        title: 'Otro Rol (Especificar Objetivo)',
        description: 'Define un objetivo personalizado para roles no listados en el sistema.'
    }
];

const toneOptions = [
    { title: 'Profesional y Técnico', description: 'Lenguaje formal, preciso y centrado en los datos.' },
    { title: 'Amigable y Colaborativo', description: 'Tono cercano, usando analogías y fomentando el trabajo en equipo.' },
    { title: 'Directo y al Grano', description: 'Conciso, orientado a la acción y enfocado en procedimientos rápidos.' }
];

const focusOptions = [
    { title: 'Resolución de Problemas', description: 'Basado en escenarios y casos de estudio reales.' },
    { title: 'Dominio de Herramientas', description: 'Guías paso a paso para el uso de software y hardware.' },
    { title: 'Fundamentos Teóricos', description: 'Explicaciones claras de conceptos clave y mejores prácticas.' }
];

const TopicInput: React.FC<TopicInputProps> = ({ onTopicSubmit, isLoading, onCancel }) => {
  const [step, setStep] = useState<'initial' | 'role' | 'depth' | 'tone' | 'focus' | 'clarifying'>('initial');
  const [initialTopic, setInitialTopic] = useState('');
  const [role, setRole] = useState('');
  const [depth, setDepth] = useState<DepthLevel>('Básico');
  const [tone, setTone] = useState('');
  const [focus, setFocus] = useState('');
  const [questions, setQuestions] = useState<ClarifyingQuestionWithOptions[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [error, setError] = useState('');
  
   const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Refactor: Clear previous errors
    if (initialTopic.trim() === '') {
      setError('Por favor, describe la habilidad.');
      return;
    }
    setStep('role');
  };
  
  const handleRoleSubmit = () => {
    setError(''); // Refactor: Clear previous errors
    if (role.trim() === '') {
        setError('Debes seleccionar un rol.');
        return;
    }
    setStep('depth');
  };
  
  const handleDepthSubmit = () => {
    setError(''); // Refactor: Add for consistency
    setStep('tone');
  };

  const handleToneSubmit = () => {
    setError(''); // Refactor: Clear previous errors
    if(!tone) {
        setError('Debes seleccionar un tono.');
        return;
    }
    setStep('focus');
  };

  const handleFocusSubmit = async () => {
    setError(''); // Refactor: Clear previous errors
    if(!focus) {
        setError('Debes seleccionar un enfoque.');
        return;
    }
    setStep('clarifying');
    setIsLoadingQuestions(true);
    try {
      const generatedQuestions = await generateClarifyingQuestions({ topic: initialTopic, role, depth, tone, focus });
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(''));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron generar preguntas.');
      setStep('focus'); // Go back to the previous step on error
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, option: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };
  
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAnswers = questions.map((q, i) => ({ 
      question: q.question, 
      answer: answers[i]
    }));
    onTopicSubmit({ initialTopic, role, depth, tone, focus, answers: formattedAnswers });
  };
  
  const goBack = () => {
    setError(''); // Clear any validation errors when moving back a step.
    if (step === 'clarifying') setStep('focus');
    else if (step === 'focus') setStep('tone');
    else if (step === 'tone') setStep('depth');
    else if (step === 'depth') setStep('role');
    else if (step === 'role') setStep('initial');
  };

  const allQuestionsAnswered = answers.every(answer => answer !== '');

  const renderInitialStep = () => (
    <form onSubmit={handleInitialSubmit}>
      <label htmlFor="topic-input" className="block text-lg font-medium text-slate-300 mb-2">
        Paso 1: Describe la habilidad para la nueva Ruta Maestra
      </label>
      <input
        id="topic-input"
        type="text"
        value={initialTopic}
        onChange={(e) => setInitialTopic(e.target.value)}
        placeholder="Ej: 'Diagnóstico de redes FTTH'"
        className="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-telnet-yellow"
      />
      <button type="submit" className="w-full mt-6 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg">
        Siguiente
      </button>
    </form>
  );

  const renderRoleStep = () => (
    <div>
        <label className="block text-lg font-medium text-slate-300 mb-4">Paso 2: ¿Para qué rol es esta ruta?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleOptions.map(opt => (
                <button
                    key={opt.title}
                    type="button"
                    onClick={() => setRole(opt.title)}
                    className={`p-6 border-2 rounded-lg text-left transition-all h-full flex flex-col ${role === opt.title ? 'bg-telnet-yellow/20 border-telnet-yellow shadow-lg shadow-telnet-yellow/10' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                >
                    <p className="font-bold text-white text-lg">{opt.title}</p>
                    <p className="text-sm text-slate-400 mt-2 flex-grow">{opt.description}</p>
                </button>
            ))}
        </div>
        <div className="flex gap-4 mt-8">
            <button type="button" onClick={goBack} className="w-1/3 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg">Atrás</button>
            <button type="button" onClick={handleRoleSubmit} disabled={!role} className="w-2/3 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg disabled:bg-slate-700 disabled:text-slate-400">Siguiente</button>
        </div>
    </div>
  );

  const renderDepthStep = () => (
    <div>
        <label className="block text-lg font-medium text-slate-300 mb-4">Paso 3: Selecciona el nivel de profundidad</label>
        <div className="grid sm:grid-cols-3 gap-4">
          {(['Básico', 'Intermedio', 'Avanzado'] as DepthLevel[]).map(d => (
             <button key={d} type="button" onClick={() => setDepth(d)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${depth === d ? 'bg-telnet-yellow/20 border-telnet-yellow' : 'bg-slate-700/50 border-slate-600'}`}>
                <p className="font-bold text-white text-2xl">{d.charAt(0)}</p>
                <p className="font-semibold text-white mt-1">{d}</p>
              </button>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
            <button type="button" onClick={goBack} className="w-1/3 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg">Atrás</button>
            <button type="button" onClick={handleDepthSubmit} className="w-2/3 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg">Siguiente</button>
        </div>
    </div>
  );
  
  const renderToneStep = () => (
    <div>
        <label className="block text-lg font-medium text-slate-300 mb-4">Paso 4: Elige el tono y estilo de la comunicación</label>
        <div className="space-y-3">
            {toneOptions.map(opt => (
                <button key={opt.title} type="button" onClick={() => setTone(opt.title)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-start gap-4 ${tone === opt.title ? 'bg-telnet-yellow/20 border-telnet-yellow' : 'bg-slate-700/50 border-slate-600'}`}>
                    <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-telnet-yellow shrink-0 mt-1" />
                    <div>
                        <p className="font-bold text-white">{opt.title}</p>
                        <p className="text-sm text-slate-400">{opt.description}</p>
                    </div>
                </button>
            ))}
        </div>
        <div className="flex gap-4 mt-6">
            <button type="button" onClick={goBack} className="w-1/3 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg">Atrás</button>
            <button type="button" onClick={handleToneSubmit} disabled={!tone} className="w-2/3 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg disabled:bg-slate-700 disabled:text-slate-400">Siguiente</button>
        </div>
    </div>
  );

  const renderFocusStep = () => (
    <div>
        <label className="block text-lg font-medium text-slate-300 mb-4">Paso 5: Define el enfoque práctico principal</label>
        <div className="space-y-3">
            {focusOptions.map(opt => (
                <button key={opt.title} type="button" onClick={() => setFocus(opt.title)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-start gap-4 ${focus === opt.title ? 'bg-telnet-yellow/20 border-telnet-yellow' : 'bg-slate-700/50 border-slate-600'}`}>
                    <WrenchScrewdriverIcon className="w-7 h-7 text-telnet-yellow shrink-0 mt-1" />
                    <div>
                        <p className="font-bold text-white">{opt.title}</p>
                        <p className="text-sm text-slate-400">{opt.description}</p>
                    </div>
                </button>
            ))}
        </div>
        <div className="flex gap-4 mt-6">
            <button type="button" onClick={goBack} className="w-1/3 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg">Atrás</button>
            <button type="button" onClick={handleFocusSubmit} disabled={!focus} className="w-2/3 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg disabled:bg-slate-700 disabled:text-slate-400">Siguiente</button>
        </div>
    </div>
  );

  const renderClarifyingStep = () => (
     isLoadingQuestions ? (
            <div className="py-8"> <LoadingSpinner message="Generando preguntas inteligentes..." /> </div>
        ) : (
            <form onSubmit={handleFinalSubmit}>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Resumen de Configuración</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div><strong className="text-slate-400">Tema:</strong> <span className="text-white">{initialTopic}</span></div>
                        <div><strong className="text-slate-400">Rol:</strong> <span className="text-white">{role}</span></div>
                        <div><strong className="text-slate-400">Profundidad:</strong> <span className="text-white">{depth}</span></div>
                        <div><strong className="text-slate-400">Tono:</strong> <span className="text-white">{tone}</span></div>
                        <div className="col-span-2"><strong className="text-slate-400">Enfoque:</strong> <span className="text-white">{focus}</span></div>
                    </div>
                </div>
                <label className="block text-lg font-medium text-slate-300 mb-4">Paso Final: Refinemos el contenido</label>
                <p className="text-slate-400 mb-6">Tus respuestas ayudarán a la IA a entender mejor el nivel de conocimiento previo y los objetivos clave.</p>
                <div className="space-y-6">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex}>
                            <p className="font-semibold text-slate-200 mb-3">{q.question}</p>
                            <div className="flex flex-wrap gap-3">
                                {q.options.map((option, oIndex) => (
                                    <button
                                        key={oIndex}
                                        type="button"
                                        onClick={() => handleAnswerChange(qIndex, option)}
                                        className={`px-4 py-2 border-2 rounded-lg transition-all ${answers[qIndex] === option ? 'bg-telnet-yellow/20 border-telnet-yellow' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-8">
                    <button type="button" onClick={goBack} className="w-1/3 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg">Atrás</button>
                    <button type="submit" disabled={!allQuestionsAnswered} className="w-2/3 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg disabled:bg-slate-700 disabled:text-slate-400 flex items-center justify-center gap-2">
                        <SparklesIcon className="w-5 h-5" />
                        Generar Ruta Maestra
                    </button>
                </div>
            </form>
        )
  );

  // FIX: Added the main return block to render the current step and handle loading/error states.
  const renderCurrentStep = () => {
    switch (step) {
      case 'initial': return renderInitialStep();
      case 'role': return renderRoleStep();
      case 'depth': return renderDepthStep();
      case 'tone': return renderToneStep();
      case 'focus': return renderFocusStep();
      case 'clarifying': return renderClarifyingStep();
      default: return null;
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-700 text-white">
      {isLoading ? (
        <div className="py-8">
          <LoadingSpinner message="Generando la Ruta Maestra... Esto puede tardar hasta un minuto." />
        </div>
      ) : (
        <>
          {error && (
            <div className="p-4 mb-6 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              <p className="font-bold">¡Oops! Ocurrió un error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {renderCurrentStep()}
          {step !== 'initial' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-200 transition-colors text-sm font-semibold"
              >
                Cancelar y cerrar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// FIX: Added the missing default export.
export default TopicInput;
