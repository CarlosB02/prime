import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, RefreshCw, CreditCard, ShieldCheck, Check, Clock, Lock } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { PaymentPlan } from '../../types';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<PaymentPlan, 'id' | 'isDeleted'>) => void;
  initialData?: PaymentPlan | null;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<PaymentPlan, 'id' | 'isDeleted'>>({
    name: '',
    durationMonths: 1,
    price: 0,
    isSubscription: true,
    allowOneTimePayment: false,
    allowInstallments: false,
    isTemporary: false,
    hasContentAccess: true,
    startDate: new Date().toISOString().split('T')[0],
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        durationMonths: initialData.durationMonths,
        price: initialData.price,
        isSubscription: initialData.isSubscription,
        allowOneTimePayment: initialData.allowOneTimePayment,
        allowInstallments: initialData.allowInstallments,
        isTemporary: initialData.isTemporary,
        hasContentAccess: initialData.hasContentAccess,
        startDate: initialData.startDate,
        endDate: initialData.endDate || '',
        isActive: initialData.isActive
      });
    } else {
      setFormData({
        name: '',
        durationMonths: 1,
        price: 0,
        isSubscription: true,
        allowOneTimePayment: false,
        allowInstallments: false,
        isTemporary: false,
        hasContentAccess: true,
        startDate: new Date().toISOString().split('T')[0],
        isActive: true
      });
    }
  }, [initialData, isOpen]);

  // Auto-name suggestion effect
  useEffect(() => {
    if (!initialData && (!formData.name || isDefaultName(formData.name))) {
        setFormData(prev => ({ ...prev, name: getSuggestedName(prev.durationMonths) }));
    }
  }, [formData.durationMonths, initialData]);

  const isDefaultName = (name: string) => {
     return ['Plano Mensal', 'Plano Trimestral', 'Plano Semestral', 'Plano Anual'].includes(name) || name.includes('Plano de');
  };

  const getSuggestedName = (months: number) => {
     switch(months) {
         case 1: return 'Plano Mensal';
         case 3: return 'Plano Trimestral';
         case 6: return 'Plano Semestral';
         case 12: return 'Plano Anual';
         default: return `Plano de ${months} Meses`;
     }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleNumericChange = (field: keyof PaymentPlan, value: string) => {
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
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Editar Plano' : 'Novo Plano de Pagamento'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure as opções de faturação para os seus clientes.</p>
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
          <form id="plan-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Core Info */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard size={16} className="text-primary-500" />
                  Informação do Plano
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Duração</label>
                        <select 
                            value={formData.durationMonths}
                            onChange={(e) => handleNumericChange('durationMonths', e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} {i === 0 ? 'Mês' : 'Meses'} ({getSuggestedName(i + 1).replace('Plano ', '')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Preço (€)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleNumericChange('price', e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nome do Plano</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                            placeholder="Ex: Plano Mensal Premium"
                        />
                    </div>
               </div>
            </div>

            {/* Section 2: Payment Configuration */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <RefreshCw size={16} className="text-primary-500" />
                  Opções de Pagamento
                </h3>

                <div className="space-y-3">
                    {/* Subscription Toggle */}
                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.isSubscription ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.isSubscription ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                <RefreshCw size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Subscrição (Recorrente)</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Renova automaticamente ao final do período.</div>
                            </div>
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.isSubscription} onChange={(e) => setFormData({...formData, isSubscription: e.target.checked})} />
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.isSubscription ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isSubscription ? 'left-5' : 'left-1'}`} />
                        </div>
                    </label>

                     {/* One-Time Payment Toggle */}
                     <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.allowOneTimePayment ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.allowOneTimePayment ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                <DollarSign size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pagamento Único</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Cliente paga o valor total de uma vez.</div>
                            </div>
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.allowOneTimePayment} onChange={(e) => setFormData({...formData, allowOneTimePayment: e.target.checked})} />
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.allowOneTimePayment ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.allowOneTimePayment ? 'left-5' : 'left-1'}`} />
                        </div>
                    </label>

                     {/* Installments Toggle */}
                     <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.allowInstallments ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.allowInstallments ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                <CustomCalendarIcon size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pagamentos Faseados</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Permitir dividir o valor em prestações.</div>
                            </div>
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.allowInstallments} onChange={(e) => setFormData({...formData, allowInstallments: e.target.checked})} />
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.allowInstallments ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.allowInstallments ? 'left-5' : 'left-1'}`} />
                        </div>
                    </label>
                </div>
            </div>

            {/* Section 3: Validity & Content */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary-500" />
                  Validade e Acessos
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Content Access */}
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, hasContentAccess: !formData.hasContentAccess})}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${formData.hasContentAccess ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-60'}`}
                    >
                         <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.hasContentAccess ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-400'}`}>
                             {formData.hasContentAccess && <Check size={12} strokeWidth={3} />}
                         </div>
                         <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                             Acesso a Conteúdos
                         </div>
                    </button>

                    {/* Temporary Plan */}
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, isTemporary: !formData.isTemporary})}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${formData.isTemporary ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-60'}`}
                    >
                         <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isTemporary ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-400'}`}>
                             {formData.isTemporary && <Check size={12} strokeWidth={3} />}
                         </div>
                         <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                             Plano Temporário
                         </div>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-5">
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Data Inicial</label>
                        <input 
                           type="date" 
                           value={formData.startDate}
                           onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                           className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                     </div>
                     <div className={`transition-all duration-300 ${formData.isTemporary ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        <label className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5 uppercase tracking-wide">Data Final (Obrigatório)</label>
                        <input 
                           type="date" 
                           value={formData.endDate || ''}
                           required={formData.isTemporary}
                           onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                           className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-amber-100 dark:border-amber-900/50 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                        />
                     </div>
                </div>
            </div>

            {/* Status Section */}
            <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                 <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Estado do Plano: {formData.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                 </div>
                 <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`
                        relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                        ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}
                    `}
                 >
                    <span
                        className={`
                            absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
                            ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                 </button>
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
            form="plan-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar Plano
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlanModal;
