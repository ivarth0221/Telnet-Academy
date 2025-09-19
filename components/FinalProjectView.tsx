import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { View } from '../types';
import type { FinalProject, Progress, FinalProjectEvaluation, ProjectSubmission } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { SparklesIcon, TrophyIcon, ClockIcon, PhotoIcon, ArrowUpTrayIcon, XCircleIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

const CompetencyMeter: React.FC<{ label: string, score: number, feedback: string }> = ({ label, score, feedback }) => (
    <div>
        <div className="flex justify-between items-baseline mb-1.5">
            <h4 className="font-semibold text-slate-300">{label}</h4>
            <span className="font-bold text-lg text-telnet-yellow">{score}<span className="text-sm text-slate-400">/5</span></span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-telnet-yellow h-2.5 rounded-full" style={{ width: `${(score / 5) * 100}%` }}></div>
        </div>
        <p className="text-sm text-slate-400 mt-2 italic">"{feedback}"</p>
    </div>
);

const FinalProjectView: React.FC = () => {
    const { activeCourse, submitProject, returnToDashboard, selectView } = useAppStore(state => ({
      activeCourse: state.getters.activeCourse(),
      submitProject: state.submitProject,
      returnToDashboard: state.returnToDashboard,
      selectView: state.selectView,
    }));

    useEffect(() => {
        if (!activeCourse) {
            returnToDashboard();
        }
    }, [activeCourse, returnToDashboard]);

    const [submissionText, setSubmissionText] = useState('');
    const [submissionImage, setSubmissionImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!activeCourse) {
        return null;
    }

    const { course, progress } = activeCourse;
    const project = course.finalProject;

    if (!project) {
        useEffect(() => {
            selectView(View.EXAM);
        }, [selectView]);
        return (
             <div className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900 flex flex-col items-center justify-center text-center">
                <LoadingSpinner message="Esta ruta no tiene proyecto. Redireccionando al examen final..." />
            </div>
        );
    }
    const courseContext = course.title;
    
    const isSubmitted = progress.completedItems.has('final_project_submitted');
    const existingEvaluation = progress.finalProjectEvaluation;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSubmissionImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submissionText.trim().length < 50) {
          alert('Tu entrega parece muy corta. Por favor, detalla más tu trabajo.');
          return;
        }
        
        setIsSubmitting(true);
        setError(null);
        try {
            await submitProject({ text: submissionText, imageUrl: submissionImage || undefined });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error al entregar el proyecto.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (existingEvaluation) {
        const submittedImage = progress.projectSubmission?.imageUrl;
        return (
             <div className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-10 text-center">
                        <TrophyIcon className="w-16 h-16 mx-auto text-telnet-yellow mb-4" />
                        <h1 className="text-4xl font-bold text-white">Evaluación de Competencia Completada</h1>
                        <p className="text-slate-400 mt-2">¡Excelente trabajo! Aquí está el análisis detallado de tu desempeño.</p>
                    </header>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">Feedback General del Evaluador</h2>
                                    <div className="prose prose-invert max-w-none text-slate-300">
                                        <MarkdownRenderer content={existingEvaluation.overallFeedback} courseContext={courseContext} />
                                    </div>
                                </div>
                                {submittedImage && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-100 mb-3">Evidencia Adjuntada</h3>
                                        <img src={submittedImage} alt="Evidencia de proyecto" className="rounded-lg max-h-80 w-auto" />
                                    </div>
                                )}
                           </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
                                 <h3 className="text-xl font-bold text-slate-100 mb-3">Puntuación General</h3>
                                 <p className="text-7xl font-bold text-green-400 my-2">{existingEvaluation.overallScore}</p>
                                 <p className="text-slate-300 font-semibold">sobre 100</p>
                            </div>
                             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-slate-100 mb-4">Desglose por Competencias</h3>
                                <div className="space-y-4">
                                    {existingEvaluation.competencies.map(c => <CompetencyMeter key={c.competency} label={c.competency} score={c.score} feedback={c.feedback} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isSubmitted) {
        return (
            <div className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900 flex flex-col items-center justify-center text-center">
                <ClockIcon className="w-20 h-20 text-telnet-yellow animate-pulse mb-6" />
                <h1 className="text-4xl font-bold text-white">Entrega Recibida</h1>
                <p className="text-slate-400 mt-2 max-w-xl">Tu proyecto ha sido enviado y está pendiente de evaluación por un administrador. Recibirás una notificación cuando tu feedback esté listo.</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 flex-grow h-full overflow-y-auto bg-slate-900">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center">
                    <TrophyIcon className="w-12 h-12 mx-auto text-telnet-yellow mb-4" />
                    <h1 className="text-4xl font-bold text-slate-100 mt-1">{project.title}</h1>
                    <p className="text-slate-300 mt-4 text-lg">Es el momento de demostrar tu dominio práctico de las competencias adquiridas.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Descripción del Desafío</h2>
                        <div className="prose prose-invert prose-lg max-w-none">
                            <MarkdownRenderer content={project.description} courseContext={courseContext} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Criterios de Evaluación</h3>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                {project.evaluationCriteria.map((criterion, index) => (
                                    <li key={index}>{criterion}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Tu Entrega</h3>
                            <div>
                                <label htmlFor="submission-text" className="block text-sm font-medium text-slate-400 mb-2">Descripción y Desarrollo</label>
                                <textarea
                                    id="submission-text"
                                    value={submissionText}
                                    onChange={e => setSubmissionText(e.target.value)}
                                    rows={8}
                                    placeholder="Escribe tu respuesta, pega enlaces o describe tu solución aquí..."
                                    className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition font-mono text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Adjuntar Evidencia (Imagen)</label>
                                {submissionImage ? (
                                    <div className="relative group">
                                        <img src={submissionImage} alt="Vista previa de la evidencia" className="rounded-lg max-h-48 w-auto border-2 border-slate-600" />
                                        <button onClick={() => setSubmissionImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100">
                                            <XCircleIcon className="w-6 h-6"/>
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg bg-slate-700/50 hover:bg-slate-700/80 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ArrowUpTrayIcon className="w-8 h-8 mb-2 text-slate-500"/>
                                            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                                            <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX. 2MB)</p>
                                        </div>
                                        <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                                {isSubmitting ? (
                                    <div className="mt-4"><LoadingSpinner message="Enviando entrega..." /></div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!submissionText.trim()}
                                        className="w-full mt-6 bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        Enviar para Evaluación <SparklesIcon className="w-5 h-5" />
                                    </button>
                                )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FinalProjectView;