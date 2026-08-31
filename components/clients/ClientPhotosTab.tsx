import React, { useState } from 'react';
import { 
  Camera,
  X,
  Maximize2,
  RotateCw,
  Move,
  Columns
} from 'lucide-react';

export interface Metric {
  name: string;
  value: number;
  unit: string;
}

export interface Photo {
  position?: 'Frente' | 'Lado Esquerdo' | 'Lado Direito' | 'Costas';
  url: string;
  id?: string;
  date?: string;
  label?: string;
}

export interface Question {
  question: string;
  answer: string;
}

export interface Evaluation {
  id: string;
  date: string;
  status: 'Validada' | 'Em progresso' | 'Pendente';
  weight: number;
  weightVariation: number;
  observations: string;
  metrics: Metric[];
  photos: Photo[];
  questions: Question[];
}

const MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: '1',
    date: '2026-07-04',
    status: 'Validada',
    weight: 75.5,
    weightVariation: -1.2,
    observations: 'Cliente muito focado, boa evolução e perda de massa gorda visível.',
    metrics: [
      { name: 'Peso (em jejum)', value: 75.5, unit: 'kg' },
      { name: 'Cintura', value: 82, unit: 'cm' },
      { name: 'Anca', value: 95, unit: 'cm' },
      { name: 'Coxa', value: 55, unit: 'cm' },
      { name: 'Braço', value: 32, unit: 'cm' },
      { name: 'Gémeo', value: 38, unit: 'cm' },
    ],
    photos: [
      { position: 'Frente', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop' },
      { position: 'Lado Direito', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop' },
      { position: 'Lado Esquerdo', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
      { position: 'Costas', url: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=800&auto=format&fit=crop' },
    ],
    questions: [
      { question: 'Como te sentiste esta semana?', answer: 'Com muita energia e sem fome.' },
      { question: 'Qualidade do sono (1-5)?', answer: '4' },
      { question: 'Dificuldades no plano alimentar?', answer: 'Apenas no fim de semana.' },
    ]
  },
  {
    id: '2',
    date: '2026-06-04',
    status: 'Validada',
    weight: 76.7,
    weightVariation: -2.0,
    observations: 'Início de nova fase metabólica. Retenção de líquidos a diminuir.',
    metrics: [
      { name: 'Peso (em jejum)', value: 76.7, unit: 'kg' },
      { name: 'Cintura', value: 84, unit: 'cm' },
      { name: 'Anca', value: 97, unit: 'cm' },
      { name: 'Coxa', value: 56, unit: 'cm' },
      { name: 'Braço', value: 32.5, unit: 'cm' },
      { name: 'Gémeo', value: 38.5, unit: 'cm' },
    ],
    photos: [
      { position: 'Frente', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
      { position: 'Lado Direito', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop' },
      { position: 'Lado Esquerdo', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop' },
      { position: 'Costas', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
    ],
    questions: [
      { question: 'Como te sentiste esta semana?', answer: 'Motivado para começar.' },
      { question: 'Qualidade do sono (1-5)?', answer: '3' },
      { question: 'Dificuldades no plano alimentar?', answer: 'Nenhuma ainda.' },
    ]
  }
];

// Interactive Photo Viewer
const PhotoViewer = ({ photo, date }: { photo: Photo, date: string }) => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`relative group ${isFullscreen ? 'fixed inset-4 z-50 bg-black/90 rounded-3xl p-8 flex items-center justify-center' : 'w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800'}`}>
      {isFullscreen && (
        <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50">
          <X size={24} />
        </button>
      )}
      
      <img 
        src={photo.url} 
        alt={photo.position} 
        className={`object-cover transition-transform duration-300 origin-center ${isFullscreen ? 'max-w-full max-h-full object-contain rounded-lg' : 'w-full h-full'}`}
        style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold z-10">
        {date}
      </div>

      {/* Tools Overlay */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-black/60 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isFullscreen ? 'scale-125 bottom-8' : ''}`}>
        <button onClick={() => setScale(s => Math.min(s + 0.25, 3))} className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors" title="Zoom In">
          <Move size={16} />
        </button>
        <button onClick={() => setRotation(r => r + 90)} className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors" title="Rodar 90°">
          <RotateCw size={16} />
        </button>
        {!isFullscreen && (
          <button onClick={() => setIsFullscreen(true)} className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors" title="Expandir">
            <Maximize2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export const PhotoComparison: React.FC<{ photo1: {url: string, date?: string, label?: string}; photo2: {url: string, date?: string, label?: string} }> = ({ photo1, photo2 }) => {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', stopDragging);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] rounded-3xl overflow-hidden select-none cursor-ew-resize bg-slate-100 dark:bg-slate-800"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* Photo 2 (Background / After) */}
      <div className="absolute inset-0">
        <img src={photo2.url} alt={photo2.label || 'Depois'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        {photo2.date && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            {photo2.date}
          </div>
        )}
      </div>

      {/* Photo 1 (Foreground / Before) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={photo1.url} 
          alt={photo1.label || 'Antes'} 
          className="absolute inset-0 w-full h-full object-cover max-w-none" 
          style={{ width: containerRef.current?.offsetWidth || '100vw' }}
          referrerPolicy="no-referrer"
        />
        {photo1.date && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            {photo1.date}
          </div>
        )}
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Columns size={16} className="text-slate-800" />
        </div>
      </div>
    </div>
  );
};

export const ClientPhotosTab: React.FC = () => {
  const [evaluations] = useState<Evaluation[]>(MOCK_EVALUATIONS);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Camera className="text-primary-500" /> Galeria de Fotos
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consulte a evolução fotográfica do cliente.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all text-sm">
          Adicionar Fotos
        </button>
      </div>

      <div className="space-y-12 mt-8">
        {evaluations.map((ev) => (
          <div key={ev.id} className="space-y-4">
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
              {ev.date}
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {ev.photos.map(p => (
                <div key={p.position} className="space-y-2">
                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-300 text-center">{p.position}</span>
                  <PhotoViewer photo={p} date={ev.date} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPhotosTab;
