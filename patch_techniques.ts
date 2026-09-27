import fs from 'fs';

let content = fs.readFileSync('components/exercises/ExerciseTechniquesView.tsx', 'utf-8');

// The button click
content = content.replace(
  `onClick={() => handleEdit(technique)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(technique); }}`
);

content = content.replace(
  `onClick={() => handleDelete(technique.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(technique.id); }}`
);

// The div row
content = content.replace(
  `<div key={technique.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">`,
  `<div key={technique.id} onClick={() => handleEdit(technique)} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">`
);


fs.writeFileSync('components/exercises/ExerciseTechniquesView.tsx', content);
