import React, { useState } from 'react';
import { X, Calendar, Camera, FileText, MessageSquare, History, Plus, Image as ImageIcon } from 'lucide-react';
import { Photo, PhotoComparison } from './ClientPhotosTab';

export interface AssessmentData {
  id?: string;
  date: string;
  status: 'validado' | 'em_progresso' | 'concluido';
  measures: {
    ombros: string;
    peitoral: string;
    bracoDir: string;
    bracoEsq: string;
    cintura: string;
    abdomen: string;
    anca: string;
    coxaDir: string;
    coxaEsq: string;
    gemeoDir: string;
    gemeoEsq: string;
  };
  weight?: number;
  weightVariation?: number;
  cinturaVariation?: number;
  questions: string;
  trainerFeedback: string;
  photos: Photo[];
}

interface ClientAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'view';
  initialData?: AssessmentData;
  previousData?: AssessmentData; // for comparison
}

const DEFAULT_MEASURES = {
  ombros: '', peitoral: '', bracoDir: '', bracoEsq: '',
  cintura: '', abdomen: '', anca: '', coxaDir: '',
  coxaEsq: '', gemeoDir: '', gemeoEsq: ''
};

export const ClientAssessmentModal: React.FC<ClientAssessmentModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  initialData,
  previousData
}) => {
  const isViewMode = mode === 'view';
  
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [measures, setMeasures] = useState(initialData?.measures || DEFAULT_MEASURES);
  const [questions, setQuestions] = useState(initialData?.questions || '');
  const [trainerFeedback, setTrainerFeedback] = useState(initialData?.trainerFeedback || '');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  
  // For comparison mode
  const [isComparingPhotos, setIsComparingPhotos] = useState(false);

  if (!isOpen) return null;

  const handleMeasureChange = (key: keyof typeof measures, value: string) => {
    setMeasures(prev => ({ ...prev, [key]: value }));
  };

  const measureFields = [
    { key: 'ombros', label: 'Ombros' },
    { key: 'peitoral', label: 'Peitoral' },
    { key: 'bracoDir', label: 'Braço Dir.' },
    { key: 'bracoEsq', label: 'Braço Esq.' },
    { key: 'cintura', label: 'Cintura' },
    { key: 'abdomen', label: 'Abdómen' },
    { key: 'anca', label: 'Anca' },
    { key: 'coxaDir', label: 'Coxa Dir.' },
    { key: 'coxaEsq', label: 'Coxa Esq.' },
    { key: 'gemeoDir', label: 'Gémeo Dir.' },
    { key: 'gemeoEsq', label: 'Gémeo Esq.' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {isViewMode ? 'Visualizar Avaliação' : 'Adicionar Avaliação'}
              </h2>
              {isViewMode && initialData?.status && (
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded ${
                  initialData.status === 'validado' ? 'bg-emerald-100 text-emerald-700' :
                  initialData.status === 'em_progresso' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {initialData.status === 'validado' ? 'Validado' :
                   initialData.status === 'em_progresso' ? 'Por fazer (em progresso)' :
                   'Por fazer (concluído)'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isViewMode && previousData && (
              <button 
                onClick={() => setIsComparingPhotos(!isComparingPhotos)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                <History size={16} />
                {isComparingPhotos ? 'Ocultar Comparação' : 'Comparar com a última'}
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Data and Peso */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500"/> Data da Avaliação
              </h3>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isViewMode}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white disabled:opacity-70"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Plus size={16} className="text-emerald-500"/> Peso (kg)
              </h3>
              <div className="relative">
                <input 
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white disabled:opacity-70"
                  placeholder="0.0"
                />
                {isViewMode && isComparingPhotos && previousData?.weight && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold">
                    {(() => {
                        const current = parseFloat(weight) || 0;
                        const prev = previousData.weight || 0;
                        const diff = current - prev;
                        if (diff > 0) return <span className="text-rose-500">+{diff.toFixed(1)} kg</span>;
                        if (diff < 0) return <span className="text-emerald-500">{diff.toFixed(1)} kg</span>;
                        return null;
                    })()}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Medidas (Tabela / Grid) */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Plus size={16} className="text-emerald-500"/> Medidas (cm)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              {measureFields.map(field => (
                <div key={field.key} className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{field.label}</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={measures[field.key]}
                      onChange={(e) => handleMeasureChange(field.key, e.target.value)}
                      disabled={isViewMode}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-70"
                      placeholder="0.0"
                    />
                    {isViewMode && isComparingPhotos && previousData && (
                      <div className="mt-1 text-[10px] font-bold">
                        {(() => {
                           const current = parseFloat(measures[field.key]) || 0;
                           const prev = parseFloat(previousData.measures[field.key]) || 0;
                           const diff = current - prev;
                           if (diff > 0) return <span className="text-rose-500">+{diff.toFixed(1)} cm</span>;
                           if (diff < 0) return <span className="text-emerald-500">{diff.toFixed(1)} cm</span>;
                           return <span className="text-slate-400">Sem variação</span>;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fotos */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Camera size={16} className="text-purple-500"/> Fotos
            </h3>
            
            {isComparingPhotos && isViewMode && initialData?.photos?.[0] && previousData?.photos?.[0] ? (
              <div className="mt-4 animate-fade-in">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Comparação (Frente)</p>
                <PhotoComparison 
                  photo1={previousData.photos[0]} 
                  photo2={initialData.photos[0]} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isViewMode ? (
                  initialData?.photos?.map((photo, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={photo.url} alt="Foto" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )) || <p className="text-sm text-slate-500">Sem fotos anexadas.</p>
                ) : (
                  <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-400 group">
                    <ImageIcon size={32} className="group-hover:text-primary-500 mb-2" />
                    <span className="text-xs font-medium">Adicionar Foto</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Perguntas */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-500"/> Perguntas (Submetidas pelo cliente)
            </h3>
            <textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              disabled={isViewMode}
              rows={4}
              placeholder="Perguntas ou detalhes adicionais..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm disabled:opacity-70"
            />
          </section>

          {/* Feedback do Treinador */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500"/> Feedback do Treinador
            </h3>
            <textarea
              value={trainerFeedback}
              onChange={(e) => setTrainerFeedback(e.target.value)}
              disabled={isViewMode}
              rows={4}
              placeholder="Feedback, plano de ação, recomendações..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm disabled:opacity-70"
            />
          </section>

          {/* Tabela Placeholder */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Plus size={16} className="text-blue-500"/> Tabela
            </h3>
            <div className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-sm">
              Tabela de dados
            </div>
          </section>

        </div>

        {/* Footer */}
        {!isViewMode && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/20 transition-all"
            >
              Guardar Avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
