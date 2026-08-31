import React, { useState } from 'react';
import { X, MessageSquare, ClipboardList, BookOpen, Target, CreditCard, ChevronRight } from 'lucide-react';

interface DashboardMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardMessagesModal: React.FC<DashboardMessagesModalProps> = ({ isOpen, onClose }) => {
  const [activeMainTab, setActiveMainTab] = useState('Geral');
  const [activeSubTab, setActiveSubTab] = useState('');

  if (!isOpen) return null;

  const MAIN_TABS = [
    { id: 'Geral', label: 'Geral', icon: MessageSquare },
    { id: 'Avaliações', label: 'Avaliações', icon: ClipboardList, subTabs: ['Avaliação Inicial', 'Check-ins', 'Questionários'] },
    { id: 'Notas de Aluno', label: 'Notas de Aluno', icon: BookOpen, subTabs: ['Treino', 'Exercícios', 'Pós Treino', 'Alimentação'] },
    { id: 'Objetivos', label: 'Objetivos', icon: Target, subTabs: ['Meta de Carga', 'Prazos'] },
    { id: 'Pagamentos', label: 'Pagamentos', icon: CreditCard },
  ];

  const handleMainTabClick = (tabId: string, subTabs?: string[]) => {
    setActiveMainTab(tabId);
    if (subTabs && subTabs.length > 0) {
      setActiveSubTab(subTabs[0]);
    } else {
      setActiveSubTab('');
    }
  };

  const renderContent = () => {
    // Placeholder content for each section based on selections
    return (
      <div className="p-4 flex-1 overflow-y-auto min-h-[400px]">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
          {activeMainTab} {activeSubTab && <span className="text-slate-400 font-normal">/ {activeSubTab}</span>}
        </h4>
        
        {activeMainTab === 'Geral' && (
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 animate-pulse"></div>
                 <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-white">Mensagem Geral {i}</p>
                   <p className="text-xs text-slate-500 mt-1">Este é um exemplo de notificação geral para o treinador.</p>
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeMainTab === 'Avaliações' && activeSubTab === 'Avaliação Inicial' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200">
               <p className="font-bold text-sm">João Pedro preencheu a avaliação inicial</p>
               <p className="text-xs opacity-80 mt-1">Verifique os dados biométricos e histórico antes de prescrever o plano.</p>
            </div>
          </div>
        )}

        {activeMainTab === 'Avaliações' && activeSubTab === 'Check-ins' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
               <p className="font-bold text-sm">Marta Silva enviou o check-in semanal</p>
               <p className="text-xs opacity-80 mt-1">Peso: 64kg (-0.5kg). Refere mais energia nos treinos.</p>
            </div>
          </div>
        )}

        {activeMainTab === 'Notas de Aluno' && activeSubTab === 'Treino' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
               <p className="font-bold text-sm text-slate-800 dark:text-white">Dúvida no Supino</p>
               <p className="text-xs text-slate-500 mt-1">"Devo descer a barra até tocar no peito ou parar antes?" - Carlos (Há 2 horas)</p>
            </div>
          </div>
        )}

        {/* Generic fallback for others */}
        {activeMainTab !== 'Geral' && activeMainTab !== 'Avaliações' && !(activeMainTab === 'Notas de Aluno' && activeSubTab === 'Treino') && (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <MessageSquare size={32} className="mb-3 opacity-20" />
            <p className="text-sm">Nenhuma notificação para esta categoria.</p>
          </div>
        )}
      </div>
    );
  };

  const currentTabObj = MAIN_TABS.find(t => t.id === activeMainTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] max-h-[700px] rounded-3xl shadow-2xl flex overflow-hidden border border-slate-200 dark:border-slate-800 scale-in-center">
        
        {/* Left Sidebar (Main Tabs) */}
        <div className="w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <h3 className="font-black text-slate-800 dark:text-white">Mensagens</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MAIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMainTabClick(tab.id, tab.subTabs)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-bold shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Icon size={18} className={isActive ? 'text-primary-500' : 'text-slate-400'} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors z-10"
          >
            <X size={16} />
          </button>

          {/* Sub Tabs Header */}
          {currentTabObj?.subTabs && (
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex gap-2 overflow-x-auto no-scrollbar pt-6 pr-14">
              {currentTabObj.subTabs.map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveSubTab(subTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                    activeSubTab === subTab
                      ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderContent()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardMessagesModal;
