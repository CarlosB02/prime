import React, { useState } from 'react';
import { ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { 
  CustomAlertCircleIcon, 
  CustomClipboardIcon, 
  CustomDumbbellIcon, 
  CustomUserCheckIcon 
} from '../icons';

type SituationType = 'checkin' | 'treino' | 'cliente';

export function DashboardToReview({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
  const [activeTab, setActiveTab] = useState<SituationType>('checkin');

  const situations = [
    { id: '1', clientId: 'c1', clientName: 'João Silva', type: 'checkin' as SituationType, title: 'Check-in por rever', time: 'Há 2h', priority: 'high' },
    { id: '2', clientId: 'c2', clientName: 'Maria Santos', type: 'checkin' as SituationType, title: 'Atrasado', time: '1d atraso', priority: 'medium' },
    { id: '3', clientId: 'c3', clientName: 'Diogo Costa', type: 'treino' as SituationType, title: 'Termina amanhã', time: 'Amanhã', priority: 'high' },
    { id: '4', clientId: 'c4', clientName: 'Ana Rodrigues', type: 'cliente' as SituationType, title: 'Baixo engajamento', time: 'Alerta', priority: 'medium' },
    { id: '5', clientId: 'c5', clientName: 'Pedro Alves', type: 'treino' as SituationType, title: 'Avaliação pendente', time: 'Há 5h', priority: 'low' },
  ];

  const filtered = situations.filter(s => s.type === activeTab).slice(0, 3); // Max 3 items

  const getIcon = (type: SituationType) => {
    switch(type) {
      case 'checkin': return <CustomClipboardIcon size={16} />;
      case 'treino': return <CustomDumbbellIcon size={16} />;
      case 'cliente': return <CustomUserCheckIcon size={16} />;
    }
  };

  const getIconBg = (type: SituationType) => {
    switch(type) {
      case 'checkin': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30';
      case 'treino': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30';
      case 'cliente': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <CustomAlertCircleIcon size={20} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">A Rever</h2>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full overflow-x-auto custom-scrollbar hide-scrollbar">
          {(['checkin', 'treino', 'cliente'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'checkin' ? 'Check-ins' : tab === 'treino' ? 'Treinos' : 'Clientes'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {filtered.length > 0 ? (
          filtered.map(sit => (
            <div 
              key={sit.id}
              onClick={() => onNavigate('clients', sit.clientId)}
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50 hover:shadow-sm transition-all cursor-pointer gap-2"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className={`p-2 rounded-lg border ${getIconBg(sit.type)} shrink-0`}>
                  {getIcon(sit.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-slate-800 dark:text-white text-sm truncate">{sit.clientName}</span>
                    {sit.priority === 'high' && (
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{sit.title}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0 ml-2">
                <span className="text-[10px] font-medium text-slate-400 mb-1">{sit.time}</span>
                <button className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tudo em dia!</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => onNavigate('clients')}
        className="w-full mt-auto pt-4 pb-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-500 transition-colors"
      >
        Ver Situações
      </button>
    </div>
  );
}
