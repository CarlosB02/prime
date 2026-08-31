import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Edit2, Search, X, Utensils, Save, 
  Settings, ChevronRight, Copy, MoreVertical, EyeOff, BookOpen, Calendar,
  Bell, FileText, Check, ChevronDown, Activity, Trash, ArrowRightLeft
} from 'lucide-react';

export interface FoodItem {
  id: string;
  name: string;
  baseUnit: string;
  kcal: number;
  prot: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const MOCK_FOOD_DB: FoodItem[] = [
  { id: '1', name: 'Arroz Branco Cozido', baseUnit: 'g', kcal: 130, prot: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { id: '2', name: 'Peito de Frango Grelhado', baseUnit: 'g', kcal: 165, prot: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { id: '3', name: 'Aveia em Flocos', baseUnit: 'g', kcal: 389, prot: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6 },
  { id: '4', name: 'Ovo Inteiro Cozido', baseUnit: 'unid', kcal: 78, prot: 6.5, carbs: 0.6, fat: 5.5, fiber: 0 }, 
  { id: '5', name: 'Batata Doce Cozida', baseUnit: 'g', kcal: 86, prot: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
  { id: '6', name: 'Azeite Extra Virgem', baseUnit: 'ml', kcal: 884, prot: 0, carbs: 0, fat: 100, fiber: 0 },
  { id: '7', name: 'Brócolos Cozidos', baseUnit: 'g', kcal: 35, prot: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3 },
  { id: '8', name: 'Pão de Forma Integral', baseUnit: 'unid', kcal: 65, prot: 2.5, carbs: 11, fat: 0.9, fiber: 1.5 },
  { id: '9', name: 'Leite Meio Gordo', baseUnit: 'ml', kcal: 47, prot: 3.3, carbs: 4.8, fat: 1.6, fiber: 0 },
];

type MealOptionFood = {
  id: string;
  foodId: string;
  quantity: number;
  measure: string;
  substitutes: MealOptionFood[];
};

type MealOption = {
  id: string;
  name: string;
  disabled: boolean;
  notes: string;
  foods: MealOptionFood[];
};

type Meal = {
  id: string;
  name: string;
  time?: string;
  options: MealOption[];
};

type DayType = {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
};

type NutritionPlan = {
  id: string;
  name: string;
  notes: string;
  startDate: string;
  endDate: string;
  dayTypes: DayType[];
};

const INITIAL_PLAN: NutritionPlan = {
  id: 'p1',
  name: 'Plano Hipertrofia (Diogo)',
  notes: 'Foco no ganho de massa magra sem acumular muita gordura. Beber pelo menos 3L de água.',
  startDate: '2026-07-01',
  endDate: '2026-08-31',
  dayTypes: [
    {
      id: 'dt1',
      name: 'Dia de Treino',
      description: 'Hidratos Altos',
      meals: [
        {
          id: 'm1',
          name: 'Pequeno-Almoço',
          options: [
            {
              id: 'o1',
              name: 'Opção 1',
              disabled: false,
              notes: 'Fazer em formato de panqueca ou papas de aveia.',
              foods: [
                { id: 'f1', foodId: '3', quantity: 80, measure: '8 c. sopa', substitutes: [] },
                { id: 'f2', foodId: '4', quantity: 3, measure: '3 unid', substitutes: [] }
              ]
            },
            {
              id: 'o2',
              name: 'Opção 2',
              disabled: false,
              notes: 'Pão torrado com ovos mexidos.',
              foods: [
                { id: 'f3', foodId: '8', quantity: 2, measure: '2 fatias', substitutes: [] },
                { id: 'f4', foodId: '4', quantity: 3, measure: '3 unid', substitutes: [] }
              ]
            }
          ]
        },
        {
          id: 'm2',
          name: 'Almoço',
          options: [
            {
              id: 'o3',
              name: 'Opção 1',
              disabled: false,
              notes: 'Temperar apenas com ervas e especiarias.',
              foods: [
                { id: 'f5', foodId: '1', quantity: 150, measure: '5 c. sopa', substitutes: [] },
                { id: 'f6', foodId: '2', quantity: 150, measure: '1 bife médio', substitutes: [] },
                { id: 'f7', foodId: '7', quantity: 100, measure: '1 taça', substitutes: [] }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'dt2',
      name: 'Dia de Descanso',
      description: 'Hidratos Baixos',
      meals: []
    }
  ]
};

const getCalculatedMacros = (foodId: string, quantity: number) => {
  const food = MOCK_FOOD_DB.find(f => f.id === foodId);
  if(!food) return { kcal: 0, prot: 0, carbs: 0, fat: 0, fiber: 0, baseUnit: 'g', foodName: 'Desconhecido' };
  
  const multiplier = food.baseUnit === 'unid' ? quantity : quantity / 100;
  return {
    foodName: food.name,
    baseUnit: food.baseUnit,
    kcal: (food.kcal * multiplier),
    prot: (food.prot * multiplier),
    carbs: (food.carbs * multiplier),
    fat: (food.fat * multiplier),
    fiber: (food.fiber * multiplier),
  };
};

const getOptionMacros = (option: MealOption) => {
  return option.foods.reduce((acc, f) => {
    const m = getCalculatedMacros(f.foodId, f.quantity);
    acc.kcal += m.kcal; acc.prot += m.prot; acc.carbs += m.carbs; acc.fat += m.fat; acc.fiber += m.fiber;
    return acc;
  }, { kcal: 0, prot: 0, carbs: 0, fat: 0, fiber: 0 });
};

export interface NutritionPlanBuilderProps {
  planData?: NutritionPlan | null;
  onSave: (plan: NutritionPlan) => void;
  onCancel: () => void;
}

const NutritionPlanBuilder: React.FC<NutritionPlanBuilderProps> = ({ planData, onSave, onCancel }) => {
  const [plan, setPlan] = useState<NutritionPlan>(planData || INITIAL_PLAN);
  const [activeDayTypeIdx, setActiveDayTypeIdx] = useState<number>(0);
  const [activeOptionsMap, setActiveOptionsMap] = useState<Record<string, string>>({}); // mealId -> optionId
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({}); // mealId -> boolean

  const activeDayType = plan.dayTypes[activeDayTypeIdx];

  const updatePlan = (newPlan: NutritionPlan) => setPlan(newPlan);

  const toggleMealExpanded = (mealId: string) => {
    setExpandedMeals(prev => ({...prev, [mealId]: !prev[mealId]}));
  };

  // Initialize active options
  useMemo(() => {
    if(!activeDayType) return;
    const newMap = { ...activeOptionsMap };
    activeDayType.meals.forEach(m => {
      if (!newMap[m.id] && m.options.length > 0) {
        newMap[m.id] = m.options[0].id;
      }
    });
    setActiveOptionsMap(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDayType]);

  const updateMealOption = (mealId: string, optionId: string, updater: (opt: MealOption) => MealOption) => {
    const updatedPlan = { ...plan };
    const dt = updatedPlan.dayTypes[activeDayTypeIdx];
    const meal = dt.meals.find(m => m.id === mealId);
    if(meal) {
      const oIdx = meal.options.findIndex(o => o.id === optionId);
      if(oIdx > -1) {
        meal.options[oIdx] = updater(meal.options[oIdx]);
        setPlan(updatedPlan);
      }
    }
  };

  // Bottom bar totals logic
  const dayMacros = useMemo(() => {
    if(!activeDayType) return { kcal: 0, prot: 0, carbs: 0, fat: 0, fiber: 0 };
    return activeDayType.meals.reduce((acc, m) => {
      // get currently selected option or the first one
      const oId = activeOptionsMap[m.id] || (m.options[0]?.id);
      const opt = m.options.find(o => o.id === oId);
      if (opt && !opt.disabled) {
        const mMacros = getOptionMacros(opt);
        acc.kcal += mMacros.kcal; acc.prot += mMacros.prot; acc.carbs += mMacros.carbs; acc.fat += mMacros.fat; acc.fiber += mMacros.fiber;
      }
      return acc;
    }, { kcal: 0, prot: 0, carbs: 0, fat: 0, fiber: 0 });
  }, [activeDayType, activeOptionsMap]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden -mx-4 -my-4 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 animate-fade-in relative">
      
      {/* 1. ESTRUTURA SUPERIOR */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 lg:px-8 shadow-sm relative z-20 shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div className="flex-1 space-y-3 max-w-4xl w-full">
            <div className="flex items-center gap-3">
               <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <ArrowRightLeft size={20} className="rotate-180" />
               </button>
               <input 
                 type="text" 
                 value={plan.name}
                 onChange={e => setPlan({...plan, name: e.target.value})}
                 className="text-2xl font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full truncate"
               />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pl-11">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                <Calendar size={14} className="text-slate-400"/>
                <input type="date" value={plan.startDate} onChange={e => setPlan({...plan, startDate: e.target.value})} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
                <span className="text-slate-400 text-xs">até</span>
                <input type="date" value={plan.endDate} onChange={e => setPlan({...plan, endDate: e.target.value})} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
              </div>
              <input 
                type="text"
                value={plan.notes}
                onChange={e => setPlan({...plan, notes: e.target.value})}
                placeholder="Notas gerais do plano..."
                className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-500 dark:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors">
               <Activity size={16}/> Macros
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors">
               <Settings size={16}/> Configs
             </button>
             <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block mx-1"></div>
             <button onClick={() => onSave(plan)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
               <Save size={16} /> Guardar
             </button>
             <button onClick={() => onSave(plan)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2">
               <Bell size={16} /> <span className="hidden sm:inline">Guardar e</span> Notificar
             </button>
             <button className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl transition-all flex items-center justify-center" aria-label="Eliminar Plano">
               <Trash size={16} />
             </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 2. PAINEL LATERAL - ESTRATÉGIA */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex-shrink-0 flex flex-col h-full overflow-y-auto custom-scrollbar z-10 hidden lg:flex">
          <div className="p-5 space-y-8">
             
             {/* Tipos de dia */}
             <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Estratégias / Dias</h3>
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 p-1 bg-primary-50 dark:bg-primary-900/20 rounded-lg"><Plus size={16}/></button>
                </div>
                <div className="space-y-2">
                  {plan.dayTypes.map((dt, idx) => (
                    <div 
                      key={dt.id} 
                      onClick={() => setActiveDayTypeIdx(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group flex items-start justify-between
                        ${activeDayTypeIdx === idx ? 'bg-white dark:bg-slate-800 border-primary-500 dark:border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                      `}
                    >
                      <div>
                        <h4 className={`font-bold text-sm ${activeDayTypeIdx === idx ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>{dt.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{dt.description}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-opacity"><MoreVertical size={16}/></button>
                    </div>
                  ))}
                </div>
             </div>

             {/* Estratégia Calórica Resumo */}
             <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3">Estratégia Calórica</h3>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400 font-medium">Hidratos Altos</span>
                     <div className="text-right">
                       <span className="font-bold text-slate-800 dark:text-white">2850 kcal</span>
                       <span className="text-xs text-slate-400 block">4 dias</span>
                     </div>
                   </div>
                   <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-700 pt-3">
                     <span className="text-slate-500 dark:text-slate-400 font-medium">Hidratos Baixos</span>
                     <div className="text-right">
                       <span className="font-bold text-slate-800 dark:text-white">2200 kcal</span>
                       <span className="text-xs text-slate-400 block">3 dias</span>
                     </div>
                   </div>
                   <div className="flex justify-between items-center text-sm border-t-2 border-slate-100 dark:border-slate-700 pt-3">
                     <span className="text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wide text-xs">Média Semanal</span>
                     <div className="text-right">
                       <span className="font-black text-slate-800 dark:text-white text-base">2571 kcal</span>
                     </div>
                   </div>
                </div>
             </div>

             {/* Preferências Alimentares */}
             <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Preferências</h3>
                  <button className="text-slate-400 hover:text-primary-600"><Edit2 size={14}/></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase">Gosta</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-md font-medium">Frango</span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-md font-medium">Aveia</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-500 uppercase">Não Gosta</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-xs bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 px-2 py-1 rounded-md font-medium">Peixe cozido</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-orange-500 uppercase">Restrições</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded-md font-medium">Lactose</span>
                    </div>
                  </div>
                </div>
             </div>

          </div>
        </div>

        {/* 3. CONTEÚDO PRINCIPAL (Refeições) */}
        <div className="flex-1 bg-slate-100/50 dark:bg-[#0B1120] relative flex flex-col min-w-0">
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 pb-32">
              <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Day Header */}
                <div className="mb-6 lg:mb-10 w-full flex items-center justify-between">
                   <div>
                     <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                       {activeDayType?.name}
                     </h2>
                     <p className="text-slate-500 dark:text-slate-400 font-medium">{activeDayType?.description}</p>
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
                     <Plus size={16}/> Adicionar Refeição
                   </button>
                </div>

                {/* Meals */}
                {activeDayType?.meals.map((meal, mIdx) => {
                  
                  const activeOptionId = activeOptionsMap[meal.id] || meal.options[0]?.id;
                  const activeOption = meal.options.find(o => o.id === activeOptionId);
                  const activeOptionMacros = activeOption ? getOptionMacros(activeOption) : { kcal:0, prot:0, carbs:0, fat:0, fiber:0 };

                  const isExpanded = !!expandedMeals[meal.id];

                  return (
                    <div key={meal.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6 transition-all">
                      
                      {/* Refeição Cabeçalho */}
                      <div 
                        className={`p-4 lg:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 ${isExpanded ? 'border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50' : ''}`}
                        onClick={() => toggleMealExpanded(meal.id)}
                      >
                        <div className="flex items-center gap-3 w-full max-w-sm cursor-text" onClick={e => e.stopPropagation()}>
                           <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-lg">
                             {mIdx + 1}
                           </div>
                           <input 
                             type="text"
                             value={meal.name}
                             onChange={() => {}} // would update meal name
                             className="text-lg font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full"
                           />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Macro Resumo Refeição */}
                          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-2 shadow-sm shrink-0 overflow-x-auto custom-scrollbar relative z-10 w-full md:w-auto cursor-default" onClick={e => e.stopPropagation()}>
                             <div className="flex flex-col items-center px-2">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kcal</span>
                               <span className="text-sm font-black text-primary-600 dark:text-primary-400">{activeOptionMacros.kcal.toFixed(0)}</span>
                             </div>
                             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                             <div className="flex flex-col items-center px-1">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">P</span>
                               <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{activeOptionMacros.prot.toFixed(0)}g</span>
                             </div>
                             <div className="flex flex-col items-center px-1">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HC</span>
                               <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{activeOptionMacros.carbs.toFixed(0)}g</span>
                             </div>
                             <div className="flex flex-col items-center px-1">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">G</span>
                               <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{activeOptionMacros.fat.toFixed(0)}g</span>
                             </div>
                          </div>
                          
                          <div className={`p-2 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={20} />
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <>
                          {/* Opções Tabs */}
                      <div className="px-4 lg:px-6 pt-4 flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-700/50">
                        {meal.options.map(opt => (
                           <button 
                             key={opt.id}
                             onClick={() => setActiveOptionsMap({...activeOptionsMap, [meal.id]: opt.id})}
                             className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                               activeOptionId === opt.id 
                               ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                               : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                             }`}
                           >
                              {opt.name} {opt.disabled && '(Desativada)'}
                           </button>
                        ))}
                        <button className="px-3 py-2 text-sm font-bold text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
                           <Plus size={14}/> Nova
                        </button>
                      </div>

                      {/* Conteúdo da Opção Ativa */}
                      {activeOption && (
                         <div className={`p-4 lg:p-6 transition-opacity duration-300 ${activeOption.disabled ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                            
                            {/* Option Header Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                               <div className="flex-1 w-full max-w-xl">
                                  <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 text-slate-400" size={16}/>
                                    <textarea 
                                      value={activeOption.notes}
                                      onChange={(e) => updateMealOption(meal.id, activeOption.id, (o) => ({...o, notes: e.target.value}))}
                                      placeholder="Observações, instruções ou modo de preparação..."
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-700 dark:text-slate-200 resize-none min-h-[44px]"
                                      rows={1}
                                    />
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <button onClick={() => updateMealOption(meal.id, activeOption.id, (o) => ({...o, disabled: !o.disabled}))} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-row items-center gap-1.5">
                                    {activeOption.disabled ? <><Check size={14}/> Ativar</> : <><EyeOff size={14}/> Desativar</>}
                                  </button>
                                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-row items-center gap-1.5">
                                    <Save size={14}/> Guardar Ref. Pronta
                                  </button>
                                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-row items-center gap-1.5">
                                    <Copy size={14}/> Copiar
                                  </button>
                               </div>
                            </div>

                            {/* Tabela de Alimentos */}
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl mb-4">
                               <table className="w-full text-sm text-left">
                                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                                     <tr>
                                        <th className="px-4 py-3 min-w-[200px]">Alimento</th>
                                        <th className="px-4 py-3 text-right">Qtd</th>
                                        <th className="px-4 py-3 text-center">Medida</th>
                                        <th className="px-4 py-3 text-right font-medium">P (g)</th>
                                        <th className="px-4 py-3 text-right font-medium">HC (g)</th>
                                        <th className="px-4 py-3 text-right font-medium">G (g)</th>
                                        <th className="px-4 py-3 text-right text-primary-600 dark:text-primary-400">Kcal</th>
                                        <th className="px-4 py-3 text-center"></th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                     {activeOption.foods.map(f => {
                                        const m = getCalculatedMacros(f.foodId, f.quantity);
                                        return (
                                           <React.Fragment key={f.id}>
                                             <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">
                                                  {m.foodName}
                                                  {f.substitutes.length > 0 && (
                                                    <span className="block text-[10px] text-slate-400 font-medium lowercase">+{f.substitutes.length} substitutos</span>
                                                  )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                   <input type="number" defaultValue={f.quantity} className="w-16 text-right bg-transparent border-none p-1 font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 rounded"/>
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400 font-medium text-xs">
                                                   {f.measure || `${f.quantity}${m.baseUnit}`}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{m.prot.toFixed(1)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{m.carbs.toFixed(1)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{m.fat.toFixed(1)}</td>
                                                <td className="px-4 py-3 text-right font-black text-primary-600 dark:text-primary-400">{m.kcal.toFixed(0)}</td>
                                                <td className="px-4 py-3 text-right">
                                                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Editar"><Edit2 size={14}/></button>
                                                      <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Exibir/Adicionar Substitutos"><ArrowRightLeft size={14}/></button>
                                                      <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Copiar"><Copy size={14}/></button>
                                                      <button className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Eliminar"><Trash size={14}/></button>
                                                   </div>
                                                </td>
                                             </tr>
                                             {/* Render Substitutes if any (just visually nested) */}
                                             {f.substitutes && f.substitutes.map((sub, sIdx) => {
                                                const subM = getCalculatedMacros(sub.foodId, sub.quantity);
                                                return (
                                                  <tr key={sub.id} className="bg-slate-50/30 dark:bg-slate-900/10 group">
                                                    <td className="px-4 py-2 pl-8 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                                      <span className="font-medium">ou</span> {subM.foodName}
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                       <input type="number" defaultValue={sub.quantity} className="w-16 text-right bg-transparent border-none p-1 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary-500 rounded"/>
                                                    </td>
                                                    <td className="px-4 py-2 text-center text-slate-500 dark:text-slate-400 font-medium text-xs">
                                                      {sub.measure || `${sub.quantity}${subM.baseUnit}`}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.prot.toFixed(1)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.carbs.toFixed(1)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.fat.toFixed(1)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.kcal.toFixed(0)}</td>
                                                    <td className="px-4 py-2 text-right">
                                                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1 text-slate-400 hover:text-rose-500 rounded"><Trash size={12}/></button>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                )
                                             })}
                                           </React.Fragment>
                                        )
                                     })}
                                  </tbody>
                               </table>
                            </div>

                            {/* Option Footer Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                               <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                                  <Plus size={14}/> Adicionar Alimento
                               </button>
                               <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                                  <Utensils size={14}/> Add Ref. Pronta
                               </button>
                               <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 ml-auto">
                                  Exibir Substitutos <ChevronDown size={14}/>
                               </button>
                            </div>

                         </div>
                      )}
                        </>
                      )}
                    </div>
                  )
                })}

              </div>
           </div>
           
           {/* 4. BARRA INFERIOR FIXA */}
           <div className="absolute bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-30">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                   <h3 className="font-bold text-sm tracking-widest text-slate-500 dark:text-slate-400 uppercase hidden md:block">TOTAIS ({activeDayType?.name})</h3>
                 </div>
                 <div className="flex items-center justify-around w-full md:w-auto gap-4 md:gap-8">
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Proteína</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.prot.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                     <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-400/10 px-1.5 rounded mt-0.5">30%</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Gordura</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.fat.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                     <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-400/10 px-1.5 rounded mt-0.5">25%</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Hidratos</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.carbs.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                     <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-400/10 px-1.5 rounded mt-0.5">45%</span>
                   </div>
                   <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
                   <div className="flex flex-col items-center hidden sm:flex">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Fibra</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.fiber.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                   </div>
                   <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Calorias Totais</span>
                     <div className="flex items-baseline gap-1 text-primary-600 dark:text-primary-400">
                       <span className="text-2xl font-black">{dayMacros.kcal.toFixed(0)}</span>
                       <span className="text-xs">kcal</span>
                     </div>
                   </div>
                 </div>
              </div>
           </div>

        </div>

      </div>

    </div>
  );
};

export default NutritionPlanBuilder;
