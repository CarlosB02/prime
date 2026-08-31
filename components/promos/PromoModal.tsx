import React, { useState, useEffect } from 'react';
import { X, Save, Tag, Percent, DollarSign, Calendar, Clock, Package, Check, RefreshCw } from 'lucide-react';
import { PromoCode, PromoType, PaymentPlan } from '../../types';
import { MOCK_PLANS } from '../../constants';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Omit<PromoCode, 'id' | 'isDeleted' | 'createdAt' | 'usageCount'>) => void;
  initialData?: PromoCode | null;
}

const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<{
    code: string;
    type: PromoType;
    value: number;
    planIds: string[];
    validityMinutes: number;
    validUntil: string;
    maxUsage: number;
    applyToRecurring: boolean;
  }>({
    code: '',
    type: 'percent',
    value: 0,
    planIds: [],
    validityMinutes: 0,
    validUntil: '',
    maxUsage: 100,
    applyToRecurring: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        type: initialData.type,
        value: initialData.value,
        planIds: initialData.planIds,
        validityMinutes: initialData.validityMinutes,
        validUntil: initialData.validUntil,
        maxUsage: initialData.maxUsage,
        applyToRecurring: initialData.applyToRecurring
      });
    } else {
      setFormData({
        code: '',
        type: 'percent',
        value: 0,
        planIds: [],
        validityMinutes: 0,
        validUntil: '',
        maxUsage: 100,
        applyToRecurring: false
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const togglePlan = (id: string) => {
    setFormData(prev => {
        const exists = prev.planIds.includes(id);
        return {
            ...prev,
            planIds: exists ? prev.planIds.filter(pid => pid !== id) : [...prev.planIds, id]
        };
    });
  };

  const selectAllPlans = () => {
      setFormData(prev => ({
          ...prev,
          planIds: prev.planIds.length === MOCK_PLANS.length ? [] : MOCK_PLANS.map(p => p.id)
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
              {initialData ? 'Editar Código' : 'Novo Código Promocional'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure descontos e campanhas para os seus planos.</p>
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
          <form id="promo-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Discount Config */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-primary-500" />
                  Configuração do Desconto
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Código Promocional</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s/g, '')})}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-primary-200 dark:border-primary-800/50 rounded-xl text-lg font-mono font-bold text-primary-600 dark:text-primary-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all uppercase tracking-widest text-center placeholder:text-slate-300"
                                placeholder="EX: VERAO2024"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Tipo de Desconto</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, type: 'percent'})}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium border transition-all ${formData.type === 'percent' ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Percent size={16} /> Percentagem (%)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, type: 'fixed_amount'})}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium border transition-all ${formData.type === 'fixed_amount' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <DollarSign size={16} /> Desconto Fixo (€)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, type: 'fixed_price'})}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium border transition-all ${formData.type === 'fixed_price' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Tag size={16} /> Preço Final (€)
                            </button>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            {formData.type === 'percent' ? 'Percentagem de Desconto' : formData.type === 'fixed_amount' ? 'Valor a Descontar' : 'Preço Final do Pack'}
                        </label>
                        <div className="relative">
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                value={formData.value}
                                onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                {formData.type === 'percent' ? '%' : '€'}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.applyToRecurring ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${formData.applyToRecurring ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                <RefreshCw size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Aplicar em pagamentos recorrentes?</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Se ativo, o desconto será aplicado em todas as renovações da subscrição.</div>
                            </div>
                            <input type="checkbox" className="hidden" checked={formData.applyToRecurring} onChange={(e) => setFormData({...formData, applyToRecurring: e.target.checked})} />
                            <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.applyToRecurring ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.applyToRecurring ? 'left-5' : 'left-1'}`} />
                            </div>
                        </label>
                    </div>
               </div>
            </div>

            {/* 2. Plan Association */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Package size={16} className="text-primary-500" />
                        Associar a Planos (Packs)
                    </h3>
                    <button 
                        type="button" 
                        onClick={selectAllPlans}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        {formData.planIds.length === MOCK_PLANS.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {MOCK_PLANS.filter(p => !p.isDeleted).map(plan => {
                        const isSelected = formData.planIds.includes(plan.id);
                        return (
                            <div 
                                key={plan.id}
                                onClick={() => togglePlan(plan.id)}
                                className={`
                                    relative flex items-center p-3 rounded-lg border cursor-pointer transition-all
                                    ${isSelected 
                                        ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-500 dark:border-primary-500/50' 
                                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                                `}
                            >
                                <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-400'}`}>
                                    {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>{plan.name}</p>
                                    <p className="text-xs text-slate-500">€{plan.price}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {formData.planIds.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                        ⚠️ Atenção: Se não selecionar nenhum plano, o código poderá ser aplicado a qualquer compra.
                    </p>
                )}
            </div>

            {/* 3. Limits & Validity */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-primary-500" />
                  Limites e Validade
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Válido até</label>
                        <input 
                           type="date" 
                           value={formData.validUntil}
                           onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                           className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Validade (Minutos)</label>
                        <input 
                           type="number" 
                           min="0"
                           value={formData.validityMinutes}
                           onChange={(e) => setFormData({...formData, validityMinutes: parseInt(e.target.value) || 0})}
                           className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                           placeholder="0 = Ilimitado"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nº Máx. Usos</label>
                        <input 
                           type="number" 
                           min="1"
                           value={formData.maxUsage}
                           onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value) || 1})}
                           className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
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
            form="promo-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar Código
          </button>
        </div>

      </div>
    </div>
  );
};

export default PromoModal;
