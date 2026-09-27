import fs from 'fs';

let content = fs.readFileSync('components/promos/PromosView.tsx', 'utf-8');

// Button clicks
content = content.replace(
  `onClick={() => handleEdit(promo)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(promo); }}`
);

content = content.replace(
  `onClick={() => toggleDelete(promo.id)}`,
  `onClick={(e) => { e.stopPropagation(); toggleDelete(promo.id); }}`
);

content = content.replace(
  `onClick={() => handleDeletePermanent(promo.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDeletePermanent(promo.id); }}`
);

// Row div
content = content.replace(
  `                return (
                  <div 
                    key={promo.id} 
                    className={\`
                      group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                      \${promo.isDeleted ? 'opacity-60 grayscale' : ''}
                    \`}
                  >`,
  `                return (
                  <div 
                    key={promo.id} 
                    onClick={() => !promo.isDeleted && handleEdit(promo)}
                    className={\`
                      group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                      \${promo.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                    \`}
                  >`
);

fs.writeFileSync('components/promos/PromosView.tsx', content);
