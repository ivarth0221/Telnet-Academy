import React from 'react';
import { useAppStore } from '../store/appStore';
import type { GamificationState, Achievement } from '../types';
import { ALL_ACHIEVEMENTS, XP_FOR_LEVEL, LEVEL_NAMES } from '../achievements';
import { ChevronLeftIcon } from './IconComponents';

const getLevelTitle = (level: number) => {
    let title = "Novato";
    for (const threshold in LEVEL_NAMES) {
        const numericThreshold = parseInt(threshold, 10);
        if (level >= numericThreshold) {
            title = LEVEL_NAMES[numericThreshold as keyof typeof LEVEL_NAMES];
        }
    }
    return `${title} (Nivel ${level})`;
};

const Badge: React.FC<{ ach: Achievement, isUnlocked: boolean }> = ({ ach, isUnlocked }) => {
    const Icon = ach.icon;
    return (
        <div className={`text-center p-4 border rounded-lg transition-all duration-300 ${isUnlocked ? 'bg-slate-700/50 border-telnet-yellow/30' : 'bg-slate-800/30 border-slate-700'}`}>
            <Icon className={`w-16 h-16 mx-auto mb-3 ${isUnlocked ? 'text-telnet-yellow' : 'text-slate-600'}`} />
            <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{ach.name}</h4>
            <p className={`text-sm mt-1 ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>{ach.description}</p>
        </div>
    );
}

const ProfileView: React.FC = () => {
    const { activeEmployee, returnToDashboard } = useAppStore(state => ({
        activeEmployee: state.getters.activeEmployee(),
        returnToDashboard: state.returnToDashboard,
    }));

    if (!activeEmployee) {
        return null; // Render nothing if employee is not available yet
    }

    const { name: userName, gamification } = activeEmployee;
    const { xp, level, achievements } = gamification;

    const currentLevelXP = XP_FOR_LEVEL(level -1);
    const nextLevelXP = XP_FOR_LEVEL(level);
    const xpIntoLevel = xp - currentLevelXP;
    const xpForNextLevel = nextLevelXP - currentLevelXP;
    const progressPercentage = Math.min(100, (xpIntoLevel / xpForNextLevel) * 100);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <button onClick={returnToDashboard} className="flex items-center gap-2 text-slate-400 hover:text-telnet-yellow transition-colors font-semibold">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Volver al Panel
                    </button>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold">{userName || 'Aprendiz Anónimo'}</h1>
                    <p className="text-2xl text-telnet-yellow mt-2">{getLevelTitle(level)}</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-12">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-slate-300">Progreso al Siguiente Nivel</span>
                        <span className="text-sm font-mono text-slate-400">{xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-telnet-yellow h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%`}}
                        ></div>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center mb-8">Vitrina de Logros</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.values(ALL_ACHIEVEMENTS).map(ach => (
                            <Badge key={ach.id} ach={ach} isUnlocked={achievements.includes(ach.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
