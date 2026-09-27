import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { CustomChatIcon } from '../icons';

export interface TimelineRow {
  id: string;
  month: string;
  week: number;
  date: string;
  phase: string;
  phaseDescription?: string;
  nutritionStrategy: string;
  remainingWeeks: number;
  weight: number;
  weightVariation: number | null;
  weightVariation4w: number | null;
  trainingLoad: string;
  goal: string;
  observations: string;
}

const INITIAL_DATA: TimelineRow[] = [
  { 
    id: '1', 
    month: 'Julho', 
    week: 1, 
    date: '2026-07-06', 
    phase: 'Mini Cut', 
    phaseDescription: 'Fase de restrição agressiva',
    nutritionStrategy: 'High Deficit', 
    remainingWeeks: 8, 
    weight: 82.0, 
    weightVariation: null, 
    weightVariation4w: null, 
    trainingLoad: 'Push/Pull/Legs (6x)', 
    goal: 'Atingir 81kg', 
    observations: 'Início da fase de cut. Foco em manter intensidade.' 
  },
  { 
    id: '2', 
    month: 'Julho', 
    week: 2, 
    date: '2026-07-13', 
    phase: 'Mini Cut', 
    nutritionStrategy: 'Moderate Deficit', 
    remainingWeeks: 7, 
    weight: 81.2, 
    weightVariation: -0.8, 
    weightVariation4w: null, 
    trainingLoad: 'Push/Pull/Legs (6x)', 
    goal: 'Manter a força', 
    observations: 'Adaptação ao défice a decorrer bem.' 
  },
  { 
    id: '3', 
    month: 'Julho', 
    week: 3, 
    date: '2026-07-20', 
    phase: 'Mini Cut', 
    nutritionStrategy: 'High Deficit', 
    remainingWeeks: 6, 
    weight: 80.5, 
    weightVariation: -0.7, 
    weightVariation4w: null, 
    trainingLoad: 'Upper/Lower (4x)', 
    goal: 'Atingir 80kg', 
    observations: 'Redução do volume de treino devido ao cansaço.' 
  },
  { 
    id: '4', 
    month: 'Julho', 
    week: 4, 
    date: '2026-07-27', 
    phase: 'Mini Cut', 
    nutritionStrategy: 'Moderate Deficit', 
    remainingWeeks: 5, 
    weight: 79.8, 
    weightVariation: -0.7, 
    weightVariation4w: -2.2, 
    trainingLoad: 'Upper/Lower (4x)', 
    goal: 'Quebrar os 80kg', 
    observations: 'Boa evolução nas últimas 4 semanas.' 
  },
  { 
    id: '5', 
    month: 'Agosto', 
    week: 5, 
    date: '2026-08-03', 
    phase: 'Recomp', 
    phaseDescription: 'Transição para manutenção',
    nutritionStrategy: 'Maintenance', 
    remainingWeeks: 4, 
    weight: 79.8, 
    weightVariation: 0, 
    weightVariation4w: -1.4, 
    trainingLoad: 'Full Body (3x)', 
    goal: 'Estabilizar o peso', 
    observations: 'Semana de deload e adaptação calórica.' 
  },
];

export const ClientTimelineTab: React.FC = () => {
  const [rows, setRows] = useState<TimelineRow[]>(INITIAL_DATA);
  const [startDate, setStartDate] = useState('2026-07-06');
  const [endDate, setEndDate] = useState('2026-08-31');

  // Utility components
  const VariationBadge = ({ variation }: { variation: number | null }) => {
    if (variation === null || variation === 0) return <span className="text-slate-400 font-medium">-</span>;
    const isNegative = variation < 0;
    return (
      <span className={`inline-flex items-center gap-1 text-sm font-bold ${isNegative ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
        {Math.abs(variation).toFixed(1)} kg
      </span>
    );
  };

  const ActionMenu = () => (
    <div className="relative group inline-block">
      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <MoreVertical size={16} />
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <div className="py-1">
          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
            <Edit2 size={14} /> Editar
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
            <Copy size={14} /> Duplicar semana
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
            <CustomChatIcon size={14} /> Adicionar observação
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CustomCalendarIcon size={22} /> Timeline de Acompanhamento
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visão cronológica da evolução planeada do aluno ao longo das semanas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors text-sm border border-slate-200 dark:border-slate-700">
            <RefreshCw size={16} /> Gerar Timeline
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all text-sm">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Mês</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Sem</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Data</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Fase</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Nutrição</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400 text-center">Faltam</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Peso</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Var. Peso</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Var. 4 Sem.</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Treino</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">Objetivo</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400 max-w-xs">Observações</th>
                <th className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, idx) => {
                // Determine if we should show the month (only if it changes)
                const showMonth = idx === 0 || rows[idx - 1].month !== row.month;

                return (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">
                      {showMonth ? row.month : ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                        {row.week}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                      {new Date(row.date).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {row.phase}
                        </span>
                        {row.phaseDescription && (
                          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[120px] truncate" title={row.phaseDescription}>
                            {row.phaseDescription}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-sm font-bold text-amber-600 dark:text-amber-400">
                        {row.nutritionStrategy}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        {row.remainingWeeks} sem.
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">
                      {row.weight.toFixed(1)} kg
                    </td>
                    <td className="px-4 py-3">
                      <VariationBadge variation={row.weightVariation} />
                    </td>
                    <td className="px-4 py-3">
                      <VariationBadge variation={row.weightVariation4w} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px] block" title={row.trainingLoad}>
                        {row.trainingLoad}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px] block" title={row.goal}>
                        {row.goal}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px] block" title={row.observations}>
                        {row.observations || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ActionMenu />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientTimelineTab;
