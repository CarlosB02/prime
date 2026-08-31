import React, { useState } from 'react';
import { 
  Bell,
  CheckCircle2
} from 'lucide-react';

const NotificationsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bell className="text-primary-500" />
          Centro de Notificações
        </h2>
        
        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-all"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Marcar todas como lidas
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Bell size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem notificações</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Não tem notificações novas neste momento.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
