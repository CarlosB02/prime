import fs from 'fs';

let content = fs.readFileSync('components/payments/PlansView.tsx', 'utf-8');

// Button clicks
content = content.replace(
  `onClick={() => handleEdit(plan)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}`
);

content = content.replace(
  `onClick={() => toggleDelete(plan.id)}`,
  `onClick={(e) => { e.stopPropagation(); toggleDelete(plan.id); }}`
);

content = content.replace(
  `onClick={() => handleDeletePermanent(plan.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDeletePermanent(plan.id); }}`
);

// Row div
content = content.replace(
  `            filteredPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${plan.isDeleted ? 'opacity-60 grayscale' : ''}
                \`}
              >`,
  `            filteredPlans.map((plan) => (
              <div 
                key={plan.id} 
                onClick={() => !plan.isDeleted && handleEdit(plan)}
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${plan.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                \`}
              >`
);

fs.writeFileSync('components/payments/PlansView.tsx', content);
