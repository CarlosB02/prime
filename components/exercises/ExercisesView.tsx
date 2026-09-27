import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  PlayCircle, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Youtube, 
  MoreVertical,
  Dumbbell,
  LayoutGrid
} from 'lucide-react';
import { Exercise } from '../../types';
import { MOCK_EXERCISES, MUSCLE_GROUPS, DIFFICULTY_LEVELS } from '../../constants';
import ExerciseModal from './ExerciseModal';

const ExercisesView: React.FC = () => {
  // State
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [filterMuscle, setFilterMuscle] = useState('Todos');
  const [sortOrder, setSortOrder] = useState<'name' | 'muscle'>('name');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Handlers
  const handleAdd = () => {
    setEditingExercise(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const handleSave = (exerciseData: Omit<Exercise, 'id' | 'isDeleted'>) => {
    if (editingExercise) {
      // Update existing
      setExercises(prev => prev.map(ex => 
        ex.id === editingExercise.id ? { ...ex, ...exerciseData } : ex
      ));
    } else {
      // Create new
      const newExercise: Exercise = {
        ...exerciseData,
        id: Math.random().toString(36).substr(2, 9),
        isDeleted: false
      };
      setExercises(prev => [newExercise, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id) {
        return { ...ex, isDeleted: !ex.isDeleted };
      }
      return ex;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este exercício?')) {
      setExercises(prev => prev.filter(ex => ex.id !== id));
    }
  };

  // Filter Logic
  const filteredExercises = useMemo(() => {
    return exercises
      .filter(ex => {
        if (!showDeleted && ex.isDeleted) return false;
        if (showDeleted && !ex.isDeleted) return false;
        
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMuscle = filterMuscle === 'Todos' || ex.muscleGroup === filterMuscle;
        
        return matchesSearch && matchesMuscle;
      })
      .sort((a, b) => {
        if (sortOrder === 'name') return a.name.localeCompare(b.name);
        return a.muscleGroup.localeCompare(b.muscleGroup);
      });
  }, [exercises, searchQuery, showDeleted, filterMuscle, sortOrder]);

  // Visual Helpers
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Intermédio': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Avançado': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search & Toggles */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[280px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar exercícios..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
          
          <button 
            onClick={() => setShowDeleted(!showDeleted)}
            className={`flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showDeleted 
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' 
                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Trash2 size={16} className="mr-2" />
            {showDeleted ? 'Ocultar Eliminados' : 'Mostrar Eliminados'}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button className="flex items-center px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Youtube size={18} className="mr-2 text-red-500" />
            Verificar Vídeos
          </button>
          
          <button 
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mr-2">
          <Filter size={14} className="mr-1" /> Filtros:
        </div>
        
        <select 
          value={filterMuscle}
          onChange={(e) => setFilterMuscle(e.target.value)}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500"
        >
          <option value="Todos">Todos os Músculos</option>
          {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2" />

        <button 
          onClick={() => setSortOrder(prev => prev === 'name' ? 'muscle' : 'name')}
          className="px-3 py-1.5 bg-transparent text-slate-500 hover:text-primary-500 text-xs font-medium uppercase tracking-wide transition-colors"
        >
          Ordenar por: <span className="text-slate-800 dark:text-white font-bold">{sortOrder === 'name' ? 'Nome' : 'Grupo Muscular'}</span>
        </button>
      </div>

      {/* Main List - Hybrid Table/Card Layout */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header - Adjusted Grid for New Columns */}
        {/* 
            Grid Cols Total: 12
            ID: 1 (Hidden sm)
            Img: 1
            Details: 3
            Muscle Group: 2 (Hidden sm)
            Rating: 2 (Hidden md)
            Video: 1 (Hidden lg)
            Actions: 2
        */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 hidden md:block text-center">ID</div>
          <div className="col-span-2 sm:col-span-1 text-center">Img</div>
          <div className="col-span-6 sm:col-span-4 md:col-span-3">Detalhes do Exercício</div>
          <div className="col-span-2 hidden sm:block">Grupo Muscular</div>
          <div className="col-span-2 hidden lg:block">Classificação</div>
          <div className="col-span-1 hidden xl:block">Vídeo</div>
          <div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-2 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Dumbbell size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem exercícios encontrados</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Tente ajustar os filtros ou adicione um novo exercício à sua biblioteca.</p>
              <button onClick={handleAdd} className="mt-6 text-primary-600 font-medium hover:underline text-sm">Criar novo exercício</button>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <div 
                key={exercise.id} 
                onClick={() => !exercise.isDeleted && handleEdit(exercise)}
                className={`group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  ${exercise.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}`}
              >
                {/* ID */}
                <div className="col-span-1 hidden md:block text-center">
                  <span className="text-xs font-mono text-slate-400">#{exercise.id}</span>
                </div>

                {/* Image */}
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm ring-2 ring-white dark:ring-slate-800 relative group-hover:scale-110 transition-transform">
                    <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Name & Details (Muscle duplicated here as per request) */}
                <div className="col-span-6 sm:col-span-4 md:col-span-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base truncate pr-2" title={exercise.name}>
                    {exercise.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{exercise.muscleGroup}</span>
                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-[10px] text-slate-400 uppercase">{exercise.equipment}</span>
                  </div>
                </div>

                {/* Muscle Group (Dedicated Column) */}
                <div className="col-span-2 hidden sm:flex items-center">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                        {exercise.muscleGroup}
                    </span>
                </div>

                {/* Tags / Rating */}
                <div className="col-span-2 hidden lg:flex flex-col items-start justify-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{exercise.description}</span>
                </div>

                {/* Video Link */}
                <div className="col-span-1 hidden xl:block">
                  {exercise.videos && exercise.videos.length > 0 ? (
                    <div className="flex gap-1">
                        {exercise.videos.slice(0, 2).map((vid, idx) => (
                             <a 
                                key={idx}
                                href={vid.type === 'link' ? vid.url : '#'} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10"
                                title={`Ver Vídeo ${idx + 1}`}
                            >
                                <PlayCircle size={18} />
                            </a>
                        ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">--</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-2 flex justify-end items-center gap-2">
                   {exercise.isDeleted ? (
                     <>
                        <button 
                          onClick={() => toggleDelete(exercise.id)}
                          title="Restaurar"
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeletePermanent(exercise.id)}
                          title="Eliminar Permanentemente"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </>
                   ) : (
                     <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(exercise); }}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => toggleDelete(exercise.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </>
                   )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A mostrar {filteredExercises.length} resultados
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 transition-colors">1</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Seguinte</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ExerciseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={editingExercise}
      />
    </div>
  );
};

export default ExercisesView;
