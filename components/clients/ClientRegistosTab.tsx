import React, { useState } from 'react';
import { CheckCircle2, HeartPulse } from 'lucide-react';
import { CustomDumbbellIcon, CustomForkKnifeIcon, CustomVitalIcon, CustomEvolutionIcon } from '../icons';
import { Client } from '../../types';
import { ClientTrainingEvolutionTab } from './ClientTrainingEvolutionTab';
import { ClientNutritionLogTab } from './ClientNutritionLogTab';
import { ClientCardioLogTab } from './ClientCardioLogTab';
import { ClientDailyLogsTab } from './ClientDailyLogsTab';
import { ClientPostWorkoutLogTab } from './ClientPostWorkoutLogTab';

export type RegistosSubTab = 'treino' | 'nutricao' | 'cardio' | 'pos_treino' | 'habitos';

interface ClientRegistosTabProps {
  client?: Client;
  initialSubTab?: RegistosSubTab;
  onUpdateClient?: (updatedFields: Partial<Client>) => Promise<void> | void;
}

export const ClientRegistosTab: React.FC<ClientRegistosTabProps> = ({ 
  client, 
  initialSubTab = 'treino',
  onUpdateClient
}) => {
  const [subTab, setSubTab] = useState<RegistosSubTab>(initialSubTab);

  const subTabs = [
    {
      id: 'treino' as RegistosSubTab,
      label: 'Treino',
      icon: CustomEvolutionIcon || CustomDumbbellIcon,
      badge: 'Evolução & Cargas'
    },
    {
      id: 'nutricao' as RegistosSubTab,
      label: 'Nutrição',
      icon: CustomForkKnifeIcon,
      badge: 'Alimentação Diária'
    },
    {
      id: 'cardio' as RegistosSubTab,
      label: 'Cardio',
      icon: CustomVitalIcon,
      badge: 'Aeróbio & Zonas'
    },
    {
      id: 'pos_treino' as RegistosSubTab,
      label: 'Pós-treino',
      icon: HeartPulse,
      badge: 'RPE & Feedback'
    },
    {
      id: 'habitos' as RegistosSubTab,
      label: 'Hábitos Diários',
      icon: CheckCircle2,
      badge: 'Marcadores & Rotina'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Pills container */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto overflow-x-auto">
          {subTabs.map(item => {
            const Icon = item.icon;
            const isActive = subTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSubTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-primary-500' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Info badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Módulo centralizado de registos diários do cliente</span>
        </div>
      </div>

      {/* Sub-tab Content */}
      <div className="transition-all duration-200">
        {subTab === 'treino' && (
          <ClientTrainingEvolutionTab client={client} onUpdateClient={onUpdateClient} />
        )}

        {subTab === 'nutricao' && (
          <ClientNutritionLogTab />
        )}

        {subTab === 'cardio' && (
          <ClientCardioLogTab client={client} />
        )}

        {subTab === 'pos_treino' && (
          <ClientPostWorkoutLogTab client={client} />
        )}

        {subTab === 'habitos' && (
          <ClientDailyLogsTab client={client} />
        )}
      </div>
    </div>
  );
};

export default ClientRegistosTab;
