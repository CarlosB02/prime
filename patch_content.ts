import fs from 'fs';

let content = fs.readFileSync('components/content/ContentView.tsx', 'utf-8');

// Button clicks
content = content.replace(
  `onClick={() => handleEdit(item)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(item); }}`
);

content = content.replace(
  `onClick={() => toggleDelete(item.id)}`,
  `onClick={(e) => { e.stopPropagation(); toggleDelete(item.id); }}`
);

content = content.replace(
  `onClick={() => handleDeletePermanent(item.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDeletePermanent(item.id); }}`
);

// Row div
content = content.replace(
  `            filteredContents.map((item) => {
              const ActionConfig = getActionButtonConfig(item.type);
              const ActionIcon = ActionConfig.icon;
              
              return (
                <div 
                    key={item.id} 
                    className={\`
                    group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                    \${item.isDeleted ? 'opacity-60 grayscale' : ''}
                    \`}
                >`,
  `            filteredContents.map((item) => {
              const ActionConfig = getActionButtonConfig(item.type);
              const ActionIcon = ActionConfig.icon;
              
              return (
                <div 
                    key={item.id} 
                    onClick={() => !item.isDeleted && handleEdit(item)}
                    className={\`
                    group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                    \${item.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                    \`}
                >`
);


fs.writeFileSync('components/content/ContentView.tsx', content);
