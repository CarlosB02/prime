import fs from 'fs';

let content = fs.readFileSync('components/exercises/ExercisesView.tsx', 'utf-8');

content = content.replace(
  `            filteredExercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${exercise.isDeleted ? 'opacity-60 grayscale' : ''}
                \`}
              >`,
  `            filteredExercises.map((exercise) => (
              <div 
                key={exercise.id} 
                onClick={() => !exercise.isDeleted && handleEdit(exercise)}
                className={\`
                  group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  \${exercise.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                \`}
              >`
);

content = content.replace(
  `onClick={() => handleEdit(exercise)}`,
  `onClick={(e) => { e.stopPropagation(); handleEdit(exercise); }}`
);

content = content.replace(
  `onClick={() => handleDelete(exercise.id)}`,
  `onClick={(e) => { e.stopPropagation(); handleDelete(exercise.id); }}`
);

fs.writeFileSync('components/exercises/ExercisesView.tsx', content);
