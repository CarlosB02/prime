import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Tag,
  Percent,
  DollarSign,
  Package,
  CheckCircle2,
  Repeat,
  Copy,
  Check
} from 'lucide-react';
import { PromoCode, PromoType } from '../../types';
import { MOCK_PROMOS } from '../../constants';
import PromoModal from './PromoModal';
import LinkedPlansModal from './LinkedPlansModal';

const PromosView: React.FC = () => {
  // State
  const [promos, setPromos] = useState<PromoCode[]>(MOCK_PROMOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [sortKey, setSortKey] = useState<'date' | 'usage' | 'validity'>('date');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [viewingPlansId, setViewingPlansId] = useState<string[] | null>(null);

  // Handlers
  const handleAdd = () => {
    setSelectedPromo(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };

  const handleSave = (data: Omit<PromoCode, 'id' | 'isDeleted' | 'createdAt' | 'usageCount'>) => {
    if (selectedPromo && isEditModalOpen) {
      setPromos(prev => prev.map(item => 
        item.id === selectedPromo.id ? { ...item, ...data } : item
      ));
    } else {
      const newPromo: PromoCode = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        isDeleted: false
      };
      setPromos(prev => [newPromo, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setPromos(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDeleted: !item.isDeleted };
      }
      return item;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este código?')) {
      setPromos(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Logic
  const filteredPromos = useMemo(() => {
    return promos.filter(item => {
        if (!showDeleted && item.isDeleted) return false;
        if (showDeleted && !item.isDeleted) return false;
        
        return item.code.toLowerCase().includes(searchQuery.toLowerCase());
    }).sort((a, b) => {
        if (sortKey === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortKey === 'usage') return b.usageCount - a.usageCount;
        if (sortKey === 'validity') return new Date(a.validUntil || '2099-12-31').getTime() - new Date(b.validUntil || '2099-12-31').getTime();
        return 0;
    });
  }, [promos, searchQuery, showDeleted, sortKey]);

  const isExpired = (validUntil: string) => {
      if (!validUntil) return false;
      return new Date(validUntil) < new Date();
  };

  const isFullyUsed = (current: number, max: number) => current >= max;

  const getTypeIcon = (type: PromoType) => {
      switch(type) {
          case 'percent': return <Percent size={14} />;
          case 'fixed_amount': return <DollarSign size={14} />;
          case 'fixed_price': return <Tag size={14} />;
      }
  };

  const getTypeLabel = (type: PromoType) => {
      switch(type) {
          case 'percent': return 'Percentagem';
          case 'fixed_amount': return 'Valor Fixo';
          case 'fixed_price': return 'Preço Final';
      }
  };

  const getFormattedValue = (promo: PromoCode) => {
      switch(promo.type) {
          case 'percent': return `${promo.value}%`;
          case 'fixed_amount': return `-€${promo.value}`;
          case 'fixed_price': return `= €${promo.value}`;
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[240px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar códigos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm uppercase placeholder:normal-case font-mono"
            />
          </div>
          
          <select 
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="pl-3 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-slate-600 dark:text-slate-300 min-w-[160px]"
          >
            <option value="date">Ordenar por Data</option>
            <option value="usage">Ordenar por Uso</option>
            <option value="validity">Ordenar por Validade</option>
          </select>
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setShowDeleted(!showDeleted)}
            className={`
              flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showDeleted 
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'}
            `}
          >
            <Trash2 size={16} />
          </button>
          
          <button 
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Criar Código
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Adjusted Grid - 12 Columns Total */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider items-center">
          <div className="col-span-1 hidden xl:block">Data</div>
          <div className="col-span-5 sm:col-span-3 xl:col-span-2">Código</div>
          <div className="col-span-2 hidden md:block xl:col-span-1 text-center">Tipo</div>
          <div className="col-span-3 sm:col-span-2 xl:col-span-1 text-right">Valor</div>
          <div className="col-span-1 hidden lg:flex justify-center">Packs</div>
          <div className="col-span-2 hidden xl:block">Válido Até</div>
          <div className="col-span-2 hidden lg:block text-center">Utilização</div>
          <div className="col-span-1 hidden lg:flex justify-center">Recorrente</div>
          <div className="col-span-4 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-1 text-right">Ações</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredPromos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Tag size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem códigos promocionais</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Crie campanhas para atrair mais clientes.</p>
              <button onClick={handleAdd} className="mt-6 text-primary-600 font-medium hover:underline text-sm">Criar Primeiro Código</button>
            </div>
          ) : (
            filteredPromos.map((promo) => {
                const expired = isExpired(promo.validUntil);
                const depleted = isFullyUsed(promo.usageCount, promo.maxUsage);
                const active = !expired && !depleted && !promo.isDeleted;
                const usagePercent = Math.min((promo.usageCount / promo.maxUsage) * 100, 100);

                return (
                  <div 
                    key={promo.id} 
                    className={`
                      group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                      ${promo.isDeleted ? 'opacity-60 grayscale' : ''}
                    `}
                  >
                    {/* 1. Date */}
                    <div className="col-span-1 hidden xl:block text-xs text-slate-500 font-mono">
                        {promo.createdAt}
                    </div>

                    {/* 2. Code */}
                    <div className="col-span-5 sm:col-span-3 xl:col-span-2">
                       <div className="flex items-center gap-2">
                           <div 
                                className={`relative flex items-center gap-2 font-mono font-bold text-sm tracking-wide px-2 py-1 rounded border-2 border-dashed group/code cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${active ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-300' : 'bg-slate-100 border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-600'}`}
                                onClick={() => handleCopy(promo.code, promo.id)}
                                title="Clique para copiar"
                           >
                               {promo.code}
                               {copiedId === promo.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="opacity-0 group-hover/code:opacity-100 transition-opacity text-slate-400" />}
                           </div>
                           
                           {!active && !promo.isDeleted && (
                               <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded hidden sm:inline-block">
                                   {expired ? 'EXPIRADO' : 'ESGOTADO'}
                               </span>
                           )}
                           {active && !promo.isDeleted && (
                               <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded hidden sm:inline-block">
                                   ATIVO
                               </span>
                           )}
                       </div>
                    </div>

                    {/* 3. Type */}
                    <div className="col-span-2 hidden md:flex xl:col-span-1 flex-col items-center justify-center">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap ${
                            promo.type === 'percent' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                            promo.type === 'fixed_amount' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800' :
                            'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                        }`}>
                            {getTypeIcon(promo.type)} {getTypeLabel(promo.type)}
                        </span>
                    </div>

                    {/* 4. Value */}
                    <div className="col-span-3 sm:col-span-2 xl:col-span-1 text-right font-bold text-slate-800 dark:text-white">
                        {getFormattedValue(promo)}
                    </div>

                    {/* 5. Packs (Interactive) */}
                    <div className="col-span-1 hidden lg:flex justify-center">
                        <button 
                            onClick={() => setViewingPlansId(promo.planIds)}
                            className={`p-2 rounded-full transition-colors ${promo.planIds.length > 0 ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20' : 'text-slate-300 dark:text-slate-600'}`}
                            title={promo.planIds.length > 0 ? `${promo.planIds.length} packs associados` : 'Todos os packs'}
                        >
                            <Package size={18} />
                        </button>
                    </div>

                    {/* 6. Valid Until */}
                    <div className={`col-span-2 hidden xl:block text-xs font-medium ${expired ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        <div>{promo.validUntil || 'Ilimitado'}</div>
                        {promo.validityMinutes > 0 && (
                            <div className="text-[10px] text-slate-400">{promo.validityMinutes} min após ativação</div>
                        )}
                    </div>

                    {/* 7. Usage (Combined) */}
                    <div className="col-span-2 hidden lg:flex flex-col items-center justify-center px-4">
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${depleted ? 'bg-red-500' : 'bg-primary-500'}`} 
                                style={{ width: `${usagePercent}%` }} 
                            />
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {promo.usageCount} <span className="text-slate-300 dark:text-slate-600">/</span> {promo.maxUsage}
                        </span>
                    </div>

                    {/* 9. Recurring */}
                    <div className="col-span-1 hidden lg:flex justify-center">
                        {promo.applyToRecurring ? (
                            <span className="text-purple-500 bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded-lg" title="Aplica-se a renovações"><Repeat size={16} /></span>
                        ) : (
                            <span className="text-slate-300 dark:text-slate-700" title="Apenas 1ª pagamento"><CheckCircle2 size={16} /></span>
                        )}
                    </div>

                    {/* 10. Actions */}
                    <div className="col-span-4 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-1 flex justify-end items-center gap-2">
                        {promo.isDeleted ? (
                            <>
                                <button onClick={() => toggleDelete(promo.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><RotateCcw size={18} /></button>
                                <button onClick={() => handleDeletePermanent(promo.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEdit(promo)} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                <button onClick={() => toggleDelete(promo.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                            </>
                        )}
                    </div>
                  </div>
                );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A mostrar {filteredPromos.length} resultados
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 transition-colors">1</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Seguinte</button>
          </div>
        </div>
      </div>

      <PromoModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={selectedPromo}
      />

      <LinkedPlansModal
        isOpen={!!viewingPlansId}
        onClose={() => setViewingPlansId(null)}
        planIds={viewingPlansId || []}
      />
    </div>
  );
};

export default PromosView;
