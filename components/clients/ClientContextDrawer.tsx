import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  AlertCircle, 
  Dumbbell, 
  Apple, 
  Heart, 
  Activity, 
  Search, 
  StickyNote, 
  Calendar, 
  Clock, 
  Check, 
  Eye, 
  Flame, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { Client } from '../../types';
import { MOCK_EXERCISES_DB, ExerciseOption } from '../workouts/ExerciseSelect';
import { MOCK_FOODS } from '../../constants';

interface ClientContextDrawerProps {
  client: Client;
  type: 'workout' | 'nutrition';
  children: React.ReactNode;
}

interface NoteItem {
  id: string;
  text: string;
  date: string;
  author: string;
}

export const ClientContextDrawer: React.FC<ClientContextDrawerProps> = ({
  client,
  type,
  children
}) => {
  // Drawer open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Accordion sections collapse states
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);

  // Selected photo for preview modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_context_notes_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: '1', text: 'Focar no aquecimento do manguito rotador antes de empurrar.', date: 'Há 3 dias', author: 'Carlos' },
      { id: '2', text: 'Previsão de férias de 10 a 17 de Agosto (adaptar rotina).', date: 'Há 1 semana', author: 'Carlos' },
    ];
  });
  const [newNoteText, setNewNoteText] = useState('');

  // Workout preferences state
  const [workoutLikes, setWorkoutLikes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_workout_likes_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Supino Plano (Barra)', 'Puxada Frontal', 'Hip Thrust Barra Livre'];
  });

  const [workoutDislikes, setWorkoutDislikes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_workout_dislikes_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Extensão de Pernas'];
  });

  const [workoutPain, setWorkoutPain] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_workout_pain_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Desenvolvimento (Halteres) - Ombro Dir.'];
  });

  // Nutrition preferences state
  const [nutritionLikes, setNutritionLikes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_nutrition_likes_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Peito de Frango Grelhado', 'Aveia em Flocos', 'Ovos Inteiros', 'Banana', 'Salmão'];
  });

  const [nutritionDislikes, setNutritionDislikes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_nutrition_dislikes_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Brócolos cozidos', 'Fígado de Vaca'];
  });

  const [nutritionIntolerances, setNutritionIntolerances] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_nutrition_intol_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Lactose (moderada)'];
  });

  const [nutritionAllergies, setNutritionAllergies] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_nutrition_allergies_${client.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Marisco', 'Amendoim'];
  });

  // Modal selector for adding exercises
  const [exerciseModalCategory, setExerciseModalCategory] = useState<'like' | 'dislike' | 'pain' | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [painNoteInput, setPainNoteInput] = useState('');

  // Modal selector for adding foods / intolerances / allergies
  const [foodModalCategory, setFoodModalCategory] = useState<'like' | 'dislike' | 'intolerance' | 'allergy' | null>(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [customItemInput, setCustomItemInput] = useState('');

  // Persist notes
  useEffect(() => {
    try {
      localStorage.setItem(`pr1me_context_notes_${client.id}`, JSON.stringify(notes));
    } catch (e) {}
  }, [notes, client.id]);

  // Persist workout preferences
  useEffect(() => {
    try {
      localStorage.setItem(`pr1me_workout_likes_${client.id}`, JSON.stringify(workoutLikes));
      localStorage.setItem(`pr1me_workout_dislikes_${client.id}`, JSON.stringify(workoutDislikes));
      localStorage.setItem(`pr1me_workout_pain_${client.id}`, JSON.stringify(workoutPain));
    } catch (e) {}
  }, [workoutLikes, workoutDislikes, workoutPain, client.id]);

  // Persist nutrition preferences
  useEffect(() => {
    try {
      localStorage.setItem(`pr1me_nutrition_likes_${client.id}`, JSON.stringify(nutritionLikes));
      localStorage.setItem(`pr1me_nutrition_dislikes_${client.id}`, JSON.stringify(nutritionDislikes));
      localStorage.setItem(`pr1me_nutrition_intol_${client.id}`, JSON.stringify(nutritionIntolerances));
      localStorage.setItem(`pr1me_nutrition_allergies_${client.id}`, JSON.stringify(nutritionAllergies));
    } catch (e) {}
  }, [nutritionLikes, nutritionDislikes, nutritionIntolerances, nutritionAllergies, client.id]);

  // Listen for global custom events to open/close context drawer
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('open-client-context-drawer', handleOpen);
    window.addEventListener('close-client-context-drawer', handleClose);
    window.addEventListener('toggle-client-context-drawer', handleToggle);
    return () => {
      window.removeEventListener('open-client-context-drawer', handleOpen);
      window.removeEventListener('close-client-context-drawer', handleClose);
      window.removeEventListener('toggle-client-context-drawer', handleToggle);
    };
  }, []);

  // Add Note handler
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote: NoteItem = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      date: 'Hoje',
      author: 'Carlos'
    };
    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Add Exercise handler
  const handleSelectExercise = (exerciseName: string) => {
    const finalName = exerciseModalCategory === 'pain' && painNoteInput.trim()
      ? `${exerciseName} (${painNoteInput.trim()})`
      : exerciseName;

    if (exerciseModalCategory === 'like') {
      if (!workoutLikes.includes(finalName)) setWorkoutLikes([...workoutLikes, finalName]);
    } else if (exerciseModalCategory === 'dislike') {
      if (!workoutDislikes.includes(finalName)) setWorkoutDislikes([...workoutDislikes, finalName]);
    } else if (exerciseModalCategory === 'pain') {
      if (!workoutPain.includes(finalName)) setWorkoutPain([...workoutPain, finalName]);
    }
    setExerciseModalCategory(null);
    setExerciseSearch('');
    setPainNoteInput('');
  };

  // Add Food handler
  const handleSelectFood = (foodName: string) => {
    if (foodModalCategory === 'like') {
      if (!nutritionLikes.includes(foodName)) setNutritionLikes([...nutritionLikes, foodName]);
    } else if (foodModalCategory === 'dislike') {
      if (!nutritionDislikes.includes(foodName)) setNutritionDislikes([...nutritionDislikes, foodName]);
    } else if (foodModalCategory === 'intolerance') {
      if (!nutritionIntolerances.includes(foodName)) setNutritionIntolerances([...nutritionIntolerances, foodName]);
    } else if (foodModalCategory === 'allergy') {
      if (!nutritionAllergies.includes(foodName)) setNutritionAllergies([...nutritionAllergies, foodName]);
    }
    setFoodModalCategory(null);
    setFoodSearch('');
    setCustomItemInput('');
  };

  const handleAddCustomItem = () => {
    if (!customItemInput.trim()) return;
    handleSelectFood(customItemInput.trim());
  };

  // Filtered exercises for modal
  const filteredExercises = useMemo(() => {
    return MOCK_EXERCISES_DB.filter(ex => 
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
    );
  }, [exerciseSearch]);

  // Filtered foods for modal
  const filteredFoods = useMemo(() => {
    return MOCK_FOODS.filter(f => 
      f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(foodSearch.toLowerCase())
    );
  }, [foodSearch]);

  // Calculate BMI
  const heightM = (client.height || 178) / 100;
  const weightKg = client.weight || 76.5;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  // Photos mock
  const clientPhotos = [
    { id: '1', label: 'Frente', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop', date: '15 Mar' },
    { id: '2', label: 'Costas', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop', date: '15 Mar' },
    { id: '3', label: 'Lateral', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop', date: '15 Mar' },
  ];

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* 1. FIXED TRIGGER TAB ON THE LEFT EDGE (APENAS ÍCONE DE UMA PESSOA)        */}
      {/* ========================================================================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 lg:left-20 xl:left-64 top-1/2 -translate-y-1/2 z-50 p-2 pl-1.5 rounded-r-2xl bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100 border-y-2 border-r-2 border-primary-500 shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_25px_rgba(14,165,233,0.35)] transition-all duration-300 hover:pl-2.5 hover:shadow-[0_4px_24px_rgba(14,165,233,0.4)] cursor-pointer group flex items-center justify-center"
          title={`Contexto de ${client.name}`}
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-200/80 dark:bg-primary-950/60 dark:text-primary-400 dark:border-primary-800/60 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 dark:group-hover:bg-primary-500 dark:group-hover:text-white dark:group-hover:border-primary-500 flex items-center justify-center shadow-xs transition-all duration-200">
            <User size={20} />
          </div>
        </button>
      )}

      {/* ========================================================================= */}
      {/* 2. SLIDE-OUT LATERAL CONTEXT DRAWER                                       */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs xl:hidden transition-opacity animate-fade-in"
        />
      )}

      {/* Drawer Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 lg:left-20 xl:left-64 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3 min-w-0">
            {client.avatar ? (
              <img 
                src={client.avatar} 
                alt={client.name} 
                className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0" 
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm shrink-0">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded-md">
                  Contexto do Cliente
                </span>
                <span className="text-[10px] text-slate-400">
                  {type === 'workout' ? 'Treino' : 'Nutrição'}
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-slate-800 dark:text-white truncate mt-0.5">
                {client.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Fechar Contexto"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">

          {/* --------------------------------------------------------------------- */}
          {/* SECTION A: PERFIL ESSENCIAL DO ATLETA                                 */}
          {/* --------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <User size={15} className="text-primary-500" />
                <span>Perfil & Dados Biométricos</span>
              </div>
              {isProfileOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
            </button>

            {isProfileOpen && (
              <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Idade</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">{client.age || 34} anos</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Género</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">{client.gender || 'Masculino'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Peso Atual</span>
                    <span className="text-xs font-black text-primary-600 dark:text-primary-400">{weightKg} kg</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Altura</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">{client.height || 178} cm</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 col-span-2 flex items-center justify-between px-3">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">IMC Atual</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{bmi} kg/m²</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Normal
                    </span>
                  </div>
                </div>

                {/* Current Target & Strategy Summary */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold mb-1">
                    <Sparkles size={13} />
                    <span>Foco do Acompanhamento:</span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-white">{client.objetivo || 'Perda de Massa Gorda'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{client.estrategia || 'Défice Calórico + Hipertrofia'}</p>
                </div>
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION B: NOTAS DO CLIENTE (CONSULTA & ADIÇÃO RÁPIDA)                 */}
          {/* --------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <StickyNote size={15} className="text-amber-500" />
                <span>Notas Rápidas ({notes.length})</span>
              </div>
              {isNotesOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
            </button>

            {isNotesOpen && (
              <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Input for new note */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Adicionar nota rápida..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                  >
                    + Adicionar
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {notes.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-2">Sem notas registadas.</p>
                  ) : (
                    notes.map(note => (
                      <div 
                        key={note.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 group relative"
                      >
                        <p className="text-xs text-slate-700 dark:text-slate-300 pr-5 leading-relaxed">{note.text}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                          <span>{note.date} • Por {note.author}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                            title="Eliminar nota"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION C (WORKOUT): PREFERÊNCIAS DE EXERCÍCIOS                       */}
          {/* --------------------------------------------------------------------- */}
          {type === 'workout' && (
            <div className="rounded-2xl border-2 border-primary-500/20 bg-white dark:bg-slate-800/90 overflow-hidden shadow-sm">
              <button
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white bg-primary-50/50 dark:bg-primary-950/30 hover:bg-primary-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Dumbbell size={15} className="text-primary-600 dark:text-primary-400" />
                  <span>Preferências de Exercícios</span>
                </div>
                {isPreferencesOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
              </button>

              {isPreferencesOpen && (
                <div className="p-4 space-y-4">
                  {/* 1: Exercícios que gosta */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <ThumbsUp size={13} />
                        <span>Exercícios que Gosta ({workoutLikes.length})</span>
                      </div>
                      <button
                        onClick={() => setExerciseModalCategory('like')}
                        className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {workoutLikes.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">Nenhum exercício selecionado</span>
                      ) : (
                        workoutLikes.map((ex, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50"
                          >
                            <span>{ex}</span>
                            <button 
                              onClick={() => setWorkoutLikes(workoutLikes.filter((_, i) => i !== idx))}
                              className="text-emerald-500 hover:text-emerald-700 ml-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 2: Exercícios que não gosta */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <ThumbsDown size={13} />
                        <span>Exercícios que Não Gosta ({workoutDislikes.length})</span>
                      </div>
                      <button
                        onClick={() => setExerciseModalCategory('dislike')}
                        className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {workoutDislikes.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">Nenhum exercício registado</span>
                      ) : (
                        workoutDislikes.map((ex, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50"
                          >
                            <span>{ex}</span>
                            <button 
                              onClick={() => setWorkoutDislikes(workoutDislikes.filter((_, i) => i !== idx))}
                              className="text-amber-500 hover:text-amber-700 ml-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 3: Exercícios que causam dor */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <AlertTriangle size={13} />
                        <span>Exercícios que Causam Dor ({workoutPain.length})</span>
                      </div>
                      <button
                        onClick={() => setExerciseModalCategory('pain')}
                        className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {workoutPain.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">Nenhum exercício com queixa de dor</span>
                      ) : (
                        workoutPain.map((ex, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60"
                          >
                            <span>{ex}</span>
                            <button 
                              onClick={() => setWorkoutPain(workoutPain.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-700 ml-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SECTION C (NUTRITION): PREFERÊNCIAS ALIMENTARES                       */}
          {/* --------------------------------------------------------------------- */}
          {type === 'nutrition' && (
            <div className="rounded-2xl border-2 border-emerald-500/20 bg-white dark:bg-slate-800/90 overflow-hidden shadow-sm">
              <button
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Apple size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Preferências Alimentares</span>
                </div>
                {isPreferencesOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
              </button>

              {isPreferencesOpen && (
                <div className="p-4 space-y-4">
                  {/* 1: Alimentos que gosta */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Heart size={13} />
                        <span>Alimentos que Gosta ({nutritionLikes.length})</span>
                      </div>
                      <button
                        onClick={() => setFoodModalCategory('like')}
                        className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {nutritionLikes.map((food, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50"
                        >
                          <span>{food}</span>
                          <button 
                            onClick={() => setNutritionLikes(nutritionLikes.filter((_, i) => i !== idx))}
                            className="text-emerald-500 hover:text-emerald-700 ml-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2: Alimentos que não gosta */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <X size={13} className="text-slate-400" />
                        <span>Alimentos que Não Gosta ({nutritionDislikes.length})</span>
                      </div>
                      <button
                        onClick={() => setFoodModalCategory('dislike')}
                        className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {nutritionDislikes.map((food, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                        >
                          <span>{food}</span>
                          <button 
                            onClick={() => setNutritionDislikes(nutritionDislikes.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-slate-600 ml-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3: Intolerâncias */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <AlertTriangle size={13} />
                        <span>Intolerâncias ({nutritionIntolerances.length})</span>
                      </div>
                      <button
                        onClick={() => setFoodModalCategory('intolerance')}
                        className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {nutritionIntolerances.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        >
                          <span>{item}</span>
                          <button 
                            onClick={() => setNutritionIntolerances(nutritionIntolerances.filter((_, i) => i !== idx))}
                            className="text-amber-500 hover:text-amber-700 ml-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4: Alergias */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <ShieldAlert size={13} />
                        <span>Alergias Alimentares ({nutritionAllergies.length})</span>
                      </div>
                      <button
                        onClick={() => setFoodModalCategory('allergy')}
                        className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {nutritionAllergies.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        >
                          <span>{item}</span>
                          <button 
                            onClick={() => setNutritionAllergies(nutritionAllergies.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 ml-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SECTION D (WORKOUT): PLANOS ATIVOS, CARDIO, CARGAS, FEEDBACK & FOTOS  */}
          {/* --------------------------------------------------------------------- */}
          {type === 'workout' && (
            <>
              {/* Planos de Treino Ativos */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setIsPlansOpen(!isPlansOpen)}
                  className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-primary-500" />
                    <span>Plano Ativo & Rotinas</span>
                  </div>
                  {isPlansOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                </button>

                {isPlansOpen && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 pt-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-800 dark:text-white">Plano Hipertrofia Fase 2</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Ativo</span>
                      </div>
                      <div className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px] mt-2">
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-700/40">
                          <span>Treino A - Peito, Tríceps & Ombros</span>
                          <strong className="text-slate-700 dark:text-slate-200">6 Exercícios</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-700/40">
                          <span>Treino B - Costas, Bíceps & Deltoide Post.</span>
                          <strong className="text-slate-700 dark:text-slate-200">5 Exercícios</strong>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Treino C - Quadríceps, Isquiotibiais & Gémeos</span>
                          <strong className="text-slate-700 dark:text-slate-200">7 Exercícios</strong>
                        </div>
                      </div>
                    </div>

                    {/* Cardio Context */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <Flame size={13} className="text-rose-500" /> Cardio Programado
                        </span>
                        <span className="text-[10px] text-slate-400">105 min/semana</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        3x 35 min Z2 (Corrida ou Passadeira inclinada). Última sessão há 1 dia.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Últimas Cargas & Feedback */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Flame size={15} className="text-blue-500" />
                    <span>Últimas Cargas & Feedback</span>
                  </div>
                  {isHistoryOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                </button>

                {isHistoryOpen && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center pt-2">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Supino</span>
                        <span className="font-black text-slate-800 dark:text-white">90 kg</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Agachamento</span>
                        <span className="font-black text-slate-800 dark:text-white">120 kg</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Peso Morto</span>
                        <span className="font-black text-slate-800 dark:text-white">140 kg</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 dark:text-white">Último Feedback de Treino</span>
                        <span className="text-[10px] font-bold text-emerald-600">RPE 8.5</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        "Treino A correu com excelente sensação de contração, sem dor no ombro."
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Fotos de Progresso */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setIsPhotosOpen(!isPhotosOpen)}
                  className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Eye size={15} className="text-purple-500" />
                    <span>Fotos de Evolução ({clientPhotos.length})</span>
                  </div>
                  {isPhotosOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                </button>

                {isPhotosOpen && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {clientPhotos.map(photo => (
                        <div 
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo.url)}
                          className="group relative rounded-xl overflow-hidden aspect-3/4 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
                        >
                          <img src={photo.url} alt={photo.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-1.5 text-white">
                            <span className="text-[10px] font-bold">{photo.label}</span>
                            <span className="text-[9px] opacity-75">{photo.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SECTION D (NUTRITION): PRESCRIÇÃO ATIVA, MACROS, REFEIÇÕES & REGISTOS */}
          {/* --------------------------------------------------------------------- */}
          {type === 'nutrition' && (
            <>
              {/* Prescrição / Plano de Nutrição Ativo */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setIsPlansOpen(!isPlansOpen)}
                  className="w-full p-3.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Apple size={15} className="text-emerald-500" />
                    <span>Prescrição & Refeições Ativas</span>
                  </div>
                  {isPlansOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                </button>

                {isPlansOpen && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 dark:text-white">Plano Hipertrofia 2.350 kcal</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Ativo</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5 text-center my-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Proteína</span>
                          <span className="block font-black text-slate-800 dark:text-white">180g</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Hidratos</span>
                          <span className="block font-black text-slate-800 dark:text-white">240g</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Gordura</span>
                          <span className="block font-black text-slate-800 dark:text-white">65g</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-700/40">
                          <span>Refeição 1: Papas de Aveia com Whey</span>
                          <strong className="text-slate-700 dark:text-slate-200">450 kcal</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-700/40">
                          <span>Refeição 2: Frango, Arroz & Legumes</span>
                          <strong className="text-slate-700 dark:text-slate-200">650 kcal</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-700/40">
                          <span>Refeição 3: Iogurte Grego, Nozes & Fruta</span>
                          <strong className="text-slate-700 dark:text-slate-200">380 kcal</strong>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Refeição 4: Salmão com Batata Doce</span>
                          <strong className="text-slate-700 dark:text-slate-200">620 kcal</strong>
                        </div>
                      </div>
                    </div>

                    {/* Hidratação & Suplementação */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 dark:text-white">Suplementação & Hidratação</span>
                        <span className="text-[10px] text-slate-400">2.8L Água / dia</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Creatina Creapure 5g/dia • Whey Isolate pós-treino • Multivitamínico matinal
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Acompanhamento {client.name.split(' ')[0]}
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Fechar Painel
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 3. MODAL DE SELEÇÃO DE EXERCÍCIOS (WORKOUT PREFERENCES)                    */}
      {/* ========================================================================= */}
      {exerciseModalCategory && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="font-black text-base text-slate-800 dark:text-white">
                  {exerciseModalCategory === 'like' && 'Adicionar Exercício que Gosta'}
                  {exerciseModalCategory === 'dislike' && 'Adicionar Exercício que Não Gosta'}
                  {exerciseModalCategory === 'pain' && 'Adicionar Exercício com Queixa de Dor'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Selecione a partir da biblioteca oficial de exercícios</p>
              </div>
              <button 
                onClick={() => { setExerciseModalCategory(null); setExerciseSearch(''); setPainNoteInput(''); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            {/* Pain Note field if category is pain */}
            {exerciseModalCategory === 'pain' && (
              <div className="px-5 pt-4">
                <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">
                  Local / Nota da dor (ex: Ombro direito, Lombar):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ombro direito ao bloquear"
                  value={painNoteInput}
                  onChange={(e) => setPainNoteInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Search */}
            <div className="p-5 pb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por exercício ou grupo muscular..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Exercises List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 custom-scrollbar">
              {filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex.name)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <Dumbbell size={16} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {ex.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {ex.muscleGroup}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>Selecionar</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL DE SELEÇÃO DE ALIMENTOS (NUTRITION PREFERENCES)                    */}
      {/* ========================================================================= */}
      {foodModalCategory && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="font-black text-base text-slate-800 dark:text-white">
                  {foodModalCategory === 'like' && 'Adicionar Alimento que Gosta'}
                  {foodModalCategory === 'dislike' && 'Adicionar Alimento que Não Gosta'}
                  {foodModalCategory === 'intolerance' && 'Adicionar Intolerância Alimentar'}
                  {foodModalCategory === 'allergy' && 'Adicionar Alergia Alimentar'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Selecione da lista de alimentos ou digite livremente</p>
              </div>
              <button 
                onClick={() => { setFoodModalCategory(null); setFoodSearch(''); setCustomItemInput(''); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            {/* Freeform input option */}
            <div className="px-5 pt-4">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Adicionar termo personalizado:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Marisco, Glúten, Leite de vaca..."
                  value={customItemInput}
                  onChange={(e) => setCustomItemInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleAddCustomItem}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Search from library */}
            <div className="p-5 pb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar alimentos da base de nutrição..."
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Foods List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 custom-scrollbar">
              {filteredFoods.map(f => (
                <div
                  key={f.id}
                  onClick={() => handleSelectFood(f.name)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <Apple size={16} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {f.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {f.category} • {f.calories} kcal / 100g
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>Selecionar</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative max-w-lg max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-700 animate-scale-in">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img src={selectedPhoto} alt="Evolução" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MAIN TAB CONTENT (WORKOUTS OR NUTRITION VIEW)                          */}
      {/* ========================================================================= */}
      <div className={`w-full transition-all duration-300 ease-in-out ${isOpen ? 'xl:pl-[420px]' : 'pl-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default ClientContextDrawer;
