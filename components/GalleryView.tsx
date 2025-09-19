import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { GalleryItem } from '../types';
import { ChevronLeftIcon, PhotoIcon, TagIcon } from './IconComponents';

type Category = GalleryItem['category'] | 'Todos';
const categories: Category[] = ['Todos', 'Conectores', 'Tipos de Fibra', 'Herramientas'];

const GalleryView: React.FC = () => {
    const { items, returnToDashboard } = useAppStore(state => ({
        items: state.appState.galleryItems,
        returnToDashboard: state.returnToDashboard,
    }));
    const [activeCategory, setActiveCategory] = useState<Category>('Todos');

    const filteredItems = useMemo(() => {
        if (activeCategory === 'Todos') {
            return items;
        }
        return items.filter(item => item.category === activeCategory);
    }, [items, activeCategory]);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button onClick={returnToDashboard} className="flex items-center gap-2 text-slate-400 hover:text-telnet-yellow transition-colors font-semibold">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Volver al Panel
                    </button>
                </div>

                <header className="text-center mb-10">
                    <PhotoIcon className="w-16 h-16 mx-auto text-telnet-yellow mb-4" />
                    <h1 className="text-5xl font-bold">Galería Técnica</h1>
                    <p className="text-lg text-slate-400 mt-2">Una guía de referencia visual rápida para el trabajo de campo.</p>
                </header>

                <div className="flex justify-center flex-wrap gap-3 mb-8">
                    {categories.map(category => (
                        <button 
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                                activeCategory === category 
                                ? 'bg-telnet-yellow text-telnet-black border-telnet-yellow' 
                                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 group transition-all duration-300 hover:border-telnet-yellow hover:shadow-2xl hover:shadow-telnet-yellow/10 transform hover:-translate-y-1">
                                <div className="h-48">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h2 className="text-lg font-bold text-white">{item.title}</h2>
                                        <span className="inline-flex items-center gap-1.5 bg-slate-700 text-slate-300 text-xs font-semibold px-2 py-1 rounded-full shrink-0">
                                            <TagIcon className="w-3 h-3" />
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-slate-500">No se encontraron elementos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryView;
