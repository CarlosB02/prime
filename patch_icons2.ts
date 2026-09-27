import fs from 'fs';

const files = [
  'components/clients/ClientSettingsTab.tsx',
  'components/clients/ClientDetailsView.tsx',
  'components/clients/ClientExamsTab.tsx',
  'components/clients/ClientAssessmentsTab.tsx'
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
    
    // Lighten the default color of the buttons
    content = content.replace(/className="p-2 text-slate-500/g, 'className="p-2 text-slate-400');
    content = content.replace(/className="p-1.5 text-slate-500/g, 'className="p-1.5 text-slate-400');
    
    content = content.replace(/className="p-2 text-emerald-600 hover:bg-emerald-50/g, 'className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50');
    content = content.replace(/className="p-2 text-red-600 hover:bg-red-50/g, 'className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50');

    fs.writeFileSync(file, content);
  }
}
