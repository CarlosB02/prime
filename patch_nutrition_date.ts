import fs from 'fs';
const content = fs.readFileSync('components/nutrition_plans/NutritionPlanBuilder.tsx', 'utf-8');

let newContent = content.replace(
  `             <div className="flex flex-col sm:flex-row sm:items-center gap-3 pl-11">
               <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                 <Calendar size={14} className="text-slate-400"/>
                 <input type="date" value={plan.startDate} onChange={e => setPlan({...plan, startDate: e.target.value})} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
                 <span className="text-slate-400 text-xs">até</span>
                 <input type="date" value={plan.endDate} onChange={e => setPlan({...plan, endDate: e.target.value})} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
               </div>`,
  `             <div className="flex flex-col sm:flex-row sm:items-center gap-3 pl-11">
               <button 
                 onClick={() => setPlan({...plan, startDate: plan.startDate ? '' : new Date().toISOString().split('T')[0], endDate: plan.endDate ? '' : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]})}
                 className={\`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-xl transition-colors \${plan.startDate ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}\`}
               >
                 <Calendar size={14} /> {plan.startDate ? 'Definir Data' : 'Definir Data'}
               </button>
               {plan.startDate && (
                 <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                   <Calendar size={14} className="text-slate-400"/>
                   <input type="date" value={plan.startDate} onChange={e => setPlan({...plan, startDate: e.target.value})} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
                   <span className="text-slate-400 text-xs">até</span>
                   <input type="date" value={plan.endDate} onChange={e => setPlan({...plan, endDate: e.target.value})} className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-600 dark:text-slate-300 w-28 font-medium"/>
                 </div>
               )}`
);

fs.writeFileSync('components/nutrition_plans/NutritionPlanBuilder.tsx', newContent);
