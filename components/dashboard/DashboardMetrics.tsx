import React from 'react';
import { TrendingDown } from 'lucide-react';
import { 
  CustomUsersIcon, 
  CustomUserCheckIcon, 
  CustomUserPlusIcon, 
  CustomUserMinusIcon,
  CustomEvolutionIcon
} from '../icons';

interface MetricCardProps {
  title: string;
  value: number;
  variation: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function MetricCard({ title, value, variation, icon, iconBg, iconColor }: MetricCardProps) {
  const isPositive = variation >= 0;
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">{title}</h3>
          <p className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{value}</p>
        </div>
      </div>
      
      <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
        {isPositive ? <CustomEvolutionIcon size={12} /> : <TrendingDown size={12} />}
        <span>{Math.abs(variation)}%</span>
      </div>
    </div>
  );
}

export function DashboardMetrics() {
  const metrics = {
    total: { value: 142, var: 12 },
    ativos: { value: 128, var: 8 },
    novos: { value: 14, var: 24 },
    inativos: { value: 14, var: -5 },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Total de Alunos" 
        value={metrics.total.value} 
        variation={metrics.total.var} 
        icon={<CustomUsersIcon size={20} />} 
        iconBg="bg-blue-50 dark:bg-blue-900/20" 
        iconColor="text-blue-600 dark:text-blue-400" 
      />
      <MetricCard 
        title="Alunos Ativos" 
        value={metrics.ativos.value} 
        variation={metrics.ativos.var} 
        icon={<CustomUserCheckIcon size={20} />} 
        iconBg="bg-emerald-50 dark:bg-emerald-900/20" 
        iconColor="text-emerald-600 dark:text-emerald-400" 
      />
      <MetricCard 
        title="Novos Alunos" 
        value={metrics.novos.value} 
        variation={metrics.novos.var} 
        icon={<CustomUserPlusIcon size={20} />} 
        iconBg="bg-purple-50 dark:bg-purple-900/20" 
        iconColor="text-purple-600 dark:text-purple-400" 
      />
      <MetricCard 
        title="Alunos Inativos" 
        value={metrics.inativos.value} 
        variation={metrics.inativos.var} 
        icon={<CustomUserMinusIcon size={20} />} 
        iconBg="bg-slate-100 dark:bg-slate-800" 
        iconColor="text-slate-600 dark:text-slate-400" 
      />
    </div>
  );
}
