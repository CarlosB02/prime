import React from 'react';
import { X, Package, CreditCard, DollarSign } from 'lucide-react';
import { MOCK_PLANS } from '../../constants';

interface LinkedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  planIds: string[];
}

const LinkedPlansModal: React.FC<LinkedPlansModalProps> = ({ isOpen, onClose, planIds }) => {
  if (!isOpen) return null;

  const linkedPlans = MOCK_PLANS.filter(p => planIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-fade-in-up">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            Packs Associados
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {linkedPlans.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <Package size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm">Este código aplica-se a todos os planos.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {linkedPlans.map(plan => (
                        <div key={plan.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{plan.name}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><CreditCard size={10} /> {plan.isSubscription ? 'Subscrição' : 'Pagamento Único'}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">€{plan.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-right">
            <span className="text-xs text-slate-500">Total: {linkedPlans.length > 0 ? linkedPlans.length : 'Todos'} packs</span>
        </div>
      </div>
    </div>
  );
};

export default LinkedPlansModal;
