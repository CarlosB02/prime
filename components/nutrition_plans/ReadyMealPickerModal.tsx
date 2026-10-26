import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  ChefHat, 
  Clock, 
  Flame, 
  Utensils, 
  BookOpen, 
  Plus, 
  Check, 
  ArrowRight,
  Filter,
  Sparkles,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { ReadyMeal, ReadyMealCategory } from '../../types';
import { MOCK_FOODS, READY_MEAL_CATEGORIES } from '../../constants';
import { getStoredReadyMeals } from '../../lib/readyMeals';

interface ReadyMealPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMeal: (meal: ReadyMeal, mode: 'append' | 'replace', importNotes: boolean) => void;
  mealName?: string;
  optionName?: string;
}

export const ReadyMealPickerModal: React.FC<ReadyMealPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMeal,
  mealName,
  optionName
}) => {
  const [meals, setMeals] = useState<ReadyMeal[]>(() => getStoredReadyMeals());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedMeal, setSelectedMeal] = useState<ReadyMeal | null>(null);
  const [addMode, setAddMode] = useState<'append' | 'replace'>('append');
  const [importNotes, setImportNotes] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Sync when opened or when storage updates
  useEffect(() => {
    if (isOpen) {
      setMeals(getStoredReadyMeals());
      setSelectedMeal(null);
      setSearchQuery('');
      setSelectedCategory('Todas');
    }
  }, [isOpen]);

  const filteredMeals = useMemo(() => {
    let result = meals.filter(m => !m.isDeleted);

    if (selectedCategory !== 'Todas') {
      result = result.filter(m => m.category === selectedCategory);
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

    return result;
  }, [meals, selectedCategory, searchQuery]);

  const handleConfirmAdd = (mealToAdd: ReadyMeal) => {
    onSelectMeal(mealToAdd, addMode, importNotes);
    onClose();
  };

  const getCategoryColor = (_cat: string) => {
    return 'bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300 border-primary-200 dark:border-primary-800/80';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-6 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
              <ChefHat size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">
                Base de Dados de Refeições Prontas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mealName && optionName ? (
                  <span>A importar para: <strong className="text-slate-700 dark:text-slate-300">{mealName}</strong> • <span className="text-primary-600 dark:text-primary-400 font-semibold">{optionName}</span></span>
                ) : (
                  'Escolha uma refeição completa com todos os alimentos e quantidades predefinidos'
                )}
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar refeição pronta por nome, ingredientes ou modo de preparo..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white transition-all font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
              <button
                onClick={() => setSelectedCategory('Todas')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'Todas'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Todas
              </button>
              {READY_MEAL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Toggle Linha vs Quadrados */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Visualização em Linha"
              >
                <LayoutList size={14} />
                <span>Linha</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Visualização em Quadrados"
              >
                <LayoutGrid size={14} />
                <span>Quadrados</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: List or Grid of Meals */}
        <div className="flex-1 overflow-y-auto p-5 max-h-[58vh]">
          {filteredMeals.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ChefHat size={30} />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-base mb-1">
                Nenhuma refeição encontrada
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tente pesquisar com outro termo ou selecione uma categoria diferente.
              </p>
            </div>
          ) : viewMode === 'list' ? (
            /* ================= VIEW MODE: LINHA (LIST) ================= */
            <div className="space-y-2">
              {filteredMeals.map((meal) => {
                const isSelected = selectedMeal?.id === meal.id;

                return (
                  <div 
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal)}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/25 ring-2 ring-primary-500/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/90'
                    }`}
                  >
                    {/* Left: Thumb + Name + Category + Ingredients in line */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {meal.image ? (
                        <img 
                          src={meal.image} 
                          alt={meal.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-400">
                          <Utensils size={18} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {meal.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryColor(meal.category)}`}>
                            {meal.category}
                          </span>
                          {meal.prepTimeMinutes && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5 font-medium">
                              <Clock size={11} /> {meal.prepTimeMinutes}m
                            </span>
                          )}
                        </div>

                        {/* Ingredients inline row */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Ingredientes:</span>
                          <span className="truncate">
                            {meal.foods.map(item => {
                              const food = MOCK_FOODS.find(x => x.id === item.foodId);
                              return `${item.measure || `${item.quantity}g`} ${food?.name || ''}`;
                            }).join(' • ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Calories + Macros pills + Add Button */}
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      {/* Calories badge */}
                      <div className="px-2.5 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/60 font-black text-primary-700 dark:text-primary-300 flex items-center gap-1 text-xs shrink-0">
                        <Flame size={12} className="text-primary-500" />
                        <span>{meal.calories}</span>
                        <span className="text-[10px] font-medium opacity-80">kcal</span>
                      </div>

                      {/* Macros pills */}
                      <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="text-blue-600 dark:text-blue-400">P:</span> {meal.protein}g
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="text-amber-600 dark:text-amber-400">HC:</span> {meal.carbs}g
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="text-rose-600 dark:text-rose-400">G:</span> {meal.fat}g
                        </span>
                      </div>

                      {/* Quick Add Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmAdd(meal);
                        }}
                        className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus size={14} /> Adicionar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ================= VIEW MODE: QUADRADOS (GRID) ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals.map((meal) => {
                const isSelected = selectedMeal?.id === meal.id;

                return (
                  <div 
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/20 ring-2 ring-primary-500/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                    }`}
                  >
                    {/* Top Row: Thumb + Title + Category */}
                    <div className="flex items-start gap-3">
                      {meal.image ? (
                        <img 
                          src={meal.image} 
                          alt={meal.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-400">
                          <Utensils size={24} />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryColor(meal.category)}`}>
                            {meal.category}
                          </span>
                          {meal.prepTimeMinutes && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                              <Clock size={11} /> {meal.prepTimeMinutes}m
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">
                          {meal.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-extrabold text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
                            <Flame size={12} className="text-primary-500" /> {meal.calories} kcal
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Macros Ribbon */}
                    <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase">Kcal</div>
                        <div className="text-xs font-black text-slate-800 dark:text-white">{meal.calories}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase">Prot</div>
                        <div className="text-xs font-black text-slate-800 dark:text-white">{meal.protein}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase">Hidr</div>
                        <div className="text-xs font-black text-slate-800 dark:text-white">{meal.carbs}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase">Gord</div>
                        <div className="text-xs font-black text-slate-800 dark:text-white">{meal.fat}g</div>
                      </div>
                    </div>

                    {/* Ingredients summary */}
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                        <Utensils size={10} /> {meal.foods.length} Ingredientes:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meal.foods.map((foodItem, idx) => {
                          const food = MOCK_FOODS.find(f => f.id === foodItem.foodId);
                          return (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
                            >
                              <span>{food?.name || 'Alimento'}</span>
                              <span className="font-bold text-slate-500 text-[10px]">({foodItem.measure || `${foodItem.quantity}g`})</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {isSelected ? '✓ Selecionado para adicionar' : 'Clique para selecionar'}
                      </span>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmAdd(meal);
                        }}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} /> Adicionar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Meal Options & Bottom Confirmation Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 dark:text-slate-400">Modo de adição:</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input 
                  type="radio" 
                  name="addMode" 
                  checked={addMode === 'append'} 
                  onChange={() => setAddMode('append')}
                  className="text-primary-600 focus:ring-primary-500" 
                />
                Acrescentar aos alimentos
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input 
                  type="radio" 
                  name="addMode" 
                  checked={addMode === 'replace'} 
                  onChange={() => setAddMode('replace')}
                  className="text-primary-600 focus:ring-primary-500" 
                />
                Substituir alimentos da opção
              </label>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input 
                type="checkbox" 
                checked={importNotes} 
                onChange={(e) => setImportNotes(e.target.checked)}
                className="text-primary-600 rounded focus:ring-primary-500" 
              />
              Importar modo de preparação para as notas
            </label>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={!selectedMeal}
              onClick={() => selectedMeal && handleConfirmAdd(selectedMeal)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                selectedMeal
                  ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/25 cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              }`}
            >
              <Check size={16} /> Confirmar Refeição Pronta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyMealPickerModal;
