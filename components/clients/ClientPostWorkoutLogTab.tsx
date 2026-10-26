import React, { useState } from 'react';
import { 
  Plus, 
  Flame, 
  Clock, 
  HeartPulse, 
  Smile, 
  Meh, 
  Frown, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Dumbbell,
  Trash2,
  X,
  MessageSquare
} from 'lucide-react';
import { Client } from '../../types';

interface PostWorkoutLog {
  id: string;
  date: string;
  workoutTitle: string;
  rpe: number; // 1-10
  durationMinutes: number;
  energyLevel: 'alta' | 'moderada' | 'baixa';
  soreness: 'nenhuma' | 'leve' | 'moderada' | 'alta';
  pump: 'excelente' | 'bom' | 'normal';
  notes: string;
  painLocation?: string;
}

const DEFAULT_LOGS: PostWorkoutLog[] = [
  {
    id: '1',
    date: '2026-04-18',
    workoutTitle: 'Treino A - Peito, Ombros & Tríceps',
    rpe: 8,
    durationMinutes: 65,
    energyLevel: 'alta',
    soreness: 'leve',
    pump: 'excelente',
    notes: 'Boa progressão de carga no supino. Sem dores no ombro.',
  },
  {
    id: '2',
    date: '2026-04-16',
    workoutTitle: 'Treino B - Costas & Bíceps',
    rpe: 9,
    durationMinutes: 70,
    energyLevel: 'moderada',
    soreness: 'moderada',
    pump: 'excelente',
    notes: 'Treino pesado. Última série de remada curvada foi ao limite (RPE 9.5).',
  },
  {
    id: '3',
    date: '2026-04-14',
    workoutTitle: 'Treino C - Pernas & Core',
    rpe: 8.5,
    durationMinutes: 75,
    energyLevel: 'alta',
    soreness: 'alta',
    pump: 'bom',
    notes: 'Agachamento muito sólido. Fadiga muscular intensa nos quadricípites.',
  },
  {
    id: '4',
    date: '2026-04-11',
    workoutTitle: 'Treino A - Peito & Ombros',
    rpe: 7.5,
    durationMinutes: 60,
    energyLevel: 'moderada',
    soreness: 'nenhuma',
    pump: 'bom',
    notes: 'Sessão rápida e focada em técnica.',
  }
];

interface ClientPostWorkoutLogTabProps {
  client?: Client;
}

export const ClientPostWorkoutLogTab: React.FC<ClientPostWorkoutLogTabProps> = ({ client }) => {
  const [logs, setLogs] = useState<PostWorkoutLog[]>(() => {
    try {
      const stored = localStorage.getItem(`pr1me_pos_treino_${client?.id}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_LOGS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<PostWorkoutLog>>({
    date: new Date().toISOString().split('T')[0],
    workoutTitle: 'Treino do Dia',
    rpe: 8,
    durationMinutes: 60,
    energyLevel: 'alta',
    soreness: 'leve',
    pump: 'excelente',
    notes: '',
  });

  const handleSaveLog = () => {
    if (!newLog.date || !newLog.workoutTitle) return;
    const item: PostWorkoutLog = {
      id: Date.now().toString(),
      date: newLog.date || new Date().toISOString().split('T')[0],
      workoutTitle: newLog.workoutTitle || 'Sessão de Treino',
      rpe: newLog.rpe || 8,
      durationMinutes: newLog.durationMinutes || 60,
      energyLevel: newLog.energyLevel || 'alta',
      soreness: newLog.soreness || 'leve',
      pump: newLog.pump || 'bom',
      notes: newLog.notes || '',
      painLocation: newLog.painLocation,
    };

    const updated = [item, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem(`pr1me_pos_treino_${client?.id}`, JSON.stringify(updated));
    } catch (e) {}
    setIsModalOpen(false);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    try {
      localStorage.setItem(`pr1me_pos_treino_${client?.id}`, JSON.stringify(updated));
    } catch (e) {}
  };

  const avgRpe = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + curr.rpe, 0) / logs.length).toFixed(1) 
    : '0';

  const avgDuration = logs.length > 0
    ? Math.round(logs.reduce((acc, curr) => acc + curr.durationMinutes, 0) / logs.length)
    : 0;

  const getRpeColor = (rpe: number) => {
    if (rpe >= 9) return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    if (rpe >= 7.5) return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <HeartPulse size={22} className="text-primary-500" />
            Registos Pós-Treino
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Perceção de esforço (RPE), fadiga, congestão muscular e feedback por sessão.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition-all"
        >
          <Plus size={16} /> Novo Registo Pós-Treino
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">RPE Médio</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{avgRpe}</span>
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Intensidade média das sessões registadas</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Duração Média</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{avgDuration}</span>
                <span className="text-xs text-slate-500">minutos</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tempo efetivo despendido por treino</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Feedbacks</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{logs.length}</span>
                <span className="text-xs text-slate-500">sessões</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total de registos pós-treino concluídos</p>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <HeartPulse size={36} className="mx-auto text-slate-400 mb-3 opacity-40" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Sem registos pós-treino</h3>
            <p className="text-sm text-slate-500 mt-1">Clique em "Novo Registo Pós-Treino" para submeter o primeiro feedback.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-750 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-base">{log.workoutTitle}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Calendar size={12} />
                      <span>{log.date}</span>
                      <span>•</span>
                      <Clock size={12} />
                      <span>{log.durationMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getRpeColor(log.rpe)}`}>
                    RPE {log.rpe} / 10
                  </span>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Eliminar registo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Badges details */}
              <div className="flex items-center gap-2 flex-wrap text-xs mb-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  Energia: <strong className="capitalize">{log.energyLevel}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  Fadiga/Dor: <strong className="capitalize">{log.soreness}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  Pump: <strong className="capitalize">{log.pump}</strong>
                </span>
              </div>

              {/* Notes */}
              {log.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 border border-slate-100 dark:border-slate-800">
                  <MessageSquare size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{log.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Novo Registo Pós-Treino */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <HeartPulse size={20} className="text-primary-500" />
                Novo Registo Pós-Treino
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Data da Sessão
                  </label>
                  <input
                    type="date"
                    value={newLog.date}
                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Duração (Minutos)
                  </label>
                  <input
                    type="number"
                    value={newLog.durationMinutes}
                    onChange={(e) => setNewLog({ ...newLog, durationMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Identificação do Treino
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  value={newLog.workoutTitle}
                  onChange={(e) => setNewLog({ ...newLog, workoutTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Perceção de Esforço (RPE)
                  </label>
                  <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                    {newLog.rpe} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={newLog.rpe}
                  onChange={(e) => setNewLog({ ...newLog, rpe: parseFloat(e.target.value) })}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>1 (Muito Fácil)</span>
                  <span>5 (Moderado)</span>
                  <span>8 (Intenso)</span>
                  <span>10 (Falha Máxima)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Energia
                  </label>
                  <select
                    value={newLog.energyLevel}
                    onChange={(e: any) => setNewLog({ ...newLog, energyLevel: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium outline-none"
                  >
                    <option value="alta">Alta</option>
                    <option value="moderada">Moderada</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Fadiga / Dor
                  </label>
                  <select
                    value={newLog.soreness}
                    onChange={(e: any) => setNewLog({ ...newLog, soreness: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium outline-none"
                  >
                    <option value="nenhuma">Nenhuma</option>
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Pump Muscular
                  </label>
                  <select
                    value={newLog.pump}
                    onChange={(e: any) => setNewLog({ ...newLog, pump: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium outline-none"
                  >
                    <option value="excelente">Excelente</option>
                    <option value="bom">Bom</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Notas & Feedback da Sessão
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Como correu o treino, cargas aumentadas, sensações articulares..."
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveLog}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition-all"
              >
                Guardar Registo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPostWorkoutLogTab;
