import React, { useState, useEffect, useMemo } from 'react';
import { X, StickyNote, Plus, Trash2, Clock, Search, Filter } from 'lucide-react';
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
    content: 'Cliente reportou dor ligeira no ombro esquerdo durante o press militar. Adaptar próximo treino para focar em mobilidade escapular e rotação externa.',
    date: '15 Mar 2024',
    time: '14:30',
    color: 'rose'
  },
  {
    id: '2',
    content: 'Atingiu a meta de ingestão de água diária (3L) durante toda a semana. Excelente adesão ao plano de suplementação matinal.',
    date: '10 Mar 2024',
    time: '09:15',
    color: 'green'
  },
  {
    id: '3',
    content: 'Lembrar de perguntar sobre a qualidade do sono e recuperação muscular na próxima avaliação de bioimpedância.',
    date: '05 Mar 2024',
    time: '18:45',
    color: 'yellow'
  }
];

const COLOR_MAP: Record<Note['color'], {
  id: Note['color'];
  name: string;
  leftBorder: string;
  badgeBg: string;
  badgeText: string;
  dotBg: string;
  cardBg: string;
}> = {
  yellow: {
    id: 'yellow',
    name: 'Geral',
    leftBorder: 'border-l-amber-400 dark:border-l-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    dotBg: 'bg-amber-400',
    cardBg: 'hover:bg-amber-50/20 dark:hover:bg-amber-950/10'
  },
  blue: {
    id: 'blue',
    name: 'Treino',
    leftBorder: 'border-l-blue-400 dark:border-l-blue-500',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    dotBg: 'bg-blue-400',
    cardBg: 'hover:bg-blue-50/20 dark:hover:bg-blue-950/10'
  },
  green: {
    id: 'green',
    name: 'Nutrição',
    leftBorder: 'border-l-emerald-400 dark:border-l-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    dotBg: 'bg-emerald-400',
    cardBg: 'hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10'
  },
  rose: {
    id: 'rose',
    name: 'Atenção',
    leftBorder: 'border-l-rose-400 dark:border-l-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    dotBg: 'bg-rose-400',
    cardBg: 'hover:bg-rose-50/20 dark:hover:bg-rose-950/10'
  },
  purple: {
    id: 'purple',
    name: 'Avaliação',
    leftBorder: 'border-l-purple-400 dark:border-l-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    dotBg: 'bg-purple-400',
    cardBg: 'hover:bg-purple-50/20 dark:hover:bg-purple-950/10'
  }
};

const COLOR_OPTIONS: Note['color'][] = ['yellow', 'blue', 'green', 'rose', 'purple'];

const ClientNotesModal: React.FC<ClientNotesModalProps> = ({ isOpen, onClose, client }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined' && client?.id) {
      const saved = localStorage.getItem(`client_notes_${client.id}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return MOCK_NOTES;
  });

  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<Note['color']>('yellow');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState<string>('all');

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && client?.id) {
      localStorage.setItem(`client_notes_${client.id}`, JSON.stringify(notes));
    }
  }, [notes, client?.id]);

  // Filtered notes list
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = searchQuery.trim() === '' || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesColor = filterColor === 'all' || n.color === filterColor;
      return matchesSearch && matchesColor;
    });
  }, [notes, searchQuery, filterColor]);

  if (!isOpen) return null;

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const now = new Date();
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content: newNoteContent.trim(),
      date: now.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      color: selectedColor
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
              <StickyNote size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Notas do Cliente</h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                  {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {client.name}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar nas notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Color Filter */}
            {notes.length > 0 && (
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
              >
                <option value="all">Todas as cores</option>
                {COLOR_OPTIONS.map(c => (
                  <option key={c} value={c}>{COLOR_MAP[c].name}</option>
                ))}
              </select>
            )}

            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={14} />
                <span>Nova Nota</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40 dark:bg-slate-900/20 space-y-4">
          
          {/* New Note Form */}
          {isAdding && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4.5 border-2 border-primary-500/30 shadow-lg shadow-primary-500/5 animate-fade-in">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nova Nota</span>
                <span className="text-[11px] text-slate-400">Escolha a categoria</span>
              </div>

              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Escreva a nota sobre o cliente..."
                className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl resize-none outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm leading-relaxed"
                autoFocus
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5">
                  {COLOR_OPTIONS.map(col => {
                    const cfg = COLOR_MAP[col];
                    const isSelected = selectedColor === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? `${cfg.badgeBg} ${cfg.badgeText} ring-2 ring-primary-500 shadow-xs` 
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70'
                        }`}
                        title={cfg.name}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dotBg}`} />
                        <span>{cfg.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setNewNoteContent('');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAddNote}
                    disabled={!newNoteContent.trim()}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes List (Exibição em Lista Vertical) */}
          <div className="flex flex-col gap-3">
            {filteredNotes.map((note) => {
              const cfg = COLOR_MAP[note.color] || COLOR_MAP.yellow;
              
              return (
                <div 
                  key={note.id} 
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all relative group flex flex-col gap-2.5 border-l-4 ${cfg.leftBorder} ${cfg.cardBg}`}
                >
                  {/* Top Bar of Note */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${cfg.badgeBg} ${cfg.badgeText}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotBg}`} />
                        {cfg.name}
                      </span>

                      {/* Date & Time */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        <CustomCalendarIcon size={12} className="text-slate-400" />
                        {note.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        <Clock size={11} className="text-slate-400" />
                        {note.time}
                      </span>
                    </div>
                    
                    {/* Delete action */}
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                      title="Eliminar nota"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Note Content */}
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-normal whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredNotes.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
                <StickyNote size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                {searchQuery || filterColor !== 'all' ? 'Nenhuma nota encontrada' : 'Sem notas'}
              </h3>
              <p className="text-slate-400 max-w-xs mt-1 text-xs">
                {searchQuery || filterColor !== 'all'
                  ? 'Tente ajustar os termos de pesquisa ou o filtro de categoria.'
                  : 'Ainda não adicionou nenhuma nota para este cliente.'}
              </p>
              {!isAdding && !searchQuery && filterColor === 'all' && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Criar primeira nota
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientNotesModal;
