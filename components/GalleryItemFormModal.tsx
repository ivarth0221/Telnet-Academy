import React, { useState, useEffect } from 'react';
import type { GalleryItem } from '../types';
import { XCircleIcon } from './IconComponents';

interface GalleryItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: GalleryItem | Omit<GalleryItem, 'id'>) => void;
  initialData?: GalleryItem | null;
}

const categories: GalleryItem['category'][] = ['Conectores', 'Tipos de Fibra', 'Herramientas'];

const GalleryItemFormModal: React.FC<GalleryItemFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Herramientas');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setImageUrl(initialData.imageUrl);
      setCategory(initialData.category);
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setCategory('Herramientas');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || !category) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const itemData = { title, description, imageUrl, category };

    if (initialData) {
      onSave({ ...itemData, id: initialData.id });
    } else {
      onSave(itemData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Editar Elemento' : 'Añadir Nuevo Elemento'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Título</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-slate-700 rounded-md border border-slate-600 focus:ring-1 focus:ring-telnet-yellow" required />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1">URL de la Imagen</label>
            <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 bg-slate-700 rounded-md border border-slate-600 focus:ring-1 focus:ring-telnet-yellow" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 bg-slate-700 rounded-md border border-slate-600 focus:ring-1 focus:ring-telnet-yellow" required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as GalleryItem['category'])} className="w-full p-2 bg-slate-700 rounded-md border border-slate-600 focus:ring-1 focus:ring-telnet-yellow" required>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="pt-2 text-right">
            <button type="submit" className="bg-telnet-yellow hover:bg-telnet-yellow-dark text-telnet-black font-bold py-2 px-6 rounded-lg">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryItemFormModal;