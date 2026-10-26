import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Dumbbell, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Scale, 
  HeartPulse, 
  Eye, 
  StickyNote, 
  Sparkles,
  ChevronRight,
  X,
  CheckSquare,
  Calendar,
  AlertCircle,
  BarChart2,
  Award,
  Filter,
  Edit2,
  Phone,
  Mail,
  Info,
  MessageSquare,
  Layers,
  Search,
  Droplets,
  Target,
  UserPlus,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { Client } from '../../types';
import { AssessmentData } from './ClientAssessmentModal';
import { MOCK_PLANS } from '../workouts/WorkoutsView';
import { 
  CustomAppleIcon, 
  CustomDumbbellIcon, 
  CustomTargetIcon, 
  CustomVitalIcon,
  CustomCalendarIcon,
  CustomBellIcon,
  CustomChatIcon
} from '../icons';

export interface ClientOverviewDashboardProps {
  client: Client;
  assessments: AssessmentData[];
  objetivo: string;
  estrategia: string;
  onEditObjetivo?: () => void;
  onEditEstrategia?: () => void;
  onEditTarget?: () => void;
  onOpenAssessmentModal?: () => void;
  onOpenNotesModal?: () => void;
  onOpenNotificationModal?: () => void;
  onOpenMessageModal?: () => void;
  onOpenContactModal?: () => void;
  onOpenInfoModal?: () => void;
  onOpenEditModal?: () => void;
  onOpenPaymentModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onUpdateClient?: (updatedFields: Partial<Client>) => Promise<void> | void;
}

type PeriodFilter = '1M' | '3M' | '6M' | 'tudo';

export const ClientOverviewDashboard: React.FC<ClientOverviewDashboardProps> = ({
  client,
  assessments,
  objetivo,
  estrategia,
  onEditObjetivo,
  onEditEstrategia,
  onEditTarget,
  onOpenAssessmentModal,
  onOpenNotesModal,
  onOpenNotificationModal,
  onOpenMessageModal,
  onOpenContactModal,
  onOpenInfoModal,
  onOpenEditModal,
  onOpenPaymentModal,
  onNavigateToTab,
  onUpdateClient,
}) => {
  // Modal for Assiduidade
  const [isAssiduidadeModalOpen, setIsAssiduidadeModalOpen] = useState(false);

  // Modal for Associar PT ou Nutri
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [assignedPt, setAssignedPt] = useState<string>(() => {
    if (typeof window !== 'undefined' && client?.id) {
      const saved = localStorage.getItem(`evolve_client_${client.id}_pt`);
      if (saved !== null) return saved;
    }
    return client.assignedPt || 'Tiago Silva (PT)';
  });
  const [assignedNutri, setAssignedNutri] = useState<string>(() => {
    if (typeof window !== 'undefined' && client?.id) {
      const saved = localStorage.getItem(`evolve_client_${client.id}_nutri`);
      if (saved !== null) return saved;
    }
    return client.assignedNutri || 'Dra. Inês Santos (Nutri)';
  });
  const [tempPt, setTempPt] = useState(assignedPt);
  const [tempNutri, setTempNutri] = useState(assignedNutri);

  // Period filter for Weight Evolution chart
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('3M');

  // Temporal metrics
  const joinDate = useMemo(() => new Date('2024-01-12'), []);
  const today = useMemo(() => new Date(), []);
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksCount = Math.floor(diffDays / 7);

  const paymentDate = useMemo(() => new Date('2024-04-15'), []);
  const daysUntilPayment = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Complete raw historical weight datasets with realistic intermediate weigh-in dates
  const allWeightData = useMemo(() => {
    const baseWeeklyLogs = [
      { date: '15 Out', rawDate: '2023-10-15', peso: 84.2, meta: 74.0 },
      { date: '22 Out', rawDate: '2023-10-22', peso: 83.9, meta: 74.0 },
      { date: '30 Out', rawDate: '2023-10-30', peso: 83.5, meta: 74.0 },
      { date: '07 Nov', rawDate: '2023-11-07', peso: 83.3, meta: 74.0 },
      { date: '15 Nov', rawDate: '2023-11-15', peso: 83.1, meta: 74.0 },
      { date: '22 Nov', rawDate: '2023-11-22', peso: 82.7, meta: 74.0 },
      { date: '30 Nov', rawDate: '2023-11-30', peso: 82.4, meta: 74.0 },
      { date: '08 Dez', rawDate: '2023-12-08', peso: 82.1, meta: 74.0 },
      { date: '15 Dez', rawDate: '2023-12-15', peso: 82.0, meta: 74.0 },
      { date: '22 Dez', rawDate: '2023-12-22', peso: 81.6, meta: 74.0 },
      { date: '02 Jan', rawDate: '2024-01-02', peso: 81.2, meta: 74.0 },
      { date: '12 Jan', rawDate: '2024-01-12', peso: 80.8, meta: 74.0 },
      { date: '20 Jan', rawDate: '2024-01-20', peso: 80.2, meta: 74.0 },
      { date: '29 Jan', rawDate: '2024-01-29', peso: 79.5, meta: 74.0 },
      { date: '07 Fev', rawDate: '2024-02-07', peso: 78.9, meta: 74.0 },
      { date: '15 Fev', rawDate: '2024-02-15', peso: 78.4, meta: 74.0 },
      { date: '22 Fev', rawDate: '2024-02-22', peso: 77.8, meta: 74.0 },
      { date: '02 Mar', rawDate: '2024-03-02', peso: 77.2, meta: 74.0 },
      { date: '09 Mar', rawDate: '2024-03-09', peso: 76.8, meta: 74.0 },
      { date: '15 Mar', rawDate: '2024-03-15', peso: 76.5, meta: 74.0 },
    ];

    // If client has custom assessments (or new evaluations added), merge them in
    if (assessments && assessments.length > 0) {
      const customDates = assessments.map(a => ({
        date: new Date(a.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        rawDate: a.date,
        peso: Number(a.weight) || 76.5,
        meta: 74.0
      }));
      const map = new Map<string, typeof baseWeeklyLogs[0]>();
      baseWeeklyLogs.forEach(p => map.set(p.rawDate, p));
      customDates.forEach(p => map.set(p.rawDate, p));
      return Array.from(map.values()).sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
    }

    return baseWeeklyLogs;
  }, [assessments]);

  // Filtered weight data based on selectedPeriod
  const filteredWeightData = useMemo(() => {
    switch (selectedPeriod) {
      case '1M':
        return allWeightData.slice(-5);
      case '3M':
        return allWeightData.slice(-11);
      case '6M':
        return allWeightData.slice(-18);
      case 'tudo':
      default:
        return allWeightData;
    }
  }, [allWeightData, selectedPeriod]);

  // Evolution stats
  const initialWeight = allWeightData[0]?.peso || 84.2;
  const currentWeight = allWeightData[allWeightData.length - 1]?.peso || 76.5;
  const targetWeight = 74.0;
  const totalWeightLoss = (initialWeight - currentWeight).toFixed(1);
  const remainingWeight = Math.max(0, currentWeight - targetWeight).toFixed(1);

  // Goal Progress Percentage
  const totalGoalDelta = Math.abs(initialWeight - targetWeight);
  const currentDelta = Math.abs(initialWeight - currentWeight);
  const goalProgressPercentage = Math.min(100, Math.max(0, Math.round((currentDelta / (totalGoalDelta || 1)) * 100)));

  // Goal Target Date Display
  const goalTargetDate = useMemo(() => {
    const raw = client.targetEndDate;
    if (raw) {
      try {
        if (raw.includes('-')) {
          const parts = raw.split('-');
          if (parts.length === 3) {
            const [y, m, d] = parts;
            const monthNames = [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            const mIdx = parseInt(m, 10) - 1;
            if (mIdx >= 0 && mIdx < 12) {
              return `${parseInt(d, 10)} ${monthNames[mIdx]} ${y}`;
            }
          }
        }
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      } catch (e) {}
      return raw;
    }
    return '30 Junho 2026';
  }, [client.targetEndDate]);

  // Current active plan name (without session count)
  const currentPlanName = useMemo(() => {
    let name = client.plan || 'Plano Hipertrofia';
    if (typeof window !== 'undefined' && client?.id) {
      const savedPlanId = localStorage.getItem(`evolve_client_${client.id}_active_workout_plan`);
      if (savedPlanId) {
        const found = MOCK_PLANS.find(p => p.id === savedPlanId);
        if (found) name = found.name;
      }
    }
    if (name.includes('•')) {
      name = name.split('•')[0].trim();
    }
    return name;
  }, [client]);

  // Remaining time for current plan (e.g. "4 semanas")
  const planRemainingTime = useMemo(() => {
    let targetEnd: string | undefined;
    if (typeof window !== 'undefined' && client?.id) {
      const savedPlanId = localStorage.getItem(`evolve_client_${client.id}_active_workout_plan`);
      if (savedPlanId) {
        const found = MOCK_PLANS.find(p => p.id === savedPlanId);
        if (found?.endDate) targetEnd = found.endDate;
      }
    }
    if (!targetEnd && client?.targetEndDate) {
      targetEnd = client.targetEndDate;
    }
    if (targetEnd) {
      const endD = new Date(targetEnd);
      const now = new Date();
      if (!isNaN(endD.getTime())) {
        const diffDays = Math.ceil((endD.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          const w = Math.ceil(diffDays / 7);
          return `${w} ${w === 1 ? 'semana' : 'semanas'}`;
        }
      }
    }
    return '4 semanas';
  }, [client]);

  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. CABEÇALHO DO CLIENTE (ÁREA DE IDENTIFICAÇÃO COMPLETA & COMPACTA)        */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          
          {/* Identificação Principal (Avatar + Nome + Estado + Contactos) */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={client.avatar} 
                alt={client.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-primary-500/20 shadow-md"
              />
              <span 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                  client.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                title={client.status === 'active' ? 'Cliente Ativo' : 'Cliente Inativo'}
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight truncate">
                  {client.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  client.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40' 
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {client.plan}
                </span>

                {/* Botão de Editar Cliente */}
                {onOpenEditModal && (
                  <button 
                    onClick={onOpenEditModal}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-primary-600 bg-slate-100 hover:bg-primary-50 dark:bg-slate-700/80 dark:hover:bg-primary-950/40 dark:text-slate-300 dark:hover:text-primary-300 border border-slate-200/80 dark:border-slate-600 transition-colors shadow-2xs cursor-pointer"
                    title="Editar Cliente"
                  >
                    <Edit2 size={12} className="text-primary-500" />
                    <span>Editar</span>
                  </button>
                )}

                {/* Botão de Associar PT ou Nutri */}
                <button 
                  onClick={() => {
                    setTempPt(assignedPt);
                    setTempNutri(assignedNutri);
                    setIsAssociateModalOpen(true);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
                    assignedPt || assignedNutri
                      ? 'text-primary-700 dark:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-900/40 border border-primary-200 dark:border-primary-800/60'
                      : 'text-slate-600 hover:text-primary-600 bg-slate-100 hover:bg-primary-50 dark:bg-slate-700/80 dark:hover:bg-primary-950/40 dark:text-slate-300 dark:hover:text-primary-300 border border-slate-200/80 dark:border-slate-600'
                  }`}
                  title="Associar ou gerir Personal Trainer e Nutricionista"
                >
                  <UserPlus size={12} className="text-primary-500" />
                  <span>
                    {assignedPt || assignedNutri ? (
                      <>
                        {assignedPt && <span>PT: {assignedPt.split(' ')[0]}</span>}
                        {assignedPt && assignedNutri && <span className="opacity-40 mx-0.5">•</span>}
                        {assignedNutri && <span>Nutri: {assignedNutri.split(' ')[0]}</span>}
                      </>
                    ) : (
                      'Associar PT ou Nutri'
                    )}
                  </span>
                </button>
              </div>

              {/* Informação Rápida */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{client.contact}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>{client.email || `${client.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  Há {diffDays} dias ({weeksCount} semanas) na equipa
                </span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas Relacionadas com o Cliente */}
          <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0 flex-wrap">
            {onOpenNotificationModal && (
              <button 
                onClick={onOpenNotificationModal}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50"
                title="Enviar Notificação"
              >
                <CustomBellIcon size={16} />
              </button>
            )}
            {onOpenMessageModal && (
              <button 
                onClick={onOpenMessageModal}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50"
                title="Enviar Mensagem"
              >
                <CustomChatIcon size={16} />
              </button>
            )}
            {onOpenNotesModal && (
              <button 
                onClick={onOpenNotesModal}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50"
                title="Notas Rápidas"
              >
                <StickyNote size={16} />
              </button>
            )}
            {onOpenInfoModal && (
              <button 
                onClick={onOpenInfoModal}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50"
                title="Ficha do Cliente"
              >
                <Info size={16} />
              </button>
            )}
            {onOpenContactModal && (
              <button 
                onClick={onOpenContactModal}
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50"
                title="Contacto / WhatsApp"
              >
                <Phone size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grid de Metadados Chave de Acompanhamento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          {/* Objetivo Principal */}
          <div 
            onClick={onEditObjetivo}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            title="Clique para editar o objetivo principal"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Objetivo</span>
              <Edit2 size={10} className="text-slate-400 group-hover:text-primary-500" />
            </div>
            <p className="font-bold text-slate-800 dark:text-white truncate" title={objetivo}>{objetivo}</p>
          </div>

          {/* Estratégia Atual */}
          <div 
            onClick={onEditEstrategia}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            title="Clique para editar a estratégia atual"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estratégia</span>
              <Edit2 size={10} className="text-slate-400 group-hover:text-primary-500" />
            </div>
            <p className="font-bold text-slate-800 dark:text-white truncate" title={estrategia}>{estrategia}</p>
          </div>

          {/* Data de Início */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Início</span>
            <p className="font-bold text-slate-800 dark:text-white truncate">12 Jan 2024</p>
          </div>

          {/* Tempo de Acompanhamento */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Acompanhamento</span>
            <p className="font-bold text-primary-600 dark:text-primary-400 truncate">Há {diffDays} dias</p>
          </div>

          {/* Próxima Avaliação */}
          <div 
            onClick={onOpenAssessmentModal}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            title="Abrir próxima avaliação"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Próx. Avaliação</span>
              <CustomVitalIcon size={12} className="text-primary-500" />
            </div>
            <p className="font-bold text-slate-800 dark:text-white truncate">15 Out 2026</p>
          </div>

          {/* Último Check-in */}
          <div 
            onClick={() => onNavigateToTab ? onNavigateToTab('avaliacoes') : onOpenAssessmentModal?.()}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            title="Ver histórico de check-ins"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Último Check-in</span>
              <CheckCircle2 size={12} className="text-purple-500" />
            </div>
            <p className="font-bold text-slate-800 dark:text-white truncate">Ontem, 18:30</p>
          </div>

          {/* Data de Término do Plano/Pacote */}
          <div 
            onClick={onOpenPaymentModal}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
            title="Detalhes do plano/pacote"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Término Plano</span>
              <span className="text-[9px] font-bold px-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {daysUntilPayment > 0 ? `${daysUntilPayment}d` : 'Ativo'}
              </span>
            </div>
            <p className="font-bold text-slate-800 dark:text-white truncate">31 Dez 2026</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OBJETIVO (BARRA CLEAN ESTILO REFERÊNCIA)                               */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 px-5 sm:px-6 py-3 sm:py-3.5 shadow-xs">
        <div className="flex items-center w-full">
          {/* Esquerda: Ícone Target + "Objetivo" no branding primário */}
          <div className="flex items-center gap-2.5 shrink-0 text-primary-500 dark:text-primary-400">
            <Target size={18} className="shrink-0" />
            <span className="text-sm font-semibold tracking-wide">
              Objetivo
            </span>
          </div>

          {/* Linha horizontal fina conectora */}
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60 mx-4 sm:mx-6 min-w-4"></div>

          {/* Centro: Duração / Tempo no meio com separadores • */}
          <div className="shrink-0 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 select-none tracking-tight">
            <span>7 semanas</span>
            <span className="text-slate-400 dark:text-slate-500 mx-2">•</span>
            <span>2 dias</span>
            <span className="text-slate-400 dark:text-slate-500 mx-2">•</span>
            <span>4 horas</span>
          </div>

          {/* Linha horizontal fina conectora à direita */}
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60 ml-4 sm:mx-6 min-w-4"></div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CARDS DE INDICADORES PRINCIPAIS (HIERARQUIA VISUAL UNIFICADA)          */}
      {/* ========================================================================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: Peso atual */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <Scale size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Peso atual
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                Estável
              </span>
            </div>

            <div className="my-1.5 flex items-baseline">
              <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">69,0</span>
              <span className="text-xs font-bold text-slate-400 ml-1">kg</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingDown size={13} className="shrink-0" />
                <span>Variação: -4,0 kg</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                Inicial: 65,0 kg
              </span>
            </div>
          </div>

          {/* Card 2: Treinos realizados */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Dumbbell size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Treinos realizados
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                Este mês
              </span>
            </div>

            <div className="my-1.5">
              <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">18</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Este mês: 8
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                Total: 18
              </span>
            </div>
          </div>

          {/* Card 3: Feedbacks enviados */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Feedbacks enviados
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                Este mês
              </span>
            </div>

            <div className="my-1.5">
              <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">12</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Este mês: 4
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                Total: 12
              </span>
            </div>
          </div>

          {/* Card 4: Água ingerida */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Droplets size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Água ingerida
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                Média diária
              </span>
            </div>

            <div className="my-1.5 flex items-baseline">
              <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">2,8</span>
              <span className="text-xs font-bold text-slate-400 ml-1">L</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Meta: 3,0 L
              </span>
              <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
                93% da meta
              </span>
            </div>
          </div>

          {/* Card 5: Cardios realizados */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <HeartPulse size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Cardios realizados
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                Este mês
              </span>
            </div>

            <div className="my-1.5">
              <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">4 / 5</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                80% esta semana
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                Meta: 5/sem
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ÚLTIMAS INTERAÇÕES E ATIVIDADE RECENTE (COM ACESSO A ASSIDUIDADE)      */}
      {/* ========================================================================= */}
      <section 
        onClick={() => setIsAssiduidadeModalOpen(true)}
        className="group relative bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900/80 dark:via-slate-850 dark:to-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary-500/60 dark:hover:border-primary-500/60 transition-all cursor-pointer overflow-hidden"
        title="Clique para abrir assiduidade completa e histórico de treinos"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Últimas Interações & Atividade Recente
            </h3>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">• 4 Principais Acontecimentos</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform">
            <span>Ver Assiduidade & Histórico Completo</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Linha única de 4 acontecimentos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* 1: Último Login */}
          <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 group-hover:border-slate-200 dark:group-hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Activity size={13} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Último Login</span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white truncate">Hoje, 09:41</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">App iOS • Sessão ativa</p>
          </div>

          {/* 2: Último Treino */}
          <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 group-hover:border-slate-200 dark:group-hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Dumbbell size={13} className="text-primary-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Último Treino</span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white truncate">Há 2 horas</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">Treino A • Peito & Tríceps</p>
          </div>

          {/* 3: Último Check-in */}
          <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 group-hover:border-slate-200 dark:group-hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <CheckCircle2 size={13} className="text-purple-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Último Check-in</span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white truncate">Ontem, 18:30</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">Semana #18 (Fotos + Peso)</p>
          </div>

          {/* 4: Último Cardio */}
          <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 group-hover:border-slate-200 dark:group-hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <HeartPulse size={13} className="text-rose-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Último Cardio</span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white truncate">Há 1 dia</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">35 min • Corrida Z2 (4.2 km)</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EVOLUÇÃO TEMPORAL DO PESO (COM DADOS À DIREITA E ALTURA REDUZIDA)      */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-primary-500" />
              Evolução Temporal do Peso
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Trajetória das pesagens do atleta com meta traçada de {targetWeight} kg
            </p>
          </div>

          {/* Seletor de Período (1 mês, 3 meses, 6 meses, Tudo) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl self-start sm:self-auto">
            {(['1M', '3M', '6M', 'tudo'] as PeriodFilter[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {period === 'tudo' ? 'Tudo' : period}
              </button>
            ))}
          </div>
        </div>

        {/* Layout lado a lado: Gráfico à esquerda + 4 Dados à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          {/* Gráfico de Evolução (3 colunas em lg) */}
          <div className="lg:col-span-3 h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredWeightData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightBlueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity={0.45} />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dy={10} 
                />
                <YAxis 
                  domain={[(dataMin: number) => Math.min(Math.floor(dataMin - 1), targetWeight - 1), (dataMax: number) => Math.ceil(dataMax + 1)]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dx={-5} 
                  unit="kg"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    borderRadius: '12px', 
                    color: '#f8fafc', 
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}
                  formatter={(val: any) => [`${val} kg`, 'Peso']}
                />
                <ReferenceLine 
                  y={targetWeight} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                  strokeWidth={2} 
                  label={{ value: `Meta: ${targetWeight}kg`, position: 'top', fill: '#10b981', fontSize: 11, fontWeight: 'bold' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="peso" 
                  name="Peso Real" 
                  stroke="#0284c7" 
                  strokeWidth={3} 
                  fillOpacity={1}
                  fill="url(#weightBlueGradient)" 
                  dot={{ r: 3.5, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }} 
                  activeDot={{ r: 6.5, fill: '#0369a1', stroke: '#ffffff', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 4 Indicadores Chave à direita (1 coluna em lg) */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peso Inicial</span>
              <span className="text-base font-black text-slate-700 dark:text-slate-300 mt-0.5">{initialWeight} kg</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peso Atual</span>
              <span className="text-base font-black text-primary-600 dark:text-primary-400 mt-0.5">{currentWeight} kg</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variação Total</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">-{totalWeightLoss} kg</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nº de Registos</span>
              <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{filteredWeightData.length} Pesagens</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PLANO ATUAL & 4 PILARES DE ADESÃO                                      */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-primary-500" />
              Plano Atual
            </h3>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/50">
              {planRemainingTime}
            </span>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            {currentPlanName}
          </span>
        </div>

        {/* 4 Pilares de Adesão */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Pilar 1: Treino */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              <CustomDumbbellIcon size={20} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl font-black text-slate-800 dark:text-white shrink-0">88%</span>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider truncate">
                  Adesão ao Treino
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  14 de 16 treinos realizados
                </p>
              </div>
            </div>
          </div>

          {/* Pilar 2: Dieta / Nutrição */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CustomAppleIcon size={20} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl font-black text-slate-800 dark:text-white shrink-0">92%</span>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider truncate">
                  Adesão à Dieta
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  26 de 28 dias em cumprimento
                </p>
              </div>
            </div>
          </div>

          {/* Pilar 3: Cardio */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <HeartPulse size={20} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl font-black text-slate-800 dark:text-white shrink-0">85%</span>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider truncate">
                  Adesão ao Cardio
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  90 de 105 min/semana feitos
                </p>
              </div>
            </div>
          </div>

          {/* Pilar 4: Hábitos */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <CheckSquare size={20} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl font-black text-slate-800 dark:text-white shrink-0">78%</span>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider truncate">
                  Adesão aos Hábitos
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Água 2.5L e sono 7.5h média
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* POP-UP / MODAL: ASSIDUIDADE DE TREINO & HISTÓRICO COMPLETO                 */}
      {/* ========================================================================= */}
      {isAssiduidadeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Assiduidade de Treino & Histórico
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Frequência mensal, presenças assinaladas e atividade de {client.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAssiduidadeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Quick Status Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Último Login</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1">Hoje, 09:41</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Último Treino</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1">Há 2 horas</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assiduidade Mensal</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1">88% (14 treinos)</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sequência Atual</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1">6 semanas</p>
                </div>
              </div>

              {/* Calendars Section */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <CustomCalendarIcon size={16} className="text-primary-500" />
                  Presenças e Frequência por Calendário
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Month Calendar */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-none">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">
                        Março 2024
                      </h5>
                      <span className="text-[10px] font-medium text-slate-400">Mês Atual</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2 border-b border-slate-100 dark:border-slate-700/50 pb-1">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <div key={`m-d-${i}`} className="text-center text-[10px] font-semibold text-slate-400">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={`m-b-${i}`} className="aspect-square flex items-center justify-center" />
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => {
                        const d = i + 1;
                        const trained = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30].includes(d);
                        return (
                          <div key={`m-day-${d}`} className="aspect-square flex items-center justify-center">
                            <span 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all ${
                                trained 
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 font-semibold' 
                                  : 'text-slate-500 dark:text-slate-400 font-normal hover:bg-slate-100 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              {d}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Previous Month Calendar */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-none">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">
                        Fevereiro 2024
                      </h5>
                      <span className="text-[10px] font-medium text-slate-400">Mês Anterior</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2 border-b border-slate-100 dark:border-slate-700/50 pb-1">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <div key={`f-d-${i}`} className="text-center text-[10px] font-semibold text-slate-400">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`f-b-${i}`} className="aspect-square flex items-center justify-center" />
                      ))}
                      {Array.from({ length: 29 }).map((_, i) => {
                        const d = i + 1;
                        const trained = [1, 3, 6, 8, 10, 13, 15, 17, 20, 22, 24, 27, 29].includes(d);
                        return (
                          <div key={`f-day-${d}`} className="aspect-square flex items-center justify-center">
                            <span 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all ${
                                trained 
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 font-semibold' 
                                  : 'text-slate-500 dark:text-slate-400 font-normal hover:bg-slate-100 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              {d}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-4 pt-2 text-[11px] text-slate-400 justify-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-200 dark:bg-blue-900/50 dark:border-blue-700/60 inline-block" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Treino Realizado</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block" />
                    <span>Sem Treino / Descanso</span>
                  </span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Registo Cronológico de Atividades
                </h4>

                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Treino A Concluído</p>
                        <p className="text-[11px] text-slate-400">Duração: 45 min • Carga total: 4.820 kg</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Hoje, 10:26</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Scale size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Check-in Semanal Registado</p>
                        <p className="text-[11px] text-slate-400">Peso: 76.5 kg (-0.4 kg) • 3 fotos enviadas</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Ontem, 18:30</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <HeartPulse size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Sessão de Cardio Z2</p>
                        <p className="text-[11px] text-slate-400">35 min • 4.2 km • 285 kcal</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Há 2 dias</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-850">
              <button 
                onClick={() => setIsAssiduidadeModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSOCIAR PERSONAL TRAINER OU NUTRICIONISTA                         */}
      {/* ========================================================================= */}
      {isAssociateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Associar PT ou Nutri
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Definir profissionais atribuídos a {client.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAssociateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Personal Trainer */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <CustomDumbbellIcon size={14} className="text-primary-500" />
                  Personal Trainer (PT)
                </label>
                <select
                  value={tempPt}
                  onChange={(e) => setTempPt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sem Personal Trainer atribuído</option>
                  <option value="Carlos Bernardo (Head Coach & PT)">Carlos Bernardo (Head Coach & PT)</option>
                  <option value="Tiago Silva (Personal Trainer)">Tiago Silva (Personal Trainer)</option>
                  <option value="Marta Fernandes (Personal Trainer)">Marta Fernandes (Personal Trainer)</option>
                  <option value="Gonçalo Ramos (Personal Trainer)">Gonçalo Ramos (Personal Trainer)</option>
                </select>
              </div>

              {/* Nutricionista */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <CustomAppleIcon size={14} className="text-emerald-500" />
                  Nutricionista (Nutri)
                </label>
                <select
                  value={tempNutri}
                  onChange={(e) => setTempNutri(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sem Nutricionista atribuído</option>
                  <option value="Dra. Inês Santos (Nutrição Desportiva)">Dra. Inês Santos (Nutrição Desportiva)</option>
                  <option value="Dr. André Costa (Nutrição Clínica & Performance)">Dr. André Costa (Nutrição Clínica & Performance)</option>
                  <option value="Dra. Mariana Vaz (Nutrição & Reeducação)">Dra. Mariana Vaz (Nutrição & Reeducação)</option>
                </select>
              </div>

              {/* Informação do Plano */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Plano Contratado:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{client.plan}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAssociateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setAssignedPt(tempPt);
                  setAssignedNutri(tempNutri);
                  if (typeof window !== 'undefined' && client?.id) {
                    localStorage.setItem(`evolve_client_${client.id}_pt`, tempPt);
                    localStorage.setItem(`evolve_client_${client.id}_nutri`, tempNutri);
                  }
                  if (onUpdateClient) {
                    await onUpdateClient({
                      assignedPt: tempPt,
                      assignedNutri: tempNutri
                    });
                  }
                  setIsAssociateModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={14} />
                Guardar Atribuição
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
