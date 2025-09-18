import React from 'react';
import type { Employee, CourseTemplate } from '../types';
import { XCircleIcon, TrashIcon } from './IconComponents';

interface AssignCourseModalProps {
  employee: Employee;
  templates: CourseTemplate[];
  onAssign: (employeeId: string, templateId: string) => void;
  onUnassign: (employeeId: string, courseId: string) => void;
  onClose: () => void;
}

const AssignCourseModal: React.FC<AssignCourseModalProps> = ({ employee, templates, onAssign, onUnassign, onClose }) => {
    
  const handleAssignClick = (templateId: string) => {
    onAssign(employee.id, templateId);
  };

  const handleUnassignClick = (courseId: string) => {
    onUnassign(employee.id, courseId);
  };

  const assignedTemplateIds = new Set(employee.assignedCourses.map(c => c.templateId));
  const availableTemplates = templates.filter(t => !assignedTemplateIds.has(t.id));

  const generalTemplates = availableTemplates.filter(t => t.role === 'Todos los cargos');
  const roleSpecificTemplates = availableTemplates.filter(t => t.role === employee.role.name);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Gestionar Rutas de Habilidad</h2>
            <p className="text-slate-400 text-sm">para: {employee.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {employee.assignedCourses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-2 px-1">Rutas Asignadas</h3>
              <ul className="space-y-2">
                {employee.assignedCourses.map(course => (
                  <li key={course.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                    <p className="font-semibold text-white text-sm">{course.course.title}</p>
                    <button
                      onClick={() => handleUnassignClick(course.id)}
                      className="p-2 bg-slate-600 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                      title="Quitar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {availableTemplates.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-2 px-1">Asignar Nueva Ruta</h3>
              {roleSpecificTemplates.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 px-1">Específicas para: {employee.role.name}</h4>
                  <ul className="space-y-2">
                    {roleSpecificTemplates.map(template => (
                       <li key={template.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                           <div>
                               <p className="font-bold text-white text-sm">{template.course.title}</p>
                               <p className="text-xs text-slate-400 mt-1">Nivel: {template.depth}</p>
                           </div>
                           <button
                               onClick={() => handleAssignClick(template.id)}
                               className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black text-xs font-bold py-1 px-3 rounded-md transition-colors shrink-0 ml-2"
                           >
                               Asignar
                           </button>
                       </li>
                    ))}
                  </ul>
                </div>
              )}

              {generalTemplates.length > 0 && (
                 <div>
                  <h3 className="text-sm font-bold uppercase text-slate-500 mb-2 px-1">Generales (Todos los cargos)</h3>
                  <ul className="space-y-2">
                    {generalTemplates.map(template => (
                       <li key={template.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                           <div>
                               <p className="font-bold text-white text-sm">{template.course.title}</p>
                               <p className="text-xs text-slate-400 mt-1">General | Nivel: {template.depth}</p>
                           </div>
                           <button
                               onClick={() => handleAssignClick(template.id)}
                               className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black text-xs font-bold py-1 px-3 rounded-md transition-colors shrink-0 ml-2"
                           >
                               Asignar
                           </button>
                       </li>
                    ))}
                  </ul>
                </div>
              )}

              {roleSpecificTemplates.length === 0 && generalTemplates.length === 0 && (
                 <p className="text-center text-slate-400 py-8">No hay Rutas Maestras disponibles que coincidan con el rol de este colaborador.</p>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">No hay más Rutas Maestras para asignar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignCourseModal;