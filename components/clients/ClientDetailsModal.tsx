import React, { useState } from 'react';
import { X, User, Activity, Dumbbell, Apple, CreditCard, Edit2, Plus, Trash2, CheckCircle2, Search } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { CustomChatIcon } from '../icons';
import { Client } from '../../types';
import SendNotificationModal from './SendNotificationModal';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

type TabType = 'gerais' | 'avaliacao' | 'treino' | 'nutricao' | 'pagamentos';

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ isOpen, onClose, client }) => {
  const [activeTab, setActiveTab] = useState<TabType>('gerais');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isAddNutritionModalOpen, setIsAddNutritionModalOpen] = useState(false);

  if (!isOpen || !client) return null;

  const tabs = [
    { id: 'gerais', label: 'Dados Gerais', icon: User },
    { id: 'avaliacao', label: 'Avaliação Física', icon: Activity },
    { id: 'treino', label: 'Plano de Treino', icon: Dumbbell },
    { id: 'nutricao', label: 'Plano de Nutrição', icon: Apple },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <img 
              src={client.avatar} 
              alt={client.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{client.name}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-500' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'gerais' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <img src={client.avatar} alt={client.name} className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700 shadow-md" />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{client.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsMessageModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40 rounded-xl transition-colors font-medium text-sm"
                        >
                          <CustomChatIcon size={18} />
                          Enviar Mensagem
                        </button>
                        <button 
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-xl transition-colors font-medium text-sm"
                        >
                          <Edit2 size={18} />
                          Editar
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Sexo</p>
                        <p className="font-medium text-slate-800 dark:text-white">Masculino</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Data de entrada</p>
                        <p className="font-medium text-slate-800 dark:text-white">12 Jan 2024</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Email</p>
                        <p className="font-medium text-slate-800 dark:text-white">{client.name.toLowerCase().replace(' ', '.')}@email.com</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Telefone</p>
                        <p className="font-medium text-slate-800 dark:text-white">{client.contact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'avaliacao' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Histórico de Avaliações</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      Guardar notas
                    </button>
                    <button className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                      Comparar avaliações físicas
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4">Data</th>
                          <th className="px-6 py-4">Cintura (cm)</th>
                          <th className="px-6 py-4">Anca (cm)</th>
                          <th className="px-6 py-4">Peso (kg)</th>
                          <th className="px-6 py-4">Variação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">#002</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-semibold uppercase tracking-wide">Validado</span></td>
                          <td className="px-6 py-4 font-medium">15 Mar 2024</td>
                          <td className="px-6 py-4">82</td>
                          <td className="px-6 py-4">98</td>
                          <td className="px-6 py-4">76.5</td>
                          <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">-1.2 kg</td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">#001</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-semibold uppercase tracking-wide">Validado</span></td>
                          <td className="px-6 py-4 font-medium">15 Fev 2024</td>
                          <td className="px-6 py-4">84</td>
                          <td className="px-6 py-4">100</td>
                          <td className="px-6 py-4">77.7</td>
                          <td className="px-6 py-4 text-slate-400">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'treino' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Planos de Treino Associados</h3>
                  <button 
                    onClick={() => setIsAddPlanModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <Dumbbell size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Hipertrofia - Fase 1</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Atribuído a 15 Mar 2024</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutricao' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Planos de Nutrição Associados</h3>
                  <button 
                    onClick={() => setIsAddNutritionModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center group hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Apple size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Défice Calórico - 2000kcal</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Atribuído a 15 Mar 2024</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pagamentos' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <CheckCircle2 size={18} />
                      </div>
                      <h4 className="font-medium text-slate-600 dark:text-slate-300">Estado Atual</h4>
                    </div>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">Ativo</p>
                  </div>
                  
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <CustomCalendarIcon size={18} />
                      </div>
                      <h4 className="font-medium text-slate-600 dark:text-slate-300">Próximo Pagamento</h4>
                    </div>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">15 Abr 2024</p>
                  </div>

                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                        <CreditCard size={18} />
                      </div>
                      <h4 className="font-medium text-slate-600 dark:text-slate-300">Plano Associado</h4>
                    </div>
                    <p className="text-2xl font-black text-slate-800 dark:text-white truncate" title={client.plan}>{client.plan}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Histórico de Pagamentos</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4">Data</th>
                          <th className="px-6 py-4">Descrição</th>
                          <th className="px-6 py-4">Valor</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4 text-right">Fatura</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium">15 Mar 2024</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{client.plan}</td>
                          <td className="px-6 py-4 font-bold">€49.99</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-semibold uppercase tracking-wide">Pago</span></td>
                          <td className="px-6 py-4 text-right"><button className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Download</button></td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium">15 Fev 2024</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{client.plan}</td>
                          <td className="px-6 py-4 font-bold">€49.99</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-semibold uppercase tracking-wide">Pago</span></td>
                          <td className="px-6 py-4 text-right"><button className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Download</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Message Modal */}
      <SendNotificationModal 
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        clients={[client]}
      />

      {/* Mock Add Plan Modal */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white">Associar Plano de Treino</h3>
              <button onClick={() => setIsAddPlanModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Pesquisar plano..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <div className="font-bold text-slate-800 dark:text-white">Hipertrofia - Fase 2</div>
                  <div className="text-xs text-slate-500 mt-1">4 dias/semana • Intermédio</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <div className="font-bold text-slate-800 dark:text-white">Perda de Peso Rápida</div>
                  <div className="text-xs text-slate-500 mt-1">5 dias/semana • Iniciante</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Add Nutrition Modal */}
      {isAddNutritionModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white">Associar Plano de Nutrição</h3>
              <button onClick={() => setIsAddNutritionModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Pesquisar plano..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  <div className="font-bold text-slate-800 dark:text-white">Manutenção - 2500kcal</div>
                  <div className="text-xs text-slate-500 mt-1">Equilibrado • 4 refeições</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  <div className="font-bold text-slate-800 dark:text-white">Low Carb - 1800kcal</div>
                  <div className="text-xs text-slate-500 mt-1">Perda de peso • 5 refeições</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsModal;
