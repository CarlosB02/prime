import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Plus, Save, Bell, Trash2, 
  Settings, ChevronRight, Copy, Download, Upload,
  Layers, ChevronDown, Check, GripVertical,
  Dumbbell, PlayCircle, MoreVertical, X, Clock, HelpCircle,
  FileText, Activity, ArrowUpFromLine, ArrowDownToLine, RefreshCw, Settings2, ListChecks, Tags, AlignLeft, Link
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { CustomTargetIcon, CustomDumbbellIcon } from '../icons';

import { MassEditModal, MassEditChanges } from './MassEditModal';
import { ExerciseSelect } from './ExerciseSelect';
import { CardioAndStretchingConfig } from './CardioAndStretching';
import { SetTypesDropdown } from './SetTypesDropdown';
import { RepsPerSetDropdown } from './RepsPerSetDropdown';
import { CargaPerSetDropdown, RirPerSetDropdown, RestPerSetDropdown } from './PerSetSlotDropdown';
import { getRegisteredTechniques, ExerciseTechnique } from '../../lib/techniques';

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
  target?: string;
  carga?: string;
  setTypes?: Record<number, string>;
  repsPerSet?: Record<number, string>;
  cargaPerSet?: Record<number, string>;
  rirPerSet?: Record<number, string>;
  restPerSet?: Record<number, string>;
  repsUnit?: string;
  isSuperSet?: boolean;
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

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "--/--/----";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const calculateEndDate = (startDateStr: string, days = 7): string => {
  if (!startDateStr) return '';
  const parts = startDateStr.split('-');
  if (parts.length !== 3) return '';
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculatePlanDuration = (startDateStr: string, endDateStr: string): string => {
  if (!startDateStr || !endDateStr) return '';
  const startParts = startDateStr.split('-').map(Number);
  const endParts = endDateStr.split('-').map(Number);
  if (startParts.length !== 3 || endParts.length !== 3) return '';

  const dStart = new Date(startParts[0], startParts[1] - 1, startParts[2]);
  const dEnd = new Date(endParts[0], endParts[1] - 1, endParts[2]);
  const diffTime = dEnd.getTime() - dStart.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return '';

  const weeks = Math.floor(diffDays / 7);
  const remDays = diffDays % 7;

  if (weeks > 0 && remDays === 0) {
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} / ${diffDays} dias`;
  }
  if (weeks > 0 && remDays > 0) {
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} e ${remDays} ${remDays === 1 ? 'dia' : 'dias'} / ${diffDays} dias`;
  }
  return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
};

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
  rirPerSet: { 1: '1-2', 2: '1-2', 3: '1-2' },
  rest: '90s',
  instructions: 'Foco na contração de pico. Pausa de 1s em cima.',
  target: '',
  carga: ''
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
  
  const initialStartDate = planData?.startDate || new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(planData?.endDate || calculateEndDate(initialStartDate, 7));
  const [hasDate, setHasDate] = useState(false);
  const [hasPeriodization, setHasPeriodization] = useState(false);
  
  const [weeks, setWeeks] = useState<Week[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const w1End = calculateEndDate(today, 7);
    const w2End = calculateEndDate(w1End, 7);
    return [
      { ...INITIAL_WEEK, startDate: today, endDate: w1End },
      { ...INITIAL_WEEK, id: 'week2', name: 'Semana 2', startDate: w1End, endDate: w2End }
    ];
  });
  const [activeWeekId, setActiveWeekId] = useState<string>(INITIAL_WEEK.id);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string>(INITIAL_WORKOUT.id);
  const [isMassEditModalOpen, setIsMassEditModalOpen] = useState(false);
  const [draggedWeekIndex, setDraggedWeekIndex] = useState<number | null>(null);
  const [isAddingMuscleGroup, setIsAddingMuscleGroup] = useState(false);
  const [targetModal, setTargetModal] = useState<{isOpen: boolean; exerciseId: string | null; target: string}>({isOpen: false, exerciseId: null, target: ''});
  const [isTableSettingsModalOpen, setIsTableSettingsModalOpen] = useState(false);
  const [tableSettings, setTableSettings] = useState({
    showRir: true,
    showLoad: false,
    showRest: true,
  });

  const [registeredTechniques, setRegisteredTechniques] = useState<ExerciseTechnique[]>(() => getRegisteredTechniques());

  useEffect(() => {
    const handleUpdate = () => {
      setRegisteredTechniques(getRegisteredTechniques());
    };
    window.addEventListener('pr1me_techniques_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pr1me_techniques_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Sincronizar data de término principal com o fim da última semana adicionada
  useEffect(() => {
    if (weeks.length > 0) {
      const lastWeekEndDate = weeks[weeks.length - 1].endDate;
      if (lastWeekEndDate && lastWeekEndDate !== endDate) {
        setEndDate(lastWeekEndDate);
      }
    }
  }, [weeks]);

const handleSaveSetTypes = (exerciseId: string, setTypes: Record<number, string>) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, setTypes } : e)
    }));
  };

  const handleSaveRepsPerSet = (exerciseId: string, repsPerSet: Record<number, string>, repsUnit?: string) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => {
        if (e.id === exerciseId) {
          return {
            ...e,
            repsPerSet,
            ...(repsUnit ? { repsUnit } : {})
          };
        }
        return e;
      })
    }));
  };

  const handleSaveCargaPerSet = (exerciseId: string, cargaPerSet: Record<number, string>) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, cargaPerSet } : e)
    }));
  };

  const handleSaveRirPerSet = (exerciseId: string, rirPerSet: Record<number, string>) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, rirPerSet } : e)
    }));
  };

  const handleSaveRestPerSet = (exerciseId: string, restPerSet: Record<number, string>) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, restPerSet } : e)
    }));
  };

  const handleWeekDragStart = (index: number) => {
    setDraggedWeekIndex(index);
  };

  const handleWeekDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedWeekIndex === null) return;
    if (draggedWeekIndex === index) return;
    
    let newWeeks = [...weeks];
    const item = newWeeks[draggedWeekIndex];
    newWeeks.splice(draggedWeekIndex, 1);
    newWeeks.splice(index, 0, item);
    
    // Re-index names
    newWeeks = newWeeks.map((w, i) => ({
      ...w,
      name: `Semana ${i + 1}`
    }));
    
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
    updateActiveWorkout(w => {
      let nextOrder = `A${w.exercises.length + 1}`;
      if (w.exercises.length > 0) {
        const lastOrder = w.exercises[w.exercises.length - 1].order;
        const match = lastOrder.match(/^([a-zA-Z]+)(\d+)$/);
        if (match) {
          nextOrder = `${match[1].toUpperCase()}${parseInt(match[2], 10) + 1}`;
        }
      }
      return {
        ...w,
        exercises: [...w.exercises, {
          id: Math.random().toString(),
          order: nextOrder,
          muscleGroup: '',
          exerciseName: '',
          sets: '',
          reps: '',
          rir: '',
          rest: '',
          instructions: '',
          target: ''
        }]
      };
    });
  };

  const insertExerciseFixed = (index: number) => {
    updateActiveWorkout(w => {
      let nextOrder = `A${index + 1}`;
      if (index > 0 && index <= w.exercises.length) {
        const prevOrder = w.exercises[index - 1].order;
        const match = prevOrder.match(/^([a-zA-Z]+)(\d+)$/);
        if (match) {
          nextOrder = `${match[1].toUpperCase()}${parseInt(match[2], 10) + 1}`;
        }
      }
      const newEx = {
        id: Math.random().toString(),
        order: nextOrder,
        muscleGroup: '',
        exerciseName: '',
        sets: '',
        reps: '',
        rir: '',
        rest: '',
        instructions: '',
        target: ''
      };
      const newArray = [...w.exercises];
      newArray.splice(index, 0, newEx);
      return { ...w, exercises: newArray };
    });
  };

  const addSuperSetExercise = (index: number) => {
    updateActiveWorkout(w => {
      let nextOrder = `A${index + 2}`;
      if (index >= 0 && index < w.exercises.length) {
        const prevOrder = w.exercises[index].order;
        const match = prevOrder.match(/^([a-zA-Z]+)(\d+)$/);
        if (match) {
          nextOrder = `${match[1].toUpperCase()}${parseInt(match[2], 10) + 1}`;
        }
      }
      const newEx = {
        id: Math.random().toString(),
        order: nextOrder,
        muscleGroup: '',
        exerciseName: '',
        sets: '',
        reps: '',
        rir: '',
        rest: '',
        instructions: '',
        target: '',
        isSuperSet: true
      };
      const newArray = [...w.exercises];
      newArray.splice(index + 1, 0, newEx);
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

  const updateExercise = (exerciseId: string, field: keyof ExerciseRow, value: any) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.map(e => {
        if (e.id !== exerciseId) return e;

        if (field === 'rir') {
          const numSets = parseInt(e.sets, 10) || 0;
          const newRirPerSet: Record<number, string> = {};
          if (value !== undefined && String(value).trim() !== '') {
            const count = Math.max(numSets, 12);
            for (let i = 1; i <= count; i++) {
              newRirPerSet[i] = String(value);
            }
          }
          return {
            ...e,
            rir: value,
            rirPerSet: newRirPerSet
          };
        }

        if (field === 'sets') {
          const numSets = parseInt(value, 10) || 0;
          if (e.rir && numSets > 0) {
            const newRirPerSet: Record<number, string> = {};
            for (let i = 1; i <= numSets; i++) {
              newRirPerSet[i] = e.rirPerSet?.[i] || e.rir;
            }
            return {
              ...e,
              sets: value,
              rirPerSet: newRirPerSet
            };
          }
        }

        return { ...e, [field]: value };
      })
    }));
  };

  const removeExercise = (exerciseId: string) => {
    updateActiveWorkout(w => ({
      ...w,
      exercises: w.exercises.filter(e => e.id !== exerciseId)
    }));
  };

  // Helper to calculate volume contribution for an exercise in the context of its workout
  const getExerciseVolume = (
    exercise: ExerciseRow,
    allExercisesInWorkout: ExerciseRow[],
    index: number
  ): number => {
    if (!exercise.sets) return 0;
    const numSets = parseInt(exercise.sets, 10) || 0;
    if (numSets <= 0) return 0;

    // Create lookup map for registered techniques (lowercase)
    const techMap = new Map<string, number>();
    registeredTechniques.forEach(t => {
      if (t.name) techMap.set(t.name.trim().toLowerCase(), Number(t.defaultVolume) || 1);
      if (t.acronym) techMap.set(t.acronym.trim().toLowerCase(), Number(t.defaultVolume) || 1);
    });

    // Check if this exercise is part of a superset / bi-set pair:
    // It is a bi-set if:
    // 1) exercise.isSuperSet is true
    // 2) or the next exercise in the list has isSuperSet === true (meaning this is the first exercise of the bi-set pair)
    const isPairedBiSet = exercise.isSuperSet || (index >= 0 && index < allExercisesInWorkout.length - 1 && allExercisesInWorkout[index + 1]?.isSuperSet);

    // Look up default volume for Bi-Set from registered techniques (defaults to 2)
    const biSetDefaultVolume = techMap.get('bi-set') ?? techMap.get('biset') ?? techMap.get('bs') ?? 2;

    let totalVolume = 0;
    const setTypes = exercise.setTypes || {};

    for (let setIdx = 1; setIdx <= numSets; setIdx++) {
      const typeStr = setTypes[setIdx]?.trim().toLowerCase();
      if (typeStr) {
        if (techMap.has(typeStr)) {
          totalVolume += techMap.get(typeStr)!;
        } else if (
          typeStr.includes('bi-set') || 
          typeStr.includes('biset') || 
          typeStr.includes('bi set') || 
          typeStr.includes('super-set') || 
          typeStr.includes('superset')
        ) {
          totalVolume += biSetDefaultVolume;
        } else {
          totalVolume += 1;
        }
      } else if (isPairedBiSet) {
        // No explicit set technique chosen, but exercise is marked/linked as Bi-Set / Super-Set
        totalVolume += biSetDefaultVolume;
      } else {
        totalVolume += 1;
      }
    }

    return totalVolume;
  };

  // Calculate estimated volume (sets per muscle group) for the active workout
  const getWorkoutVolume = () => {
    const volume: Record<string, number> = {};
    if (!activeWorkout) return volume;
    activeWorkout.exercises.forEach((e, idx) => {
      if (e.muscleGroup && e.sets) {
        const exerciseVol = getExerciseVolume(e, activeWorkout.exercises, idx);
        volume[e.muscleGroup] = (volume[e.muscleGroup] || 0) + exerciseVol;
      }
    });
    return volume;
  };

  const getPlanVolume = () => {
    const volume: Record<string, number> = {};
    if (!activeWeek) return volume;
    activeWeek.workouts.forEach(w => {
      w.exercises.forEach((e, idx) => {
        if (e.muscleGroup && e.sets) {
          const exerciseVol = getExerciseVolume(e, w.exercises, idx);
          volume[e.muscleGroup] = (volume[e.muscleGroup] || 0) + exerciseVol;
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

  const handleWeekSelect = (weekId: string, customWeeksList?: Week[]) => {
    setActiveWeekId(weekId);
    const listToSearch = customWeeksList || weeks;
    const selectedWeek = listToSearch.find(w => w.id === weekId);
    if (selectedWeek && selectedWeek.workouts.length > 0) {
      if (!selectedWeek.workouts.find(w => w.id === activeWorkoutId)) {
        setActiveWorkoutId(selectedWeek.workouts[0].id);
      }
    }
  };

  const updateWeek = (weekId: string, field: keyof Week, value: any) => {
    setWeeks(weeks.map(w => w.id === weekId ? { ...w, [field]: value } : w));
  };

  const handleWeekStartDateChange = (weekId: string, newStartDate: string) => {
    const weekIdx = weeks.findIndex(w => w.id === weekId);
    if (weekIdx === -1) return;
    const newWeeks = [...weeks];
    let currStart = newStartDate;
    for (let i = weekIdx; i < newWeeks.length; i++) {
      const currEnd = calculateEndDate(currStart, 7);
      newWeeks[i] = {
        ...newWeeks[i],
        startDate: currStart,
        endDate: currEnd
      };
      currStart = currEnd;
    }
    if (weekIdx === 0) {
      setStartDate(newStartDate);
      setEndDate(calculateEndDate(newStartDate, 7));
    }
    setWeeks(newWeeks);
  };

  const recalculateWeekDates = (baseStartDate: string, currentWeeks: Week[]) => {
    if (!baseStartDate) return currentWeeks;
    
    let currentDateStr = baseStartDate;
    return currentWeeks.map((week) => {
      const weekStart = currentDateStr;
      const weekEnd = calculateEndDate(weekStart, 7);
      
      const newWeek = {
        ...week,
        startDate: weekStart,
        endDate: weekEnd
      };
      
      currentDateStr = weekEnd;
      return newWeek;
    });
  };

  const handleTogglePeriodization = () => {
    const nextState = !hasPeriodization;
    setHasPeriodization(nextState);
    if (nextState) {
      setHasDate(true);
      const recalculated = recalculateWeekDates(startDate, weeks);
      setWeeks(recalculated);
      if (recalculated.length > 0) {
        setEndDate(recalculated[recalculated.length - 1].endDate);
      }
    } else {
      setEndDate(calculateEndDate(startDate, 7));
    }
  };

  const handleStartDateChange = (newDate: string) => {
    setStartDate(newDate || '');
    if (hasPeriodization) {
      const recalculated = recalculateWeekDates(newDate, weeks);
      setWeeks(recalculated);
      if (recalculated.length > 0) {
        setEndDate(recalculated[recalculated.length - 1].endDate);
      }
    } else {
      setEndDate(calculateEndDate(newDate, 7));
    }
  };

  const handleAddWeek = () => {
    const lastWeek = weeks[weeks.length - 1];
    const nextStart = lastWeek?.endDate || startDate || new Date().toISOString().split('T')[0];
    const nextEnd = calculateEndDate(nextStart, 7);

    const newWeek: Week = {
      ...INITIAL_WEEK,
      id: Math.random().toString(),
      name:`Semana ${weeks.length + 1}`,
      startDate: nextStart,
      endDate: nextEnd,
      workouts: [{ id: Math.random().toString(), name: 'Treino A', exercises: [] }]
    };
    let newWeeksList = [...weeks, newWeek];
    if (hasPeriodization && hasDate && startDate) {
      newWeeksList = recalculateWeekDates(startDate, newWeeksList);
    }
    setWeeks(newWeeksList);
    handleWeekSelect(newWeek.id, newWeeksList);
  };

  const handleDuplicateWeek = () => {
    const activeWeek = weeks.find(w => w.id === activeWeekId);
    if (!activeWeek) return;
    
    const lastWeek = weeks[weeks.length - 1];
    const nextStart = lastWeek?.endDate || activeWeek.endDate || startDate || new Date().toISOString().split('T')[0];
    const nextEnd = calculateEndDate(nextStart, 7);

    // Deep copy workouts with new IDs
    const newWorkouts = activeWeek.workouts.map(w => ({
      ...w,
      id: Math.random().toString(),
      exercises: w.exercises.map(e => ({ ...e, id: Math.random().toString() }))
    }));

    // Map old workout IDs to new workout IDs for the days
    const workoutIdMap = activeWeek.workouts.reduce((acc, w, idx) => {
      acc[w.id] = newWorkouts[idx].id;
      return acc;
    }, {} as Record<string, string>);

    const newDays = activeWeek.days.map(d => ({
      ...d,
      workoutId: d.workoutId ? workoutIdMap[d.workoutId] : null
    }));

    const newWeek: Week = {
      ...activeWeek,
      id: Math.random().toString(),
      name: `Semana ${weeks.length + 1}`,
      startDate: nextStart,
      endDate: nextEnd,
      workouts: newWorkouts,
      days: newDays
    };

    let newWeeksList = [...weeks, newWeek];
    if (hasPeriodization && hasDate && startDate) {
      newWeeksList = recalculateWeekDates(startDate, newWeeksList);
    }
    setWeeks(newWeeksList);
    handleWeekSelect(newWeek.id, newWeeksList);
  };

  const handleDeleteWeek = (weekId: string) => {
    if (weeks.length <= 1) return;
    let newWeeks = weeks.filter(w => w.id !== weekId);
    
    // Re-index names
    newWeeks = newWeeks.map((w, i) => ({
      ...w,
      name: `Semana ${i + 1}`
    }));
    
    if (hasPeriodization && hasDate && startDate) {
      newWeeks = recalculateWeekDates(startDate, newWeeks);
    }
    
    setWeeks(newWeeks);
    if (activeWeekId === weekId) {
      handleWeekSelect(newWeeks[0].id, newWeeks);
    }
  };

  const handleAddWorkout = () => {
    if (!activeWeekId) return;
    
    setWeeks(weeks.map(week => {
      if (week.id === activeWeekId) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const newWorkoutName =`Treino ${letters[week.workouts.length % 26]}`;
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

  const handleRemoveWorkout = (workoutId: string) => {
    if (!activeWeekId) return;

    setWeeks(weeks.map(week => {
      if (week.id === activeWeekId) {
        if (week.workouts.length <= 1) return week; // Always keep at least 1 workout

        const updatedWorkouts = week.workouts.filter(w => w.id !== workoutId);
        if (activeWorkoutId === workoutId) {
          setActiveWorkoutId(updatedWorkouts[0].id);
        }
        
        const updatedDays = week.days.map(day => 
          day.workoutId === workoutId ? { ...day, workoutId: null } : day
        );

        return {
          ...week,
          workouts: updatedWorkouts,
          days: updatedDays
        };
      }
      return week;
    }));
  };

  const updateDayWorkout = (dayId: string, workoutId: string | null) => {
    if (!activeWeekId) return;
    
    setWeeks(weeks.map(week => {
      if (week.id === activeWeekId) {
        return {
          ...week,
          days: week.days.map(day => 
            day.id === dayId ? { ...day, workoutId } : day
          )
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
               value={planName || ''}
               onChange={e => setPlanName(e.target.value)}
               className="text-2xl font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full mb-2 placeholder-slate-300 dark:placeholder-slate-700"
               placeholder="Nome do Plano de Treino..."
             />
             <div className="flex flex-wrap items-center gap-3">
               <button 
                 onClick={() => setHasDate(!hasDate)}
                 className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-xl transition-colors ${hasDate ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                 <CustomCalendarIcon size={14} /> {hasDate ? 'Remover Data' : 'Definir Data'}
               </button>
               <button 
                 onClick={handleTogglePeriodization}
                 className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-xl transition-colors ${hasPeriodization ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                 <Layers size={14} /> {hasPeriodization ? 'Remover Periodização' : 'Definir Periodização'}
               </button>
             </div>
             
             {hasDate && (
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit mt-2.5 text-xs">
                  <div className="relative inline-flex items-center cursor-pointer group">
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {formatDate(startDate)}
                    </span>
                    <input 
                      type="date" 
                      value={startDate || ''} 
                      onChange={e => handleStartDateChange(e.target.value)} 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Clique para alterar a data de início"
                    />
                  </div>

                  <span className="text-slate-400 font-medium text-xs">até</span>

                  <span 
                    className="font-semibold text-sm text-slate-500 dark:text-slate-400 select-none"
                    title="Data de término da última semana adicionada"
                  >
                    {formatDate(weeks.length > 0 ? weeks[weeks.length - 1].endDate : endDate)}
                  </span>

                  {(() => {
                    const currentEnd = weeks.length > 0 ? weeks[weeks.length - 1].endDate : endDate;
                    const durationStr = calculatePlanDuration(startDate, currentEnd);
                    if (!durationStr) return null;
                    return (
                      <span 
                        className="ml-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded-md border border-primary-100 dark:border-primary-900/40 select-none whitespace-nowrap"
                        title="Duração total do plano de treino"
                      >
                        ({durationStr})
                      </span>
                    );
                  })()}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* TABS DE NAVEGAÇÃO INTERNA */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 shadow-sm shrink-0 flex items-center gap-6 z-20 relative">
        <button 
          onClick={() => setActiveMainTab('alongamentos')}
          className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'alongamentos' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Alongamentos
        </button>
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
      </div>

      {/* ÁREA DE CONSTRUÇÃO PRINCIPAL */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="p-4 lg:p-6 pb-20 w-full space-y-8">
             
          {activeMainTab === 'treino' && (
            <>
          
          {/* 1. PERIODIZAÇÃO (Barra Horizontal) */}
          {hasPeriodization && (
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                 Periodização
               </h3>
             </div>
             
             <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-2 pt-1 items-center">
               {weeks.map((week, index) => (
                 <div 
                   key={week.id}
                   draggable
                   onDragStart={() => handleWeekDragStart(index)}
                   onDragEnter={(e) => handleWeekDragEnter(e, index)}
                   onDragEnd={handleWeekDragEnd}
                   onDragOver={(e) => e.preventDefault()}
                   onClick={() => handleWeekSelect(week.id)}
                   className={`flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border cursor-pointer transition-all group relative
                     ${activeWeekId === week.id 
                       ? "bg-white dark:bg-slate-900 border-primary-500 shadow-sm ring-2 ring-primary-500/20" 
                       : "bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"}
                     ${draggedWeekIndex === index ? "opacity-50 border-dashed" : ""}`}
                 >
                   <GripVertical size={14} className="text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing shrink-0"/>
                   
                   {/* Título: "Semana 1 de 2" compacto, sem bloco de texto enorme */}
                   <div className="flex items-center shrink-0">
                     <input 
                       type="text" 
                       value={week.name || ''} 
                       onChange={(e) => updateWeek(week.id, "name", e.target.value)} 
                       style={{ width: `${Math.max(58, (week.name?.length || 8) * 7.5)}px` }}
                       className={`font-bold text-xs sm:text-sm bg-transparent border-none p-0 focus:ring-0 outline-none ${activeWeekId === week.id ? "text-primary-700 dark:text-primary-400" : "text-slate-700 dark:text-slate-300"}`}
                     />
                     {week.name.startsWith("Semana") && (
                       <span className="text-xs font-semibold text-slate-400 ml-0.5 whitespace-nowrap select-none">
                         de {weeks.length}
                       </span>
                     )}
                   </div>
                   
                   {/* Datas à frente do título na mesma linha para reduzir altura: (icon, data, até, data) sem espaços vazios */}
                   <div className="flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800 shrink-0">
                     <div className="relative inline-flex items-center cursor-pointer group">
                       <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                         {formatDate(week.startDate)}
                       </span>
                       <input 
                         type="date" 
                         value={week.startDate || ''} 
                         onChange={(e) => handleWeekStartDateChange(week.id, e.target.value)} 
                         className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                         title="Clique para alterar a data de início"
                       />
                     </div>

                     <span className="text-slate-400 text-[11px] font-medium shrink-0">até</span>

                     <span 
                       className="font-semibold text-slate-500 dark:text-slate-400 select-none"
                       title="Data de término calculada automaticamente (+7 dias)"
                     >
                       {formatDate(week.endDate)}
                     </span>
                   </div>

                   <button 
                     onClick={(e) => { e.stopPropagation(); handleDeleteWeek(week.id); }}
                     className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-800 p-1 rounded-md shrink-0"
                     title="Eliminar semana"
                   >
                     <Trash2 size={13}/>
                   </button>
                 </div>
               ))}
               
               <div className="flex items-center gap-2 flex-shrink-0">
                 <button onClick={handleAddWeek} className="flex items-center justify-center gap-1.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl px-3 py-1.5 text-slate-500 text-xs font-bold transition-all h-[36px] shrink-0" title="Adicionar Semana">
                    <Plus size={14} />
                    <span>Adicionar Semana</span>
                 </button>
                 <button onClick={handleDuplicateWeek} className="flex items-center justify-center gap-1.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl px-3 py-1.5 text-slate-500 text-xs font-bold transition-all h-[36px] shrink-0" title="Duplicar Semana Atual">
                    <Copy size={14} />
                    <span>Duplicar Atual</span>
                 </button>
               </div>
             </div>
          </div>
          )}

          {activeWeek && (
            <div className="space-y-8 animate-fade-in">
              
              {/* 2. DISTRIBUIÇÃO DE TREINOS & NAVEGAÇÃO */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                  Distribuição de Treinos
                </h3>
                  
                <div className="flex gap-3 flex-wrap pb-2">
                  {activeWeek.days.map(day => {
                    const isRest = !day.workoutId;
                    const dayWorkout = day.workoutId ? activeWeek.workouts.find(w => w.id === day.workoutId) : null;
                      
                    return (
                      <div key={day.id} className={`flex-1 min-w-[100px] rounded-xl px-3 py-2 border transition-all cursor-pointer group flex flex-col relative
                        ${isRest ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-primary-200 dark:border-primary-900/50 shadow-sm'}
                        hover:border-primary-400 dark:hover:border-primary-600`}>
                        <select
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-slate-900 dark:text-white"
                          value={day.workoutId || ''}
                          onChange={(e) => updateDayWorkout(day.id, e.target.value || null)}
                        >
                          <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Descanso</option>
                          {activeWeek.workouts.map(w => (
                            <option key={w.id} value={w.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{w.name}</option>
                          ))}
                        </select>
                        <div className="flex items-center justify-between pointer-events-none">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isRest ? 'text-slate-400' : 'text-slate-500'}`}>{day.name}</span>
                          <ChevronDown size={14} className="text-slate-400" />
                        </div>
                        
                        <div className="mt-0.5 pointer-events-none">
                          {isRest ? (
                            <span className="text-sm font-medium text-slate-400 italic flex items-center gap-1"><Minus size={14} /> Descanso</span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-primary-700 dark:text-primary-400 truncate">{dayWorkout?.name}</span>
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
                <div className="flex items-center gap-1 flex-wrap pt-2 px-2">
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
                          value={activeWorkout?.name || ''}
                          onChange={(e) => updateActiveWorkout(w => ({...w, name: e.target.value}))}
                          className="text-2xl font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full md:w-[250px]"
                          placeholder="Nome do Treino..."
                        />
                        
                        <div className="flex-1 flex gap-2 w-full">
                           <div className="flex-1 relative">
                              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                              <input 
                                value={activeWorkout?.guidelines || ''}
                                onChange={(e) => updateActiveWorkout(w => ({...w, guidelines: e.target.value}))}
                                placeholder="Orientações gerais do treino..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none text-slate-700 dark:text-slate-200"
                              />
                           </div>
                           <button 
                             onClick={() => handleRemoveWorkout(activeWorkout.id)}
                             className={`p-2.5 flex items-center transition-colors border rounded-xl shrink-0 ${
                               activeWeek.workouts.length <= 1 
                               ? 'bg-slate-50 dark:bg-slate-800/20 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                               : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border-slate-200 dark:border-slate-700'
                             }`}
                             title="Eliminar Treino"
                             disabled={activeWeek.workouts.length <= 1}
                           >
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
                         <button onClick={() => setIsTableSettingsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
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
                            {tableSettings.showLoad && <th className="px-2 py-3 w-28 text-center">Carga</th>}
                            {tableSettings.showRir && <th className="px-2 py-3 w-24 text-center">RIR</th>}
                            {tableSettings.showRest && <th className="px-2 py-3 w-28 text-center">Descanso</th>}
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
                              className={`group transition-colors ${draggedExerciseIndex === idx ? 'opacity-50' : ''} ${exercise.isSuperSet ? 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 [&>td]:!border-t-0' : 'bg-white dark:bg-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/40'}`}
                            >
                              <td className="px-1 py-3 text-center relative">
                                {exercise.isSuperSet && <div className="absolute top-0 left-1/2 w-1 h-full bg-amber-400 dark:bg-amber-600 -translate-x-1/2 -mt-3 z-0 rounded-full"></div>}
                                <GripVertical size={16} className="text-slate-300 dark:text-slate-600 cursor-grab mx-auto hover:text-slate-500 relative z-10 bg-inherit" />
                              </td>
                              <td className="px-2 py-3">
                                <input 
                                  value={exercise.order || ''} 
                                  onChange={(e) => updateExercise(exercise.id, 'order', e.target.value)}
                                  className="w-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-black text-slate-700 dark:text-slate-200 outline-none"
                                  placeholder="A1"
                                />
                              </td>
                              <td className="px-2 py-3">
                                <select 
                                  value={exercise.muscleGroup || ''}
                                  onChange={(e) => updateExercise(exercise.id, 'muscleGroup', e.target.value)}
                                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-sm w-full outline-none text-slate-700 dark:text-slate-300 p-1.5 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Selec...</option>
                                  {ALL_MUSCLE_GROUPS.map(mg => <option key={mg} value={mg} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{mg}</option>)}
                                </select>
                              </td>
                              <td className="px-2 py-3 min-w-[200px] whitespace-normal">
                                <ExerciseSelect 
                                  value={exercise.exerciseName || ''}
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
                                {exercise.target && (
                                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                                    <CustomTargetIcon size={12} />
                                    <span>Meta: {exercise.target}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <input 
                                    value={exercise.sets || ''} 
                                    onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                                    className="w-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-bold text-slate-700 dark:text-slate-200 outline-none"
                                    placeholder="3"
                                  />
                                  <SetTypesDropdown 
                                    exercise={exercise}
                                    onChange={(setTypes) => handleSaveSetTypes(exercise.id, setTypes)}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <input 
                                    value={exercise.reps || ''} 
                                    onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                                    className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-bold text-slate-700 dark:text-slate-200 outline-none"
                                    placeholder={
                                      exercise.repsUnit === 'kcal' ? '250 kcal' :
                                      exercise.repsUnit === 'distancia' ? '5 km' :
                                      exercise.repsUnit === 'tempo' ? '45s' :
                                      exercise.repsUnit === 'rondas' ? '3 rondas' :
                                      '10-12'
                                    }
                                  />
                                  <RepsPerSetDropdown 
                                    exercise={exercise}
                                    onChange={(repsPerSet, unit) => handleSaveRepsPerSet(exercise.id, repsPerSet, unit)}
                                    onUnitChange={(unit) => updateExercise(exercise.id, 'repsUnit', unit)}
                                  />
                                </div>
                              </td>
                              {tableSettings.showLoad && (
                                <td className="px-2 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <input 
                                      value={exercise.carga || ''} 
                                      onChange={(e) => updateExercise(exercise.id, 'carga', e.target.value)}
                                      className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-bold text-slate-700 dark:text-slate-200 outline-none text-xs"
                                      placeholder="kg/lbs"
                                    />
                                    <CargaPerSetDropdown 
                                      exercise={exercise}
                                      onChange={(cargaPerSet) => handleSaveCargaPerSet(exercise.id, cargaPerSet)}
                                      onApplyToMain={(val) => updateExercise(exercise.id, 'carga', val)}
                                    />
                                  </div>
                                </td>
                              )}
                              {tableSettings.showRir && (
                                <td className="px-2 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <input 
                                      value={exercise.rir || ''} 
                                      onChange={(e) => updateExercise(exercise.id, 'rir', e.target.value)}
                                      className="w-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 rounded p-1.5 text-center font-medium text-slate-600 dark:text-slate-300 outline-none text-xs"
                                      placeholder="1-2"
                                    />
                                    <RirPerSetDropdown 
                                      exercise={exercise}
                                      onChange={(rirPerSet) => handleSaveRirPerSet(exercise.id, rirPerSet)}
                                      onApplyToMain={(val) => updateExercise(exercise.id, 'rir', val)}
                                    />
                                  </div>
                                </td>
                              )}
                              {tableSettings.showRest && (
                              <td className="px-2 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 w-[65px] focus-within:border-primary-500">
                                    <Clock size={12} className="text-slate-400 shrink-0"/>
                                    <input 
                                      value={exercise.rest || ''} 
                                      onChange={(e) => updateExercise(exercise.id, 'rest', e.target.value)}
                                      className="bg-transparent border-none flex-1 text-center font-medium text-slate-600 dark:text-slate-300 outline-none p-0 focus:ring-0 text-xs w-full"
                                      placeholder="90s"
                                    />
                                  </div>
                                  <RestPerSetDropdown 
                                    exercise={exercise}
                                    onChange={(restPerSet) => handleSaveRestPerSet(exercise.id, restPerSet)}
                                    onApplyToMain={(val) => updateExercise(exercise.id, 'rest', val)}
                                  />
                                </div>
                              </td>
                              )}
                              <td className="px-2 py-3 min-w-[200px] whitespace-normal">
                                <textarea 
                                  value={exercise.instructions || ''}
                                  onChange={(e) => updateExercise(exercise.id, 'instructions', e.target.value)}
                                  placeholder="Adicionar notas..."
                                  className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-[34px] overflow-hidden transition-colors"
                                />
                              </td>
                              <td className="px-2 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => addSuperSetExercise(idx)} className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 dark:bg-slate-800/50 dark:hover:bg-amber-900/20 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/50 rounded transition-colors" title="Adicionar Super Série">
                                    <Link size={14}/>
                                  </button>
                                  <button onClick={() => insertExerciseFixed(idx + 1)} className="p-1.5 text-slate-500 hover:text-primary-600 bg-slate-50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded transition-colors" title="Inserir Abaixo">
                                    <ArrowDownToLine size={14}/>
                                  </button>
                                  <button onClick={() => setTargetModal({ isOpen: true, exerciseId: exercise.id, target: exercise.target || '' })} className="p-1.5 text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/50 rounded transition-colors" title="Definir Meta">
                                    <CustomTargetIcon size={14}/>
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
                    <div className="flex flex-col items-center justify-center gap-2 mb-2.5 text-center">
                      <h3 className="font-bold text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <Activity size={12} className="text-primary-500" /> Volume do Treino
                      </h3>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-center w-full">
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
                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-center w-full">
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

      {targetModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
                  <CustomTargetIcon size={18} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Definir Meta</h3>
              </div>
              <button 
                onClick={() => setTargetModal({ isOpen: false, exerciseId: null, target: '' })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Meta do Exercício
              </label>
              <input 
                type="text"
                autoFocus
                value={targetModal.target || ''}
                onChange={e => setTargetModal(prev => ({ ...prev, target: e.target.value }))}
                placeholder="Ex: 50kg, 12 reps, RPE 8..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-3 text-sm font-medium text-slate-800 dark:text-white outline-none transition-all"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (targetModal.exerciseId) {
                      updateExercise(targetModal.exerciseId, 'target', targetModal.target);
                      setTargetModal({ isOpen: false, exerciseId: null, target: '' });
                    }
                  }
                }}
              />
              <p className="text-xs text-slate-500 mt-2">
                A meta definida ficará visível na tabela e poderá ser acompanhada pelo aluno.
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-800/50">
              <button 
                onClick={() => setTargetModal({ isOpen: false, exerciseId: null, target: '' })}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (targetModal.exerciseId) {
                    updateExercise(targetModal.exerciseId, 'target', targetModal.target);
                    setTargetModal({ isOpen: false, exerciseId: null, target: '' });
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-500/20"
              >
                Guardar Meta
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isTableSettingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg">
                  <Settings2 size={18} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Configurações da Tabela</h3>
              </div>
              <button 
                onClick={() => setIsTableSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">Coluna RIR</span>
                  <p className="text-xs text-slate-500">Mostrar Repetições na Reserva</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={tableSettings.showRir} onChange={(e) => setTableSettings(s => ({ ...s, showRir: e.target.checked }))} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${tableSettings.showRir ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${tableSettings.showRir ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">Coluna Carga</span>
                  <p className="text-xs text-slate-500">Mostrar campo para prescrição de carga</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={tableSettings.showLoad} onChange={(e) => setTableSettings(s => ({ ...s, showLoad: e.target.checked }))} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${tableSettings.showLoad ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${tableSettings.showLoad ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">Coluna Descanso</span>
                  <p className="text-xs text-slate-500">Mostrar tempo de descanso entre séries</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={tableSettings.showRest} onChange={(e) => setTableSettings(s => ({ ...s, showRest: e.target.checked }))} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${tableSettings.showRest ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${tableSettings.showRest ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-800/50">
              <button 
                onClick={() => setIsTableSettingsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock Minus icon directly since it wasn't imported from lucide-react in earlier versions
const Minus = ({ size = 24, className ="" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14"></path>
  </svg>
);

export default WorkoutPlanBuilder;
// Missing import Activity, oh right, I didn't import it in this file. I'll add it in the next update or just edit it now.
