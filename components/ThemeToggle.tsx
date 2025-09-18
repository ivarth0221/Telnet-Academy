import React from 'react';
import { SunIcon, MoonIcon } from './IconComponents';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme, className = '' }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-telnet-yellow dark:hover:text-telnet-yellow bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;
