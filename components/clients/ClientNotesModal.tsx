import React, { useState } from 'react';
import { X, StickyNote, Plus, Trash2, Clock } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { Client } from '../../types';

interface ClientNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

interface Note {
  id: string;
  content: string;
  date: string;
  time: string;
  color: 'yellow' | 'blue' | 'green' | 'rose' | 'purple';
}

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    content: 'Cliente reportou dor ligeira no ombro esquerdo durante o press militar. Adaptar próximo treino para focar em mobilidade.',
    date: '15 Mar 2024',
    time: '14:30',
    color: 'rose'
  },
  {
    id: '2',
    content: 'Atingiu a meta de ingestão de água diária (3L) durante toda a semana. Excelente progresso!',
    date: '10 Mar 2024',
    time: '09:15',
    color: 'green'
  },
  {
    id: '3',
    content: 'Lembrar de perguntar sobre a qualidade do sono na próxima avaliação.',
    date: '05 Mar 2024',
    time: '18:45',
    color: 'yellow'
  }
];

const COLORS = [
  { id: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800/50', text: 'text-yellow-800 dark:text-yellow-200', hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50' },
  { id: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/50', text: 'text-blue-800 dark:text-blue-200', hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/50' },
  { id: 'green', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800/50', text: 'text-emerald-800 dark:text-emerald-200', hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/50' },
  { id: 'rose', bg: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800/50', text: 'text-rose-800 dark:text-rose-200', hover: 'hover:bg-rose-200 dark:hover:bg-rose-900/50' },
  { id: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800/50', text: 'text-purple-800 dark:text-purple-200', hover: 'hover:bg-purple-200 dark:hover:bg-purple-900/50' },
] as const;

const ClientNotesModal: React.FC<ClientNotesModalProps> = ({ isOpen, onClose, client }) => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<Note['color']>('yellow');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const now = new Date();
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content: newNoteContent,
      date: now.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      color: selectedColor
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
              <StickyNote size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Notas do Cliente</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {client.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20">
          
          {/* Add Note Section */}
          <div className="mb-8">
            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-medium hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Nova Nota
              </button>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/20 dark:shadow-none animate-fade-in">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Escreva a sua nota aqui..."
                  className="w-full h-32 bg-transparent border-none resize-none outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-base leading-relaxed"
                  autoFocus
                />
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.id as Note['color'])}
                        className={`w-6 h-6 rounded-full ${c.bg} border-2 transition-transform ${selectedColor === c.id ? 'border-slate-400 dark:border-slate-500 scale-125' : 'border-transparent hover:scale-110'}`}
                        title={`Cor ${c.id}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setIsAdding(false);
                        setNewNoteContent('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleAddNote}
                      disabled={!newNoteContent.trim()}
                      className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md shadow-primary-500/20"
                    >
                      Guardar Nota
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Grid (Masonry-like layout using columns) */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {notes.map((note) => {
              const colorConfig = COLORS.find(c => c.id === note.color) || COLORS[0];
              
              return (
                <div 
                  key={note.id} 
                  className={`break-inside-avoid rounded-2xl p-5 border ${colorConfig.bg} ${colorConfig.border} shadow-sm group relative transition-all hover:shadow-md`}
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${colorConfig.text} opacity-70`}>
                        <CustomCalendarIcon size={12} />
                        {note.date}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${colorConfig.text} opacity-70`}>
                        <Clock size={12} />
                        {note.time}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className={`p-1.5 rounded-lg  ${colorConfig.hover} ${colorConfig.text}`}
                      title="Eliminar nota"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Note Content */}
                  <p className={`text-sm leading-relaxed ${colorConfig.text} font-medium whitespace-pre-wrap`}>
                    {note.content}
                  </p>
                  
                  {/* Decorative fold effect */}
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-t border-l rounded-tl-lg ${colorConfig.border} bg-white/40 dark:bg-black/20`} />
                </div>
              );
            })}
          </div>

          {notes.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <StickyNote size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem notas</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Ainda não adicionou nenhuma nota para este cliente.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientNotesModal;
