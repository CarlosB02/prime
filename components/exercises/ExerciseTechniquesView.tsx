import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Activity,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import ExerciseTechniqueModal from './ExerciseTechniqueModal';

// Mock Data
const MOCK_TECHNIQUES = [
  { id: '1', name: 'Drop Set', acronym: 'DS', defaultVolume: 1, description: 'Redução de carga após falha muscular.', isActive: true },
  { id: '2', name: 'Rest Pause', acronym: 'RP', defaultVolume: 1, description: 'Pausa curta entre repetições.', isActive: true },
  { id: '3', name: 'Bi-Set', acronym: 'BS', defaultVolume: 2, description: 'Dois exercícios sem descanso.', isActive: false },
];

const ExerciseTechniquesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<any>(null);
  const [techniques, setTechniques] = useState(MOCK_TECHNIQUES);

  const handleSaveTechnique = (newTechnique: any) => {
    if (editingTechnique) {
      setTechniques(techniques.map(t => t.id === newTechnique.id ? newTechnique : t));
    } else {
      setTechniques([newTechnique, ...techniques]);
    }
  };

  const handleEdit = (technique: any) => {
    setEditingTechnique(technique);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar esta técnica?')) {
      setTechniques(techniques.filter(t => t.id !== id));
    }
  };

  const handleAdd = () => {
    setEditingTechnique(null);
    setIsModalOpen(true);
  };

  const filteredTechniques = techniques.filter(technique => 
    technique.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    technique.acronym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[280px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar técnicas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end items-center">
          <button 
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={18} className="mr-2" />
            Adicionar Novo
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 hidden md:block text-center">ID</div>
          <div className="col-span-5 sm:col-span-4 md:col-span-4">Nome</div>
          <div className="col-span-2 hidden sm:block text-center">Sigla</div>
          <div className="col-span-2 sm:col-span-3 md:col-span-2 text-center">Status</div>
          <div className="col-span-5 sm:col-span-3 md:col-span-3 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredTechniques.length > 0 ? (
            filteredTechniques.map((technique) => (
              <div key={technique.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                
                <div className="col-span-1 hidden md:block text-center">
                  <span className="text-xs font-mono text-slate-400">#{technique.id}</span>
                </div>

                <div className="col-span-5 sm:col-span-4 md:col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                      <Activity size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                        {technique.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Vol: {technique.defaultVolume}x
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 hidden sm:flex justify-center items-center">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {technique.acronym}
                  </span>
                </div>
                
                <div className="col-span-2 sm:col-span-3 md:col-span-2 flex justify-center items-center">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    technique.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    {technique.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <span className="hidden sm:inline">{technique.isActive ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </div>
                
                <div className="col-span-5 sm:col-span-3 md:col-span-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(technique)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(technique.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Activity size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem técnicas encontradas</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Crie a sua primeira técnica de exercício para organizar os treinos.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ExerciseTechniqueModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTechnique}
          initialData={editingTechnique}
        />
      )}
    </div>
  );
};

export default ExerciseTechniquesView;
