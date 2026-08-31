import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  Activity, Dumbbell, CheckCircle2, ClipboardList, Clock, 
  X, Save, Filter, User, Utensils, FileText, Target, Flame, Heart, ArrowUpRight, TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClientTimelineTab } from './ClientTimelineTab';

type EventType = 'treino' | 'cardio' | 'sessao_pt' | 'checkin' | 'refeicao' | 'avaliacao' | 'registo' | 'outro';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  title: string;
  time?: string;
  details?: string;
  completed?: boolean;
}

const EVENT_CONFIG: Record<EventType, { label: string; icon: React.ElementType; colorClass: string; bgColor: string; borderColor: string; textColor: string }> = {
  treino: { label: 'Treino', icon: Dumbbell, colorClass: 'bg-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30', borderColor: 'border-indigo-100 dark:border-indigo-800/50', textColor: 'text-indigo-700 dark:text-indigo-400' },
  cardio: { label: 'Cardio', icon: Activity, colorClass: 'bg-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-900/30', borderColor: 'border-rose-100 dark:border-rose-800/50', textColor: 'text-rose-700 dark:text-rose-400' },
  sessao_pt: { label: 'Sessão PT', icon: User, colorClass: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/30', borderColor: 'border-amber-100 dark:border-amber-800/50', textColor: 'text-amber-700 dark:text-amber-400' },
  checkin: { label: 'Check-in', icon: CheckCircle2, colorClass: 'bg-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30', borderColor: 'border-emerald-100 dark:border-emerald-800/50', textColor: 'text-emerald-700 dark:text-emerald-400' },
  refeicao: { label: 'Refeições', icon: Utensils, colorClass: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/30', borderColor: 'border-orange-100 dark:border-orange-800/50', textColor: 'text-orange-700 dark:text-orange-400' },
  avaliacao: { label: 'Avaliações', icon: ClipboardList, colorClass: 'bg-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/30', borderColor: 'border-cyan-100 dark:border-cyan-800/50', textColor: 'text-cyan-700 dark:text-cyan-400' },
  registo: { label: 'Registos', icon: FileText, colorClass: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/30', borderColor: 'border-blue-100 dark:border-blue-800/50', textColor: 'text-blue-700 dark:text-blue-400' },
  outro: { label: 'Outro', icon: Target, colorClass: 'bg-slate-500', bgColor: 'bg-slate-50 dark:bg-slate-800', borderColor: 'border-slate-200 dark:border-slate-700', textColor: 'text-slate-700 dark:text-slate-300' },
};

// Mock Data
const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', date: '2026-04-10', type: 'treino', title: 'Treino Pernas', time: '10:00', details: 'Foco em quadríceps', completed: true },
  { id: '2', date: '2026-04-10', type: 'refeicao', title: 'Refeição Livre', time: '20:00', completed: true },
  { id: '3', date: '2026-04-12', type: 'cardio', title: 'Corrida 5km', time: '18:30', details: 'Passadeira', completed: true },
  { id: '4', date: '2026-04-14', type: 'avaliacao', title: 'Avaliação Física', time: '09:00' },
  { id: '5', date: '2026-04-15', type: 'treino', title: 'Costas/Bíceps', time: '11:00' },
  { id: '6', date: '2026-04-15', type: 'checkin', title: 'Check-in Semanal', completed: true },
  { id: '7', date: '2026-04-16', type: 'registo', title: 'Registo Diário' },
  { id: '8', date: '2026-04-16', type: 'sessao_pt', title: 'Sessão PT', time: '14:00' },
  { id: '9', date: '2026-04-18', type: 'cardio', title: 'Ciclismo', time: '08:00' },
  { id: '10', date: '2026-04-18', type: 'outro', title: 'Descanso Ativo' },
];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const ClientCalendarTab: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026 as default for mock
  const [activeSubTab, setActiveSubTab] = useState<'calendario' | 'timeline'>('calendario');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{date: string, events: CalendarEvent[]} | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Record<EventType, boolean>>({
    treino: true, cardio: true, sessao_pt: true, checkin: true, 
    refeicao: true, avaliacao: true, registo: true, outro: true
  });

  const [metricsPeriod, setMetricsPeriod] = useState<'semanal' | 'mensal'>('semanal');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    let day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday as first day (0)
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return MOCK_EVENTS.filter(e => e.date === dateStr && filters[e.type]);
  };

  const toggleFilter = (type: EventType) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const events = getEventsForDate(day, true);
    setSelectedDayEvents({ date: dateStr, events });
  };

  // Metrics Data (Mocked)
  const adherenceData = {
    semanal: {
      treinos: { done: 3, planned: 4 },
      cardio: { done: 2, planned: 3 },
      nutricao: { done: 6, planned: 7 },
      sessoes_pt: { done: 1, planned: 1 },
      checkins: { done: 1, planned: 1 },
      total: 82,
      previousTotal: 75
    },
    mensal: {
      treinos: { done: 12, planned: 16 },
      cardio: { done: 8, planned: 12 },
      nutricao: { done: 24, planned: 28 },
      sessoes_pt: { done: 4, planned: 4 },
      checkins: { done: 4, planned: 4 },
      total: 80,
      previousTotal: 85
    }
  };

  const currentAdherence = adherenceData[metricsPeriod];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveSubTab('calendario')}
          className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeSubTab === 'calendario' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Calendário
          {activeSubTab === 'calendario' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveSubTab('timeline')}
          className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeSubTab === 'timeline' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Timeline
          {activeSubTab === 'timeline' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></div>}
        </button>
      </div>

      {activeSubTab === 'calendario' && (
        <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
          
      {/* LEFT COLUMN: Calendar & Blocks */}
      <div className="flex-1 space-y-6">
        
        {/* Calendar Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button 
                onClick={prevMonth}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="w-32 text-center font-bold text-slate-800 dark:text-white text-sm">
                {MONTH_NAMES[month]} {year}
              </div>
              <button 
                onClick={nextMonth}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <button 
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              Hoje
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-colors border ${showFilters ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 border-primary-200 dark:border-primary-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filtros</span>
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-30"
                  >
                    <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Mostrar Eventos</p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {Object.entries(EVENT_CONFIG).map(([type, config]) => (
                        <label key={type} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={filters[type as EventType]}
                            onChange={() => toggleFilter(type as EventType)}
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${config.bgColor} ${config.textColor}`}>
                            <config.icon size={12} />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={() => {
                setModalDefaultDate(null);
                setIsEventModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-bold shadow-md shadow-primary-500/20 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Novo Evento</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50">
            {WEEK_DAYS.map(day => (
              <div key={day} className="py-2.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7 flex-1 min-h-[500px]">
            {/* Previous Month Days */}
            {Array.from({ length: firstDay }).map((_, i) => {
              const day = daysInPrevMonth - firstDay + i + 1;
              return (
                <div key={`prev-${i}`} className="p-1.5 border-b border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 opacity-50">
                  <span className="text-xs font-medium text-slate-400">{day}</span>
                </div>
              );
            })}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDate(day, true);
              const today = new Date();
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              // Or mock today:
              const isMockToday = day === 12 && month === 3 && year === 2026;
              const displayToday = isToday || isMockToday;
              
              return (
                <div 
                  key={`current-${day}`} 
                  onClick={() => handleDayClick(day)}
                  className={`relative p-1.5 border-b border-r border-slate-100 dark:border-slate-700/50 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/20 min-h-[90px] group ${
                    displayToday ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      displayToday 
                        ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30' 
                        : 'text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    }`}>
                      {day}
                    </span>
                    {events.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400">+{events.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {events.slice(0, 3).map(event => {
                      const config = EVENT_CONFIG[event.type];
                      return (
                        <div key={event.id} className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[10px] font-semibold border truncate transition-all ${config.bgColor} ${config.textColor} ${config.borderColor} ${event.completed ? 'opacity-60' : ''}`}>
                          <config.icon size={10} className="shrink-0" />
                          <span className="truncate">{event.time ? `${event.time} ` : ''}{event.title}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}

            {/* Next Month Days */}
            {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => {
              const day = i + 1;
              return (
                <div key={`next-${i}`} className="p-1.5 border-b border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 opacity-50">
                  <span className="text-xs font-medium text-slate-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Legenda:</span>
          {Object.entries(EVENT_CONFIG).map(([type, config]) => (
            <div key={type} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
              <config.icon size={12} />
              {config.label}
            </div>
          ))}
        </div>

        {/* Resumo Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TREINOS */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Treinos</h3>
                  <p className="text-xs text-slate-500">Resumo de atividade</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Realizados</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">12</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tempo Total</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">14h <span className="text-sm font-medium text-slate-500">30m</span></p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duração Média</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">1h <span className="text-sm font-medium text-slate-500">12m</span></p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Média Semanal</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">3 <span className="text-sm font-medium text-slate-500">treinos</span></p>
              </div>
            </div>

            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Últimos Treinos</h4>
            <div className="space-y-2 mb-4">
              {[
                { date: 'Hoje', name: 'Costas e Bíceps', time: '11:00' },
                { date: '12 Abr', name: 'Treino de Pernas', time: '10:00' },
                { date: '10 Abr', name: 'Peito e Tríceps', time: '18:30' }
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.date}</p>
                  </div>
                  <div className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    {t.time}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors">
              Ver Histórico Completo
            </button>
          </div>

          {/* CARDIO */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Cardio</h3>
                  <p className="text-xs text-slate-500">Resumo de atividade</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Realizadas</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">8</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tempo Total</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">4h <span className="text-sm font-medium text-slate-500">45m</span></p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Calorias Médias</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-1">
                  320 <Flame size={14} className="text-rose-500" />
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">BPM Médio</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-1">
                  135 <Heart size={14} className="text-rose-500" />
                </p>
              </div>
            </div>

            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Últimas Sessões</h4>
            <div className="space-y-2 mb-4">
              {[
                { date: '12 Abr', name: 'Corrida 5km', time: '18:30', duration: '30m' },
                { date: '08 Abr', name: 'Ciclismo', time: '07:00', duration: '45m' },
                { date: '05 Abr', name: 'HIIT', time: '19:00', duration: '20m' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.date} • {c.time}</p>
                  </div>
                  <div className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={12} /> {c.duration}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors">
              Ver Histórico Completo
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Metrics */}
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-6">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Métricas de Acompanhamento</h3>
            
            {/* Period Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
              <button 
                onClick={() => setMetricsPeriod('semanal')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${metricsPeriod === 'semanal' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Semanal
              </button>
              <button 
                onClick={() => setMetricsPeriod('mensal')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${metricsPeriod === 'mensal' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Mensal
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Adherence List */}
            {[
              { key: 'treinos', label: 'Treinos', icon: Dumbbell, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
              { key: 'cardio', label: 'Cardio', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30' },
              { key: 'nutricao', label: 'Nutrição', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
              { key: 'sessoes_pt', label: 'Sessões PT', icon: User, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
              { key: 'checkins', label: 'Check-ins', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
            ].map((item) => {
              const data = currentAdherence[item.key as keyof typeof currentAdherence] as {done: number, planned: number};
              const percentage = data.planned > 0 ? Math.round((data.done / data.planned) * 100) : 0;
              
              return (
                <div key={item.key}>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                        <item.icon size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{data.done}</span>
                      <span className="text-xs text-slate-400">/{data.planned}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-[10px] font-bold text-slate-400">{percentage}% adesão</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adesão Geral</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">{currentAdherence.total}%</span>
                  <span className={`flex items-center text-xs font-bold ${currentAdherence.total >= currentAdherence.previousTotal ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {currentAdherence.total >= currentAdherence.previousTotal ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingUp size={12} className="mr-0.5 rotate-180" />}
                    {Math.abs(currentAdherence.total - currentAdherence.previousTotal)}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Comparado com o {metricsPeriod === 'semanal' ? 'semana' : 'mês'} anterior.
            </p>
          </div>
        </div>
      </div>

      {/* Day Events Modal */}
      <AnimatePresence>
        {selectedDayEvents && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedDayEvents(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CalendarIcon size={18} className="text-primary-500" />
                    {selectedDayEvents.date.split('-').reverse().join('/')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Eventos agendados para este dia</p>
                </div>
                <button 
                  onClick={() => setSelectedDayEvents(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
                {selectedDayEvents.events.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon size={20} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Nenhum evento neste dia.</p>
                  </div>
                ) : (
                  selectedDayEvents.events.map(event => {
                    const config = EVENT_CONFIG[event.type];
                    return (
                      <div key={event.id} className={`p-3 rounded-xl border ${config.bgColor} ${config.borderColor} ${event.completed ? 'opacity-70' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.colorClass} text-white`}>
                              <config.icon size={16} />
                            </div>
                            <div>
                              <h4 className={`text-sm font-bold ${config.textColor}`}>{event.title}</h4>
                              {event.details && <p className={`text-xs mt-1 ${config.textColor} opacity-80`}>{event.details}</p>}
                            </div>
                          </div>
                          {event.time && (
                            <span className="text-xs font-bold px-2 py-1 bg-white/50 dark:bg-black/20 rounded-md">
                              {event.time}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => {
                    setModalDefaultDate(selectedDayEvents.date);
                    setSelectedDayEvents(null);
                    setIsEventModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 transition-all"
                >
                  <Plus size={16} />
                  Adicionar Evento Aqui
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsEventModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Adicionar Evento</h3>
                <button 
                  onClick={() => setIsEventModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipo de Evento</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                    {Object.entries(EVENT_CONFIG).map(([type, config]) => (
                      <option key={type} value={type}>{config.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Título</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Treino de Pernas"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data</label>
                    <input 
                      type="date" 
                      defaultValue={modalDefaultDate || `${year}-${String(month+1).padStart(2, '0')}-01`}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hora (Opcional)</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Detalhes (Opcional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Notas adicionais..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all"
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </div>
      )}

      {activeSubTab === 'timeline' && (
        <ClientTimelineTab />
      )}
    </div>
  );
};
