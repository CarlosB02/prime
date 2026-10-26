import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Dumbbell, 
  StickyNote, 
  Plus, 
  Trash2, 
  Search, 
  Filter,
  User,
  Clock,
  ChevronRight
} from 'lucide-react';
import { CustomChatIcon } from '../icons';

export interface ExerciseNoteRecord {
  id: string;
  date: string;
  exercise: string;
  text: string;
  author?: string;
  workoutPlan?: string;
}

export interface TrainingNoteRecord {
  id: string;
  date: string;
  workoutName: string;
  text: string;
  author?: string;
  rpe?: number;
}

interface EvolutionNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'exercise' | 'training';
  clientName: string;
  clientAvatar?: string;
  exerciseNotes: ExerciseNoteRecord[];
  trainingNotes: TrainingNoteRecord[];
  onAddExerciseNote?: (note: Omit<ExerciseNoteRecord, 'id'>) => void;
  onDeleteExerciseNote?: (id: string) => void;
  onAddTrainingNote?: (note: Omit<TrainingNoteRecord, 'id'>) => void;
  onDeleteTrainingNote?: (id: string) => void;
  onSwitchType?: (type: 'exercise' | 'training') => void;
}

export const EvolutionNotesDrawer: React.FC<EvolutionNotesDrawerProps> = ({
  isOpen,
  onClose,
  type,
  clientName,
  clientAvatar,
  exerciseNotes,
  trainingNotes,
  onAddExerciseNote,
  onDeleteExerciseNote,
  onAddTrainingNote,
  onDeleteTrainingNote,
  onSwitchType
}) => {
  const [activeTab, setActiveTab] = useState<'exercise' | 'training'>(type);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for adding note
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formExercise, setFormExercise] = useState('Supino Plano com Barra');
  const [formWorkoutName, setFormWorkoutName] = useState('Treino A - Peito e Tríceps');
  const [formText, setFormText] = useState('');

  // Keep internal tab synchronized when opened
  React.useEffect(() => {
    setActiveTab(type);
  }, [type, isOpen]);

  if (!isOpen) return null;

  const handleTabChange = (newTab: 'exercise' | 'training') => {
    setActiveTab(newTab);
    setIsAddingNew(false);
    if (onSwitchType) {
      onSwitchType(newTab);
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    // Format display date
    const d = new Date(formDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    if (activeTab === 'exercise') {
      if (onAddExerciseNote) {
        onAddExerciseNote({
          date: formattedDate,
          exercise: formExercise.trim() || 'Exercício Geral',
          text: formText.trim(),
          author: 'Treinador'
        });
      }
    } else {
      if (onAddTrainingNote) {
        onAddTrainingNote({
          date: formattedDate,
          workoutName: formWorkoutName.trim() || 'Treino Geral',
          text: formText.trim(),
          author: 'Atleta'
        });
      }
    }

    setFormText('');
    setIsAddingNew(false);
  };

  const filteredExerciseNotes = exerciseNotes.filter(n => 
    n.exercise.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.date.includes(searchQuery)
  );

  const filteredTrainingNotes = trainingNotes.filter(n => 
    n.workoutName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.date.includes(searchQuery)
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel on the Right Side (estilo perfil de cliente para dar scroll) */}
      <aside 
        className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[480px] md:w-[520px] bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              {clientAvatar ? (
                <img 
                  src={clientAvatar} 
                  alt={clientName} 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0" 
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {clientName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded-md">
                    Registos & Evolução
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white truncate mt-0.5">
                  {clientName}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Fechar painel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Selector: Notas de Treino vs Notas de Exercício */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => handleTabChange('training')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'training'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <StickyNote size={15} />
              <span>Notas de Treino</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'training' 
                  ? 'bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300' 
                  : 'bg-slate-300/60 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {trainingNotes.length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange('exercise')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'exercise'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CustomChatIcon size={15} />
              <span>Notas de Exercício</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'exercise' 
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-slate-300/60 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {exerciseNotes.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filter and Action Sub-bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'exercise' ? 'Filtrar por exercício, nota ou data...' : 'Filtrar por treino, nota ou data...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAddingNew(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              isAddingNew
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                : activeTab === 'exercise'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isAddingNew ? (
              <>
                <X size={14} />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Nova Nota</span>
              </>
            )}
          </button>
        </div>

        {/* New Note Form */}
        {isAddingNew && (
          <form onSubmit={handleCreateNote} className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 animate-fade-in space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Adicionar {activeTab === 'exercise' ? 'Nota de Exercício' : 'Nota de Treino'}
              </span>
              <span className="text-[10px] text-slate-400">Registo no histórico</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Data</label>
                <input 
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {activeTab === 'exercise' ? 'Exercício' : 'Treino / Sessão'}
                </label>
                {activeTab === 'exercise' ? (
                  <input 
                    type="text"
                    value={formExercise}
                    onChange={(e) => setFormExercise(e.target.value)}
                    placeholder="Ex: Supino Plano"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    required
                  />
                ) : (
                  <input 
                    type="text"
                    value={formWorkoutName}
                    onChange={(e) => setFormWorkoutName(e.target.value)}
                    placeholder="Ex: Treino A - Peito"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    required
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Texto da Nota</label>
              <textarea 
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="Insira as observações técnicas, sensações, feedback de cargas..."
                rows={3}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className={`px-3.5 py-1.5 text-xs font-bold text-white rounded-lg transition-colors ${
                  activeTab === 'exercise' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Guardar Registo
              </button>
            </div>
          </form>
        )}

        {/* Scrollable Notes List (para dar scroll no lado direito) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {activeTab === 'exercise' ? (
            /* Exercise Notes List */
            filteredExerciseNotes.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CustomChatIcon size={36} className="mx-auto mb-2 opacity-30 text-indigo-500" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nenhuma nota de exercício encontrada</p>
                <p className="text-xs text-slate-400 mt-1">Crie a primeira nota clicando no botão acima.</p>
              </div>
            ) : (
              filteredExerciseNotes.map((note) => (
                <div 
                  key={note.id}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group"
                >
                  {/* Top: Date & Exercise badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
                        <Dumbbell size={12} className="shrink-0" />
                        {note.exercise}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Calendar size={11} className="text-slate-400" />
                        {note.date}
                      </span>
                    </div>

                    {onDeleteExerciseNote && (
                      <button
                        onClick={() => onDeleteExerciseNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                        title="Eliminar nota"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Note Content */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                    {note.text}
                  </p>

                  {/* Footer metadata */}
                  {note.author && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Registado por: <strong className="font-semibold text-slate-600 dark:text-slate-300">{note.author}</strong></span>
                      {note.workoutPlan && <span>{note.workoutPlan}</span>}
                    </div>
                  )}
                </div>
              ))
            )
          ) : (
            /* Training Notes List */
            filteredTrainingNotes.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <StickyNote size={36} className="mx-auto mb-2 opacity-30 text-primary-500" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nenhuma nota de treino encontrada</p>
                <p className="text-xs text-slate-400 mt-1">Crie a primeira nota de treino clicando no botão acima.</p>
              </div>
            ) : (
              filteredTrainingNotes.map((note) => (
                <div 
                  key={note.id}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:border-primary-300 dark:hover:border-primary-500/50 transition-all group"
                >
                  {/* Top: Date & Workout Name */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/60">
                        <StickyNote size={12} className="shrink-0" />
                        {note.workoutName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Calendar size={11} className="text-slate-400" />
                        {note.date}
                      </span>
                    </div>

                    {onDeleteTrainingNote && (
                      <button
                        onClick={() => onDeleteTrainingNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                        title="Eliminar nota"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                    {note.text}
                  </p>

                  {/* Footer metadata */}
                  {note.author && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Origem: <strong className="font-semibold text-slate-600 dark:text-slate-300">{note.author}</strong></span>
                      {note.rpe && <span className="font-bold text-emerald-600">RPE {note.rpe}/10</span>}
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </aside>
    </>
  );
};

export default EvolutionNotesDrawer;
