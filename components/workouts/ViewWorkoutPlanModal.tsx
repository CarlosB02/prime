import React, { useState, useMemo } from 'react';
import { X, User, Clock, Info, CheckCircle2, LayoutList, Activity } from 'lucide-react';
import { WorkoutPlan } from './WorkoutsView';
import { CustomDumbbellIcon } from '../icons';

interface ViewWorkoutPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WorkoutPlan | null;
}

// Interfaces to type our mock data
interface ExerciseView {
  id: string;
  muscleGroup: string;
  exerciseName: string;
  sets: string;
  reps: string;
  rest: string;
}

interface WorkoutView {
  id: string;
  name: string;
  exercises: ExerciseView[];
}

const MOCK_WORKOUTS: WorkoutView[] = [
  {
    id: 'w1',
    name: 'Lower A',
    exercises: [
      { id: 'e1', muscleGroup: 'Quadríceps', exerciseName: 'Agachamento Livre', sets: '4', reps: '8-10', rest: '120s' },
      { id: 'e2', muscleGroup: 'Glúteos', exerciseName: 'Hip Thrust', sets: '4', reps: '10-12', rest: '90s' },
      { id: 'e3', muscleGroup: 'Isquiotibiais', exerciseName: 'Cadeira Flexora', sets: '3', reps: '12-15', rest: '90s' },
      { id: 'e4', muscleGroup: 'Gémeos', exerciseName: 'Elevação de Gémeos em Pé', sets: '4', reps: '15-20', rest: '60s' },
    ]
  },
  {
    id: 'w2',
    name: 'Upper A',
    exercises: [
      { id: 'e5', muscleGroup: 'Peito', exerciseName: 'Supino Inclinado com Halteres', sets: '4', reps: '8-10', rest: '120s' },
      { id: 'e6', muscleGroup: 'Costas', exerciseName: 'Remada Curvada', sets: '4', reps: '8-10', rest: '120s' },
      { id: 'e7', muscleGroup: 'Ombros', exerciseName: 'Elevação Lateral', sets: '3', reps: '12-15', rest: '90s' },
      { id: 'e8', muscleGroup: 'Bíceps', exerciseName: 'Curl com Halteres', sets: '3', reps: '10-12', rest: '90s' },
      { id: 'e9', muscleGroup: 'Tríceps', exerciseName: 'Extensão na Polia', sets: '3', reps: '10-12', rest: '90s' },
    ]
  },
  {
    id: 'w3',
    name: 'Full Body',
    exercises: [
      { id: 'e10', muscleGroup: 'Quadríceps', exerciseName: 'Leg Press 45º', sets: '3', reps: '10-12', rest: '120s' },
      { id: 'e11', muscleGroup: 'Costas', exerciseName: 'Puxada Frontal', sets: '3', reps: '10-12', rest: '90s' },
      { id: 'e12', muscleGroup: 'Peito', exerciseName: 'Peck Deck', sets: '3', reps: '12-15', rest: '90s' },
      { id: 'e13', muscleGroup: 'Ombros', exerciseName: 'Desenvolvimento Máquina', sets: '3', reps: '10-12', rest: '90s' },
      { id: 'e14', muscleGroup: 'Abdómen', exerciseName: 'Crunch na Polia', sets: '4', reps: '15-20', rest: '60s' },
    ]
  }
];

const ViewWorkoutPlanModal: React.FC<ViewWorkoutPlanModalProps> = ({ isOpen, onClose, plan }) => {
  const [activeTab, setActiveTab] = useState<string>(MOCK_WORKOUTS[0].id);

  const workouts = MOCK_WORKOUTS; // In a real app, this would come from the plan data

  // Calculate volume (total sets per muscle group across all workouts in this view)
  const volumeSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        const setsNum = parseInt(ex.sets, 10) || 0;
        if (summary[ex.muscleGroup]) {
          summary[ex.muscleGroup] += setsNum;
        } else {
          summary[ex.muscleGroup] = setsNum;
        }
      });
    });
    
    // Sort by volume descending
    return Object.entries(summary).sort((a, b) => b[1] - a[1]);
  }, [workouts]);

  if (!isOpen || !plan) return null;

  const activeWorkout = workouts.find(w => w.id === activeTab) || workouts[0];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/20">
              <CustomDumbbellIcon size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                {plan.name}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Volume Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white">
              <Activity size={18} className="text-primary-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Volume Total por Grupo Muscular</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {volumeSummary.map(([muscle, sets]) => (
                <div key={muscle} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{muscle}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-xs font-bold text-primary-600 dark:text-primary-400 shadow-sm">
                    {sets} séries
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Workouts Section */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {workouts.map(workout => (
                <button
                  key={workout.id}
                  onClick={() => setActiveTab(workout.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === workout.id
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <LayoutList size={16} />
                  {workout.name}
                </button>
              ))}
            </div>

            {/* Workout Details Table */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/5">Grupo Muscular</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-2/5">Exercício</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Séries</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Repetições</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Descanso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {activeWorkout.exercises.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {ex.muscleGroup}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                          {ex.exerciseName}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{ex.sets}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">{ex.reps}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                            <Clock size={14} />
                            {ex.rest}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-200 dark:border-slate-700">
                      <td colSpan={2} className="py-4 px-6 font-bold text-right text-slate-700 dark:text-slate-300">
                        Total de Séries (Neste Treino)
                      </td>
                      <td className="py-4 px-6 text-center font-black text-primary-600 dark:text-primary-400 text-lg">
                        {activeWorkout.exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      <td colSpan={2} className="py-3 px-6 font-bold text-right text-slate-500 dark:text-slate-400 text-sm">
                        Total do Plano (Todos os Treinos)
                      </td>
                      <td className="py-3 px-6 text-center font-bold text-slate-600 dark:text-slate-300">
                        {workouts.reduce((acc, w) => acc + w.exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0), 0)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 max-w-4xl">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>Nota:</strong> O volume total é calculado somando o número de séries por grupo muscular definidos para os exercícios em todo o plano de treino. O tempo de descanso (Descanso) é apresentado na sua unidade predefinida, geralmente em segundos (s) ou minutos (m). Esta visualização é de consulta rápida e não permite edições.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewWorkoutPlanModal;
