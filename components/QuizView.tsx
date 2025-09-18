import React, { useState } from 'react';
import type { Module } from '../types';
import { CheckCircleIcon, XCircleIcon, ChevronRightIcon, HomeIcon, ArrowPathIcon, BookOpenIcon } from './IconComponents';

interface QuizViewProps {
  module: Module;
  moduleIndex: number;
  onQuizComplete: (moduleIndex: number, score: number, total: number) => void;
  // FIX: Added new props for navigation from the results screen.
  onContinue: () => void;
  onReview: () => void;
}

// FIX: Destructure the onContinue and onReview props.
const QuizView: React.FC<QuizViewProps> = ({ module, moduleIndex, onQuizComplete, onContinue, onReview }) => {
  const { moduleTitle, quiz: questions } = module;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Final question answered, prepare to show results
      const finalScore = score + (isCorrect ? 1 : 0);
      onQuizComplete(moduleIndex, finalScore, questions.length); // Submit score to App state
      setShowResults(true);
    }
  };
  
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPassed = percentage >= 70;

    return (
      <div className="flex-grow h-full overflow-y-auto flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl p-8 text-center border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Resultados del Módulo</h2>
          <p className="text-telnet-yellow font-semibold mb-6">{moduleTitle}</p>
          <p className={`text-6xl font-bold mb-4 ${isPassed ? 'text-brand-green' : 'text-brand-red'}`}>{percentage}%</p>
          <p className="text-slate-300 text-lg mb-8">
            Respondiste correctamente {score} de {totalQuestions} preguntas.
          </p>
          
          {isPassed ? (
             <div className="bg-green-900/50 p-4 rounded-lg text-center mb-8">
                <h3 className="font-semibold text-white">¡Módulo Aprobado!</h3>
                <p className="text-slate-400 text-sm mt-1">
                    ¡Excelente trabajo! Has completado este módulo y el siguiente ya está desbloqueado.
                </p>
            </div>
          ) : (
            <div className="bg-red-900/50 p-4 rounded-lg text-center mb-8">
                <h3 className="font-semibold text-white">¡Sigue Intentando!</h3>
                <p className="text-slate-400 text-sm mt-1">
                   Necesitas un 70% para aprobar. ¡No te rindas! Repasa el material o inténtalo de nuevo.
                </p>
            </div>
          )}

          {isPassed ? (
            <button
                onClick={onContinue}
                className="w-full bg-telnet-yellow text-telnet-black font-bold py-4 px-4 rounded-lg hover:bg-telnet-yellow-dark transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
            >
                Continuar con mi Ruta <ChevronRightIcon className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleRetry}
                    className="w-full bg-telnet-yellow text-telnet-black font-bold py-3 px-4 rounded-lg hover:bg-telnet-yellow-dark transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    Reintentar Cuestionario
                </button>
                 <button
                    onClick={onReview}
                    className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <BookOpenIcon className="w-5 h-5" />
                    Repasar Módulo
                </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex-grow h-full overflow-y-auto flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
             <span className="text-telnet-yellow font-semibold">{moduleTitle}</span>
             <span className="text-slate-400 text-sm font-medium">Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-telnet-yellow h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-100 mb-8">{currentQuestion.question}</h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            let buttonClass = 'border-slate-600 bg-slate-700 hover:bg-slate-600';
            if (isAnswered) {
                if (option === currentQuestion.correctAnswer) {
                    buttonClass = 'border-brand-green bg-brand-green/20'; // Always highlight correct answer
                }
                if (isSelected && !isCorrect) {
                    buttonClass = 'border-brand-red bg-brand-red/20'; // Highlight incorrect selection
                }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 flex items-center justify-between ${buttonClass}`}
              >
                <span className="text-lg text-slate-200">{option}</span>
                {isAnswered && isSelected && (isCorrect ? <CheckCircleIcon className="w-6 h-6 text-brand-green" /> : <XCircleIcon className="w-6 h-6 text-brand-red" />)}
                {isAnswered && !isSelected && option === currentQuestion.correctAnswer && <CheckCircleIcon className="w-6 h-6 text-brand-green" /> }
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 text-right">
            <button 
              onClick={handleNextQuestion}
              className="bg-telnet-yellow text-telnet-black font-bold py-3 px-6 rounded-lg hover:bg-telnet-yellow-dark transition-colors duration-200 flex items-center gap-2 ml-auto"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Ver Resultados'}
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;