import React, { useState } from 'react';
import { Search, Plus, Calendar, Clock, Activity, Dumbbell, History, ChevronRight, Eye, Play, PlusCircle, AlignLeft, CheckCircle2, Timer, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { Client } from '../../types';
import { TimerModal } from './TimerModal';
import { ExerciseHistoryModal } from './ExerciseHistoryModal';
import { MOCK_EXERCISES_DB } from '../workouts/ExerciseSelect';

interface ClientRegisterWorkoutTabProps {
  client?: Client;
}

// Mock Data
const MOCK_PLANS = [
  { id: 'p1', name: 'Hipertrofia Fase 1', date: '2024-03-01', status: 'active', workoutsCount: 3 },
  { id: 'p2', name: 'Adaptação Anatómica', date: '2024-01-15', status: 'completed', workoutsCount: 4 },
];

const MOCK_WORKOUTS = [
  { id: 'w1', planId: 'p1', name: 'Treino A - Peito e Tríceps', muscles: 'Peito, Tríceps, Ombros', exercisesCount: 6, setsCount: 22, duration: '60 min' },
  { id: 'w2', planId: 'p1', name: 'Treino B - Costas e Bíceps', muscles: 'Costas, Bíceps', exercisesCount: 5, setsCount: 18, duration: '50 min' },
  { id: 'w3', planId: 'p1', name: 'Treino C - Pernas', muscles: 'Quadríceps, Isquiotibiais, Gémeos', exercisesCount: 7, setsCount: 24, duration: '75 min' },
];

const MOCK_EXERCISES = [
  { id: 'e1', name: 'Supino Plano com Barra', sets: 4, repRange: '8-10', previousLog: [ { kg: 60, reps: 10 }, { kg: 60, reps: 9 }, { kg: 60, reps: 8 }, { kg: 60, reps: 7 } ] },
  { id: 'e2', name: 'Crucifixo Inclinado com Halteres', sets: 3, repRange: '10-12', previousLog: [ { kg: 16, reps: 12 }, { kg: 16, reps: 10 }, { kg: 14, reps: 12 } ] },
  { id: 'e3', name: 'Tríceps no Pulley', sets: 3, repRange: '12-15', previousLog: [ { kg: 25, reps: 15 }, { kg: 25, reps: 14 }, { kg: 25, reps: 12 } ] }
];

export const ClientRegisterWorkoutTab: React.FC<ClientRegisterWorkoutTabProps> = ({ client }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Select Plan, 2: Select Workout, 3: Register
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  
  const [workoutLog, setWorkoutLog] = useState<any[]>([]);

  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerExerciseName, setTimerExerciseName] = useState('');

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyExerciseName, setHistoryExerciseName] = useState('');

  const [replacingExerciseIndex, setReplacingExerciseIndex] = useState<number | null>(null);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');

  const handleOpenHistory = (exerciseName: string) => {
    setHistoryExerciseName(exerciseName);
    setHistoryModalOpen(true);
  };

  const handleOpenTimer = (restString: string, exerciseName: string) => {
    const match = restString.match(/(\d+)/);
    if (match) {
      setTimerSeconds(parseInt(match[1], 10));
      setTimerExerciseName(exerciseName);
      setTimerModalOpen(true);
    } else {
      setTimerSeconds(90);
      setTimerExerciseName(exerciseName);
      setTimerModalOpen(true);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setStep(2);
  };

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    // Initialize log structure
    const initialLog = MOCK_EXERCISES.map(ex => ({
      ...ex,
      observations: '',
      loggedSets: ex.previousLog.map((prev, idx) => ({
        setNumber: idx + 1,
        prevKg: prev.kg,
        reps: '',
        kg: '',
        rir: ''
      }))
    }));
    setWorkoutLog(initialLog);
    setStep(3);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: string) => {
    const newLog = [...workoutLog];
    newLog[exerciseIndex].loggedSets[setIndex][field] = value;
    setWorkoutLog(newLog);
  };

  const addSet = (exerciseIndex: number) => {
    const newLog = [...workoutLog];
    const exercise = newLog[exerciseIndex];
    exercise.loggedSets.push({
      setNumber: exercise.loggedSets.length + 1,
      prevKg: '-',
      reps: '',
      kg: '',
      rir: ''
    });
    setWorkoutLog(newLog);
  };

  const updateObservations = (exerciseIndex: number, value: string) => {
    const newLog = [...workoutLog];
    newLog[exerciseIndex].observations = value;
    setWorkoutLog(newLog);
  };

  const handleReplaceExercise = (newName: string) => {
    if (replacingExerciseIndex === null) return;
    const newLog = [...workoutLog];
    newLog[replacingExerciseIndex].name = newName;
    setWorkoutLog(newLog);
    setReplacingExerciseIndex(null);
    setExerciseSearchTerm('');
  };

  const handleFinish = () => {
    // Reset to step 1 after saving
    setStep(1);
    setSelectedPlanId(null);
    setSelectedWorkoutId(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Registar Treino</h3>
        {step > 1 && (
          <button 
            onClick={() => setStep(step === 3 ? 2 : 1)}
            className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors"
          >
            Voltar
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className={`flex items-center gap-2 ${step > 1 ? 'cursor-pointer' : ''}`}
            onClick={() => setStep(1)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
              1
            </div>
            <span className={`text-sm font-bold ${step >= 1 ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Plano</span>
          </div>
          <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
          <div 
            className={`flex items-center gap-2 ${selectedPlanId ? 'cursor-pointer' : ''}`}
            onClick={() => selectedPlanId && setStep(2)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
              2
            </div>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Treino</span>
          </div>
          <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
          <div 
            className={`flex items-center gap-2 ${selectedWorkoutId ? 'cursor-pointer' : ''}`}
            onClick={() => selectedWorkoutId && setStep(3)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
              3
            </div>
            <span className={`text-sm font-bold ${step >= 3 ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Registo</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar plano..." 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-primary-500/20">
                <Plus size={18} />
                Criar Novo Plano
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Planos Recentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_PLANS.map(plan => (
                  <button 
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl transition-all text-left shadow-sm group hover:shadow-md"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">{plan.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {plan.date}</span>
                        <span className="flex items-center gap-1.5"><Dumbbell size={14} className="text-slate-400" /> {plan.workoutsCount} treinos</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">
                Treinos do Plano: {MOCK_PLANS.find(p => p.id === selectedPlanId)?.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_WORKOUTS.filter(w => w.planId === selectedPlanId).map(workout => (
                <button 
                  key={workout.id}
                  onClick={() => handleSelectWorkout(workout.id)}
                  className="flex flex-col p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl transition-all text-left group shadow-sm hover:shadow-md h-full"
                >
                  <div className="flex items-start justify-between mb-4 w-full">
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{workout.name}</h4>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors shrink-0">
                      <Play size={16} fill="currentColor" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-6 flex-grow">{workout.muscles}</p>
                  
                  <div className="flex items-center justify-between gap-3 w-full mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Exercícios:</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{workout.exercisesCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Séries:</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{workout.setsCount}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                  <Activity className="text-primary-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">{MOCK_WORKOUTS.find(w => w.id === selectedWorkoutId)?.name}</h3>
                  <p className="text-sm text-slate-500">{MOCK_WORKOUTS.find(w => w.id === selectedWorkoutId)?.muscles}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 lg:gap-6 items-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Exercícios</p>
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{MOCK_WORKOUTS.find(w => w.id === selectedWorkoutId)?.exercisesCount}</p>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Séries Totais</p>
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{MOCK_WORKOUTS.find(w => w.id === selectedWorkoutId)?.setsCount}</p>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Duração Ultimo Treino</p>
                  <p className="font-bold text-slate-800 dark:text-white text-lg flex items-center justify-center gap-1">
                    <Clock size={16} className="text-slate-400" />
                    {MOCK_WORKOUTS.find(w => w.id === selectedWorkoutId)?.duration}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {workoutLog.map((exercise, eIdx) => (
                <div key={exercise.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-800 dark:text-white shadow-sm shrink-0">
                        {eIdx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{exercise.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md">
                            {exercise.sets} séries
                          </span>
                          <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                            {exercise.repRange} reps
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenHistory(exercise.name)}
                        className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                      >
                        <History size={16} />
                        Histórico
                      </button>
                      <button 
                        onClick={() => setReplacingExerciseIndex(eIdx)}
                        className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                      >
                        <RefreshCw size={16} />
                        Substituir
                      </button>
                    </div>
                  </div>
                  
                  {/* Sets */}
                  <div className="p-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[500px]">
                        <thead>
                          <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/50">
                            <th className="pb-3 px-2 text-center w-16">Série</th>
                            <th className="pb-3 px-2 text-center w-32">Carga Anterior</th>
                            <th className="pb-3 px-2">Carga (kg)</th>
                            <th className="pb-3 px-2">Reps</th>
                            <th className="pb-3 px-2">RIR</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          {exercise.loggedSets.map((set: any, sIdx: number) => (
                            <tr key={sIdx} className="group border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                              <td className="py-3 px-2">
                                <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                                  {set.setNumber}
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-slate-400 font-medium">{set.prevKg}</span>
                              </td>
                              <td className="py-3 px-2">
                                <input 
                                  type="number" 
                                  value={set.kg}
                                  onChange={(e) => updateSet(eIdx, sIdx, 'kg', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                  placeholder="0"
                                />
                              </td>
                              <td className="py-3 px-2">
                                <input 
                                  type="number" 
                                  value={set.reps}
                                  onChange={(e) => updateSet(eIdx, sIdx, 'reps', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                  placeholder="0"
                                />
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text" 
                                    value={set.rir}
                                    onChange={(e) => updateSet(eIdx, sIdx, 'rir', e.target.value)}
                                    placeholder="RIR (0-4)"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <AlignLeft size={18} className="absolute left-4 top-3.5 text-slate-400" />
                          <input 
                            type="text" 
                            value={exercise.observations}
                            onChange={(e) => updateObservations(eIdx, e.target.value)}
                            placeholder="Adicionar observações a este exercício..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex gap-3 mt-8">
              <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-bold mb-1">Informação Final</p>
                <p>Este treino ficará associado ao histórico do cliente. Após o registo será possível adicionar feedback e comentários ao treino na página de detalhes.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-6 py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 rounded-xl font-bold transition-colors shadow-sm"
              >
                Registar apenas
              </button>
              <button 
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-colors shadow-md shadow-primary-500/20"
              >
                Registar e abrir treino
              </button>
            </div>
          </div>
        )}
      </div>

      <TimerModal 
        isOpen={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        initialSeconds={timerSeconds}
        exerciseName={timerExerciseName}
      />

      <ExerciseHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        exerciseName={historyExerciseName}
      />

      {replacingExerciseIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Substituir Exercício</h3>
              <button 
                onClick={() => setReplacingExerciseIndex(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={exerciseSearchTerm}
                  onChange={(e) => setExerciseSearchTerm(e.target.value)}
                  placeholder="Pesquisar exercício..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {MOCK_EXERCISES_DB.filter(ex => ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(exerciseSearchTerm.toLowerCase())).map(ex => (
                <button
                  key={ex.id}
                  onClick={() => handleReplaceExercise(ex.name)}
                  className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors flex items-center gap-3 group"
                >
                  {ex.image ? (
                    <img src={ex.image} alt={ex.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <ImageIcon className="text-slate-400" size={20} />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">{ex.name}</p>
                    <p className="text-xs text-slate-500">{ex.muscleGroup}</p>
                  </div>
                </button>
              ))}
              {MOCK_EXERCISES_DB.filter(ex => ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(exerciseSearchTerm.toLowerCase())).length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-slate-500 font-medium">Nenhum exercício encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
