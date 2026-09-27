import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  CreditCard,
  RefreshCw,
  Clock,
  DollarSign,
  Check,
  X,
  Lock,
  PlayCircle
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { PaymentPlan } from '../../types';
import { MOCK_PLANS } from '../../constants';
import PlanModal from './PlanModal';

const PlansView: React.FC = () => {
  // State
  const [plans, setPlans] = useState<PaymentPlan[]>(MOCK_PLANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [sortKey, setSortKey] = useState<'price' | 'duration' | 'status'>('duration');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  // Handlers
  const handleAdd = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<PaymentPlan, 'id' | 'isDeleted'>) => {
    if (selectedPlan && isModalOpen) {
      // Update existing
      setPlans(prev => prev.map(item => 
        item.id === selectedPlan.id ? { ...item, ...data } : item
      ));
    } else {
      // Create new
      const newPlan: PaymentPlan = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        isDeleted: false
      };
      setPlans(prev => [newPlan, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setPlans(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDeleted: !item.isDeleted };
      }
      return item;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este plano?')) {
      setPlans(prev => prev.filter(item => item.id !== id));
    }
  };

  // Filter & Sort Logic
  const filteredPlans = useMemo(() => {
    return plans.filter(item => {
        if (!showDeleted && item.isDeleted) return false;
        if (showDeleted && !item.isDeleted) return false;
        
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
    }).sort((a, b) => {
        if (sortKey === 'price') return a.price - b.price;
        if (sortKey === 'duration') return a.durationMonths - b.durationMonths;
        if (sortKey === 'status') return (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1;
        return 0;
    });
  }, [plans, searchQuery, showDeleted, sortKey]);

  // Helpers
  const getDurationLabel = (months: number) => {
      if (months === 1) return 'Mensal';
      if (months === 3) return 'Trimestral';
      if (months === 6) return 'Semestral';
      if (months === 12) return 'Anual';
      return`${months} Meses`;
  };

  const getDurationColor = (months: number) => {
      if (months === 1) return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      if (months === 3) return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      if (months === 6) return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      if (months === 12) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[240px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar planos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
          
          <div className="relative group">
              <select 
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="pl-3 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none text-slate-600 dark:text-slate-300 min-w-[160px]"
              >
                <option value="duration">Ordenar por Duração</option>
                <option value="price">Ordenar por Preço</option>
                <option value="status">Ordenar por Estado</option>
              </select>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setShowDeleted(!showDeleted)}
            className={`flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
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
            Adicionar
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider items-center">
          <div className="col-span-1 hidden md:block text-center">ID</div>
          <div className="col-span-3 sm:col-span-3">Nome</div>
          <div className="col-span-2 hidden sm:block">Tipo</div>
          <div className="col-span-2 sm:col-span-2">Preço</div>
          <div className="col-span-2 hidden lg:flex justify-center gap-3">
             <span title="Subscrição"><RefreshCw size={14}/></span>
             <span title="Pagamento Único"><DollarSign size={14}/></span>
             <span title="Faseado"><CustomCalendarIcon size={14}/></span>
             <span title="Temporário"><Clock size={14}/></span>
             <span title="Conteúdo"><PlayCircle size={14}/></span>
          </div>
          <div className="col-span-1 hidden xl:block text-center">Estado</div>
          <div className="col-span-4 sm:col-span-4 lg:col-span-2 xl:col-span-1 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <CreditCard size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem planos configurados</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Crie planos de pagamento para começar a monetizar o seu serviço.</p>
              <button onClick={handleAdd} className="mt-6 text-primary-600 font-medium hover:underline text-sm">Criar novo plano</button>
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <div 
                key={plan.id} 
                onClick={() => !plan.isDeleted && handleEdit(plan)}
                className={`group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  ${plan.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}`}
              >
                {/* ID */}
                <div className="col-span-1 hidden md:block text-center">
                  <span className="text-xs font-mono text-slate-400">#{plan.id}</span>
                </div>

                {/* Name */}
                <div className="col-span-3 sm:col-span-3">
                   <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate" title={plan.name}>
                      {plan.name}
                   </h3>
                   {/* Mobile Badge for Status */}
                   <div className="xl:hidden mt-1">
                       <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                           {plan.isActive ? 'Ativo' : 'Inativo'}
                       </span>
                   </div>
                </div>

                {/* Type/Duration */}
                <div className="col-span-2 hidden sm:block">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border border-transparent ${getDurationColor(plan.durationMonths)}`}>
                        {getDurationLabel(plan.durationMonths)}
                    </span>
                </div>

                {/* Price */}
                <div className="col-span-2 sm:col-span-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                        €{plan.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 block">
                        / {plan.durationMonths === 1 ? 'mês' : 'total'}
                    </span>
                </div>

                {/* Features (Booleans) */}
                <div className="col-span-2 hidden lg:flex justify-center gap-3">
                    <div className="group/icon relative">
                        {plan.isSubscription ? <Check size={16} className="text-emerald-500"/> : <X size={16} className="text-slate-300 dark:text-slate-700"/>}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Subscrição</span>
                    </div>
                    <div className="group/icon relative">
                        {plan.allowOneTimePayment ? <Check size={16} className="text-emerald-500"/> : <X size={16} className="text-slate-300 dark:text-slate-700"/>}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Pagamento Único</span>
                    </div>
                    <div className="group/icon relative">
                        {plan.allowInstallments ? <Check size={16} className="text-emerald-500"/> : <X size={16} className="text-slate-300 dark:text-slate-700"/>}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Faseado</span>
                    </div>
                    <div className="group/icon relative">
                        {plan.isTemporary ? <Check size={16} className="text-amber-500"/> : <X size={16} className="text-slate-300 dark:text-slate-700"/>}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Temporário</span>
                    </div>
                    <div className="group/icon relative">
                        {plan.hasContentAccess ? <Check size={16} className="text-indigo-500"/> : <X size={16} className="text-slate-300 dark:text-slate-700"/>}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Conteúdo</span>
                    </div>
                </div>

                {/* Status (Desktop) */}
                <div className="col-span-1 hidden xl:flex justify-center">
                   <span className={`flex w-3 h-3 rounded-full ${plan.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`} title={plan.isActive ? 'Ativo' : 'Inativo'} />
                </div>

                {/* Actions */}
                <div className="col-span-4 sm:col-span-4 lg:col-span-2 xl:col-span-1 flex justify-end items-center gap-2">
                    {plan.isDeleted ? (
                        <>
                            <button 
                            onClick={(e) => { e.stopPropagation(); toggleDelete(plan.id); }}
                            title="Restaurar"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                            <RotateCcw size={16} />
                            </button>
                            <button 
                            onClick={(e) => { e.stopPropagation(); handleDeletePermanent(plan.id); }}
                            title="Eliminar Permanentemente"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                            <Trash2 size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            >
                            <Edit2 size={16} />
                            </button>
                            <button 
                            onClick={() => toggleDelete(plan.id)}
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
            A mostrar {filteredPlans.length} resultados
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 transition-colors">1</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Seguinte</button>
          </div>
        </div>
      </div>

      <PlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedPlan}
      />
    </div>
  );
};

export default PlansView;
