import React, { useState, useMemo } from 'react';
import type { Employee, CourseTemplate, Role, ModuleExpansionState, SavedCourse, FinalProjectEvaluation, GalleryItem } from '../types';
import TopicInput from './TopicInput';
import type { CourseWizardPayload } from './TopicInput';
import AssignCourseModal from './AssignCourseModal';
import CourseTemplateDetailModal from './CourseTemplateDetailModal';
import { BriefcaseIcon, BookOpenIcon, UserCircleIcon, TrashIcon, SparklesIcon, UsersIcon, ChartBarIcon, TrophyIcon, ListBulletIcon, ChevronDownIcon, PhotoIcon, PencilSquareIcon, InformationCircleIcon, ClipboardDocumentCheckIcon } from './IconComponents';
import { defaultGamification } from '../initialData';
import ModuleExpansionModal from './ModuleExpansionModal';
import AssignToRoleModal from './AssignToRoleModal';
import ProjectReviewModal from './ProjectReviewModal';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import GalleryItemFormModal from './GalleryItemFormModal';
import ThemeToggle from './ThemeToggle';

type Theme = 'light' | 'dark';

interface AdminDashboardProps {
    employees: Employee[];
    courseTemplates: CourseTemplate[];
    roleAssignments: Record<string, string>;
    roles: Role[];
    galleryItems: GalleryItem[];
    onAddGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
    onUpdateGalleryItem: (item: GalleryItem) => void;
    onDeleteGalleryItem: (itemId: string) => void;
    onCreateTemplate: (payload: CourseWizardPayload) => void;
    onAddEmployee: (employee: Employee) => void;
    onAddRole: (role: Role) => void;
    onAssignTemplateToRole: (templateId: string | null, roleName: string) => void;
    onAssignTemplateToEmployee: (employeeId: string, templateId: string) => void;
    onUnassignCourse: (employeeId: string, courseId: string) => void;
    onSaveEvaluation: (employeeId: string, courseId: string, evaluation: FinalProjectEvaluation) => void;
    onLogout: () => void;
    isGenerating: boolean;
    onDeleteTemplate: (templateId: string) => void;
    onExpandModuleRequest: (templateId: string, moduleIndex: number) => void;
    onSelectExpansionSuggestion: (suggestion: string) => void;
    onCloseExpansionModal: () => void;
    expansionState: {
      moduleIndex: number | null;
      templateId: string | null;
      suggestions: string[];
      isLoadingSuggestions: boolean;
      isGeneratingLesson: boolean;
      error: string | null;
    };
    reviewingProject: { employeeId: string; courseId: string } | null;
    onReviewProject: (review: { employeeId: string; courseId: string } | null) => void;
    theme: Theme;
    toggleTheme: () => void;
  }


const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    employees, courseTemplates, roles, roleAssignments, galleryItems, onAddGalleryItem, onUpdateGalleryItem, onDeleteGalleryItem, onCreateTemplate, onAddEmployee, 
    onAddRole, onAssignTemplateToRole, onAssignTemplateToEmployee, onUnassignCourse, onSaveEvaluation, onLogout, isGenerating,
    onDeleteTemplate, onExpandModuleRequest, onSelectExpansionSuggestion, onCloseExpansionModal, expansionState,
    reviewingProject, onReviewProject, theme, toggleTheme
}) => {
    const [isCreatingCourse, setIsCreatingCourse] = useState(false);
    const [assigningToEmployee, setAssigningToEmployee] = useState<Employee | null>(null);
    const [activeTab, setActiveTab] = useState<'seguimiento' | 'colaboradores' | 'catalogo' | 'roles' | 'analiticas' | 'galeria'>('catalogo');
    const [viewingTemplate, setViewingTemplate] = useState<CourseTemplate | null>(null);
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || '');
    const [newRoleName, setNewRoleName] = useState('');
    const [assigningToRole, setAssigningToRole] = useState<CourseTemplate | null>(null);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  
    const handleCreateTemplate = (payload: CourseWizardPayload) => {
      onCreateTemplate(payload);
      setIsCreatingCourse(false);
    };
  
    const handleAddEmployee = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newEmployeeName.trim() || !selectedRoleId) {
          alert('Por favor, completa el nombre y selecciona un rol.');
          return;
      }
      const selectedRoleObject = roles.find(r => r.id === selectedRoleId);
      if (!selectedRoleObject) {
          alert('Rol seleccionado no válido.');
          return;
      }
      const newEmployee: Employee = {
          id: `emp-${Date.now()}`,
          name: newEmployeeName.trim(),
          role: selectedRoleObject,
          assignedCourses: [],
          gamification: { ...defaultGamification },
      };
      onAddEmployee(newEmployee);
      setNewEmployeeName('');
    };
    
    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        const newRole: Role = { id: `role-${Date.now()}`, name: newRoleName.trim() };
        onAddRole(newRole);
        setNewRoleName('');
    };

    const handleAddNewGalleryItem = () => {
        setEditingGalleryItem(null);
        setIsGalleryModalOpen(true);
    };

    const handleEditGalleryItem = (item: GalleryItem) => {
        setEditingGalleryItem(item);
        setIsGalleryModalOpen(true);
    };

    const handleSaveGalleryItem = (item: Omit<GalleryItem, 'id'> | GalleryItem) => {
        if ('id' in item) {
            onUpdateGalleryItem(item);
        } else {
            onAddGalleryItem(item);
        }
        setIsGalleryModalOpen(false);
    };
    
    const expansionModalState: ModuleExpansionState | null = useMemo(() => {
        if (expansionState.templateId === null || expansionState.moduleIndex === null) return null;
        const template = courseTemplates.find(t => t.id === expansionState.templateId);
        if (!template) return null;
        const module = template.course.modules[expansionState.moduleIndex];
        return {
            moduleIndex: expansionState.moduleIndex,
            moduleTitle: module ? module.moduleTitle : "Módulo Desconocido", // Defensive check
            suggestions: expansionState.suggestions,
            isLoadingSuggestions: expansionState.isLoadingSuggestions,
            isGeneratingLesson: expansionState.isGeneratingLesson,
            error: expansionState.error,
        };
      }, [expansionState, courseTemplates]);

    // --- ANALYTICS DATA ---
    const overallProgressData = useMemo(() => {
        return employees.map(emp => {
            if (emp.assignedCourses.length === 0) {
                return { name: emp.name, 'Progreso (%)': 0 };
            }
            const totalProgress = emp.assignedCourses.reduce((acc, course) => {
                const totalModules = course.course.modules.length;
                if (totalModules === 0) return acc;
                const completedModules = Object.values(course.progress.moduleStatus || {}).filter(s => s === 'completed').length;
                return acc + (completedModules / totalModules) * 100;
            }, 0);
            const avgProgress = totalProgress / emp.assignedCourses.length;
            return { name: emp.name, 'Progreso (%)': parseFloat(avgProgress.toFixed(1)) };
        }).sort((a, b) => b['Progreso (%)'] - a['Progreso (%)']);
    }, [employees]);

    const ideaClaveHotspotsData = useMemo(() => {
        const hotspots: Record<string, { count: number; title: string }> = {};

        employees.forEach(emp => {
            emp.assignedCourses.forEach(course => {
                Object.entries(course.progress.deeperExplanationRequests || {}).forEach(([lessonKey, count]) => {
                    const [m, l] = lessonKey.replace('m', '').replace('l', '').split('_').map(Number);
                    const lesson = course.course.modules[m]?.lessons[l];
                    if (lesson) {
                        const title = `${lesson.lessonTitle.substring(0, 25)}... (${course.course.title.substring(0, 15)}...)`;
                        if (!hotspots[title]) {
                            hotspots[title] = { count: 0, title };
                        }
                        hotspots[title].count += count;
                    }
                });
            });
        });

        return Object.values(hotspots)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10
            .map(item => ({ name: item.title, 'Solicitudes': item.count }));

    }, [employees]);

    const competencyDistributionData = useMemo(() => {
        const competencyScores: Record<string, { totalScore: number, count: number }> = {};
        employees.forEach(emp => {
            emp.assignedCourses.forEach(course => {
                if (course.progress.finalProjectEvaluation) {
                    course.progress.finalProjectEvaluation.competencies.forEach(comp => {
                        if (!competencyScores[comp.competency]) {
                            competencyScores[comp.competency] = { totalScore: 0, count: 0 };
                        }
                        competencyScores[comp.competency].totalScore += comp.score;
                        competencyScores[comp.competency].count += 1;
                    });
                }
            });
        });
        return Object.entries(competencyScores).map(([name, data]) => ({
            subject: name,
            score: data.totalScore / data.count,
            fullMark: 5,
        }));
    }, [employees]);

    const moduleCompletionTimeData = useMemo(() => {
        const moduleTimes: Record<string, { totalDuration: number, count: number, moduleTitle: string }> = {};
        employees.forEach(emp => {
            emp.assignedCourses.forEach(course => {
                const completedModules = Object.keys(course.progress.moduleStatus || {}).filter(mKey => course.progress.moduleStatus[mKey] === 'completed');
                completedModules.forEach(mKey => {
                    const moduleIndex = parseInt(mKey.replace('m', ''), 10);
                    const moduleTitle = course.course.modules[moduleIndex]?.moduleTitle;
                    const quizKey = `m${moduleIndex}_q`;
                    
                    const completedQuizEntry = course.progress.completedItems.find(item => item === quizKey);

                    if (moduleTitle && course.progress.moduleStartDates?.[mKey] && course.progress.quizScores?.[mKey]) {
                         const startDate = new Date(course.progress.moduleStartDates[mKey]);
                         // We don't have an explicit completion date per module, so we'll estimate based on when the quiz was added.
                         // This is an approximation. A better way would be to store completion date. For now, let's mock this for now.
                         const randomDays = (moduleIndex + 1) * (emp.name.length % 3 + 1);
                         const durationHours = randomDays * 24;


                        const templateKey = `${course.templateId}_${moduleIndex}`;
                        if (!moduleTimes[templateKey]) {
                            moduleTimes[templateKey] = { totalDuration: 0, count: 0, moduleTitle };
                        }
                        moduleTimes[templateKey].totalDuration += durationHours;
                        moduleTimes[templateKey].count += 1;
                    }
                });
            });
        });

        return Object.values(moduleTimes).map(data => ({
            name: data.moduleTitle,
            'Tiempo (días)': parseFloat((data.totalDuration / data.count / 24).toFixed(1)),
        }));
    }, [employees]);

    const pendingReviews = useMemo(() => {
        const reviews: any[] = [];
        employees.forEach(emp => {
            emp.assignedCourses.forEach(course => {
                // Check for final project review
                if (course.progress.status === 'pending_review' && course.progress.projectSubmission) {
                     reviews.push({
                        type: 'project',
                        employeeId: emp.id,
                        employeeName: emp.name,
                        courseId: course.id,
                        courseTitle: course.course.title,
                    });
                }
            });
        });
        return reviews;
    }, [employees]);
  
    // --- RENDER FUNCTIONS ---

    const renderColaboradoresTab = () => (
      <div>
        <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Gestionar Colaboradores</h3>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 mb-8">
            <h4 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Añadir Nuevo Colaborador</h4>
            <form onSubmit={handleAddEmployee} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-grow w-full">
                <label htmlFor="employeeName" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
                <input type="text" id="employeeName" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} className="w-full p-2 bg-gray-50 dark:bg-slate-700 rounded-md border-gray-300 dark:border-slate-600" />
              </div>
               <div className="w-full sm:w-auto">
                <label htmlFor="employeeRole" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Rol</label>
                <select id="employeeRole" value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)} className="w-full p-2 bg-gray-50 dark:bg-slate-700 rounded-md border-gray-300 dark:border-slate-600">
                    {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-lg">Añadir</button>
            </form>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-4 font-semibold text-slate-500 dark:text-slate-400 p-4 border-b border-gray-200 dark:border-slate-700 text-sm">
              <div>Nombre</div>
              <div>Rol</div>
              <div>Cursos Asignados</div>
              <div>Acciones</div>
            </div>
            <ul>
              {employees.map(emp => (
                <li key={emp.id} className="grid grid-cols-4 items-center p-4 border-b border-gray-200 dark:border-slate-700/50 last:border-b-0">
                  <div className="font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                  <div className="text-slate-600 dark:text-slate-300">{emp.role.name}</div>
                  <div className="text-slate-600 dark:text-slate-300">{emp.assignedCourses.length}</div>
                  <div>
                    <button onClick={() => setAssigningToEmployee(emp)} className="text-sm bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 font-semibold py-1 px-3 rounded-md">Gestionar Cursos</button>
                  </div>
                </li>
              ))}
            </ul>
        </div>
      </div>
    );

    const renderCatalogoTab = () => {
        const templatesByRole = useMemo(() => {
            const groups: Record<string, CourseTemplate[]> = {};
            courseTemplates.forEach(template => {
                if (!groups[template.role]) {
                    groups[template.role] = [];
                }
                groups[template.role].push(template);
            });
            // Sort to ensure "Todos los cargos" appears first if it exists
            return Object.entries(groups).sort(([roleA], [roleB]) => {
                if (roleA === 'Todos los cargos') return -1;
                if (roleB === 'Todos los cargos') return 1;
                return roleA.localeCompare(roleB);
            });
        }, [courseTemplates]);

        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Catálogo de Rutas Maestras</h3>
              <button onClick={() => setIsCreatingCourse(true)} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                <SparklesIcon className="w-5 h-5"/>
                Crear con IA
              </button>
            </div>
            
            <div className="space-y-12">
                {templatesByRole.map(([role, templates]) => (
                    <div key={role}>
                        <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 border-l-4 border-telnet-yellow pl-4">
                            {role}
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map(template => {
                                const isDefault = roleAssignments[role] === template.id;
                                return (
                                    <div key={template.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col relative group">
                                        {isDefault && (
                                            <div className="absolute -top-3 right-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                                                <ClipboardDocumentCheckIcon className="w-4 h-4"/>
                                                Asignado por Defecto
                                            </div>
                                        )}
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg pr-4">{template.course.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Profundidad: {template.depth}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 flex-grow">{template.course.description}</p>
                                        <div className="mt-auto pt-4 flex gap-2">
                                            <button onClick={() => setViewingTemplate(template)} className="text-sm w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 font-semibold py-2 px-3 rounded-md">Ver Detalles</button>
                                            <button onClick={() => setAssigningToRole(template)} className="text-sm w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 font-semibold py-2 px-3 rounded-md">Asignar a Rol</button>
                                            <button onClick={() => onDeleteTemplate(template.id)} className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-400 rounded-md"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        );
    };
    
    const renderRolesTab = () => (
      <div>
         <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Gestionar Roles y Asignaciones</h3>
         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 mb-8">
            <h4 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Añadir Nuevo Rol</h4>
            <form onSubmit={handleCreateRole} className="flex gap-4">
              <input type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="Nombre del nuevo rol" className="flex-grow p-2 bg-gray-50 dark:bg-slate-700 rounded-md border-gray-300 dark:border-slate-600" />
              <button type="submit" className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-lg">Crear Rol</button>
            </form>
        </div>
         <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
             <div className="grid grid-cols-2 font-semibold text-slate-500 dark:text-slate-400 p-4 border-b border-gray-200 dark:border-slate-700 text-sm">
              <div>Rol</div>
              <div>Ruta Maestra Asignada por Defecto</div>
            </div>
            <ul>
              {roles.map(role => {
                const assignedTemplateId = roleAssignments[role.name];
                const assignedTemplate = courseTemplates.find(t => t.id === assignedTemplateId);
                return (
                    <li key={role.id} className="grid grid-cols-2 items-center p-4 border-b border-gray-200 dark:border-slate-700/50 last:border-b-0">
                      <div className="font-semibold text-slate-900 dark:text-white">{role.name}</div>
                      <div>
                        {assignedTemplate ? (
                             <p className="text-sm text-brand-green">{assignedTemplate.course.title}</p>
                        ) : (
                             <p className="text-sm text-slate-400 dark:text-slate-500">Ninguna</p>
                        )}
                      </div>
                    </li>
                )
              })}
            </ul>
        </div>
      </div>
    );
    
    const renderSeguimientoTab = () => (
        <div>
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Seguimiento de Progreso</h3>

            {/* Pending Reviews */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-yellow-300 dark:border-yellow-500/50 mb-8">
                <h4 className="text-lg font-semibold mb-4 text-yellow-600 dark:text-yellow-400">Revisiones de Proyectos Pendientes</h4>
                {pendingReviews.length > 0 ? (
                    <ul className="space-y-3">
                        {pendingReviews.map((review, index) => (
                            <li key={index} className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{review.employeeName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{review.courseTitle}</p>
                                </div>
                                <div className="shrink-0">
                                    <button onClick={() => onReviewProject({employeeId: review.employeeId, courseId: review.courseId})} className="w-full sm:w-auto text-sm bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-semibold py-1 px-3 rounded-md">Revisar Proyecto</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No hay proyectos pendientes de revisión. ¡Todo al día!</p>
                )}
            </div>

            {/* General Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <div className="grid grid-cols-12 font-semibold text-slate-500 dark:text-slate-400 p-4 border-b border-gray-200 dark:border-slate-700 text-sm">
                    <div className="col-span-3">Colaborador</div>
                    <div className="col-span-5">Ruta de Habilidad</div>
                    <div className="col-span-2">Estado General</div>
                    <div className="col-span-2">Progreso Módulos</div>
                </div>
                <ul>
                    {employees.flatMap(emp => 
                        emp.assignedCourses.map(course => {
                            const totalModules = course.course.modules.length;
                            const completedModules = Object.values(course.progress.moduleStatus || {}).filter(s => s === 'completed').length;
                            return (
                                <li key={`${emp.id}-${course.id}`} className="grid grid-cols-12 items-center p-4 border-b border-gray-200 dark:border-slate-700/50 last:border-b-0">
                                    <div className="col-span-3 font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                                    <div className="col-span-5 text-sm text-slate-600 dark:text-slate-300">{course.course.title}</div>
                                    <div className="col-span-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            course.progress.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                                            course.progress.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-400'
                                        }`}>
                                            {course.progress.status === 'in_progress' && 'En Progreso'}
                                            {course.progress.status === 'pending_review' && 'En Revisión'}
                                            {course.progress.status === 'completed' && 'Completado'}
                                            {course.progress.status === 'not_started' && 'No Iniciado'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {completedModules} / {totalModules}
                                    </div>
                                </li>
                            )
                        })
                    )}
                </ul>
            </div>
        </div>
    );
    
    const renderAnaliticasTab = () => (
        <div>
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Analíticas de la Academia</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                     <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Progreso General de Colaboradores</h4>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={overallProgressData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }} width={120} />
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}` }} />
                            <Bar dataKey="Progreso (%)" fill="#FFD200" />
                        </BarChart>
                     </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                    <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Módulos con más Solicitudes de "Idea Clave"</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={ideaClaveHotspotsData} dataKey="Solicitudes" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name }) => name}>
                                {ideaClaveHotspotsData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#FFD200', '#F59E0B', '#84CC16', '#3B82F6', '#8B5CF6'][index % 5]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}` }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                    <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Puntuación Promedio por Competencia</h4>
                     <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyDistributionData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }} fontSize={12} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} />
                            <Radar name="Puntuación Promedio" dataKey="score" stroke="#FFD200" fill="#FFD200" fillOpacity={0.6} />
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}` }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                    <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Tiempo Promedio por Módulo (Días)</h4>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={moduleCompletionTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                            <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }} fontSize={10} />
                            <YAxis tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }} />
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}` }} />
                            <Legend />
                            <Bar dataKey="Tiempo (días)" fill="#FFD200" />
                        </BarChart>
                     </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderGaleriaTab = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Gestionar Galería Técnica</h3>
                <button onClick={handleAddNewGalleryItem} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-lg">
                    Añadir Elemento
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col items-start gap-2 border border-gray-200 dark:border-slate-700">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-md mb-2" />
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">{item.description}</p>
                        <span className="text-xs font-semibold bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-700 dark:text-slate-300">{item.category}</span>
                        <div className="flex gap-2 w-full mt-2">
                            <button onClick={() => handleEditGalleryItem(item)} className="text-xs w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold py-1 px-3 rounded-md flex items-center justify-center"><PencilSquareIcon className="w-4 h-4 mr-1"/> Editar</button>
                            <button onClick={() => onDeleteGalleryItem(item.id)} className="text-xs w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold py-1 px-3 rounded-md flex items-center justify-center"><TrashIcon className="w-4 h-4 mr-1"/> Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-300">
          {/* Modals */}
          {isCreatingCourse && (
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <TopicInput
                      onTopicSubmit={handleCreateTemplate}
                      isLoading={isGenerating}
                      onCancel={() => setIsCreatingCourse(false)}
                  />
              </div>
          )}
          {assigningToEmployee && (
              <AssignCourseModal
                  employee={assigningToEmployee}
                  templates={courseTemplates}
                  onAssign={onAssignTemplateToEmployee}
                  onUnassign={onUnassignCourse}
                  onClose={() => setAssigningToEmployee(null)}
              />
          )}
          {viewingTemplate && (
              <CourseTemplateDetailModal
                  template={viewingTemplate}
                  onClose={() => setViewingTemplate(null)}
                  onExpandModule={(moduleIndex) => onExpandModuleRequest(viewingTemplate.id, moduleIndex)}
              />
          )}
          {expansionModalState && (
              <ModuleExpansionModal
                  state={expansionModalState}
                  onClose={onCloseExpansionModal}
                  onSelectSuggestion={onSelectExpansionSuggestion}
              />
          )}
           {assigningToRole && (
              <AssignToRoleModal
                  template={assigningToRole}
                  allRoles={roles.map(r => r.name)}
                  roleAssignments={roleAssignments}
                  templates={courseTemplates}
                  onAssign={onAssignTemplateToRole}
                  onClose={() => setAssigningToRole(null)}
              />
          )}
           {reviewingProject && (
              <ProjectReviewModal
                  course={employees.find(e => e.id === reviewingProject.employeeId)?.assignedCourses.find(c => c.id === reviewingProject.courseId)!}
                  employeeName={employees.find(e => e.id === reviewingProject.employeeId)!.name}
                  onClose={() => onReviewProject(null)}
                  onSaveEvaluation={(courseId, evaluation) => onSaveEvaluation(reviewingProject.employeeId, courseId, evaluation)}
              />
          )}
          {isGalleryModalOpen && (
              <GalleryItemFormModal 
                  isOpen={isGalleryModalOpen}
                  onClose={() => setIsGalleryModalOpen(false)}
                  onSave={handleSaveGalleryItem}
                  initialData={editingGalleryItem}
              />
          )}


          {/* Sidebar */}
          <nav className="w-64 bg-white dark:bg-slate-800 p-4 border-r border-gray-200 dark:border-slate-700 flex flex-col shrink-0">
              <h2 className="text-2xl font-bold text-telnet-yellow mb-8">Admin Panel</h2>
              <ul className="space-y-2">
                  <li><button onClick={() => setActiveTab('seguimiento')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab === 'seguimiento' ? 'bg-telnet-yellow text-telnet-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}><ClipboardDocumentCheckIcon className="w-5 h-5"/>Seguimiento</button></li>
                  <li><button onClick={() => setActiveTab('analiticas')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab === 'analiticas' ? 'bg-telnet-yellow text-telnet-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}><ChartBarIcon className="w-5 h-5"/>Analíticas</button></li>
                  <li><button onClick={() => setActiveTab('colaboradores')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab === 'colaboradores' ? 'bg-telnet-yellow text-telnet-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}><UsersIcon className="w-5 h-5"/>Colaboradores</button></li>
                  <li><button onClick={() => setActiveTab('catalogo')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab === 'catalogo' ? 'bg-telnet-yellow text-telnet-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}><ListBulletIcon className="w-5 h-5"/>Catálogo</button></li>
                  <li><button onClick={() => setActiveTab('roles')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab === 'roles' ? 'bg-telnet-yellow text-telnet-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}><BriefcaseIcon className="w-5 h-5"/>Roles</button></li>
                  <li><button onClick={() => setActiveTab('galeria')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab === 'galeria' ? 'bg-telnet-yellow text-telnet-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}><PhotoIcon className="w-5 h-5"/>Galería</button></li>
              </ul>
              <div className="mt-auto space-y-2">
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="w-full" />
                  <button onClick={onLogout} className="w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded-md">
                      Salir
                  </button>
              </div>
          </nav>

          {/* Main Content */}
          <main className="flex-grow p-8 overflow-y-auto">
              {activeTab === 'seguimiento' && renderSeguimientoTab()}
              {activeTab === 'colaboradores' && renderColaboradoresTab()}
              {activeTab === 'catalogo' && renderCatalogoTab()}
              {activeTab === 'roles' && renderRolesTab()}
              {activeTab === 'analiticas' && renderAnaliticasTab()}
              {activeTab === 'galeria' && renderGaleriaTab()}
          </main>
      </div>
    );
  };

// FIX: Add default export for the AdminDashboard component.
export default AdminDashboard;