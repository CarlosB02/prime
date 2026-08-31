import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Link as LinkIcon, FileText, Tag, ShoppingBag } from 'lucide-react';
import { Supplement, SupplementCategory } from '../../types';
import { SUPPLEMENT_CATEGORIES } from '../../constants';

interface SupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplement: Omit<Supplement, 'id' | 'isDeleted'>) => void;
  initialData?: Supplement | null;
}

const SupplementModal: React.FC<SupplementModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<{
    name: string;
    brand: string;
    image: string;
    category: SupplementCategory;
    description: string;
    link: string;
  }>({
    name: '',
    brand: '',
    image: '',
    category: 'Proteína',
    description: '',
    link: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        brand: initialData.brand,
        image: initialData.image,
        category: initialData.category,
        description: initialData.description,
        link: initialData.link
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        image: '',
        category: 'Proteína',
        description: '',
        link: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=200&h=200' // Fallback image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Editar Suplemento' : 'Novo Suplemento'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Adicione produtos à sua lista de recomendações.</p>
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
          <form id="supplement-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Fotografia do Produto</label>
               <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden group hover:border-primary-500 transition-colors relative">
                     {formData.image ? (
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <Upload size={24} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                     )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="URL da imagem (ex: https://...)" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-2"
                    />
                    <p className="text-xs text-slate-500">Cole o link da imagem do produto. Recomendamos imagens com fundo transparente ou branco.</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Produto</label>
                <div className="relative">
                  <ShoppingBag size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Ex: Gold Standard Whey"
                  />
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marca</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input 
                    required
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Ex: Optimum Nutrition"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as SupplementCategory})}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  {SUPPLEMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link do Produto (URL)</label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input 
                    type="url" 
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono text-xs text-blue-600 dark:text-blue-400"
                    placeholder="https://..."
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-1">Este link será usado para consulta interna do produto.</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição Técnica / Benefícios</label>
                <div className="relative">
                   <FileText size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                   <textarea 
                     rows={5}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none leading-relaxed"
                     placeholder="Descreva os benefícios, modo de toma ou composição..."
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
            form="supplement-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar Suplemento
          </button>
        </div>

      </div>
    </div>
  );
};

export default SupplementModal;
