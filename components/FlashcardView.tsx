import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { Course, Flashcard } from '../types';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

export const FlashcardView: React.FC = () => {
    const { course, flashcards, storeFlashcards } = useAppStore(state => {
        const activeCourse = state.getters.activeCourse();
        return {
            course: activeCourse?.course,
            flashcards: activeCourse?.progress.flashcards ?? [],
            storeFlashcards: state.storeFlashcards,
        }
    });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateFlashcards = () => {
      if (!course) return;
      setIsLoading(true);
      setError(null);
      geminiService.generateFlashcardsForCourse(course)
        .then(newFlashcards => {
          storeFlashcards(newFlashcards);
        })
        .catch(err => {
          setError(err.message || 'Error desconocido al generar flashcards.');
        })
        .finally(() => {
          setIsLoading(false);
        });
  }

  useEffect(() => {
    if (flashcards.length === 0) {
      generateFlashcards();
    }
  }, [course]); 

  useEffect(() => {
    // Reset flip state when card changes
    setIsFlipped(false);
  }, [currentCardIndex]);

  const goToNextCard = () => {
    if (flashcards.length === 0) return;
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
  };

  const goToPrevCard = () => {
    if (flashcards.length === 0) return;
    setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };
  
  const handleRetry = () => {
     generateFlashcards();
  };

  if (!course) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center bg-slate-950">
        <h2 className="text-2xl text-slate-300 font-bold">Error</h2>
        <p className="text-slate-400 mt-2">No se pudo cargar la información del curso.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center bg-slate-950">
        <LoadingSpinner message="Generando flashcards inteligentes..." />
        <p className="mt-4 text-slate-400">Analizando el curso para crear tu material de repaso.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center bg-slate-950">
        <h2 className="text-2xl text-red-400 font-bold">Error al Crear Flashcards</h2>
        <p className="text-slate-300 mt-2 max-w-lg">{error}</p>
        <button onClick={handleRetry} className="mt-6 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-6 rounded-lg flex items-center gap-2">
            <ArrowPathIcon className="w-5 h-5"/>
            Reintentar
        </button>
      </div>
    );
  }
  
  if (flashcards.length === 0) {
      return (
         <div className="flex-grow flex flex-col items-center justify-center p-6 text-center bg-slate-950">
            <h2 className="text-2xl text-slate-300 font-bold">No hay flashcards</h2>
            <p className="text-slate-400 mt-2 max-w-lg">No se han podido generar o encontrar flashcards para este curso.</p>
         </div>
      )
  }

  const currentCard = flashcards[currentCardIndex];
  
  const CardFace = ({ isFront }: { isFront: boolean }) => (
    <div className={`absolute w-full h-full backface-hidden rounded-2xl p-8 flex items-center justify-center text-center text-white bg-slate-800/80 border border-telnet-yellow/50 backdrop-blur-sm ${isFront ? '' : 'rotate-y-180'}`}>
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="absolute top-8">
          <p className={`font-semibold tracking-widest ${isFront ? 'text-telnet-yellow' : 'text-slate-500'}`}>PREGUNTA</p>
          <p className={`font-semibold tracking-widest ${!isFront ? 'text-telnet-yellow' : 'text-slate-500'}`}>RESPUESTA</p>
        </div>
        <div className="flex-grow flex items-center justify-center max-w-full overflow-y-auto">
          <MarkdownRenderer content={isFront ? currentCard.question : currentCard.answer} courseContext={course.title} className="prose-xl lg:prose-2xl text-center prose-p:text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 flex flex-col items-center justify-center h-full overflow-hidden bg-slate-950">
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Repaso con Flashcards</h1>
        <p className="text-slate-400 text-sm lg:text-base max-w-2xl mx-auto line-clamp-1">Curso: {course.title}</p>
      </div>
      
      <div className="w-full max-w-3xl aspect-[16/9] perspective-1000">
        <div 
          className={`relative w-full h-full transform-style-3d transition-transform duration-700 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
          aria-label={`Flashcard ${currentCardIndex + 1} de ${flashcards.length}. ${isFlipped ? 'Mostrando respuesta.' : 'Mostrando pregunta.'} Haz clic para voltear.`}
        >
          <CardFace isFront={true} />
          <CardFace isFront={false} />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between w-full max-w-md">
        <button onClick={goToPrevCard} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors shadow-lg" aria-label="Tarjeta anterior">
          <ChevronLeftIcon className="w-7 h-7"/>
        </button>
        <p className="font-bold text-2xl text-slate-200 tracking-wider" aria-live="polite">{currentCardIndex + 1} / {flashcards.length}</p>
        <button onClick={goToNextCard} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors shadow-lg" aria-label="Siguiente tarjeta">
          <ChevronRightIcon className="w-7 h-7"/>
        </button>
      </div>
      <p className="mt-6 text-sm text-slate-500">Haz clic en la tarjeta para voltearla</p>
    </div>
  );
};
