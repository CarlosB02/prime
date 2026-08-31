import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle, FileText, Activity } from 'lucide-react';
import { Food, FoodCategory, FoodUnit } from '../../types';
import { FOOD_CATEGORIES, FOOD_UNITS } from '../../constants';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: Omit<Food, 'id' | 'isDeleted'>) => void;
  initialData?: Food | null;
}

const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<{
    name: string;
    image: string;
    category: FoodCategory;
    unit: FoodUnit;
    baseQuantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
    sugar: number;
    description: string;
  }>({
    name: '',
    image: '',
    category: 'Proteína',
    unit: 'g',
    baseQuantity: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
    sugar: 0,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        image: initialData.image,
        category: initialData.category,
        unit: initialData.unit,
        baseQuantity: initialData.baseQuantity,
        calories: initialData.calories,
        protein: initialData.protein,
        carbs: initialData.carbs,
        fat: initialData.fat,
        fiber: initialData.fiber || 0,
        sodium: initialData.sodium || 0,
        sugar: initialData.sugar || 0,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        image: '',
        category: 'Proteína',
        unit: 'g',
        baseQuantity: 100,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0,
        sugar: 0,
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200&h=200' // Default healthy food image
    });
    onClose();
  };

  const handleNumericChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }));
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
              {initialData ? 'Editar Alimento' : 'Novo Alimento'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Registe a informação nutricional detalhada.</p>
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
          <form id="food-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-12 gap-6">
              
              {/* Image & Basic Info */}
              <div className="col-span-12 md:col-span-4 space-y-4">
                {/* Image Upload */}
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Imagem</label>
                   <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group hover:border-primary-500 transition-colors relative">
                       {formData.image ? (
                         <img src={formData.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                       ) : (
                         <div className="text-center p-4">
                            <Upload size={24} className="mx-auto text-slate-400 group-hover:text-primary-500 transition-colors mb-2" />
                            <span className="text-xs text-slate-400">URL ou Upload</span>
                         </div>
                       )}
                   </div>
                   <input 
                      type="text" 
                      placeholder="URL da imagem..." 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="mt-2 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>
              </div>

              {/* Main Info */}
              <div className="col-span-12 md:col-span-8 space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Alimento</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Ex: Peito de Frango, Arroz Basmati..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as FoodCategory})}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      >
                        {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unidade de Medida</label>
                      <select 
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value as FoodUnit})}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      >
                        {FOOD_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantidade Base (para cálculo)</label>
                   <div className="relative">
                      <input 
                        type="number" 
                        value={formData.baseQuantity}
                        onChange={(e) => handleNumericChange('baseQuantity', e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">{formData.unit}</span>
                   </div>
                </div>
              </div>

              {/* Macros Section */}
              <div className="col-span-12">
                 <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Activity size={16} className="text-primary-500" />
                    Informação Nutricional <span className="text-xs font-normal text-slate-400">(por {formData.baseQuantity}{formData.unit})</span>
                 </h3>
                 
                 <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {/* Primary Macros */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 text-center">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Calorias</label>
                            <input 
                              type="number" 
                              value={formData.calories}
                              onChange={(e) => handleNumericChange('calories', e.target.value)}
                              className="w-full text-center bg-transparent text-xl font-bold text-slate-800 dark:text-white border-b border-slate-200 focus:border-primary-500 outline-none p-0"
                            />
                            <span className="text-[10px] text-slate-400">kcal</span>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-center">
                            <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">Proteína</label>
                            <input 
                              type="number" 
                              value={formData.protein}
                              onChange={(e) => handleNumericChange('protein', e.target.value)}
                              className="w-full text-center bg-transparent text-xl font-bold text-blue-700 dark:text-blue-300 border-b border-blue-200 focus:border-blue-500 outline-none p-0"
                            />
                            <span className="text-[10px] text-blue-400">gramas</span>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-center">
                            <label className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">Hidratos</label>
                            <input 
                              type="number" 
                              value={formData.carbs}
                              onChange={(e) => handleNumericChange('carbs', e.target.value)}
                              className="w-full text-center bg-transparent text-xl font-bold text-amber-700 dark:text-amber-300 border-b border-amber-200 focus:border-amber-500 outline-none p-0"
                            />
                            <span className="text-[10px] text-amber-400">gramas</span>
                        </div>
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 text-center">
                            <label className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">Gordura</label>
                            <input 
                              type="number" 
                              value={formData.fat}
                              onChange={(e) => handleNumericChange('fat', e.target.value)}
                              className="w-full text-center bg-transparent text-xl font-bold text-rose-700 dark:text-rose-300 border-b border-rose-200 focus:border-rose-500 outline-none p-0"
                            />
                            <span className="text-[10px] text-rose-400">gramas</span>
                        </div>
                    </div>

                    {/* Secondary Macros */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-center">
                           <label className="block text-xs text-slate-500 mb-1">Fibra (g)</label>
                           <input 
                              type="number" 
                              value={formData.fiber}
                              onChange={(e) => handleNumericChange('fiber', e.target.value)}
                              className="w-full text-center text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 focus:ring-1 focus:ring-slate-400 outline-none" 
                           />
                        </div>
                        <div className="text-center">
                           <label className="block text-xs text-slate-500 mb-1">Sódio (mg)</label>
                           <input 
                              type="number" 
                              value={formData.sodium}
                              onChange={(e) => handleNumericChange('sodium', e.target.value)}
                              className="w-full text-center text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 focus:ring-1 focus:ring-slate-400 outline-none" 
                           />
                        </div>
                        <div className="text-center">
                           <label className="block text-xs text-slate-500 mb-1">Açúcar (g)</label>
                           <input 
                              type="number" 
                              value={formData.sugar}
                              onChange={(e) => handleNumericChange('sugar', e.target.value)}
                              className="w-full text-center text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 focus:ring-1 focus:ring-slate-400 outline-none" 
                           />
                        </div>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <div className="col-span-12">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descrição / Notas</label>
                 <div className="relative">
                   <FileText size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                   <textarea 
                     rows={3}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                     placeholder="Detalhes adicionais sobre o alimento, marcas recomendadas, etc..."
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
            form="food-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar Alimento
          </button>
        </div>

      </div>
    </div>
  );
};

export default FoodModal;