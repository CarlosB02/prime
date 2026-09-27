import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Users, 
  Search, 
  Filter, 
  Check, 
  ChevronDown,
  Wand2,
  Save,
  Plus
} from 'lucide-react';
import { CustomBellIcon, CustomChatIcon } from '../icons';
import { Client } from '../../types';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

type NotificationType = 'push' | 'chat';

const TEMPLATES = [
  { id: '1', name: 'Boas-vindas', title: 'Bem-vindo(a) à equipa!', message: 'Olá [first_name], bem-vindo(a)! Estamos muito felizes por te ter connosco. Vamos começar a tua transformação!' },
  { id: '2', name: 'Lembrete de Treino', title: 'Hora de Treinar 💪', message: 'Olá [first_name], não te esqueças do teu treino de hoje. Mantém o foco!' },
  { id: '3', name: 'Parabéns', title: 'Feliz Aniversário! 🎂', message: 'Muitos parabéns [first_name]! Que tenhas um dia excelente.' },
];

const VARIABLES = [
  { label: 'Primeiro Nome', value: '[first_name]' },
  { label: 'Último Nome', value: '[last_name]' },
  { label: 'Nome Completo', value: '[full_name]' },
  { label: 'Plano Atual', value: '[plan_name]' },
];

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ isOpen, onClose, clients }) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [type, setType] = useState<NotificationType>('push');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  
  // UI States
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isVariableOpen, setIsVariableOpen] = useState(false);
  
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setSelectedClients([]);
      setType('push');
      setTitle('');
      setMessage('');
      setClientSearch('');
      setIsClientDropdownOpen(false);
      setIsFilterOpen(false);
      setIsTemplateOpen(false);
      setIsVariableOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const toggleClientSelection = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAllActive = () => {
    const activeIds = clients.filter(c => c.status === 'active').map(c => c.id);
    setSelectedClients(activeIds);
    setIsFilterOpen(false);
  };

  const applyFilter = (filterType: string) => {
    let ids: string[] = [];
    switch (filterType) {
      case 'active':
        ids = clients.filter(c => c.status === 'active').map(c => c.id);
        break;
      case 'inactive':
        ids = clients.filter(c => c.status === 'inactive').map(c => c.id);
        break;
      // Mock filters for demonstration since we don't have gender/birthday in the model
      case 'birthday':
        ids = clients.slice(0, 1).map(c => c.id); // Just select the first one as a mock
        break;
      case 'women':
        ids = clients.filter(c => c.name.endsWith('a')).map(c => c.id); // Mock: names ending in 'a'
        break;
      case 'men':
        ids = clients.filter(c => !c.name.endsWith('a')).map(c => c.id); // Mock: names not ending in 'a'
        break;
      default:
        ids = [];
    }
    setSelectedClients(ids);
    setIsFilterOpen(false);
  };

  const insertVariable = (variable: string) => {
    if (messageRef.current) {
      const start = messageRef.current.selectionStart;
      const end = messageRef.current.selectionEnd;
      const newMessage = message.substring(0, start) + variable + message.substring(end);
      setMessage(newMessage);
      
      // Reset cursor position after React re-renders
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.selectionStart = messageRef.current.selectionEnd = start + variable.length;
          messageRef.current.focus();
        }
      }, 0);
    } else {
      setMessage(prev => prev + variable);
    }
    setIsVariableOpen(false);
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setTitle(template.title);
    setMessage(template.message);
    setIsTemplateOpen(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClients.length === 0) {
      alert('Por favor, selecione pelo menos um destinatário.');
      return;
    }
    if (!title.trim() || !message.trim()) {
      alert('Por favor, preencha o título e a mensagem.');
      return;
    }
    
    // Simulate sending
    console.log('Sending notification:', { selectedClients, type, title, message });
    alert(`Notificação enviada com sucesso para ${selectedClients.length} cliente(s)!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BellRing className="text-primary-500" size={24} />
              Enviar Notificação
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Comunique diretamente com os seus clientes.</p>
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
          <form id="notification-form" onSubmit={handleSend} className="space-y-6">
            
            {/* Destinatários */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Destinatários <span className="text-primary-500">*</span>
                </label>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {selectedClients.length} selecionado(s)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Dropdown de Seleção Manual */}
                <div className="relative flex-1" ref={dropdownRef}>
                  <div 
                    className="flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm cursor-pointer hover:border-primary-400 transition-colors"
                    onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                  >
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      {selectedClients.length === 0 
                        ? 'Selecionar clientes...' 
                        : selectedClients.length === 1 
                          ? clients.find(c => c.id === selectedClients[0])?.name 
                          : `${selectedClients.length} clientes selecionados`}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isClientDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-up">
                      <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Procurar cliente..." 
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {filteredClients.length === 0 ? (
                          <div className="p-3 text-center text-sm text-slate-500">Nenhum cliente encontrado.</div>
                        ) : (
                          filteredClients.map(client => (
                            <div 
                              key={client.id}
                              onClick={() => toggleClientSelection(client.id)}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedClients.includes(client.id) ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                {selectedClients.includes(client.id) && <Check size={14} strokeWidth={3} />}
                              </div>
                              <img src={client.avatar} alt={client.name} className="w-6 h-6 rounded-full" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{client.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões Rápidos */}
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={selectAllActive}
                    className="flex items-center justify-center px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    <Users size={16} className="mr-2" />
                    Todos Ativos
                  </button>
                  
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      title="Filtrar Clientes"
                    >
                      <Filter size={18} />
                    </button>
                    
                    {isFilterOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-2 animate-fade-in-up">
                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtros Rápidos</div>
                        <button type="button" onClick={() => applyFilter('active')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Clientes Ativos</button>
                        <button type="button" onClick={() => applyFilter('inactive')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Clientes Inativos</button>
                        <button type="button" onClick={() => applyFilter('birthday')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Aniversariantes</button>
                        <button type="button" onClick={() => applyFilter('women')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Mulheres</button>
                        <button type="button" onClick={() => applyFilter('men')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Homens</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tipo de Notificação */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tipo de Notificação
              </label>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('push')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    type === 'push' 
                      ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <CustomBellIcon size={16} />
                  Push Notification
                </button>
                <button
                  type="button"
                  onClick={() => setType('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    type === 'chat' 
                      ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <CustomChatIcon size={16} />
                  Mensagem no Chat
                </button>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Título <span className="text-primary-500">*</span>
                </label>
                
                {/* Templates Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsTemplateOpen(!isTemplateOpen)}
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <Wand2 size={14} />
                    Usar Template
                  </button>
                  
                  {isTemplateOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-2 animate-fade-in-up">
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Templates Guardados</div>
                      {TEMPLATES.map(t => (
                        <button 
                          key={t.id}
                          type="button" 
                          onClick={() => applyTemplate(t)} 
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <div className="font-medium">{t.name}</div>
                          <div className="text-xs text-slate-500 truncate">{t.title}</div>
                        </button>
                      ))}
                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                        <button type="button" className="w-full text-left px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium flex items-center gap-2">
                          <Save size={14} />
                          Guardar como novo template
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                placeholder="Ex: Novo Plano Disponível!"
              />
            </div>

            {/* Mensagem */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mensagem <span className="text-primary-500">*</span>
                </label>
                
                {/* Variáveis Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsVariableOpen(!isVariableOpen)}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md transition-colors"
                  >
                    <Plus size={12} />
                    Inserir Variável
                  </button>
                  
                  {isVariableOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-2 animate-fade-in-up">
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Variáveis Dinâmicas</div>
                      {VARIABLES.map(v => (
                        <button 
                          key={v.value}
                          type="button" 
                          onClick={() => insertVariable(v.value)} 
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex justify-between items-center"
                        >
                          <span>{v.label}</span>
                          <span className="text-xs font-mono text-slate-400">{v.value}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  ref={messageRef}
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  placeholder="Escreva a sua mensagem aqui..."
                />
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center pointer-events-none">
                  <span className="text-xs text-slate-400 bg-white/80 dark:bg-slate-800/80 px-1 rounded">
                    Dica: Use as variáveis para personalizar a mensagem.
                  </span>
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
            form="notification-form"
            type="submit"
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 active:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Send size={18} />
            Enviar Notificação
          </button>
        </div>

      </div>
    </div>
  );
};

export default SendNotificationModal;
