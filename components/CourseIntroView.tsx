import React from 'react';
import type { Course } from '../types';
import { BookOpenIcon, DocumentQuestionIcon, TrophyIcon, AcademicCapIcon, SparklesIcon, BrainCircuitIcon } from './IconComponents';

interface CourseIntroViewProps {
  course: Course;
  onStart: () => void;
}

const StepCard: React.FC<{ icon: React.FC<any>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg text-left flex items-start gap-4">
        <Icon className="w-10 h-10 text-telnet-yellow shrink-0 mt-1" />
        <div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>
    </div>
);

const CourseIntroView: React.FC<CourseIntroViewProps> = ({ course, onStart }) => {
  return (
    <div className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900 flex items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <SparklesIcon className="w-16 h-16 mx-auto text-telnet-yellow mb-4" />
        <h1 className="text-4xl lg:text-5xl font-bold text-white">¡Tu Plan de Desarrollo está Listo!</h1>
        <p className="text-xl text-slate-300 mt-2 line-clamp-2">"{course.title}"</p>

        <div className="my-10 text-left bg-slate-800 p-8 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Tu Viaje de Desarrollo en TELNET CO</h2>
            <div className="grid md:grid-cols-2 gap-5">
                <StepCard
                    icon={BookOpenIcon}
                    title="1. Asesoría Técnica y Lecciones"
                    description="Aprenderás de forma interactiva, conversando con tu Asesor Técnico IA para explorar cada tema a tu propio ritmo."
                />
                <StepCard
                    icon={DocumentQuestionIcon}
                    title="2. Pruebas y Refuerzo"
                    description="Al final de cada módulo, validarás tus conocimientos. Si tienes dificultades, la IA creará una lección de refuerzo solo para ti."
                />
                <StepCard
                    icon={TrophyIcon}
                    title="3. Evaluación de Competencia Práctica"
                    description="Aplicarás lo aprendido en un proyecto final. La IA evaluará tu solución basándose en competencias clave para TELNET CO."
                />
                <StepCard
                    icon={AcademicCapIcon}
                    title="4. Examen Final y Certificación"
                    description="Para obtener tu certificado, deberás aprobar un examen oral con la IA, quien actuará como un examinador experto para validar tu competencia."
                />
            </div>
             <div className="mt-8 p-4 bg-slate-900/50 rounded-lg text-xs text-slate-400 text-center">
                <strong>Importante:</strong> TELNET ACADEMY proporciona formación enfocada en temas específicos para desarrollar habilidades concretas. Esto no constituye un título técnico, tecnológico ni profesional formal.
             </div>
        </div>

        <button
            onClick={onStart}
            className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-4 px-10 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-telnet-yellow/30"
        >
            ¡Entendido, comencemos!
        </button>

      </div>
    </div>
  );
};

export default CourseIntroView;