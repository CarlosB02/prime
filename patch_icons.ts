import fs from 'fs';

const files = [
  'components/exercises/ExercisesView.tsx',
  'components/exercises/ExerciseTechniquesView.tsx',
  'components/nutrition/FoodView.tsx',
  'components/supplements/SupplementsView.tsx',
  'components/payments/PlansView.tsx',
  'components/promos/PromosView.tsx',
  'components/settings/AutomationsView.tsx',
  'components/content/ContentView.tsx',
  'components/questionnaires/QuestionnairesView.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Reduce icon sizes for row actions
    content = content.replace(/<Edit2 size=\{18\}/g, '<Edit2 size={16}');
    content = content.replace(/<Trash2 size=\{18\}/g, '<Trash2 size={16}');
    content = content.replace(/<RotateCcw size=\{18\}/g, '<RotateCcw size={16}');
    content = content.replace(/<Eye size=\{18\}/g, '<Eye size={16}');
    content = content.replace(/<Copy size=\{18\}/g, '<Copy size={16}');
    content = content.replace(/<Copy size=\{16\}/g, '<Copy size={16}'); // just in case
    
    // Lighten the default color of the buttons
    content = content.replace(/className="p-2 text-slate-500/g, 'className="p-2 text-slate-400');
    content = content.replace(/className="p-1.5 text-slate-500/g, 'className="p-1.5 text-slate-400');
    
    // If there's a specific delete permanent or restore button that uses red/emerald directly instead of slate, let's lighten them or make them slate by default until hover
    // E.g., Restore button: className="p-2 text-emerald-600 hover:bg-emerald-50
    content = content.replace(/className="p-2 text-emerald-600 hover:bg-emerald-50/g, 'className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50');
    
    // Delete permanent: className="p-2 text-red-600 hover:bg-red-50
    content = content.replace(/className="p-2 text-red-600 hover:bg-red-50/g, 'className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50');

    // Any other direct text-red-600 or text-emerald-600 in these action buttons
    // e.g. text-slate-500 hover:text-red-600
    
    fs.writeFileSync(file, content);
  }
}
