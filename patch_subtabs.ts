import fs from 'fs';
const content = fs.readFileSync('components/workouts/CardioAndStretching.tsx', 'utf-8');

const targetStr = `      {/* Tabs */}
      {!hideTabs && (
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('cardio')}
          className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${
            activeTab === 'cardio'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }\`}
        >
          <div className="flex items-center gap-2">
            <Activity size={16} /> Cardio
          </div>
        </button>
        <button
          onClick={() => setActiveTab('alongamentos')}
          className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${
            activeTab === 'alongamentos'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }\`}
        >
          <div className="flex items-center gap-2">
            <Move size={16} /> Alongamentos
          </div>
        </button>
      </div>
      )}`;

const newStr = `      {/* Tabs */}
      {!hideTabs && (
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('alongamentos')}
          className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${
            activeTab === 'alongamentos'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }\`}
        >
          <div className="flex items-center gap-2">
            <Move size={16} /> Alongamentos
          </div>
        </button>
        <button
          onClick={() => setActiveTab('cardio')}
          className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${
            activeTab === 'cardio'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }\`}
        >
          <div className="flex items-center gap-2">
            <Activity size={16} /> Cardio
          </div>
        </button>
      </div>
      )}`;

let newContent = content.replace(targetStr, newStr);

newContent = newContent.replace(
  "const [activeTab, setActiveTab] = useState<'cardio' | 'alongamentos'>(type || 'cardio');",
  "const [activeTab, setActiveTab] = useState<'cardio' | 'alongamentos'>(type || 'alongamentos');"
);

fs.writeFileSync('components/workouts/CardioAndStretching.tsx', newContent);
