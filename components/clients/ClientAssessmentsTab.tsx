import React, { useState } from 'react';
import { 
  Activity, Calendar, TrendingUp, TrendingDown, Minus,
  Scale, FileText, ChevronDown, Eye, Edit2, Trash2, ArrowRightLeft, Download, Plus, Map, Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { AssessmentData } from './ClientAssessmentModal';
import { Client } from '../../types';
import { ClientDailyLogsTab } from './ClientDailyLogsTab';

interface ClientAssessmentsTabProps {
  assessments: AssessmentData[];
  client?: Client;
  onNewAssessment: () => void;
  onCompare: () => void;
  onView: (assessment: AssessmentData, prev?: AssessmentData) => void;
  onEdit: (assessment: AssessmentData) => void;
  onDelete: (id: string) => void;
  onExport: (id?: string) => void;
}

type SubTab = 'avaliacoes' | 'diario' | 'pre_treino' | 'pos_treino';

export const ClientAssessmentsTab: React.FC<ClientAssessmentsTabProps> = ({
  assessments, client, onNewAssessment, onCompare, onView, onEdit, onDelete, onExport
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('avaliacoes');

  // Chart data preparation
  const chartData = [...assessments].reverse().map(a => ({
    date: new Date(a.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    peso: a.weight || 0,
    cintura: parseFloat(a.measures.cintura) || 0,
    anca: parseFloat(a.measures.anca) || 0
  }));

  const latest = assessments[0];
  const previous = assessments[1];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'validado':
      case 'concluido': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'em_progresso':
      case 'pendente': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'agendada': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelada': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'validado': return 'Validado';
      case 'concluido': return 'Concluída';
      case 'em_progresso': return 'Em Progresso';
      case 'agendada': return 'Agendada';
      case 'pendente': return 'Pendente';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const renderVariation = (val?: number) => {
    if (val === undefined || val === 0) return <span className="text-slate-400 flex items-center text-xs"><Minus size={12}/> 0</span>;
    if (val > 0) return <span className="text-rose-500 flex items-center text-xs font-bold"><TrendingUp size={12} className="mr-0.5"/> +{val}</span>;
    return <span className="text-emerald-500 flex items-center text-xs font-bold"><TrendingDown size={12} className="mr-0.5"/> {val}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Avaliações Físicas</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Acompanhamento e evolução métrica do cliente.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => onExport()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Download size={16} /> Exportar Histórico
          </button>
          <button 
            onClick={onCompare}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <ArrowRightLeft size={16} /> Comparar Avaliações
          </button>
          <button 
            onClick={onNewAssessment}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            <Plus size={16} /> Nova Avaliação
          </button>
        </div>
      </div>

      {/* Resumo Atual */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Peso Atual</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{latest.weight} kg</span>
                <div className="mb-1">{renderVariation(latest.weightVariation)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Cintura</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black text-slate-800 dark:text-white">--</span>
                <span className="text-xs text-slate-400 mb-1 font-medium">N/D</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Anca</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Positivo</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-bold">Consistente</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveSubTab('avaliacoes')}
            className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeSubTab === 'avaliacoes' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Avaliações
            {activeSubTab === 'avaliacoes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveSubTab('diario')}
            className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeSubTab === 'diario' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Registo Diário
            {activeSubTab === 'diario' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveSubTab('pre_treino')}
            className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeSubTab === 'pre_treino' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Pré-treino
            {activeSubTab === 'pre_treino' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveSubTab('pos_treino')}
            className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeSubTab === 'pos_treino' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Pós-treino
            {activeSubTab === 'pos_treino' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {activeSubTab === 'avaliacoes' && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Evolução de Peso, Cintura & Anca</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="peso" name="Peso" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="cintura" name="Cintura" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="anca" name="Anca" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">ID / Data</th>
                    <th className="px-6 py-4">Peso</th>
                    <th className="px-6 py-4">Cintura</th>
                    <th className="px-6 py-4">Anca</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Observações</th>
                    <th className="px-6 py-4">Feedback</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {assessments.map((assessment, index) => {
                    const prev = assessments[index + 1];
                    const ancaDiff = prev ? (parseFloat(assessment.measures.anca) - parseFloat(prev.measures.anca)) : 0;
                    
                    return (
                      <tr key={assessment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{new Date(assessment.date).toLocaleDateString('pt-PT')}</div>
                          <div className="font-mono text-xs text-slate-500">{assessment.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{assessment.weight} kg</div>
                          {renderVariation(assessment.weightVariation)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{assessment.measures.cintura} cm</div>
                          {renderVariation(assessment.cinturaVariation)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{assessment.measures.anca} cm</div>
                          {renderVariation(ancaDiff)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide inline-flex ${getStatusStyle(assessment.status)}`}>
                            {getStatusLabel(assessment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {assessment.questions ? (
                            <span className="text-slate-600 dark:text-slate-300 text-xs truncate max-w-[150px] inline-block" title={assessment.questions}>
                              {assessment.questions}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Sem notas</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {assessment.trainerFeedback ? (
                            <span className="text-slate-600 dark:text-slate-300 text-xs truncate max-w-[150px] inline-block" title={assessment.trainerFeedback}>
                              {assessment.trainerFeedback}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Sem feedback</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => onView(assessment, prev)}
                              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => onEdit(assessment)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => onCompare()}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                              title="Comparar"
                            >
                              <ArrowRightLeft size={16} />
                            </button>
                            <button 
                              onClick={() => onExport(assessment.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="Exportar Avaliação"
                            >
                              <Download size={16} />
                            </button>
                            <button 
                              onClick={() => onDelete(assessment.id || '')}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'diario' && (
        <ClientDailyLogsTab />
      )}

      {activeSubTab !== 'avaliacoes' && activeSubTab !== 'diario' && (
        <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem dados registados</h3>
          <p className="text-slate-500 max-w-sm mt-2 text-sm">
            Ainda não existem dados para este tipo de registo. A área encontra-se em preparação.
          </p>
        </div>
      )}
    </div>
  );
};
