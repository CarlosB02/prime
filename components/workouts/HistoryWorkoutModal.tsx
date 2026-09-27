import React, { useState, useMemo } from 'react';
import { X, History, TrendingUp, TrendingDown, Minus, Info, Activity, ChevronDown, Layers } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { WorkoutPlan } from './WorkoutsView';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface HistoryWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WorkoutPlan | null;
}

// Mock data representing historical volume evolution for a client's muscle groups
const MOCK_HISTORY_DATA = [
  { muscleGroup: 'Quadríceps', week1: 12, week2: 14, week3: 16 },
  { muscleGroup: 'Glúteos', week1: 10, week2: 12, week3: 15 },
  { muscleGroup: 'Isquiotibiais', week1: 8, week2: 10, week3: 10 },
  { muscleGroup: 'Peito', week1: 14, week2: 12, week3: 10 },
  { muscleGroup: 'Costas', week1: 12, week2: 12, week3: 14 },
  { muscleGroup: 'Ombros', week1: 8, week2: 8, week3: 8 },
  { muscleGroup: 'Bíceps', week1: 6, week2: 8, week3: 6 },
  { muscleGroup: 'Tríceps', week1: 6, week2: 6, week3: 8 },
];

const HistoryWorkoutModal: React.FC<HistoryWorkoutModalProps> = ({ isOpen, onClose, plan }) => {
  const [dateRange, setDateRange] = useState('Últimos 3 Meses');

  const processedData = useMemo(() => {
    return MOCK_HISTORY_DATA.map(item => {
      const initial = item.week1;
      const current = item.week3;
      const diff = current - initial;
      const percent = initial > 0 ? (diff / initial) * 100 : 0;
      
      return {
        ...item,
        initial,
        current,
        diff,
        percent
      };
    }).sort((a, b) => b.current - a.current);
  }, []);

  const highlights = useMemo(() => {
    let maxIncrease = processedData[0];
    let maxDecrease = processedData[0];
    let mostStable = processedData[0];

    processedData.forEach(item => {
      if (item.percent > maxIncrease.percent) maxIncrease = item;
      if (item.percent < maxDecrease.percent) maxDecrease = item;
      if (Math.abs(item.percent) < Math.abs(mostStable.percent)) mostStable = item;
    });

    return { maxIncrease, maxDecrease, mostStable };
  }, [processedData]);

  if (!isOpen || !plan) return null;

  const renderTrendIcon = (percent: number) => {
    if (percent > 0) return <TrendingUp size={16} className="text-blue-500" />;
    if (percent < 0) return <TrendingDown size={16} className="text-blue-500" />;
    return <Minus size={16} className="text-blue-400" />;
  };

  const renderTrendColor = (percent: number) => {
    return 'text-blue-600 dark:text-blue-400';
  };

  const renderTrendBg = (percent: number) => {
    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <History size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                Análise de Volume de Treino
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <CustomCalendarIcon size={16} />
                  <span>{dateRange}</span>
                  <ChevronDown size={14} className="ml-0.5" />
                </div>
              </div>
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
          
          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Maior Aumento</span>
                <TrendingUp size={18} className="text-primary-500" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white">{highlights.maxIncrease.muscleGroup}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">+{highlights.maxIncrease.percent.toFixed(0)}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">vs. Inicial</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Maior Redução</span>
                <TrendingDown size={18} className="text-primary-500" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white">{highlights.maxDecrease.muscleGroup}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{highlights.maxDecrease.percent.toFixed(0)}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">vs. Inicial</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Maior Estabilidade</span>
                <Minus size={18} className="text-primary-500" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white">{highlights.mostStable.muscleGroup}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">0%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Mantido</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Treinos Realizados</span>
                <Activity size={18} className="text-primary-500" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white">42</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Neste período</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white">
              <Layers size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Evolução do Volume (Séries)</h3>
            </div>
            
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grupo Muscular</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center border-l border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">Semana 1</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center border-l border-slate-200 dark:border-slate-700">Semana 2</th>
                      <th className="py-4 px-6 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-center border-l border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/10">Semana 3</th>
                      <th className="py-4 px-6 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-right">Evolução</th>
                      <th className="py-4 px-6 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-right">Variação %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {processedData.map((row) => (
                      <tr key={row.muscleGroup} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {row.muscleGroup}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center border-l border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/10">
                          <span className="font-semibold text-slate-500 dark:text-slate-400">{row.week1}</span>
                        </td>
                        <td className="py-4 px-6 text-center border-l border-slate-100 dark:border-slate-700/50">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">{row.week2}</span>
                        </td>
                        <td className="py-4 px-6 text-center border-l border-slate-100 dark:border-slate-700/50 bg-blue-50/20 dark:bg-blue-900/5">
                          <span className="font-bold text-slate-800 dark:text-white">{row.week3}</span>
                        </td>
                        <td className="py-4 px-6 border-l border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{ val: row.week1 }, { val: row.week2 }, { val: row.week3 }]}>
                                  <Line 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2} 
                                    dot={{ r: 2.5, fill: '#3b82f6' }} 
                                    isAnimationActive={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            {renderTrendIcon(row.percent)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${renderTrendBg(row.percent)} ${renderTrendColor(row.percent)}`}>
                            {row.diff > 0 ? '+' : ''}{row.percent.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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
              <strong>Nota:</strong> O volume é calculado com base no número total de séries (sets) programadas para cada grupo muscular nas respetivas semanas/planos. A variação percentual reflete a alteração direta do volume <em>Atual</em> em relação ao volume <em>Inicial</em> do período selecionado. Dados retroativos são baseados no histórico registado para o cliente.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryWorkoutModal;
