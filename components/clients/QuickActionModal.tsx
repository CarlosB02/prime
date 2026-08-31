import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CreditCard, 
  Gift, 
  UserMinus,
  MessageSquare,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Client } from '../../types';

export type QuickActionModalType = 'payment_expiring' | 'birthday' | 'inactive_suspended' | null;

interface QuickActionModalProps {
  type: QuickActionModalType;
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

const QuickActionModal: React.FC<QuickActionModalProps> = ({ type, isOpen, onClose, clients }) => {
  const [activeMessageClient, setActiveMessageClient] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  if (!isOpen || !type) return null;

  const handleOpenMessage = (client: Client, defaultMessage: string) => {
    setActiveMessageClient(client.id);
    const personalizedMessage = defaultMessage
      .replace('[first_name]', client.name.split(' ')[0])
      .replace('[last_name]', client.name.split(' ').slice(1).join(' '));
    setMessageText(personalizedMessage);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    alert(`Mensagem enviada com sucesso!`);
    setActiveMessageClient(null);
    setMessageText('');
  };

  const renderPaymentExpiring = () => {
    const expiringClients = clients.filter(c => c.paymentStatus === 'a_expirar');
    
    return (
      <div className="space-y-4">
        {expiringClients.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Nenhum cliente com pagamento a expirar.</div>
        ) : (
          expiringClients.map(client => {
            // Calculate days remaining mock
            const daysRemaining = client.paymentExpiryDate 
              ? Math.ceil((new Date(client.paymentExpiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
              : 7;

            return (
              <div key={client.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{client.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{client.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md inline-block mb-1">
                      Expira em {daysRemaining} dias
                    </div>
                    <div className="text-[10px] text-slate-400">{client.paymentExpiryDate}</div>
                  </div>
                </div>
                
                {activeMessageClient === client.id ? (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                    <textarea 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full text-sm p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md resize-none focus:ring-1 focus:ring-primary-500 outline-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => setActiveMessageClient(null)}
                        className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleSendMessage}
                        className="text-xs px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-md transition-colors flex items-center gap-1"
                      >
                        <Send size={12} /> Enviar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleOpenMessage(client, 'Olá [first_name], o seu plano está prestes a expirar. Caso queira renovar, entre em contacto connosco.')}
                    className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                  >
                    <MessageSquare size={14} />
                    Enviar mensagem automática
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderBirthdays = () => {
    const todayStr = new Date().toISOString().slice(5, 10);
    const birthdayClients = clients.filter(c => c.birthday === todayStr);

    return (
      <div className="space-y-4">
        {birthdayClients.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Nenhum aniversariante hoje.</div>
        ) : (
          birthdayClients.map(client => (
            <div key={client.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                      {client.name}
                      {client.age && <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{client.age} anos</span>}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{client.plan}</p>
                  </div>
                </div>
                <Gift className="text-purple-500 opacity-20" size={24} />
              </div>

              {activeMessageClient === client.id ? (
                <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                  <textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full text-sm p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md resize-none focus:ring-1 focus:ring-primary-500 outline-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={() => setActiveMessageClient(null)}
                      className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      className="text-xs px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-md transition-colors flex items-center gap-1"
                    >
                      <Send size={12} /> Enviar
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleOpenMessage(client, 'Parabéns [first_name]! 🎉\nA equipa deseja-lhe um excelente aniversário e um ótimo ano de treinos.')}
                  className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                >
                  <MessageSquare size={14} />
                  Enviar mensagem automática
                </button>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderInactiveSuspended = () => {
    const inactiveClients = clients.filter(c => c.status === 'inactive');
    const suspendedClients = clients.filter(c => c.status === 'warning');

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inativos */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            Clientes Inativos ({inactiveClients.length})
          </h3>
          <div className="space-y-3">
            {inactiveClients.length === 0 ? (
              <div className="text-xs text-slate-500 italic">Nenhum cliente inativo.</div>
            ) : (
              inactiveClients.map(client => (
                <div key={client.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <img src={client.avatar} alt={client.name} className="w-8 h-8 rounded-full grayscale opacity-70" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate">{client.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{client.plan}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {client.lastActive}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suspensos / Atenção */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Clientes Suspensos ({suspendedClients.length})
          </h3>
          <div className="space-y-3">
            {suspendedClients.length === 0 ? (
              <div className="text-xs text-slate-500 italic">Nenhum cliente suspenso.</div>
            ) : (
              suspendedClients.map(client => (
                <div key={client.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-xl shadow-sm">
                  <img src={client.avatar} alt={client.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm truncate">{client.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{client.plan}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                      <AlertCircle size={10} /> Atenção
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const getModalConfig = () => {
    switch (type) {
      case 'payment_expiring':
        return {
          title: 'Pagamentos a Expirar (7 dias)',
          icon: <CreditCard className="text-rose-500" size={20} />,
          content: renderPaymentExpiring()
        };
      case 'birthday':
        return {
          title: 'Aniversariantes de Hoje',
          icon: <Gift className="text-purple-500" size={20} />,
          content: renderBirthdays()
        };
      case 'inactive_suspended':
        return {
          title: 'Inativos ou Suspensos',
          icon: <UserMinus className="text-slate-500" size={20} />,
          content: renderInactiveSuspended()
        };
      default:
        return { title: '', icon: null, content: null };
    }
  };

  const config = getModalConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {config.icon}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {config.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {config.content}
        </div>
      </div>
    </div>
  );
};

export default QuickActionModal;
