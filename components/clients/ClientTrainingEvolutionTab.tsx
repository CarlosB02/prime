import React, { useState, useEffect } from 'react';
import { 
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, StickyNote, Edit2, LineChart, ChevronRight, ArrowRight, Calendar, Dumbbell, Plus,
  ArrowRightLeft, Trash2, X, Check
} from 'lucide-react';
import { CustomChatIcon } from '../icons';
import { Client } from '../../types';
import { EvolutionNotesDrawer, ExerciseNoteRecord, TrainingNoteRecord } from './EvolutionNotesDrawer';

export interface SubstitutedExerciseRecord {
  id: string;
  originalExercise: string;
  equipment?: string;
  substituteExercise: string;
  reason?: string;
  series: string; // ex: 'WS', 'FS', 'WU'
  weeks: {
    [weekNumber: number]: {
      reps: number | string;
      kg: number | string;
    } | null;
  };
}

const SUB_WEEKS = [1, 2, 3, 4, 5, 6, 7, 8];

const DEFAULT_SUBSTITUTED_EXERCISES: SubstitutedExerciseRecord[] = [
  {
    id: 'sub-1',
    originalExercise: 'Supino Plano com Barra',
    equipment: 'Barra Olímpica & Banco Reto',
    substituteExercise: 'Supino Plano com Halteres',
    reason: 'Desconforto na articulação do ombro esquerdo na transição excêntrica',
    series: 'WS',
    weeks: {
      1: null,
      2: null,
      3: { reps: 10, kg: '28' },
      4: { reps: 10, kg: '30' },
      5: { reps: 8, kg: '32,5' },
      6: { reps: 8, kg: '32,5' },
      7: null,
      8: null,
    }
  },
  {
    id: 'sub-2',
    originalExercise: 'Agachamento Livre com Barra',
    equipment: 'Barra Olímpica e Gaiola de Agachamento',
    substituteExercise: 'Leg Press 45° Articulado',
    reason: 'Fadiga lombar acumulada e desconforto nos eretores da espinha',
    series: 'WS',
    weeks: {
      1: null,
      2: { reps: 12, kg: '180' },
      3: { reps: 10, kg: '200' },
      4: { reps: 10, kg: '210' },
      5: null,
      6: null,
      7: null,
      8: null,
    }
  },
  {
    id: 'sub-3',
    originalExercise: 'Crucifixo Inclinado Halteres',
    equipment: 'Banco Inclinado 30° + Halteres',
    substituteExercise: 'Crossover na Polia Média',
    reason: 'Equipamento ocupado no horário; melhor perfil de tensão contínua no peitoral',
    series: 'FS',
    weeks: {
      1: null,
      2: null,
      3: null,
      4: { reps: 12, kg: '22,5' },
      5: { reps: 12, kg: '25' },
      6: { reps: 10, kg: '27,5' },
      7: null,
      8: null,
    }
  },
  {
    id: 'sub-4',
    originalExercise: 'Puxada Frontal com Pega Larga',
    equipment: 'Máquina de Dorsal / Cabo Superior',
    substituteExercise: 'Remada Baixa com Pega Triangular',
    reason: 'Adaptação de estímulo solicitada pelo atleta para foco em espessura dorsal',
    series: 'WS',
    weeks: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: { reps: 10, kg: '62,5' },
      6: { reps: 10, kg: '65' },
      7: null,
      8: null,
    }
  }
];

const formatSubstitutedWeekValue = (record: { reps: number | string; kg: number | string } | null | undefined): string => {
  if (!record || record.reps === undefined || record.kg === undefined || record.reps === '' || record.kg === '') {
    return '—';
  }
  const kgStr = String(record.kg).trim().replace('.', ',');
  return `${record.reps} × ${kgStr}`;
};

interface ClientTrainingEvolutionTabProps {
  client?: Client;
  onUpdateClient?: (updatedFields: Partial<Client>) => Promise<void> | void;
}

// Mock Data for Evolução Table
const MOCK_EVOLUTION_DATA = [
  {
    id: 'ex1',
    day: 'A',
    name: 'Supino Plano com Barra',
    sets: [
      { type: 'WU', records: [{ week: 1, kg: 40, reps: 15 }, { week: 2, kg: 40, reps: 15 }, { week: 3, kg: 45, reps: 12 }, { week: 4, kg: 45, reps: 12 }] },
      { type: 'WS', records: [{ week: 1, kg: 60, reps: 10 }, { week: 2, kg: 62.5, reps: 10 }, { week: 3, kg: 65, reps: 8 }, { week: 4, kg: 65, reps: 9 }] },
      { type: 'WS', records: [{ week: 1, kg: 60, reps: 9 }, { week: 2, kg: 62.5, reps: 8 }, { week: 3, kg: 65, reps: 7 }, { week: 4, kg: 65, reps: 8 }] },
    ]
  },
  {
    id: 'ex2',
    day: 'A',
    name: 'Crucifixo Inclinado Halteres',
    sets: [
      { type: 'WS', records: [{ week: 1, kg: 16, reps: 12 }, { week: 2, kg: 16, reps: 12 }, { week: 3, kg: 18, reps: 10 }, { week: 4, kg: 18, reps: 10 }] },
      { type: 'WS', records: [{ week: 1, kg: 16, reps: 10 }, { week: 2, kg: 16, reps: 11 }, { week: 3, kg: 18, reps: 8 }, { week: 4, kg: 18, reps: 9 }] },
      { type: 'FS', records: [{ week: 1, kg: 14, reps: 15 }, { week: 2, kg: 14, reps: 16 }, { week: 3, kg: 16, reps: 12 }, { week: 4, kg: 16, reps: 14 }] },
    ]
  },
  {
    id: 'ex3',
    day: 'B',
    name: 'Puxada Frontal',
    sets: [
      { type: 'WU', records: [{ week: 1, kg: 30, reps: 15 }, { week: 2, kg: 30, reps: 15 }, { week: 3, kg: 35, reps: 15 }, { week: 4, kg: 35, reps: 15 }] },
      { type: 'WS', records: [{ week: 1, kg: 50, reps: 12 }, { week: 2, kg: 55, reps: 10 }, { week: 3, kg: 55, reps: 12 }, { week: 4, kg: 60, reps: 8 }] },
      { type: 'WS', records: [{ week: 1, kg: 50, reps: 10 }, { week: 2, kg: 55, reps: 9 }, { week: 3, kg: 55, reps: 10 }, { week: 4, kg: 60, reps: 7 }] },
    ]
  }
];

// Weekly timeline dates (6 weeks)
const generateWeeksData = () => {
  const now = new Date();
  const day = now.getDay();
  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  
  return [1, 2, 3, 4, 5, 6].map((week, idx) => {
    const targetMonday = new Date(currentMonday);
    targetMonday.setDate(currentMonday.getDate() - (5 - idx) * 7);
    const d = String(targetMonday.getDate()).padStart(2, '0');
    const m = String(targetMonday.getMonth() + 1).padStart(2, '0');
    const y = targetMonday.getFullYear();
    return {
      week,
      date: `${d}/${m}/${y}`,
      shortDate: `${d}/${m}`
    };
  });
};

const WEEKS_DATA = generateWeeksData();
const WEEKS = WEEKS_DATA.map(w => w.week);

export const ClientTrainingEvolutionTab: React.FC<ClientTrainingEvolutionTabProps> = ({
  client,
  onUpdateClient
}) => {
  const [trainingEvolutionTab, setTrainingEvolutionTab] = useState<'treino' | 'exercicios'>('treino');
  const [evolutionTab, setEvolutionTab] = useState<'exercicio' | 'grupo'>('exercicio');
  const [selectedPlan, setSelectedPlan] = useState('plano1');
  const [selectedWorkout, setSelectedWorkout] = useState('treino1');

  // Exercise notes and Training notes state with persistence
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'exercise' | 'training'>('training');

  const [exerciseNotesList, setExerciseNotesList] = useState<ExerciseNoteRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_exercise_notes_${client?.id || 'demo'}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ex-note-1',
        date: '12/10/2026',
        exercise: 'Supino Plano com Barra',
        text: 'Focar na fase excêntrica controlada (3 segundos descida). Evitar esticar completamente os cotovelos no topo.',
        author: 'Carlos Bernardo',
        workoutPlan: 'Hipertrofia - Fase 1'
      },
      {
        id: 'ex-note-2',
        date: '05/10/2026',
        exercise: 'Crucifixo Inclinado Halteres',
        text: 'Manter a estabilização escapular ativa ao longo de toda a série. Não passar os cotovelos da linha do ombro.',
        author: 'Carlos Bernardo',
        workoutPlan: 'Hipertrofia - Fase 1'
      },
      {
        id: 'ex-note-3',
        date: '28/09/2026',
        exercise: 'Puxada Frontal',
        text: 'Puxar com os cotovelos na direção dos quadris e segurar contração de 1s na base.',
        author: 'Carlos Bernardo',
        workoutPlan: 'Hipertrofia - Fase 1'
      },
      {
        id: 'ex-note-4',
        date: '21/09/2026',
        exercise: 'Supino Plano com Barra',
        text: 'Ajuste de pegada: afastar ligeiramente a mão esquerda para equilibrar o ombro.',
        author: 'Carlos Bernardo',
        workoutPlan: 'Fase de Adaptação'
      }
    ];
  });

  const [trainingNotesList, setTrainingNotesList] = useState<TrainingNoteRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_training_notes_${client?.id || 'demo'}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'tr-note-1',
        date: '12/10/2026',
        workoutName: 'Treino A - Peito e Tríceps',
        text: 'O atleta referiu sentir menos dores no ombro durante este treino. A progressão de carga deverá manter-se ligeira e baseada em RPE.',
        author: 'Atleta',
        rpe: 8
      },
      {
        id: 'tr-note-2',
        date: '09/10/2026',
        workoutName: 'Treino B - Costas e Bíceps',
        text: 'Excelente recuperação muscular em comparação com a semana anterior. Conseguiu aumentar carga em todos os compostos.',
        author: 'Atleta',
        rpe: 7
      },
      {
        id: 'tr-note-3',
        date: '05/10/2026',
        workoutName: 'Treino C - Pernas e Ombros',
        text: 'Sensação de fadiga ao final do treino. Recomendado hidratação reforçada intra-treino.',
        author: 'Atleta',
        rpe: 9
      },
      {
        id: 'tr-note-4',
        date: '02/10/2026',
        workoutName: 'Treino A - Peito e Tríceps',
        text: 'Primeira semana com o novo volume. Bom controlo técnico em todos os exercícios.',
        author: 'Atleta',
        rpe: 8
      }
    ];
  });

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`pr1me_exercise_notes_${client?.id || 'demo'}`, JSON.stringify(exerciseNotesList));
    } catch (e) {}
  }, [exerciseNotesList, client?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`pr1me_training_notes_${client?.id || 'demo'}`, JSON.stringify(trainingNotesList));
    } catch (e) {}
  }, [trainingNotesList, client?.id]);

  // Substituted Exercises state with persistence
  const [substitutedList, setSubstitutedList] = useState<SubstitutedExerciseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_substituted_exercises_${client?.id || 'demo'}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SUBSTITUTED_EXERCISES;
  });

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSubRecord, setEditingSubRecord] = useState<SubstitutedExerciseRecord | null>(null);

  // Form states for Substituted Exercise Modal
  const [subFormOriginal, setSubFormOriginal] = useState('');
  const [subFormEquipment, setSubFormEquipment] = useState('');
  const [subFormSubstitute, setSubFormSubstitute] = useState('');
  const [subFormReason, setSubFormReason] = useState('');
  const [subFormSeries, setSubFormSeries] = useState('WS');
  const [subFormWeeks, setSubFormWeeks] = useState<{ [w: number]: { reps: string; kg: string } }>({
    1: { reps: '', kg: '' },
    2: { reps: '', kg: '' },
    3: { reps: '', kg: '' },
    4: { reps: '', kg: '' },
    5: { reps: '', kg: '' },
    6: { reps: '', kg: '' },
    7: { reps: '', kg: '' },
    8: { reps: '', kg: '' }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`pr1me_substituted_exercises_${client?.id || 'demo'}`, JSON.stringify(substitutedList));
    } catch (e) {}
  }, [substitutedList, client?.id]);

  const handleOpenAddSubModal = () => {
    setEditingSubRecord(null);
    setSubFormOriginal('');
    setSubFormEquipment('');
    setSubFormSubstitute('');
    setSubFormReason('');
    setSubFormSeries('WS');
    setSubFormWeeks({
      1: { reps: '', kg: '' },
      2: { reps: '', kg: '' },
      3: { reps: '', kg: '' },
      4: { reps: '', kg: '' },
      5: { reps: '', kg: '' },
      6: { reps: '', kg: '' },
      7: { reps: '', kg: '' },
      8: { reps: '', kg: '' }
    });
    setIsSubModalOpen(true);
  };

  const handleOpenEditSubModal = (record: SubstitutedExerciseRecord) => {
    setEditingSubRecord(record);
    setSubFormOriginal(record.originalExercise);
    setSubFormEquipment(record.equipment || '');
    setSubFormSubstitute(record.substituteExercise);
    setSubFormReason(record.reason || '');
    setSubFormSeries(record.series);
    const weeksState: { [w: number]: { reps: string; kg: string } } = {};
    SUB_WEEKS.forEach(w => {
      const rec = record.weeks[w];
      weeksState[w] = {
        reps: rec?.reps !== undefined && rec?.reps !== null ? String(rec.reps) : '',
        kg: rec?.kg !== undefined && rec?.kg !== null ? String(rec.kg) : ''
      };
    });
    setSubFormWeeks(weeksState);
    setIsSubModalOpen(true);
  };

  const handleSaveSubstituted = () => {
    if (!subFormOriginal.trim() || !subFormSubstitute.trim()) return;

    const weeksData: SubstitutedExerciseRecord['weeks'] = {};
    SUB_WEEKS.forEach(w => {
      const rw = subFormWeeks[w];
      if (rw && rw.reps && rw.kg) {
        weeksData[w] = { reps: rw.reps.trim(), kg: rw.kg.trim() };
      } else {
        weeksData[w] = null;
      }
    });

    if (editingSubRecord) {
      setSubstitutedList(prev => prev.map(item => item.id === editingSubRecord.id ? {
        ...item,
        originalExercise: subFormOriginal.trim(),
        equipment: subFormEquipment.trim() || undefined,
        substituteExercise: subFormSubstitute.trim(),
        reason: subFormReason.trim() || undefined,
        series: subFormSeries,
        weeks: weeksData
      } : item));
    } else {
      const newRecord: SubstitutedExerciseRecord = {
        id: `sub-${Date.now()}`,
        originalExercise: subFormOriginal.trim(),
        equipment: subFormEquipment.trim() || undefined,
        substituteExercise: subFormSubstitute.trim(),
        reason: subFormReason.trim() || undefined,
        series: subFormSeries,
        weeks: weeksData
      };
      setSubstitutedList(prev => [...prev, newRecord]);
    }

    setIsSubModalOpen(false);
  };

  const handleDeleteSubstituted = (id: string) => {
    setSubstitutedList(prev => prev.filter(item => item.id !== id));
  };

  const handleAddExerciseNote = (newNote: Omit<ExerciseNoteRecord, 'id'>) => {
    const item: ExerciseNoteRecord = {
      ...newNote,
      id: `ex-note-${Date.now()}`
    };
    const updated = [item, ...exerciseNotesList];
    setExerciseNotesList(updated);
    if (onUpdateClient && updated[0]) {
      onUpdateClient({ exerciseNote: `${updated[0].exercise}: ${updated[0].text}` });
    }
  };

  const handleDeleteExerciseNote = (id: string) => {
    setExerciseNotesList(prev => prev.filter(n => n.id !== id));
  };

  const handleAddTrainingNote = (newNote: Omit<TrainingNoteRecord, 'id'>) => {
    const item: TrainingNoteRecord = {
      ...newNote,
      id: `tr-note-${Date.now()}`
    };
    const updated = [item, ...trainingNotesList];
    setTrainingNotesList(updated);
    if (onUpdateClient && updated[0]) {
      onUpdateClient({ trainingNote: updated[0].text });
    }
  };

  const handleDeleteTrainingNote = (id: string) => {
    setTrainingNotesList(prev => prev.filter(n => n.id !== id));
  };

  const handleOpenDrawer = (type: 'exercise' | 'training') => {
    setDrawerType(type);
    setIsNotesDrawerOpen(true);
  };

  // Calculate Volume Data
  const volumeData = WEEKS_DATA.map(({ week, date, shortDate }) => {
    let totalVolume = 0;
    MOCK_EVOLUTION_DATA.forEach(exercise => {
      exercise.sets.forEach(set => {
        const record = set.records.find(r => r.week === week);
        if (record && record.kg && record.reps) {
          totalVolume += record.kg * record.reps;
        }
      });
    });
    return { 
      week: `Semana ${week}`, 
      date, 
      shortDate, 
      volume: totalVolume 
    };
  });

  // Vertical Date Tick for Charts
  const VerticalDateTick = (props: any) => {
    const { x, y, payload } = props;
    if (!payload || payload.value === undefined) return null;
    return (
      <g transform={`translate(${x},${y + 6})`}>
        <text
          x={0}
          y={0}
          dy={3}
          textAnchor="end"
          fill="#64748b"
          className="dark:fill-slate-400 font-medium text-[10px]"
          transform="rotate(-90)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Calculate Exercise Details Data
  const exerciseDetailsData = MOCK_EVOLUTION_DATA.map(exercise => {
    const workingSets = exercise.sets.filter(set => set.type === 'WS');
    let personalRecordKg = 0;
    let personalRecordReps = 0;
    let estimated1RM = 0;

    workingSets.forEach(set => {
      set.records.forEach(record => {
        if (record.kg && record.reps) {
          if (record.kg > personalRecordKg || (record.kg === personalRecordKg && record.reps > personalRecordReps)) {
            personalRecordKg = record.kg;
            personalRecordReps = record.reps;
          }
          const current1RM = record.kg * (1 + record.reps / 30);
          if (current1RM > estimated1RM) {
            estimated1RM = current1RM;
          }
        }
      });
    });

    const chartData = WEEKS_DATA.map(({ week, date, shortDate }) => {
      let maxKg = 0;
      let totalReps = 0;
      let volumeLoad = 0;
      
      const weekData: any = { 
        week: `Semana ${week}`,
        date,
        shortDate
      };

      workingSets.forEach((set, idx) => {
        const record = set.records.find(r => r.week === week);
        if (record && record.kg && record.reps) {
          weekData[`WS${idx + 1}`] = record.kg;
          if (record.kg > maxKg) maxKg = record.kg;
          totalReps += record.reps;
          volumeLoad += record.kg * record.reps;
        }
      });

      return {
        ...weekData,
        maxKg: maxKg || null,
        totalReps: totalReps || null,
        volumeLoad: volumeLoad || null,
      };
    });

    return {
      ...exercise,
      personalRecord: `${personalRecordKg}kg × ${personalRecordReps}`,
      estimated1RM: Math.round(estimated1RM),
      chartData,
      workingSetsCount: workingSets.length
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-tabs under Treino */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl px-2">
        <button
          onClick={() => setTrainingEvolutionTab('treino')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            trainingEvolutionTab === 'treino'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Evolução de treino
        </button>
        <button
          onClick={() => setTrainingEvolutionTab('exercicios')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            trainingEvolutionTab === 'exercicios'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Evolução de exercícios
        </button>
      </div>

      {/* Content: Evolução de treino */}
      {trainingEvolutionTab === 'treino' && (
        <div className="space-y-6 animate-fade-in pt-2">
          {/* Filtros / Seleção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Plano de treino</label>
              <select 
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="plano1">Hipertrofia - Fase 1</option>
                <option value="plano2">Força - Fase 2</option>
              </select>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Treino</label>
              <select 
                value={selectedWorkout}
                onChange={(e) => setSelectedWorkout(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="treino1">Treino A - Peito e Tríceps</option>
                <option value="treino2">Treino B - Costas e Bíceps</option>
                <option value="treino3">Treino C - Pernas e Ombros</option>
              </select>
            </div>
          </div>

          {/* Tabela de Evolução */}
          <div className="relative overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/80">
                <tr>
                  <th rowSpan={2} className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 w-[220px] min-w-[220px] max-w-[220px] px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">Exercício</th>
                  <th rowSpan={2} className="sticky left-[220px] z-20 bg-slate-50 dark:bg-slate-900 w-[80px] min-w-[80px] max-w-[80px] px-4 py-3 border-b border-r-2 border-slate-300 dark:border-slate-600 text-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Série</th>
                  {WEEKS_DATA.map(({ week, date }) => (
                    <th key={week} colSpan={2} className="px-4 py-2 text-center border-b border-r-2 border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800/50">
                      <span className="font-bold">Semana {week}</span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5">{date}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {WEEKS.map(week => (
                    <React.Fragment key={`sub-${week}`}>
                      <th className="px-3 py-2 text-center border-b border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 w-[90px] min-w-[90px]">Reps</th>
                      <th className="px-3 py-2 text-center border-b border-r-2 border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40 w-[100px] min-w-[100px]">Carga (kg)</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_EVOLUTION_DATA.map((exercise) => (
                  exercise.sets.map((set, setIdx) => (
                    <tr key={`${exercise.id}-${setIdx}`} className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors">
                      {setIdx === 0 && (
                        <td rowSpan={exercise.sets.length} className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-4 py-3 font-medium text-slate-800 dark:text-white border-r border-slate-200 dark:border-slate-700 align-middle whitespace-normal">
                          {exercise.name}
                        </td>
                      )}
                      <td className="sticky left-[220px] z-10 bg-white dark:bg-slate-800 px-4 py-3 border-r-2 border-slate-300 dark:border-slate-600 text-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold tracking-wide ${
                          set.type === 'WU' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                          set.type === 'WS' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {set.type}
                        </span>
                      </td>
                      {WEEKS.map(week => {
                        const record = set.records.find(r => r.week === week);
                        const prevRecord = set.records.find(r => r.week === week - 1);
                        
                        const kgDiff = (record?.kg && prevRecord?.kg) ? record.kg - prevRecord.kg : 0;

                        return (
                          <React.Fragment key={`data-${week}`}>
                            <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-700/50 font-medium text-slate-700 dark:text-slate-300">
                              {record?.reps ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <span>{record.reps}</span>
                                </div>
                              ) : '-'}
                            </td>
                            <td className="px-3 py-3 text-center border-r-2 border-slate-300 dark:border-slate-600 font-bold text-slate-800 dark:text-white">
                              {record?.kg ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <span>{record.kg}</span>
                                  {kgDiff !== 0 && (
                                    <span className={`text-[10px] font-bold ${kgDiff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                      {kgDiff > 0 ? '+' : ''}{kgDiff}
                                    </span>
                                  )}
                                </div>
                              ) : '-'}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabela de Exercícios Substituídos */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Header da Tabela */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 shrink-0">
                  <ArrowRightLeft size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                      Exercícios Substituídos
                    </h3>
                    <span className="text-[10px] font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800/50 px-2 py-0.5 rounded-full">
                      {substitutedList.length} {substitutedList.length === 1 ? 'exercício' : 'exercícios'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Acompanhamento cronológico de substituições e cargas utilizadas por semana
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleOpenAddSubModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Registar Substituição</span>
                </button>
              </div>
            </div>

            {/* Conteúdo da Tabela */}
            <div className="relative overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead className="text-[11px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/80">
                  <tr>
                    <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 w-[240px] sm:w-[280px] min-w-[240px] sm:min-w-[280px] px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700 font-bold tracking-wider">
                      Exercício
                    </th>
                    <th className="sticky left-[240px] sm:left-[280px] z-20 bg-slate-50 dark:bg-slate-900 w-[70px] min-w-[70px] max-w-[70px] px-2 py-3 border-b border-r-2 border-slate-300 dark:border-slate-600 text-center font-bold tracking-wider shadow-[4px_0_8px_-4px_rgba(0,0,0,0.06)]">
                      Série
                    </th>
                    {SUB_WEEKS.map(week => (
                      <th 
                        key={`sub-th-${week}`} 
                        className="px-3 py-3 text-center border-b border-r border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 w-[95px] min-w-[95px] font-bold tracking-wider whitespace-nowrap"
                      >
                        Semana {week}
                      </th>
                    ))}
                    <th className="px-2 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-bold tracking-wider w-[70px]">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {substitutedList.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                        Nenhum exercício substituído registado para este plano.
                      </td>
                    </tr>
                  ) : (
                    substitutedList.map((item) => (
                      <tr 
                        key={item.id} 
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-700/25 transition-colors"
                      >
                        {/* Coluna Exercício */}
                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-4 py-3.5 border-r border-slate-200 dark:border-slate-700 align-middle">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
                              {item.originalExercise}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">
                                <ArrowRightLeft size={10} className="shrink-0" />
                                Substituto: <strong className="font-semibold">{item.substituteExercise}</strong>
                              </span>
                              {item.equipment && (
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  • {item.equipment}
                                </span>
                              )}
                            </div>
                            {item.reason && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-snug">
                                Motivo: {item.reason}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Coluna Série */}
                        <td className="sticky left-[240px] sm:left-[280px] z-10 bg-white dark:bg-slate-800 px-2 py-3.5 border-r-2 border-slate-300 dark:border-slate-600 text-center align-middle shadow-[4px_0_8px_-4px_rgba(0,0,0,0.06)]">
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            item.series === 'WU' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                            item.series === 'WS' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40' :
                            item.series === 'FS' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {item.series}
                          </span>
                        </td>

                        {/* Colunas Semana 1 até Semana 8 */}
                        {SUB_WEEKS.map(week => {
                          const record = item.weeks[week];
                          const formattedVal = formatSubstitutedWeekValue(record);
                          const isFilled = formattedVal !== '—';

                          return (
                            <td 
                              key={`sub-cell-${item.id}-${week}`}
                              className="px-3 py-3.5 text-center border-r border-slate-100 dark:border-slate-700/60 align-middle whitespace-nowrap min-w-[95px]"
                            >
                              {isFilled ? (
                                <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/60 font-bold text-xs text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60">
                                  {formattedVal}
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 font-light select-none text-xs">—</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Coluna Ações */}
                        <td className="px-2 py-3.5 text-center align-middle whitespace-nowrap w-[70px]">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSubModal(item)}
                              title="Editar substituição"
                              className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubstituted(item.id)}
                              title="Remover substituição"
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notas de Treino e Exercício */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. NOTA DE TREINO */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                    <StickyNote size={16} className="text-primary-500" />
                    Notas de Treino
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    Registo do Atleta
                  </span>
                </div>

                {/* 3 Notas de Treino Recentes */}
                <div className="space-y-3">
                  {trainingNotesList.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs hover:border-primary-300 dark:hover:border-primary-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 truncate max-w-[220px]">
                          {item.workoutName}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 shrink-0 flex items-center gap-1">
                          <Calendar size={11} className="text-slate-400" />
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão Ver Todas as Notas */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {trainingNotesList.length} notas no histórico
                </span>
                <button
                  onClick={() => handleOpenDrawer('training')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline cursor-pointer group"
                >
                  <span>Ver todas as notas</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* 2. NOTA DE EXERCÍCIO */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                    <CustomChatIcon size={16} className="text-indigo-500" />
                    Notas de Exercício
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    Feedback Técnico
                  </span>
                </div>

                {/* 3 Notas de Exercício Recentes */}
                <div className="space-y-3">
                  {exerciseNotesList.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[220px] flex items-center gap-1.5">
                          <Dumbbell size={12} className="shrink-0" />
                          {item.exercise}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 shrink-0 flex items-center gap-1">
                          <Calendar size={11} className="text-slate-400" />
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão Ver Todas as Notas */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {exerciseNotesList.length} notas no histórico
                </span>
                <button
                  onClick={() => handleOpenDrawer('exercise')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer group"
                >
                  <span>Ver todas as notas</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Volume Total de Treino */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-500" />
                Volume Total de Treino
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Evolução semanal por data
              </span>
            </div>
            <div className="h-[280px] w-full max-w-lg mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={volumeData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    height={65} 
                    interval={0}
                    tick={<VerticalDateTick />} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                    width={60}
                    tickFormatter={(value) => `${value}kg`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? `${item.week} • ${item.date}` : `Data: ${label}`;
                    }}
                    formatter={(value: number) => [`${value} kg`, 'Volume Total']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#10b981' }} 
                    activeDot={{ r: 7 }} 
                    name="Volume Total (kg)" 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detalhe por Exercício */}
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white">Detalhe por Exercício</h4>
            </div>

            {exerciseDetailsData.map((exercise, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{exercise.name}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Recorde Pessoal</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{exercise.personalRecord}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">% RM Atual</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {exercise.estimated1RM > 0 ? Math.round((parseInt(exercise.personalRecord.split('kg')[0]) / exercise.estimated1RM) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">1RM Estimada</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{exercise.estimated1RM} kg</span>
                    </div>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Evolução de Carga */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
                      <span>Evolução de Carga (kg)</span>
                      <span className="text-[10px] font-normal text-slate-400">Por série</span>
                    </h5>
                    <div className="h-[230px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={exercise.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            height={65} 
                            interval={0}
                            tick={<VerticalDateTick />} 
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                            labelFormatter={(label, payload) => {
                              const item = payload?.[0]?.payload;
                              return item ? `${item.week} • ${item.date}` : `Data: ${label}`;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} iconType="circle" iconSize={8} />
                          {Array.from({ length: exercise.workingSetsCount }).map((_, i) => {
                            const colors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];
                            return (
                              <Line 
                                key={`WS${i + 1}`}
                                type="monotone" 
                                dataKey={`WS${i + 1}`} 
                                name={`Série ${i + 1}`}
                                stroke={colors[i % colors.length]} 
                                strokeWidth={3} 
                                dot={{ r: 4, strokeWidth: 2 }} 
                                activeDot={{ r: 6 }} 
                              />
                            );
                          })}
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Evolução de Repetições */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
                      <span>Evolução de Repetições</span>
                      <span className="text-[10px] font-normal text-slate-400">Total reps</span>
                    </h5>
                    <div className="h-[230px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={exercise.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            height={65} 
                            interval={0}
                            tick={<VerticalDateTick />} 
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                            labelFormatter={(label, payload) => {
                              const item = payload?.[0]?.payload;
                              return item ? `${item.week} • ${item.date}` : `Data: ${label}`;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} iconType="circle" iconSize={8} />
                          <Line type="monotone" dataKey="totalReps" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Total Reps" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Volume Load */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
                      <span>Volume Load (kg)</span>
                      <span className="text-[10px] font-normal text-slate-400">Carga total</span>
                    </h5>
                    <div className="h-[230px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={exercise.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            height={65} 
                            interval={0}
                            tick={<VerticalDateTick />} 
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                            labelFormatter={(label, payload) => {
                              const item = payload?.[0]?.payload;
                              return item ? `${item.week} • ${item.date}` : `Data: ${label}`;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} iconType="circle" iconSize={8} />
                          <Line type="monotone" dataKey="volumeLoad" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Volume Load (kg)" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content: Evolução de exercícios */}
      {trainingEvolutionTab === 'exercicios' && (
        <div className="space-y-6 animate-fade-in pt-2">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setEvolutionTab('exercicio')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                evolutionTab === 'exercicio'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Por exercício
            </button>
            <button
              onClick={() => setEvolutionTab('grupo')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                evolutionTab === 'grupo'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Por grupo muscular
            </button>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/60">
            <LineChart size={48} className="mb-4 opacity-30 text-primary-500" />
            <p className="font-medium text-sm">
              {evolutionTab === 'exercicio' 
                ? 'Gráficos e dados detalhados por exercício em desenvolvimento' 
                : 'Gráficos e dados agregados por grupo muscular em desenvolvimento'}
            </p>
          </div>
        </div>
      )}

      {/* Modal: Registar / Editar Exercício Substituído */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    {editingSubRecord ? 'Editar Exercício Substituído' : 'Registar Exercício Substituído'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Defina o exercício original, substituto, motivo e os registos por semana
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Exercício Original *
                  </label>
                  <input
                    type="text"
                    value={subFormOriginal}
                    onChange={(e) => setSubFormOriginal(e.target.value)}
                    placeholder="Ex: Supino Plano com Barra"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Equipamento Utilizado
                  </label>
                  <input
                    type="text"
                    value={subFormEquipment}
                    onChange={(e) => setSubFormEquipment(e.target.value)}
                    placeholder="Ex: Barra Olímpica & Banco Reto"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Exercício Substituto *
                  </label>
                  <input
                    type="text"
                    value={subFormSubstitute}
                    onChange={(e) => setSubFormSubstitute(e.target.value)}
                    placeholder="Ex: Supino Plano com Halteres"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Série
                  </label>
                  <select
                    value={subFormSeries}
                    onChange={(e) => setSubFormSeries(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="WS">WS (Working Set)</option>
                    <option value="FS">FS (Feeder Set)</option>
                    <option value="WU">WU (Warm-Up)</option>
                    <option value="RS">RS (Rest-Pause)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Motivo da Substituição
                </label>
                <textarea
                  rows={2}
                  value={subFormReason}
                  onChange={(e) => setSubFormReason(e.target.value)}
                  placeholder="Ex: Desconforto articular no ombro esquerdo na fase excêntrica; equipamento ocupado no ginásio..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Registos por Semana (Semana 1 a 8) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Registos por Semana (Semana 1 a 8)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Deixe em branco para exibir &quot;—&quot;
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SUB_WEEKS.map(w => (
                    <div key={w} className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                      <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                        Semana {w}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <input
                            type="text"
                            placeholder="Reps (10)"
                            value={subFormWeeks[w]?.reps || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setSubFormWeeks(prev => ({
                                ...prev,
                                [w]: { ...prev[w], reps: v }
                              }));
                            }}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-center text-slate-800 dark:text-white focus:ring-1 focus:ring-primary-500 outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Kg (62,5)"
                            value={subFormWeeks[w]?.kg || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setSubFormWeeks(prev => ({
                                ...prev,
                                [w]: { ...prev[w], kg: v }
                              }));
                            }}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-center text-slate-800 dark:text-white focus:ring-1 focus:ring-primary-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!subFormOriginal.trim() || !subFormSubstitute.trim()}
                onClick={handleSaveSubstituted}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer shadow-sm shadow-primary-500/20"
              >
                <Check size={14} />
                <span>{editingSubRecord ? 'Guardar Alterações' : 'Adicionar Substituição'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Slide-out Drawer for All Notes (estilo perfil de cliente para dar scroll) */}
      <EvolutionNotesDrawer
        isOpen={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
        type={drawerType}
        clientName={client?.name || 'Cliente'}
        clientAvatar={client?.avatar}
        exerciseNotes={exerciseNotesList}
        trainingNotes={trainingNotesList}
        onAddExerciseNote={handleAddExerciseNote}
        onDeleteExerciseNote={handleDeleteExerciseNote}
        onAddTrainingNote={handleAddTrainingNote}
        onDeleteTrainingNote={handleDeleteTrainingNote}
        onSwitchType={(t) => setDrawerType(t)}
      />
    </div>
  );
};

export default ClientTrainingEvolutionTab;
