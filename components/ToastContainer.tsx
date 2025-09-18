import React from 'react';
import type { Toast } from '../types';

interface ToastProps {
  toast: Toast;
}

const ConfettiPiece: React.FC = () => (
    <div
      className="absolute w-2 h-4"
      style={{
        left: `${Math.random() * 100}%`,
        animation: `confetti-fall ${1.5 + Math.random() * 2}s linear ${Math.random() * 1}s infinite`,
        backgroundColor: ['#22d3ee', '#fde047', '#a5f3fc', '#facc15'][Math.floor(Math.random() * 4)],
      }}
    />
);

const ToastComponent: React.FC<ToastProps> = ({ toast }) => {
  const { achievement, userName } = toast;
  const Icon = achievement.icon;

  const celebrationText = achievement.celebrationText.replace(
      '{userName}',
      userName || 'tú'
  );

  return (
    <div
      className="bg-slate-800 border-2 border-yellow-400/50 rounded-xl shadow-2xl p-4 flex items-center gap-4 animate-fade-in-down overflow-hidden relative"
    >
      <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => <ConfettiPiece key={i} />)}
      </div>
      <div className="shrink-0 z-10">
        <Icon className="w-12 h-12 text-yellow-400" />
      </div>
      <div className="z-10">
        <p className="font-bold text-white">¡{achievement.name}!</p>
        <p className="text-slate-300 text-sm">{celebrationText}</p>
      </div>
    </div>
  );
};


interface ToastContainerProps {
  toasts: Toast[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3 w-80">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes confetti-fall {
            0% { transform: translateY(-100%) rotateZ(0deg); opacity: 1; }
            100% { transform: translateY(200%) rotateZ(720deg); opacity: 0; }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;