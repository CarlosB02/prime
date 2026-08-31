import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Link as LinkIcon, FileText, Layout, Video, BookOpen, File as FileIcon, Mic } from 'lucide-react';
import { ContentItem, ContentType, ContentCategory } from '../../types';
import { CONTENT_TYPES, CONTENT_CATEGORIES } from '../../constants';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: Omit<ContentItem, 'id' | 'isDeleted' | 'createdAt'>) => void;
  initialData?: ContentItem | null;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<{
    title: string;
    thumbnail: string;
    type: ContentType;
    category: ContentCategory;
    description: string;
    url: string;
  }>({
    title: '',
    thumbnail: '',
    type: 'video',
    category: 'Treino',
    description: '',
    url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        thumbnail: initialData.thumbnail,
        type: initialData.type,
        category: initialData.category,
        description: initialData.description,
        url: initialData.url
      });
    } else {
      setFormData({
        title: '',
        thumbnail: '',
        type: 'video',
        category: 'Treino',
        description: '',
        url: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600&h=400' // Fallback image
    });
    onClose();
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'article': return <BookOpen size={16} />;
      case 'pdf': return <FileIcon size={16} />;
      case 'audio': return <Mic size={16} />;
      default: return <LinkIcon size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Editar Conteúdo' : 'Novo Conteúdo'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Adicione vídeos, guias ou artigos à sua biblioteca.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          <form id="content-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Thumbnail Section */}
              <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Thumbnail / Capa</label>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-48 aspect-video rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden group hover:border-primary-500 transition-colors relative">
                       {formData.thumbnail ? (
                         <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex flex-col items-center justify-center text-slate-400">
                           <Upload size={24} className="mb-2 group-hover:text-primary-500 transition-colors" />
                           <span className="text-xs">Preview</span>
                         </div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <label className="text-xs text-slate-500 mb-1.5 ml-1">URL da Imagem</label>
                      <input 
                        type="text" 
                        placeholder="https://..." 
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-2"
                      />
                      <p className="text-xs text-slate-400">Recomendado: 16:9 ratio. Deixe vazio para usar imagem padrão.</p>
                    </div>
                 </div>
              </div>

              {/* Title */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título do Conteúdo</label>
                <div className="relative">
                  <Layout size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                    placeholder="Ex: Guia Completo de Hipertrofia"
                  />
                </div>
              </div>

              {/* Type & Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Conteúdo</label>
                <div className="grid grid-cols-2 gap-2">
                   {CONTENT_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, type})}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                            formData.type === type 
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                         {getTypeIcon(type)}
                         <span className="capitalize">{type}</span>
                      </button>
                   ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as ContentCategory})}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  {CONTENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* URL */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link do Recurso (URL)</label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input 
                    required
                    type="url" 
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono text-xs text-blue-600 dark:text-blue-400"
                    placeholder={formData.type === 'video' ? "https://youtube.com/..." : "https://..."}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                <div className="relative">
                   <FileText size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                   <textarea 
                     rows={4}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none leading-relaxed"
                     placeholder="Breve resumo do conteúdo..."
                   />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 z-10">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            form="content-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContentModal;
