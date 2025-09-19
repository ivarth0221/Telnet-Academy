import React from 'react';
import { useAppStore } from '../store/appStore';
import { BriefcaseIcon } from './IconComponents';
import ThemeToggle from './ThemeToggle';

const LoginView: React.FC = () => {
    const { employees, login, theme, toggleTheme } = useAppStore(state => ({
        employees: state.appState.employees,
        login: state.login,
        theme: state.theme,
        toggleTheme: state.toggleTheme,
    }));

    const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 p-4 transition-colors duration-300">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="absolute top-4 right-4" />
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700">
                
                <div className="flex justify-center mb-8">
                    <img 
                        src={theme === 'dark' ? "https://i.imgur.com/rDAq1J8.png" : "https://www.telnet.com.co/wp-content/uploads/2021/07/logo-Telnet-negro.png"}
                        alt="Logo TELNET CO" 
                        className="h-12"
                    />
                </div>

                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
                    Bienvenido a la Academia
                </h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
                    Selecciona tu perfil para comenzar
                </p>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                    {sortedEmployees.map((employee) => (
                        <button
                            key={employee.id}
                            onClick={() => login('employee', employee.id)}
                            className="w-full flex items-center p-4 bg-gray-100 dark:bg-slate-700/50 rounded-lg hover:bg-telnet-yellow/20 group transition-all duration-200 border border-gray-200 dark:border-slate-600 hover:border-telnet-yellow"
                        >
                            <div className="flex-grow text-left">
                                <p className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-telnet-yellow-dark dark:group-hover:text-telnet-yellow">
                                    {employee.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                                    {employee.role.name}
                                </p>
                            </div>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6 text-slate-400 group-hover:text-telnet-yellow-dark dark:group-hover:text-telnet-yellow transition-transform duration-200 group-hover:translate-x-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    ))}
                </div>
                
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                    <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs uppercase">O</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                </div>

                <button
                    onClick={() => login('admin')}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-slate-600 hover:border-telnet-yellow-dark dark:hover:border-telnet-yellow text-slate-600 dark:text-slate-300 hover:text-telnet-yellow-dark dark:hover:text-telnet-yellow font-bold py-3 px-4 rounded-md transition-colors"
                >
                    <BriefcaseIcon className="w-5 h-5" />
                    Acceso Administrador
                </button>

            </div>
        </div>
    );
};

export default LoginView;
