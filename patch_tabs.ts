import fs from 'fs';
const content = fs.readFileSync('components/workouts/WorkoutPlanBuilder.tsx', 'utf-8');

const targetStr = `      {/* TABS DE NAVEGAÇÃO INTERNA */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 shadow-sm shrink-0 flex items-center gap-6 z-20 relative">
        <button 
          onClick={() => setActiveMainTab('treino')}
          className={\`py-3 text-sm font-bold border-b-2 transition-colors \${activeMainTab === 'treino' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}\`}
        >
          Treino
        </button>
        <button 
          onClick={() => setActiveMainTab('cardio')}
          className={\`py-3 text-sm font-bold border-b-2 transition-colors \${activeMainTab === 'cardio' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}\`}
        >
          Cardio
        </button>
        <button 
          onClick={() => setActiveMainTab('alongamentos')}
          className={\`py-3 text-sm font-bold border-b-2 transition-colors \${activeMainTab === 'alongamentos' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}\`}
        >
          Alongamentos
        </button>
      </div>`;

const newStr = `      {/* TABS DE NAVEGAÇÃO INTERNA */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 shadow-sm shrink-0 flex items-center gap-6 z-20 relative">
        <button 
          onClick={() => setActiveMainTab('treino')}
          className={\`py-3 text-sm font-bold border-b-2 transition-colors \${activeMainTab === 'treino' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}\`}
        >
          Treino
        </button>
        <button 
          onClick={() => setActiveMainTab('alongamentos')}
          className={\`py-3 text-sm font-bold border-b-2 transition-colors \${activeMainTab === 'alongamentos' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}\`}
        >
          Alongamentos
        </button>
        <button 
          onClick={() => setActiveMainTab('cardio')}
          className={\`py-3 text-sm font-bold border-b-2 transition-colors \${activeMainTab === 'cardio' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}\`}
        >
          Cardio
        </button>
      </div>`;

let newContent = content.replace(targetStr, newStr);

newContent = newContent.replace(
  "const [hasDate, setHasDate] = useState(true);",
  "const [hasDate, setHasDate] = useState(!!planData?.startDate);"
);

newContent = newContent.replace(
  "const [startDate, setStartDate] = useState(planData?.startDate || '2026-06-22');",
  "const [startDate, setStartDate] = useState(planData?.startDate || new Date().toISOString().split('T')[0]);"
);

newContent = newContent.replace(
  "const [endDate, setEndDate] = useState(planData?.endDate || '2026-08-22');",
  "const [endDate, setEndDate] = useState(planData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);"
);

fs.writeFileSync('components/workouts/WorkoutPlanBuilder.tsx', newContent);
