import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Utensils,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Food, FoodCategory } from '../../types';
import { MOCK_FOODS, FOOD_CATEGORIES, FOOD_UNITS } from '../../constants';
import FoodModal from './FoodModal';

const FoodView: React.FC = () => {
  // State
  const [foods, setFoods] = useState<Food[]>(MOCK_FOODS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Filter States
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  const [filterUnit, setFilterUnit] = useState<string>('Todos');
  const [minProtein, setMinProtein] = useState<string>('');
  
  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Food, direction: 'asc' | 'desc' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Handlers
  const handleAdd = () => {
    setEditingFood(null);
    setIsModalOpen(true);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const handleSave = (foodData: Omit<Food, 'id' | 'isDeleted'>) => {
    if (editingFood) {
      // Update existing
      setFoods(prev => prev.map(item => 
        item.id === editingFood.id ? { ...item, ...foodData } : item
      ));
    } else {
      // Create new
      const newFood: Food = {
        ...foodData,
        id: Math.random().toString(36).substr(2, 9),
        isDeleted: false
      };
      setFoods(prev => [newFood, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setFoods(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDeleted: !item.isDeleted };
      }
      return item;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este alimento?')) {
      setFoods(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSort = (key: keyof Food) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter & Sort Logic
  const filteredFoods = useMemo(() => {
    let result = foods.filter(item => {
        if (!showDeleted && item.isDeleted) return false;
        if (showDeleted && !item.isDeleted) return false;
        
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || item.category === filterCategory;
        const matchesUnit = filterUnit === 'Todos' || item.unit === filterUnit;
        const matchesProtein = minProtein === '' || item.protein >= parseFloat(minProtein);
        
        return matchesSearch && matchesCategory && matchesUnit && matchesProtein;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        // @ts-ignore - dynamic sorting
        const valA = a[sortConfig.key];
        // @ts-ignore
        const valB = b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [foods, searchQuery, showDeleted, filterCategory, filterUnit, minProtein, sortConfig]);

  // Visual Helper: Get Category Color
  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case 'Proteína': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
          case 'Hidratos': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
          case 'Gordura': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
          case 'Vegetais': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
          case 'Fruta': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800';
          default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 sticky top-0 z-20">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left: Search & Toggles */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative group min-w-[280px]">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                    type="text" 
                    placeholder="Pesquisar alimentos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                    />
                </div>
                
                <button 
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${showAdvancedFilters
                        ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400' 
                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <Filter size={16} className="mr-2" />
                    Filtros {showAdvancedFilters ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>}
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-3 w-full md:w-auto justify-end">
                <button 
                    onClick={() => setShowDeleted(!showDeleted)}
                    className={`flex items-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${showDeleted 
                        ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' 
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'}`}
                >
                    <Trash2 size={16} />
                </button>
                
                <button 
                    onClick={handleAdd}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                    <Plus size={18} className="mr-2" />
                    Adicionar Alimento
                </button>
            </div>
         </div>

         {/* Advanced Filters Panel */}
         {showAdvancedFilters && (
             <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-down">
                <div>
                   <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Categoria</label>
                   <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary-500"
                    >
                      <option value="Todos">Todas</option>
                      {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Unidade</label>
                   <select 
                      value={filterUnit}
                      onChange={(e) => setFilterUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary-500"
                    >
                      <option value="Todos">Todas</option>
                      {FOOD_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                   </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Mínimo Proteína (g)</label>
                    <input 
                       type="number"
                       placeholder="Ex: 20"
                       value={minProtein}
                       onChange={(e) => setMinProtein(e.target.value)}
                       className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary-500"
                    />
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={() => {
                            setFilterCategory('Todos');
                            setFilterUnit('Todos');
                            setMinProtein('');
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium hover:underline py-2"
                    >
                        Limpar Filtros
                    </button>
                </div>
             </div>
         )}
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 hidden md:block text-center cursor-pointer hover:text-primary-500" onClick={() => handleSort('id')}>ID</div>
          <div className="col-span-5 sm:col-span-4 md:col-span-3 cursor-pointer hover:text-primary-500" onClick={() => handleSort('name')}>Alimento</div>
          <div className="col-span-2 hidden sm:block cursor-pointer hover:text-primary-500" onClick={() => handleSort('category')}>Categoria</div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center cursor-pointer hover:text-primary-500" onClick={() => handleSort('unit')}>Tipo</div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center cursor-pointer hover:text-primary-500" onClick={() => handleSort('baseQuantity')}>Valor</div>
          <div className="col-span-2 hidden md:block text-center">Macros</div>
          <div className="col-span-3 sm:col-span-2 md:col-span-2 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredFoods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Utensils size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem alimentos encontrados</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Tente ajustar os filtros ou adicione um novo alimento à sua base de dados.</p>
              <button onClick={handleAdd} className="mt-6 text-primary-600 font-medium hover:underline text-sm">Adicionar Alimento</button>
            </div>
          ) : (
            filteredFoods.map((food) => (
              <div 
                key={food.id} 
                onClick={() => !food.isDeleted && handleEdit(food)}
                className={`group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  ${food.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}`}
              >
                {/* ID */}
                <div className="col-span-1 hidden md:block text-center">
                  <span className="text-xs font-mono text-slate-400">#{food.id}</span>
                </div>

                {/* Name & Image */}
                <div className="col-span-5 sm:col-span-4 md:col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm shrink-0">
                        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate" title={food.name}>
                            {food.name}
                        </h3>
                        <div className="block sm:hidden mt-1">
                             <span className={`px-1.5 py-0.5 rounded text-[9px] border ${getCategoryColor(food.category)}`}>
                                {food.category}
                             </span>
                        </div>
                    </div>
                </div>

                {/* Category */}
                <div className="col-span-2 hidden sm:block">
                     <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(food.category)}`}>
                        {food.category}
                     </span>
                </div>

                {/* Tipo */}
                <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center">
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{food.unit}</span>
                </div>

                {/* Valor */}
                <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{food.baseQuantity}</span>
                </div>

                {/* Macros */}
                <div className="col-span-2 hidden md:block">
                    <div className="flex justify-center gap-3 text-xs">
                        <div className="flex flex-col items-center" title={`Proteína: ${food.protein}g`}>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{food.protein}g</span>
                            <span className="text-[9px] text-slate-400 uppercase font-medium">P</span>
                        </div>
                        <div className="flex flex-col items-center" title={`Hidratos: ${food.carbs}g`}>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">{food.carbs}g</span>
                            <span className="text-[9px] text-slate-400 uppercase font-medium">H</span>
                        </div>
                        <div className="flex flex-col items-center" title={`Gordura: ${food.fat}g`}>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">{food.fat}g</span>
                            <span className="text-[9px] text-slate-400 uppercase font-medium">G</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-3 sm:col-span-2 md:col-span-2 flex justify-end items-center gap-2">
                   {food.isDeleted ? (
                     <>
                        <button 
                          onClick={() => toggleDelete(food.id)}
                          title="Restaurar"
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeletePermanent(food.id)}
                          title="Eliminar Permanentemente"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </>
                   ) : (
                     <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(food); }}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => toggleDelete(food.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A mostrar {filteredFoods.length} resultados
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 transition-colors">1</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Seguinte</button>
          </div>
        </div>
      </div>

      <FoodModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingFood}
      />
    </div>
  );
};

export default FoodView;
