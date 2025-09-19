import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { KnowledgeBaseArticle } from '../types';
import { ChevronLeftIcon, BookOpenIcon, MagnifyingGlassIcon } from './IconComponents';
import MarkdownRenderer from './MarkdownRenderer';


const KnowledgeBaseView: React.FC = () => {
    const { articles, returnToDashboard } = useAppStore(state => ({
        articles: state.appState.knowledgeBase,
        returnToDashboard: state.returnToDashboard,
    }));
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);

    const filteredArticles = useMemo(() => {
        if (!searchTerm) return articles;
        return articles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [articles, searchTerm]);
    
    if (selectedArticle) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 text-slate-400 hover:text-telnet-yellow transition-colors font-semibold mb-6">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Volver a la Base de Conocimiento
                    </button>
                    <h1 className="text-4xl font-bold mb-2">{selectedArticle.title}</h1>
                    <p className="text-telnet-yellow font-semibold mb-6">{selectedArticle.category}</p>
                    <div className="prose prose-lg prose-invert max-w-none">
                       <MarkdownRenderer content={selectedArticle.content} courseContext="Knowledge Base" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <button onClick={returnToDashboard} className="flex items-center gap-2 text-slate-400 hover:text-telnet-yellow transition-colors font-semibold">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Volver al Panel
                    </button>
                </div>

                <header className="text-center mb-10">
                    <BookOpenIcon className="w-16 h-16 mx-auto text-telnet-yellow mb-4" />
                    <h1 className="text-5xl font-bold">Base de Conocimiento</h1>
                    <p className="text-lg text-slate-400 mt-2">Guías, procedimientos y mejores prácticas de TELNET CO.</p>
                </header>

                <div className="relative mb-8 max-w-2xl mx-auto">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-4 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Buscar un artículo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-telnet-yellow focus:border-telnet-yellow outline-none"
                    />
                </div>

                <div className="space-y-4">
                    {filteredArticles.map(article => (
                        <button key={article.id} onClick={() => setSelectedArticle(article)} className="w-full text-left bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-telnet-yellow transition-colors">
                            <h2 className="font-bold text-white text-lg">{article.title}</h2>
                            <p className="text-sm text-telnet-yellow font-semibold">{article.category}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBaseView;
