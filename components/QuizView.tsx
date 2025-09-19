import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { CheckCircleIcon, XCircleIcon, ChevronRightIcon, HomeIcon, ArrowPathIcon, BookOpenIcon } from './IconComponents';

const QuizView: React.FC = () => {
    const { 
        activeCourse, 
        activeModuleIndex, 
        quizComplete, 
        continueFromQuiz, 
        reviewFromQuiz 
    } = useAppStore(state => ({
        activeCourse: state.getters.activeCourse(),
        activeModuleIndex: state.activeModuleIndex,
        quizComplete: state.quizComplete,
        continueFromQuiz: state.continueFromQuiz,
        reviewFromQuiz: state.reviewFromQuiz,
    }));

    // Internal state for the quiz is fine to keep here
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    if (!activeCourse) return null;
    
    const module = activeCourse.course.modules[activeModuleIndex];
    if (!module || !module.quiz) return <div>No se encontró la prueba para este módulo.</div>;
    
    const { moduleTitle, quiz: questions } = module;
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer
        setSelectedAnswers(prev => ({...prev, [currentQuestionIndex]: answer}));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
             // Calculate final score
            let finalScore = 0;
            questions.forEach((q, i) => {
                if (selectedAnswers[i] === q.correctAnswer) {
                    finalScore++;
                }
            });
            setScore(finalScore);
            quizComplete(activeModuleIndex, finalScore, questions.length);
            setShowResults(true);
        }
    };
  
    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
    };

    if (showResults) {
        const passed = (score / questions.length) >= 0.7;
        const isLastModule = activeModuleIndex === activeCourse.course.modules.length - 1;
        const hasFinalProject = !!activeCourse.course.finalProject;
        
        let continueButtonText = 'Continuar al Siguiente Módulo';
        if (isLastModule) {
            continueButtonText = hasFinalProject ? 'Ir al Proyecto Final' : 'Ir al Examen Final';
        }

        return (
             <div className="flex-grow h-full overflow-y-auto flex items-center justify-center bg-slate-900 text-white p-4">
                <div className="text-center bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                    {passed ? <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" /> : <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />}
                    <h1 className="text-4xl font-bold mb-2">Resultados de la Prueba</h1>
                    <p className="text-slate-400 mb-6">Módulo: {moduleTitle}</p>
                    <p className="text-6xl font-bold my-4">{score} <span className="text-4xl text-slate-400">/ {questions.length}</span></p>
                    <p className={`text-2xl font-semibold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                        {passed ? '¡Aprobado!' : 'Necesitas repasar'}
                    </p>
                    <p className="text-slate-300 mt-2">{passed ? '¡Excelente trabajo! Has desbloqueado el siguiente módulo.' : 'No te preocupes. Repasa las lecciones e inténtalo de nuevo.'}</p>
                    
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        {passed ? (
                            <button onClick={continueFromQuiz} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                                {continueButtonText} <ChevronRightIcon className="w-5 h-5"/>
                            </button>
                        ) : (
                             <button onClick={handleRetry} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                                Reintentar Prueba <ArrowPathIcon className="w-5 h-5"/>
                            </button>
                        )}
                        <button onClick={reviewFromQuiz} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                            <BookOpenIcon className="w-5 h-5" /> Repasar Lecciones
                        </button>
                    </div>
                </div>
             </div>
        )
    }

    return (
        <div className="flex-grow h-full overflow-y-auto flex items-center justify-center bg-slate-900 text-white p-4">
           <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <p className="text-telnet-yellow font-semibold">Prueba del Módulo {activeModuleIndex + 1}</p>
                    <h1 className="text-3xl font-bold mt-1">{moduleTitle}</h1>
                    <p className="text-slate-400 mt-4">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                </div>

                <div className="bg-slate-800 p-8 rounded-lg shadow-xl">
                    <p className="text-xl font-semibold mb-6 text-center">{currentQuestion.question}</p>
                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = currentQuestion.correctAnswer === option;
                            
                            let buttonClass = 'bg-slate-700 hover:bg-slate-600';
                            if (selectedAnswer) {
                                if (isCorrect) {
                                    buttonClass = 'bg-green-500/80 ring-2 ring-green-400';
                                } else if (isSelected) {
                                    buttonClass = 'bg-red-500/80 ring-2 ring-red-400';
                                } else {
                                    buttonClass = 'bg-slate-700 opacity-60';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={!!selectedAnswer}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${buttonClass}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedAnswer && (
                     <div className="mt-6 flex justify-center">
                        <button onClick={handleNextQuestion} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-8 rounded-lg flex items-center gap-2">
                            {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Ver Resultados'}
                            <ChevronRightIcon className="w-5 h-5"/>
                        </button>
                    </div>
                )}
           </div>
        </div>
    );
};

export default QuizView;