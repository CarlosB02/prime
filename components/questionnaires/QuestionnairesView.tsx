import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Edit2, RotateCcw, HelpCircle, FileText, Filter, ChevronDown } from 'lucide-react';
import { Questionnaire } from '../../types';
import { MOCK_QUESTIONNAIRES } from '../../constants';
import QuestionnaireModal from './QuestionnaireModal';

const QuestionnairesView: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(MOCK_QUESTIONNAIRES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);

  const QUESTIONNAIRE_TYPES = [
    'Avaliação inicial',
    'Periódico',
    'Registo diário',
    'Inicial de treino',
    'Pós-treino',
    'Personalizado'
  ];

  const handleAdd = () => {
    setSelectedQuestionnaire(null);
    setIsModalOpen(true);
  };

  const handleEdit = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Questionnaire, 'id' | 'isDeleted' | 'createdAt'>) => {
    if (selectedQuestionnaire) {
      setQuestionnaires(prev => prev.map(item => 
        item.id === selectedQuestionnaire.id ? { ...item, ...data } : item
      ));
    } else {
      const newQuestionnaire: Questionnaire = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0],
        isDeleted: false
      };
      setQuestionnaires(prev => [newQuestionnaire, ...prev]);
    }
  };

  const toggleDelete = (id: string) => {
    setQuestionnaires(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDeleted: !item.isDeleted };
      }
      return item;
    }));
  };

  const handleDeletePermanent = (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar permanentemente este questionário?')) {
      setQuestionnaires(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter(item => {
      if (!showDeleted && item.isDeleted) return false;
      if (showDeleted && !item.isDeleted) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             item.description.toLowerCase().includes(searchQuery.toLowerCase());
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [questionnaires, searchQuery, showDeleted, typeFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[240px] w-full sm:w-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar questionários..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="relative min-w-[180px] w-full sm:w-auto">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="all">Todos os tipos</option>
              {QUESTIONNAIRE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setShowDeleted(!showDeleted)}
            className={`
              flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showDeleted 
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'}
            `}
            title={showDeleted ? "Ocultar Eliminados" : "Mostrar Eliminados"}
          >
            <Trash2 size={16} />
          </button>
          
          <button 
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Criar Questionário
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider items-center">
          <div className="col-span-6 md:col-span-4 lg:col-span-3">Título</div>
          <div className="hidden lg:block lg:col-span-4">Descrição</div>
          <div className="col-span-3 md:col-span-3 lg:col-span-2 text-center">Tipo</div>
          <div className="hidden md:block md:col-span-2 lg:col-span-1 text-center">Perguntas</div>
          <div className="col-span-3 md:col-span-3 lg:col-span-2 text-right flex justify-end">Ações</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredQuestionnaires.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Nenhum questionário encontrado</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Tente utilizar outros termos de pesquisa.' 
                  : 'Crie o seu primeiro questionário para começar a avaliar os seus clientes.'}
              </p>
            </div>
          ) : (
            filteredQuestionnaires.map((item) => (
              <div 
                key={item.id} 
                onClick={() => !item.isDeleted && handleEdit(item)}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${item.isDeleted ? 'opacity-60 grayscale' : 'cursor-pointer'}`}
              >
                <div className="col-span-6 md:col-span-4 lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.createdAt}</p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block lg:col-span-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>
                </div>

                <div className="col-span-3 md:col-span-3 lg:col-span-2 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.type}
                  </span>
                </div>

                <div className="hidden md:block md:col-span-2 lg:col-span-1 text-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {item.questions.length}
                  </span>
                </div>

                <div className="col-span-3 md:col-span-3 lg:col-span-2 flex justify-end gap-2">
                  {item.isDeleted ? (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleDelete(item.id); }}
                        className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        title="Restaurar"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePermanent(item.id); }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar Permanentemente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                        className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => toggleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <QuestionnaireModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedQuestionnaire}
      />
    </div>
  );
};

export default QuestionnairesView;
