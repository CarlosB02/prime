import React, { useState } from 'react';
import { X, History, TrendingUp, Calendar, Dumbbell, Activity, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ExerciseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
}

// Mock Data
const MOCK_HISTORY = [
  {
    id: 'h1',
    date: '2024-03-20',
    duration: '50 min',
    sets: [
      { id: 's1', setNumber: 1, kg: 60, reps: 10, rir: 2 },
      { id: 's2', setNumber: 2, kg: 65, reps: 8, rir: 1 },
      { id: 's3', setNumber: 3, kg: 65, reps: 8, rir: 1 },
      { id: 's4', setNumber: 4, kg: 65, reps: 7, rir: 0 },
    ]
  },
  {
    id: 'h2',
    date: '2024-03-13',
    duration: '45 min',
    sets: [
      { id: 's1', setNumber: 1, kg: 60, reps: 10, rir: 2 },
      { id: 's2', setNumber: 2, kg: 60, reps: 10, rir: 1 },
      { id: 's3', setNumber: 3, kg: 65, reps: 7, rir: 0 },
      { id: 's4', setNumber: 4, kg: 65, reps: 6, rir: 0 },
    ]
  },
  {
    id: 'h3',
    date: '2024-03-06',
    duration: '55 min',
    sets: [
      { id: 's1', setNumber: 1, kg: 55, reps: 12, rir: 2 },
      { id: 's2', setNumber: 2, kg: 60, reps: 9, rir: 1 },
      { id: 's3', setNumber: 3, kg: 60, reps: 8, rir: 0 },
      { id: 's4', setNumber: 4, kg: 60, reps: 7, rir: 0 },
    ]
  }
];

export const ExerciseHistoryModal: React.FC<ExerciseHistoryModalProps> = ({ isOpen, onClose, exerciseName }) => {
  const [expandedWorkouts, setExpandedWorkouts] = useState<string[]>(['h1']);

  if (!isOpen) return null;

  const toggleWorkout = (id: string) => {
    setExpandedWorkouts(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  // Calculations
  const calculate1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return weight * (1 + 0.0333 * reps);
  };

  const getBest1RM = () => {
    let best = 0;
    MOCK_HISTORY.forEach(w => {
      w.sets.forEach(s => {
        const rm = calculate1RM(s.kg, s.reps);
        if (rm > best) best = rm;
      });
    });
    return Math.round(best);
  };

  const getBestSetVolume = () => {
    let best = 0;
    let bestDetails = { kg: 0, reps: 0 };
    MOCK_HISTORY.forEach(w => {
      w.sets.forEach(s => {
        const volume = s.kg * s.reps;
        if (volume > best) {
          best = volume;
          bestDetails = { kg: s.kg, reps: s.reps };
        }
      });
    });
    return bestDetails;
  };

  const best1RM = getBest1RM();
  const bestSet = getBestSetVolume();
  const lastWorkout = MOCK_HISTORY[0];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-500 shrink-0">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{exerciseName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Histórico de performance e evolução
              </p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <Calendar size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Último Treino</h4>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{lastWorkout.date}</p>
              <p className="text-xs text-slate-500 mt-1">Duração: {lastWorkout.duration}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <Activity size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Melhor 1RM Est.</h4>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{best1RM} kg</p>
              <p className="text-xs text-primary-500 font-medium mt-1">Calculado</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <Dumbbell size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Melhor Série</h4>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{bestSet.reps} × {bestSet.kg} kg</p>
              <p className="text-xs text-slate-500 mt-1">Volume: {bestSet.reps * bestSet.kg} kg</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <TrendingUp size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Evolução Média</h4>
              </div>
              <p className="text-lg font-bold text-emerald-500 flex items-center gap-1">
                +4.5%
              </p>
              <p className="text-xs text-slate-500 mt-1">Últimos 3 treinos</p>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {MOCK_HISTORY.map((workout) => {
              const isExpanded = expandedWorkouts.includes(workout.id);
              
              return (
                <div key={workout.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  {/* Accordion Header */}
                  <button 
                    onClick={() => toggleWorkout(workout.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-white shadow-sm shrink-0">
                        <Calendar size={18} className="text-primary-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-800 dark:text-white">{workout.date}</h4>
                        <p className="text-xs text-slate-500">{workout.sets.length} séries • Duração: {workout.duration}</p>
                      </div>
                    </div>
                    <div className="text-slate-400 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>
                  
                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-0 border-t border-slate-100 dark:border-slate-700/50 animate-fade-in">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-center text-sm min-w-[500px] table-fixed">
                          <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-700/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              <th className="py-3 px-2 w-1/5 text-center">Série</th>
                              <th className="py-3 px-2 w-1/5 text-center">Reps × Carga</th>
                              <th className="py-3 px-2 w-1/5 text-center">RIR</th>
                              <th className="py-3 px-2 w-1/5 text-center">1RM E</th>
                              <th className="py-3 px-2 w-1/5 text-center">% RM</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {workout.sets.map((set) => {
                              const est1RM = calculate1RM(set.kg, set.reps);
                              const percentage = best1RM > 0 ? (set.kg / best1RM) * 100 : 0;
                              
                              return (
                                <tr key={set.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                  <td className="py-4 px-2">
                                    <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                                      {set.setNumber}
                                    </div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="flex items-baseline justify-center gap-1.5">
                                      <span className="font-bold text-base text-slate-800 dark:text-white">{set.reps}</span>
                                      <span className="text-slate-400 text-xs">×</span>
                                      <span className="font-bold text-base text-slate-800 dark:text-white">{set.kg} <span className="text-xs text-slate-500 font-medium">kg</span></span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-2 text-center">
                                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                                      {set.rir}
                                    </span>
                                  </td>
                                  <td className="py-4 px-2 text-center">
                                    <span className="font-bold text-primary-600 dark:text-primary-400 text-base">{Math.round(est1RM)} <span className="text-xs font-medium opacity-70">kg</span></span>
                                  </td>
                                  <td className="py-4 px-2 text-center">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 text-base">{Math.round(percentage)}%</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex gap-3 mb-6">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-bold mb-1">Métricas de Performance</p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                <li><strong>1RM Estimada:</strong> O peso máximo teórico para uma repetição, calculado com base na carga e repetições (Fórmula de Epley).</li>
                <li><strong>% da 1RM:</strong> A intensidade relativa da série, comparando a carga utilizada com a sua Melhor 1RM Estimada.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold transition-all shadow-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
