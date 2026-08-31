import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Client } from '../../types';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, client }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    // In a real app, this would call an API to send the message
    console.log('Sending message to', client.name, ':', message);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Enviar Mensagem</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Para: <span className="font-medium text-slate-700 dark:text-slate-300">{client.name}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none text-slate-800 dark:text-white"
                placeholder="Escreva a sua mensagem aqui..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
          >
            <Send size={16} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModal;
