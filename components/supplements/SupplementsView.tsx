import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Pill,
  ExternalLink,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { Supplement, SupplementCategory } from '../../types';
import { MOCK_SUPPLEMENTS, SUPPLEMENT_CATEGORIES } from '../../constants';
import SupplementModal from './SupplementModal';
import ProductDetailModal from './ProductDetailModal';

const SupplementsView: React.FC = () => {
  // State
  const [supplements, setSupplements] = useState<Supplement[]>(MOCK_SUPPLEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);

  // Handlers
  const handleAdd = () => {
    setSelectedSupplement(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (supp: Supplement) => {
    setSelectedSupplement(supp);
    setIsEditModalOpen(true);
  };

  const handleViewProduct = (supp: Supplement) => {
    setSelectedSupplement(supp);
    setIsProductModalOpen(true);
  };

  const handleSave = (data: Omit<Supplement, 'id' | 'isDeleted'>) => {
    if (selectedSupplement && isEditModalOpen) {
      // Update existing
      setSupplements(prev => prev.map(item => 
        item.id === selectedSupplement.id ? { ...item, ...data } : item
      ));
    } else {
      // Create new
      const newSupplement: Supplement = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        isDeleted: false
      };
      setSupplements(prev => [newSupplement, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setSupplements(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDeleted: !item.isDeleted };
      }
      return item;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este suplemento?')) {
      setSupplements(prev => prev.filter(item => item.id !== id));
    }
  };

  // Filter Logic
  const filteredSupplements = useMemo(() => {
    return supplements.filter(item => {
        if (!showDeleted && item.isDeleted) return false;
        if (showDeleted && !item.isDeleted) return false;
        
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || item.category === filterCategory;
        
        return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [supplements, searchQuery, showDeleted, filterCategory]);

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
              placeholder="Pesquisar por nome ou marca..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
          
          <div className="relative min-w-[200px]">
             <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none text-slate-600 dark:text-slate-300"
              >
                <option value="Todos">Todas as Categorias</option>
                {SUPPLEMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setShowDeleted(!showDeleted)}
            className={`flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showDeleted 
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'}`}
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

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 hidden md:block text-center">ID</div>
          <div className="col-span-2 sm:col-span-1 text-center">Img</div>
          <div className="col-span-5 sm:col-span-4 md:col-span-3">Suplemento</div>
          <div className="col-span-4 hidden md:block">Descrição</div>
          <div className="col-span-2 hidden lg:block text-center">Produto</div>
          <div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-1 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredSupplements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Pill size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem suplementos encontrados</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Adicione suplementos à sua lista para recomendar aos seus clientes.</p>
              <button onClick={handleAdd} className="mt-6 text-primary-600 font-medium hover:underline text-sm">Adicionar Suplemento</button>
            </div>
          ) : (
            filteredSupplements.map((supp) => (
              <div 
                key={supp.id} 
                onClick={() => !supp.isDeleted && handleEdit(supp)}
                className={`group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50
                  ${supp.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}`}
              >
                {/* ID */}
                <div className="col-span-1 hidden md:block text-center">
                  <span className="text-xs font-mono text-slate-400">#{supp.id}</span>
                </div>

                {/* Image */}
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-1">
                    <img src={supp.image} alt={supp.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                </div>

                {/* Name & Brand */}
                <div className="col-span-5 sm:col-span-4 md:col-span-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate pr-2" title={supp.name}>
                    {supp.name}
                  </h3>
                  <div className="flex flex-col items-start gap-1 mt-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Tag size={10} /> {supp.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/50">
                        {supp.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-4 hidden md:block">
                     <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {supp.description}
                     </p>
                </div>

                {/* Product Badge */}
                <div className="col-span-2 hidden lg:flex justify-center">
                    <button 
                        onClick={() => handleViewProduct(supp)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow hover:border-primary-300 dark:hover:border-primary-700 transition-all group/btn"
                    >
                        <ShoppingBag size={14} className="text-slate-400 group-hover/btn:text-primary-500 transition-colors" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover/btn:text-primary-600 dark:group-hover/btn:text-primary-400">
                            Ver Produto
                        </span>
                    </button>
                </div>

                {/* Actions */}
                <div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-1 flex justify-end items-center gap-2">
                   {supp.isDeleted ? (
                     <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleDelete(supp.id); }}
                          title="Restaurar"
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeletePermanent(supp.id); }}
                          title="Eliminar Permanentemente"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </>
                   ) : (
                     <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(supp); }}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => toggleDelete(supp.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        {/* Mobile View Product Button - Visible only on small screens via CSS/Logic */}
                        <button 
                          onClick={() => handleViewProduct(supp)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors lg:hidden"
                        >
                          <ExternalLink size={18} />
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
            A mostrar {filteredSupplements.length} resultados
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 transition-colors">1</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Seguinte</button>
          </div>
        </div>
      </div>

      <SupplementModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={selectedSupplement}
      />

      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedSupplement}
      />
    </div>
  );
};

export default SupplementsView;
