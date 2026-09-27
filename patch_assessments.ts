import fs from 'fs';

let content = fs.readFileSync('components/clients/ClientAssessmentsTab.tsx', 'utf-8');

// Button click
content = content.replace(
  `onClick={() => onEdit(assessment)}`,
  `onClick={(e) => { e.stopPropagation(); onEdit(assessment); }}`
);

// Row div
content = content.replace(
  `<tr key={assessment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">`,
  `<tr key={assessment.id} onClick={() => onEdit(assessment)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">`
);

fs.writeFileSync('components/clients/ClientAssessmentsTab.tsx', content);
