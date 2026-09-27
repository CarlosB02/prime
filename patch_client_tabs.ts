import fs from 'fs';

// --- ClientNutritionTab ---
let content = fs.readFileSync('components/clients/ClientNutritionTab.tsx', 'utf-8');

// Row div
content = content.replace(
  `      <div key={plan.id} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full">`,
  `      <div key={plan.id} onClick={() => handleEdit(plan)} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full cursor-pointer">`
);
content = content.replace(
  `      <div key={plan.id} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80">`,
  `      <div key={plan.id} onClick={() => handleEdit(plan)} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80 cursor-pointer">`
);

// Button clicks
content = content.replaceAll(
  `onClick={() => handleEdit(plan)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}`
);
content = content.replaceAll(
  `onClick={() => handleDelete(plan.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}`
);

fs.writeFileSync('components/clients/ClientNutritionTab.tsx', content);

// --- ClientExamsTab ---
let content2 = fs.readFileSync('components/clients/ClientExamsTab.tsx', 'utf-8');
content2 = content2.replace(
  `      <div key={exam.id} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full">`,
  `      <div key={exam.id} onClick={() => handleEdit(exam)} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all group flex flex-col h-full cursor-pointer">`
);
content2 = content2.replace(
  `      <div key={exam.id} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80">`,
  `      <div key={exam.id} onClick={() => handleEdit(exam)} className="flex items-center justify-between p-4 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-80 cursor-pointer">`
);
content2 = content2.replaceAll(
  `onClick={() => handleEdit(exam)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(exam); }}`
);
content2 = content2.replaceAll(
  `onClick={() => handleDelete(exam.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(exam.id); }}`
);

fs.writeFileSync('components/clients/ClientExamsTab.tsx', content2);
