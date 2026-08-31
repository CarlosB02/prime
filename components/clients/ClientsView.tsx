import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Users,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  ClipboardCheck,
  BellRing,
  Activity,
  UserPlus,
  Clock,
  AlertCircle,
  CreditCard,
  Gift,
  UserMinus,
  Maximize2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Client } from '../../types';
import { MOCK_CLIENTS } from '../../constants';
import SendNotificationModal from './SendNotificationModal';
import QuickActionModal, { QuickActionModalType } from './QuickActionModal';
import ClientDetailsView from './ClientDetailsView';
import SendMessageModal from './SendMessageModal';

type QuickFilterType = 
  | 'all'
  | 'active'
  | 'evaluation_pending_validation'
  | 'new_pending_validation'
  | 'evaluation_pending'
  | 'payment_expired'
  | 'payment_expiring'
  | 'birthday'
  | 'inactive_suspended';

const ClientsView: React.FC = () => {
  const [user] = useAuthState(auth);
  
  // Firebase Data
  const clientsRef = collection(db, 'clients');
  // For the admins (Carlos and Renato), we can just fetch all clients in this private instance
  const q = query(clientsRef);
  const [firebaseClients, loading, error] = useCollectionData(q, { idField: 'id' });
  
  const clients = (firebaseClients as Client[]) || [];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState<string>('todos');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [quickActionModalType, setQuickActionModalType] = useState<QuickActionModalType>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [contactModalClient, setContactModalClient] = useState<Client | null>(null);
  const [messageModalClient, setMessageModalClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayStr = new Date().toISOString().slice(5, 10); // MM-DD

  const quickFilters = useMemo(() => {
    return [
      { id: 'active', label: 'Ativos', icon: Activity, count: clients.filter(c => c.status === 'active').length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
      { id: 'evaluation_pending_validation', label: 'Avaliação por validar', icon: ClipboardCheck, count: clients.filter(c => c.evaluationStatus === 'por_validar').length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
      { id: 'new_pending_validation', label: 'Novos por validar', icon: UserPlus, count: clients.filter(c => c.isNew && c.evaluationStatus === 'por_validar').length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'evaluation_pending', label: 'Avaliação pendente', icon: Clock, count: clients.filter(c => c.evaluationStatus === 'pendente').length, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
      { id: 'payment_expired', label: 'Pagamento expirado', icon: AlertCircle, count: clients.filter(c => c.paymentStatus === 'expirado').length, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
      { id: 'payment_expiring', label: 'Pagamento a expirar', icon: CreditCard, count: clients.filter(c => c.paymentStatus === 'a_expirar').length, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
      { id: 'birthday', label: 'Aniversariantes hoje', icon: Gift, count: clients.filter(c => c.birthday === todayStr).length, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
      { id: 'inactive_suspended', label: 'Inativos ou suspensos', icon: UserMinus, count: clients.filter(c => c.status === 'inactive' || c.status === 'warning').length, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-200 dark:bg-slate-800' },
    ];
  }, [clients, todayStr]);

  const filteredClients = useMemo(() => {
    let result = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            client.plan.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesTableFilter = true;
      switch (tableFilter) {
        case 'ativos': matchesTableFilter = client.status === 'active'; break;
        case 'atencao': matchesTableFilter = client.status === 'warning'; break;
        case 'renovacoes': matchesTableFilter = client.paymentStatus === 'a_expirar' || client.paymentStatus === 'expirado'; break;
        case 'sem_login': matchesTableFilter = !client.lastActive || client.lastActive === 'Nunca'; break;
        case 'novos': matchesTableFilter = !!client.isNew; break;
        case 'aniversarios': matchesTableFilter = client.birthday === todayStr; break;
        case 'todos': default: matchesTableFilter = true; break;
      }
      
      let matchesQuickFilter = true;
      switch (quickFilter) {
        case 'active': matchesQuickFilter = client.status === 'active'; break;
        case 'evaluation_pending_validation': matchesQuickFilter = client.evaluationStatus === 'por_validar'; break;
        case 'new_pending_validation': matchesQuickFilter = !!client.isNew && client.evaluationStatus === 'por_validar'; break;
        case 'evaluation_pending': matchesQuickFilter = client.evaluationStatus === 'pendente'; break;
        case 'payment_expired': matchesQuickFilter = client.paymentStatus === 'expirado'; break;
        case 'payment_expiring': matchesQuickFilter = client.paymentStatus === 'a_expirar'; break;
        case 'birthday': matchesQuickFilter = client.birthday === todayStr; break;
        case 'inactive_suspended': matchesQuickFilter = client.status === 'inactive' || client.status === 'warning'; break;
        case 'all': default: matchesQuickFilter = true; break;
      }
      
      return matchesSearch && matchesTableFilter && matchesQuickFilter;
    });

    if (sortDirection) {
      result = [...result].sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    }

    return result;
  }, [clients, searchQuery, tableFilter, quickFilter, todayStr, sortDirection]);

  const toggleSort = () => {
    if (sortDirection === null) setSortDirection('asc');
    else if (sortDirection === 'asc') setSortDirection('desc');
    else setSortDirection(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'inactive': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'warning': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'inactive': return 'Inativo';
      case 'warning': return 'Atenção';
      default: return status;
    }
  };

  const isExpiringSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const expiryDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7 && expiryDate > today;
  };

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    const expiryDate = new Date(dateStr);
    const today = new Date();
    return expiryDate < today;
  };

  const formatDateWithoutYear = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }).replace('.', '');
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDelete = async () => {
    if (clientToDelete && clientToDelete.id) {
      try {
        await deleteDoc(doc(db, 'clients', clientToDelete.id));
        setClientToDelete(null);
      } catch (e) {
        console.error("Erro ao eliminar cliente:", e);
        alert("Não foi possível eliminar o cliente.");
      }
    }
  };

  const confirmSuspend = async () => {
    if (clientToDelete && clientToDelete.id) {
      try {
        await updateDoc(doc(db, 'clients', clientToDelete.id), {
          status: 'warning'
        });
        setClientToDelete(null);
      } catch (e) {
        console.error("Erro ao suspender cliente:", e);
        alert("Não foi possível suspender o cliente.");
      }
    }
  };

  // Temporary function to seed database if empty
  const seedDatabase = async () => {
    if (!user) return;
    try {
      for (const client of MOCK_CLIENTS) {
        const clientData = { ...client, ownerId: user.uid, createdAt: new Date() };
        // Remove the hardcoded ID so Firestore generates one
        delete (clientData as any).id;
        await addDoc(collection(db, 'clients'), clientData);
      }
      alert("Clientes migrados com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao migrar clientes.");
    }
  };

  if (selectedClient) {
    return (
      <ClientDetailsView 
        client={selectedClient} 
        onBack={() => setSelectedClient(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
        
        {/* Left: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[280px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar clientes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          {clients.length === 0 && (
            <button 
              onClick={seedDatabase}
              className="flex items-center px-4 py-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl font-medium text-sm hover:bg-indigo-200 transition-all"
            >
              <RotateCcw size={18} className="mr-2" />
              Migrar Dados (Teste)
            </button>
          )}
          <button 
            onClick={() => setIsNotificationModalOpen(true)}
            className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <BellRing size={18} className="mr-2 text-primary-500" />
            Enviar Notificação
          </button>
          <button 
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Quick Filters Area */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {quickFilters.map((filter) => {
          const isActive = quickFilter === filter.id;
          const Icon = filter.icon;
          return (
            <div
              key={filter.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (filter.id === 'inactive_suspended') {
                    setQuickActionModalType('inactive_suspended');
                  } else {
                    setQuickFilter(isActive ? 'all' : filter.id as QuickFilterType);
                  }
                }
              }}
              onClick={() => {
                if (filter.id === 'inactive_suspended') {
                  setQuickActionModalType('inactive_suspended');
                } else {
                  setQuickFilter(isActive ? 'all' : filter.id as QuickFilterType);
                }
              }}
              className={`relative flex flex-col items-start py-3 px-4 rounded-2xl border transition-all duration-300 group overflow-hidden text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 border-primary-500 shadow-lg shadow-primary-500/10 scale-[1.02] ring-1 ring-primary-500' 
                  : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
              }`}
            >
              {/* Background gradient for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent dark:from-primary-500/10" />
              )}
              
              <div className="flex items-center justify-between w-full mb-2 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : `${filter.bg} ${filter.color}`}`}>
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className={`block text-2xl font-black tracking-tight transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-800 dark:text-white'}`}>
                    {filter.count}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {['payment_expiring', 'birthday'].includes(filter.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickActionModalType(filter.id as QuickActionModalType);
                      }}
                      className={`p-1.5 rounded-lg transition-colors bg-slate-100 dark:bg-slate-800 ${
                        isActive 
                          ? 'text-primary-600 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/50' 
                          : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                      title="Ver detalhes"
                    >
                      <Maximize2 size={14} />
                    </button>
                  )}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  )}
                </div>
              </div>
              
              <div className="relative z-10">
                <span className={`block text-[10px] font-bold leading-tight uppercase tracking-wider transition-colors ${isActive ? 'text-primary-700/80 dark:text-primary-300/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {filter.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Filters */}
      <div className="flex flex-wrap gap-2 pt-2">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'ativos', label: 'Ativos' },
          { id: 'atencao', label: 'Atenção' },
          { id: 'renovacoes', label: 'Renovações' },
          { id: 'sem_login', label: 'Sem Login' },
          { id: 'novos', label: 'Novos' },
          { id: 'aniversarios', label: 'Aniversários' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setTableFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              tableFilter === filter.id
                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider items-center">
          <div className="col-span-1 hidden xl:block">ID</div>
          <div 
            className="col-span-8 sm:col-span-5 md:col-span-4 lg:col-span-3 xl:col-span-3 flex items-center gap-1 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors select-none"
            onClick={toggleSort}
          >
            Nome
            <div className="flex flex-col">
              <ArrowUp size={10} className={`${sortDirection === 'asc' ? 'text-primary-500' : 'opacity-30'}`} />
              <ArrowDown size={10} className={`-mt-1 ${sortDirection === 'desc' ? 'text-primary-500' : 'opacity-30'}`} />
            </div>
          </div>
          <div className="col-span-3 hidden sm:block md:col-span-2 lg:col-span-2 xl:col-span-1">Estado</div>
          <div className="col-span-1 hidden lg:flex justify-center" title="Pagante"><CheckCircle2 size={16} /></div>
          <div className="col-span-1 hidden lg:flex justify-center" title="Subscrição"><RotateCcw size={16} /></div>
          <div className="col-span-1 hidden xl:block text-center">Avaliação</div>
          <div className="col-span-1 hidden xl:block text-center">Pagamento</div>
          <div className="col-span-3 hidden md:block lg:col-span-2 xl:col-span-1 text-center">Plano</div>
          <div className="col-span-1 hidden lg:flex justify-center" title="Contacto"><Phone size={16} /></div>
          <div className="col-span-4 sm:col-span-4 md:col-span-3 lg:col-span-2 xl:col-span-1 text-right">Ações</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
          {filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Users size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sem clientes encontrados</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">Não existem clientes que correspondam à sua pesquisa.</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div 
                key={client.id} 
                onClick={() => setSelectedClient(client)}
                className="group grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                {/* ID */}
                <div className="col-span-1 hidden xl:block">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">#{client.id.padStart(4, '0')}</span>
                </div>

                {/* Client Info */}
                <div className="col-span-8 sm:col-span-5 md:col-span-4 lg:col-span-3 xl:col-span-3 flex items-center gap-3">
                  <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{client.name}</h3>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-3 hidden sm:block md:col-span-2 lg:col-span-2 xl:col-span-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-emerald-500' : client.status === 'warning' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${getStatusColor(client.status)}`}>
                      {getStatusLabel(client.status)}
                    </span>
                  </div>
                </div>

                {/* Pagante */}
                <div className="col-span-1 hidden lg:flex justify-center">
                  {client.isPaying ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" title="Pagante">
                      <CheckCircle2 size={14} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500" title="Não Pagante">
                      <XCircle size={14} />
                    </div>
                  )}
                </div>

                {/* Subscrição */}
                <div className="col-span-1 hidden lg:flex justify-center">
                  {client.hasSubscription ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" title="Com Subscrição">
                      <RotateCcw size={14} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500" title="Sem Subscrição">
                      <XCircle size={14} />
                    </div>
                  )}
                </div>

                {/* Próxima Avaliação */}
                <div className="col-span-1 hidden xl:flex justify-center">
                  {client.nextEvaluationDate ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span>{formatDateWithoutYear(client.nextEvaluationDate)}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </div>

                {/* Próximo Pagamento */}
                <div className="col-span-1 hidden xl:flex justify-center">
                  {client.paymentExpiryDate ? (
                    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${
                      isExpired(client.paymentExpiryDate) 
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium' 
                        : isExpiringSoon(client.paymentExpiryDate)
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 font-medium'
                          : 'text-slate-600 dark:text-slate-300 font-medium'
                    }`}>
                      <span>{formatDateWithoutYear(client.paymentExpiryDate)}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </div>

                {/* Plan */}
                <div className="col-span-3 hidden md:flex lg:col-span-2 xl:col-span-1 justify-center">
                  <div className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-wide" title={client.plan}>
                    {client.plan.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Contacto */}
                <div className="col-span-1 hidden lg:flex justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setContactModalClient(client);
                    }}
                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" 
                    title="Ver Contacto"
                  >
                    <Phone size={16} />
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-4 sm:col-span-4 md:col-span-3 lg:col-span-2 xl:col-span-1 flex justify-end items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessageModalClient(client);
                      }}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Enviar Mensagem">
                      <MessageSquare size={16} />
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SendNotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        clients={clients}
      />

      <QuickActionModal
        type={quickActionModalType}
        isOpen={quickActionModalType !== null}
        onClose={() => setQuickActionModalType(null)}
        clients={clients}
      />

      {messageModalClient && (
        <SendMessageModal
          isOpen={!!messageModalClient}
          onClose={() => setMessageModalClient(null)}
          client={messageModalClient}
        />
      )}

      {/* Delete/Suspend Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Eliminar Cliente
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Tem a certeza que deseja eliminar o cliente <span className="font-bold">{clientToDelete.name}</span>? Esta ação não pode ser desfeita.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  <Trash2 size={18} />
                  Eliminar definitivamente
                </button>
                <button 
                  onClick={confirmSuspend}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400 rounded-xl font-medium transition-colors"
                >
                  <AlertCircle size={18} />
                  Suspender cliente
                </button>
                <button 
                  onClick={() => setClientToDelete(null)}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <Phone size={28} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                Contacto
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {contactModalClient.name}
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6">
                <a 
                  href={`tel:${contactModalClient.contact}`}
                  className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:underline tracking-wide"
                >
                  {contactModalClient.contact}
                </a>
              </div>

              <div className="flex gap-3">
                <a 
                  href={`tel:${contactModalClient.contact}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                >
                  <Phone size={18} />
                  Ligar
                </a>
                <button 
                  onClick={() => setContactModalClient(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
