

import React from 'react';
import { RocketLaunchIcon, XCircleIcon } from './IconComponents';

interface WelcomeInfoModalProps {
  onClose: () => void;
}

const FeatureCard: React.FC<{ icon: React.FC<any>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg text-center">
        <Icon className="w-10 h-10 mx-auto text-telnet-yellow mb-4" />
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-slate-400 text-sm mt-2">{description}</p>
    </div>
);

const WelcomeInfoModal: React.FC<WelcomeInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-telnet-yellow/20 w-full max-w-4xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Sobre TELNET ACADEMY</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Bienvenido a TELNET ACADEMY</h1>
                <p className="text-lg text-slate-300">La plataforma de desarrollo profesional de TELNET CO para dominar habilidades prácticas.</p>
            </div>

            <div className="my-8">
                <h2 className="text-2xl font-bold text-center mb-6">¿Cómo funciona?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard 
                        icon={RocketLaunchIcon}
                        title="Define tu Meta"
                        description="Dile a TELNET ACADEMY qué habilidad quieres aprender o qué proyecto quieres construir."
                    />
                    <FeatureCard 
                        icon={({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>}
                        title="Recibe tu Ruta"
                        description="La IA genera una 'Ruta de Habilidad' personalizada con lecciones, ejercicios y un proyecto final."
                    />
                    <FeatureCard 
                        icon={({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.905 59.905 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l.07.07a50.57 50.57 0 013.01 1.085" /></svg>}
                        title="Aprende y Construye"
                        description="Avanza en tu ruta, pon a prueba tus conocimientos y demuestra tus habilidades construyendo el proyecto."
                    />
                </div>
            </div>
             <div className="mt-8 text-center">
                <button
                    onClick={onClose}
                    className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-8 rounded-lg text-base transition-transform transform hover:scale-105"
                >
                    ¡Entendido!
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeInfoModal;