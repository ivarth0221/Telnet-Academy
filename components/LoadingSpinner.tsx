import React from 'react';
import { CpuChipIcon, SparklesIcon } from './IconComponents';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-lg">
            <div className="relative">
                <CpuChipIcon className="w-20 h-20 text-telnet-yellow animate-spin" style={{ animationDuration: '3s' }}/>
                 <SparklesIcon className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-300">{message}</p>
            <p className="text-sm text-slate-400">Esto puede tardar un momento...</p>
        </div>
    );
};

export default LoadingSpinner;