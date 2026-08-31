import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Plus, Save, Bell, Trash2, 
  Settings, ChevronRight, Copy, Download, Upload,
  Layers, ChevronDown, Check, GripVertical, Calendar,
  Dumbbell, PlayCircle, MoreVertical, X, Clock, HelpCircle,
  FileText, Activity, ArrowUpFromLine, ArrowDownToLine, RefreshCw, Settings2, ListChecks
} from 'lucide-react';

import { MassEditModal, MassEditChanges } from './MassEditModal';
import { ExerciseSelect } from './ExerciseSelect';
import { CardioAndStretchingConfig } from './CardioAndStretching';

interface WorkoutPlanBuilderProps {
  planData?: any;
  onSave: (plan: any) => void;
  onCancel: () => void;
}

export interface ExerciseRow {
  id: string;
  order: string;
  muscleGroup: string;
  exerciseName: string;
  sets: string;
  reps: string;
  rir: string;
  rest: string;
  instructions: string;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  guidelines: string;
  muscleGroups: string[];
  exercises: ExerciseRow[];
}

interface WeekDay {
  id: string;
  name: string;
  workoutId: string | null; // null means rest day
}

interface Week {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: WeekDay[];
  workouts: Workout[];
}

const MAIN_MUSCLE_GROUPS = [
  'Glúteos', 'Quadríceps', 'Isquiotibiais', 'Gémeos', 'Abdómen', 
  'Costas', 'Peito', 'Ombros', 'Bíceps', 'Tríceps'
];

const DETAILED_MUSCLE_GROUPS = [
  'Quadríceps', 'Isquiotibiais', 'Glúteos', 'Médio deltóide', 'Adutores', 
  'Panturrilhas', 'Costas', 'Trapézio', 'Bíceps', 'Tríceps', 
  'Deltóide posterior', 'Peito', 'Abdómen'
];

const ALL_MUSCLE_GROUPS = Array.from(new Set([...MAIN_MUSCLE_GROUPS, ...DETAILED_MUSCLE_GROUPS])).sort();

const MUSCLE_GROUP_GOALS: Record<string, number> = {
  'Glúteos': 12, 'Quadríceps': 12, 'Isquiotibiais': 10, 'Gémeos': 12, 'Abdómen': 10, 
  'Costas': 14, 'Peito': 12, 'Ombros': 12, 'Bíceps': 10, 'Tríceps': 10,
  'Médio deltóide': 10, 'Adutores': 8, 'Panturrilhas': 12, 
  'Trapézio': 8, 'Deltóide posterior': 8
};

const INITIAL_EXERCISE: ExerciseRow = {
  id: 'e1',
  order: 'A1',
  muscleGroup: 'Glúteos',
  exerciseName: 'Hip Thrust Barra Livre',
  sets: '3',
  reps: '10-12',
  rir: '1-2',
  rest: '90s',
  instructions: 'Foco na contração de pico. Pausa de 1s em cima.'
};

const INITIAL_WORKOUT: Workout = {
  id: 'w1',
  name: 'Treino A',
  type: 'Lower',
  guidelines: 'Focar na progressão de carga nos exercícios compostos. Manter o core sempre contraído.',
  muscleGroups: ['Glúteos', 'Quadríceps', 'Isquiotibiais'],
  exercises: [INITIAL_EXERCISE]
};

const INITIAL_WEEK: Week = {
  id: 'week1',
  name: 'Semana 1',
  startDate: '2026-06-22',
  endDate: '2026-06-28',
  workouts: [INITIAL_WORKOUT],
  days: [
    { id: 'd1', name: 'Segunda', workoutId: 'w1' },
    { id: 'd2', name: 'Terça', workoutId: null },
    { id: 'd3', name: 'Quarta', workoutId: null },
    { id: 'd4', name: 'Quinta', workoutId: null },
    { id: 'd5', name: 'Sexta', workoutId: null },
    { id: 'd6', name: 'Sábado', workoutId: null },
    { id: 'd7', name: 'Domingo', workoutId: null },
  ]
};

const WorkoutPlanBuilder: React.FC<WorkoutPlanBuilderProps> = ({ planData, onSave, onCancel }) => {
  const [isActive, setIsActive] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState<'treino' | 'cardio' | 'alongamentos'>('treino');
  const [planName, setPlanName] = useState(planData?.name || 'Novo Plano de Treino');
  const [startDate, setStartDate] = useState(planData?.startDate || '2026-06-22');
  const [endDate, setEndDate] = useState(planData?.endDate || '2026-08-22');
  const [hasDate, setHasDate] = useState(true);
  const [hasPeriodization, setHasPeriodization] = useState(true);
  
  const [weeks, setWeeks] = useState<Week[]>([INITIAL_WEEK, { ...INITIAL_WEEK, id: 'week2', name: 'Semana 2', startDate: '2026-06-29', endDate: '2026-07-05' }]);
  const [activeWeekId, setActiveWeekId] = useState<string>(INITIAL_WEEK.id);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string>(INITIAL_WORKOUT.id);
  const [isMassEditModalOpen, setIsMassEditModalOpen] = useState(false);
  const [draggedWeekIndex, setDraggedWeekIndex] = useState<number | null>(null);
  const [isAddingMuscleGroup, setIsAddingMuscleGroup] = useState(false);

  const handleWeekDragStart = (index: number) => {
    setDraggedWeekIndex(index);
  };

  const handleWeekDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedWeekIndex === null) return;
    if (draggedWeekIndex === index) return;
    
    const newWeeks = [...weeks];
    const item = newWeeks[draggedWeekIndex];
    newWeeks.splice(draggedWeekIndex, 1);
    newWeeks.splice(index, 0, item);
    
    setDraggedWeekIndex(index);
    setWeeks(newWeeks);
  };

  const handleWeekDragEnd = () => {
    setDraggedWeekIndex(null);
  };

  const [draggedExerciseIndex, setDraggedExerciseIndex] = useState<number | null>(null);

  const handleExerciseDragStart = (index: number) => {
    setDraggedExerciseIndex(index);
  };

  const handleExerciseDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedExerciseIndex === null) return;
    if (draggedExerciseIndex === index) return;
    
    if (!activeWorkoutId) return;

    setWeeks(weeks.map(w => {
      if (w.id === activeWeekId) {
        return {
          ...w,
          workouts: w.workouts.map(wk => {
            if (wk.id === activeWorkoutId) {
              const newExercises = [...wk.exercises];
              const item = newExercises[draggedExerciseIndex];
              newExercises.splice(draggedExerciseIndex, 1);
              newExercises.splice(index, 0, item);
              return { ...wk, exercises: newExercises };
            }
            return wk;
          })
        };
      }
      return w;
    }));
    setDraggedExerciseIndex(index);
  };

  const handleExerciseDragEnd = () => {
    setDraggedExerciseIndex(null);
  };

  const activeWeek = weeks.find(w => w.id === activeWeekId) || weeks[0];
  const activeWorkout = activeWeek.workouts.find(w => w.id === activeWorkoutId);

  const updateActiveWorkout = (updater: (workout: Workout) => Workout) => {
    if (!activeWorkoutId) return;
    setWeeks(weeks.map(w => {
      if (w.id === activeWeekId) {
        return {
          ...w,
          workouts: w.workouts.map(wk => wk.id === activeWorkoutId ? updater(wk) : wk)
        };
      }
      return w;
    }));
  };

  const handleAddExercise = () => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: [...w.exercises, {
        id: Math.random().toString(),
        order: '',
        muscleGroup: '',
        exerciseName: '',
        sets: '',
        reps: '',
        rir: '',
        rest: '',
        instructions: ''
      }]
    }));
  };

  const insertExerciseFixed = (index: number) => {
    updateActiveWorkout(w => {
      const newEx = {
        id: Math.random().toString(),
        order: '',
        muscleGroup: '',
        exerciseName: '',
        sets: '',
        reps: '',
        rir: '',
        rest: '',
        instructions: ''
      };
      const newArray = [...w.exercises];
      newArray.splice(index, 0, newEx);
      return { ...w, exercises: newArray };
    });
  };

  const duplicateExercise = (index: number) => {
     updateActiveWorkout(w => {
      const source = w.exercises[index];
      const newArray = [...w.exercises];
      newArray.splice(index + 1, 0, { ...source, id: Math.random().toString() });
      return { ...w, exercises: newArray };
     });
  };

  const updateExercise = (exerciseId: string, field: keyof ExerciseRow, value: string) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, [field]: value } : e)
    }));
  };

  const removeExercise = (exerciseId: string) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.filter(e => e.id !== exerciseId)
    }));
  };

  // Calculate estimated volume (sets per muscle group) for the active workout
  const getWorkoutVolume = () => {
    const volume: Record<string, number> = {};
    if (!activeWorkout) return volume;
    activeWorkout.exercises.forEach(e => {
      if (e.muscleGroup && e.sets) {
        const setsNum = parseInt(e.sets) || 0;
        volume[e.muscleGroup] = (volume[e.muscleGroup] || 0) + setsNum;
      }
    });
    return volume;
  };

  const getPlanVolume = () => {
    const volume: Record<string, number> = {};
    if (!activeWeek) return volume;
    activeWeek.workouts.forEach(w => {
      w.exercises.forEach(e => {
        if (e.muscleGroup && e.sets) {
          const setsNum = parseInt(e.sets) || 0;
          volume[e.muscleGroup] = (volume[e.muscleGroup] || 0) + setsNum;
        }
      });
    });
    return volume;
  };

  const volumeData = getWorkoutVolume();
  const planVolumeData = getPlanVolume();

  const handleMassEditApply = (selectedIds: string[], changes: MassEditChanges) => {
    updateActiveWorkout(w => {
      return {
        ...w,
        exercises: w.exercises.map(ex => {
          if (!selectedIds.includes(ex.id)) return ex;
          
          let newSets = ex.sets;
          let newReps = ex.reps;
          let newRest = ex.rest;

          if (changes.sets.type === 'set') newSets = changes.sets.value;
          else if (changes.sets.type === 'add') {
             const current = parseInt(ex.sets) || 0;
             const toAdd = parseInt(changes.sets.value) || 0;
             newSets = Math.max(0, current + toAdd).toString();
          }

          if (changes.reps.type === 'set') newReps = changes.reps.value;
          else if (changes.reps.type === 'add') {
             const toAdd = parseInt(changes.reps.value) || 0;
             if (toAdd !== 0 && newReps) {
               newReps = newReps.replace(/\d+/g, (match) => {
                 return Math.max(0, parseInt(match) + toAdd).toString();
               });
             }
          }

          if (changes.rest.type === 'set') newRest = changes.rest.value;
          else if (changes.rest.type === 'add') {
             const current = parseInt(ex.rest) || 0;
             const toAdd = parseInt(changes.rest.value) || 0;
             newRest = Math.max(0, current + toAdd).toString() + (ex.rest.replace(/[0-9\-]/g, '') || '');
          }

          return { ...ex, sets: newSets, reps: newReps, rest: newRest };
        })
      };
    });
  };

  const handleAddWeek = () => {
    const newWeek: Week = {
      ...INITIAL_WEEK,
      id: Math.random().toString(),
      name: `Semana ${weeks.length + 1}`,
      startDate: '',
      endDate: ''
    };
    setWeeks([...weeks, newWeek]);
    setActiveWeekId(newWeek.id);
  };

  const handleDeleteWeek = (weekId: string) => {
    if (weeks.length <= 1) return;
    const newWeeks = weeks.filter(w => w.id !== weekId);
    setWeeks(newWeeks);
    if (activeWeekId === weekId) {
      setActiveWeekId(newWeeks[0].id);
      if (newWeeks[0].workouts.length > 0 && !newWeeks[0].workouts.find(w => w.id === activeWorkoutId)) {
        setActiveWorkoutId(newWeeks[0].workouts[0].id);
      }
    }
  };

  const handleAddWorkout = () => {
    if (!activeWeekId) return;
    
    setWeeks(weeks.map(week => {
      if (week.id === activeWeekId) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const newWorkoutName = `Treino ${letters[week.workouts.length % 26]}`;
        const newWorkout: Workout = {
          ...INITIAL_WORKOUT,
          id: Math.random().toString(),
          name: newWorkoutName
        };
        
        setActiveWorkoutId(newWorkout.id);
        return {
          ...week,
          workouts: [...week.workouts, newWorkout]
        };
      }
      return week;
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden lg:-mx-8 lg:-my-8 bg-slate-100/50 dark:bg-[#0B1120] relative animate-fade-in">
      
      {/* ESTRUTURA SUPERIOR */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 lg:px-6 shadow-sm relative z-30 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-4">
            <button 
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{isActive ? 'Plano Ativo' : 'Plano Inativo'}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors">
              <Download size={16}/> Importar
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors">
              <Upload size={16}/> Criar Base
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => onSave({})} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
              <Save size={16} /> Guardar
            </button>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2">
              <Bell size={16} /> <span className="hidden sm:inline">Guardar & Notificar</span>
            </button>
            <button className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl transition-all flex items-center justify-center">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {/* Info do Plano */}
        <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div className="flex-1 max-w-3xl">
             <input 
               type="text" 
               value={planName}
               onChange={e => setPlanName(e.target.value)}
               className="text-2xl font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full mb-2 placeholder-slate-300 dark:placeholder-slate-700"
               placeholder="Nome do Plano de Treino..."
             />
             <div className="flex flex-wrap items-center gap-3">
               <button 
                 onClick={() => setHasDate(!hasDate)}
                 className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-xl transition-colors ${hasDate ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                 <Calendar size={14} /> {hasDate ? 'Definir Data' : 'Definir Data'}
               </button>
               <button 
                 onClick={() => setHasPeriodization(!hasPeriodization)}
                 className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-xl transition-colors ${hasPeriodization ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                 <Layers size={14} /> {hasPeriodization ? 'Definir Periodização / Cancelar Periodização' : 'Definir Periodização'}
               </button>
             </div>
             
             {hasDate && (
               <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit mt-3">
                  <Calendar size={14} className="text-slate-400"/>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
                  <span className="text-slate-400 text-xs">até</span>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* TABS DE NAVEGAÇÃO INTERNA */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 shadow-sm shrink-0 flex items-center gap-6 z-20 relative">
        <button 
          onClick={() => setActiveMainTab('treino')}
          className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'treino' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Treino
        </button>
        <button 
          onClick={() => setActiveMainTab('cardio')}
          className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'cardio' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Cardio
        </button>
        <button 
          onClick={() => setActiveMainTab('alongamentos')}
          className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'alongamentos' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Alongamentos
        </button>
      </div>

      {/* ÁREA DE CONSTRUÇÃO PRINCIPAL */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="p-4 lg:p-6 pb-20 max-w-7xl mx-auto w-full space-y-8">
             
          {activeMainTab === 'treino' && (
            <>
          
          {/* 1. PERIODIZAÇÃO (Barra Horizontal) */}
          {hasPeriodization && (
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                 <Layers size={16}/> Periodização
               </h3>
             </div>
             
             <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 pt-1 items-stretch">
               {weeks.map((week, index) => (
                 <div 
                   key={week.id}
                   draggable
                   onDragStart={() => handleWeekDragStart(index)}
                   onDragEnter={(e) => handleWeekDragEnter(e, index)}
                   onDragEnd={handleWeekDragEnd}
                   onDragOver={(e) => e.preventDefault()}
                   onClick={() => setActiveWeekId(week.id)}
                   className={`flex-shrink-0 min-w-[240px] p-4 rounded-2xl border cursor-pointer transition-all group relative
                     ${activeWeekId === week.id 
                       ? 'bg-white dark:bg-slate-900 border-primary-500 shadow-md ring-2 ring-primary-500/20' 
                       : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-900'}
                     ${draggedWeekIndex === index ? 'opacity-50 border-dashed' : ''}
                   `}
                 >
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                       <GripVertical size={16} className="text-slate-300 cursor-grab active:cursor-grabbing"/>
                       <input 
                         type="text" 
                         value={week.name} 
                         onChange={() => {}} 
                         className={`font-bold text-base bg-transparent border-none p-0 focus:ring-0 w-32 ${activeWeekId === week.id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                       />
                     </div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteWeek(week.id); }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg"
                     >
                        <Trash2 size={14}/>
                     </button>
                   </div>
                   {hasDate && (
                   <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                     <Calendar size={14} className="text-slate-400"/>
                     <input type="date" value={week.startDate} onChange={() => {}} className="bg-transparent border-none p-0 w-[100px] h-5 focus:ring-0 text-xs"/>
                     <span>até</span>
                     <input type="date" value={week.endDate} onChange={() => {}} className="bg-transparent border-none p-0 w-[100px] h-5 focus:ring-0 text-xs"/>
                   </div>
                   )}
                 </div>
               ))}
               
               <button onClick={handleAddWeek} className="flex-shrink-0 min-w-[200px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-2xl p-4 text-slate-500 font-bold transition-all">
                  <Plus size={24} />
                  <span>Adicionar Semana</span>
               </button>
             </div>
          </div>
          )}

          {activeWeek && (
            <div className="space-y-8 animate-fade-in">
              
              {/* 2. DISTRIBUIÇÃO DE TREINOS & NAVEGAÇÃO */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={16}/> Distribuição de Treinos
                </h3>
                  
                <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                  {activeWeek.days.map(day => {
                    const isRest = !day.workoutId;
                    const dayWorkout = day.workoutId ? activeWeek.workouts.find(w => w.id === day.workoutId) : null;
                      
                    return (
                      <div key={day.id} className={`flex-1 min-w-[100px] rounded-xl p-3 border transition-all cursor-pointer group flex flex-col justify-between h-24
                        ${isRest ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-primary-200 dark:border-primary-900/50 shadow-sm'}
                        hover:border-primary-400 dark:hover:border-primary-600
                      `}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isRest ? 'text-slate-400' : 'text-slate-500'}`}>{day.name}</span>
                          <ChevronDown size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                          
                        <div className="mt-2">
                          {isRest ? (
                            <span className="text-sm font-medium text-slate-400 italic flex items-center gap-1"><Minus size={14} /> Descanso</span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-primary-700 dark:text-primary-400 truncate">{dayWorkout?.name}</span>
                              <span className="text-xs font-semibold text-slate-500 truncate">{dayWorkout?.type}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

              {/* TABS DE TREINOS & CONTEÚDO DO TREINO */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pt-2 px-2">
                  {activeWeek.workouts.map(workout => (
                    <button 
                      key={workout.id}
                      onClick={() => setActiveWorkoutId(workout.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all font-bold text-sm whitespace-nowrap border-t border-l border-r ${
                        activeWorkoutId === workout.id 
                        ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 relative z-10 translate-y-[1px]' 
                        : 'border-transparent bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {workout.name}
                    </button>
                  ))}
                  <button 
                    onClick={handleAddWorkout}
                    className="flex items-center gap-1 px-4 py-2 ml-2 text-sm font-bold text-slate-400 hover:text-primary-600 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                  >
                    <Plus size={16}/> Adicionar
                  </button>
                </div>

                {/* Informações do Treino Atual & Tabela */}
                {activeWorkout && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm relative z-0 flex flex-col gap-6 p-5">
                    
                    {/* Treino Header */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <input 
                          type="text" 
                          value={activeWorkout.name}
                          onChange={(e) => updateActiveWorkout(w => ({...w, name: e.target.value}))}
                          className="text-2xl font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full md:w-[250px]"
                          placeholder="Nome do Treino..."
                        />
                        
                        <div className="flex-1 flex gap-2 w-full">
                           <div className="flex-1 relative">
                              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                              <input 
                                value={activeWorkout.guidelines}
                                onChange={(e) => updateActiveWorkout(w => ({...w, guidelines: e.target.value}))}
                                placeholder="Orientações gerais do treino..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none text-slate-700 dark:text-slate-200"
                              />
                           </div>
                           <button className="p-2.5 flex items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors border border-slate-200 dark:border-slate-700 rounded-xl shrink-0" title="Eliminar Treino">
                             <Trash2 size={16}/>
                           </button>
                        </div>
                      </div>
                    </div>

                    {/* 4. TABELA DE EXERCÍCIOS */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                       <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                         <Dumbbell size={16}/> Exercícios do Treino
                       </h3>
                       <div className="flex items-center gap-2">
                         <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                           <Settings2 size={14}/> Configurações
                         </button>
                         <button onClick={() => setIsMassEditModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                           <ListChecks size={14}/> Edição em Massa
                         </button>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="px-2 py-3 w-8 text-center"></th>
                            <th className="px-2 py-3 w-16">Ordem</th>
                            <th className="px-2 py-3 w-32">Grupo Muscular</th>
                            <th className="px-2 py-3 min-w-[200px]">Exercício</th>
                            <th className="px-2 py-3 w-20 text-center">Séries</th>
                            <th className="px-2 py-3 w-24 text-center">Reps</th>
                            <th className="px-2 py-3 w-16 text-center">RIR</th>
                            <th className="px-2 py-3 w-20 text-center">Descanso</th>
                            <th className="px-2 py-3 min-w-[200px]">Instruções</th>
                            <th className="px-2 py-3 w-[120px] text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {activeWorkout.exercises.map((exercise, idx) => (
                            <tr 
                              key={exercise.id} 
                              draggable
                              onDragStart={() => handleExerciseDragStart(idx)}
                              onDragEnter={(e) => handleExerciseDragEnter(e, idx)}
                              onDragEnd={handleExerciseDragEnd}
                              onDragOver={(e) => e.preventDefault()}
                              className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors bg-white dark:bg-transparent ${draggedExerciseIndex === idx ? 'opacity-50' : ''}`}
                            >
                              <td className="px-1 py-3 text-center">
                                <GripVertical size={16} className="text-slate-300 dark:text-slate-600 cursor-grab mx-auto hover:text-slate-500" />
                              </td>
                              <td className="px-2 py-3">
                                <input 
                                  value={exercise.order} 
                                  onChange={(e) => updateExercise(exercise.id, 'order', e.target.value)}
                                  className="w-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-black text-slate-700 dark:text-slate-200 outline-none"
                                  placeholder="A1"
                                />
                              </td>
                              <td className="px-2 py-3">
                                <select 
                                  value={exercise.muscleGroup}
                                  onChange={(e) => updateExercise(exercise.id, 'muscleGroup', e.target.value)}
                                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-sm w-full outline-none text-slate-700 dark:text-slate-300 p-1.5 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Selec...</option>
                                  {ALL_MUSCLE_GROUPS.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                                </select>
                              </td>
                              <td className="px-2 py-3 min-w-[200px] whitespace-normal">
                                <ExerciseSelect 
                                  value={exercise.exerciseName}
                                  onChange={(val, muscleGroup) => {
                                    updateExercise(exercise.id, 'exerciseName', val);
                                    if (muscleGroup) {
                                      if (!exercise.muscleGroup) {
                                        updateExercise(exercise.id, 'muscleGroup', muscleGroup);
                                      }
                                      if (!activeWorkout.muscleGroups.includes(muscleGroup)) {
                                        updateActiveWorkout(w => ({ ...w, muscleGroups: [...w.muscleGroups, muscleGroup] }));
                                      }
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-2 py-3 text-center">
                                <input 
                                  value={exercise.sets} 
                                  onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                                  className="w-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-bold text-slate-700 dark:text-slate-200 outline-none"
                                  placeholder="3"
                                />
                              </td>
                              <td className="px-2 py-3 text-center">
                                <input 
                                  value={exercise.reps} 
                                  onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                                  className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-bold text-slate-700 dark:text-slate-200 outline-none"
                                  placeholder="10-12"
                                />
                              </td>
                              <td className="px-2 py-3 text-center">
                                <input 
                                  value={exercise.rir} 
                                  onChange={(e) => updateExercise(exercise.id, 'rir', e.target.value)}
                                  className="w-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-medium text-slate-600 dark:text-slate-300 outline-none"
                                  placeholder="1-2"
                                />
                              </td>
                              <td className="px-2 py-3 text-center">
                                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 w-[65px] mx-auto focus-within:border-primary-500">
                                  <Clock size={12} className="text-slate-400 shrink-0"/>
                                  <input 
                                    value={exercise.rest} 
                                    onChange={(e) => updateExercise(exercise.id, 'rest', e.target.value)}
                                    className="bg-transparent border-none flex-1 text-center font-medium text-slate-600 dark:text-slate-300 outline-none p-0 focus:ring-0 text-sm w-full"
                                    placeholder="90s"
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-3 min-w-[200px] whitespace-normal">
                                <textarea 
                                  value={exercise.instructions}
                                  onChange={(e) => updateExercise(exercise.id, 'instructions', e.target.value)}
                                  placeholder="Adicionar notas..."
                                  className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-[34px] overflow-hidden transition-colors"
                                />
                              </td>
                              <td className="px-2 py-3 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => insertExerciseFixed(idx + 1)} className="p-1.5 text-slate-500 hover:text-primary-600 bg-slate-50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded transition-colors" title="Inserir Abaixo">
                                    <ArrowDownToLine size={14}/>
                                  </button>
                                  <button className="p-1.5 text-slate-500 hover:text-primary-600 bg-slate-50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded transition-colors" title="Substituir Exercício">
                                    <RefreshCw size={14}/>
                                  </button>
                                  <button onClick={() => duplicateExercise(idx)} className="p-1.5 text-slate-500 hover:text-primary-600 bg-slate-50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded transition-colors" title="Duplicar">
                                    <Copy size={14}/>
                                  </button>
                                  <button onClick={() => removeExercise(exercise.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800/50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 rounded transition-colors" title="Eliminar">
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Add Exercise Action */}
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 mt-2">
                      <button 
                        onClick={handleAddExercise}
                        className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all shadow-sm"
                      >
                        <Plus size={18}/> Adicionar Novo Exercício ao Treino
                      </button>
                    </div>
                  </div>
                  
                  {/* 5. VOLUME ESTIMADO */}
                  <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity size={12}/> Volume do Treino
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        {MAIN_MUSCLE_GROUPS.map((mg, i) => {
                          const sets = volumeData[mg] || 0;
                          const goal = MUSCLE_GROUP_GOALS[mg] || 10;
                          const hasVolume = sets > 0;
                          
                          return (
                            <div key={`main-${mg}`} className={`flex items-center gap-1 whitespace-nowrap ${hasVolume ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                               <span className="font-medium">{mg}</span>
                               <span className={`font-bold ${hasVolume ? 'text-primary-600 dark:text-primary-400' : ''}`}>{sets}</span>
                               <span className="opacity-60">({goal})</span>
                               {i < MAIN_MUSCLE_GROUPS.length - 1 && <span className="opacity-30 mx-1.5">•</span>}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mr-2">Volume Total:</span>
                        {DETAILED_MUSCLE_GROUPS.map((mg, i) => {
                          const sets = planVolumeData[mg] || 0;
                          const goal = MUSCLE_GROUP_GOALS[mg] || 10;
                          const hasVolume = sets > 0;
                          
                          return (
                            <div key={`det-${mg}`} className={`flex items-center gap-1 whitespace-nowrap ${hasVolume ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                               <span className="font-medium">{mg}</span>
                               <span className={`font-bold ${hasVolume ? 'text-primary-600 dark:text-primary-400' : ''}`}>{sets}</span>
                               <span className="opacity-60">({goal})</span>
                               {i < DETAILED_MUSCLE_GROUPS.length - 1 && <span className="opacity-30 mx-1.5">•</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              )}
              </div>
            </div>
          )}

            </>
          )}

          {activeMainTab === 'cardio' && (
            <CardioAndStretchingConfig type="cardio" hideTabs={true} />
          )}

          {activeMainTab === 'alongamentos' && (
            <CardioAndStretchingConfig type="alongamentos" hideTabs={true} />
          )}

        </div>
      </div>
      
      {activeWorkout && (
        <MassEditModal 
          isOpen={isMassEditModalOpen}
          onClose={() => setIsMassEditModalOpen(false)}
          exercises={activeWorkout.exercises}
          onApply={handleMassEditApply}
        />
      )}
    </div>
  );
};

// Mock Minus icon directly since it wasn't imported from lucide-react in earlier versions
const Minus = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14"></path>
  </svg>
);

export default WorkoutPlanBuilder;
// Missing import Activity, oh right, I didn't import it in this file. I'll add it in the next update or just edit it now.
