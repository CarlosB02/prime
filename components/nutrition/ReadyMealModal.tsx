import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, Clock, Sparkles, ChefHat, Search, Utensils, AlertCircle } from 'lucide-react';
import { ReadyMeal, ReadyMealCategory, ReadyMealFoodItem } from '../../types';
import { MOCK_FOODS, READY_MEAL_CATEGORIES } from '../../constants';
import { calculateReadyMealNutrition } from '../../lib/readyMeals';

interface ReadyMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: ReadyMeal) => void;
  initialMeal?: ReadyMeal | null;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600&h=400',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600&h=400',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600&h=400',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600&h=400',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600&h=400'
];

export const ReadyMealModal: React.FC<ReadyMealModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMeal
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ReadyMealCategory>('Almoço / Jantar');
  const [description, setDescription] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(15);
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ReadyMealFoodItem[]>([]);

  // Search in food selector
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFoodIdToAdd, setSelectedFoodIdToAdd] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(100);

  useEffect(() => {
    if (initialMeal) {
      setName(initialMeal.name);
      setCategory(initialMeal.category);
      setDescription(initialMeal.description || '');
      setPrepTimeMinutes(initialMeal.prepTimeMinutes || 15);
      setImage(initialMeal.image || '');
      setNotes(initialMeal.notes || '');
      setItems(initialMeal.foods || []);
    } else {
      setName('');
      setCategory('Almoço / Jantar');
      setDescription('');
      setPrepTimeMinutes(15);
      setImage(DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)]);
      setNotes('');
      // Default initial 2 items for inspiration
      setItems([
        { foodId: '1', quantity: 150, measure: '150g' },
        { foodId: '2', quantity: 180, measure: '180g' }
      ]);
    }
  }, [initialMeal, isOpen]);

  // Filtered available foods for adding
  const filteredFoods = useMemo(() => {
    const q = foodSearch.trim().toLowerCase();
    return MOCK_FOODS.filter(f => !f.isDeleted && (
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    ));
  }, [foodSearch]);

  // Live calculated macros
  const calculatedMacros = useMemo(() => {
    return calculateReadyMealNutrition(items);
  }, [items]);

  const handleAddItem = (foodId: string, qty: number) => {
    const food = MOCK_FOODS.find(f => f.id === foodId);
    if (!food) return;

    const measure = food.unit === 'unidade' 
      ? `${qty} unid`
      : `${qty}${food.unit}`;

    // If item already exists, update quantity
    const existingIdx = items.findIndex(it => it.foodId === foodId);
    if (existingIdx >= 0) {
      const updated = [...items];
      updated[existingIdx].quantity += qty;
      updated[existingIdx].measure = food.unit === 'unidade' 
        ? `${updated[existingIdx].quantity} unid` 
        : `${updated[existingIdx].quantity}${food.unit}`;
      setItems(updated);
    } else {
      setItems([...items, { foodId, quantity: qty, measure }]);
    }
    setFoodSearch('');
    setSelectedFoodIdToAdd('');
  };

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    const item = items[index];
    const food = MOCK_FOODS.find(f => f.id === item.foodId);
    const updated = [...items];
    const q = Math.max(1, newQty);
    updated[index] = {
      ...item,
      quantity: q,
      measure: food?.unit === 'unidade' ? `${q} unid` : `${q}${food?.unit || 'g'}`
    };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor insira o nome da refeição pronta.');
      return;
    }
    if (items.length === 0) {
      alert('Por favor adicione pelo menos um alimento à refeição.');
      return;
    }

    const mealToSave: ReadyMeal = {
      id: initialMeal?.id || `rm_${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      prepTimeMinutes: Number(prepTimeMinutes) || 15,
      image: image || DEFAULT_IMAGES[0],
      notes: notes.trim(),
      foods: items,
      calories: calculatedMacros.calories,
      protein: calculatedMacros.protein,
      carbs: calculatedMacros.carbs,
      fat: calculatedMacros.fat,
      fiber: calculatedMacros.fiber,
      isDeleted: false
    };

    onSave(mealToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-8 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <ChefHat size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {initialMeal ? 'Editar Refeição Pronta' : 'Nova Refeição Pronta'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure os alimentos, macronutrientes e instruções de preparação
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nome da Refeição Pronta *
              </label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Frango Grelhado com Arroz Basmati e Brócolos"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Categoria
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ReadyMealCategory)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white"
              >
                {READY_MEAL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Tempo de Preparo (min)
              </label>
              <input 
                type="number"
                min="1"
                max="180"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(parseInt(e.target.value) || 15)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição Curta / Destaques
              </label>
              <input 
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Refeição anabólica limpa de fácil digestão"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Foods & Ingredients Section */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/40 dark:bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Utensils size={16} className="text-primary-600 dark:text-primary-400" />
                  Alimentos e Ingredientes da Refeição ({items.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Os valores nutricionais são calculados automaticamente com base na base de dados
                </p>
              </div>
            </div>

            {/* Live Macros Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-center p-2 rounded-lg bg-primary-50/50 dark:bg-primary-950/30">
                <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase">Calorias</div>
                <div className="text-lg font-black text-primary-700 dark:text-primary-300">{calculatedMacros.calories} <span className="text-xs font-normal">kcal</span></div>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/30">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">Proteína</div>
                <div className="text-lg font-black text-blue-700 dark:text-blue-300">{calculatedMacros.protein}g</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30">
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase">Hidratos</div>
                <div className="text-lg font-black text-amber-700 dark:text-amber-300">{calculatedMacros.carbs}g</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/30">
                <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase">Gorduras</div>
                <div className="text-lg font-black text-rose-700 dark:text-rose-300">{calculatedMacros.fat}g</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 col-span-2 sm:col-span-1">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Fibras</div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">{calculatedMacros.fiber}g</div>
              </div>
            </div>

            {/* Food items list */}
            {items.length === 0 ? (
              <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <AlertCircle size={24} className="mx-auto text-amber-500 mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Nenhum alimento selecionado para esta refeição</p>
                <p className="text-xs text-slate-400">Adicione alimentos usando o seletor abaixo</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((it, idx) => {
                  const food = MOCK_FOODS.find(f => f.id === it.foodId);
                  const baseQty = food?.baseQuantity || 100;
                  const mult = it.quantity / baseQty;
                  const itemKcal = Math.round((food?.calories || 0) * mult);
                  const itemProt = Math.round(((food?.protein || 0) * mult) * 10) / 10;
                  const itemCarb = Math.round(((food?.carbs || 0) * mult) * 10) / 10;
                  const itemFat = Math.round(((food?.fat || 0) * mult) * 10) / 10;

                  return (
                    <div 
                      key={`${it.foodId}-${idx}`}
                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {food?.image ? (
                          <img src={food.image} alt={food.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <Utensils size={16} className="text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {food?.name || 'Alimento'}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {itemKcal} kcal · P: {itemProt}g · HC: {itemCarb}g · G: {itemFat}g
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                          <input 
                            type="number"
                            min="1"
                            value={it.quantity}
                            onChange={(e) => handleUpdateItemQuantity(idx, parseFloat(e.target.value) || 0)}
                            className="w-14 text-right bg-transparent text-xs font-bold text-slate-800 dark:text-white outline-none"
                          />
                          <span className="text-xs text-slate-500 ml-1">{food?.unit || 'g'}</span>
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Remover alimento"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Food Input */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                + Adicionar Alimento da Base de Dados
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Pesquisar alimento na base de dados..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                  />
                  {foodSearch.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-30 divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredFoods.slice(0, 8).map(f => (
                        <div 
                          key={f.id}
                          onClick={() => handleAddItem(f.id, f.baseQuantity || 100)}
                          className="p-2.5 hover:bg-primary-50 dark:hover:bg-primary-950/40 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {f.image ? (
                              <img src={f.image} alt={f.name} className="w-7 h-7 rounded object-cover" />
                            ) : (
                              <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <Utensils size={12} className="text-slate-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-slate-800 dark:text-white">{f.name}</div>
                              <div className="text-[10px] text-slate-500">{f.calories} kcal / {f.baseQuantity}{f.unit}</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold px-2 py-0.5 rounded-full">
                            + Adicionar
                          </span>
                        </div>
                      ))}
                      {filteredFoods.length === 0 && (
                        <div className="p-3 text-center text-xs text-slate-400">Nenhum alimento encontrado com &quot;{foodSearch}&quot;</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick select dropdown */}
                <select 
                  value={selectedFoodIdToAdd}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id) {
                      const f = MOCK_FOODS.find(item => item.id === id);
                      handleAddItem(id, f?.baseQuantity || 100);
                    }
                  }}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none text-slate-700 dark:text-slate-200 sm:w-56"
                >
                  <option value="">Ou escolher da lista...</option>
                  {MOCK_FOODS.filter(f => !f.isDeleted).map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes and instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary-500" />
              Modo de Preparação / Instruções para o Atleta
            </label>
            <textarea 
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Grelhar o frango com ervas finas e cozer o arroz com um dente de alho. Servir regado com o azeite cru."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white resize-none"
            />
          </div>

          {/* Image URL with presets */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              URL da Imagem da Refeição
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white"
              />
              <button 
                type="button"
                onClick={() => setImage(DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)])}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap"
              >
                Trocar Foto
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ChefHat size={16} />
            {initialMeal ? 'Guardar Alterações' : 'Criar Refeição Pronta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadyMealModal;
