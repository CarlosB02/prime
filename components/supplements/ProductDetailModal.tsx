import React from 'react';
import { X, ExternalLink, ShieldCheck, Tag, Info } from 'lucide-react';
import { Supplement } from '../../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Supplement | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-fade-in-up flex flex-col md:flex-row h-[85vh] md:h-[600px]">
        
        {/* Close Button Mobile */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full md:hidden"
        >
            <X size={20} />
        </button>

        {/* Left Side: Product Image Showcase */}
        <div className="w-full md:w-2/5 bg-slate-50 dark:bg-slate-800/50 relative flex items-center justify-center p-8 border-r border-slate-100 dark:border-slate-800">
           <div className="relative w-full max-w-[250px] aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-black/30 p-4 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
              />
           </div>
           
           {/* Category Badge overlay */}
           <div className="absolute top-6 left-6">
             <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                {product.category}
             </span>
           </div>
        </div>

        {/* Right Side: Information */}
        <div className="w-full md:w-3/5 flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
               <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                    <Tag size={14} /> {product.brand}
                  </h3>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    {product.name}
                  </h2>
               </div>
               <button 
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden md:block"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h4 className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold mb-3">
                        <Info size={16} className="text-primary-500" />
                        Informação Técnica
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {product.description}
                    </p>
                </div>

                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                        <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Recomendação Profissional</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Este produto foi adicionado à base de dados para consulta técnica. Verifique sempre a lista de ingredientes atualizada no fornecedor oficial.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono hidden sm:inline-block truncate max-w-[200px]">
                    ID: {product.id}
                </span>
                <a 
                    href={product.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
                >
                    <ExternalLink size={18} />
                    Ver no Fornecedor
                </a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
