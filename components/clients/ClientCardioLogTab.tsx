import React, { useState } from 'react';
import { 
  Activity, Clock, Flame, Plus, Search, Filter, 
  Trash2, Edit2, Heart, TrendingUp, ChevronDown, 
  X, Check, AlertCircle, Calendar as CalendarLucide, 
  Gauge, Compass, ArrowUpRight, Zap
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { Client } from '../../types';

export interface CardioLog {
  id: string;
  type: 'corrida' | 'passadeira' | 'bicicleta' | 'ciclismo' | 'elitica' | 'remo' | 'caminhada' | 'escadas' | 'hiit' | 'natacao';
  typeName: string;
  date: string;
  time: string;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgPace?: string; // e.g. "5'20\" /km"
  avgSpeed?: number; // km/h
  intensityZone: 'Zona 1 (Recuperação)' | 'Zona 2 (Endurance)' | 'Zona 3 (Aeróbica)' | 'Zona 4 (Limiar)' | 'Zona 5 (VO2 Máx)';
  rpe: number; // 1-10
  incline?: number; // % (passadeira)
  resistanceLevel?: number; // (bike/elitica)
  notes?: string;
  source: 'Manual' | 'Garmin' | 'Apple Health' | 'Strava' | 'Polar';
}

const MOCK_CARDIO_LOGS: CardioLog[] = [
  {
    id: 'c1',
    type: 'corrida',
    typeName: 'Corrida Exterior',
    date: '2024-06-28',
    time: '07:30',
    durationMinutes: 45,
    distanceKm: 8.2,
    caloriesBurned: 540,
    avgHeartRate: 152,
    maxHeartRate: 174,
    avgPace: '5\'29" /km',
    avgSpeed: 10.9,
    intensityZone: 'Zona 3 (Aeróbica)',
    rpe: 7,
    notes: 'Ritmo constante em percurso plano. Boa sensação de respiração e pernas frescas.',
    source: 'Garmin'
  },
  {
    id: 'c2',
    type: 'passadeira',
    typeName: 'Passadeira com Inclinação',
    date: '2024-06-26',
    time: '18:15',
    durationMinutes: 30,
    distanceKm: 4.5,
    caloriesBurned: 320,
    avgHeartRate: 142,
    maxHeartRate: 158,
    avgPace: '6\'40" /km',
    avgSpeed: 9.0,
    incline: 3.5,
    intensityZone: 'Zona 2 (Endurance)',
    rpe: 6,
    notes: 'Aquecimento pós-treino de musculação de membros superiores.',
    source: 'Manual'
  },
  {
    id: 'c3',
    type: 'bicicleta',
    typeName: 'Spinning / Bicicleta Estática',
    date: '2024-06-24',
    time: '12:45',
    durationMinutes: 40,
    distanceKm: 18.0,
    caloriesBurned: 410,
    avgHeartRate: 148,
    maxHeartRate: 165,
    avgSpeed: 27.0,
    resistanceLevel: 8,
    intensityZone: 'Zona 3 (Aeróbica)',
    rpe: 7,
    notes: 'Intervalos de 1 min moderado / 1 min forte durante 20 minutos centrais.',
    source: 'Apple Health'
  },
  {
    id: 'c4',
    type: 'remo',
    typeName: 'Remo Concept2',
    date: '2024-06-21',
    time: '08:00',
    durationMinutes: 20,
    distanceKm: 4.8,
    caloriesBurned: 230,
    avgHeartRate: 156,
    maxHeartRate: 172,
    avgPace: '2\'05" /500m',
    intensityZone: 'Zona 4 (Limiar)',
    rpe: 8,
    notes: 'Foco na cadência de 26-28 spm e extensão completa das pernas.',
    source: 'Manual'
  },
  {
    id: 'c5',
    type: 'caminhada',
    typeName: 'Caminhada Rápida',
    date: '2024-06-19',
    time: '19:30',
    durationMinutes: 50,
    distanceKm: 4.2,
    caloriesBurned: 220,
    avgHeartRate: 115,
    maxHeartRate: 128,
    avgPace: '11\'54" /km',
    intensityZone: 'Zona 1 (Recuperação)',
    rpe: 4,
    notes: 'Recuperação ativa no dia de descanso programado.',
    source: 'Strava'
  }
];

const CARDIO_TYPES: { id: CardioLog['type']; name: string; color: string }[] = [
  { id: 'corrida', name: 'Corrida', color: 'from-blue-500 to-cyan-500' },
  { id: 'passadeira', name: 'Passadeira', color: 'from-cyan-500 to-teal-500' },
  { id: 'bicicleta', name: 'Bicicleta Estática', color: 'from-emerald-500 to-green-500' },
  { id: 'ciclismo', name: 'Ciclismo Exterior', color: 'from-lime-500 to-emerald-500' },
  { id: 'elitica', name: 'Elítica', color: 'from-violet-500 to-purple-500' },
  { id: 'remo', name: 'Remo', color: 'from-amber-500 to-orange-500' },
  { id: 'escadas', name: 'Escadas (Stairmaster)', color: 'from-rose-500 to-pink-500' },
  { id: 'hiit', name: 'HIIT Cardio', color: 'from-red-500 to-rose-600' },
  { id: 'caminhada', name: 'Caminhada', color: 'from-slate-500 to-slate-700' },
  { id: 'natacao', name: 'Natação', color: 'from-sky-500 to-blue-600' }
];

interface ClientCardioLogTabProps {
  client?: Client;
}

export const ClientCardioLogTab: React.FC<ClientCardioLogTabProps> = ({ client }) => {
  const [logs, setLogs] = useState<CardioLog[]>(MOCK_CARDIO_LOGS);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'todos' | 'semana' | 'mes'>('todos');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    type: CardioLog['type'];
    typeName: string;
    date: string;
    time: string;
    durationMinutes: number;
    distanceKm: string;
    caloriesBurned: number;
    avgHeartRate: string;
    maxHeartRate: string;
    avgPace: string;
    avgSpeed: string;
    intensityZone: CardioLog['intensityZone'];
    rpe: number;
    incline: string;
    resistanceLevel: string;
    notes: string;
    source: CardioLog['source'];
  }>({
    type: 'corrida',
    typeName: 'Corrida',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    durationMinutes: 30,
    distanceKm: '5.0',
    caloriesBurned: 350,
    avgHeartRate: '145',
    maxHeartRate: '165',
    avgPace: '6\'00" /km',
    avgSpeed: '10.0',
    intensityZone: 'Zona 2 (Endurance)',
    rpe: 6,
    incline: '',
    resistanceLevel: '',
    notes: '',
    source: 'Manual'
  });

  // Calculate totals
  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const totalKm = logs.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0);
  const totalCalories = logs.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  
  const hrLogs = logs.filter(l => l.avgHeartRate);
  const avgHR = hrLogs.length > 0 ? Math.round(hrLogs.reduce((acc, l) => acc + (l.avgHeartRate || 0), 0) / hrLogs.length) : 0;

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (selectedTypeFilter !== 'todos' && log.type !== selectedTypeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchType = log.typeName.toLowerCase().includes(q);
      const matchNotes = (log.notes || '').toLowerCase().includes(q);
      const matchZone = log.intensityZone.toLowerCase().includes(q);
      if (!matchType && !matchNotes && !matchZone) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingLogId(null);
    setFormData({
      type: 'corrida',
      typeName: 'Corrida',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      durationMinutes: 30,
      distanceKm: '',
      caloriesBurned: 300,
      avgHeartRate: '',
      maxHeartRate: '',
      avgPace: '',
      avgSpeed: '',
      intensityZone: 'Zona 2 (Endurance)',
      rpe: 6,
      incline: '',
      resistanceLevel: '',
      notes: '',
      source: 'Manual'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (log: CardioLog) => {
    setEditingLogId(log.id);
    setFormData({
      type: log.type,
      typeName: log.typeName,
      date: log.date,
      time: log.time,
      durationMinutes: log.durationMinutes,
      distanceKm: log.distanceKm !== undefined ? String(log.distanceKm) : '',
      caloriesBurned: log.caloriesBurned,
      avgHeartRate: log.avgHeartRate !== undefined ? String(log.avgHeartRate) : '',
      maxHeartRate: log.maxHeartRate !== undefined ? String(log.maxHeartRate) : '',
      avgPace: log.avgPace || '',
      avgSpeed: log.avgSpeed !== undefined ? String(log.avgSpeed) : '',
      intensityZone: log.intensityZone,
      rpe: log.rpe,
      incline: log.incline !== undefined ? String(log.incline) : '',
      resistanceLevel: log.resistanceLevel !== undefined ? String(log.resistanceLevel) : '',
      notes: log.notes || '',
      source: log.source
    });
    setIsModalOpen(true);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar este registo de cardio?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const typeObj = CARDIO_TYPES.find(t => t.id === formData.type);
    const newLog: CardioLog = {
      id: editingLogId || `cardio_${Date.now()}`,
      type: formData.type,
      typeName: formData.typeName || typeObj?.name || 'Cardio',
      date: formData.date,
      time: formData.time || '10:00',
      durationMinutes: Number(formData.durationMinutes) || 0,
      distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : undefined,
      caloriesBurned: Number(formData.caloriesBurned) || 0,
      avgHeartRate: formData.avgHeartRate ? parseInt(formData.avgHeartRate) : undefined,
      maxHeartRate: formData.maxHeartRate ? parseInt(formData.maxHeartRate) : undefined,
      avgPace: formData.avgPace || undefined,
      avgSpeed: formData.avgSpeed ? parseFloat(formData.avgSpeed) : undefined,
      intensityZone: formData.intensityZone,
      rpe: Number(formData.rpe) || 6,
      incline: formData.incline ? parseFloat(formData.incline) : undefined,
      resistanceLevel: formData.resistanceLevel ? parseInt(formData.resistanceLevel) : undefined,
      notes: formData.notes,
      source: formData.source
    };

    if (editingLogId) {
      setLogs(prev => prev.map(l => l.id === editingLogId ? newLog : l));
    } else {
      setLogs(prev => [newLog, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Goal Progress & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sessions */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Sessões
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {totalSessions}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp size={12} /> Realizadas
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 border border-primary-100 dark:border-primary-900/50 flex items-center justify-center shrink-0">
            <Activity size={20} />
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Tempo Total
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {totalHours > 0 ? `${totalHours}h ${remainingMins}m` : `${totalMinutes}m`}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              Média {totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0} min/sessão
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Distância
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {totalKm.toFixed(1)} <span className="text-sm font-semibold text-slate-400">km</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              Volume acumulado
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shrink-0">
            <Compass size={20} />
          </div>
        </div>

        {/* Calories */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Calorias
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {totalCalories.toLocaleString()} <span className="text-sm font-semibold text-slate-400">kcal</span>
            </div>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 mt-0.5">
              <Flame size={12} /> Gasto energético
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 border border-orange-100 dark:border-orange-900/50 flex items-center justify-center shrink-0">
            <Flame size={20} />
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              FC Média
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {avgHR} <span className="text-sm font-semibold text-slate-400">bpm</span>
            </div>
            <span className="text-[11px] text-rose-500 font-medium mt-0.5 block">
              Zonas 2 a 3 predominantes
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center shrink-0">
            <Heart size={20} />
          </div>
        </div>
      </div>

      {/* Target Progress Bar / Meta Semanal */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-700/60 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-primary-400" />
              <h3 className="font-bold text-base">Meta Semanal de Cardio do Cliente</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                150 min planeados
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Objetivo: Estimular a biogénese mitocondrial e otimizar o défice calórico sem prejudicar a recuperação muscular.
            </p>
          </div>
          <div className="text-right sm:self-center shrink-0">
            <span className="text-2xl font-black text-primary-400">125</span>
            <span className="text-sm font-medium text-slate-400"> / 150 min</span>
            <span className="ml-2 text-xs font-bold text-emerald-400">(83%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-primary-500/50" 
            style={{ width: '83.3%' }}
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Left: Filters & Search */}
        <div className="flex items-center gap-3 flex-wrap flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar cardio, zona, notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
            />
          </div>

          {/* Activity Type Filter */}
          <div className="relative">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="todos">Todas as Atividades</option>
              {CARDIO_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98] text-sm shrink-0"
        >
          <Plus size={16} />
          Registar Sessão de Cardio
        </button>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Activity size={28} />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">
            Nenhum registo de cardio encontrado
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Registe a primeira sessão de cardio do cliente ou ajuste os filtros selecionados.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} /> Registar agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map(log => {
            const typeObj = CARDIO_TYPES.find(t => t.id === log.type);
            return (
              <div 
                key={log.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 transition-all shadow-sm group"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Icon & Title & Date */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 text-primary-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Activity size={22} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {log.typeName}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {log.source}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/60">
                          {log.intensityZone}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CustomCalendarIcon size={13} />
                          {new Date(log.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })} às {log.time}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Gauge size={13} className="text-slate-400" />
                          RPE: <strong className="text-slate-700 dark:text-slate-200">{log.rpe}/10</strong>
                        </span>
                        {log.incline && (
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            Inclinação: <strong>{log.incline}%</strong>
                          </span>
                        )}
                        {log.resistanceLevel && (
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            Resistência: <strong>Nível {log.resistanceLevel}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center: Metrics Chips */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    {/* Duration */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Duração</span>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-white">{log.durationMinutes} min</span>
                    </div>

                    {/* Distance */}
                    {log.distanceKm !== undefined && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center min-w-[70px]">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Distância</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-white">{log.distanceKm} km</span>
                      </div>
                    )}

                    {/* Calories */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Calorias</span>
                      <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">{log.caloriesBurned} kcal</span>
                    </div>

                    {/* Pace / Speed */}
                    {log.avgPace && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center min-w-[70px]">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Ritmo</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-white">{log.avgPace}</span>
                      </div>
                    )}

                    {/* Heart Rate */}
                    {log.avgHeartRate && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-center min-w-[70px]">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">FC Média</span>
                        <span className="text-sm font-extrabold text-rose-500 flex items-center justify-center gap-1">
                          <Heart size={12} className="fill-rose-500" />
                          {log.avgHeartRate} bpm
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => handleOpenEditModal(log)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes footer */}
                {log.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-xl">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Notas / Feedback:</span> {log.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Edit Cardio Log */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 border border-primary-200 dark:border-primary-800/60 flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingLogId ? 'Editar Registo de Cardio' : 'Novo Registo de Cardio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registe as métricas da sessão aeróbica realizada pelo cliente
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveLog} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Type and Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipo de Atividade
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const val = e.target.value as CardioLog['type'];
                      const found = CARDIO_TYPES.find(t => t.id === val);
                      setFormData(prev => ({ ...prev, type: val, typeName: found?.name || val }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    {CARDIO_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nome / Título da Sessão
                  </label>
                  <input
                    type="text"
                    value={formData.typeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, typeName: e.target.value }))}
                    placeholder="Ex: Corrida Matinal, HIIT Bike"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Duration & Distance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Duração (minutos) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 0 }))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Distância (km)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 5.2"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData(prev => ({ ...prev, distanceKm: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Calories & Pace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Calorias Queimadas (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData(prev => ({ ...prev, caloriesBurned: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ritmo Médio (Pace)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5'30&quot; /km ou 24 km/h"
                    value={formData.avgPace}
                    onChange={(e) => setFormData(prev => ({ ...prev, avgPace: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Heart Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    FC Média (bpm)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="220"
                    placeholder="Ex: 145"
                    value={formData.avgHeartRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, avgHeartRate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    FC Máxima (bpm)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="220"
                    placeholder="Ex: 172"
                    value={formData.maxHeartRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxHeartRate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Zone and RPE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Zona de Intensidade
                  </label>
                  <select
                    value={formData.intensityZone}
                    onChange={(e) => setFormData(prev => ({ ...prev, intensityZone: e.target.value as CardioLog['intensityZone'] }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Zona 1 (Recuperação)">Zona 1 (Recuperação - &lt;60% FCm)</option>
                    <option value="Zona 2 (Endurance)">Zona 2 (Endurance / Base - 60-70% FCm)</option>
                    <option value="Zona 3 (Aeróbica)">Zona 3 (Aeróbica - 70-80% FCm)</option>
                    <option value="Zona 4 (Limiar)">Zona 4 (Limiar Anaeróbio - 80-90% FCm)</option>
                    <option value="Zona 5 (VO2 Máx)">Zona 5 (VO2 Máx / Sprint - &gt;90% FCm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Esforço Percebido (RPE 1 a 10): {formData.rpe}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.rpe}
                    onChange={(e) => setFormData(prev => ({ ...prev, rpe: parseInt(e.target.value) }))}
                    className="w-full accent-primary-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 (Muito fácil)</span>
                    <span>5 (Moderado)</span>
                    <span>10 (Exaustão)</span>
                  </div>
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Origem do Registo
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['Manual', 'Garmin', 'Apple Health', 'Strava', 'Polar'] as CardioLog['source'][]).map(src => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, source: src }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        formData.source === src
                          ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Notas / Observações
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Sensações do cliente, terreno, condições meteorológicas, hidratação..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 text-sm"
                >
                  {editingLogId ? 'Guardar Alterações' : 'Adicionar Registo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCardioLogTab;
