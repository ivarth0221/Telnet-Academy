import React from 'react';
import type { CourseTemplate } from '../types';
import { XCircleIcon } from './IconComponents';

interface AssignToRoleModalProps {
  template: CourseTemplate;
  allRoles: string[];
  roleAssignments: Record<string, string>;
  templates: CourseTemplate[];
  onAssign: (templateId: string | null, role: string) => void;
  onClose: () => void;
}

const AssignToRoleModal: React.FC<AssignToRoleModalProps> = ({ template, allRoles, roleAssignments, templates, onAssign, onClose }) => {
    
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Asignar Ruta a Rol</h2>
            <p className="text-slate-400 text-sm line-clamp-1">Ruta: "{template.course.title}"</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-slate-300 mb-4 text-sm">Selecciona un rol para asignarle esta ruta. Esto asignará automáticamente el curso a todos los empleados (actuales y futuros) con ese rol. Si un rol ya tiene una ruta, será reemplazada.</p>
          <ul className="space-y-3">
            {allRoles.map(role => {
              const assignedTemplateId = roleAssignments[role];
              const isAssignedToThis = assignedTemplateId === template.id;
              const isAssignedToOther = assignedTemplateId && !isAssignedToThis;
              const otherTemplate = isAssignedToOther ? templates.find(t => t.id === assignedTemplateId) : null;

              return (
                <li key={role} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{role}</p>
                    {isAssignedToThis && <p className="text-xs text-green-400">Asignado a esta ruta</p>}
                    {isAssignedToOther && <p className="text-xs text-yellow-400 line-clamp-1" title={otherTemplate?.course.title}>Asignado a: "{otherTemplate?.course.title}"</p>}
                    {!assignedTemplateId && <p className="text-xs text-slate-500">Sin asignación</p>}
                  </div>
                  <div className="shrink-0 ml-2">
                    {isAssignedToThis ? (
                      <button onClick={() => { onAssign(null, role); onClose(); }} className="bg-red-800/80 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors">
                        Quitar
                      </button>
                    ) : (
                      <button onClick={() => { onAssign(template.id, role); onClose(); }} className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black text-xs font-bold py-1 px-3 rounded-md transition-colors">
                        {isAssignedToOther ? 'Reasignar' : 'Asignar'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssignToRoleModal;