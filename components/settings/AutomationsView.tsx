import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  LayoutTemplate, 
  History,
  Search,
  Filter,
  Clock,
  Mail,
  Edit2,
  Copy,
  Trash2,
  MessageCircle,
  MessageSquare,
  Check,
  X,
  Bell
} from 'lucide-react';
import { CustomBellIcon } from '../icons';

export interface AutomationItem {
  id: string;
  name: string;
  category: string;
  condition: string;
  schedule: string;
  channels: ('email' | 'msg' | 'whatsapp' | 'push')[];
  isActive: boolean;
}

// Mock Data
const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'training', label: 'Treino' },
  { id: 'app_usage', label: 'Utilização da App' },
  { id: 'plans', label: 'Planos' },
  { id: 'evaluations', label: 'Avaliações' },
  { id: 'payments', label: 'Pagamentos' },
  { id: 'habits', label: 'Hábitos' },
  { id: 'special_dates', label: 'Datas Especiais' }
];

const INITIAL_AUTOMATIONS: AutomationItem[] = [
  {
    id: 'auto-7d-treino',
    name: '7 dias sem treinar',
    category: 'training',
    condition: 'Sem treino registado há 7 dias',
    schedule: 'Após 7 dias às 18:00',
    channels: ['email', 'msg', 'whatsapp'],
    isActive: true
  },
  {
    id: 'auto-7d-app',
    name: '7 dias sem ir à app',
    category: 'app_usage',
    condition: 'Sem login / abertura da app há 7 dias',
    schedule: 'Após 7 dias às 11:00',
    channels: ['email', 'msg', 'whatsapp'],
    isActive: true
  },
  {
    id: '1',
    name: 'Término do plano',
    category: 'plans',
    condition: 'Plano termina em 3 dias',
    schedule: '3 dias antes às 09:00',
    channels: ['push', 'email', 'whatsapp'],
    isActive: true
  },
  {
    id: '2',
    name: 'Avaliação agendada',
    category: 'evaluations',
    condition: 'Avaliação física amanhã',
    schedule: '1 dia antes às 18:00',
    channels: ['push', 'msg'],
    isActive: true
  },
  {
    id: '3',
    name: 'Pagamento em falta',
    category: 'payments',
    condition: 'Pagamento em atraso > 1 dia',
    schedule: 'Imediatamente',
    channels: ['email', 'whatsapp', 'msg'],
    isActive: true
  },
  {
    id: '4',
    name: 'Aniversário do aluno',
    category: 'special_dates',
    condition: 'Data de aniversário',
    schedule: 'No próprio dia às 09:00',
    channels: ['whatsapp', 'msg'],
    isActive: false
  },
  {
    id: '5',
    name: 'Sem treino há 3 dias',
    category: 'training',
    condition: 'Sem treino há 3 dias',
    schedule: 'Após 3 dias às 20:00',
    channels: ['push', 'msg'],
    isActive: true
  }
];

const AutomationsView: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationItem[]>(() => {
    try {
      const saved = localStorage.getItem('pr1me_automations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure the 2 new automations exist
          const has7dTreino = parsed.some(a => a.name.toLowerCase().includes('7 dias sem treinar'));
          const has7dApp = parsed.some(a => a.name.toLowerCase().includes('7 dias sem') && a.name.toLowerCase().includes('app'));
          let merged = [...parsed];
          if (!has7dTreino) {
            merged.unshift(INITIAL_AUTOMATIONS[0]);
          }
          if (!has7dApp) {
            merged.splice(1, 0, INITIAL_AUTOMATIONS[1]);
          }
          return merged;
        }
      }
    } catch (e) {}
    return INITIAL_AUTOMATIONS;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for New / Edit Automation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<AutomationItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('training');
  const [formCondition, setFormCondition] = useState('');
  const [formSchedule, setFormSchedule] = useState('');
  const [formChannels, setFormChannels] = useState<('email' | 'msg' | 'whatsapp' | 'push')[]>(['email', 'msg', 'whatsapp']);
  const [formIsActive, setFormIsActive] = useState(true);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pr1me_automations', JSON.stringify(automations));
    } catch (e) {}
  }, [automations]);

  const toggleStatus = (id: string) => {
    setAutomations(automations.map(auto => 
      auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
    ));
  };

  const toggleChannel = (id: string, channel: 'email' | 'msg' | 'whatsapp' | 'push') => {
    setAutomations(automations.map(auto => {
      if (auto.id !== id) return auto;
      const exists = auto.channels.includes(channel);
      const updatedChannels = exists
        ? auto.channels.filter(c => c !== channel)
        : [...auto.channels, channel];
      return { ...auto, channels: updatedChannels };
    }));
  };

  const handleOpenAddModal = () => {
    setEditingAutomation(null);
    setFormName('');
    setFormCategory('training');
    setFormCondition('Sem treino registado há 7 dias');
    setFormSchedule('Após 7 dias às 18:00');
    setFormChannels(['email', 'msg', 'whatsapp']);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (auto: AutomationItem) => {
    setEditingAutomation(auto);
    setFormName(auto.name);
    setFormCategory(auto.category);
    setFormCondition(auto.condition);
    setFormSchedule(auto.schedule);
    setFormChannels(auto.channels);
    setFormIsActive(auto.isActive);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingAutomation) {
      setAutomations(automations.map(auto => 
        auto.id === editingAutomation.id
          ? {
              ...auto,
              name: formName.trim(),
              category: formCategory,
              condition: formCondition.trim(),
              schedule: formSchedule.trim(),
              channels: formChannels.length > 0 ? formChannels : ['email'],
              isActive: formIsActive
            }
          : auto
      ));
    } else {
      const newItem: AutomationItem = {
        id: `auto-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        condition: formCondition.trim() || 'Personalizada',
        schedule: formSchedule.trim() || 'Às 18:00',
        channels: formChannels.length > 0 ? formChannels : ['email', 'msg', 'whatsapp'],
        isActive: formIsActive
      };
      setAutomations([newItem, ...automations]);
    }

    setIsModalOpen(false);
  };

  const handleDuplicate = (auto: AutomationItem) => {
    const duplicated: AutomationItem = {
      ...auto,
      id: `auto-${Date.now()}`,
      name: `${auto.name} (Cópia)`,
      isActive: false
    };
    setAutomations([duplicated, ...automations]);
  };

  const handleDelete = (id: string) => {
    setAutomations(automations.filter(auto => auto.id !== id));
  };

  const filteredAutomations = automations.filter(auto => {
    const matchesCategory = activeCategory === 'all' || auto.category === activeCategory;
    const matchesSearch = auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          auto.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFormChannel = (channel: 'email' | 'msg' | 'whatsapp' | 'push') => {
    setFormChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Zap className="text-primary-500" /> Automações
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gira fluxos automáticos de comunicação e acompanhamento por Email, Mensagem e WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all text-sm shadow-sm">
            <History size={16} />
            <span className="hidden sm:inline">Histórico</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all text-sm shadow-sm">
            <LayoutTemplate size={16} />
            <span className="hidden sm:inline">Templates</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all text-sm cursor-pointer"
          >
            <Plus size={18} />
            Nova Automação
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Categories scrollable rail */}
        <div className="w-full md:w-auto overflow-x-auto pb-2 -mb-2 hide-scrollbar">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Procurar automação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Automations Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 w-16 text-center">Ativa</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Nome da automação</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Condição</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Agendamento</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Canais de Envio (Email / Msg / WhatsApp)</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAutomations.map((auto) => {
                const hasEmail = auto.channels.includes('email');
                const hasMsg = auto.channels.includes('msg');
                const hasWhatsApp = auto.channels.includes('whatsapp');
                const hasPush = auto.channels.includes('push');

                return (
                  <tr key={auto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => toggleStatus(auto.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer ${
                          auto.isActive ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                        title={auto.isActive ? 'Desativar automação' : 'Ativar automação'}
                      >
                        <span 
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            auto.isActive ? 'translate-x-4' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-white">{auto.name}</span>
                        <span className="text-[11px] text-slate-400 capitalize">
                          {CATEGORIES.find(c => c.id === auto.category)?.label || auto.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Filter size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{auto.condition}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{auto.schedule}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {/* Interactive Channels Badges */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        {/* Email */}
                        <button
                          onClick={() => toggleChannel(auto.id, 'email')}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            hasEmail
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60 shadow-xs'
                              : 'bg-slate-100/60 text-slate-400 border-dashed border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                          title={hasEmail ? 'Email ativo (clique para desativar)' : 'Ativar envio por Email'}
                        >
                          <Mail size={13} className={hasEmail ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                          <span>Email</span>
                        </button>

                        {/* Msg / SMS */}
                        <button
                          onClick={() => toggleChannel(auto.id, 'msg')}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            hasMsg
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/60 shadow-xs'
                              : 'bg-slate-100/60 text-slate-400 border-dashed border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                          title={hasMsg ? 'Mensagem ativa (clique para desativar)' : 'Ativar envio por Mensagem / SMS'}
                        >
                          <MessageSquare size={13} className={hasMsg ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                          <span>Msg</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                          onClick={() => toggleChannel(auto.id, 'whatsapp')}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            hasWhatsApp
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 shadow-xs'
                              : 'bg-slate-100/60 text-slate-400 border-dashed border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                          title={hasWhatsApp ? 'WhatsApp ativo (clique para desativar)' : 'Ativar envio por WhatsApp'}
                        >
                          <MessageCircle size={13} className={hasWhatsApp ? 'text-[#25D366]' : 'text-slate-400'} />
                          <span>WhatsApp</span>
                        </button>

                        {/* Push (if present) */}
                        {hasPush && (
                          <button
                            onClick={() => toggleChannel(auto.id, 'push')}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60"
                            title="Push Notification ativa"
                          >
                            <Bell size={13} className="text-amber-500" />
                            <span>Push</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEditModal(auto)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer" 
                          title="Editar Automação"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDuplicate(auto)}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors cursor-pointer" 
                          title="Duplicar"
                        >
                          <Copy size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(auto.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer" 
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAutomations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    Nenhuma automação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            A mostrar <span className="font-bold text-slate-800 dark:text-white">{filteredAutomations.length}</span> automações
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Dica: Clique diretamente nos canais (Email, Msg, WhatsApp) para ativar/desativar rapidamente.</span>
          </div>
        </div>
      </div>

      {/* Modal: Nova / Editar Automação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Zap className="text-primary-500" size={20} />
                {editingAutomation ? 'Editar Automação' : 'Nova Automação'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Nome da Automação
                </label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: 7 dias sem treinar"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Agendamento
                  </label>
                  <input 
                    type="text" 
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value)}
                    placeholder="Ex: Após 7 dias às 18:00"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Condição de Disparo
                </label>
                <input 
                  type="text" 
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                  placeholder="Ex: Sem treino registado há 7 dias"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              {/* Channels Option */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Opções de Envio (Canais de Comunicação)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Email */}
                  <button
                    type="button"
                    onClick={() => toggleFormChannel('email')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      formChannels.includes('email')
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/50 dark:border-blue-500 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 opacity-60'
                    }`}
                  >
                    <Mail size={20} className="mb-1 text-blue-600 dark:text-blue-400" />
                    <span>Email</span>
                    {formChannels.includes('email') && (
                      <span className="mt-1 text-[10px] text-blue-600 flex items-center gap-0.5"><Check size={10} /> Ativo</span>
                    )}
                  </button>

                  {/* Msg / SMS */}
                  <button
                    type="button"
                    onClick={() => toggleFormChannel('msg')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      formChannels.includes('msg')
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 opacity-60'
                    }`}
                  >
                    <MessageSquare size={20} className="mb-1 text-indigo-600 dark:text-indigo-400" />
                    <span>Mensagem</span>
                    {formChannels.includes('msg') && (
                      <span className="mt-1 text-indigo-600 flex items-center gap-0.5"><Check size={10} /> Ativo</span>
                    )}
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => toggleFormChannel('whatsapp')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      formChannels.includes('whatsapp')
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-500 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 opacity-60'
                    }`}
                  >
                    <MessageCircle size={20} className="mb-1 text-[#25D366]" />
                    <span>WhatsApp</span>
                    {formChannels.includes('whatsapp') && (
                      <span className="mt-1 text-emerald-600 flex items-center gap-0.5"><Check size={10} /> Ativo</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white block">Estado da Automação</span>
                  <span className="text-xs text-slate-500">Disparar automaticamente quando as condições forem cumpridas</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formIsActive ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formIsActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all cursor-pointer"
                >
                  Guardar Automação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationsView;
