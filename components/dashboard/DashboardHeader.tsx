import React, { useState, useRef, useEffect } from 'react';
import { Plus, Info, CheckCircle2 } from 'lucide-react';
import { CustomBellIcon, CustomChatIcon, CustomClockIcon } from '../icons';

export function DashboardHeader({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mockNotifications = [
    { id: 1, title: 'Check-in Atrasado', desc: 'Ana Rodrigues não enviou o check-in.', time: 'Há 2h', icon: <CustomClockIcon size={14} className="text-rose-500" />, bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 2, title: 'Mensagem de João', desc: '"Tenho uma dúvida na dieta..."', time: 'Há 3h', icon: <CustomChatIcon size={14} className="text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 3, title: 'Plano Concluído', desc: 'Pedro terminou o plano de hipertrofia.', time: 'Há 5h', icon: <CheckCircle2 size={14} className="text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Olá, Renato 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 capitalize">
          {currentDate}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onNavigate('messages')}
          className="relative p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <CustomChatIcon size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-xl border transition-colors ${showNotifications ? 'bg-slate-50 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            <CustomBellIcon size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in-up origin-top-right">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notificações</h3>
                <span className="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  3 novas
                </span>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="p-3 border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3">
                    <div className={`p-2 rounded-xl h-fit ${notif.bg} shrink-0`}>
                      {notif.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{notif.title}</p>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap mt-0.5">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-700/50">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('notifications');
                  }}
                  className="w-full py-2 text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-500 transition-colors"
                >
                  Ver Todas as Notificações
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
        
        <button 
          onClick={() => onNavigate('new-client')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Novo Aluno</span>
        </button>
      </div>
    </div>
  );
}
