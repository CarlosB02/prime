import React from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';
import { Client } from '../../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, client }) => {
  if (!isOpen) return null;

  // Limpar o número de telefone para ter apenas dígitos (útil para links tel: e wa.me)
  const phoneNumber = client.contact.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800 p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Contactar Cliente</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <a 
            href={`tel:${phoneNumber}`} 
            className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-2xl font-bold transition-colors"
          >
            <Phone size={20} />
            Ligar
          </a>
          
          <a 
            href={`https://wa.me/${phoneNumber}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold transition-colors shadow-lg shadow-[#25D366]/30"
          >
            <MessageCircle size={20} />
            Contactar via WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
};

export default ContactModal;
