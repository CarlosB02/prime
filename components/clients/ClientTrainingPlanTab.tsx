import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import WorkoutsView, { WorkoutPlan } from '../workouts/WorkoutsView';

export const ClientTrainingPlanTab: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  const handleSelectPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="animate-fade-in py-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Atribuir Plano de Treino</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Selecione um dos planos de treino da biblioteca principal para atribuir a este cliente.
        </p>
      </div>
      
      {selectedPlan && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Plano atribuído com sucesso!</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">O cliente agora está a seguir o plano: <strong>{selectedPlan.name}</strong></p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedPlan(null)}
            className="p-2 text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-800/50 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      <div className="-mx-4 sm:mx-0">
        <WorkoutsView mode="select" onSelectPlan={handleSelectPlan} />
      </div>
    </div>
  );
};
