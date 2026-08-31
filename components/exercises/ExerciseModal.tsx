import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle, Plus, Trash2, Link as LinkIcon, Video, FileText } from 'lucide-react';
import { Exercise, ExerciseVideo, VideoType } from '../../types';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES, DIFFICULTY_LEVELS, EXERCISE_TYPES, DESCRIPTION_TEMPLATES } from '../../constants';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Omit<Exercise, 'id' | 'isDeleted'>) => void;
  initialData?: Exercise | null;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<{
    name: string;
    image: string;
    muscleGroup: string;
    type: 'Indefinido' | 'Alongamento' | 'Mobilidade' | 'Força';
    equipment: string;
    difficulty: 'Iniciante' | 'Intermédio' | 'Avançado';
    videos: ExerciseVideo[];
    description: string;
    notes: string;
  }>({
    name: '',
    image: '',
    muscleGroup: MUSCLE_GROUPS[0],
    type: 'Indefinido',
    equipment: EQUIPMENT_TYPES[0],
    difficulty: 'Iniciante',
    videos: [{ type: 'link', url: '' }],
    description: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        image: initialData.image,
        muscleGroup: initialData.muscleGroup,
        type: initialData.type || 'Indefinido',
        equipment: initialData.equipment,
        difficulty: initialData.difficulty,
        videos: initialData.videos && initialData.videos.length > 0 ? initialData.videos : [{ type: 'link', url: '' }],
        description: initialData.description,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        image: '',
        muscleGroup: MUSCLE_GROUPS[0],
        type: 'Indefinido',
        equipment: EQUIPMENT_TYPES[0],
        difficulty: 'Iniciante',
        videos: [{ type: 'link', url: '' }],
        description: '',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200&h=200' // Fallback image
    });
    onClose();
  };

  const addVideoSlot = () => {
    if (formData.videos.length < 2) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, { type: 'link', url: '' }]
      }));
    }
  };

  const removeVideoSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const updateVideo = (index: number, field: keyof ExerciseVideo, value: string) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const applyTemplate = (templateKey: keyof typeof DESCRIPTION_TEMPLATES) => {
    setFormData(prev => ({
      ...prev,
      description: DESCRIPTION_TEMPLATES[templateKey]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Editar Exercício' : 'Novo Exercício'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Preencha os detalhes técnicos do movimento.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          <form id="exercise-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload Area */}
              <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Imagem de Capa</label>
                 <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden group hover:border-primary-500 transition-colors">
                       {formData.image ? (
                         <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <Upload size={24} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                       )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="URL da imagem (ex: unsplash.com/...)" 
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2">Cole um link direto para uma imagem ou deixe vazio para usar a imagem padrão.</p>
                    </div>
                 </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Exercício</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Ex: Supino Inclinado com Halteres"
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grupo Muscular</label>
                <select 
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({...formData, muscleGroup: e.target.value})}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Equipamento</label>
                <select 
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nível de Dificuldade</label>
                <div className="flex gap-2">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, difficulty: level as any})}
                      className={`
                        flex-1 py-2 text-xs font-medium rounded-lg border transition-all
                        ${formData.difficulty === level 
                          ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary-300'}
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Videos Section */}
              <div className="col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-3">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Vídeos de Demonstração (Máx. 2)</label>
                   {formData.videos.length < 2 && (
                     <button 
                        type="button" 
                        onClick={addVideoSlot}
                        className="text-xs flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                     >
                        <Plus size={14} /> Adicionar Vídeo
                     </button>
                   )}
                </div>
                
                <div className="space-y-3">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                       <div className="flex items-center gap-2 sm:w-40 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateVideo(index, 'type', 'link')}
                            className={`flex-1 flex justify-center items-center py-1.5 rounded-md text-xs font-medium transition-all ${video.type === 'link' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                          >
                             <LinkIcon size={14} className="mr-1" /> Link
                          </button>
                          <button
                            type="button"
                            onClick={() => updateVideo(index, 'type', 'upload')}
                            className={`flex-1 flex justify-center items-center py-1.5 rounded-md text-xs font-medium transition-all ${video.type === 'upload' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                          >
                             <Video size={14} className="mr-1" /> Upload
                          </button>
                       </div>
                       
                       <div className="flex-1">
                          {video.type === 'link' ? (
                             <input 
                               type="url" 
                               value={video.url}
                               onChange={(e) => updateVideo(index, 'url', e.target.value)}
                               className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                               placeholder="https://youtube.com/..."
                             />
                          ) : (
                             <div className="flex items-center justify-center w-full px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                                <span className="flex items-center gap-2"><Upload size={12}/> Selecionar Ficheiro (MP4, MOV)</span>
                             </div>
                          )}
                       </div>

                       <button 
                         type="button"
                         onClick={() => removeVideoSlot(index)}
                         className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                         title="Remover"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                  {formData.videos.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-2">Nenhum vídeo adicionado.</p>
                  )}
                </div>
              </div>

              {/* Description with Templates */}
              <div className="col-span-2">
                <div className="flex flex-wrap justify-between items-end mb-2 gap-2">
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição Técnica</label>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Templates:</span>
                      <button type="button" onClick={() => applyTemplate('default')} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 rounded border border-slate-200 dark:border-slate-700 transition-colors">Padrão</button>
                      <button type="button" onClick={() => applyTemplate('strength')} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 rounded border border-slate-200 dark:border-slate-700 transition-colors">Força</button>
                      <button type="button" onClick={() => applyTemplate('mobility')} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 rounded border border-slate-200 dark:border-slate-700 transition-colors">Mobilidade</button>
                   </div>
                </div>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <textarea 
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none leading-relaxed"
                    placeholder="Instruções passo-a-passo da execução..."
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações para o Cliente (Opcional)</label>
                <div className="relative">
                  <AlertCircle size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <textarea 
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                    placeholder="Dicas de segurança ou variantes..."
                  />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 z-10">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            form="exercise-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar Exercício
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExerciseModal;
