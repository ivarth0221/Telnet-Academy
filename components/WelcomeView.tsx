import React from 'react';
import { RocketLaunchIcon, AcademicCapIcon, ListBulletIcon } from './IconComponents';

interface WelcomeViewProps {
  onStart: () => void;
}

const FeatureCard: React.FC<{ icon: React.FC<any>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg text-center">
        <Icon className="w-10 h-10 mx-auto text-telnet-yellow mb-4" />
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-slate-400 text-sm mt-2">{description}</p>
    </div>
);

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-2">Bienvenido a TELNET ACADEMY</h1>
        <p className="text-xl text-slate-300">La plataforma de desarrollo profesional de TELNET CO para dominar habilidades prácticas.</p>
      </div>

      <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-800 rounded-xl shadow-2xl shadow-telnet-yellow/10">
        <h2 className="text-2xl font-bold text-center mb-6">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
                icon={RocketLaunchIcon}
                title="Define tu Meta"
                description="Dile a TELNET ACADEMY qué habilidad quieres aprender o qué proyecto quieres construir."
            />
            <FeatureCard 
                icon={ListBulletIcon}
                title="Recibe tu Ruta"
                description="La IA genera una 'Ruta de Habilidad' personalizada con lecciones, ejercicios y un proyecto final."
            />
             <FeatureCard 
                icon={AcademicCapIcon}
                title="Aprende y Construye"
                description="Avanza en tu ruta, pon a prueba tus conocimientos y demuestra tus habilidades construyendo el proyecto."
            />
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-telnet-yellow/30"
      >
        Crear mi Primera Ruta de Habilidad
      </button>
    </div>
  );
};

export default WelcomeView;