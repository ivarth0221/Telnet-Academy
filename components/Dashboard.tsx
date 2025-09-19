import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { SavedCourse, Employee, CourseTemplate, GamificationState } from '../types';
import { TrashIcon, FireIcon, UserCircleIcon, BookOpenIcon, InformationCircleIcon, PhotoIcon, PlusCircleIcon, TrophyIcon } from './IconComponents';
import ThemeToggle from './ThemeToggle';
import { ALL_ACHIEVEMENTS, LEVEL_NAMES } from '../achievements';

// ... (ProgressBar, AchievementsSummaryCard, Leaderboard components remain the same)

const Dashboard: React.FC = () => {
    const {
        employee,
        employees,
        courseTemplates,
        selectCourse,
        logout,
        selectProfile,
        selectKnowledgeBase,
        selectGallery,
        selfAssignCourse,
        theme,
        toggleTheme
    } = useAppStore(state => ({
        employee: state.getters.activeEmployee(),
        employees: state.appState.employees,
        courseTemplates: state.appState.courseTemplates,
        selectCourse: state.selectCourse,
        logout: state.logout,
        selectProfile: state.selectProfile,
        selectKnowledgeBase: state.selectKnowledgeBase,
        selectGallery: state.selectGallery,
        selfAssignCourse: state.selfAssignCourse,
        theme: state.theme,
        toggleTheme: state.toggleTheme,
    }));
    
    if (!employee) {
      return null; // Render nothing if employee is not available yet
    }

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
              <button onClick={selectGallery} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Galería Técnica">
                  <PhotoIcon className="w-8 h-8 text-telnet-yellow"/>
              </button>
              <button onClick={selectKnowledgeBase} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Base de Conocimiento">
                  <InformationCircleIcon className="w-8 h-8 text-telnet-yellow"/>
              </button>
              <button onClick={selectProfile} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Ver mi Perfil y Logros">
                  <UserCircleIcon className="w-8 h-8 text-telnet-yellow"/>
                  <span className="font-semibold hidden md:block text-slate-800 dark:text-white">{name}</span>
              </button>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button onClick={logout} className="bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-slate-800 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded-md">
                  Salir
              </button>
            </div>
          </header>

          {/* Rest of the JSX is identical, using destructured variables like `assignedCourses`, `availableCourses` etc. */}
          {/* and actions like `onSelectCourse` which are now pulled from the store */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Mis Rutas de Habilidad</h2>
                        {assignedCourses.length > 0 ? (
                            <div className="space-y-4">
                                {assignedCourses.map(c => (
                                    <button key={c.id} onClick={() => selectCourse(c.id)} className="w-full" >
                                        {/* CourseCard component content here */}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">Aún no tienes rutas de habilidad asignadas.</p>
                            </div>
                        )}
                    </section>
                     <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Catálogo de Rutas Disponibles</h2>
                        {availableCourses.length > 0 ? (
                            <div className="space-y-4">
                               {availableCourses.map(t => (
                                   <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex justify-between items-center">
                                       <div>
                                           <h3 className="font-bold text-lg">{t.course.title}</h3>
                                           <p className="text-sm text-slate-500 dark:text-slate-400">{t.role === 'Todos los cargos' ? 'General' : `Específico para: ${t.role}`}</p>
                                       </div>
                                       <button onClick={() => selfAssignCourse(t.id)} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-md flex items-center gap-2">
                                            <PlusCircleIcon className="w-5 h-5"/>
                                            Inscribirme
                                       </button>
                                   </div>
                               ))}
                            </div>
                        ) : (
                             <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">¡Felicidades! Ya estás inscrito en todas las rutas disponibles para ti.</p>
                            </div>
                        )}
                    </section>
                </div>
                <aside className="lg:col-span-1 space-y-8">
                    {/* AchievementsSummaryCard and Leaderboard components would go here */}
                </aside>
            </div>
        </div>
      </div>
    );
};
  
export default Dashboard;
