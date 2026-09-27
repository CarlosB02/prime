import React, { useState } from 'react';
import { 
  Activity, Clock, Flame, ChevronRight, Check, Settings2, Plus, 
  Trash2, Edit2, Copy, GripVertical, FileText, Move
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { motion, AnimatePresence } from 'motion/react';

const WEEK_DAYS = [
  { id: 'seg', label: 'Segunda', fullName: 'Segunda-feira' },
  { id: 'ter', label: 'Terça', fullName: 'Terça-feira' },
  { id: 'qua', label: 'Quarta', fullName: 'Quarta-feira' },
  { id: 'qui', label: 'Quinta', fullName: 'Quinta-feira' },
  { id: 'sex', label: 'Sexta', fullName: 'Sexta-feira' },
  { id: 'sab', label: 'Sábado', fullName: 'Sábado' },
  { id: 'dom', label: 'Domingo', fullName: 'Domingo' }
];

export const CardioAndStretchingConfig: React.FC<{ type?: 'cardio' | 'alongamentos', hideTabs?: boolean }> = ({ type, hideTabs }) => {
  const [activeTab, setActiveTab] = useState<'cardio' | 'alongamentos'>(type || 'alongamentos');

  // --- Cardio State ---
  const [periodicity, setPeriodicity] = useState<'semanal' | 'diario'>('semanal');
  const [timeUnit, setTimeUnit] = useState<'minutos' | 'horas'>('minutos');
  const [weeklyTime, setWeeklyTime] = useState<number>(150);
  const [dailyConfigType, setDailyConfigType] = useState<'mesmo' | 'individual'>('mesmo');
  const [selectedDays, setSelectedDays] = useState<string[]>(['seg', 'qua', 'sex']);
  const [dailyTime, setDailyTime] = useState<number>(30);
  const [individualTimes, setIndividualTimes] = useState<Record<string, number>>({
    'seg': 30, 'qua': 30, 'sex': 30
  });
  const [cardioNotes, setCardioNotes] = useState('');

  // --- Alongamentos State ---
  const [stretchingNotes, setStretchingNotes] = useState('Realizar esta rotina de alongamentos no final de cada treino para promover a recuperação e flexibilidade.');
  const [stretches, setStretches] = useState([
    { id: '1', exercise: 'Alongamento Peitoral (Parede)', sets: '2x 30s cada lado', notes: 'Focar na respiração profunda.' },
    { id: '2', exercise: 'Alongamento Quadríceps (Em pé)', sets: '2x 30s cada perna', notes: 'Manter joelhos próximos.' },
    { id: '3', exercise: 'Gato-Camelo', sets: '12 repetições', notes: 'Movimento lento e controlado.' },
  ]);

  // --- Computed Stats ---
  let totalTime = 0;
  let days = 0;
  
  if (periodicity === 'semanal') {
    totalTime = weeklyTime;
    days = 0; // Not explicitly defined
  } else {
    days = selectedDays.length;
    if (dailyConfigType === 'mesmo') {
      totalTime = days * dailyTime;
    } else {
      totalTime = selectedDays.reduce((acc, day) => acc + (individualTimes[day] || 0), 0);
    }
  }

  const averageTime = days > 0 ? Math.round(totalTime / days) : (periodicity === 'semanal' && totalTime > 0 ? Math.round(totalTime / 3) : 0); // Assuming 3 days if weekly to show a mock average
  
  const totalTimeInMinutes = timeUnit === 'horas' ? totalTime * 60 : totalTime;
  const averageTimeInMinutes = timeUnit === 'horas' ? averageTime * 60 : averageTime;
  const estimatedCalories = totalTimeInMinutes * 8; // approx 8 kcal per min

  const formatTime = (value: number) => {
    if (timeUnit === 'minutos') return`${value} min`;
    return`${value}h`;
  };

  const formatMinutesToHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return`${h}h ${m}m`;
    if (h > 0) return`${h}h`;
    return`${m}m`;
  };

  // --- Handlers ---
  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const updateIndividualTime = (dayId: string, time: number) => {
    setIndividualTimes(prev => ({ ...prev, [dayId]: time }));
  };

  const updateStretch = (id: string, field: keyof typeof stretches[0], value: string) => {
    setStretches(stretches.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddStretch = () => {
    setStretches([...stretches, { 
      id: Math.random().toString(), 
      exercise: '', 
      sets: '', 
      notes: '' 
    }]);
  };

  const handleDeleteStretch = (id: string) => {
    setStretches(stretches.filter(s => s.id !== id));
  };

  const handleDuplicateStretch = (stretch: any) => {
    setStretches([...stretches, { ...stretch, id: Math.random().toString() }]);
  };

  const moveStretch = (index: number, direction: 'up' | 'down') => {
    const newStretches = [...stretches];
    if (direction === 'up' && index > 0) {
      [newStretches[index - 1], newStretches[index]] = [newStretches[index], newStretches[index - 1]];
    } else if (direction === 'down' && index < newStretches.length - 1) {
      [newStretches[index + 1], newStretches[index]] = [newStretches[index], newStretches[index + 1]];
    }
    setStretches(newStretches);
  };

  return (
    <div className="space-y-6 animate-fade-in w-full py-2">
      
      {/* Tabs */}
      {!hideTabs && (
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('alongamentos')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'alongamentos'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Move size={16} /> Alongamentos
          </div>
        </button>
        <button
          onClick={() => setActiveTab('cardio')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'cardio'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity size={16} /> Cardio
          </div>
        </button>
      </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'cardio' ? (
          <motion.div
            key="cardio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 1. Resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/50">
                <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                  <Clock size={16} />
                  <span className="text-sm font-bold">Tempo Total</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">
                  {formatTime(totalTime)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Por semana</div>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/50">
                <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                  <CustomCalendarIcon size={16} />
                  <span className="text-sm font-bold">Dias de Treino</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">
                  {periodicity === 'semanal' ? '-' : days}
                </div>
                <div className="text-xs text-slate-500 mt-1">Sessões programadas</div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/50">
                <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                  <Activity size={16} />
                  <span className="text-sm font-bold">Média p/ Sessão</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">
                  {periodicity === 'semanal' ? '-' : formatTime(averageTime)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Tempo por treino</div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/50">
                <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                  <Flame size={16} />
                  <span className="text-sm font-bold">Calorias Est.</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">
                  ~{estimatedCalories}
                </div>
                <div className="text-xs text-slate-500 mt-1">kcal por semana</div>
              </div>
            </div>

            {/* 2. Configuração */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Settings2 size={20} className="text-slate-400" />
                Configuração do Cardio
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Período */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Período</label>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setPeriodicity('semanal')}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                        periodicity === 'semanal' 
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Semanal
                    </button>
                    <button
                      onClick={() => setPeriodicity('diario')}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                        periodicity === 'diario' 
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Diário
                    </button>
                  </div>
                </div>

                {/* Unidade de Tempo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Unidade de Tempo</label>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setTimeUnit('minutos')}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                        timeUnit === 'minutos' 
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Minutos
                    </button>
                    <button
                      onClick={() => setTimeUnit('horas')}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                        timeUnit === 'horas' 
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Horas
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                {periodicity === 'semanal' ? (
                  <div className="max-w-xs">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Tempo Total Semanal ({timeUnit})
                    </label>
                    <input 
                      type="number"
                      value={weeklyTime}
                      onChange={(e) => setWeeklyTime(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    {timeUnit === 'minutos' && weeklyTime > 60 && (
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Clock size={12} /> Equivalente a {formatMinutesToHours(weeklyTime)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Dias da Semana */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Dias de Treino
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {WEEK_DAYS.map(day => {
                          const isSelected = selectedDays.includes(day.id);
                          return (
                            <button
                              key={day.id}
                              onClick={() => toggleDay(day.id)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                isSelected 
                                  ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              {isSelected && <Check size={14} className="inline mr-1.5" />}
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Distribuição de Tempo */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Distribuição do Tempo
                      </label>
                      <div className="flex gap-6 mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="configType" 
                            checked={dailyConfigType === 'mesmo'}
                            onChange={() => setDailyConfigType('mesmo')}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Mesmo tempo p/ todos os dias
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="configType" 
                            checked={dailyConfigType === 'individual'}
                            onChange={() => setDailyConfigType('individual')}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tempo individual por dia
                          </span>
                        </label>
                      </div>

                      {dailyConfigType === 'mesmo' ? (
                        <div className="flex flex-row items-end gap-4 max-w-xl flex-wrap sm:flex-nowrap">
                          <div className="w-full sm:w-52">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                              Tempo diário ({timeUnit})
                            </label>
                            <input 
                              type="number"
                              min={0}
                              value={dailyTime}
                              onChange={(e) => setDailyTime(Math.max(0, Number(e.target.value)))}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                          </div>

                          <div className="flex-1 w-full sm:w-auto min-w-[200px]">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                              Total Semanal {selectedDays.length > 0 && `(${selectedDays.length} ${selectedDays.length === 1 ? 'dia' : 'dias'})`}
                            </label>
                            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl h-[50px]">
                              {selectedDays.length > 0 ? (
                                <>
                                  <span className="text-base font-black text-primary-600 dark:text-primary-400">
                                    {formatTime(totalTime)}
                                  </span>
                                  {timeUnit === 'minutos' && totalTime >= 60 && (
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      <Clock size={13} className="text-slate-400" />
                                      {formatMinutesToHours(totalTime)}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">
                                  Nenhum dia selecionado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        selectedDays.length > 0 ? (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-w-xl">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                  <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Dia</th>
                                  <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Duração ({timeUnit})</th>
                                </tr>
                              </thead>
                              <tbody>
                                {WEEK_DAYS.filter(d => selectedDays.includes(d.id)).map((day, idx, arr) => (
                                  <tr key={day.id} className={idx < arr.length - 1 ?"border-b border-slate-100 dark:border-slate-800" :""}>
                                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{day.fullName}</td>
                                    <td className="py-2 px-4 w-40">
                                      <input 
                                        type="number"
                                        value={individualTimes[day.id] || 0}
                                        onChange={(e) => updateIndividualTime(day.id, Number(e.target.value))}
                                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                                      />
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
                                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-white text-right">Total Semanal:</td>
                                  <td className="py-3 px-4 font-black text-primary-600 dark:text-primary-400">
                                    {formatTime(totalTime)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                            Selecione pelo menos um dia de treino para definir os tempos.
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Observações */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-slate-400" />
                Observações
              </h3>
              <textarea 
                value={cardioNotes}
                onChange={(e) => setCardioNotes(e.target.value)}
                placeholder="Ex: Fazer cardio após o treino de musculação, intensidade moderada..."
                className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alongamentos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Orientações Gerais */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-slate-400" />
                Orientações Gerais dos Alongamentos
              </h3>
              <textarea 
                value={stretchingNotes}
                onChange={(e) => setStretchingNotes(e.target.value)}
                placeholder="Insira as orientações gerais da rotina..."
                className="w-full h-24 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
              />
            </div>

            {/* Tabela de Alongamentos */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Lista de Alongamentos</h3>
                <button 
                  onClick={handleAddStretch}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all text-sm"
                >
                  <Plus size={16} /> Adicionar Alongamento
                </button>
              </div>

              {stretches.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 w-12"></th>
                        <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Exercício</th>
                        <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Séries</th>
                        <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Observação</th>
                        <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {stretches.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col items-center">
                              <button onClick={() => moveStretch(idx, 'up')} disabled={idx === 0} className="text-slate-400 hover:text-primary-500 disabled:opacity-30 p-0.5">
                                <ChevronRight size={14} className="-rotate-90" />
                              </button>
                              <button onClick={() => moveStretch(idx, 'down')} disabled={idx === stretches.length - 1} className="text-slate-400 hover:text-primary-500 disabled:opacity-30 p-0.5">
                                <ChevronRight size={14} className="rotate-90" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <input 
                              value={s.exercise}
                              onChange={(e) => updateStretch(s.id, 'exercise', e.target.value)}
                              className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 border border-transparent focus:border-primary-500 rounded p-1.5 font-bold text-slate-800 dark:text-white outline-none text-sm transition-colors"
                              placeholder="Nome do exercício..."
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input 
                              value={s.sets}
                              onChange={(e) => updateStretch(s.id, 'sets', e.target.value)}
                              className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 border border-transparent focus:border-primary-500 rounded p-1.5 text-slate-700 dark:text-slate-300 outline-none text-sm transition-colors"
                              placeholder="Séries..."
                            />
                          </td>
                          <td className="py-3 px-2">
                            <textarea 
                              value={s.notes}
                              onChange={(e) => updateStretch(s.id, 'notes', e.target.value)}
                              className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 border border-transparent focus:border-primary-500 rounded p-1.5 text-slate-500 dark:text-slate-400 outline-none text-xs transition-colors resize-none h-[34px]"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="py-3 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleDuplicateStretch(s)} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg" title="Duplicar">
                                <Copy size={16} />
                              </button>
                              <button onClick={() => handleDeleteStretch(s.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg" title="Eliminar">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Move size={24} className="text-slate-400" />
                  </div>
                  <p>Nenhum alongamento configurado.</p>
                  <p className="text-sm mt-1">Clique em"Adicionar Alongamento" para construir a rotina.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

