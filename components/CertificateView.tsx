import React, { useState, useEffect, useMemo } from 'react';
import type { Course, Progress, CertificateData } from '../types';
import { generateCertificateData } from '../services/geminiService';
import { ArrowDownTrayIcon, ShareIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

interface CertificateViewProps {
  course: Course;
  progress: Progress;
  userName: string | null;
  onUpdateUserName: (name: string) => void;
}

const TELNET_LOGO_URL = 'https://i.imgur.com/rDAq1J8.png'; // White logo on transparent bg

const toBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Failed to fetch image'));
      }
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
};


const CertificateView: React.FC<CertificateViewProps> = ({ course, progress, userName, onUpdateUserName }) => {
    const [nameInput, setNameInput] = useState(userName || '');
    const [isEditingName, setIsEditingName] = useState(!userName);
    const [data, setData] = useState<CertificateData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [logoBase64, setLogoBase64] = useState<string | null>(null);

    useEffect(() => {
        toBase64(TELNET_LOGO_URL)
            .then(setLogoBase64)
            .catch(err => {
                console.error("Error loading logo:", err);
                setError("No se pudo cargar el logo para el certificado.");
            });

        if (userName) {
            setIsLoading(true);
            generateCertificateData(course, userName)
                .then(setData)
                .catch(err => setError(err.message || "No se pudo generar la información del certificado."))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [course, userName]);
    
    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(nameInput.trim()){
            onUpdateUserName(nameInput.trim());
            setIsEditingName(false);
        }
    };
    
    const handleDownloadPdf = async () => {
        if (!data || !userName || !logoBase64) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.addFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hjg.ttf', 'Inter', 'normal');
        doc.addFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjg.ttf', 'Inter', 'bold');
        
        // Background
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        const yellowColor = '#FFD200'; // telnet-yellow
        
        doc.setFillColor(30, 41, 59); // slate-800
        doc.rect(20, 20, pageWidth - 40, pageHeight - 40, 'F');

        doc.setDrawColor(yellowColor);
        doc.setLineWidth(1);
        doc.rect(23, 23, pageWidth - 46, pageHeight - 46);
        
        doc.addImage(logoBase64, 'PNG', 35, 35, 60, 17.6);
        
        doc.setFont('Inter', 'normal').setFontSize(10).setTextColor(148, 163, 184); // slate-400
        doc.text("CERTIFICADO DE FINALIZACIÓN DE COMPETENCIAS", pageWidth / 2, 70, { align: 'center' });
        
        doc.setFont('Inter', 'bold').setFontSize(36).setTextColor(255, 255, 255);
        doc.text(userName, pageWidth / 2, 95, { align: 'center' });
        
        doc.setFont('Inter', 'normal').setFontSize(11).setTextColor(203, 213, 225); // slate-300
        const splitText = doc.splitTextToSize(`Ha demostrado satisfactoriamente las competencias requeridas en la ruta de habilidad:`, 180);
        doc.text(splitText, pageWidth / 2, 110, { align: 'center' });
        
        doc.setFont('Inter', 'bold').setFontSize(16).setTextColor(yellowColor);
        doc.text(course.title, pageWidth / 2, 125, { align: 'center' });

        const signatureY = pageHeight - 55;
        doc.setDrawColor(100, 116, 139); // slate-500
        
        doc.line(40, signatureY, 110, signatureY);
        doc.setFont('Inter', 'bold').setFontSize(10).setTextColor(255);
        doc.text("Director de Talento Humano", 75, signatureY + 7, { align: 'center' });
        doc.setFont('Inter', 'normal').setFontSize(8).setTextColor(148, 163, 184);
        doc.text("TELNET CO", 75, signatureY + 11, { align: 'center' });
        
        doc.line(pageWidth - 110, signatureY, pageWidth - 40, signatureY);
        doc.setFont('Inter', 'bold').setFontSize(10).setTextColor(255);
        doc.text("Líder Técnico Principal", pageWidth - 75, signatureY + 7, { align: 'center' });
        doc.setFont('Inter', 'normal').setFontSize(8).setTextColor(148, 163, 184);
        doc.text("TELNET CO", pageWidth - 75, signatureY + 11, { align: 'center' });
        
        doc.setFont('monospace').setFontSize(8).setTextColor(100, 116, 139);
        doc.text(`ID de Validación: ${data.validationId} | Fecha de Emisión: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 28, { align: 'center' });
        
        doc.save(`${userName.replace(/\s/g, '_')}_Certificado_TELNET_ACADEMY.pdf`);
    };

    if (isLoading) {
        return <div className="flex-grow flex items-center justify-center"><LoadingSpinner message="Generando certificado..." /></div>;
    }
    
    if (error) {
        return <div className="flex-grow flex items-center justify-center text-red-400 p-8 text-center">{error}</div>;
    }

    if (isEditingName || !userName) {
        return (
            <div className="p-10 flex-grow flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-2">¡Felicitaciones por calificar para el certificado!</h2>
                <p className="text-slate-400 mb-6">Ingresa tu nombre completo para generar tu certificado de finalización, avalado por TELNET CO.</p>
                <form onSubmit={handleNameSubmit} className="flex gap-2">
                    <input 
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Tu Nombre Completo"
                        className="p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-telnet-yellow focus:border-telnet-yellow outline-none transition-colors"
                    />
                    <button type="submit" className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-3 px-4 rounded-lg">Generar</button>
                </form>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 flex-grow h-full overflow-y-auto flex flex-col items-center bg-slate-900">
            <div className="w-full max-w-6xl text-center mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Tu Certificado Profesional</h1>
                <p className="text-slate-400">¡Has demostrado tus habilidades! Aquí está tu reconocimiento oficial de TELNET CO.</p>
            </div>
            
            <div 
              className="w-full max-w-6xl aspect-[297/210] bg-slate-900 text-white rounded-lg shadow-2xl relative overflow-hidden font-sans border-2 border-slate-700"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <div className="absolute inset-5 bg-slate-800 border border-telnet-yellow rounded-md"></div>
                <div className="relative z-10 flex flex-col h-full p-10 md:p-16">
                    <header className="flex justify-between items-start">
                        {logoBase64 && <img src={logoBase64} alt="TELNET CO Logo" className="h-10 sm:h-12"/>}
                        <div className="text-right">
                           <p className="font-bold text-telnet-yellow text-sm">Competencia Validada</p>
                           <p className="text-xs text-slate-400">TELNET ACADEMY</p>
                        </div>
                    </header>

                    <main className="text-center flex-grow flex flex-col justify-center items-center -mt-8">
                        <p className="text-xs sm:text-sm text-slate-400 tracking-[0.2em]">CERTIFICADO DE FINALIZACIÓN</p>
                        <p className="text-2xl sm:text-4xl md:text-5xl font-bold text-white my-4">{userName}</p>

                        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                           Ha demostrado satisfactoriamente las competencias requeridas en la ruta de habilidad:
                        </p>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-telnet-yellow mt-2">
                            {course.title}
                        </p>

                    </main>

                    <footer className="flex justify-between items-end text-xs text-gray-700 mt-auto">
                        <div className="text-left w-2/5">
                            <p className="text-[10px] sm:text-xs font-bold text-white">Director de Talento Humano</p>
                            <p className="text-[8px] sm:text-[10px] text-slate-400">TELNET CO</p>
                            <hr className="border-slate-600 mt-1 w-32"/>
                        </div>
                        <div className="text-center w-1/5">
                            <p className="font-mono text-[8px] sm:text-[10px] text-slate-500">ID: {data?.validationId}</p>
                            <p className="font-mono text-[8px] sm:text-[10px] text-slate-500">Fecha: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right w-2/5">
                            <p className="text-[10px] sm:text-xs font-bold text-white">Líder Técnico Principal</p>
                            <p className="text-[8px] sm:text-[10px] text-slate-400">TELNET CO</p>
                            <hr className="border-slate-600 mt-1 w-32 ml-auto"/>
                        </div>
                    </footer>
                </div>
            </div>

            <div className="flex gap-4">
                 <button 
                    onClick={handleDownloadPdf} 
                    disabled={!logoBase64}
                    className="mt-6 flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Descargar PDF
                </button>
            </div>
        </div>
    );
};

export default CertificateView;