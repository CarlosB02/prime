import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, GripVertical, Settings2, HelpCircle, ChevronDown, Check, Activity, AlignLeft, List, Hash } from 'lucide-react';
import { Questionnaire, Question, QuestionType, QuestionnaireType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Questionnaire, 'id' | 'isDeleted' | 'createdAt'>) => void;
  initialData?: Questionnaire | null;
}

const METRICS_GROUPS = [
  {
    name: 'Geral',
    items: ['Peso', 'Altura']
  },
  {
    name: 'Perímetros',
    items: ['Perímetro Abdominal', 'Perímetro Anca', 'Perímetro Braço', 'Perímetro Peitoral', 'Perímetro Cintura', 'Perímetro médio da coxa']
  },
  {
    name: 'Bioimpedância',
    items: ['IMC', 'Gordura Visceral (%)', 'Massa Gorda (%)', 'Massa Magra (%)']
  },
  {
    name: 'Comportamento',
    items: ['Comportamento']
  }
];

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<Questionnaire, 'id' | 'isDeleted' | 'createdAt'>>({
    title: '',
    description: '',
    type: 'Avaliação inicial',
    frequency: undefined,
    isDefault: false,
    metrics: [],
    questions: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        frequency: initialData.frequency,
        isDefault: initialData.isDefault || false,
        metrics: initialData.metrics || [],
        questions: [...initialData.questions]
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'Avaliação inicial',
        frequency: undefined,
        isDefault: false,
        metrics: [],
        questions: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const toggleMetric = (metric: string) => {
    const currentMetrics = formData.metrics || [];
    if (currentMetrics.includes(metric)) {
      setFormData({ ...formData, metrics: currentMetrics.filter(m => m !== metric) });
    } else {
      setFormData({ ...formData, metrics: [...currentMetrics, metric] });
    }
  };

  const addQuestion = (type: QuestionType = 'text') => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      type,
      required: true,
      options: type === 'multiple_choice' ? ['Opção 1', 'Opção 2'] : undefined
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    });
  };

  const removeQuestion = (id: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== id)
    });
  };

  const addOption = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          const options = q.options || [];
          return { ...q, options: [...options, `Opção ${options.length + 1}`] };
        }
        return q;
      })
    });
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    });
  };

  const removeOption = (questionId: string, index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions.splice(index, 1);
          return { ...q, options: newOptions };
        }
        return q;
      })
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Editar Questionário' : 'Novo Questionário'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crie um questionário personalizado em 3 passos simples.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="questionnaire-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
            
            {/* STEP 1: Configuração Inicial */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">1</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Configuração Inicial</h3>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nome do Questionário</label>
                      <input 
                          type="text" 
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                          placeholder="Ex: Avaliação Inicial de Hipertrofia"
                      />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipo</label>
                      <div className="relative">
                          <select 
                              value={formData.type}
                              onChange={(e) => setFormData({...formData, type: e.target.value as QuestionnaireType})}
                              className="w-full px-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                              <option value="Avaliação inicial">Avaliação inicial</option>
                              <option value="Periódico">Periódico</option>
                              <option value="Registo diário">Registo diário</option>
                              <option value="Inicial de treino">Inicial de treino</option>
                              <option value="Pós-treino">Pós-treino</option>
                              <option value="Personalizado">Personalizado</option>
                          </select>
                          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Frequência</label>
                      <div className="relative">
                          <input 
                              type="number" 
                              min="1"
                              value={formData.frequency || ''}
                              onChange={(e) => setFormData({...formData, frequency: e.target.value ? parseInt(e.target.value) : undefined})}
                              className="w-full pl-4 pr-24 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                              placeholder="Ex: 7"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">
                              dias
                          </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">Repetir a cada X dias (opcional)</p>
                  </div>

                  <div className="col-span-2 md:col-span-1 flex items-center h-full pt-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isDefault ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isDefault ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                          <input 
                              type="checkbox" 
                              className="hidden"
                              checked={formData.isDefault}
                              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                          />
                          <div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Definir como Predefinido</span>
                            <span className="text-xs text-slate-500">Aplicar automaticamente a novos clientes</span>
                          </div>
                      </label>
                  </div>
                </div>
              </div>
            </section>

            {/* STEP 2: Seleção de Métricas */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">2</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Seleção de Métricas</h3>
                  <p className="text-sm text-slate-500">Selecione os dados que deseja recolher neste questionário.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {METRICS_GROUPS.map((group) => (
                    <div key={group.name} className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{group.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(metric => {
                          const isSelected = (formData.metrics || []).includes(metric);
                          return (
                            <button
                              key={metric}
                              type="button"
                              onClick={() => toggleMetric(metric)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                                isSelected 
                                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800/50 dark:text-primary-400' 
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isSelected 
                                  ? 'bg-primary-500 border-primary-500 text-white' 
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                              {metric}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* STEP 3: Perguntas Personalizadas */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Perguntas Personalizadas</h3>
                    <p className="text-sm text-slate-500">Adicione perguntas específicas para os seus clientes.</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => addQuestion('text')}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all shadow-sm hover:shadow"
                  >
                    <AlignLeft size={16} className="text-primary-500" />
                    <span className="hidden sm:inline">Resposta Curta</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => addQuestion('multiple_choice')}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all shadow-sm hover:shadow"
                  >
                    <List size={16} className="text-emerald-500" />
                    <span className="hidden sm:inline">Escolha Múltipla</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => addQuestion('scale')}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all shadow-sm hover:shadow"
                  >
                    <Hash size={16} className="text-amber-500" />
                    <span className="hidden sm:inline">Escala (1-5)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                  {formData.questions.length === 0 ? (
                      <div className="text-center py-12 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HelpCircle size={24} className="text-slate-400" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Nenhuma pergunta adicionada</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">Utilize os botões acima para adicionar perguntas de resposta curta, escolha múltipla ou escala.</p>
                      </div>
                  ) : (
                      <AnimatePresence>
                        {formData.questions.map((q, index) => (
                            <motion.div 
                              key={q.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent"
                            >
                                <div className="flex">
                                  {/* Drag Handle */}
                                  <div className="w-10 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center border-r border-slate-100 dark:border-slate-700/50 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                      <GripVertical size={18} />
                                  </div>
                                  
                                  <div className="flex-1 p-5 space-y-4">
                                      <div className="flex flex-col sm:flex-row gap-4">
                                          <div className="flex-1">
                                              <input 
                                                  type="text" 
                                                  required
                                                  value={q.text}
                                                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                                  className="w-full text-lg font-medium bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary-500 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600 pb-1"
                                                  placeholder="Escreva a sua pergunta aqui..."
                                                  
                                              />
                                          </div>
                                          <div className="w-full sm:w-48 relative shrink-0">
                                              <select 
                                                  value={q.type}
                                                  onChange={(e) => {
                                                      const newType = e.target.value as QuestionType;
                                                      updateQuestion(q.id, { 
                                                          type: newType,
                                                          options: newType === 'multiple_choice' ? (q.options || ['Opção 1', 'Opção 2']) : undefined
                                                      });
                                                  }}
                                                  className="w-full px-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                              >
                                                  <option value="text">Resposta Curta</option>
                                                  <option value="multiple_choice">Escolha Múltipla</option>
                                                  <option value="scale">Escala (1-5)</option>
                                              </select>
                                              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                          </div>
                                      </div>

                                      {/* Question Type Specific UI */}
                                      <div className="pt-2">
                                        {q.type === 'text' && (
                                          <div className="w-full h-10 border-b-2 border-dashed border-slate-200 dark:border-slate-700 flex items-end pb-2">
                                            <span className="text-sm text-slate-400">Texto de resposta curta...</span>
                                          </div>
                                        )}

                                        {q.type === 'scale' && (
                                          <div className="flex items-center gap-4">
                                            {[1, 2, 3, 4, 5].map(num => (
                                              <div key={num} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 font-medium">
                                                {num}
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {q.type === 'multiple_choice' && (
                                            <div className="space-y-3">
                                                {q.options?.map((opt, optIndex) => (
                                                    <div key={optIndex} className="flex items-center gap-3 group/option">
                                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                                                        <input 
                                                            type="text"
                                                            required
                                                            value={opt}
                                                            onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                                                            className="flex-1 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary-500 outline-none transition-colors text-sm py-1"
                                                            placeholder={`Opção ${optIndex + 1}`}
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeOption(q.id, optIndex)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors "
                                                            disabled={(q.options?.length || 0) <= 1}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button 
                                                    type="button"
                                                    onClick={() => addOption(q.id)}
                                                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-2 mt-2 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                                >
                                                    <Plus size={16} /> Adicionar Opção
                                                </button>
                                            </div>
                                        )}
                                      </div>

                                      {/* Question Actions */}
                                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <div className={`w-10 h-5 rounded-full transition-colors relative ${q.required ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                                  <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${q.required ? 'translate-x-5' : 'translate-x-0'}`} />
                                              </div>
                                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Obrigatória</span>
                                          </label>
                                          
                                          <button 
                                              type="button"
                                              onClick={() => removeQuestion(q.id)}
                                              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                                          >
                                              <Trash2 size={16} />
                                              Remover
                                          </button>
                                      </div>
                                  </div>
                                </div>
                            </motion.div>
                        ))}
                      </AnimatePresence>
                  )}
              </div>
            </section>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 z-10">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            form="questionnaire-form"
            type="submit"
            className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Guardar Questionário
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default QuestionnaireModal;
