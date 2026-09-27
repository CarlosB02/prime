import React, { useState } from 'react';
import { X, User, Lock, FileText, Activity, Apple, Upload, Plus, Trash2, Search, CreditCard, Clock } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { motion, AnimatePresence } from 'motion/react';

interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({ isOpen, onClose, client }) => {
  const [activeTab, setActiveTab] = useState('conta');

  const tabs = [
    { id: 'conta', label: 'Conta', icon: Lock },
    { id: 'pessoais', label: 'Info. Pessoais', icon: User },
    { id: 'ficha', label: 'Ficha', icon: FileText },
    { id: 'observacoes', label: 'Observações', icon: Activity },
    { id: 'alimentacao', label: 'Alimentação', icon: Apple },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Editar Perfil</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Atualize as informações e configurações do cliente.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto p-4 space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400' 
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900">
                <div className="max-w-3xl mx-auto">
                  
                  {/* CONTA */}
                  {activeTab === 'conta' && (
                    <div className="space-y-8 animate-fade-in">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <Lock size={20} className="text-primary-500" />
                          Credenciais de Acesso
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                            <input 
                              type="email" 
                              defaultValue={client.email}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nova Password</label>
                            <input 
                              type="password" 
                              placeholder="Deixar em branco para manter a atual"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INFORMAÇÕES PESSOAIS */}
                  {activeTab === 'pessoais' && (
                    <div className="space-y-10 animate-fade-in">
                      
                      {/* Foto de Perfil */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Foto de Perfil</h3>
                        <div className="flex items-center gap-6">
                          <img src={client.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800" />
                          <div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                              <Upload size={16} />
                              Alterar Imagem
                            </button>
                            <p className="text-xs text-slate-500 mt-2">JPG, GIF ou PNG. Máximo de 2MB.</p>
                          </div>
                        </div>
                      </div>

                      {/* Dados Básicos */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Dados Básicos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primeiro Nome</label>
                            <input 
                              type="text" 
                              defaultValue={client.name.split(' ')[0]}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Último Nome</label>
                            <input 
                              type="text" 
                              defaultValue={client.name.split(' ').slice(1).join(' ')}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Data de Nascimento</label>
                            <input 
                              type="date" 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Género</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                              <option value="M">Masculino</option>
                              <option value="F">Feminino</option>
                              <option value="O">Outro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Telemóvel</label>
                            <input 
                              type="tel" 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Profissão</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Informações de Subscrição */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Assinatura & Acessos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Plano Ativo</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                              <option value="premium">Premium</option>
                              <option value="basic">Basic</option>
                              <option value="pro">Pro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data de Aceitação</label>
                            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-medium px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                              <CustomCalendarIcon size={16} />
                              12 Jan 2024
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data de Término</label>
                            <input 
                              type="date" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Próximo Pagamento</label>
                            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-medium px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                              <CreditCard size={16} className="text-slate-400" />
                              15 Abr 2024
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Próximo Feedback</label>
                            <input 
                              type="date" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Último Acesso</label>
                            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-medium px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                              <Clock size={16} className="text-slate-400" />
                              Hoje, 14:30
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FICHA (TREINO E DIETA) */}
                  {activeTab === 'ficha' && (
                    <div className="space-y-8 animate-fade-in">
                      
                      {/* Treino */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-primary-500" />
                            Treino
                          </h3>
                          <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                              <FileText size={16} />
                              Exportar PDF
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                              <Plus size={16} />
                              Novo Treino
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>Gestão de treinos será exibida aqui.</p>
                          </div>
                        </div>
                      </div>

                      {/* Dieta */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Apple size={20} className="text-emerald-500" />
                            Dieta
                          </h3>
                          <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                              <FileText size={16} />
                              Exportar PDF
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                              <Plus size={16} />
                              Nova Dieta
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>Gestão de dietas será exibida aqui.</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* OBSERVAÇÕES */}
                  {activeTab === 'observacoes' && (
                    <div className="space-y-8 animate-fade-in">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Observações Pessoais</h3>
                        <textarea 
                          rows={4}
                          placeholder="Notas gerais sobre o cliente..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Observações de Treino</h3>
                        <textarea 
                          rows={4}
                          placeholder="Notas específicas sobre o treino, postura, dificuldades..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-4 flex items-center gap-2">
                          <Activity size={20} />
                          Informação Clínica Relevante
                        </h3>
                        <p className="text-sm text-amber-700/70 dark:text-amber-500/70 mb-4">Doenças, patologias, lesões ou limitações físicas.</p>
                        <textarea 
                          rows={4}
                          placeholder="Ex: Hérnia discal L4-L5, condromalácia patelar..."
                          className="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* ALIMENTAÇÃO */}
                  {activeTab === 'alimentacao' && (
                    <div className="space-y-8 animate-fade-in">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Observações Gerais de Alimentação</h3>
                        <textarea 
                          rows={4}
                          placeholder="Hábitos alimentares, horários, dificuldades..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Preferências Alimentares</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Gosta */}
                          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 flex flex-col h-[300px]">
                            <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center justify-between">
                              Alimentos que Gosta
                              <span className="bg-emerald-200 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-md">3</span>
                            </h4>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                              {['Frango', 'Arroz', 'Ovos'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-sm text-slate-700 dark:text-slate-300">
                                  {item}
                                  <button className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                </div>
                              ))}
                            </div>
                            <button className="mt-3 w-full py-2 border border-dashed border-emerald-300 dark:border-emerald-700/50 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-colors flex items-center justify-center gap-2">
                              <Plus size={16} /> Adicionar
                            </button>
                          </div>

                          {/* Não Gosta */}
                          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4 flex flex-col h-[300px]">
                            <h4 className="font-semibold text-red-800 dark:text-red-400 mb-3 flex items-center justify-between">
                              Não Gosta
                              <span className="bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-md">2</span>
                            </h4>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                              {['Brócolos', 'Peixe cozido'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-red-100 dark:border-red-800/30 text-sm text-slate-700 dark:text-slate-300">
                                  {item}
                                  <button className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                </div>
                              ))}
                            </div>
                            <button className="mt-3 w-full py-2 border border-dashed border-red-300 dark:border-red-700/50 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors flex items-center justify-center gap-2">
                              <Plus size={16} /> Adicionar
                            </button>
                          </div>

                          {/* Intolerâncias */}
                          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4 flex flex-col h-[300px]">
                            <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center justify-between">
                              Intolerâncias / Alergias
                              <span className="bg-amber-200 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-md">1</span>
                            </h4>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                              {['Lactose'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-800/30 text-sm text-slate-700 dark:text-slate-300">
                                  {item}
                                  <button className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                </div>
                              ))}
                            </div>
                            <button className="mt-3 w-full py-2 border border-dashed border-amber-300 dark:border-amber-700/50 rounded-lg text-amber-600 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors flex items-center justify-center gap-2">
                              <Plus size={16} /> Adicionar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 transition-all"
              >
                Guardar Alterações
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
