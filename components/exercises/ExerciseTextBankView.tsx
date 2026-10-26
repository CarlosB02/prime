import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Edit2, 
  Trash2, 
  Copy, 
  Check, 
  X,
  FolderOpen,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { 
  ExerciseTextSnippet, 
  getTextSnippets, 
  saveTextSnippets 
} from '../../lib/exerciseTextBank';

const CATEGORIES = [
  'Todos',
  'Postura & Core',
  'Execução',
  'Cadência & Ritmo',
  'Respiração',
  'Intensidade',
  'Geral'
];

const ExerciseTextBankView: React.FC = () => {
  const [snippets, setSnippets] = useState<ExerciseTextSnippet[]>(() => getTextSnippets());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<ExerciseTextSnippet | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Execução');
  const [formContent, setFormContent] = useState('');

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingSnippet(null);
    setFormTitle('');
    setFormCategory('Execução');
    setFormContent('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (snippet: ExerciseTextSnippet) => {
    setEditingSnippet(snippet);
    setFormTitle(snippet.title);
    setFormCategory(snippet.category);
    setFormContent(snippet.content);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar este texto?')) {
      const updated = snippets.filter(s => s.id !== id);
      setSnippets(updated);
      saveTextSnippets(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    let updated: ExerciseTextSnippet[];
    if (editingSnippet) {
      const edited: ExerciseTextSnippet = {
        ...editingSnippet,
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim()
      };
      updated = snippets.map(s => s.id === edited.id ? edited : s);
    } else {
      const newSnippet: ExerciseTextSnippet = {
        id: Date.now().toString(),
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      updated = [newSnippet, ...snippets];
    }

    setSnippets(updated);
    saveTextSnippets(updated);
    setIsModalOpen(false);
  };

  const handleCopy = (snippet: ExerciseTextSnippet) => {
    navigator.clipboard.writeText(snippet.content);
    setCopiedId(snippet.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Todos' || snippet.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar textos ou palavras-chave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Toggle Linha vs Quadrado */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Visualização em Quadrados"
            >
              <LayoutGrid size={15} />
              <span>Quadrado</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Visualização em Linha"
            >
              <LayoutList size={15} />
              <span>Linha</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-medium text-sm transition-all shadow-lg shadow-primary-500/25 shrink-0"
          >
            <Plus size={18} />
            <span>Novo Texto</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid or Line of Texts */}
      {filteredSnippets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <FolderOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Nenhum texto encontrado
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {searchQuery 
              ? 'Nenhum resultado corresponde à sua pesquisa. Tente usar outros termos.' 
              : 'Ainda não adicionou nenhum texto a esta categoria.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 text-sm font-semibold text-primary-500 hover:underline flex items-center gap-1"
          >
            <Plus size={16} /> Adicionar texto agora
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 flex flex-col hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm hover:shadow-md group"
            >
              {/* Header with category and actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40">
                  {snippet.category}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(snippet)}
                    title={copiedId === snippet.id ? "Texto copiado!" : "Copiar texto"}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      copiedId === snippet.id
                        ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {copiedId === snippet.id ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(snippet)}
                    title="Editar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(snippet.id)}
                    title="Eliminar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-bold text-base text-slate-800 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                {snippet.title}
              </h4>

              {/* Content snippet */}
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
                {snippet.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Linha (List) view */
        <div className="flex flex-col gap-3">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-xs hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40 shrink-0">
                    {snippet.category}
                  </span>
                  <h4 className="font-bold text-base text-slate-800 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                    {snippet.title}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-2">
                  {snippet.content}
                </p>
              </div>

              {/* Actions on the right */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 w-full lg:w-auto justify-end">
                <button
                  onClick={() => handleCopy(snippet)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    copiedId === snippet.id
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white border border-primary-200/50 dark:border-primary-800/40'
                  }`}
                  title="Copiar texto"
                >
                  {copiedId === snippet.id ? (
                    <>
                      <Check size={14} />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(snippet)}
                  title="Editar"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDelete(snippet.id)}
                  title="Eliminar"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-500 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {editingSnippet ? 'Editar Texto' : 'Novo Texto para Banco'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Guarde orientações e notas para aplicar nos treinos e exercícios
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Título / Nome da Orientação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Controlo da fase excêntrica"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Categoria
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="Postura & Core">Postura & Core</option>
                  <option value="Execução">Execução</option>
                  <option value="Cadência & Ritmo">Cadência & Ritmo</option>
                  <option value="Respiração">Respiração</option>
                  <option value="Intensidade">Intensidade</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Conteúdo do Texto *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escreva a descrição, instrução técnica ou nota detalhada..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-medium text-sm transition-all shadow-md shadow-primary-500/20"
                >
                  {editingSnippet ? 'Guardar Alterações' : 'Criar Texto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExerciseTextBankView;
