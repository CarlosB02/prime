import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ClipboardCheck,
  Filter,
  MoreVertical
} from 'lucide-react';

const AssessmentsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[280px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar avaliações..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-5 md:col-span-4 lg:col-span-3">Cliente</div>
          <div className="col-span-3 hidden md:block">Data</div>
          <div className="col-span-3 hidden sm:block md:col-span-2">Peso</div>
          <div className="col-span-2 hidden lg:block">Massa Gorda</div>
          <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <ClipboardCheck size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem avaliações</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Registe a primeira avaliação física de um cliente.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsView;
