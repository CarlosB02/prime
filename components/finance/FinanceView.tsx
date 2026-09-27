import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Users,
  Search,
  Clock,
  Plus,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  CreditCard,
  UserPlus,
  RefreshCw,
  TrendingDown,
  Globe,
  Instagram,
  UserCheck
} from 'lucide-react';
import { 
  CustomWalletIcon, 
  CustomTargetIcon, 
  CustomEuroIcon, 
  CustomEvolutionIcon, 
  CustomUserPlusIcon 
} from '../icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';

// --- Mock Data ---

const BILLING_HISTORY_DATA = [
  { date: '1 Mar', processados: 1200, adesao: 400, renovacao: 800 },
  { date: '5 Mar', processados: 1500, adesao: 600, renovacao: 900 },
  { date: '10 Mar', processados: 1100, adesao: 300, renovacao: 800 },
  { date: '15 Mar', processados: 1800, adesao: 800, renovacao: 1000 },
  { date: '20 Mar', processados: 2200, adesao: 1000, renovacao: 1200 },
  { date: '25 Mar', processados: 1900, adesao: 700, renovacao: 1200 },
  { date: '30 Mar', processados: 2500, adesao: 900, renovacao: 1600 },
];

const BUSINESS_PERFORMANCE_DATA = [
  { month: 'Out', clientesAtivos: 45, novosAlunos: 5, cancelamentos: 2, receita: 4200, renovacoes: 40 },
  { month: 'Nov', clientesAtivos: 48, novosAlunos: 6, cancelamentos: 3, receita: 4500, renovacoes: 42 },
  { month: 'Dez', clientesAtivos: 52, novosAlunos: 8, cancelamentos: 4, receita: 4900, renovacoes: 45 },
  { month: 'Jan', clientesAtivos: 58, novosAlunos: 10, cancelamentos: 4, receita: 5400, renovacoes: 50 },
  { month: 'Fev', clientesAtivos: 63, novosAlunos: 8, cancelamentos: 3, receita: 5900, renovacoes: 55 },
  { month: 'Mar', clientesAtivos: 67, novosAlunos: 7, cancelamentos: 3, receita: 6200, renovacoes: 60 },
];

const PLAN_REVENUE = [
  { name: 'Acompanhamento Premium', value: 3200, percent: 45, color: '#3b82f6' },
  { name: 'Plano Nutrição + Treino', value: 1800, percent: 25, color: '#10b981' },
  { name: 'Plano Treino', value: 1200, percent: 18, color: '#8b5cf6' },
  { name: 'Consultoria Online', value: 600, percent: 12, color: '#f59e0b' },
];

const ACQUISITION_DATA = [
  { name: 'Instagram', value: 45, color: '#d946ef' }, // pink
  { name: 'Referências', value: 30, color: '#3b82f6' }, // blue
  { name: 'Website', value: 15, color: '#10b981' }, // emerald
  { name: 'Outros', value: 10, color: '#94a3b8' }, // slate
];

const FinanceView: React.FC = () => {
  const [period, setPeriod] = useState('este_mes');
  const [billingPeriod, setBillingPeriod] = useState('30d');

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Financeiro</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Acompanhe a saúde financeira, receitas e desempenho comercial do negócio.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option value="hoje">Hoje</option>
            <option value="esta_semana">Esta Semana</option>
            <option value="este_mes">Este Mês</option>
            <option value="mes_passado">Mês Passado</option>
            <option value="este_ano">Este Ano</option>
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Receita Hoje */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Receita Hoje</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">€240</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <CustomEuroIcon size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm mt-auto">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight size={14} className="mr-0.5" /> +15%
            </span>
            <span className="text-slate-400 text-xs">vs ontem</span>
          </div>
        </div>

        {/* Receita Este Mês */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Receita Este Mês</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">€6,800</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CustomEvolutionIcon size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm mt-auto">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight size={14} className="mr-0.5" /> +12.5%
            </span>
            <span className="text-slate-400 text-xs">vs mês passado</span>
          </div>
        </div>

        {/* Receita Este Ano */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Receita Este Ano</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">€28,400</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <CustomWalletIcon size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm mt-auto">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight size={14} className="mr-0.5" /> +24%
            </span>
            <span className="text-slate-400 text-xs">vs ano passado</span>
          </div>
        </div>

        {/* Meta Mensal */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Meta Mensal</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">85%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
              <CustomTargetIcon size={20} />
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-1 mb-3">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <div className="flex items-center gap-1.5 text-sm mt-auto justify-between">
            <span className="text-slate-500 text-xs font-medium">€6,800 de €8,000</span>
            <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">Faltam €1,200</span>
          </div>
        </div>

      </div>

      {/* CHARTS GRID 1: Billing History & Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Histórico de Faturação */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Histórico de Faturação</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evolução financeira e fontes de receita</p>
            </div>
            <select 
              value={billingPeriod}
              onChange={(e) => setBillingPeriod(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="3m">Últimos 3 meses</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BILLING_HISTORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProcessados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdesao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val: any) => `€${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                  formatter={(value: number) => [`€${value}`, '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="processados" name="Pagamentos Processados" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProcessados)" />
                <Area type="monotone" dataKey="adesao" name="Novas Adesões" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdesao)" />
                <Area type="monotone" dataKey="renovacao" name="Renovações" stroke="#8b5cf6" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Comercial */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="mb-6 flex items-center gap-2">
             <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <BarChart3 size={18} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Performance Comercial</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Desempenho de vendas (Mês)</p>
             </div>
          </div>

          <div className="flex-1 flex flex-col justify-around gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <CustomUserPlusIcon size={18} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Novos Clientes</span>
              </div>
              <div className="text-right">
                 <span className="text-base font-black text-slate-800 dark:text-white block">12</span>
                 <span className="text-[10px] font-bold text-emerald-500">+3 vs mês pass.</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-blue-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Renovações</span>
              </div>
              <div className="text-right">
                 <span className="text-base font-black text-slate-800 dark:text-white block">45</span>
                 <span className="text-[10px] font-bold text-emerald-500">92% taxa ret.</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <ArrowUpRight size={18} className="text-purple-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upsells</span>
              </div>
              <div className="text-right">
                 <span className="text-base font-black text-slate-800 dark:text-white block">8</span>
                 <span className="text-[10px] font-bold text-emerald-500">+2 vs mês pass.</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ticket Médio</span>
              </div>
              <div className="text-right">
                 <span className="text-base font-black text-slate-800 dark:text-white block">€101.50</span>
                 <span className="text-[10px] font-bold text-emerald-500">+€5.50</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-rose-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Conversão de Leads</span>
              </div>
              <div className="text-right">
                 <span className="text-base font-black text-slate-800 dark:text-white block">24%</span>
                 <span className="text-[10px] font-bold text-rose-500">-2% vs mês pass.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: Business Performance & Projections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Desempenho do Negócio */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Desempenho Geral do Negócio</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evolução multi-métrica dos últimos 6 meses</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BUSINESS_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val: any) => `€${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="clientesAtivos" name="Clientes Ativos" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="novosAlunos" name="Novos Alunos" stroke="#10b981" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="cancelamentos" name="Cancelamentos" stroke="#ef4444" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="receita" name="Receita Total" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projeção Financeira e MRR */}
        <div className="space-y-6 flex flex-col">
          {/* Receita Recorrente Mensal (MRR) */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl transition-colors" />
             <div className="flex items-center gap-2 mb-4 relative z-10">
               <CustomEvolutionIcon size={18} />
               <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Receita Recorrente (MRR)</h3>
             </div>
             <div className="relative z-10">
               <div className="flex items-end gap-3 mb-2">
                 <h2 className="text-4xl font-black text-slate-800 dark:text-white">€5,900</h2>
                 <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold mb-1 text-sm bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                    <ArrowUpRight size={14} className="mr-0.5" /> +8.2%
                 </span>
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400">Representa 86% da receita total mensal. Crescimento sustentável nos últimos 6 meses.</p>
             </div>
          </div>

          {/* Projeção Financeira */}
          <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col">
             <div className="flex items-center gap-2 mb-6">
                <LineChartIcon size={18} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projeção Financeira</h3>
             </div>

             <div className="flex-1 flex flex-col gap-4 justify-center">
                <div>
                  <div className="flex justify-between items-end mb-1">
                     <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Receita Garantida (MRR)</span>
                     <span className="text-sm font-bold text-slate-800 dark:text-white">€5,900</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div></div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                     <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Receita Previsível (Novos/Renov.)</span>
                     <span className="text-sm font-bold text-slate-800 dark:text-white">€1,450</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '20%' }}></div></div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Projeção Total</span>
                     <span className="text-lg font-black text-primary-600 dark:text-primary-400">€7,350</span>
                  </div>
                  <p className="text-center text-xs text-slate-500 mt-3 font-medium">92% de probabilidade de atingir a meta mensal baseada no histórico atual.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID: Resumo, Planos, Fontes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Resumo do Período */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Resumo do Período</h3>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Receita Total</p>
                 <p className="text-xl font-black text-slate-800 dark:text-white">€6,800</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Valor Recebido</p>
                 <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">€6,350</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Pagamentos Pendentes</p>
                 <p className="text-xl font-black text-amber-500">€300</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Valor em Atraso</p>
                 <p className="text-xl font-black text-rose-500">€150</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Custo Custo por Lead</p>
                 <p className="text-xl font-black text-slate-800 dark:text-white">€12.5</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Margem Operacional</p>
                 <p className="text-xl font-black text-slate-800 dark:text-white">78%</p>
              </div>
           </div>
        </div>

        {/* Planos Mais Vendidos */}
        <div className="glass-card rounded-2xl p-6">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Planos Mais Vendidos</h3>
           <div className="space-y-4">
              {PLAN_REVENUE.map((plan, i) => (
                 <div key={i}>
                    <div className="flex justify-between items-end mb-1">
                       <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{plan.name}</span>
                       <span className="text-sm font-bold text-slate-800 dark:text-white">€{plan.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 flex overflow-hidden">
                       <div className="h-1.5 rounded-full" style={{ width: `${plan.percent}%`, backgroundColor: plan.color }}></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Fontes de Aquisição */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
           <div className="w-full mb-2">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">Fontes de Aquisição</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">Origem de novos pagamentos</p>
           </div>
           
           <div className="h-[140px] w-[140px] relative my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ACQUISITION_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value">
                    {ACQUISITION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Clientes']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                 <span className="text-xl font-black text-slate-800 dark:text-white">12</span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Novos</span>
              </div>
           </div>

           <div className="w-full mt-4 flex flex-col gap-2">
              {ACQUISITION_DATA.slice(0, 3).map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="font-semibold text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">{item.value}%</span>
                 </div>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
};

export default FinanceView;
