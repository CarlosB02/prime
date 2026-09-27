import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CustomChatIcon } from '../icons';

export function DashboardMessages({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
  const messages = [
    { id: '1', name: 'João Silva', avatar: 'https://i.pravatar.cc/150?u=joao', text: 'Bom dia Renato, ontem fiz o treino...', time: '10:45', unread: true },
    { id: '2', name: 'Maria Santos', avatar: 'https://i.pravatar.cc/150?u=maria', text: 'Tenho uma dúvida na dieta.', time: 'Ontem', unread: true },
    { id: '3', name: 'Diogo Costa', avatar: 'https://i.pravatar.cc/150?u=diogo', text: 'Obrigado pelo feedback!', time: 'Ontem', unread: false },
  ];
  
  const pendingCount = messages.filter(m => m.unread).length;
  // Slice to max 3 messages
  const displayMessages = messages.slice(0, 3);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <CustomChatIcon size={20} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">Mensagens</h2>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-full shrink-0">
              {pendingCount} novas
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {displayMessages.map(msg => (
          <div 
            key={msg.id} 
            onClick={() => onNavigate('messages', msg.id)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50"
          >
            <div className="relative shrink-0">
              <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full object-cover" />
              {msg.unread && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={`text-sm truncate pr-2 ${msg.unread ? 'font-bold text-slate-800 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                  {msg.name}
                </p>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{msg.time}</span>
              </div>
              <p className={`text-xs truncate ${msg.unread ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-500'}`}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onNavigate('messages')}
        className="w-full mt-auto pt-4 pb-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        Ver Todas
      </button>
    </div>
  );
}
