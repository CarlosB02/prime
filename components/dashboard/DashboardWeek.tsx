import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, Map } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { CustomClipboardIcon, CustomTargetIcon, CustomDumbbellIcon, CustomGiftIcon, CustomClockIcon } from '../icons';

export function DashboardWeek({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  today.setDate(today.getDate() + (weekOffset * 7));
  
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - today.getDay() + 1); // Start from Monday
    return d;
  });

  const isToday = (d: Date) => {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  };

  const mockEvents = [
    { id: '1', dateStr: days[0].toDateString(), type: 'checkin', title: 'Check-in Semanal', client: 'Ana Rodrigues', time: 'Previsto' },
    { id: '2', dateStr: days[0].toDateString(), type: 'assessment', title: 'Avaliação Física', client: 'João Silva', time: '14:30' },
    { id: '3', dateStr: days[1].toDateString(), type: 'workout', title: 'Treino Personalizado', client: 'Maria Santos', time: '10:00' },
    { id: '4', dateStr: days[1].toDateString(), type: 'task', title: 'Preparar novo plano', client: 'Diogo Costa', time: 'Até 18:00' },
    { id: '5', dateStr: days[3].toDateString(), type: 'birthday', title: 'Aniversário', client: 'Pedro Alves', time: 'Todo o dia' },
    { id: '6', dateStr: days[5].toDateString(), type: 'plan_end', title: 'Plano expira', client: 'Sofia Castro', time: 'Alerta' },
  ];

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'checkin': return <CustomClipboardIcon size={12} />;
      case 'assessment': return <CustomTargetIcon size={12} />;
      case 'workout': return <CustomDumbbellIcon size={12} />;
      case 'task': return <CheckCircle2 size={12} className="text-amber-500" />;
      case 'birthday': return <CustomGiftIcon size={12} />;
      case 'plan_end': return <CustomClockIcon size={12} />;
      default: return <CustomCalendarIcon size={12} className="text-slate-500" />;
    }
  };

  const getEventBg = (type: string) => {
    switch(type) {
      case 'checkin': return 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300';
      case 'assessment': return 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300';
      case 'workout': return 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30 text-purple-700 dark:text-purple-300';
      case 'task': return 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-300';
      case 'birthday': return 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30 text-rose-700 dark:text-rose-300';
      case 'plan_end': return 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CustomCalendarIcon size={20} className="text-primary-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Esta Semana</h2>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            >
              Atual
            </button>
            <button 
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <button 
            onClick={() => onNavigate('calendar')}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
          >
            Ver Calendário
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((d, i) => {
          const dayEvents = mockEvents.filter(e => e.dateStr === d.toDateString());
          const current = isToday(d);
          
          return (
            <div key={i} className={`flex flex-col rounded-xl border ${current ? 'border-primary-500 shadow-sm shadow-primary-500/10' : 'border-slate-100 dark:border-slate-800'} overflow-hidden bg-white dark:bg-slate-800/30`}>
              <div className={`p-2 flex items-baseline justify-center gap-1.5 border-b ${current ? 'bg-primary-500 text-white border-primary-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700/50'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${current ? 'text-primary-100' : 'text-slate-500'}`}>
                  {d.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className={`text-base font-black ${current ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                  {d.getDate()}
                </span>
              </div>
              
              <div className="p-2 space-y-2 min-h-[120px] flex-1">
                {dayEvents.map(e => (
                  <div 
                    key={e.id}
                    onClick={() => onNavigate('calendar', e.id)}
                    className={`p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-all group ${getEventBg(e.type)}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {getEventIcon(e.type)}
                      <span className="text-[10px] font-bold truncate flex-1 leading-tight">{e.title}</span>
                    </div>
                    {e.client && <p className="text-[10px] opacity-80 truncate leading-tight">{e.client}</p>}
                    <p className="text-[9px] font-medium opacity-60 mt-1">{e.time}</p>
                  </div>
                ))}
                
                {dayEvents.length === 0 && (
                  <div className="h-full flex items-center justify-center opacity-50">
                    <span className="text-[10px] text-slate-400 font-medium">Sem eventos</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex sm:hidden justify-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate('calendar')}
          className="text-sm font-medium text-primary-600"
        >
          Ver Calendário Completo
        </button>
      </div>
    </div>
  );
}
