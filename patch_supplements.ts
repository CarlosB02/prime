import fs from 'fs';

let content = fs.readFileSync('components/supplements/SupplementsView.tsx', 'utf-8');

// Button clicks
content = content.replace(
  `onClick={() => handleEdit(supp)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(supp); }}`
);

content = content.replace(
  `onClick={() => toggleDelete(supp.id)}`,
  `onClick={(e) => { e.stopPropagation(); toggleDelete(supp.id); }}`
);

content = content.replace(
  `onClick={() => handleDeletePermanent(supp.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDeletePermanent(supp.id); }}`
);

// Row div
content = content.replace(
  `            filteredSupplements.map((supp) => (
              <div 
                key={supp.id} 
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${supp.isDeleted ? 'opacity-60 grayscale' : ''}
                \`}
              >`,
  `            filteredSupplements.map((supp) => (
              <div 
                key={supp.id} 
                onClick={() => !supp.isDeleted && handleEdit(supp)}
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${supp.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                \`}
              >`
);

fs.writeFileSync('components/supplements/SupplementsView.tsx', content);
