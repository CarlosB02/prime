import React from 'react';
import { ToggleLeft, ToggleRight, Stethoscope, Clock, Settings, FileText, CheckCircle2, EyeOff } from 'lucide-react';
import { Client } from '../../types';

interface ClientConfigTabProps {
  client?: Client;
  examesEnabled?: boolean;
  timelineEnabled?: boolean;
  onToggleExames?: (enabled: boolean) => void;
  onToggleTimeline?: (enabled: boolean) => void;
}

export const ClientConfigTab: React.FC<ClientConfigTabProps> = ({ 
  client,
  examesEnabled = true,
  timelineEnabled = true,
  onToggleExames,
  onToggleTimeline
}) => {
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

        <div className="space-y-5 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider text-slate-500">
            <FileText size={18} className="text-slate-400" /> Separadores Visíveis
          </h4>

          {/* Toggle Exames */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700/60 transition-all hover:border-slate-200 dark:hover:border-slate-600">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                examesEnabled 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}>
                <Stethoscope size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-800 dark:text-white text-base">Exames</p>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    examesEnabled 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {examesEnabled ? <CheckCircle2 size={11} /> : <EyeOff size={11} />}
                    {examesEnabled ? 'Visível' : 'Oculto'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {examesEnabled 
                    ? 'O separador "Exames" está visível no perfil deste cliente.' 
                    : 'O separador "Exames" está oculto e inacessível.'}
                </p>
              </div>
            </div>
            
            <button 
              type="button"
              role="switch"
              aria-checked={examesEnabled}
              onClick={() => onToggleExames?.(!examesEnabled)}
              className={`p-1 transition-transform active:scale-95 ${examesEnabled ? 'text-primary-600 dark:text-primary-400' : 'text-slate-300 dark:text-slate-600'}`}
              title={examesEnabled ? 'Desativar Exames' : 'Ativar Exames'}
            >
              {examesEnabled ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
            </button>
          </div>

          {/* Toggle Timeline */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700/60 transition-all hover:border-slate-200 dark:hover:border-slate-600">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                timelineEnabled 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}>
                <Clock size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-800 dark:text-white text-base">Timeline</p>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    timelineEnabled 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {timelineEnabled ? <CheckCircle2 size={11} /> : <EyeOff size={11} />}
                    {timelineEnabled ? 'Visível' : 'Oculto'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {timelineEnabled 
                    ? 'O separador e a vista "Timeline" estão visíveis no acompanhamento.' 
                    : 'A vista "Timeline" está oculta e inacessível.'}
                </p>
              </div>
            </div>

            <button 
              type="button"
              role="switch"
              aria-checked={timelineEnabled}
              onClick={() => onToggleTimeline?.(!timelineEnabled)}
              className={`p-1 transition-transform active:scale-95 ${timelineEnabled ? 'text-primary-600 dark:text-primary-400' : 'text-slate-300 dark:text-slate-600'}`}
              title={timelineEnabled ? 'Desativar Timeline' : 'Ativar Timeline'}
            >
              {timelineEnabled ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientConfigTab;
