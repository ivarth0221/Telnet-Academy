import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { Employee, CourseTemplate, Role, SavedCourse, FinalProjectEvaluation, GalleryItem } from '../types';
import TopicInput from './TopicInput';
import type { CourseWizardPayload } from './TopicInput';
import AssignCourseModal from './AssignCourseModal';
import CourseTemplateDetailModal from './CourseTemplateDetailModal';
import { BriefcaseIcon, BookOpenIcon, UserCircleIcon, TrashIcon, SparklesIcon, UsersIcon, ChartBarIcon, TrophyIcon, ListBulletIcon, ChevronDownIcon, PhotoIcon, PencilSquareIcon, InformationCircleIcon, ClipboardDocumentCheckIcon, PlusCircleIcon } from './IconComponents';
import AssignToRoleModal from './AssignToRoleModal';
import ProjectReviewModal from './ProjectReviewModal';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import GalleryItemFormModal from './GalleryItemFormModal';
import ThemeToggle from './ThemeToggle';
import LoadingSpinner from './LoadingSpinner';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.FC<any> }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex items-center gap-4">
        <div className="p-3 rounded-full bg-telnet-yellow/20 text-telnet-yellow">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const {
        employees, courseTemplates, roles, roleAssignments, galleryItems,
        isGenerating, reviewingProject, theme, isAddingEmployee, isAddingRole,
        createCourseTemplate, deleteTemplate, addEmployee, addRole,
        assignTemplateToEmployee, unassignCourse, assignTemplateToRole,
        saveEvaluation, setReviewingProject, addGalleryItem,
        updateGalleryItem, deleteGalleryItem, openExpansionModal,
        logout, toggleTheme
    } = useAppStore(state => ({
        employees: state.appState.employees,
        courseTemplates: state.appState.courseTemplates,
        roles: state.appState.roles,
        roleAssignments: state.appState.roleAssignments,
        galleryItems: state.appState.galleryItems,
        isGenerating: state.isGenerating,
        reviewingProject: state.reviewingProject,
        theme: state.theme,
        isAddingEmployee: state.isAddingEmployee,
        isAddingRole: state.isAddingRole,
        createCourseTemplate: state.createCourseTemplate,
        deleteTemplate: state.deleteTemplate,
        addEmployee: state.addEmployee,
        addRole: state.addRole,
        assignTemplateToEmployee: state.assignTemplateToEmployee,
        unassignCourse: state.unassignCourse,
        assignTemplateToRole: state.assignTemplateToRole,
        saveEvaluation: state.saveEvaluation,
        setReviewingProject: state.setReviewingProject,
        addGalleryItem: state.addGalleryItem,
        updateGalleryItem: state.updateGalleryItem,
        deleteGalleryItem: state.deleteGalleryItem,
        openExpansionModal: state.openExpansionModal,
        logout: state.logout,
        toggleTheme: state.toggleTheme,
    }));

    const [isCreatingCourse, setIsCreatingCourse] = useState(false);
    const [assigningToEmployee, setAssigningToEmployee] = useState<Employee | null>(null);
    const [activeTab, setActiveTab] = useState<'analiticas' | 'seguimiento' | 'colaboradores' | 'catalogo' | 'roles' | 'galeria'>('analiticas');
    const [selectedTemplate, setSelectedTemplate] = useState<CourseTemplate | null>(null);
    const [assigningToRole, setAssigningToRole] = useState<CourseTemplate | null>(null);
    const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false);
    const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
    
    // State for new employee/role forms
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [newEmployeeRole, setNewEmployeeRole] = useState(roles[0]?.id || '');
    const [newRoleName, setNewRoleName] = useState('');


    const openGalleryForm = (item?: GalleryItem) => {
        setEditingGalleryItem(item || null);
        setIsGalleryFormOpen(true);
    };

    const handleSaveGalleryItem = (itemData: GalleryItem | Omit<GalleryItem, 'id'>) => {
        if ('id' in itemData) {
            updateGalleryItem(itemData);
        } else {
            addGalleryItem(itemData);
        }
        setIsGalleryFormOpen(false);
    };
    
    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEmployee(newEmployeeName, newEmployeeRole);
        setNewEmployeeName('');
    };

    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault();
        await addRole(newRoleName);
        setNewRoleName('');
    };
    
    const projectsToReview = useMemo(() => {
        const projects: { employee: Employee; course: SavedCourse }[] = [];
        employees.forEach(emp => {
            emp.assignedCourses.forEach(course => {
                if (course.progress.status === 'pending_review' && course.progress.projectSubmission) {
                    projects.push({ employee: emp, course: course });
                }
            });
        });
        return projects;
    }, [employees]);

    const analyticsData = useMemo(() => {
        const userEmployees = employees.filter(e => e.role.name !== 'Administrador');
        const totalAssignedCourses = userEmployees.reduce((acc, emp) => acc + emp.assignedCourses.length, 0);
        const totalCompletedCourses = userEmployees.reduce((acc, emp) => acc + emp.assignedCourses.filter(c => c.progress.status === 'completed').length, 0);
        
        const courseStatusCounts = userEmployees.flatMap(e => e.assignedCourses).reduce((acc, course) => {
            const status = course.progress.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<SavedCourse['progress']['status'], number>);

        const levelCounts = userEmployees.reduce((acc, emp) => {
            const level = emp.gamification.level;
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return {
            totalEmployees: userEmployees.length,
            totalTemplates: courseTemplates.length,
            completionRate: totalAssignedCourses > 0 ? ((totalCompletedCourses / totalAssignedCourses) * 100).toFixed(1) : 0,
            averageLevel: userEmployees.length > 0 ? (userEmployees.reduce((acc, emp) => acc + emp.gamification.level, 0) / userEmployees.length).toFixed(1) : 0,
            courseStatusChart: [
                { name: 'Completados', value: courseStatusCounts.completed || 0 },
                { name: 'En Progreso', value: courseStatusCounts.in_progress || 0 },
                { name: 'Sin Iniciar', value: courseStatusCounts.not_started || 0 },
                { name: 'En Revisión', value: courseStatusCounts.pending_review || 0 },
            ],
            levelsChart: Object.entries(levelCounts).map(([level, count]) => ({ level: `Nivel ${level}`, count })),
        };
    }, [employees, courseTemplates]);

    const handleCreateTemplate = (payload: CourseWizardPayload) => {
        createCourseTemplate(payload);
        setIsCreatingCourse(false);
    };

    const TabButton: React.FC<{ tabId: typeof activeTab, icon: React.FC<any>, label: string }> = ({ tabId, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                activeTab === tabId
                    ? 'bg-telnet-yellow/20 text-telnet-yellow'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderSeguimientoTab = () => (
        <div className="space-y-6">
             <h2 className="text-3xl font-bold">Proyectos Pendientes de Revisión ({projectsToReview.length})</h2>
             {projectsToReview.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {projectsToReview.map(({ employee, course }) => (
                         <div key={course.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                             <h3 className="font-bold text-lg text-telnet-yellow">{course.course.finalProject?.title}</h3>
                             <p className="text-sm mt-1">Ruta: <span className="font-semibold">{course.course.title}</span></p>
                             <p className="text-sm">Colaborador: <span className="font-semibold">{employee.name}</span></p>
                             <button
                                 onClick={() => setReviewingProject({ employeeId: employee.id, courseId: course.id })}
                                 className="w-full mt-4 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2"
                             >
                                 <ClipboardDocumentCheckIcon className="w-5 h-5" />
                                 Evaluar Entrega
                             </button>
                         </div>
                     ))}
                 </div>
             ) : (
                 <p className="text-slate-500 dark:text-slate-400">No hay proyectos pendientes de evaluación en este momento.</p>
             )}
        </div>
    );
    
    const renderColaboradoresTab = () => (
         <div className="space-y-6">
            <h2 className="text-3xl font-bold">Gestionar Colaboradores</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                <form onSubmit={handleAddEmployee} className="flex items-end gap-4 p-2 mb-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex-grow">
                        <label htmlFor="employee-name" className="text-xs font-bold">Nombre del Colaborador</label>
                        <input id="employee-name" type="text" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md" required />
                    </div>
                     <div className="flex-grow">
                        <label htmlFor="employee-role" className="text-xs font-bold">Rol Asignado</label>
                        <select id="employee-role" value={newEmployeeRole} onChange={e => setNewEmployeeRole(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md" required>
                           {roles.filter(r => r.name !== 'Administrador').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={isAddingEmployee} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-md disabled:bg-slate-500 flex items-center justify-center gap-2">
                         {isAddingEmployee ? 'Añadiendo...' : 'Añadir'}
                    </button>
                </form>
                <div className="space-y-3">
                     {employees.filter(e => e.role.name !== 'Administrador').map(emp => (
                        <div key={emp.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md">
                            <div>
                                <p className="font-bold">{emp.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{emp.role.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setAssigningToEmployee(emp)} className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold py-1 px-3 rounded-md">Gestionar Rutas</button>
                                <button className="p-2 text-slate-400 hover:text-red-500 rounded-md"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCatalogoTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Catálogo de Rutas Maestras</h2>
                <button onClick={() => setIsCreatingCourse(true)} className="flex items-center gap-2 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-md">
                    <SparklesIcon className="w-5 h-5"/> Crear Nueva Ruta
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseTemplates.map(template => (
                    <div key={template.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col">
                        <h3 className="font-bold text-lg text-telnet-yellow">{template.course.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rol: {template.role}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Nivel: {template.depth}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex-grow flex items-end gap-2">
                            <button onClick={() => setSelectedTemplate(template)} className="text-xs flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold py-2 px-3 rounded-md">Detalles</button>
                            <button onClick={() => setAssigningToRole(template)} className="text-xs flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold py-2 px-3 rounded-md">Asignar a Rol</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    const renderRolesTab = () => (
         <div className="space-y-6">
            <h2 className="text-3xl font-bold">Gestionar Roles y Asignaciones</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                <form onSubmit={handleAddRole} className="flex items-end gap-4 p-2 mb-4 border-b border-gray-200 dark:border-slate-700">
                     <div className="flex-grow">
                        <label htmlFor="role-name" className="text-xs font-bold">Nombre del Nuevo Rol</label>
                        <input id="role-name" type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md" required />
                    </div>
                    <button type="submit" disabled={isAddingRole} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-md disabled:bg-slate-500 flex items-center justify-center gap-2">
                         {isAddingRole ? 'Añadiendo...' : 'Añadir Rol'}
                    </button>
                </form>
                <ul className="space-y-3">
                    {roles.map(role => {
                        const assignedTemplateId = roleAssignments[role.name];
                        const template = courseTemplates.find(t => t.id === assignedTemplateId);
                        return (
                             <li key={role.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md">
                                <p className="font-bold">{role.name}</p>
                                {template ? (
                                    <p className="text-sm text-green-600 dark:text-green-400">Asignado a: <span className="font-semibold">{template.course.title}</span></p>
                                ): (
                                    <p className="text-sm text-slate-400 dark:text-slate-500">Sin asignación</p>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
    const renderAnaliticasTab = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Analíticas de Aprendizaje</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Colaboradores Activos" value={analyticsData.totalEmployees} icon={UsersIcon} />
                <StatCard title="Rutas Disponibles" value={analyticsData.totalTemplates} icon={BookOpenIcon} />
                <StatCard title="Tasa de Finalización" value={`${analyticsData.completionRate}%`} icon={TrophyIcon} />
                <StatCard title="Nivel Promedio" value={analyticsData.averageLevel} icon={ChartBarIcon} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 h-96">
                     <h3 className="font-bold mb-4">Estado de Rutas Asignadas</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={analyticsData.courseStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {analyticsData.courseStatusChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#10B981', '#F97316', '#6C757D', '#FFD200'][index % 4]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                </div>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 h-96">
                     <h3 className="font-bold mb-4">Distribución de Niveles</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.levelsChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'}/>
                            <XAxis dataKey="level" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#6b7280' }}/>
                            <YAxis allowDecimals={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#6b7280' }}/>
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff' }} />
                            <Bar dataKey="count" fill="#FFD200" name="Colaboradores" />
                        </BarChart>
                     </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
    const renderGaleriaTab = () => (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Gestionar Galería Técnica</h2>
                <button onClick={() => openGalleryForm()} className="flex items-center gap-2 bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-4 rounded-md">
                    <SparklesIcon className="w-5 h-5"/> Añadir Elemento
                </button>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                <div className="space-y-3">
                     {galleryItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md">
                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-md"/>
                            <div className="flex-grow">
                                <p className="font-bold">{item.title} <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full ml-2">{item.category}</span></p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openGalleryForm(item)} className="p-2 text-slate-400 hover:text-telnet-yellow rounded-md"><PencilSquareIcon className="w-5 h-5"/></button>
                                <button onClick={() => deleteGalleryItem(item.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-md"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const reviewingCourse = useMemo(() => {
        if (!reviewingProject) return null;
        const employee = employees.find(e => e.id === reviewingProject.employeeId);
        const course = employee?.assignedCourses.find(c => c.id === reviewingProject.courseId);
        return course ? { employee, course } : null;
    }, [reviewingProject, employees]);

    const renderContent = () => {
        switch (activeTab) {
            case 'seguimiento': return renderSeguimientoTab();
            case 'colaboradores': return renderColaboradoresTab();
            case 'catalogo': return renderCatalogoTab();
            case 'roles': return renderRolesTab();
            case 'analiticas': return renderAnaliticasTab();
            case 'galeria': return renderGaleriaTab();
            default: return <p>Selecciona una opción</p>;
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-300">
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
                    onAssign={assignTemplateToEmployee}
                    onUnassign={unassignCourse}
                    onClose={() => setAssigningToEmployee(null)}
                />
            )}
            {selectedTemplate && (
                <CourseTemplateDetailModal 
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                    onExpandModule={(moduleIndex) => openExpansionModal(selectedTemplate.id, moduleIndex, 'template')}
                />
            )}
            {assigningToRole && (
                <AssignToRoleModal 
                    template={assigningToRole}
                    allRoles={roles.map(r => r.name)}
                    roleAssignments={roleAssignments}
                    templates={courseTemplates}
                    onAssign={assignTemplateToRole}
                    onClose={() => setAssigningToRole(null)}
                />
            )}
            {reviewingCourse && (
                <ProjectReviewModal
                    course={reviewingCourse.course}
                    employeeName={reviewingCourse.employee!.name}
                    onClose={() => setReviewingProject(null)}
                    onSaveEvaluation={(courseId, evaluation) => saveEvaluation(reviewingCourse.employee!.id, courseId, evaluation)}
                />
            )}
            <GalleryItemFormModal 
                isOpen={isGalleryFormOpen}
                onClose={() => setIsGalleryFormOpen(false)}
                onSave={handleSaveGalleryItem}
                initialData={editingGalleryItem}
            />

            <nav className="w-72 bg-white dark:bg-slate-800 p-4 border-r border-gray-200 dark:border-slate-700 flex flex-col shrink-0">
                 <div className="flex items-center gap-3 mb-8 px-2">
                    <img src={theme === 'dark' ? "https://i.imgur.com/rDAq1J8.png" : "https://www.telnet.com.co/wp-content/uploads/2021/07/logo-Telnet-negro.png"} alt="Logo" className="h-8"/>
                    <span className="font-bold text-xl">Admin Panel</span>
                </div>
                <div className="space-y-2">
                    <TabButton tabId="analiticas" icon={ChartBarIcon} label="Analíticas" />
                    <TabButton tabId="seguimiento" icon={ClipboardDocumentCheckIcon} label="Seguimiento" />
                    <TabButton tabId="colaboradores" icon={UsersIcon} label="Colaboradores" />
                    <TabButton tabId="catalogo" icon={BookOpenIcon} label="Catálogo de Rutas" />
                    <TabButton tabId="roles" icon={BriefcaseIcon} label="Roles y Asignaciones" />
                    <TabButton tabId="galeria" icon={PhotoIcon} label="Galería" />
                </div>
                 <div className="mt-auto space-y-2">
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="w-full" />
                  <button onClick={logout} className="w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded-md">
                      Salir
                  </button>
              </div>
            </nav>

            <main className="flex-grow p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;