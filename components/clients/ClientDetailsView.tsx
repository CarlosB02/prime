import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Edit2, Bell, StickyNote, Mail, Phone, Smartphone, 
  User, Activity, Dumbbell, Apple, CreditCard, MessageSquare, Plus, Trash2, CheckCircle2, PlusCircle, Calendar, Search,
  LayoutDashboard, Image, FileText, CheckSquare, TrendingUp, LineChart, HeartPulse, Settings, Info, ChevronDown, X, Clock, Eye, Stethoscope
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart as RechartsLineChart, Line, Legend } from 'recharts';
import { Client } from '../../types';
import SendNotificationModal from './SendNotificationModal';
import SendMessageModal from './SendMessageModal';
import ClientNotesModal from './ClientNotesModal';
import ContactModal from './ContactModal';
import ClientInfoModal from './ClientInfoModal';
import { ClientEditModal } from './ClientEditModal';
import { ClientRegisterWorkoutTab } from './ClientRegisterWorkoutTab';
import { ClientSettingsTab } from './ClientSettingsTab';
import { ClientTrainingPlanTab } from './ClientTrainingPlanTab';
import { ClientCalendarTab } from './ClientCalendarTab';
import { ClientPhotosTab } from './ClientPhotosTab';
import { ClientNutritionTab } from './ClientNutritionTab';
import { ClientNutritionLogTab } from './ClientNutritionLogTab';
import { ClientExamsTab } from './ClientExamsTab';
import { ClientAssessmentsTab } from './ClientAssessmentsTab';
import { ClientDailyLogsTab } from './ClientDailyLogsTab';
import { ClientAssessmentModal, AssessmentData } from './ClientAssessmentModal';
import { ClientConfigTab } from './ClientConfigTab';

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

const MOCK_ASSESSMENTS: AssessmentData[] = [
  {
    id: '#002',
    date: '2024-03-15',
    status: 'validado',
    measures: {
      ombros: '110', peitoral: '98', bracoDir: '34', bracoEsq: '34',
      cintura: '82', abdomen: '84', anca: '98', coxaDir: '55',
      coxaEsq: '55', gemeoDir: '38', gemeoEsq: '38'
    },
    weight: 76.5,
    weightVariation: -1.2,
    cinturaVariation: -2,
    questions: 'Cliente referiu sentir-se mais leve esta semana e com melhor digestão.',
    trainerFeedback: 'Excelente progresso, vamos manter o plano.',
    photos: [
      { id: '3', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop', date: '2024-03-15', label: 'Frente' }
    ]
  },
  {
    id: '#001',
    date: '2024-02-15',
    status: 'concluido',
    measures: {
      ombros: '112', peitoral: '100', bracoDir: '35', bracoEsq: '35',
      cintura: '84', abdomen: '86', anca: '100', coxaDir: '57',
      coxaEsq: '57', gemeoDir: '39', gemeoEsq: '39'
    },
    weight: 77.7,
    weightVariation: 0,
    cinturaVariation: 0,
    questions: '',
    trainerFeedback: '',
    photos: [
      { id: '1', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop', date: '2024-02-15', label: 'Frente' }
    ]
  }
];

const WEEKS = [1, 2, 3, 4, 5, 6];

interface ClientDetailsViewProps {
  client: Client;
  onBack: () => void;
}

type TabType = 'dashboard' | 'calendario' | 'avaliacoes' | 'fotos' | 'plano-treino' | 'registar-treino' | 'evolucao-treino' | 'cardio' | 'plano-nutricao' | 'registo-nutricao' | 'subscricoes' | 'definicoes' | 'exames' | 'configuracoes';

const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({ client, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isAddNutritionModalOpen, setIsAddNutritionModalOpen] = useState(false);
  const [evolutionTab, setEvolutionTab] = useState<'exercicio' | 'grupo'>('exercicio');
  const [trainingEvolutionTab, setTrainingEvolutionTab] = useState<'treino' | 'exercicios'>('treino');
  const [activeFeedbackTab, setActiveFeedbackTab] = useState<'treino' | 'checkin' | 'notas'>('treino');
  const [selectedPlan, setSelectedPlan] = useState('plano1');
  const [selectedWorkout, setSelectedWorkout] = useState('treino1');

  const [objetivo, setObjetivo] = useState('Perda de Massa Gorda');
  const [estrategia, setEstrategia] = useState('Défice Calórico + Hipertrofia');
  const [isEditingObjetivo, setIsEditingObjetivo] = useState(false);
  const [isEditingEstrategia, setIsEditingEstrategia] = useState(false);
  const [tempObjetivo, setTempObjetivo] = useState('');
  const [tempEstrategia, setTempEstrategia] = useState('');
  
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isPhysicalAssessmentModalOpen, setIsPhysicalAssessmentModalOpen] = useState(false);
  const [assessmentModalMode, setAssessmentModalMode] = useState<'add' | 'view'>('add');
  const [currentAssessmentData, setCurrentAssessmentData] = useState<AssessmentData | undefined>(undefined);
  const [previousAssessmentData, setPreviousAssessmentData] = useState<AssessmentData | undefined>(undefined);

  const [assessmentDate, setAssessmentDate] = useState('2024-04-15');
  const [assessmentPeriodicity, setAssessmentPeriodicity] = useState('none');
  const [customPeriodicity, setCustomPeriodicity] = useState('');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAssessmentNotesModalOpen, setIsAssessmentNotesModalOpen] = useState(false);
  const [currentAssessmentNotes, setCurrentAssessmentNotes] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditTargetModalOpen, setIsEditTargetModalOpen] = useState(false);
  const [targetForm, setTargetForm] = useState({
    objetivo: 'Perda de Massa Gorda',
    estrategia: 'Défice Calórico + Hipertrofia',
    dataFim: '2024-06-30',
    notas: 'Focar na ingestão de proteína',
    visibleToClient: true
  });

  const [trainingNote, setTrainingNote] = useState('O cliente referiu sentir menos dores no ombro durante este treino. A progressão de carga deverá manter-se ligeira e baseada em RPE.');
  const [isEditingTrainingNote, setIsEditingTrainingNote] = useState(false);
  const [exerciseNote, setExerciseNote] = useState('Supino Reto com Halteres: Focar na fase excêntrica controlada (3 segundos descida). Evitar esticar completamente os cotovelos no topo.');
  const [isEditingExerciseNote, setIsEditingExerciseNote] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'avaliacoes', label: 'Avaliações físicas', icon: Activity },
    { id: 'fotos', label: 'Fotos', icon: Image },
    { id: 'plano-treino', label: 'Plano de treino', icon: Dumbbell },
    { id: 'registar-treino', label: 'Registar Treino', icon: PlusCircle },
    { id: 'evolucao-treino', label: 'Evolução de treino', icon: TrendingUp },
    { id: 'plano-nutricao', label: 'Plano de nutrição', icon: Apple },
    { id: 'registo-nutricao', label: 'Registo de nutrição', icon: CheckSquare },
    { id: 'exames', label: 'Exames', icon: Stethoscope },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  // Calculate days in team
  const joinDate = new Date('2024-01-12'); // Mock date
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate days until payment expires
  const paymentDate = new Date('2024-04-15'); // Mock date
  const daysUntilPayment = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  let paymentColorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
  if (daysUntilPayment < 0) {
    paymentColorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
  } else if (daysUntilPayment < 5) {
    paymentColorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
  }

  // Calculate Volume Data
  const volumeData = WEEKS.map(week => {
    let totalVolume = 0;
    MOCK_EVOLUTION_DATA.forEach(exercise => {
      exercise.sets.forEach(set => {
        const record = set.records.find(r => r.week === week);
        if (record && record.kg && record.reps) {
          totalVolume += record.kg * record.reps;
        }
      });
    });
    return { week: `Semana ${week}`, volume: totalVolume };
  });

  const maxVolume = Math.max(...volumeData.map(d => d.volume));

  const CustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === maxVolume && value > 0) {
      return (
        <text x={x + width / 2} y={y + 20} fill="#fff" textAnchor="middle" fontSize="12" fontWeight="bold">
          {value}
        </text>
      );
    }
    return null;
  };

  // Calculate Exercise Details Data
  const exerciseDetailsData = MOCK_EVOLUTION_DATA.map(exercise => {
    // Filter out WU and FS sets for PR and 1RM calculations
    const workingSets = exercise.sets.filter(set => set.type === 'WS');
    
    let personalRecordKg = 0;
    let personalRecordReps = 0;
    let estimated1RM = 0;

    workingSets.forEach(set => {
      set.records.forEach(record => {
        if (record.kg && record.reps) {
          // Update PR (max kg, if tie max reps)
          if (record.kg > personalRecordKg || (record.kg === personalRecordKg && record.reps > personalRecordReps)) {
            personalRecordKg = record.kg;
            personalRecordReps = record.reps;
          }
          
          // Calculate 1RM (Epley formula: 1RM = w * (1 + r/30))
          const current1RM = record.kg * (1 + record.reps / 30);
          if (current1RM > estimated1RM) {
            estimated1RM = current1RM;
          }
        }
      });
    });

    // Chart Data for this exercise
    const chartData = WEEKS.map(week => {
      let maxKg = 0;
      let totalReps = 0;
      let volumeLoad = 0;
      
      const weekData: any = { week: `Semana ${week}` };

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
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Bar - Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detalhes do Cliente</h1>
      </div>

      {/* Top Bar - Client Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-500 overflow-hidden relative">
        
        {/* Expanded Content */}
        <div 
          className={`transition-all duration-500 ease-in-out origin-top ${
            activeTab === 'dashboard' 
              ? 'opacity-100 max-h-[1000px] p-6' 
              : 'opacity-0 max-h-0 p-0 m-0 border-none overflow-hidden'
          }`}
        >
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left Part */}
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              <img 
                src={client.avatar} 
                alt={client.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700 shadow-md flex-shrink-0" 
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Linha 1 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{client.name}</h2>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${client.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" 
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => setIsNotificationModalOpen(true)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" 
                        title="Enviar Notificação"
                      >
                        <Bell size={18} />
                      </button>
                      <button 
                        onClick={() => setIsNotesModalOpen(true)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" 
                        title="Notas"
                      >
                        <StickyNote size={18} />
                      </button>
                      <button 
                        onClick={() => setIsInfoModalOpen(true)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" 
                        title="Informação"
                      >
                        <Info size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Linha 2 */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <a href={`mailto:${client.name.toLowerCase().replace(' ', '.')}@email.com`} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer">
                      <Mail size={14} className="text-slate-400"/> {client.name.toLowerCase().replace(' ', '.')}@email.com
                    </a>
                    <button onClick={() => setIsContactModalOpen(true)} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer">
                      <Phone size={14} className="text-slate-400"/> {client.contact}
                    </button>
                    <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium">
                      <Calendar size={14}/> Há {diffDays} dias na equipa
                    </span>
                  </div>
                  
                  {/* Linha 3 */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <span>Masculino</span>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                    <span>12 Jan 1990 (34 anos)</span>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{client.plan}</span>
                  </div>
                  
                  {/* Linha 4 */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><Activity size={14} className="text-slate-400"/> Último login: Há 2 horas</span>
                      <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="flex items-center gap-1.5"><Dumbbell size={14} className="text-slate-400"/> Último treino: Ontem</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50">
                         <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                           CS
                         </div>
                         <span>PT: Carlos Silva</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50">
                         <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                           AM
                         </div>
                         <span>Nutri: Ana Martins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Part - Blocks */}
            <div className="flex flex-col gap-3 xl:w-[400px] flex-shrink-0">
              <div className="grid grid-cols-2 gap-3">
                {/* Próxima avaliação */}
                <div 
                  onClick={() => setIsAssessmentModalOpen(true)}
                  className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Próxima Avaliação</span>
                    <ArrowRight size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">15 Abr 2024</span>
                </div>
                
                {/* Peso inicial vs atual */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Peso (Evolução)</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">82kg</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">→</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">76.5kg</span>
                  </div>
                </div>
              </div>

              {/* Objetivo, Estratégia */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-4">
                <div 
                  className="flex flex-col flex-1 min-w-0 cursor-pointer group"
                  onClick={() => { setTempObjetivo(objetivo); setIsEditingObjetivo(true); }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Objetivo</span>
                    <Edit2 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white truncate" title={objetivo}>{objetivo}</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                <div 
                  className="flex flex-col flex-1 min-w-0 cursor-pointer group"
                  onClick={() => { setTempEstrategia(estrategia); setIsEditingEstrategia(true); }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estratégia</span>
                      <span className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-1.5 py-[1px] rounded-[4px] text-[9px] font-bold tracking-wide">
                        há 4 semanas
                      </span>
                    </div>
                    <Edit2 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white truncate" title={estrategia}>{estrategia}</span>
                </div>
              </div>

              {/* Data de vencimento */}
              <div 
                onClick={() => setIsPaymentModalOpen(true)}
                className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity group ${paymentColorClass}`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium opacity-80">Vencimento</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
                  </div>
                  <span className="text-sm font-bold">15 Abr 2024</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">
                    {daysUntilPayment < 0 ? 'Em atraso' : `${daysUntilPayment} dias restantes`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimized Content */}
        <div 
          className={`transition-all duration-500 ease-in-out origin-top ${
            activeTab !== 'dashboard' 
              ? 'opacity-100 max-h-[100px] p-4' 
              : 'opacity-0 max-h-0 p-0 m-0 border-none overflow-hidden'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50 dark:border-slate-700" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{client.name}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${client.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>Objetivo: {objetivo}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>Estratégia: {estrategia}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Editar">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setIsNotificationModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Enviar Notificação">
                <Bell size={16} />
              </button>
              <button onClick={() => setIsNotesModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Notas">
                <StickyNote size={16} />
              </button>
              <button onClick={() => setIsInfoModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Informação">
                <Info size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 rounded-t-2xl">
        <div className="flex overflow-x-auto hide-scrollbar gap-1 mx-auto w-max max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`group flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon size={18} className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className={`transition-all duration-300 overflow-hidden ${isActive ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Col 1: Métricas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Métricas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Treino */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center h-40">
                    <Dumbbell size={24} className="text-primary-500 mb-2" />
                    <p className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-1">85%</p>
                    <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Treino</h4>
                  </div>
                  {/* Nutrição */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center h-40">
                    <Apple size={24} className="text-emerald-500 mb-2" />
                    <p className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-1">92%</p>
                    <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nutrição</h4>
                  </div>
                  {/* Hábitos */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center h-40 md:col-span-2">
                    <CheckSquare size={24} className="text-blue-500 mb-2" />
                    <p className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-1">78%</p>
                    <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hábitos</h4>
                  </div>
                </div>
              </div>

              {/* Col 2: Objetivo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Objetivo e Estratégia</h3>
                  <button onClick={() => setIsEditTargetModalOpen(true)} className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
                
                {/* Target Information */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col h-[280px]">
                   <div className="mb-auto">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Objetivo</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{targetForm.objetivo}</p>
                   </div>
                   
                   {/* Combined Cards */}
                   <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-around p-4 mt-6">
                     <div className="flex flex-col items-center">
                       <Calendar size={20} className="text-amber-500 mb-2" />
                       <p className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1">4</p>
                       <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semanas</h4>
                     </div>
                     <div className="w-px h-12 bg-slate-200 dark:bg-slate-700/50"></div>
                     <div className="flex flex-col items-center">
                       <Calendar size={20} className="text-emerald-500 mb-2" />
                       <p className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1">3</p>
                       <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dias</h4>
                     </div>
                     <div className="w-px h-12 bg-slate-200 dark:bg-slate-700/50"></div>
                     <div className="flex flex-col items-center">
                       <Clock size={20} className="text-blue-500 mb-2" />
                       <p className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1">14</p>
                       <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Horas</h4>
                     </div>
                   </div>
                </div>
              </div>

              {/* Col 3 / Right Side: Feedbacks (col-span-1) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Feedbacks</h3>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold">5</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden flex flex-col h-[320px]">
                  {/* Tabs */}
                  <div className="flex border-b border-slate-200 dark:border-slate-700/50">
                    <button onClick={() => setActiveFeedbackTab('treino')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeFeedbackTab === 'treino' ? 'bg-white dark:bg-slate-800 text-primary-600 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Treino (1)</button>
                    <button onClick={() => setActiveFeedbackTab('checkin')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeFeedbackTab === 'checkin' ? 'bg-white dark:bg-slate-800 text-primary-600 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Check-in (1)</button>
                    <button onClick={() => setActiveFeedbackTab('notas')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeFeedbackTab === 'notas' ? 'bg-white dark:bg-slate-800 text-primary-600 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Notas (3)</button>
                  </div>
                  {/* Content */}
                  <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    {activeFeedbackTab === 'treino' && (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                            <Activity size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Treino A - Peito</h4>
                            <p className="text-xs text-slate-500 mt-1">Feedback pendente sobre a carga no supino.</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">Há 2 horas</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeFeedbackTab === 'checkin' && (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Check-in Semanal</h4>
                            <p className="text-xs text-slate-500 mt-1">Novo check-in submetido com fotos.</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">Ontem</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeFeedbackTab === 'notas' && (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                            <StickyNote size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Dúvida Execução</h4>
                            <p className="text-xs text-slate-500 mt-1">Cliente deixou nota no agachamento.</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">Há 3 dias</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                            <StickyNote size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Dor no ombro</h4>
                            <p className="text-xs text-slate-500 mt-1">Relato de dor leve durante o desenvolvimento.</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">Há 4 dias</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Nova Grid: Em Desenvolvimento & Calendário Assiduidade */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              
              {/* Col 1: Activity Log */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Registo de Atividades</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 h-[400px] overflow-y-auto custom-scrollbar">
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                    {/* Item 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          <CheckCircle2 size={16} />
                       </div>
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                             <h4 className="font-bold text-sm text-slate-800 dark:text-white">Treino A Concluído</h4>
                             <span className="text-[10px] font-bold text-slate-400">Há 2h</span>
                          </div>
                          <p className="text-xs text-slate-500">Duração: 45 min</p>
                       </div>
                    </div>
                    {/* Item 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          <LayoutDashboard size={16} />
                       </div>
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                             <h4 className="font-bold text-sm text-slate-800 dark:text-white">Login</h4>
                             <span className="text-[10px] font-bold text-slate-400">Ontem, 09:41</span>
                          </div>
                          <p className="text-xs text-slate-500">App móvel no iPhone</p>
                       </div>
                    </div>
                    {/* Item 3 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          <Activity size={16} />
                       </div>
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                             <h4 className="font-bold text-sm text-slate-800 dark:text-white">Novo Peso</h4>
                             <span className="text-[10px] font-bold text-slate-400">Há 3 dias</span>
                          </div>
                          <p className="text-xs text-slate-500">76.5 kg registado</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Notas do Cliente */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Notas Rápidas</h3>
                  <button onClick={() => setIsNotesModalOpen(true)} className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 dark:text-primary-400 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold px-2">
                    <Plus size={14} /> Adicionar
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                   {/* Note 1 */}
                   <div className="bg-[#fffdf0] dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200/50 dark:border-yellow-700/30 relative group shadow-sm">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                           <Edit2 size={12} />
                         </button>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">Focar no aquecimento do pilar tibial antes do treino de pernas pois queixou-se de desconforto.</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Há 1 semana, por Carlos</p>
                   </div>
                   {/* Note 2 */}
                   <div className="bg-[#f0f7ff] dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/30 relative group shadow-sm">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                           <Edit2 size={12} />
                         </button>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">Novo objetivo a longo prazo: Preparação para a maratona de fim de ano.</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">12 Jan 2024, por Carlos</p>
                   </div>
                </div>
              </div>

              {/* Col 3: Calendários à direita */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Assiduidade de Treino</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 space-y-6">
                  
                  {/* Status Login / Training */}
                  <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Último Login</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hoje, 09:41
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Último Treino</span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">Há 2 horas</span>
                    </div>
                  </div>

                  {/* Calendars side-by-side */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Mês Atual */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Março 2024</h4>
                      <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                          <div key={`mar-w-${i}`} className="text-center text-[9px] font-bold text-slate-400">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {/* 5 blank days (started friday) */}
                        {Array.from({length: 5}).map((_, i) => <div key={`mar-b-${i}`} className="aspect-square w-full max-w-[26px] mx-auto" />)}
                        {Array.from({length: 31}).map((_, i) => {
                          const d = i + 1;
                          const trained = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30].includes(d);
                          return (
                            <div key={`mar-${d}`} className={`aspect-square w-full max-w-[26px] mx-auto rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors ${trained ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer'}`}>
                              {d}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Mês Anterior */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Fevereiro 2024</h4>
                      <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                          <div key={`fev-w-${i}`} className="text-center text-[9px] font-bold text-slate-400">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {/* started thursday = 4 blank days */}
                        {Array.from({length: 4}).map((_, i) => <div key={`fev-b-${i}`} className="aspect-square w-full max-w-[26px] mx-auto" />)}
                        {Array.from({length: 29}).map((_, i) => {
                          const d = i + 1;
                          const trained = [1, 3, 6, 8, 10, 13, 15, 17, 20, 22, 24, 27, 29].includes(d);
                          return (
                            <div key={`fev-${d}`} className={`aspect-square w-full max-w-[26px] mx-auto rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors ${trained ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer'}`}>
                              {d}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'avaliacoes' && (
          <ClientAssessmentsTab
            client={client}
            assessments={MOCK_ASSESSMENTS}

            onNewAssessment={() => {
              setAssessmentModalMode('add');
              setCurrentAssessmentData(undefined);
              setIsPhysicalAssessmentModalOpen(true);
            }}
            onCompare={() => setIsCompareModalOpen(true)}
            onView={(assessment, prev) => {
              setAssessmentModalMode('view');
              setCurrentAssessmentData(assessment);
              setPreviousAssessmentData(prev);
              setIsPhysicalAssessmentModalOpen(true);
            }}
            onEdit={(assessment) => {
              setAssessmentModalMode('add');
              setCurrentAssessmentData(assessment);
              setIsPhysicalAssessmentModalOpen(true);
            }}
            onDelete={(id) => console.log("Eliminar avaliação:", id)}
            onExport={(id) => console.log("Exportar avaliação:", id)}
          />
        )}

        {activeTab === 'evolucao-treino' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Evolução de Treino</h3>
            </div>
            
            {/* Internal Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTrainingEvolutionTab('treino')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  trainingEvolutionTab === 'treino'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Evolução de treino
              </button>
              <button
                onClick={() => setTrainingEvolutionTab('exercicios')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
              <div className="space-y-6 animate-fade-in pt-4">
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
                        {WEEKS.map(week => (
                          <th key={week} colSpan={2} className="px-4 py-2 text-center border-b border-r-2 border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800/50">
                            Semana {week}
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
                      {MOCK_EVOLUTION_DATA.map((exercise, exIdx) => (
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
                              
                              const repsDiff = (record?.reps && prevRecord?.reps) ? record.reps - prevRecord.reps : 0;
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

                {/* Notas de Treino e Exercício */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative group">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                        <StickyNote size={16} className="text-primary-500" />
                        Nota de Treino
                      </h4>
                      {!isEditingTrainingNote && (
                        <button onClick={() => setIsEditingTrainingNote(true)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all rounded-lg hover:bg-white dark:hover:bg-slate-800">
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>
                    {isEditingTrainingNote ? (
                      <div className="animate-fade-in">
                        <textarea 
                          value={trainingNote}
                          onChange={(e) => setTrainingNote(e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-primary-500 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white resize-none outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px] custom-scrollbar"
                          autoFocus
                        />
                        <div className="flex justify-end mt-2">
                          <button onClick={() => setIsEditingTrainingNote(false)} className="px-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-500 transition-colors">Guardar Nota</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer" onClick={() => setIsEditingTrainingNote(true)}>
                        {trainingNote || <span className="opacity-50 italic">Clique para adicionar uma nota...</span>}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative group">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                        <MessageSquare size={16} className="text-indigo-500" />
                        Nota de Exercício
                      </h4>
                      {!isEditingExerciseNote && (
                        <button onClick={() => setIsEditingExerciseNote(true)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-lg hover:bg-white dark:hover:bg-slate-800">
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>
                    {isEditingExerciseNote ? (
                      <div className="animate-fade-in">
                        <textarea 
                          value={exerciseNote}
                          onChange={(e) => setExerciseNote(e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white resize-none outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px] custom-scrollbar"
                          autoFocus
                        />
                        <div className="flex justify-end mt-2">
                          <button onClick={() => setIsEditingExerciseNote(false)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">Guardar Nota</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer" onClick={() => setIsEditingExerciseNote(true)}>
                        {exerciseNote ? (
                          <span dangerouslySetInnerHTML={{ __html: exerciseNote.replace(/(Supino Reto com Halteres:)/, '<strong>$1</strong>') }} />
                        ) : (
                          <span className="opacity-50 italic">Clique para adicionar uma nota...</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Volume Total de Treino */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 sm:p-8">
                  <h4 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary-500" />
                    Volume Total de Treino
                  </h4>
                  <div className="h-[260px] w-full max-w-lg mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barCategoryGap={0}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} dy={10} />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                          width={60}
                          tickFormatter={(value) => `${value}kg`}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                          formatter={(value: number) => [`${value} kg`, 'Volume']}
                        />
                        <Bar dataKey="volume" label={<CustomBarLabel />}>
                          {volumeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.volume === maxVolume && entry.volume > 0 ? '#10b981' : '#cbd5e1'} className="dark:fill-slate-700" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detalhe por Exercício */}
                <div className="space-y-6">
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
                          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Evolução de Carga (kg)</h5>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={exercise.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
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
                          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Evolução de Repetições</h5>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={exercise.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                <Line type="monotone" dataKey="totalReps" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Total Reps" />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Volume Load */}
                        <div className="flex flex-col">
                          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Volume Load (kg)</h5>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={exercise.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content: Evolução de exercícios */}
            {trainingEvolutionTab === 'exercicios' && (
              <div className="space-y-6 animate-fade-in pt-4">
                {/* Internal Tabs from previous implementation */}
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

                {/* Content based on internal tab */}
                <div className="py-8 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <LineChart size={48} className="mb-4 opacity-20" />
                  <p>
                    {evolutionTab === 'exercicio' 
                      ? 'Gráficos e dados por exercício em desenvolvimento' 
                      : 'Gráficos e dados por grupo muscular em desenvolvimento'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plano-treino' && (
          <ClientTrainingPlanTab />
        )}

        {activeTab === 'calendario' && (
          <ClientCalendarTab />
        )}

        {activeTab === 'fotos' && (
          <ClientPhotosTab />
        )}

        {/* Nutrition Tab */}
        {activeTab === 'plano-nutricao' && (
          <ClientNutritionTab />
        )}

        {activeTab === 'exames' && (
          <ClientExamsTab />
        )}

        {activeTab === 'registo-nutricao' && (
          <ClientNutritionLogTab />
        )}

        {activeTab === 'registar-treino' && (
          <ClientRegisterWorkoutTab client={client} />
        )}

        {/* Placeholders for other tabs */}
        
        {activeTab === 'configuracoes' && (
          <ClientConfigTab client={client} />
        )}
      </div>

      <SendNotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        clients={[client]}
      />

      <ClientAssessmentModal
        isOpen={isPhysicalAssessmentModalOpen}
        onClose={() => setIsPhysicalAssessmentModalOpen(false)}
        mode={assessmentModalMode}
        initialData={currentAssessmentData}
        previousData={previousAssessmentData}
      />

      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        client={client}
      />

      <ClientNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        client={client}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        client={client}
      />

      <ClientInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        client={client}
      />

      {/* Modals for Editing Objetivo and Estratégia */}
      {isEditingObjetivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Editar Objetivo</h2>
            <input 
              type="text" 
              value={tempObjetivo} 
              onChange={(e) => setTempObjetivo(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-6 text-slate-800 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditingObjetivo(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">Cancelar</button>
              <button onClick={() => { setObjetivo(tempObjetivo); setIsEditingObjetivo(false); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {isEditingEstrategia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Editar Estratégia</h2>
            <input 
              type="text" 
              value={tempEstrategia} 
              onChange={(e) => setTempEstrategia(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-6 text-slate-800 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditingEstrategia(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">Cancelar</button>
              <button onClick={() => { setEstrategia(tempEstrategia); setIsEditingEstrategia(false); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Vencimento and Próxima Avaliação */}
      {isEditTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Editar Objetivo e Estratégia</h2>
              <button 
                onClick={() => setIsEditTargetModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Objetivo</label>
                  <input type="text" value={targetForm.objetivo} onChange={(e) => setTargetForm(p => ({...p, objetivo: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Estratégia</label>
                  <input type="text" value={targetForm.estrategia} onChange={(e) => setTargetForm(p => ({...p, estrategia: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data de Fim</label>
                  <input type="date" value={targetForm.dataFim} onChange={(e) => setTargetForm(p => ({...p, dataFim: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notas Rápidas (Interno)</label>
                  <textarea rows={3} value={targetForm.notas} onChange={(e) => setTargetForm(p => ({...p, notas: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white resize-none"></textarea>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div>
                   <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Visível para o cliente</h4>
                   <p className="text-xs text-slate-500">Mostrar na app móvel do cliente</p>
                 </div>
                 <button 
                   onClick={() => setTargetForm(p => ({...p, visibleToClient: !p.visibleToClient}))}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                     targetForm.visibleToClient ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
                   }`}
                 >
                   <span className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${
                     targetForm.visibleToClient ? 'translate-x-6' : 'translate-x-1'
                   }`} />
                 </button>
               </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 flex justify-end gap-3 flex-col sm:flex-row">
              <button onClick={() => setIsEditTargetModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => setIsEditTargetModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg transition-all flex items-center gap-2 justify-center">Guardar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configurar Avaliação</h2>
              <button 
                onClick={() => setIsAssessmentModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Data da Próxima Avaliação
                </label>
                <input 
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Periodicidade (Opcional)
                </label>
                <div className="relative">
                  <select 
                    value={assessmentPeriodicity}
                    onChange={(e) => setAssessmentPeriodicity(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="none">Não repetir</option>
                    <option value="7">A cada 7 dias</option>
                    <option value="15">A cada 15 dias</option>
                    <option value="30">A cada 30 dias (Mensal)</option>
                    <option value="60">A cada 60 dias (Bimestral)</option>
                    <option value="custom">Personalizado...</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {assessmentPeriodicity === 'custom' && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Repetir a cada:
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      value={customPeriodicity}
                      onChange={(e) => setCustomPeriodicity(e.target.value)}
                      placeholder="Ex: 45"
                      className="w-24 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">dias</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <button 
                onClick={() => { setIsAssessmentModalOpen(false); setActiveTab('avaliacoes'); }} 
                className="px-4 py-3 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors font-semibold text-sm sm:mr-auto"
              >
                Ir para Histórico
              </button>
              <button 
                onClick={() => setIsAssessmentModalOpen(false)} 
                className="px-5 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsAssessmentModalOpen(false)} 
                className="px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-bold text-sm border-2 border-transparent focus:ring-4 focus:ring-primary-500/20 shadow-lg shadow-primary-500/20 flex items-center gap-2"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">Vencimento da Subscrição</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">A subscrição vence a 15 Abr 2024 ({daysUntilPayment} dias restantes). Deseja ir para a página de Subscrição?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">Cancelar</button>
              <button onClick={() => { setIsPaymentModalOpen(false); setActiveTab('avaliacoes'); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-500/25">Ir para Avaliações</button>
            </div>
          </div>
        </div>
      )}

      {isAssessmentNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="text-primary-500" />
                Observações da Avaliação
              </h2>
              <button 
                onClick={() => setIsAssessmentNotesModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <textarea 
                value={currentAssessmentNotes}
                onChange={(e) => setCurrentAssessmentNotes(e.target.value)}
                rows={5}
                placeholder="Escreva aqui as suas observações sobre esta avaliação física..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsAssessmentNotesModalOpen(false)} 
                className="px-5 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsAssessmentNotesModalOpen(false)} 
                className="px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-bold text-sm border-2 border-transparent focus:ring-4 focus:ring-primary-500/20 shadow-lg shadow-primary-500/20 flex items-center gap-2"
              >
                Guardar Observações
              </button>
            </div>
          </div>
        </div>
      )}

      <ClientEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
      />
    </div>
  );
};

export default ClientDetailsView;
