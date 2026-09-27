import fs from 'fs';

let content = fs.readFileSync('components/clients/ClientSettingsTab.tsx', 'utf-8');

// Button clicks
content = content.replace(
  `onClick={() => { setEditingForm(form); setIsEditFormOpen(true); }}`,
  `onClick={(e) => { e.stopPropagation(); setEditingForm(form); setIsEditFormOpen(true); }}`
);
content = content.replace(
  `onClick={() => handleRemoveForm(form.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleRemoveForm(form.id); }}`
);

// Form row
content = content.replace(
  `                      <div key={form.id} className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">`,
  `                      <div key={form.id} onClick={() => { setEditingForm(form); setIsEditFormOpen(true); }} className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">`
);

fs.writeFileSync('components/clients/ClientSettingsTab.tsx', content);
