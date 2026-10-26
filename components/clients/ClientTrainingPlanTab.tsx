import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  X, 
  Plus, 
  Layers, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Dumbbell, 
  Calendar, 
  Copy, 
  Check, 
  Edit3,
  FileText,
  History
} from 'lucide-react';
import WorkoutsView, { WorkoutPlan, MOCK_PLANS } from '../workouts/WorkoutsView';
import WorkoutPlanBuilder from '../workouts/WorkoutPlanBuilder';
import HistoryWorkoutModal from '../workouts/HistoryWorkoutModal';
import { Client } from '../../types';

interface ClientTrainingPlanTabProps {
  client?: Client;
}

export const ClientTrainingPlanTab: React.FC<ClientTrainingPlanTabProps> = ({ client }) => {
  const storageKey = client?.id ? `evolve_client_${client.id}_active_workout_plan` : 'evolve_active_workout_plan';

  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    }
    const matching = MOCK_PLANS.find(p => p.clientName && client?.name && p.clientName.toLowerCase() === client.name.toLowerCase());
    return matching ? matching.id : '1';
  });

  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(() => {
    return MOCK_PLANS.find(p => p.id === '1') || null;
  });

  const [historyPlan, setHistoryPlan] = useState<WorkoutPlan | null>(null);
  
  // Modals & Builder states
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderInitialPlan, setBuilderInitialPlan] = useState<any>(null);
  const [importSearch, setImportSearch] = useState('');

  const activePlan = useMemo(() => {
    if (!activePlanId) return null;
    return MOCK_PLANS.find(p => p.id === activePlanId) || selectedPlan || null;
  }, [activePlanId, selectedPlan]);

  // Filter plans for import
  const filteredPlans = MOCK_PLANS.filter(p => 
    p.name.toLowerCase().includes(importSearch.toLowerCase()) ||
    (p.clientName && p.clientName.toLowerCase().includes(importSearch.toLowerCase()))
  );

  const handleToggleActivePlan = (newPlanId: string, plan: WorkoutPlan) => {
    const nextId = activePlanId === plan.id ? null : plan.id;
    setActivePlanId(nextId);
    if (typeof window !== 'undefined') {
      if (nextId) {
        localStorage.setItem(storageKey, nextId);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
    setSelectedPlan(nextId ? plan : null);
  };

  const handleSelectPlan = (plan: WorkoutPlan) => {
    setActivePlanId(plan.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, plan.id);
    }
    setSelectedPlan(plan);
  };

  const handleOpenCreateBlank = () => {
    setIsChoiceModalOpen(false);
    setBuilderInitialPlan({
      name: client?.name ? `Plano de Treino - ${client.name}` : 'Novo Plano de Treino',
      clientName: client?.name || '',
      hasWeeklyPeriodization: false,
      workouts: []
    });
    setShowBuilder(true);
  };

  const handleOpenImportModal = () => {
    setIsChoiceModalOpen(false);
    setIsImportModalOpen(true);
  };

  const handleAssignDirectly = (plan: WorkoutPlan) => {
    setActivePlanId(plan.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, plan.id);
    }
    setSelectedPlan(plan);
    setIsImportModalOpen(false);
  };

  const handleImportAndEdit = (plan: WorkoutPlan) => {
    setIsImportModalOpen(false);
    setBuilderInitialPlan({
      ...plan,
      name: `${plan.name} (${client?.name || 'Cliente'})`,
      clientName: client?.name || '',
    });
    setShowBuilder(true);
  };

  // If builder is active, render WorkoutPlanBuilder
  if (showBuilder) {
    return (
      <div className="animate-fade-in py-4">
        <WorkoutPlanBuilder
          planData={builderInitialPlan}
          onSave={(savedPlan) => {
            const assigned: WorkoutPlan = {
              id: savedPlan.id || Date.now().toString(),
              name: savedPlan.name || 'Novo Plano',
              clientName: client?.name || savedPlan.clientName,
              hasWeeklyPeriodization: savedPlan.hasWeeklyPeriodization || false,
              createdAt: new Date().toISOString()
            };
            setActivePlanId(assigned.id);
            if (typeof window !== 'undefined') {
              localStorage.setItem(storageKey, assigned.id);
            }
            setSelectedPlan(assigned);
            setShowBuilder(false);
            setBuilderInitialPlan(null);
          }}
          onCancel={() => {
            setShowBuilder(false);
            setBuilderInitialPlan(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-6">
      {/* Header with Title and "Criar Novo Plano" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Atribuir Plano de Treino</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Selecione um plano da biblioteca ou crie uma prescrição personalizada para este cliente.
          </p>
        </div>

        <button
          onClick={() => setIsChoiceModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/25 shrink-0 self-start sm:self-auto hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} />
          <span>Criar Novo Plano</span>
        </button>
      </div>
      
      {/* Active Plan Banner */}
      {activePlan && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 rounded-2xl flex items-center justify-between shadow-sm animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Plano Ativo</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Em vigor
                </span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                O cliente agora está a seguir o plano: <strong>{activePlan.name}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setHistoryPlan(activePlan)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
              title="Análise de Volume de Treino"
            >
              <History size={18} />
            </button>
            <button 
              onClick={() => {
                setActivePlanId(null);
                setSelectedPlan(null);
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(storageKey);
                }
              }}
              className="p-2 text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-800/50 rounded-xl transition-colors"
              title="Desativar plano"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Select Mode Workouts View */}
      <div className="-mx-4 sm:mx-0">
        <WorkoutsView 
          mode="select" 
          activePlanId={activePlanId}
          onToggleActivePlan={handleToggleActivePlan}
          onSelectPlan={handleSelectPlan} 
          showHistory={true} 
        />
      </div>

      {/* MODAL 1: Pergunta inicial - Importar ou Criar Novo */}
      {isChoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-primary-500" />
                  Criar Novo Plano de Treino
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Como deseja configurar o plano para {client?.name ? <strong>{client.name}</strong> : 'este cliente'}?
                </p>
              </div>
              <button 
                onClick={() => setIsChoiceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Choice Cards */}
            <div className="p-6 space-y-4">
              {/* Option 1: Importar existente */}
              <div 
                onClick={handleOpenImportModal}
                className="group p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 bg-slate-50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 cursor-pointer transition-all shadow-sm hover:shadow-md flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Layers size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Importar de um Existente
                    </h4>
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Escolher um plano da biblioteca de modelos já criados para atribuir diretamente ou adaptar com novos exercícios.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2.5 py-0.5 rounded-md">
                    Mais rápido • Modelos prontos
                  </span>
                </div>
              </div>

              {/* Option 2: Criar de raiz */}
              <div 
                onClick={handleOpenCreateBlank}
                className="group p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 cursor-pointer transition-all shadow-sm hover:shadow-md flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Criar um Novo de Raiz
                    </h4>
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Construir uma prescrição 100% personalizada em branco, definindo rotinas (Push/Pull, ABC, etc.), séries, reps e RIR.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md">
                    Personalização total do zero
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
              <button 
                onClick={() => setIsChoiceModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Escolha de Plano Existente para Importar */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Layers size={20} className="text-primary-500" />
                  Importar Plano Existente
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Selecione um plano para atribuir ou adaptar para {client?.name || 'o cliente'}.
                </p>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search filter bar */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome do plano ou atleta..." 
                  value={importSearch}
                  onChange={(e) => setImportSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>

            {/* List of Plans */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {filteredPlans.length === 0 ? (
                <div className="py-12 text-center">
                  <Dumbbell size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum plano encontrado</p>
                  <p className="text-xs text-slate-400 mt-1">Tente pesquisar por outro termo.</p>
                </div>
              ) : (
                filteredPlans.map(plan => (
                  <div 
                    key={plan.id}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-950/40 dark:group-hover:text-primary-400 transition-colors">
                        <Dumbbell size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {plan.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                          {plan.clientName && (
                            <span>Criado para: <strong>{plan.clientName}</strong></span>
                          )}
                          <span>•</span>
                          <span>{plan.hasWeeklyPeriodization ? 'Periodização Semanal' : 'Rotina Fixa'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for this plan */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setHistoryPlan(plan)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                        title="Análise de Volume de Treino"
                      >
                        <History size={16} />
                      </button>

                      <button
                        onClick={() => handleImportAndEdit(plan)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                        title="Abrir no construtor para editar antes de atribuir"
                      >
                        <Edit3 size={14} />
                        <span>Adaptar</span>
                      </button>
                      
                      <button
                        onClick={() => handleAssignDirectly(plan)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary-500/20"
                        title="Atribuir este plano diretamente ao cliente"
                      >
                        <Check size={14} />
                        <span>Atribuir</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setIsChoiceModalOpen(true);
                }}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                ← Voltar
              </button>
              
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History / Volume Analysis Modal for Client */}
      <HistoryWorkoutModal
        isOpen={historyPlan !== null}
        onClose={() => setHistoryPlan(null)}
        plan={historyPlan}
      />
    </div>
  );
};

export default ClientTrainingPlanTab;
