import React, { useState } from 'react';
import type { SavedCourse, FinalProjectEvaluation } from '../types';
import { XCircleIcon } from './IconComponents';
import MarkdownRenderer from './MarkdownRenderer';

interface ProjectReviewModalProps {
  course: SavedCourse;
  employeeName: string;
  onClose: () => void;
  onSaveEvaluation: (courseId: string, evaluation: FinalProjectEvaluation) => void;
}

const ProjectReviewModal: React.FC<ProjectReviewModalProps> = ({ course, employeeName, onClose, onSaveEvaluation }) => {
  const project = course.course.finalProject!;
  
  const [scores, setScores] = useState<number[]>(() => Array(project.evaluationCriteria.length).fill(3));
  const [feedbacks, setFeedbacks] = useState<string[]>(() => Array(project.evaluationCriteria.length).fill(''));
  const [overallScore, setOverallScore] = useState<number>(70);
  const [overallFeedback, setOverallFeedback] = useState('');

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };
  
   const handleFeedbackChange = (index: number, value: string) => {
    const newFeedbacks = [...feedbacks];
    newFeedbacks[index] = value;
    setFeedbacks(newFeedbacks);
  };

  const handleSubmit = () => {
    if (!overallFeedback.trim()) {
        alert("Por favor, proporciona un feedback general.");
        return;
    }
    const evaluation: FinalProjectEvaluation = {
      overallScore,
      overallFeedback,
      competencies: project.evaluationCriteria.map((criterion, index) => ({
        competency: criterion,
        score: scores[index],
        feedback: feedbacks[index] || 'Sin comentarios específicos.',
      })),
    };
    onSaveEvaluation(course.id, evaluation);
    onClose();
  };

  const submissionText = course.progress.projectSubmission?.text || "El colaborador no ha realizado una entrega de texto.";
  const submissionImage = course.progress.projectSubmission?.imageUrl;


  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-7xl border border-slate-700 flex flex-col max-h-[95vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Evaluar Competencia Práctica</h2>
            <p className="text-slate-400 text-sm">Colaborador: {employeeName} | Ruta: {course.course.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><XCircleIcon className="w-8 h-8" /></button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Columna 1: Entrega del Colaborador */}
          <div className="lg:col-span-1 space-y-6 pr-4 border-r border-slate-700">
             <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Entrega del Colaborador</h3>
              <div className="bg-slate-900/50 p-4 rounded-md text-sm text-slate-200 whitespace-pre-wrap font-mono overflow-y-auto max-h-60">
                 {submissionText}
              </div>
            </div>
            {submissionImage && (
                <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Evidencia Adjuntada</h3>
                    <div className="bg-slate-900/50 p-2 rounded-md">
                        <img src={submissionImage} alt="Evidencia de proyecto" className="rounded-lg max-h-80 w-auto" />
                    </div>
                </div>
            )}
             <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2 mt-4">{project.title}</h3>
              <div className="prose prose-sm prose-invert text-slate-300">
                <MarkdownRenderer content={project.description} courseContext={course.course.title} />
              </div>
            </div>
          </div>

          {/* Columna 2: Formulario de Evaluación */}
          <div className="lg:col-span-1 space-y-4">
             <h3 className="text-lg font-bold text-yellow-400 mb-2">Formulario del Evaluador</h3>
             <div className="bg-slate-900/30 p-3 rounded-md">
                <h4 className="text-md font-semibold text-slate-300 mb-2">Evaluación por Competencias</h4>
                {project.evaluationCriteria.map((criterion, index) => (
                    <div key={index} className="mb-3">
                        <label className="block text-sm font-medium text-slate-300 mb-2">{criterion}</label>
                        <div className="flex items-center gap-4">
                            <input type="range" min="1" max="5" value={scores[index]} onChange={(e) => handleScoreChange(index, parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                            <span className="text-yellow-400 font-bold text-lg">{scores[index]}/5</span>
                        </div>
                        <textarea value={feedbacks[index]} onChange={e => handleFeedbackChange(index, e.target.value)} rows={2} placeholder="Feedback específico (opcional)..." className="w-full p-2 mt-2 bg-slate-700 rounded-md text-xs" />
                    </div>
                ))}
             </div>
             <div className="bg-slate-900/30 p-3 rounded-md">
                <label className="block text-sm font-medium text-slate-300 mb-1">Feedback General (Obligatorio)</label>
                <textarea value={overallFeedback} onChange={e => setOverallFeedback(e.target.value)} rows={4} className="w-full p-2 bg-slate-700 rounded-md text-sm" />
             </div>
             <div className="bg-slate-900/30 p-3 rounded-md">
                <label className="block text-sm font-medium text-slate-300 mb-1">Puntuación General (0-100)</label>
                <input type="number" min="0" max="100" value={overallScore} onChange={e => setOverallScore(parseInt(e.target.value))} className="w-full p-2 bg-slate-700 rounded-md text-2xl font-bold text-center" />
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 text-right shrink-0">
          <button onClick={handleSubmit} className="bg-yellow-500 text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
            Guardar Evaluación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectReviewModal;