import fs from 'fs';

const files = [
  'components/exercises/ExercisesView.tsx',
  'components/exercises/ExerciseTechniquesView.tsx',
  'components/nutrition/FoodView.tsx',
  'components/supplements/SupplementsView.tsx',
  'components/payments/PlansView.tsx',
  'components/promos/PromosView.tsx',
  'components/settings/AutomationsView.tsx',
  'components/clients/ClientSettingsTab.tsx',
  'components/clients/ClientDetailsView.tsx',
  'components/clients/ClientExamsTab.tsx',
  'components/workouts/CardioAndStretching.tsx',
  'components/workouts/WorkoutPlanBuilder.tsx',
  'components/nutrition_plans/NutritionPlanBuilder.tsx',
  'components/clients/ClientNotesModal.tsx',
  'components/clients/ClientDetailsModal.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    // We want to remove 'opacity-0 group-hover:opacity-100 transition-opacity' 
    // or just 'opacity-0 group-hover:opacity-100'
    content = content.replace(/opacity-0 group-hover:opacity-100 transition-opacity/g, '');
    content = content.replace(/opacity-0 group-hover:opacity-100 transition-all/g, '');
    content = content.replace(/opacity-0 group-hover:opacity-100/g, '');
    
    // Cleanup any double spaces or leading/trailing spaces in className strings that might occur
    content = content.replace(/className="\s+/g, 'className="');
    content = content.replace(/\s+"/g, '"');
    content = content.replace(/\s+`/g, '`');
    content = content.replace(/`\s+/g, '`');
    
    fs.writeFileSync(file, content);
    console.log(`Patched ${file}`);
  }
}
