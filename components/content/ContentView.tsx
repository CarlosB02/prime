import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  FileText,
  Video,
  BookOpen,
  Mic,
  PlayCircle,
  Eye,
  File
} from 'lucide-react';
import { ContentItem, ContentType, ContentCategory } from '../../types';
import { MOCK_CONTENT, CONTENT_CATEGORIES, CONTENT_TYPES } from '../../constants';
import ContentModal from './ContentModal';
import ContentDetailModal from './ContentDetailModal';

const ContentView: React.FC = () => {
  // State
  const [contents, setContents] = useState<ContentItem[]>(MOCK_CONTENT);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [filterType, setFilterType] = useState<string>('Todos');
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // Handlers
  const handleAdd = () => {
    setSelectedContent(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedContent(item);
    setIsEditModalOpen(true);
  };

  const handleView = (item: ContentItem) => {
    setSelectedContent(item);
    setIsDetailModalOpen(true);
  };

  const handleSave = (data: Omit<ContentItem, 'id' | 'isDeleted' | 'createdAt'>) => {
    if (selectedContent && isEditModalOpen) {
      // Update existing
      setContents(prev => prev.map(item => 
        item.id === selectedContent.id ? { ...item, ...data } : item
      ));
    } else {
      // Create new
      const newContent: ContentItem = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0],
        isDeleted: false
      };
      setContents(prev => [newContent, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setContents(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDeleted: !item.isDeleted };
      }
      return item;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este conteúdo?')) {
      setContents(prev => prev.filter(item => item.id !== id));
    }
  };

  // Filter Logic
  const filteredContents = useMemo(() => {
    return contents.filter(item => {
        if (!showDeleted && item.isDeleted) return false;
        if (showDeleted && !item.isDeleted) return false;
        
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'Todos' || item.type === filterType;
        const matchesCategory = filterCategory === 'Todas' || item.category === filterCategory;
        
        return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [contents, searchQuery, showDeleted, filterType, filterCategory]);

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video': return <Video size={14} />;
      case 'article': return <BookOpen size={14} />;
      case 'pdf': return <File size={14} />;
      case 'audio': return <Mic size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getTypeStyles = (type: ContentType) => {
    switch(type) {
        case 'video': return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-900/50';
        case 'article': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
        case 'pdf': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
        case 'audio': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/50';
        default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200';
    }
  };

  const getActionButtonConfig = (type: ContentType) => {
      switch(type) {
          case 'video': return { label: 'Ver Vídeo', icon: PlayCircle };
          case 'pdf': return { label: 'Ver PDF', icon: Eye };
          case 'audio': return { label: 'Ouvir', icon: PlayCircle };
          default: return { label: 'Ler Artigo', icon: Eye };
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[240px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar conteúdos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
          
          <div className="flex gap-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none text-slate-600 dark:text-slate-300"
              >
                <option value="Todos">Todos os Tipos</option>
                {CONTENT_TYPES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>

              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none text-slate-600 dark:text-slate-300"
              >
                <option value="Todas">Todas as Categorias</option>
                {CONTENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setShowDeleted(!showDeleted)}
            className={`
              flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showDeleted 
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'}
            `}
          >
            <Trash2 size={16} />
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

      {/* Main List */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 hidden md:block text-center">ID</div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center">Capa</div>
          <div className="col-span-5 sm:col-span-5 md:col-span-4">Conteúdo</div>
          <div className="col-span-2 hidden lg:block">Categoria</div>
          <div className="col-span-3 hidden md:block text-center">Acesso</div>
          <div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-1 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <FileText size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem conteúdos encontrados</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Adicione vídeos, artigos ou documentos para a sua biblioteca de recursos.</p>
              <button onClick={handleAdd} className="mt-6 text-primary-600 font-medium hover:underline text-sm">Adicionar Conteúdo</button>
            </div>
          ) : (
            filteredContents.map((item) => {
              const ActionConfig = getActionButtonConfig(item.type);
              const ActionIcon = ActionConfig.icon;
              
              return (
                <div 
                    key={item.id} 
                    onClick={() => !item.isDeleted && handleEdit(item)}
                    className={`
                    group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                    ${item.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}
                    `}
                >
                    {/* ID */}
                    <div className="col-span-1 hidden md:block text-center">
                        <span className="text-xs font-mono text-slate-400">#{item.id}</span>
                    </div>

                    {/* Thumbnail */}
                    <div className="col-span-2 sm:col-span-2 md:col-span-1 flex justify-center">
                        <div className="w-16 aspect-video rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm relative group-hover:scale-105 transition-transform">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                                        <PlayCircle size={10} className="text-red-600 ml-0.5" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title & Info */}
                    <div className="col-span-5 sm:col-span-5 md:col-span-4">
                        <h3 
                            className="font-bold text-slate-800 dark:text-white text-sm sm:text-base truncate pr-2 transition-colors" 
                            title={item.title}
                        >
                            {item.title}
                        </h3>
                        <div className="flex flex-col items-start gap-1 mt-1">
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeStyles(item.type)}`}>
                                {getTypeIcon(item.type)} {item.type}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate w-full lg:hidden">
                                {item.description}
                            </span>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 hidden lg:flex flex-col justify-center">
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                             {item.createdAt}
                        </span>
                    </div>

                    {/* View Button (URL Replacement) */}
                    <div className="col-span-3 hidden md:flex justify-center">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleView(item); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow hover:border-primary-300 dark:hover:border-primary-700 transition-all group/btn"
                        >
                            <ActionIcon size={14} className="text-primary-500 group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover/btn:text-primary-600 dark:group-hover/btn:text-primary-400">
                                {ActionConfig.label}
                            </span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-1 flex justify-end items-center gap-2">
                        {item.isDeleted ? (
                            <>
                                <button 
                                onClick={(e) => { e.stopPropagation(); toggleDelete(item.id); }}
                                title="Restaurar"
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                <RotateCcw size={16} />
                                </button>
                                <button 
                                onClick={(e) => { e.stopPropagation(); handleDeletePermanent(item.id); }}
                                title="Eliminar Permanentemente"
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                <Trash2 size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                >
                                <Edit2 size={16} />
                                </button>
                                <button 
                                onClick={(e) => { e.stopPropagation(); toggleDelete(item.id); }}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                <Trash2 size={16} />
                                </button>
                                {/* Mobile View Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleView(item); }}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors md:hidden"
                                >
                                  <Eye size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A mostrar {filteredContents.length} resultados
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 transition-colors">1</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Seguinte</button>
          </div>
        </div>
      </div>

      <ContentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={selectedContent}
      />

      <ContentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        content={selectedContent}
      />
    </div>
  );
};

export default ContentView;
