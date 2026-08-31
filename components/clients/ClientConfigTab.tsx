import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Stethoscope, Clock, Settings, FileText } from 'lucide-react';
import { Client } from '../../types';

interface ClientConfigTabProps {
  client?: Client;
}

export const ClientConfigTab: React.FC<ClientConfigTabProps> = ({ client }) => {
  const [examesEnabled, setExamesEnabled] = useState(true);
  const [timelineEnabled, setTimelineEnabled] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-6">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center shrink-0">
            <Settings size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Configurações do Cliente</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Personalize os separadores e funcionalidades visíveis para este cliente.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-slate-400" /> Separadores Visíveis
          </h4>

          {/* Toggle Exames */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shadow-sm">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Exames</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Permitir acesso ao separador de Exames Médicos</p>
              </div>
            </div>
            <button 
              onClick={() => setExamesEnabled(!examesEnabled)}
              className={`transition-colors ${examesEnabled ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600'}`}
            >
              {examesEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
            </button>
          </div>

          {/* Toggle Timeline */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Timeline</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Permitir acesso ao separador de Linha do Tempo</p>
              </div>
            </div>
            <button 
              onClick={() => setTimelineEnabled(!timelineEnabled)}
              className={`transition-colors ${timelineEnabled ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600'}`}
            >
              {timelineEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
