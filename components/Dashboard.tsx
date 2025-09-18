import React, { useMemo } from 'react';
import type { SavedCourse, Employee, CourseTemplate, GamificationState } from '../types';
import { TrashIcon, FireIcon, UserCircleIcon, BookOpenIcon, InformationCircleIcon, PhotoIcon, PlusCircleIcon, TrophyIcon } from './IconComponents';
import ThemeToggle from './ThemeToggle';
import { ALL_ACHIEVEMENTS, LEVEL_NAMES } from '../achievements';

type Theme = 'light' | 'dark';

interface DashboardProps {
    employee: Employee;
    employees: Employee[];
    courseTemplates: CourseTemplate[];
    onSelectCourse: (courseId: string) => void;
    onDeleteCourse: (courseId: string) => void;
    onLogout: () => void;
    onSelectProfile: () => void;
    onSelectKnowledgeBase: () => void;
    onSelectGallery: () => void;
    onSelfAssignCourse: (templateId: string) => void;
    theme: Theme;
    toggleTheme: () => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Progreso</span>
        <span className="text-sm font-medium text-telnet-yellow">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
        <div 
          className="bg-telnet-yellow h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
);

const getLevelTitle = (level: number) => {
    let title = "Novato";
    for (const threshold in LEVEL_NAMES) {
        const numericThreshold = parseInt(threshold, 10);
        if (level >= numericThreshold) {
            title = LEVEL_NAMES[numericThreshold as keyof typeof LEVEL_NAMES];
        }
    }
    return title;
};

const AchievementsSummaryCard: React.FC<{ gamification: GamificationState; onSelectProfile: () => void; }> = ({ gamification, onSelectProfile }) => {
    const totalAchievements = useMemo(() => Object.keys(ALL_ACHIEVEMENTS).length, []);
    const unlockedAchievements = gamification.achievements.length;
    const levelTitle = getLevelTitle(gamification.level);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-telnet-yellow" />
                Resumen de Logros
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Nivel Actual</span>
                    <span className="font-bold text-lg text-telnet-yellow">{gamification.level} ({levelTitle})</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Logros Desbloqueados</span>
                    <span className="font-bold text-lg text-telnet-yellow">{unlockedAchievements} / {totalAchievements}</span>
                </div>
            </div>
            <button
                onClick={onSelectProfile}
                className="w-full mt-6 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
                Ver todos mis logros
            </button>
        </div>
    );
};

const Leaderboard: React.FC<{ employees: Employee[]; currentEmployeeId: string }> = ({ employees, currentEmployeeId }) => {
    const sortedEmployees = useMemo(() => 
        [...employees].sort((a, b) => b.gamification.xp - a.gamification.xp), 
    [employees]);

    const topThree = sortedEmployees.slice(0, 3);
    const currentUserIndex = sortedEmployees.findIndex(e => e.id === currentEmployeeId);
    const currentUserRank = currentUserIndex + 1;
    const isUserInTopThree = currentUserIndex < 3;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-telnet-yellow" />
                Tabla de Clasificación
            </h3>
            <ul className="space-y-3">
                {topThree.map((emp, index) => (
                    <li key={emp.id} className={`flex items-center justify-between p-3 rounded-lg ${emp.id === currentEmployeeId ? 'bg-telnet-yellow/10 border border-telnet-yellow' : 'bg-gray-50 dark:bg-slate-700/50'}`}>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-lg text-slate-400 dark:text-slate-400 w-6 text-center">{index + 1}</span>
                            <span className="font-semibold text-slate-800 dark:text-white">{emp.name}</span>
                        </div>
                        <span className="font-bold text-telnet-yellow">{emp.gamification.xp.toLocaleString()} XP</span>
                    </li>
                ))}
            </ul>
            {!isUserInTopThree && currentUserRank > 0 && (
                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-slate-400 dark:text-slate-400 w-6 text-center">{currentUserRank}</span>
                        <span className="font-semibold text-slate-800 dark:text-white">Tu Posición</span>
                    </div>
                    <span className="font-bold text-telnet-yellow">{sortedEmployees[currentUserIndex].gamification.xp.toLocaleString()} XP</span>
                </div>
            )}
        </div>
    );
};
  
const Dashboard: React.FC<DashboardProps> = ({ employee, employees, courseTemplates, onSelectCourse, onDeleteCourse, onLogout, onSelectProfile, onSelectKnowledgeBase, onSelectGallery, onSelfAssignCourse, theme, toggleTheme }) => {
    const { name, assignedCourses, gamification } = employee;
  
    const assignedTemplateIds = useMemo(() => new Set(assignedCourses.map(c => c.templateId)), [assignedCourses]);
    const availableCourses = useMemo(() => courseTemplates.filter(t => !assignedTemplateIds.has(t.id)), [courseTemplates, assignedTemplateIds]);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
             <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Bienvenido de nuevo, <span className="text-telnet-yellow">{name.split(' ')[0]}</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
                Tu ruta de aprendizaje te está esperando. ¡Sigamos avanzando!
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
               <div className="flex items-center gap-2 text-brand-orange" title={`${gamification.streak} días de racha de estudio`}>
                  <FireIcon className="w-6 h-6"/> 
                  <span className="text-xl font-bold">{gamification.streak}</span>
              </div>
              <button onClick={onSelectGallery} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Galería Técnica">
                  <PhotoIcon className="w-8 h-8 text-telnet-yellow"/>
              </button>
              <button onClick={onSelectKnowledgeBase} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Base de Conocimiento">
                  <InformationCircleIcon className="w-8 h-8 text-telnet-yellow"/>
              </button>
              <button onClick={onSelectProfile} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Ver mi Perfil y Logros">
                  <UserCircleIcon className="w-8 h-8 text-telnet-yellow"/>
                  <span className="font-semibold hidden md:block text-slate-800 dark:text-white">{name}</span>
              </button>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button onClick={onLogout} className="bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-slate-800 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded-md">
                  Salir
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-telnet-yellow pl-4 mb-6">
                Mis Planes de Desarrollo
                </h2>
    
                {assignedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignedCourses.map((course) => {
                    const totalLessons = course.course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
                    const completedLessons = course.progress.completedItems.filter(item => item.startsWith('m') && item.includes('_l')).length;
                    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

                    const template = courseTemplates.find(t => t.id === course.templateId);
                    const depth = template?.depth || 'Básico';
                    const depthStyles = {
                        Básico: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700',
                        Intermedio: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
                        Avanzado: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
                    };
                    const depthClass = depthStyles[depth];
                    
                    return (
                        <div 
                        key={course.id} 
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-telnet-yellow hover:shadow-2xl hover:shadow-telnet-yellow/10"
                        >
                        <div>
                            <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{course.course.title}</h3>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${depthClass} whitespace-nowrap`}>
                                {depth}
                            </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">{course.course.description}</p>
                        </div>
                        <div>
                            <ProgressBar progress={progress} />
                            <div className="flex items-center gap-3 mt-6">
                                <button
                                onClick={() => onSelectCourse(course.id)}
                                className="w-full bg-telnet-yellow text-telnet-black font-bold py-3 px-4 rounded-md hover:bg-telnet-yellow-dark transition-colors duration-200"
                                >
                                {progress > 0 ? 'Continuar Plan' : 'Comenzar Plan'}
                                </button>
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>
                ) : (
                <div className="text-center bg-white dark:bg-slate-800 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-12">
                    <BookOpenIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">No tienes planes asignados</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Explora el catálogo para inscribirte en una nueva ruta de aprendizaje.
                    </p>
                </div>
                )}
            </div>
            
            <div className="lg:col-span-1 space-y-8">
                 <AchievementsSummaryCard gamification={employee.gamification} onSelectProfile={onSelectProfile} />
                 <Leaderboard employees={employees} currentEmployeeId={employee.id} />
            </div>
          </div>
  
          {/* Course Catalog for Self-Enrollment */}
          {availableCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-telnet-yellow pl-4 mb-6">
                Explorar Catálogo de Rutas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {availableCourses.map((template) => {
                    const depth = template.depth;
                     const depthStyles = {
                        Básico: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700',
                        Intermedio: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
                        Avanzado: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
                    };
                    const depthClass = depthStyles[depth];

                    return (
                      <div 
                        key={template.id} 
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col justify-between p-6"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{template.course.title}</h3>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${depthClass} whitespace-nowrap`}>
                                {depth}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Recomendado para: <span className="font-semibold">{template.role}</span></p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">{template.course.description}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <button
                              onClick={() => onSelfAssignCourse(template.id)}
                              className="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-telnet-yellow-dark dark:text-telnet-yellow border-2 border-gray-200 dark:border-slate-600 hover:border-telnet-yellow-dark dark:hover:border-telnet-yellow font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <PlusCircleIcon className="w-5 h-5"/>
                              Inscribirme
                            </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
};
  
export default Dashboard;