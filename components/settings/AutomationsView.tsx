import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { CustomBellIcon, CustomChatIcon } from '../icons';

// Mock Data
const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'plans', label: 'Planos' },
  { id: 'payments', label: 'Pagamentos' },
  { id: 'evaluations', label: 'Avaliações' },
  { id: 'habits', label: 'Hábitos' },
  { id: 'training', label: 'Treino' },
  { id: 'app_usage', label: 'Utilização da App' },
  { id: 'achievements', label: 'Conquistas' },
  { id: 'special_dates', label: 'Datas Especiais' }
];

const MOCK_AUTOMATIONS = [
  {
    id: '1',
    name: 'Término do plano',
    category: 'plans',
    condition: 'Plano termina em 3 dias',
    schedule: '3 dias antes às 09:00',
    channels: ['push', 'email'],
    isActive: true
  },
  {
    id: '2',
    name: 'Avaliação agendada',
    category: 'evaluations',
    condition: 'Avaliação física amanhã',
    schedule: '1 dia antes às 18:00',
    channels: ['push', 'chat'],
    isActive: true
  },
  {
    id: '3',
    name: 'Pagamento em falta',
    category: 'payments',
    condition: 'Pagamento em atraso > 1 dia',
    schedule: 'Imediatamente',
    channels: ['email', 'chat'],
    isActive: true
  },
  {
    id: '4',
    name: 'Aniversário do aluno',
    category: 'special_dates',
    condition: 'Data de aniversário',
    schedule: 'No próprio dia às 09:00',
    channels: ['push', 'chat'],
    isActive: false
  },
  {
    id: '5',
    name: 'Sem treino registado',
    category: 'training',
    condition: 'Sem treino há 3 dias',
    schedule: 'Após 3 dias às 20:00',
    channels: ['push'],
    isActive: true
  },
  {
    id: '6',
    name: 'Sem login na app',
    category: 'app_usage',
    condition: 'Sem login há 7 dias',
    schedule: 'Após 7 dias às 12:00',
    channels: ['email'],
    isActive: false
  }
];

const AutomationsView: React.FC = () => {
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStatus = (id: string) => {
    setAutomations(automations.map(auto => 
      auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
    ));
  };

  const filteredAutomations = automations.filter(auto => {
    const matchesCategory = activeCategory === 'all' || auto.category === activeCategory;
    const matchesSearch = auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          auto.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderChannelIcon = (channel: string) => {
    switch (channel) {
      case 'push': return <CustomBellIcon size={14} title="Push Notification" />;
      case 'chat': return <CustomChatIcon size={14} title="Chat" />;
      case 'email': return <Mail size={14} className="text-emerald-500" title="Email" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Zap className="text-primary-500" /> Automações
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gira fluxos automáticos de comunicação e acompanhamento de clientes.
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
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all text-sm">
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
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
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
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 w-16 text-center">Ativa</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Nome da automação</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Condição</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Agendamento</th>
                <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400">Canal</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAutomations.map((auto) => (
                <tr key={auto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => toggleStatus(auto.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                        auto.isActive ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span 
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          auto.isActive ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 dark:text-white">{auto.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-300">{auto.condition}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-300">{auto.schedule}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      {auto.channels.map(channel => (
                        <div key={channel} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {renderChannelIcon(channel)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Duplicar">
                        <Copy size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            A mostrar <span className="font-bold text-slate-800 dark:text-white">{filteredAutomations.length}</span> resultados
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-lg shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
              Seguinte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationsView;
