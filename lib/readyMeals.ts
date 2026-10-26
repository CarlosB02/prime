import { ReadyMeal, ReadyMealFoodItem } from '../types';
import { MOCK_READY_MEALS, MOCK_FOODS } from '../constants';

const STORAGE_KEY = 'pr1me_ready_meals';

export const getStoredReadyMeals = (): ReadyMeal[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_READY_MEALS));
      }
      return MOCK_READY_MEALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return MOCK_READY_MEALS;
  } catch (err) {
    console.error('Failed to parse ready meals from localStorage', err);
    return MOCK_READY_MEALS;
  }
};

export const saveStoredReadyMeals = (meals: ReadyMeal[]): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
      window.dispatchEvent(new CustomEvent('ready_meals_updated', { detail: meals }));
    }
  } catch (err) {
    console.error('Failed to save ready meals', err);
  }
};

export const addStoredReadyMeal = (meal: ReadyMeal): ReadyMeal[] => {
  const current = getStoredReadyMeals();
  const updated = [meal, ...current.filter(m => m.id !== meal.id)];
  saveStoredReadyMeals(updated);
  return updated;
};

export const deleteStoredReadyMeal = (id: string): ReadyMeal[] => {
  const current = getStoredReadyMeals();
  const updated = current.filter(m => m.id !== id);
  saveStoredReadyMeals(updated);
  return updated;
};

export const calculateReadyMealNutrition = (items: ReadyMealFoodItem[]) => {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  for (const item of items) {
    const food = MOCK_FOODS.find(f => f.id === item.foodId);
    if (food) {
      const baseQty = food.baseQuantity || (food.unit === 'unidade' ? 1 : 100);
      const mult = item.quantity / baseQty;
      calories += (food.calories || 0) * mult;
      protein += (food.protein || 0) * mult;
      carbs += (food.carbs || 0) * mult;
      fat += (food.fat || 0) * mult;
      fiber += (food.fiber || 0) * mult;
    }
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber: Math.round(fiber * 10) / 10
  };
};
