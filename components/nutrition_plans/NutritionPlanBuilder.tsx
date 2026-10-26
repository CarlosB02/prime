import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Edit2, Search, X, Utensils, Save, 
  Settings, ChevronRight, Copy, MoreVertical, EyeOff, BookOpen,
  Bell, FileText, Check, ChevronDown, Activity, Trash, ArrowRightLeft,
  Apple, Filter, ChefHat
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { MOCK_FOODS, FOOD_CATEGORIES } from '../../constants';
import { Food, ReadyMeal, ReadyMealCategory } from '../../types';
import ReadyMealPickerModal from './ReadyMealPickerModal';
import { addStoredReadyMeal, calculateReadyMealNutrition } from '../../lib/readyMeals';

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

export const INITIAL_PLAN: NutritionPlan = {
  id: 'p1',
  name: 'Novo Plano de Nutrição',
  notes: 'Foco no ganho de massa magra sem acumular muita gordura. Beber pelo menos 3L de água.',
  startDate: '',
  endDate: '',
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
                { id: 'f5', foodId: '2', quantity: 150, measure: '5 c. sopa', substitutes: [] },
                { id: 'f6', foodId: '1', quantity: 150, measure: '1 bife médio', substitutes: [] },
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
  const food = MOCK_FOODS.find(f => f.id === foodId);
  if (!food) {
    return { 
      foodName: 'Alimento ' + foodId, 
      baseUnit: 'g', 
      kcal: 0, 
      prot: 0, 
      carbs: 0, 
      fat: 0, 
      fiber: 0,
      category: 'Outros',
      image: ''
    };
  }
  
  const baseQty = food.baseQuantity || (food.unit === 'unidade' ? 1 : 100);
  const multiplier = baseQty > 0 ? quantity / baseQty : 0;
  const unitLabel = food.unit === 'unidade' ? 'unid' : food.unit;
  return {
    foodName: food.name,
    baseUnit: unitLabel,
    kcal: (food.calories * multiplier),
    prot: (food.protein * multiplier),
    carbs: (food.carbs * multiplier),
    fat: (food.fat * multiplier),
    fiber: ((food.fiber || 0) * multiplier),
    category: food.category,
    image: food.image
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

const initializePlan = (data?: NutritionPlan | null): NutritionPlan => {
  if (!data) return INITIAL_PLAN;
  const dayTypes = (data.dayTypes && data.dayTypes.length > 0)
    ? data.dayTypes.map(dt => ({
        ...dt,
        meals: dt.meals || []
      }))
    : INITIAL_PLAN.dayTypes;
  return {
    ...data,
    dayTypes
  };
};

const NutritionPlanBuilder: React.FC<NutritionPlanBuilderProps> = ({ planData, onSave, onCancel }) => {
  const [plan, setPlan] = useState<NutritionPlan>(() => initializePlan(planData));
  const [activeDayTypeIdx, setActiveDayTypeIdx] = useState<number>(0);
  const [activeOptionsMap, setActiveOptionsMap] = useState<Record<string, string>>({}); // mealId -> optionId
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({}); // mealId -> boolean

  const validDayTypes = plan.dayTypes && plan.dayTypes.length > 0 ? plan.dayTypes : INITIAL_PLAN.dayTypes;
  const activeDayType = validDayTypes[activeDayTypeIdx] || validDayTypes[0];

  const updatePlan = (newPlan: NutritionPlan) => setPlan(newPlan);

  const toggleMealExpanded = (mealId: string) => {
    setExpandedMeals(prev => ({...prev, [mealId]: !prev[mealId]}));
  };

  // Initialize active options
  useMemo(() => {
    if(!activeDayType) return;
    const newMap = { ...activeOptionsMap };
    (activeDayType.meals || []).forEach(m => {
      if (!newMap[m.id] && m.options && m.options.length > 0) {
        newMap[m.id] = m.options[0].id;
      }
    });
    setActiveOptionsMap(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDayType]);

  const updateMealOption = (mealId: string, optionId: string, updater: (opt: MealOption) => MealOption) => {
    const updatedPlan = { ...plan };
    const dtList = updatedPlan.dayTypes && updatedPlan.dayTypes.length > 0 ? updatedPlan.dayTypes : [...INITIAL_PLAN.dayTypes];
    const dt = dtList[activeDayTypeIdx] || dtList[0];
    const meal = dt?.meals?.find(m => m.id === mealId);
    if(meal) {
      const oIdx = meal.options.findIndex(o => o.id === optionId);
      if(oIdx > -1) {
        meal.options[oIdx] = updater(meal.options[oIdx]);
        updatedPlan.dayTypes = dtList;
        setPlan(updatedPlan);
      }
    }
  };

  const handleAddMeal = () => {
    let currentDayTypes = plan.dayTypes && plan.dayTypes.length > 0 ? [...plan.dayTypes] : [...INITIAL_PLAN.dayTypes];
    let targetIdx = activeDayTypeIdx;
    if (targetIdx < 0 || targetIdx >= currentDayTypes.length) {
      targetIdx = 0;
      setActiveDayTypeIdx(0);
    }

    const currentDt = { ...currentDayTypes[targetIdx] };
    const newMealId = 'm_' + Date.now();
    const newOptionId = 'o_' + Date.now();
    const currentMeals = currentDt.meals || [];
    const mealCount = currentMeals.length + 1;
    const defaultNames = ['Pequeno-Almoço', 'Almoço', 'Lanche', 'Jantar', 'Ceia', 'Pré-Treino', 'Pós-Treino'];
    const name = defaultNames[mealCount - 1] || `Refeição ${mealCount}`;

    const newMeal: Meal = {
      id: newMealId,
      name,
      options: [
        {
          id: newOptionId,
          name: 'Opção 1',
          disabled: false,
          notes: '',
          foods: []
        }
      ]
    };

    currentDt.meals = [...currentMeals, newMeal];
    currentDayTypes[targetIdx] = currentDt;

    const updatedPlan: NutritionPlan = {
      ...plan,
      dayTypes: currentDayTypes
    };

    setPlan(updatedPlan);
    setActiveOptionsMap(prev => ({ ...prev, [newMealId]: newOptionId }));
    setExpandedMeals(prev => ({ ...prev, [newMealId]: true }));
  };

  const handleUpdateMealName = (mealId: string, newName: string) => {
    const updatedPlan = { ...plan };
    const dt = updatedPlan.dayTypes[activeDayTypeIdx] || updatedPlan.dayTypes[0];
    const targetMeal = dt?.meals?.find(m => m.id === mealId);
    if (targetMeal) {
      targetMeal.name = newName;
      setPlan(updatedPlan);
    }
  };

  // State for confirming meal deletion (without window.confirm which fails in iframes)
  const [mealToDelete, setMealToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleConfirmDeleteMeal = () => {
    if (!mealToDelete) return;
    const { id: mealId, name: mealName } = mealToDelete;

    const currentDayTypes = plan.dayTypes && plan.dayTypes.length > 0 
      ? plan.dayTypes.map(dt => ({ ...dt, meals: [...(dt.meals || [])] }))
      : INITIAL_PLAN.dayTypes.map(dt => ({ ...dt, meals: [...(dt.meals || [])] }));

    let targetIdx = activeDayTypeIdx;
    if (targetIdx < 0 || targetIdx >= currentDayTypes.length) {
      targetIdx = 0;
    }

    const currentDt = currentDayTypes[targetIdx];
    if (currentDt) {
      currentDt.meals = currentDt.meals.filter(m => m.id !== mealId);
      currentDayTypes[targetIdx] = currentDt;

      setPlan(prev => ({
        ...prev,
        dayTypes: currentDayTypes
      }));

      // Clean up options map & expanded map
      setActiveOptionsMap(prev => {
        const next = { ...prev };
        delete next[mealId];
        return next;
      });
      setExpandedMeals(prev => {
        const next = { ...prev };
        delete next[mealId];
        return next;
      });

      setNotificationMsg(`Refeição "${mealName}" eliminada com sucesso.`);
      setTimeout(() => setNotificationMsg(null), 3000);
    }
    setMealToDelete(null);
  };

  // Food Picker from Database States
  const [foodModalState, setFoodModalState] = useState<{
    isOpen: boolean;
    mealId: string;
    optionId: string;
    mealName?: string;
    optionName?: string;
    replaceFoodId?: string;
    isSubstituteForFoodId?: string;
  } | null>(null);

  // Ready Meal Picker States
  const [readyMealModalState, setReadyMealModalState] = useState<{
    isOpen: boolean;
    mealId: string;
    optionId: string;
    mealName?: string;
    optionName?: string;
  } | null>(null);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('Todos');
  const [selectedFoodItem, setSelectedFoodItem] = useState<Food | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(100);
  const [selectedMeasure, setSelectedMeasure] = useState<string>('');

  const availableFilteredFoods = useMemo(() => {
    return MOCK_FOODS.filter(food => {
      if (food.isDeleted) return false;
      const q = foodSearchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || food.name.toLowerCase().includes(q) || food.category.toLowerCase().includes(q);
      const matchesCategory = foodCategoryFilter === 'Todos' || food.category === foodCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [foodSearchQuery, foodCategoryFilter]);

  const handleOpenAddFood = (mealId: string, optionId: string, mealName?: string, optionName?: string) => {
    setFoodModalState({
      isOpen: true,
      mealId,
      optionId,
      mealName,
      optionName
    });
    setFoodSearchQuery('');
    setFoodCategoryFilter('Todos');
    setSelectedFoodItem(null);
    setSelectedQuantity(100);
    setSelectedMeasure('');
  };

  const handleOpenReplaceFood = (mealId: string, optionId: string, foodId: string, mealName?: string, optionName?: string) => {
    setFoodModalState({
      isOpen: true,
      mealId,
      optionId,
      mealName,
      optionName,
      replaceFoodId: foodId
    });
    setFoodSearchQuery('');
    setFoodCategoryFilter('Todos');
    setSelectedFoodItem(null);
    setSelectedQuantity(100);
    setSelectedMeasure('');
  };

  const handleOpenAddSubstitute = (mealId: string, optionId: string, parentFoodId: string, mealName?: string, optionName?: string) => {
    setFoodModalState({
      isOpen: true,
      mealId,
      optionId,
      mealName,
      optionName,
      isSubstituteForFoodId: parentFoodId
    });
    setFoodSearchQuery('');
    setFoodCategoryFilter('Todos');
    setSelectedFoodItem(null);
    setSelectedQuantity(100);
    setSelectedMeasure('');
  };

  const handleConfirmAddFood = (foodToAdd: Food, qty?: number, measureStr?: string) => {
    if (!foodModalState) return;
    const { mealId, optionId, replaceFoodId, isSubstituteForFoodId } = foodModalState;
    
    const finalQty = qty !== undefined && qty > 0 ? qty : (foodToAdd.unit === 'unidade' ? 1 : 100);
    const unitLabel = foodToAdd.unit === 'unidade' ? 'unid' : foodToAdd.unit;
    const finalMeasure = measureStr && measureStr.trim() !== '' 
      ? measureStr 
      : (foodToAdd.unit === 'unidade' ? `${finalQty} unid` : `${finalQty}${unitLabel}`);

    if (replaceFoodId) {
      updateMealOption(mealId, optionId, (o) => ({
        ...o,
        foods: o.foods.map(f => f.id === replaceFoodId ? {
          ...f,
          foodId: foodToAdd.id,
          quantity: finalQty,
          measure: finalMeasure
        } : f)
      }));
    } else if (isSubstituteForFoodId) {
      const newSubId = 'sub_' + Date.now();
      updateMealOption(mealId, optionId, (o) => ({
        ...o,
        foods: o.foods.map(f => f.id === isSubstituteForFoodId ? {
          ...f,
          substitutes: [
            ...(f.substitutes || []),
            {
              id: newSubId,
              foodId: foodToAdd.id,
              quantity: finalQty,
              measure: finalMeasure,
              substitutes: []
            }
          ]
        } : f)
      }));
    } else {
      const newFoodId = 'f_' + Date.now() + Math.random().toString(36).substr(2, 4);
      updateMealOption(mealId, optionId, (o) => ({
        ...o,
        foods: [
          ...o.foods,
          {
            id: newFoodId,
            foodId: foodToAdd.id,
            quantity: finalQty,
            measure: finalMeasure,
            substitutes: []
          }
        ]
      }));
    }

    setFoodModalState(null);
  };

  // Ready Meal Handlers
  const handleOpenAddReadyMeal = (mealId: string, optionId: string, mealName?: string, optionName?: string) => {
    setReadyMealModalState({
      isOpen: true,
      mealId,
      optionId,
      mealName,
      optionName
    });
  };

  const handleSelectReadyMeal = (mealToAdd: ReadyMeal, mode: 'append' | 'replace', importNotes: boolean) => {
    if (!readyMealModalState) return;
    const { mealId, optionId } = readyMealModalState;

    const newOptionFoods: MealOptionFood[] = mealToAdd.foods.map((foodItem, idx) => ({
      id: `f_rm_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      foodId: foodItem.foodId,
      quantity: foodItem.quantity,
      measure: foodItem.measure || `${foodItem.quantity}g`,
      substitutes: []
    }));

    updateMealOption(mealId, optionId, (o) => {
      const nextFoods = mode === 'replace' ? newOptionFoods : [...o.foods, ...newOptionFoods];
      let nextNotes = o.notes;
      if (importNotes && mealToAdd.notes) {
        if (!nextNotes || nextNotes.trim() === '') {
          nextNotes = mealToAdd.notes;
        } else {
          nextNotes = `${nextNotes}\n\n[Modo de Preparo - ${mealToAdd.name}]: ${mealToAdd.notes}`;
        }
      }
      return {
        ...o,
        foods: nextFoods,
        notes: nextNotes
      };
    });

    setReadyMealModalState(null);
    setNotificationMsg(`Refeição "${mealToAdd.name}" adicionada com sucesso!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleSaveOptionAsReadyMeal = (meal: Meal, option: MealOption) => {
    if (option.foods.length === 0) {
      alert('Esta opção não possui nenhum alimento para guardar como refeição pronta.');
      return;
    }

    const defaultName = prompt('Nome para a Refeição Pronta:', `${meal.name} - ${option.name}`);
    if (!defaultName) return;

    const nutrition = calculateReadyMealNutrition(option.foods.map(f => ({
      foodId: f.foodId,
      quantity: f.quantity,
      measure: f.measure
    })));

    let cat: ReadyMealCategory = 'Almoço / Jantar';
    const lower = meal.name.toLowerCase();
    if (lower.includes('pequeno') || (lower.includes('almoço') && lower.includes('pequeno'))) {
      cat = 'Pequeno-Almoço';
    } else if (lower.includes('lanche')) {
      cat = 'Lanches';
    } else if (lower.includes('treino') || lower.includes('pós') || lower.includes('pré')) {
      cat = 'Pré / Pós-Treino';
    } else if (lower.includes('ceia') || lower.includes('snack')) {
      cat = 'Snacks';
    }

    const newReadyMeal: ReadyMeal = {
      id: `rm_${Date.now()}`,
      name: defaultName.trim(),
      category: cat,
      description: `Refeição criada a partir de ${meal.name}`,
      prepTimeMinutes: 15,
      notes: option.notes || '',
      foods: option.foods.map(f => ({
        foodId: f.foodId,
        quantity: f.quantity,
        measure: f.measure
      })),
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      isDeleted: false
    };

    addStoredReadyMeal(newReadyMeal);
    setNotificationMsg(`Refeição "${newReadyMeal.name}" guardada na Base de Dados de Refeições Prontas!`);
    setTimeout(() => setNotificationMsg(null), 4000);
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

  const { protPct, fatPct, carbsPct } = useMemo(() => {
    const protKcal = dayMacros.prot * 4;
    const carbsKcal = dayMacros.carbs * 4;
    const fatKcal = dayMacros.fat * 9;
    const sumKcal = protKcal + carbsKcal + fatKcal;
    if (sumKcal <= 0) return { protPct: 0, fatPct: 0, carbsPct: 0 };
    return {
      protPct: Math.round((protKcal / sumKcal) * 100),
      fatPct: Math.round((fatKcal / sumKcal) * 100),
      carbsPct: Math.round((carbsKcal / sumKcal) * 100)
    };
  }, [dayMacros]);

  return (
    <div className="fixed inset-0 lg:left-20 xl:left-64 z-30 bg-slate-100 dark:bg-[#0B1120] flex flex-col overflow-hidden animate-fade-in">
      
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
                <CustomCalendarIcon size={14}/>
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

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        
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
                        ${activeDayTypeIdx === idx ? 'bg-white dark:bg-slate-800 border-primary-500 dark:border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                      <div>
                        <h4 className={`font-bold text-sm ${activeDayTypeIdx === idx ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>{dt.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{dt.description}</p>
                      </div>
                      <button className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-opacity"><MoreVertical size={16}/></button>
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
        <div className="flex-1 bg-slate-100/50 dark:bg-[#0B1120] relative flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 pb-12 min-h-0">
              <div className="w-full space-y-6">
                
                {/* Day Header */}
                <div className="mb-6 lg:mb-10 w-full flex items-center justify-between">
                   <div>
                     <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                       {activeDayType?.name}
                     </h2>
                     <p className="text-slate-500 dark:text-slate-400 font-medium">{activeDayType?.description}</p>
                   </div>
                   <button 
                     type="button"
                     onClick={handleAddMeal}
                     className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all cursor-pointer"
                   >
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
                             onChange={(e) => handleUpdateMealName(meal.id, e.target.value)}
                             className="text-lg font-black text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full"
                           />
                        </div>
                        
                        <div className="flex items-center gap-3">
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

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMealToDelete({ id: meal.id, name: meal.name });
                            }}
                            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            title="Eliminar Refeição"
                          >
                            <Trash size={16} />
                          </button>
                          
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
                                  <button 
                                    type="button"
                                    onClick={() => handleSaveOptionAsReadyMeal(meal, activeOption)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-row items-center gap-1.5 cursor-pointer"
                                    title="Guardar como nova refeição pronta na base de dados"
                                  >
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
                                                  <div className="flex items-center gap-2.5">
                                                    {m.image ? (
                                                      <img 
                                                        src={m.image} 
                                                        alt={m.foodName} 
                                                        className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                                                      />
                                                    ) : (
                                                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                        <Utensils size={13} />
                                                      </div>
                                                    )}
                                                    <div>
                                                      <div className="flex items-center gap-1.5">
                                                        <span>{m.foodName}</span>
                                                        <button
                                                          type="button"
                                                          onClick={() => handleOpenReplaceFood(meal.id, activeOption.id, f.id, meal.name, activeOption.name)}
                                                          className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                          title="Trocar por outro alimento da base de dados"
                                                        >
                                                          <ArrowRightLeft size={13} />
                                                        </button>
                                                      </div>
                                                      {f.substitutes && f.substitutes.length > 0 && (
                                                        <span className="block text-[10px] text-slate-400 font-medium lowercase">+{f.substitutes.length} substitutos</span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                   <input 
                                                     type="number" 
                                                     value={f.quantity} 
                                                     onChange={(e) => {
                                                       const val = parseFloat(e.target.value) || 0;
                                                       updateMealOption(meal.id, activeOption.id, (o) => ({
                                                         ...o,
                                                         foods: o.foods.map(item => item.id === f.id ? { ...item, quantity: val } : item)
                                                       }));
                                                     }}
                                                     className="w-16 text-right bg-transparent border-none p-1 font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 rounded"
                                                   />
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400 font-medium text-xs">
                                                   {f.measure ||`${f.quantity}${m.baseUnit}`}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{m.prot.toFixed(1)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{m.carbs.toFixed(1)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{m.fat.toFixed(1)}</td>
                                                <td className="px-4 py-3 text-right font-black text-primary-600 dark:text-primary-400">{m.kcal.toFixed(0)}</td>
                                                <td className="px-4 py-3 text-right">
                                                   <div className="flex items-center justify-end gap-1">
                                                      <button 
                                                        type="button"
                                                        onClick={() => handleOpenReplaceFood(meal.id, activeOption.id, f.id, meal.name, activeOption.name)}
                                                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" 
                                                        title="Trocar por outro alimento da base de dados"
                                                      >
                                                        <ArrowRightLeft size={14}/>
                                                      </button>
                                                      <button 
                                                        type="button"
                                                        onClick={() => handleOpenAddSubstitute(meal.id, activeOption.id, f.id, meal.name, activeOption.name)}
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" 
                                                        title="Adicionar substituto da base de dados"
                                                      >
                                                        <Plus size={14}/>
                                                      </button>
                                                      <button 
                                                        type="button"
                                                        onClick={() => {
                                                          updateMealOption(meal.id, activeOption.id, (o) => ({
                                                            ...o,
                                                            foods: o.foods.filter(item => item.id !== f.id)
                                                          }));
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" 
                                                        title="Eliminar"
                                                      >
                                                        <Trash size={14}/>
                                                      </button>
                                                   </div>
                                                </td>
                                             </tr>
                                             {/* Render Substitutes if any */}
                                             {f.substitutes && f.substitutes.map((sub) => {
                                                const subM = getCalculatedMacros(sub.foodId, sub.quantity);
                                                return (
                                                  <tr key={sub.id} className="bg-slate-50/30 dark:bg-slate-900/10 group">
                                                    <td className="px-4 py-2 pl-8 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                                      <span className="font-medium">ou</span> {subM.foodName}
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                       <input 
                                                         type="number" 
                                                         value={sub.quantity} 
                                                         onChange={(e) => {
                                                           const val = parseFloat(e.target.value) || 0;
                                                           updateMealOption(meal.id, activeOption.id, (o) => ({
                                                             ...o,
                                                             foods: o.foods.map(item => item.id === f.id ? {
                                                               ...item,
                                                               substitutes: item.substitutes.map(s => s.id === sub.id ? { ...s, quantity: val } : s)
                                                             } : item)
                                                           }));
                                                         }}
                                                         className="w-16 text-right bg-transparent border-none p-1 text-sm font-bold text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary-500 rounded"
                                                       />
                                                    </td>
                                                    <td className="px-4 py-2 text-center text-slate-500 dark:text-slate-400 font-medium text-xs">
                                                      {sub.measure ||`${sub.quantity}${subM.baseUnit}`}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.prot.toFixed(1)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.carbs.toFixed(1)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.fat.toFixed(1)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-slate-500">{subM.kcal.toFixed(0)}</td>
                                                    <td className="px-4 py-2 text-right">
                                                      <div className="flex items-center justify-end gap-1">
                                                        <button 
                                                          type="button"
                                                          onClick={() => {
                                                            updateMealOption(meal.id, activeOption.id, (o) => ({
                                                              ...o,
                                                              foods: o.foods.map(item => item.id === f.id ? {
                                                                ...item,
                                                                substitutes: item.substitutes.filter(s => s.id !== sub.id)
                                                              } : item)
                                                            }));
                                                          }}
                                                          className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                          title="Eliminar substituto"
                                                        >
                                                          <Trash size={12}/>
                                                        </button>
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
                               <button 
                                 type="button"
                                 onClick={() => handleOpenAddFood(meal.id, activeOption.id, meal.name, activeOption.name)}
                                 className="px-3.5 py-1.5 border border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                               >
                                  <Plus size={14}/> Adicionar Alimento
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => handleOpenAddReadyMeal(meal.id, activeOption.id, meal.name, activeOption.name)}
                                 className="px-3.5 py-1.5 border border-primary-300 dark:border-primary-700/80 bg-primary-50 dark:bg-primary-950/30 text-primary-800 dark:text-primary-300 rounded-lg text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                               >
                                  <ChefHat size={14}/> + Add Ref. Pronta
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

                {/* Empty State if no meals */}
                {(!activeDayType?.meals || activeDayType.meals.length === 0) && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Utensils size={22} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">Nenhuma refeição neste dia</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                      Comece por adicionar a primeira refeição para {activeDayType?.name || 'este dia'}.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddMeal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl shadow-md shadow-primary-500/20 transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <Plus size={16} /> Adicionar Refeição
                    </button>
                  </div>
                )}

                {/* Add Meal Bottom Button */}
                {activeDayType?.meals && activeDayType.meals.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddMeal}
                    className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-2xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold text-sm bg-white/40 dark:bg-slate-800/40 hover:bg-primary-50/40 dark:hover:bg-primary-950/20 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus size={18} /> Adicionar Refeição
                  </button>
                )}

              </div>
           </div>
           
           {/* 4. BARRA INFERIOR STICKY */}
           <div className="sticky bottom-0 left-0 right-0 w-full shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 z-40 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                 <div className="flex items-center gap-3">
                   <h3 className="font-bold text-xs sm:text-sm tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                     TOTAIS ({activeDayType?.name || 'Dia de Treino'})
                   </h3>
                 </div>
                 <div className="flex items-center justify-around w-full md:w-auto gap-4 md:gap-8">
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Proteína</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.prot.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                     <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-400/10 px-1.5 rounded mt-0.5">{protPct}%</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Gordura</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.fat.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                     <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-400/10 px-1.5 rounded mt-0.5">{fatPct}%</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Hidratos</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-xl font-black text-slate-800 dark:text-white">{dayMacros.carbs.toFixed(0)}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">g</span>
                     </div>
                     <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-400/10 px-1.5 rounded mt-0.5">{carbsPct}%</span>
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

      {/* ========================================================================= */}
      {/* 5. MODAL DE SELEÇÃO DE ALIMENTOS DA BASE DE DADOS (OFICIAL)               */}
      {/* ========================================================================= */}
      {foodModalState && foodModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                  <Utensils size={20} />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 dark:text-white">
                    {foodModalState.replaceFoodId 
                      ? 'Substituir Alimento da Base de Dados' 
                      : foodModalState.isSubstituteForFoodId 
                      ? 'Adicionar Substituto da Base de Dados' 
                      : 'Adicionar Alimento da Base de Dados'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {foodModalState.mealName && foodModalState.optionName 
                      ? `${foodModalState.mealName} • ${foodModalState.optionName}` 
                      : 'Base de dados oficial de nutrição'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setFoodModalState(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar & Categories */}
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="relative mb-3">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Pesquisar alimento por nome (ex: frango, arroz, aveia, ovo, abacate, salmão...)"
                  value={foodSearchQuery}
                  onChange={(e) => setFoodSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all"
                />
                {foodSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFoodSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Categories Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['Todos', 'Proteína', 'Hidratos', 'Gordura', 'Vegetais', 'Fruta', 'Laticínios', 'Suplementos'].map(cat => {
                  const isActive = foodCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFoodCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Foods List from Database */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[380px] custom-scrollbar">
              {availableFilteredFoods.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Utensils size={20} />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum alimento encontrado</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Não encontramos resultados para &quot;{foodSearchQuery}&quot; na categoria {foodCategoryFilter}.
                  </p>
                  {(foodSearchQuery || foodCategoryFilter !== 'Todos') && (
                    <button
                      type="button"
                      onClick={() => { setFoodSearchQuery(''); setFoodCategoryFilter('Todos'); }}
                      className="mt-3 text-xs font-bold text-primary-600 hover:underline cursor-pointer"
                    >
                      Limpar filtros de pesquisa
                    </button>
                  )}
                </div>
              ) : (
                availableFilteredFoods.map(food => {
                  const isSelected = selectedFoodItem?.id === food.id;
                  const unitLabel = food.unit === 'unidade' ? 'unid' : food.unit;
                  const baseQty = food.baseQuantity || (food.unit === 'unidade' ? 1 : 100);
                  return (
                    <div
                      key={food.id}
                      onClick={() => {
                        setSelectedFoodItem(food);
                        setSelectedQuantity(food.unit === 'unidade' ? 1 : 100);
                        setSelectedMeasure(food.unit === 'unidade' ? '1 unid' : `100${unitLabel}`);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 shadow-xs ring-1 ring-primary-500'
                          : 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:border-primary-300 dark:hover:border-primary-700/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {food.image ? (
                          <img 
                            src={food.image} 
                            alt={food.name} 
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm">
                            <Utensils size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-sm text-slate-800 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {food.name}
                            </h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                              {food.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 mt-1 text-xs flex-wrap">
                            <span className="font-black text-primary-600 dark:text-primary-400">
                              {food.calories} kcal
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-rose-500 font-semibold text-[11px]">
                              P: {food.protein}g
                            </span>
                            <span className="text-blue-500 font-semibold text-[11px]">
                              HC: {food.carbs}g
                            </span>
                            <span className="text-amber-500 font-semibold text-[11px]">
                              G: {food.fat}g
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              (por {baseQty}{unitLabel})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmAddFood(food);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
                          title="Adicionar diretamente com porção padrão"
                        >
                          <Plus size={14} /> Adicionar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Food Adjustment / Confirmation Footer */}
            {selectedFoodItem && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Alimento Selecionado:</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{selectedFoodItem.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Quantidade:</label>
                        <input
                          type="number"
                          min="1"
                          value={selectedQuantity}
                          onChange={(e) => {
                            const q = parseFloat(e.target.value) || 0;
                            setSelectedQuantity(q);
                            const unitLabel = selectedFoodItem.unit === 'unidade' ? 'unid' : selectedFoodItem.unit;
                            setSelectedMeasure(selectedFoodItem.unit === 'unidade' ? `${q} unid` : `${q}${unitLabel}`);
                          }}
                          className="w-20 px-2.5 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none focus:border-primary-500"
                        />
                        <span className="text-xs font-medium text-slate-400">
                          {selectedFoodItem.unit === 'unidade' ? 'unid' : selectedFoodItem.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Medida:</label>
                        <input
                          type="text"
                          placeholder="Ex: 1 bife, 5 c. sopa"
                          value={selectedMeasure}
                          onChange={(e) => setSelectedMeasure(e.target.value)}
                          className="w-32 px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedFoodItem(null)}
                      className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmAddFood(selectedFoodItem, selectedQuantity, selectedMeasure)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    >
                      <Check size={14} /> Confirmar e Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL DE SELEÇÃO DE REFEIÇÕES PRONTAS DA BASE DE DADOS (OFICIAL)        */}
      {/* ========================================================================= */}
      <ReadyMealPickerModal 
        isOpen={!!readyMealModalState?.isOpen}
        onClose={() => setReadyMealModalState(null)}
        onSelectMeal={handleSelectReadyMeal}
        mealName={readyMealModalState?.mealName}
        optionName={readyMealModalState?.optionName}
      />

      {/* Modal de Confirmação para Eliminar Refeição */}
      {mealToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                <Trash size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Eliminar Refeição</h3>
                <p className="text-xs text-slate-500">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tem a certeza que deseja eliminar a refeição <strong className="text-slate-900 dark:text-white">"{mealToDelete.name}"</strong>? Todos os alimentos e opções associados a esta refeição serão removidos.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMealToDelete(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMeal}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash size={14} />
                Eliminar Refeição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-fade-in-up backdrop-blur-md">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={16} />
          </div>
          <span className="text-xs font-bold">{notificationMsg}</span>
        </div>
      )}

    </div>
  );
};

export default NutritionPlanBuilder;
