import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText, User } from 'lucide-react';

interface Session {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'agendada' | 'concluida' | 'nao_realizada' | 'cancelada';
  observations?: string;
  packName: string;
  packTotal: number;
  packCompleted: number;
  packEnd: string;
  packAutoRenew: boolean;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'João Silva',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    status: 'agendada',
    packName: 'Pack Mensal 12 Sessões',
    packTotal: 12,
    packCompleted: 4,
    packEnd: '2026-08-20',
    packAutoRenew: true
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Maria Santos',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    duration: 60,
    status: 'concluida',
    packName: 'Pack 8 Sessões',
    packTotal: 8,
    packCompleted: 7,
    packEnd: '2026-07-30',
    packAutoRenew: false
  }
];

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const selectedSession = MOCK_SESSIONS.find(s => s.id === selectedSessionId) || MOCK_SESSIONS[0];

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'concluida': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      case 'nao_realizada': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'cancelada': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'agendada': return <Clock size={14} />;
      case 'concluida': return <CheckCircle2 size={14} />;
      case 'nao_realizada': return <AlertCircle size={14} />;
      case 'cancelada': return <XCircle size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CalendarIcon size={24} className="text-primary-500" />
            Agenda Global
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie todas as sessões e consumos de packs.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500">
            <option>Este Mês</option>
            <option>Próximo Mês</option>
            <option>Esta Semana</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            <Plus size={16} /> Nova Sessão
          </button>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* KPIs Line */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Packs Ativos', value: '45', desc: '+3 este mês', color: 'text-primary-500' },
          { label: 'Treinos Totais', value: '128', desc: 'Agendados no período', color: 'text-blue-500' },
          { label: 'Treinos Realizados', value: '84', desc: '65% de conclusão', color: 'text-emerald-500' },
          { label: 'Treinos Restantes', value: '40', desc: 'Até fim do mês', color: 'text-amber-500' },
          { label: 'Treinos em Atraso', value: '4', desc: 'Requerem atenção', color: 'text-rose-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{kpi.label}</h3>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] font-medium text-slate-400 pb-1">{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main Calendar Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 lg:p-6 flex flex-col h-[800px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={goToday} className="px-3 py-1.5 text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-500/10 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors">Hoje</button>
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                <button onClick={prevMonth} className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-white dark:hover:bg-slate-800"><ChevronLeft size={18} /></button>
                <button onClick={nextMonth} className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-white dark:hover:bg-slate-800"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 gap-2 flex-1">
            {padding.map((_, i) => <div key={`pad-${i}`} className="bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-transparent"></div>)}
            {days.map(day => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const daySessions = MOCK_SESSIONS.filter(s => s.date === dateStr);
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div key={day} className={`bg-white dark:bg-slate-800 border ${isToday ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-2 flex flex-col gap-1 min-h-[100px] overflow-hidden`}>
                  <div className={`text-xs font-bold ${isToday ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/20 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-500'}`}>{day}</div>
                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                    {daySessions.map(session => (
                      <div 
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        className={`text-[10px] font-bold p-1.5 rounded border cursor-pointer truncate flex items-center gap-1 transition-all hover:brightness-95 ${getStatusColor(session.status)} ${selectedSessionId === session.id ? 'ring-2 ring-offset-1 ring-primary-500 dark:ring-offset-slate-800' : ''}`}
                      >
                        {session.time} {session.clientName.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto h-[800px] custom-scrollbar pb-6">
          
          {/* Próxima Sessão / Detalhe */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={16} className="text-primary-500" /> Detalhe da Sessão
            </h3>
            
            {selectedSession ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">{selectedSession.clientName}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <CalendarIcon size={14}/> {selectedSession.date} às {selectedSession.time}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getStatusColor(selectedSession.status)}`}>
                    {getStatusIcon(selectedSession.status)}
                    <span className="capitalize">{selectedSession.status.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Duração</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">{selectedSession.duration} min</div>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Pack</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200 truncate" title={selectedSession.packName}>{selectedSession.packName}</div>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold text-sm rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors border border-primary-100 dark:border-primary-500/20">
                  Abrir Ficha da Sessão
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500">
                Selecione uma sessão no calendário para ver os detalhes.
              </div>
            )}
          </div>

          {selectedSession && (
            <>
              {/* Detalhes do Pack */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Detalhes do Pack
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-500 mb-1">Pack Atual</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{selectedSession.packName}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Realizadas</div>
                      <div className="text-xl font-black text-emerald-500">{selectedSession.packCompleted} <span className="text-sm text-slate-400">/ {selectedSession.packTotal}</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Restantes</div>
                      <div className="text-xl font-black text-amber-500">{selectedSession.packTotal - selectedSession.packCompleted}</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 mb-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(selectedSession.packCompleted / selectedSession.packTotal) * 100}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-3">
                    <span>Término: <strong className="text-slate-700 dark:text-slate-300">{selectedSession.packEnd}</strong></span>
                    {selectedSession.packAutoRenew ? (
                      <span className="flex items-center gap-1 text-emerald-500"><RefreshCw size={12}/> Auto-renova</span>
                    ) : (
                      <span className="text-slate-400">Sem renovação</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Histórico Recente */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <RefreshCw size={16} className="text-slate-400" /> Histórico Recente
                  </h3>
                  <button className="text-xs font-bold text-primary-600 hover:text-primary-700">Ver tudo</button>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col gap-1 p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Há {i} dias</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold">Concluída</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Duração: 60 min</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CalendarView;
