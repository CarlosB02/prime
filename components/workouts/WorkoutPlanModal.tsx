import React, { useState, useEffect } from 'react';
import { X, Save, Layers, Clock } from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';

interface WorkoutPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const WorkoutPlanModal: React.FC<WorkoutPlanModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [useDates, setUseDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usePeriodization, setUsePeriodization] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setUseDates(!!(initialData.startDate || initialData.endDate));
      setStartDate(initialData.startDate || '');
      setEndDate(initialData.endDate || '');
      setUsePeriodization(initialData.hasWeeklyPeriodization || false);
    } else {
      setName('');
      setUseDates(false);
      setStartDate('');
      setEndDate('');
      setUsePeriodization(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name,
      startDate: useDates ? startDate : undefined,
      endDate: useDates ? endDate : undefined,
      hasWeeklyPeriodization: usePeriodization,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {initialData ? 'Editar Plano de Treino' : 'Novo Plano de Treino'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <form id="workout-plan-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome do Plano
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Ex: Plano Hipertrofia Avançado"
              />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Opções Adicionais
              </h3>
              
              {/* Dates Option */}
              <div className={`p-4 rounded-xl border transition-all ${useDates ? 'bg-primary-50/50 border-primary-200 dark:bg-primary-900/10 dark:border-primary-800/50' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      id="useDates"
                      checked={useDates}
                      onChange={(e) => setUseDates(e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-white border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="useDates" className="block text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Definir Datas
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
                      Se não definir datas, o plano será contínuo (sem término).
                    </p>
                    
                    {useDates && (
                      <div className="grid grid-cols-2 gap-3 animate-fade-in">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Data de Início
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                              <CustomCalendarIcon size={14} />
                            </span>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Data de Término
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                              <CustomCalendarIcon size={14} />
                            </span>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="workout-plan-form"
            className="flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary-500/25"
          >
            <Save size={18} className="mr-2" />
            Guardar Plano
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanModal;
