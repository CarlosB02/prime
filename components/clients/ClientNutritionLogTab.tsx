import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Info, ChevronDown, 
  Target, Flame, Activity, PieChart, Plus, Filter, ArrowUpRight, 
  CheckCircle2, Clock, XCircle, ChevronUp, MoreVertical, Search, Utensils, AlertCircle, TrendingUp
} from 'lucide-react';
import CustomCalendarIcon, { CustomCalendarIcon as CalendarIcon } from '../icons/CustomCalendarIcon';
import { motion, AnimatePresence } from 'motion/react';

type DayStatus = 'completo' | 'parcial' | 'em_falta' | 'livre';

interface FoodItem {
  id: string;
  name: string;
  amount: string;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  substitution?: string;
  notes?: string;
}

interface MealLog {
  id: string;
  name: string;
  time: string;
  foods: FoodItem[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface DailyNutritionLog {
  id: string;
  dateStr: string; // DD/MM/YYYY
  shortDate: string; // 29 Jun
  dayOfWeek: string; // Seg
  status: DayStatus;
  adherence: number;
  mealsDone: number;
  plannedMeals: number;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: MealLog[];
}

const MOCK_MEALS: MealLog[] = [
  {
    id: 'm1',
    name: 'Pequeno Almoço',
    time: '08:00',
    totalKcal: 450,
    totalProtein: 30,
    totalCarbs: 45,
    totalFats: 15,
    foods: [
      { id: 'f1', name: 'Aveia', amount: '60g', kcal: 230, protein: 8, carbs: 40, fats: 4 },
      { id: 'f2', name: 'Whey Protein', amount: '30g', kcal: 120, protein: 22, carbs: 2, fats: 1 },
      { id: 'f3', name: 'Manteiga de Amendoim', amount: '15g', kcal: 100, protein: 0, carbs: 3, fats: 10, substitution: 'Substituído por Manteiga de Amêndoa (mesma quantidade)' }
    ]
  },
  {
    id: 'm2',
    name: 'Almoço',
    time: '13:00',
    totalKcal: 650,
    totalProtein: 45,
    totalCarbs: 65,
    totalFats: 20,
    foods: [
      { id: 'f4', name: 'Frango (Peito)', amount: '150g', kcal: 240, protein: 40, carbs: 0, fats: 5 },
      { id: 'f5', name: 'Arroz Basmati', amount: '200g', kcal: 260, protein: 5, carbs: 55, fats: 1 },
      { id: 'f6', name: 'Azeite', amount: '10ml', kcal: 90, protein: 0, carbs: 0, fats: 10 },
      { id: 'f7', name: 'Brócolos', amount: '150g', kcal: 60, protein: 0, carbs: 10, fats: 4, notes: 'Cliente referiu ter comido espinafres em vez de brócolos.' }
    ]
  },
  {
    id: 'm3',
    name: 'Jantar',
    time: '20:00',
    totalKcal: 550,
    totalProtein: 40,
    totalCarbs: 40,
    totalFats: 25,
    foods: [
      { id: 'f8', name: 'Salmão', amount: '150g', kcal: 300, protein: 30, carbs: 0, fats: 20 },
      { id: 'f9', name: 'Batata Doce', amount: '200g', kcal: 180, protein: 4, carbs: 40, fats: 0 },
      { id: 'f10', name: 'Salada Mista', amount: 'À descrição', kcal: 70, protein: 6, carbs: 0, fats: 5 }
    ]
  }
];

const MOCK_LOGS: DailyNutritionLog[] = [
  { id: 'd1', dateStr: '29/06/2026', shortDate: '29 Jun', dayOfWeek: 'Seg', status: 'completo', adherence: 100, mealsDone: 5, plannedMeals: 5, kcal: 2150, protein: 160, carbs: 200, fats: 65, meals: MOCK_MEALS },
  { id: 'd2', dateStr: '30/06/2026', shortDate: '30 Jun', dayOfWeek: 'Ter', status: 'parcial', adherence: 75, mealsDone: 4, plannedMeals: 5, kcal: 1850, protein: 140, carbs: 160, fats: 55, meals: MOCK_MEALS.slice(0, 2) },
  { id: 'd3', dateStr: '01/07/2026', shortDate: '01 Jul', dayOfWeek: 'Qua', status: 'completo', adherence: 95, mealsDone: 5, plannedMeals: 5, kcal: 2200, protein: 155, carbs: 210, fats: 68, meals: MOCK_MEALS },
  { id: 'd4', dateStr: '02/07/2026', shortDate: '02 Jul', dayOfWeek: 'Qui', status: 'completo', adherence: 100, mealsDone: 5, plannedMeals: 5, kcal: 2100, protein: 165, carbs: 195, fats: 60, meals: MOCK_MEALS },
  { id: 'd5', dateStr: '03/07/2026', shortDate: '03 Jul', dayOfWeek: 'Sex', status: 'em_falta', adherence: 0, mealsDone: 0, plannedMeals: 5, kcal: 0, protein: 0, carbs: 0, fats: 0, meals: [] },
  { id: 'd6', dateStr: '04/07/2026', shortDate: '04 Jul', dayOfWeek: 'Sáb', status: 'livre', adherence: 80, mealsDone: 3, plannedMeals: 4, kcal: 2800, protein: 130, carbs: 300, fats: 90, meals: MOCK_MEALS },
  { id: 'd7', dateStr: '05/07/2026', shortDate: '05 Jul', dayOfWeek: 'Dom', status: 'completo', adherence: 90, mealsDone: 4, plannedMeals: 4, kcal: 2050, protein: 150, carbs: 180, fats: 60, meals: MOCK_MEALS.slice(0, 2) },
];

const STATUS_CONFIG: Record<DayStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  completo: { label: 'Completo', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  parcial: { label: 'Parcial', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  em_falta: { label: 'Não Registado', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  livre: { label: 'Ref. Livre / Cheat', icon: Flame, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' }
};

export const ClientNutritionLogTab: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<DailyNutritionLog | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});

  const toggleMeal = (id: string) => {
    setExpandedMeals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in pb-20">
      
      {/* LEFT COLUMN: Main List */}
      <div className="flex-1 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Registo de Nutrição</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Acompanhamento diário da adesão ao plano alimentar.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setShowLegend(!showLegend)}
              className="px-3 py-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-2"
            >
              <Info size={16} /> Legenda
            </button>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 px-3 hover:bg-slate-50 dark:hover:bg-slate-700 py-1.5 rounded-lg transition-colors">
                <span>29 Jun - 05 Jul</span>
                <ChevronDown size={14} />
              </button>
              <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="hidden sm:flex px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-sm font-bold items-center gap-2">
              <CheckCircle2 size={16} /> Semana Concluída
            </div>
          </div>
        </div>

        {/* Legend Panel */}
        <AnimatePresence>
          {showLegend && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl mb-4 shadow-sm">
                <span className="text-sm font-bold text-slate-500">Estados:</span>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${config.bg} ${config.color}`}>
                    <config.icon size={16} />
                    {config.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weekly Averages */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kcal Médias</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">2150</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1">Adesão</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">85% <TrendingUp size={16}/></p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Proteína</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">142g</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Hidratos</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">190g</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Gorduras</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">62g</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Refeições/Dia</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">4.2</p>
          </div>
        </div>

        {/* Main Table Panel */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Pesquisar datas..." 
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
              <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-900">
                <Filter size={18} />
              </button>
            </div>
            
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 transition-all">
              <Plus size={16} /> Registar Refeição
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3 min-w-[120px]">Data</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Adesão</th>
                  <th className="px-4 py-3 text-center">Refeições</th>
                  <th className="px-4 py-3 text-center">Kcal</th>
                  <th className="px-4 py-3 text-center text-rose-500">P</th>
                  <th className="px-4 py-3 text-center text-blue-500">HC</th>
                  <th className="px-4 py-3 text-center text-amber-500">G</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {MOCK_LOGS.map((log) => {
                  const status = STATUS_CONFIG[log.status];
                  const isSelected = selectedDay?.id === log.id;
                  
                  return (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedDay(log)}
                      className={`group cursor-pointer transition-colors ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className={`font-bold ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-slate-800 dark:text-white'}`}>
                            {log.shortDate}
                          </span>
                          <span className="text-xs text-slate-500">{log.dayOfWeek}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold mx-auto w-max ${status.bg} ${status.color}`}>
                          <status.icon size={12} />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${
                          log.adherence >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 
                          log.adherence >= 50 ? 'text-amber-600 dark:text-amber-400' : 
                          'text-rose-600 dark:text-rose-400'
                        }`}>
                          {log.adherence}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-300">
                        {log.mealsDone}/{log.plannedMeals}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-white">
                        {log.kcal > 0 ? log.kcal : '-'}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-rose-600 dark:text-rose-400">
                        {log.protein > 0 ? `${log.protein}g` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-blue-600 dark:text-blue-400">
                        {log.carbs > 0 ? `${log.carbs}g` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-amber-600 dark:text-amber-400">
                        {log.fats > 0 ? `${log.fats}g` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Averages */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <CalendarIcon size={16} /> Médias Mensais (Julho)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kcal Médias</p>
              <p className="text-lg font-black text-slate-800 dark:text-white">2180</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Adesão</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">82%</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Proteína</p>
              <p className="text-lg font-black text-slate-800 dark:text-white">145g</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hidratos</p>
              <p className="text-lg font-black text-slate-800 dark:text-white">195g</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gorduras</p>
              <p className="text-lg font-black text-slate-800 dark:text-white">64g</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Refeições/Dia</p>
              <p className="text-lg font-black text-slate-800 dark:text-white">4.5</p>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Sidebar Summary */}
      <div className="w-full xl:w-[400px] shrink-0">
        {selectedDay ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-6">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <CalendarIcon size={18} className="text-primary-500" />
                  {selectedDay.dateStr}
                </h3>
                <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${STATUS_CONFIG[selectedDay.status].bg} ${STATUS_CONFIG[selectedDay.status].color}`}>
                  <CheckCircle2 size={10} /> {STATUS_CONFIG[selectedDay.status].label}
                </div>
              </div>

              {/* Daily Macros Summary */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Kcal</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedDay.kcal}</p>
                </div>
                <div className="p-2 bg-rose-50 dark:bg-rose-900/10 rounded-xl text-center border border-rose-100 dark:border-rose-900/20">
                  <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider mb-0.5">P (g)</p>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{selectedDay.protein}</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-center border border-blue-100 dark:border-blue-900/20">
                  <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider mb-0.5">HC (g)</p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedDay.carbs}</p>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-center border border-amber-100 dark:border-amber-900/20">
                  <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider mb-0.5">G (g)</p>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{selectedDay.fats}</p>
                </div>
              </div>
            </div>

            {/* Meals List */}
            <div className="p-5 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/20">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Utensils size={14} /> Refeições do Dia ({selectedDay.mealsDone}/{selectedDay.plannedMeals})
              </h4>

              {selectedDay.meals.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Nenhuma refeição registada neste dia.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDay.meals.map(meal => {
                    const isExpanded = expandedMeals[meal.id];
                    return (
                      <div key={meal.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
                        <div 
                          className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          onClick={() => toggleMeal(meal.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                              {meal.time}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-slate-800 dark:text-white">{meal.name}</h5>
                              <p className="text-[11px] text-slate-500">{meal.totalKcal} kcal</p>
                            </div>
                          </div>
                          <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
                            >
                              <div className="p-3 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
                                {/* Macros of Meal */}
                                <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-3 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                  <span className="text-rose-500">P: {meal.totalProtein}g</span>
                                  <span className="text-blue-500">HC: {meal.totalCarbs}g</span>
                                  <span className="text-amber-500">G: {meal.totalFats}g</span>
                                </div>

                                {/* Foods List */}
                                {meal.foods.map(food => (
                                  <div key={food.id} className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                          {food.name} <span className="font-normal text-slate-500">({food.amount})</span>
                                        </p>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">{food.kcal} kcal</span>
                                    </div>
                                    
                                    {food.substitution && (
                                      <div className="flex items-start gap-1.5 p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-900/30">
                                        <AlertCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-tight">{food.substitution}</p>
                                      </div>
                                    )}
                                    
                                    {food.notes && (
                                      <div className="flex items-start gap-1.5 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900/30">
                                        <Info size={12} className="text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-tight">{food.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all">
                <ArrowUpRight size={16} /> Ver Registo Completo
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 h-[400px] flex flex-col items-center justify-center text-slate-500 sticky top-6">
            <Utensils size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium">Selecione um dia</p>
            <p className="text-xs text-slate-400 mt-1 text-center max-w-[200px]">
              Clique numa linha da tabela para ver os detalhes da nutrição
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientNutritionLogTab;
