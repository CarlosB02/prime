import React from 'react';
import { X, ExternalLink, Calendar, Tag, FileText, Video, PlayCircle } from 'lucide-react';
import { ContentItem } from '../../types';

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem | null;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  const isVideo = content.type === 'video';
  const isPDF = content.type === 'pdf';
  
  // Logic to determine action text
  const getActionText = () => {
    switch(content.type) {
        case 'video': return 'Ver no YouTube';
        case 'pdf': return 'Abrir Documento PDF';
        case 'article': return 'Ler Artigo Completo';
        case 'audio': return 'Ouvir Áudio';
        default: return 'Aceder ao Link';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
        >
            <X size={20} />
        </button>

        {/* Media Preview Section */}
        <div className={`w-full bg-slate-900 relative flex items-center justify-center ${isVideo ? 'aspect-video' : 'h-64'}`}>
            {isVideo ? (
                 <iframe 
                    width="100%" 
                    height="100%" 
                    src={content.url} 
                    title={content.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                 ></iframe>
            ) : (
                <div className="relative w-full h-full">
                    <img 
                        src={content.thumbnail} 
                        alt={content.title} 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col items-center justify-center">
                        {isPDF ? (
                            <FileText size={64} className="text-white/80 mb-4" />
                        ) : (
                             <ExternalLink size={64} className="text-white/80 mb-4" />
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold text-white text-center px-4 drop-shadow-lg">
                            {content.title}
                        </h2>
                    </div>
                </div>
            )}
        </div>

        {/* Info Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-900">
             <div className="flex flex-wrap items-center gap-3 mb-6">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5
                    ${content.type === 'video' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' : 
                      content.type === 'pdf' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50' :
                      'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50'
                    }
                 `}>
                    {content.type === 'video' && <Video size={12}/>}
                    {content.type === 'pdf' && <FileText size={12}/>}
                    {content.type}
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                    <Tag size={12} /> {content.category}
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Calendar size={12} /> {content.createdAt}
                 </span>
             </div>

             <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Sobre este conteúdo</h3>
                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                     {content.description}
                 </p>
             </div>

             <div className="flex items-center justify-center pt-6 border-t border-slate-100 dark:border-slate-800">
                 {!isVideo && (
                     <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 font-semibold"
                     >
                        <ExternalLink size={18} />
                        {getActionText()}
                     </a>
                 )}
                 {isVideo && (
                     <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium flex items-center gap-1 transition-colors"
                     >
                        Abrir no YouTube <ExternalLink size={14} />
                     </a>
                 )}
             </div>
        </div>

      </div>
    </div>
  );
};

export default ContentDetailModal;
