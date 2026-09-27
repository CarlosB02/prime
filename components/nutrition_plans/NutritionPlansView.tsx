import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowDownUp,
  LayoutGrid,
  List
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { CustomAppleIcon, CustomClockIcon } from '../icons';
import NutritionPlanBuilder from './NutritionPlanBuilder';

interface NutritionPlan {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  dayTypes: any[];
}

const MOCK_PLANS: NutritionPlan[] = [
  { id: '1', name: 'Plano Hipertrofia', startDate: '2026-03-01', endDate: '2026-05-01', notes: 'Foco no ganho de massa magra.', createdAt: '2026-03-20T10:00:00Z', dayTypes: [] },
  { id: '2', name: 'Plano Emagrecimento', startDate: '2026-01-01', endDate: '2026-03-01', notes: 'Défice calórico acentuado.', createdAt: '2025-12-28T10:00:00Z', dayTypes: [] },
  { id: '3', name: 'Manutenção Contínua', startDate: '2026-03-15', notes: 'Manter peso estabilizado.', createdAt: '2026-03-10T10:00:00Z', dayTypes: [] },
];

const NutritionPlansView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [plans, setPlans] = useState<NutritionPlan[]>(MOCK_PLANS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPlan, setEditingPlan] = useState<NutritionPlan | null>(null);

  const handleSavePlan = (newPlan: any) => {
    // Basic mock save
    const savedPlan: NutritionPlan = {
      id: editingPlan ? editingPlan.id : Math.random().toString(),
      name: newPlan.name || 'Novo Plano de Nutrição',
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      notes: newPlan.notes,
      dayTypes: newPlan.dayTypes || [],
      createdAt: editingPlan ? editingPlan.createdAt : new Date().toISOString()
    };
    
    if (editingPlan) {
      setPlans(plans.map(p => p.id === savedPlan.id ? savedPlan : p));
    } else {
      setPlans([savedPlan, ...plans]);
    }
    setShowBuilder(false);
  };

  const handleEdit = (plan: NutritionPlan) => {
    setEditingPlan(plan);
    setShowBuilder(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar este plano?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setShowBuilder(true);
  };

  if (showBuilder) {
    return (
      <NutritionPlanBuilder 
         planData={editingPlan} 
         onSave={handleSavePlan} 
         onCancel={() => setShowBuilder(false)} 
       />
    );
  }

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortFn = (a: NutritionPlan, b: NutritionPlan) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  };

  const now = new Date();
  
  // Categorize plans
  const inProgressPlans = filteredPlans
    .filter(plan => !plan.endDate || new Date(plan.endDate) >= now)
    .sort(sortFn);
    
  const completedPlans = filteredPlans
    .filter(plan => plan.endDate && new Date(plan.endDate) < now)
    .sort(sortFn);

  const renderPlanCard = (plan: NutritionPlan) => {
    return (
      <div key={plan.id} onClick={(e) => { e.stopPropagation(); handleEdit(plan); }} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full cursor-pointer">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <CustomAppleIcon size={24} />
          </div>
          
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); handleEdit(plan); }} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
              <Edit2 size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Card Title & Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">{plan.name}</h3>
          
          {plan.notes && (
             <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {plan.notes}
             </p>
          )}

          <div className="flex flex-col gap-2 mt-4">
            {(plan.startDate || plan.endDate) && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CustomCalendarIcon size={14} />
                <span>
                  {plan.startDate ? new Date(plan.startDate).toLocaleDateString('pt-PT') : 'N/A'} - 
                  {plan.endDate ? new Date(plan.endDate).toLocaleDateString('pt-PT') : 'Atual'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CustomClockIcon size={14} />
              <span>Criado a {new Date(plan.createdAt).toLocaleDateString('pt-PT')}</span>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderCompactPlanRow = (plan: NutritionPlan) => {
    return (
      <div key={plan.id} onClick={() => handleEdit(plan)} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
            <CustomAppleIcon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">{plan.name}</h3>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                Concluído
              </span>
              {plan.startDate && plan.endDate && (
                <span className="flex items-center gap-1">
                  <CustomCalendarIcon size={12} />
                  {new Date(plan.startDate).toLocaleDateString('pt-PT')} - {new Date(plan.endDate).toLocaleDateString('pt-PT')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(plan); }} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[280px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar planos de nutrição..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={18} className="mr-2" />
            Criar Plano
          </button>
        </div>
      </div>

      {/* Filters & View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'in_progress', label: 'Em Progresso' },
            { id: 'completed', label: 'Concluídos' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeFilter === filter.id
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Vista em Grelha"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Vista em Linha"
            >
              <List size={18} />
            </button>
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="appearance-none pl-10 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              <option value="newest">Mais recente</option>
              <option value="oldest">Mais antigo</option>
            </select>
            <ArrowDownUp size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredPlans.length === 0 ? (
        <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
             <CustomAppleIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem planos de nutrição</h3>
          <p className="text-slate-500 max-w-xs mt-2 text-sm">Crie o seu primeiro plano de nutrição para organizar as refeições.</p>
          <button 
            onClick={handleAdd}
            className="mt-6 px-6 py-2.5 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
          >
            Criar Plano Agora
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            const displayedPlans = filteredPlans.filter(plan => {
              if (activeFilter === 'all') return true;
              const isCompleted = plan.endDate && new Date(plan.endDate) < now;
              return activeFilter === 'completed' ? isCompleted : !isCompleted;
            }).sort(sortFn);

            if (displayedPlans.length === 0) {
              return (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Nenhum plano encontrado para este filtro.
                </div>
              );
            }

            return viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedPlans.map(plan => renderPlanCard(plan))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {displayedPlans.map(plan => renderCompactPlanRow(plan))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default NutritionPlansView;
