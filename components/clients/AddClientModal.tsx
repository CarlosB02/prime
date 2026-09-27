import React, { useState } from 'react';
import { X, User, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { Client } from '../../types';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'masc',
    plan: '',
    age: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      contact: formData.email, // keeping contact field mapped to email for backward compatibility with types, or we can use email and phone if types allow. Let's send email as contact for now, or combine them if needed. Actually we'll just pass both or combine.
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      plan: formData.plan || 'Plano Personalizado',
      age: formData.age ? parseInt(formData.age, 10) : null,
      status: 'pending',
      progress: 0,
      isNew: true,
      lastActive: 'Agora',
      avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000)}`,
      evaluationStatus: 'pendente',
    });
    setFormData({ name: '', email: '', phone: '', gender: 'masc', plan: '', age: '' });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-xl">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Novo Cliente</h2>
              <p className="text-xs text-slate-500">Adicione os dados base do novo aluno</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all"
                  placeholder="Ex: João Miguel Silva"
                />
                <User size={16} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all"
                    placeholder="exemplo@email.com"
                  />
                  <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Telemóvel <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all"
                    placeholder="912 345 678"
                  />
                  <Phone size={16} className="absolute left-4 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Idade
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl pl-4 pr-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all"
                    placeholder="Ex: 28"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Género
                </label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all appearance-none"
                  >
                    <option value="masc">Masculino</option>
                    <option value="fem">Feminino</option>
                    <option value="prefer_not_to_say">Prefiro não dizer</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Plano de Subscrição
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all"
                  placeholder="Ex: Premium Transformation"
                />
                <FileText size={16} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Criar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
