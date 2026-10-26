import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit2, 
  Clock, 
  ChefHat, 
  Sparkles, 
  Utensils, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  BookOpen, 
  Flame,
  Check,
  Info
} from 'lucide-react';
import { ReadyMeal, ReadyMealCategory } from '../../types';
import { MOCK_FOODS, READY_MEAL_CATEGORIES } from '../../constants';
import { getStoredReadyMeals, saveStoredReadyMeals, deleteStoredReadyMeal } from '../../lib/readyMeals';
import ReadyMealModal from './ReadyMealModal';

export const ReadyMealsList: React.FC = () => {
  const [meals, setMeals] = useState<ReadyMeal[]>(() => getStoredReadyMeals());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<'calories-desc' | 'calories-asc' | 'protein-desc' | 'name-asc'>('name-asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<ReadyMeal | null>(null);
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<ReadyMeal | null>(null);

  // Sync with storage changes
  useEffect(() => {
    const handleStorageUpdate = (e: any) => {
      if (e.detail) {
        setMeals(e.detail);
      } else {
        setMeals(getStoredReadyMeals());
      }
    };
    window.addEventListener('ready_meals_updated', handleStorageUpdate);
    return () => window.removeEventListener('ready_meals_updated', handleStorageUpdate);
  }, []);

  // Filter & Sort
  const filteredMeals = useMemo(() => {
    let result = meals.filter(m => !m.isDeleted);

    if (activeCategory !== 'Todas') {
      result = result.filter(m => m.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => {
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        const matchesNotes = (m.notes || '').toLowerCase().includes(q);
        const matchesIngredient = m.foods.some(foodItem => {
          const food = MOCK_FOODS.find(f => f.id === foodItem.foodId);
          return food && food.name.toLowerCase().includes(q);
        });
        return matchesName || matchesDesc || matchesNotes || matchesIngredient;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'calories-desc') return b.calories - a.calories;
      if (sortBy === 'calories-asc') return a.calories - b.calories;
      if (sortBy === 'protein-desc') return b.protein - a.protein;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [meals, activeCategory, searchQuery, sortBy]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meal: ReadyMeal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleDuplicate = (meal: ReadyMeal) => {
    const duplicated: ReadyMeal = {
      ...meal,
      id: `rm_${Date.now()}`,
      name: `${meal.name} (Cópia)`,
      isDeleted: false
    };
    const updated = [duplicated, ...meals];
    setMeals(updated);
    saveStoredReadyMeals(updated);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem a certeza que deseja eliminar a refeição pronta "${name}"?`)) {
      const updated = deleteStoredReadyMeal(id);
      setMeals(updated);
    }
  };

  const handleSaveMeal = (meal: ReadyMeal) => {
    let updated: ReadyMeal[];
    if (editingMeal) {
      updated = meals.map(m => m.id === meal.id ? meal : m);
    } else {
      updated = [meal, ...meals];
    }
    setMeals(updated);
    saveStoredReadyMeals(updated);
  };

  const getCategoryColor = (_cat: string) => {
    return 'bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300 border-primary-200 dark:border-primary-800/80';
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Search */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 max-w-xl">
            <div className="relative group w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar por prato, ingrediente ou nota..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
              />
            </div>
            
            {/* Sort selector */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none text-slate-700 dark:text-slate-200"
            >
              <option value="name-asc">Nome (A - Z)</option>
              <option value="calories-desc">Mais Calóricas</option>
              <option value="calories-asc">Menos Calóricas</option>
              <option value="protein-desc">Mais Proteína</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button 
              onClick={handleOpenAdd}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              Criar Refeição Pronta
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveCategory('Todas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'Todas'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todas ({meals.filter(m => !m.isDeleted).length})
          </button>
          {READY_MEAL_CATEGORIES.map(cat => {
            const count = meals.filter(m => !m.isDeleted && m.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredMeals.length === 0 ? (
        <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            Nenhuma refeição pronta encontrada
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Não encontramos refeições com os filtros selecionados. Crie uma nova refeição pronta para reutilizar em qualquer plano nutricional!
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition-all"
          >
            <Plus size={16} /> Criar Primeira Refeição Pronta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <div 
              key={meal.id}
              className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 bg-white/70 dark:bg-slate-900/60"
            >
              {/* Image & Header */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {meal.image ? (
                  <img 
                    src={meal.image} 
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <Utensils size={40} className="text-slate-400" />
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md ${getCategoryColor(meal.category)}`}>
                    {meal.category}
                  </span>
                  
                  {meal.prepTimeMinutes && (
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/50 text-white backdrop-blur-md flex items-center gap-1 border border-white/10">
                      <Clock size={12} /> {meal.prepTimeMinutes} min
                    </span>
                  )}
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold line-clamp-1 group-hover:text-primary-400 transition-colors drop-shadow-sm">
                    {meal.name}
                  </h3>
                  <div className="text-xs text-white/80 flex items-center gap-2 mt-0.5">
                    <span className="font-extrabold text-primary-300 dark:text-primary-400 flex items-center gap-1 drop-shadow-xs">
                      <Flame size={12} className="text-primary-400" /> {meal.calories} kcal
                    </span>
                    <span>•</span>
                    <span>{meal.foods.length} alimentos</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                {/* Macros Ribbon */}
                <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Prot</div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-white">{meal.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">Hidr</div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-white">{meal.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Gord</div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-white">{meal.fat}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Fibra</div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-white">{meal.fiber || 0}g</div>
                  </div>
                </div>

                {/* Ingredients list preview */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Utensils size={12} /> Alimentos Incluídos:
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {meal.foods.map((foodItem, idx) => {
                      const food = MOCK_FOODS.find(f => f.id === foodItem.foodId);
                      return (
                        <div 
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                        >
                          <span className="truncate flex-1 font-medium">
                            {food?.name || 'Alimento'}
                          </span>
                          <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] ml-2 flex-shrink-0">
                            {foodItem.measure || `${foodItem.quantity}${food?.unit || 'g'}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes preview */}
                {meal.notes && (
                  <div className="p-2.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40 text-primary-950 dark:text-primary-100 text-xs">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-[10px] uppercase text-primary-600 dark:text-primary-400">
                      <BookOpen size={11} className="text-primary-500" /> Preparação:
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                      {meal.notes}
                    </p>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(meal)}
                      className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                      title="Duplicar refeição"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(meal.id, meal.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Eliminar refeição"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(meal)}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/40 dark:hover:text-primary-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 size={13} /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ReadyMealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeal}
        initialMeal={editingMeal}
      />
    </div>
  );
};

export default ReadyMealsList;
