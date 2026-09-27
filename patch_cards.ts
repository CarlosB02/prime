import fs from 'fs';

// --- WORKOUTS VIEW ---
let workouts = fs.readFileSync('components/workouts/WorkoutsView.tsx', 'utf-8');

// PlanCard wrapper
workouts = workouts.replace(
  `      <div key={plan.id} className="glass-panel border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg border-primary-100 dark:border-primary-900/30">`,
  `      <div key={plan.id} onClick={() => mode === 'select' ? (onSelectPlan && onSelectPlan(plan)) : handleEdit(plan)} className="glass-panel border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg border-primary-100 dark:border-primary-900/30 cursor-pointer">`
);

// Buttons inside PlanCard
workouts = workouts.replace(
  `onClick={() => onSelectPlan && onSelectPlan(plan)}`,
  `onClick={(e) => { e.stopPropagation(); onSelectPlan && onSelectPlan(plan); }}`
);
workouts = workouts.replace(
  `onClick={() => console.log('Histórico')}`,
  `onClick={(e) => { e.stopPropagation(); console.log('Histórico'); }}`
);
// Careful with replace all
workouts = workouts.replaceAll(
  `onClick={() => handleEdit(plan)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}`
);
workouts = workouts.replaceAll(
  `onClick={() => handleDelete(plan.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}`
);

// CompactRow wrapper
workouts = workouts.replace(
  `      <div key={plan.id} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80">`,
  `      <div key={plan.id} onClick={() => mode === 'select' ? (onSelectPlan && onSelectPlan(plan)) : handleEdit(plan)} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80 cursor-pointer">`
);

fs.writeFileSync('components/workouts/WorkoutsView.tsx', workouts);

// --- NUTRITION VIEW ---
let nutrition = fs.readFileSync('components/nutrition_plans/NutritionPlansView.tsx', 'utf-8');

// PlanCard wrapper
nutrition = nutrition.replace(
  `      <div key={plan.id} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full">`,
  `      <div key={plan.id} onClick={() => handleEdit(plan)} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full cursor-pointer">`
);

// Buttons inside PlanCard (there's no select mode in nutrition yet, but just in case)
nutrition = nutrition.replaceAll(
  `onClick={() => handleEdit(plan)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}`
);
nutrition = nutrition.replaceAll(
  `onClick={() => handleDelete(plan.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}`
);
nutrition = nutrition.replace(
  `onClick={() => console.log('Histórico')}`,
  `onClick={(e) => { e.stopPropagation(); console.log('Histórico'); }}`
);

// CompactRow wrapper
nutrition = nutrition.replace(
  `      <div key={plan.id} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80">`,
  `      <div key={plan.id} onClick={() => handleEdit(plan)} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80 cursor-pointer">`
);

fs.writeFileSync('components/nutrition_plans/NutritionPlansView.tsx', nutrition);
