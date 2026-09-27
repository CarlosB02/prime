import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Info, Search, Filter, Plus, 
  ChevronDown, ArrowRightLeft, CheckCircle2, XCircle, AlertCircle, Eye,
  Activity, Droplet, Utensils, Flame, ChevronUp, ChevronRight as ChevronRightIcon,
  Clock
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';

interface FoodLog {
  id: string;
  name: string;
  quantity: number;
  measure: string;
  kcal: number;
  prot: number;
  carbs: number;
  fat: number;
  isSubstitute?: boolean;
}

interface MealLog {
  id: string;
  name: string;
  time: string;
  kcal: number;
  prot: number;
  carbs: number;
  fat: number;
  foods: FoodLog[];
  notes?: string;
}

interface DayLog {
  id: string;
  date: string;
  status: 'complete' | 'partial' | 'missed';
  adherence: number;
  kcal: number;
  prot: number;
  carbs: number;
  fat: number;
  mealsCount: number;
  meals: MealLog[];
}

const MOCK_LOGS: DayLog[] = [
  {
    id: 'd1', date: '2026-07-01', status: 'complete', adherence: 100, kcal: 2450, prot: 180, carbs: 220, fat: 65, mealsCount: 5,
    meals: [
      {
        id: 'm1', name: 'Pequeno-Almoço', time: '08:00', kcal: 450, prot: 30, carbs: 50, fat: 15,
        foods: [
          { id: 'f1', name: 'Aveia em Flocos', quantity: 60, measure: 'g', kcal: 230, prot: 8, carbs: 40, fat: 4 },
          { id: 'f2', name: 'Leite Meio Gordo', quantity: 200, measure: 'ml', kcal: 94, prot: 6.6, carbs: 9.6, fat: 3.2 },
          { id: 'f3', name: 'Proteína Whey', quantity: 30, measure: 'g', kcal: 120, prot: 24, carbs: 2, fat: 1.5, isSubstitute: true }
        ],
        notes: 'Troquei os ovos por whey porque não tinha tempo de cozinhar.'
      },
      {
        id: 'm2', name: 'Almoço', time: '13:00', kcal: 750, prot: 55, carbs: 80, fat: 20,
        foods: [
          { id: 'f4', name: 'Arroz Basmati', quantity: 100, measure: 'g', kcal: 350, prot: 8, carbs: 75, fat: 1 },
          { id: 'f5', name: 'Peito de Frango', quantity: 150, measure: 'g', kcal: 165, prot: 31, carbs: 0, fat: 3.6 },
          { id: 'f6', name: 'Azeite', quantity: 1, measure: 'c. sopa', kcal: 120, prot: 0, carbs: 0, fat: 14 }
        ]
      }
    ]
  },
  {
    id: 'd2', date: '2026-07-02', status: 'partial', adherence: 75, kcal: 1800, prot: 140, carbs: 150, fat: 55, mealsCount: 4,
    meals: [
       {
        id: 'm3', name: 'Pequeno-Almoço', time: '08:30', kcal: 400, prot: 25, carbs: 45, fat: 12,
        foods: [
          { id: 'f7', name: 'Pão Integral', quantity: 2, measure: 'fatias', kcal: 150, prot: 6, carbs: 25, fat: 2 },
          { id: 'f8', name: 'Ovos', quantity: 2, measure: 'unid', kcal: 140, prot: 12, carbs: 1, fat: 10 }
        ]
      }
    ]
  },
  {
    id: 'd3', date: '2026-07-03', status: 'missed', adherence: 0, kcal: 0, prot: 0, carbs: 0, fat: 0, mealsCount: 0,
    meals: []
  },
  {
    id: 'd4', date: '2026-07-04', status: 'complete', adherence: 95, kcal: 2300, prot: 175, carbs: 200, fat: 60, mealsCount: 5,
    meals: []
  }
];

export const ClientNutritionLogs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-07-01');
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});

  const toggleMeal = (id: string) => setExpandedMeals(p => ({ ...p, [id]: !p[id] }));

  const selectedLog = MOCK_LOGS.find(l => l.date === selectedDate);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'complete': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-bold"><CheckCircle2 size={12}/> Completo</span>;
      case 'partial': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 text-xs font-bold"><AlertCircle size={12}/> Parcial</span>;
      case 'missed': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 text-xs font-bold"><XCircle size={12}/> Falhou</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden -mx-4 -my-4 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 bg-slate-50 dark:bg-slate-900 relative">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 lg:px-6 shadow-sm shrink-0 z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
               <ArrowRightLeft size={20} className="rotate-180" />
             </button>
             <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white">Registos de Nutrição</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Acompanhamento da adesão ao plano alimentar.</p>
             </div>
           </div>
           
           <div className="flex items-center gap-2">
             <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors" title="Legenda de Estados">
                <Info size={20} />
             </button>
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
               <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                 <ChevronLeft size={16} />
               </button>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-300 px-2 min-w-[120px] text-center">
                 29 Jun - 05 Jul
               </span>
               <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                 <ChevronRight size={16} />
               </button>
             </div>
             <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors">
               <CustomCalendarIcon size={16}/> Esta Semana <ChevronDown size={14}/>
             </button>
           </div>
        </div>

        {/* Weekly Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Kcal Médias</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white"><Flame size={16} className="text-orange-500"/><span className="font-black text-lg">2180</span></div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Adesão Média</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white"><Activity size={16} className="text-emerald-500"/><span className="font-black text-lg">85%</span></div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Hidratos</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="font-black text-lg">240g</span></div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Proteína</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white"><span className="w-3 h-3 rounded-full bg-rose-500"></span><span className="font-black text-lg">165g</span></div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Gorduras</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="font-black text-lg">60g</span></div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Refeições/Dia</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white"><Utensils size={16} className="text-primary-500"/><span className="font-black text-lg">4.2</span></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Table */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
             <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
                  <CustomCalendarIcon size={14} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Este Mês</span>
                  <ChevronDown size={14} className="text-slate-400 ml-2" />
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
                  <Filter size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Todos os Estados</span>
                  <ChevronDown size={14} className="text-slate-400 ml-2" />
                </div>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all">
               <Plus size={16} /> Registar Refeição
             </button>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Refeições</th>
                    <th className="px-4 py-3">Adesão</th>
                    <th className="px-4 py-3">Kcal</th>
                    <th className="px-4 py-3">Prot / HC / Gord</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {MOCK_LOGS.map(log => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedDate(log.date)}
                      className={`cursor-pointer transition-colors ${selectedDate === log.date ? 'bg-primary-50 dark:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                      <td className="px-4 py-4 font-bold text-slate-800 dark:text-white">
                        {new Date(log.date).toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{log.mealsCount}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${log.adherence >= 80 ? 'bg-emerald-500' : log.adherence >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${log.adherence}%` }}></div>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{log.adherence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200">{log.kcal}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs">
                        <span className="text-rose-500 font-semibold">{log.prot}g</span> / <span className="text-blue-500 font-semibold">{log.carbs}g</span> / <span className="text-amber-500 font-semibold">{log.fat}g</span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Averages - bottom of table area */}
          <div className="mt-8 mb-6">
             <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 uppercase tracking-wider">Médias Mensais (Julho)</h3>
             <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Kcal</p>
                  <p className="font-black text-slate-800 dark:text-white">2105</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Adesão</p>
                  <p className="font-black text-slate-800 dark:text-white text-emerald-600 dark:text-emerald-400">82%</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Hidratos</p>
                  <p className="font-black text-slate-800 dark:text-white">230g</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Proteína</p>
                  <p className="font-black text-slate-800 dark:text-white">160g</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Gorduras</p>
                  <p className="font-black text-slate-800 dark:text-white">62g</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Refeições/Dia</p>
                  <p className="font-black text-slate-800 dark:text-white">4.1</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Day Details */}
        <div className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 hidden xl:flex">
          {selectedLog ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">
                      {new Date(selectedLog.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </h2>
                    {getStatusBadge(selectedLog.status)}
                  </div>

                  {/* Day Macros */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Total Kcal</span>
                        <div className="font-black text-xl text-slate-800 dark:text-white">{selectedLog.kcal}</div>
                     </div>
                     <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Adesão</span>
                        <div className="font-black text-xl text-slate-800 dark:text-white">{selectedLog.adherence}%</div>
                     </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-lg p-2 text-center">
                       <p className="text-[10px] font-bold text-rose-600/70 uppercase">Prot</p>
                       <p className="font-bold text-rose-600 dark:text-rose-400 text-sm">{selectedLog.prot}g</p>
                    </div>
                    <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-2 text-center">
                       <p className="text-[10px] font-bold text-blue-600/70 uppercase">HC</p>
                       <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">{selectedLog.carbs}g</p>
                    </div>
                    <div className="flex-1 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-2 text-center">
                       <p className="text-[10px] font-bold text-amber-600/70 uppercase">Gord</p>
                       <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">{selectedLog.fat}g</p>
                    </div>
                  </div>
               </div>

               <div className="p-6">
                 <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Refeições Registadas ({selectedLog.meals.length})</h3>
                 
                 {selectedLog.meals.length === 0 ? (
                   <div className="text-center py-8 text-slate-500 text-sm">Nenhuma refeição registada.</div>
                 ) : (
                   <div className="space-y-3">
                     {selectedLog.meals.map(meal => {
                       const isExpanded = expandedMeals[meal.id];
                       return (
                         <div key={meal.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                           <button onClick={() => toggleMeal(meal.id)} className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                             <div>
                               <p className="font-bold text-sm text-slate-800 dark:text-white">{meal.name}</p>
                               <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                 <span className="flex items-center gap-1"><Clock size={10} /> {meal.time}</span>
                                 <span>&bull;</span>
                                 <span className="font-semibold text-primary-600 dark:text-primary-400">{meal.kcal} kcal</span>
                               </div>
                             </div>
                             {isExpanded ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                           </button>

                           {isExpanded && (
                             <div className="p-3 bg-white dark:bg-slate-900">
                               {/* Observações */}
                               {meal.notes && (
                                 <div className="mb-3 p-2.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg flex gap-2 text-sm text-amber-800 dark:text-amber-300">
                                   <Info size={14} className="shrink-0 mt-0.5" />
                                   <p className="leading-tight">{meal.notes}</p>
                                 </div>
                               )}
                               
                               <div className="space-y-2">
                                 {meal.foods.map(food => (
                                   <div key={food.id} className="flex items-start justify-between text-sm group">
                                     <div>
                                       <div className="flex items-center gap-1.5">
                                         <span className="font-medium text-slate-700 dark:text-slate-300">{food.name}</span>
                                         {food.isSubstitute && (
                                           <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-[9px] font-bold uppercase rounded">Substituto</span>
                                         )}
                                       </div>
                                       <span className="text-xs text-slate-500">{food.quantity} {food.measure}</span>
                                     </div>
                                     <div className="text-right">
                                       <span className="font-bold text-slate-700 dark:text-slate-200 block">{food.kcal} kcal</span>
                                       <span className="text-[10px] text-slate-400">P:{food.prot} H:{food.carbs} G:{food.fat}</span>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>

               {selectedLog.meals.length > 0 && (
                 <div className="p-6 pt-0 mt-auto">
                    <button className="w-full py-2.5 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40 rounded-xl font-bold text-sm transition-colors">
                      Ver Registo Completo
                    </button>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center text-sm">
              Selecione um dia na tabela para ver os detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

