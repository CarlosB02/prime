import fs from 'fs';

let content = fs.readFileSync('components/nutrition/FoodView.tsx', 'utf-8');

// The button click
content = content.replace(
  `onClick={() => handleEdit(food)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(food); }}`
);

content = content.replace(
  `onClick={() => handleDelete(food.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(food.id); }}`
);

// The div row
content = content.replace(
  `            filteredFoods.map((food) => (
              <div 
                key={food.id} 
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${food.isDeleted ? 'opacity-60 grayscale' : ''}
                \`}
              >`,
  `            filteredFoods.map((food) => (
              <div 
                key={food.id} 
                onClick={() => !food.isDeleted && handleEdit(food)}
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${food.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                \`}
              >`
);

fs.writeFileSync('components/nutrition/FoodView.tsx', content);
