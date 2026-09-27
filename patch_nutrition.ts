import fs from 'fs';
const content = fs.readFileSync('components/nutrition_plans/NutritionPlansView.tsx', 'utf-8');

const targetStr = `      </div>\n\n      {/* Content Area */}`;
const split = content.split(targetStr);

const newContent = `      </div>

      {/* Filters & View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'in_progress', label: 'Em Progresso' },
            { id: 'completed', label: 'Concluídos' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={\`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all \${
                activeFilter === filter.id
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }\`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={\`p-2 rounded-lg transition-all \${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }\`}
              title="Vista em Grelha"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={\`p-2 rounded-lg transition-all \${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }\`}
              title="Vista em Linha"
            >
              <List size={18} />
            </button>
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="appearance-none pl-10 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              <option value="newest">Mais recente</option>
              <option value="oldest">Mais antigo</option>
            </select>
            <ArrowDownUp size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredPlans.length === 0 ? (
        <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
             <Apple size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem planos de nutrição</h3>
          <p className="text-slate-500 max-w-xs mt-2 text-sm">Crie o seu primeiro plano de nutrição para organizar as refeições.</p>
          <button 
            onClick={handleAdd}
            className="mt-6 px-6 py-2.5 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
          >
            Criar Plano Agora
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            const displayedPlans = filteredPlans.filter(plan => {
              if (activeFilter === 'all') return true;
              const isCompleted = plan.endDate && new Date(plan.endDate) < now;
              return activeFilter === 'completed' ? isCompleted : !isCompleted;
            }).sort(sortFn);

            if (displayedPlans.length === 0) {
              return (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Nenhum plano encontrado para este filtro.
                </div>
              );
            }

            return viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedPlans.map(plan => renderPlanCard(plan))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {displayedPlans.map(plan => renderCompactPlanRow(plan))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default NutritionPlansView;
`;

fs.writeFileSync('components/nutrition_plans/NutritionPlansView.tsx', split[0] + newContent);
