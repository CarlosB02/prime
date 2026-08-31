import React, { useState } from 'react';
import { 
  Users, UserPlus, UserCheck, RefreshCw, 
  Calendar as CalendarIcon, MessageSquare, 
  CheckCircle2, AlertCircle, FileText, Activity, 
  CreditCard, Clock, ChevronRight, Award, Flame, Search,
  Send, Gift, Cake
} from 'lucide-react';
import DashboardMessagesModal from './DashboardMessagesModal';
import DashboardListModal from './DashboardListModal';

const DashboardView: React.FC = () => {
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listModalTitle, setListModalTitle] = useState('');
  const [activeTab, setActiveTab] = useState('Avaliações');
  const [reverTab, setReverTab] = useState('Atenção');
  const [bdayModalOpen, setBdayModalOpen] = useState(false);
  const [selectedBday, setSelectedBday] = useState<{name: string, age?: number} | null>(null);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Rever avaliação mensal do Diogo', time: 'Hoje, 14:00', done: false },
    { id: 2, title: 'Atualizar plano de treino da Sofia (Fase 2)', time: 'Hoje, 16:30', done: false },
    { id: 3, title: 'Enviar mensagem de motivação ao grupo Premium', time: 'Amanhã', done: false },
    { id: 4, title: 'Preparar conteúdo para o desafio', time: 'Quinta-feira', done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const TABS = [
    { id: 'Avaliações', label: 'Avaliações', value: '3', alert: true },
    { id: 'Mensagens', label: 'Mensagens', value: '5', alert: true },
    { id: 'Pagamentos', label: 'Pagamentos', value: '2', alert: false },
    { id: 'Planos', label: 'Planos', value: '8', alert: false },
    { id: 'Check-ins', label: 'Check-ins', value: '4', alert: true },
    { id: 'Sem treinar', label: 'Sem treinar', value: '6', alert: true },
    { id: 'Renovações', label: 'Renovações', value: '0', alert: false },
  ];

  const SECONDARY_STATS = [
    { label: 'Total Alunos', value: '142', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Ativos', value: '118', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Novos (Mês)', value: '12', icon: UserPlus, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Inativos', value: '24', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Renovações', value: '8', icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. Header Superior & Top Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-2 w-full xl:w-auto">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            Olá, <span className="text-primary-600 dark:text-primary-400">Renato</span> 👋
          </h1>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-4 w-full xl:w-auto xl:justify-end">
           <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold text-sm text-slate-700 dark:text-slate-200">
               <CalendarIcon size={16} className="text-primary-500" />
               Hoje, 21 Jun
             </button>
           </div>
           
           <button 
             onClick={() => setIsMessagesModalOpen(true)}
             className="relative p-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
           >
             <MessageSquare size={20} />
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">5</span>
           </button>
        </div>
      </div>

      {/* 2. Barra de Resumo com Tabs */}
      <div className="w-full pb-2 pt-1 overflow-x-auto custom-scrollbar">
        <div className="flex w-max min-w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm divide-x divide-slate-200 dark:divide-slate-700 overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setListModalTitle(tab.label);
                setIsListModalOpen(true);
              }}
              className={`flex-1 flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-1 xl:gap-2 px-2 py-3 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className={`font-bold text-xs sm:text-sm tracking-tight text-center ${activeTab === tab.id ? 'text-primary-700 dark:text-primary-400' : ''}`}>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-black
                ${activeTab === tab.id 
                  ? (tab.alert ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400')
                  : 'bg-slate-100 dark:bg-slate-900 ' + (tab.alert ? 'text-rose-500 dark:text-rose-400 font-black' : '')
                }
              `}>
                {tab.value}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Segunda Barra de Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {SECONDARY_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <Icon size={16} />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{stat.value}</span>
            </div>
          )
        })}
      </div>

      {/* 4. Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Caixa de Entrada */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col h-full min-h-[350px]">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center relative">
                  <MessageSquare size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Caixa de Entrada</h3>
              </div>
              <button className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Ver todas as mensagens
              </button>
           </div>

           <div className="space-y-4 flex-1">
              {[
                { name: 'Diogo Ribeiro', msg: 'Já enviei o check-in desta semana. Tive alguma dificuldade no agachamento.', time: '10:42', unread: true },
                { name: 'Marta Vieira', msg: 'Bom dia! O plano novo está top! 🚀', time: 'Ontem', unread: true },
                { name: 'Pedro Alves', msg: 'Posso trocar o jantar por ovos?', time: 'Ontem', unread: false },
                { name: 'Sofia Lopes', msg: 'Feito.', time: 'Terça', unread: false },
              ].map((chat, i) => (
                <div key={i} className="flex gap-3 items-start group cursor-pointer">
                  <div className="relative shrink-0">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                    {chat.unread && <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-bold truncate pr-2 ${chat.unread ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{chat.name}</span>
                      <span className={`text-[10px] shrink-0 ${chat.unread ? 'text-primary-600 font-bold dark:text-primary-400' : 'text-slate-400'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-400'}`}>
                      {chat.msg}
                    </p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* 2. Tarefas */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col h-full min-h-[350px]">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                 <CheckCircle2 size={20} />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tarefas</h3>
                 <p className="text-xs text-slate-500">O que precisa de ser feito</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <button className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mr-2">
                 Ver todas
               </button>
               <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg transition-colors">
                 + Nova Tarefa
               </button>
             </div>
           </div>
           
           <div className="space-y-4 flex-1">
             {tasks.map((task) => (
               <label key={task.id} className={`flex items-start sm:items-center gap-4 p-3 rounded-xl border cursor-pointer transition-colors ${task.done ? 'bg-slate-50 border-transparent dark:bg-slate-900/20' : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}`}>
                 <div className="relative flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                   <input type="checkbox" className="peer sr-only" checked={task.done} onChange={() => toggleTask(task.id)} />
                   <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                   <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                 </div>
                 <div className="flex flex-col flex-1">
                   <div className="relative w-fit">
                     <span className={`text-sm font-bold transition-colors duration-300 block ${task.done ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{task.title}</span>
                     <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 dark:h-[1px] bg-slate-400 transition-all duration-300 ease-out ${task.done ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></span>
                   </div>
                   <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 sm:mt-0.5"><Clock size={12}/> {task.time}</span>
                 </div>
               </label>
             ))}
           </div>
        </div>
        
        {/* 3. A Rever (Needs intervention) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col h-full min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">A Rever</h3>
              </div>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
               <button onClick={() => setReverTab('Atenção')} className={`px-2 lg:px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${reverTab === 'Atenção' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Atenção</button>
               <button onClick={() => setReverTab('Check-ins')} className={`px-2 lg:px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${reverTab === 'Check-ins' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Check-ins</button>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
            {reverTab === 'Atenção' ? (
              [
                { name: 'João Silva', reason: 'Sem treinar há 5 dias', context: 'Último treino: Plano A (Peito/Tríceps)', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                { name: 'Maria Santos', reason: 'Check-in Atrasado', context: 'Deveria ter enviado ontem', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { name: 'Carlos Ferreira', reason: 'Plano Desatualizado', context: 'Na semana 6 de 4', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                { name: 'Ana Costa', reason: 'Último Login Antigo', context: 'Não entra há 2 semanas', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' }
              ].map((alert, i) => {
                const Icon = alert.icon;
                return (
                  <div key={i} className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt={alert.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-800 ${alert.bg} ${alert.color}`}>
                          <Icon size={10} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{alert.name}</h4>
                        <div className="flex flex-col text-xs mt-0.5">
                          <span className={`${alert.color} font-bold`}>{alert.reason}</span>
                          <span className="text-slate-500">{alert.context}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 group-hover:text-primary-600 group-hover:border-primary-600 shadow-sm transition-all shrink-0">
                      Ver aluno
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 grayscale opacity-80">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Activity size={32} />
                 </div>
                 <h4 className="font-bold text-slate-700 dark:text-slate-300">Em Desenvolvimento</h4>
                 <p className="text-xs text-slate-500 mt-2 max-w-[200px]">O módulo de check-ins diários estará disponível brevemente.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Comunidade */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-lg p-6 flex flex-col h-full min-h-[350px] text-white relative overflow-hidden">
          {/* Decals background */}
          <div className="absolute -right-6 -top-6 text-white/10 rotate-12 pointer-events-none">
            <Award size={120} />
          </div>

          <div className="relative z-10 flex flex-col h-full gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-amber-400" size={24} />
              <h3 className="text-lg font-bold">Comunidade</h3>
            </div>
            
            <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-3 flex items-center gap-2">
                    <Award size={14}/> Desafios Ativos
                  </h4>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-bold text-sm">Desafio Verão Ativo</h4>
                        <span className="text-xs text-indigo-200">Termina em 12 dias</span>
                      </div>
                      <span className="text-lg font-black">68%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden mb-3">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(idx => (
                         <img key={idx} src={`https://i.pravatar.cc/100?u=${idx + 50}`} className="w-8 h-8 rounded-full border-2 border-indigo-600" alt="avatar" />
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-black/40 flex items-center justify-center text-[10px] font-bold">
                        +42
                      </div>
                    </div>
                  </div>
               </div>

               <div className="pt-2 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-3 flex items-center gap-2">
                    <Gift size={14}/> Aniversários
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-black/10 hover:bg-black/20 transition-colors rounded-xl p-2.5 group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold flex-col leading-none shadow-lg shadow-pink-500/30">
                          <span className="text-[9px] uppercase">Hoje</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold flex items-center gap-1">Pedro Santos <Cake size={12} className="text-pink-300"/></p>
                          <p className="text-xs text-indigo-200">Faz 28 anos</p>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedBday({name: 'Pedro Santos', age: 28}); setBdayModalOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Send size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-black/10 hover:bg-black/20 transition-colors rounded-xl p-2.5 group opacity-80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/20 text-indigo-200 flex items-center justify-center font-bold flex-col leading-none">
                          <span className="text-[9px] uppercase">Jun</span>
                          <span className="text-sm">23</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Mariana Costa</p>
                          <p className="text-xs text-indigo-200">Faz 32 anos</p>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedBday({name: 'Mariana Costa', age: 32}); setBdayModalOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* BDAY MODAL */}
      {bdayModalOpen && selectedBday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 scale-in-center">
             <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
               <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                 <Gift size={18} className="text-pink-500" />
                 Mensagem de Aniversário
               </h3>
               <button onClick={() => setBdayModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl">&times;</button>
             </div>
             <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A enviar mensagem para <strong className="text-slate-800 dark:text-white">{selectedBday.name}</strong> ({selectedBday.age} anos).
                </p>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mensagem</label>
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none text-sm text-slate-800 dark:text-white resize-none h-32"
                    defaultValue={`Parabéns, ${selectedBday.name!.split(' ')[0]}! 🎉\nEspero que tenhas um dia excelente! Vamos com tudo! 💪`}
                  ></textarea>
                </div>
             </div>
             <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
               <button onClick={() => setBdayModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm">Cancelar</button>
               <button onClick={() => setBdayModalOpen(false)} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 text-sm transition-all flex items-center gap-2">
                 <Send size={16} /> Enviar
               </button>
             </div>
           </div>
        </div>
      )}

      {/* MESSAGES MODAL */}
      <DashboardMessagesModal 
        isOpen={isMessagesModalOpen}
        onClose={() => setIsMessagesModalOpen(false)}
      />

      <DashboardListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title={listModalTitle}
      />
    </div>
  );
};

export default DashboardView;
