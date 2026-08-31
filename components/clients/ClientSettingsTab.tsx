import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, FileText, CheckSquare, Plus, 
  Trash2, Edit2, Copy, ChevronLeft, ChevronRight, Activity, AlertCircle, RefreshCw, X, Search
} from 'lucide-react';
import { Client } from '../../types';

interface ClientSettingsTabProps {
  client?: Client;
}

type FormCategory = 'check-ins' | 'daily' | 'periodic' | 'habits';

interface AssignedForm {
  id: string;
  formId: string;
  name: string;
  category: FormCategory;
  type: 'auto' | 'manual';
  autoDays?: number; // Days interval
  autoTime?: string;
  manualDates?: string[]; // YYYY-MM-DD
}

interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  formId: string;
  formName: string;
  category: FormCategory;
  interval?: number;
}

const AVAILABLE_FORMS = [
  { id: 'f1', name: 'Check-in Semanal', category: 'check-ins' },
  { id: 'f2', name: 'Check-in Mensal', category: 'check-ins' },
  { id: 'f3', name: 'Registo de Sono', category: 'daily' },
  { id: 'f4', name: 'Registo de Alimentação', category: 'daily' },
  { id: 'f5', name: 'Avaliação Inicial', category: 'periodic' },
  { id: 'f6', name: 'Avaliação Física', category: 'periodic' },
  { id: 'f7', name: 'Hábitos de Água', category: 'habits' },
];

export const ClientSettingsTab: React.FC<ClientSettingsTabProps> = ({ client }) => {
  // Configuração do Plano
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMonths, setDurationMonths] = useState(3);
  const [endDate, setEndDate] = useState('');

  // Formulários Designados
  const [assignedForms, setAssignedForms] = useState<AssignedForm[]>([
    { id: 'a1', formId: 'f1', name: 'Check-in Semanal', category: 'check-ins', type: 'auto', autoDays: 7, autoTime: '09:00' },
    { id: 'a2', formId: 'f6', name: 'Avaliação Física', category: 'periodic', type: 'auto', autoDays: 30, autoTime: '10:00' },
  ]);

  // Cronograma gerado
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);

  // Modals / UI state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<AssignedForm | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calcula Data de Fim quando Início ou Duração mudam
  useEffect(() => {
    if (startDate && durationMonths) {
      const start = new Date(startDate);
      start.setMonth(start.getMonth() + durationMonths);
      setEndDate(start.toISOString().split('T')[0]);
    }
  }, [startDate, durationMonths]);

  // Totais
  const totalWeeks = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24 * 7)));
  }, [startDate, endDate]);

  const generateSchedule = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const events: ScheduleEvent[] = [];

    assignedForms.forEach(form => {
      if (form.type === 'auto' && form.autoDays && form.autoDays > 0) {
        let current = new Date(start);
        current.setDate(current.getDate() + form.autoDays); // First event after interval
        while (current <= end) {
          events.push({
            id: Math.random().toString(36).substring(7),
            date: current.toISOString().split('T')[0],
            formId: form.formId,
            formName: form.name,
            category: form.category,
            interval: form.autoDays,
          });
          current.setDate(current.getDate() + form.autoDays);
        }
      } else if (form.type === 'manual' && form.manualDates) {
        form.manualDates.forEach(d => {
          const dateObj = new Date(d);
          if (dateObj >= start && dateObj <= end) {
            events.push({
              id: Math.random().toString(36).substring(7),
              date: d,
              formId: form.formId,
              formName: form.name,
              category: form.category,
            });
          }
        });
      }
    });
    
    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setScheduleEvents(events);
  };

  // Indicators
  const plannedCheckins = scheduleEvents.filter(e => e.category === 'check-ins').length;
  const plannedAssessments = scheduleEvents.filter(e => e.category === 'periodic').length;
  const dailyLogsStatus = assignedForms.some(f => f.category === 'daily') ? 'Ativo' : 'Inativo';

  // Utils para Calendário Anual
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  
  const renderCalendarMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(month, currentYear);
    const firstDay = getFirstDayOfMonth(month, currentYear);
    const monthName = new Date(currentYear, month).toLocaleString('pt-PT', { month: 'long' });
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-6 h-6"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvents = scheduleEvents.filter(e => e.date === dateString);
      
      let badgeClass = '';
      if (hasEvents.length > 0) {
        const categories = hasEvents.map(e => e.category);
        if (categories.includes('check-ins')) badgeClass = 'bg-blue-500';
        else if (categories.includes('periodic')) badgeClass = 'bg-purple-500';
        else if (categories.includes('daily') || categories.includes('habits')) badgeClass = 'bg-emerald-500';
        else badgeClass = 'bg-primary-500';
      }

      const isSelected = selectedDate === dateString;

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(dateString)}
          className={`w-6 h-6 flex items-center justify-center text-[10px] rounded-full cursor-pointer relative
            ${isSelected ? 'bg-primary-600 text-white font-bold ring-2 ring-primary-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
            ${hasEvents.length > 0 && !isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}
          `}
        >
          {day}
          {hasEvents.length > 0 && !isSelected && (
            <div className={`absolute bottom-0 w-1 h-1 rounded-full ${badgeClass}`}></div>
          )}
        </div>
      );
    }

    return (
      <div key={month} className="flex flex-col mb-4">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 capitalize">{monthName}</h4>
        <div className="grid grid-cols-7 gap-1">
          {['D','S','T','Q','Q','S','S'].map((d, i) => (
            <div key={i} className="w-6 h-6 flex items-center justify-center text-[9px] text-slate-400 font-medium">{d}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'check-ins': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'periodic': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'daily': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'habits': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'check-ins': return 'Check-ins';
      case 'periodic': return 'Avaliações Periódicas';
      case 'daily': return 'Registos Diários';
      case 'habits': return 'Hábitos';
      default: return category;
    }
  };

  const handleRemoveForm = (id: string) => {
    setAssignedForms(assignedForms.filter(f => f.id !== id));
  };

  const removeEvent = (id: string) => {
    setScheduleEvents(scheduleEvents.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in w-full pb-10">
      
      {/* Barra Superior - Resumo */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              {client?.name || 'Cliente'}
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wide">
              Ativo
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <CalendarIcon size={16} /> 
            Plano: {new Date(startDate).toLocaleDateString('pt-PT')} a {endDate ? new Date(endDate).toLocaleDateString('pt-PT') : '...'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-3/5">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Check-ins</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{plannedCheckins}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avaliações</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{plannedAssessments}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Diários</p>
            <p className={`text-sm font-black mt-2 ${dailyLogsStatus === 'Ativo' ? 'text-emerald-600' : 'text-slate-400'}`}>{dailyLogsStatus}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Semanas</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{totalWeeks}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Config & Formulários */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Configuração do Plano */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary-500" />
              Configuração do Plano
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Data de Início</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duração (Meses)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Data de Fim</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Formulários Designados */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col flex-1">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-blue-500" />
                Formulários Associados
              </h3>
              <button 
                onClick={() => setIsAddFormOpen(true)}
                className="p-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[500px] custom-scrollbar">
              {['check-ins', 'periodic', 'daily', 'habits'].map(category => {
                const forms = assignedForms.filter(f => f.category === category);
                if (forms.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                      {getCategoryLabel(category)}
                    </h4>
                    {forms.map(form => (
                      <div key={form.id} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{form.name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            {form.type === 'auto' ? (
                              <><RefreshCw size={10} /> A cada {form.autoDays} dias às {form.autoTime}</>
                            ) : (
                              <><CalendarIcon size={10} /> Manual ({form.manualDates?.length || 0} datas)</>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingForm(form); setIsEditFormOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleRemoveForm(form.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {assignedForms.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Nenhum formulário associado.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito: Cronograma e Calendário */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Cronograma - Tabela */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col flex-1">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CalendarIcon size={18} className="text-emerald-500" />
                Cronograma Planeado
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Copy size={14} /> Copiar Mensagens
                </button>
                <button 
                  onClick={generateSchedule}
                  className="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw size={14} /> Gerar Cronograma
                </button>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-700/50 h-[500px]">
              
              {/* Tabela */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="overflow-y-auto custom-scrollbar flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-700/50">
                      <tr>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Formulário</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Intervalo</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {scheduleEvents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                            Clique em "Gerar Cronograma" para preencher as datas.
                          </td>
                        </tr>
                      ) : (
                        scheduleEvents.map((event) => (
                          <tr key={event.id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors ${selectedDate === event.date ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}>
                            <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                              {new Date(event.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryColor(event.category)} hidden sm:block`}>
                                  {getCategoryLabel(event.category)}
                                </span>
                                <span className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-[120px] sm:max-w-[200px]">
                                  {event.formName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-500 hidden sm:table-cell">
                              {event.interval ? `${event.interval} dias` : 'Manual'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                onClick={() => removeEvent(event.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 text-xs font-medium text-slate-500 text-center">
                  Total de {scheduleEvents.length} envios planeados ao longo de {totalWeeks} semanas
                </div>
              </div>

              {/* Calendário Anual Simplificado */}
              <div className="w-full lg:w-[280px] flex flex-col p-4 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 py-2 rounded-xl">
                  <button onClick={() => setCurrentYear(y => y - 1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-bold text-slate-800 dark:text-white">{currentYear}</span>
                  <button onClick={() => setCurrentYear(y => y + 1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[...Array(12)].map((_, i) => renderCalendarMonth(i))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase">Legenda</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Check-ins</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Avaliações</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Diários/Hábitos</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* Aqui viriam os modais para Add/Edit Form */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
             <button onClick={() => setIsAddFormOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
               <X size={20} />
             </button>
             <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Associar Formulário</h2>
             
             <div className="space-y-4">
               {AVAILABLE_FORMS.map(f => (
                 <div key={f.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-colors"
                  onClick={() => {
                    const newForm: AssignedForm = {
                      id: Math.random().toString(36).substring(7),
                      formId: f.id,
                      name: f.name,
                      category: f.category as FormCategory,
                      type: 'auto',
                      autoDays: 7,
                      autoTime: '09:00'
                    };
                    setAssignedForms([...assignedForms, newForm]);
                    setIsAddFormOpen(false);
                    setEditingForm(newForm);
                    setIsEditFormOpen(true);
                  }}
                 >
                   <div>
                     <p className="font-bold text-slate-800 dark:text-white text-sm">{f.name}</p>
                     <p className="text-xs text-slate-500">{getCategoryLabel(f.category)}</p>
                   </div>
                   <Plus size={18} className="text-primary-500" />
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {isEditFormOpen && editingForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
             <button onClick={() => { setIsEditFormOpen(false); setEditingForm(null); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
               <X size={20} />
             </button>
             <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Configurar: {editingForm.name}</h2>
             <p className="text-xs text-slate-500 mb-6">Defina como este formulário será distribuído ao longo do plano.</p>
             
             <div className="space-y-6">
               <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                 <button 
                   onClick={() => setEditingForm({...editingForm, type: 'auto'})}
                   className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${editingForm.type === 'auto' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Automático
                 </button>
                 <button 
                   onClick={() => setEditingForm({...editingForm, type: 'manual'})}
                   className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${editingForm.type === 'manual' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Manual
                 </button>
               </div>

               {editingForm.type === 'auto' ? (
                 <div className="space-y-4 animate-fade-in">
                   <div>
                     <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Repetir a cada (dias)</label>
                     <input 
                       type="number" 
                       value={editingForm.autoDays || ''}
                       onChange={(e) => setEditingForm({...editingForm, autoDays: Number(e.target.value)})}
                       className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hora do aviso</label>
                     <input 
                       type="time" 
                       value={editingForm.autoTime || '09:00'}
                       onChange={(e) => setEditingForm({...editingForm, autoTime: e.target.value})}
                       className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                     />
                   </div>
                 </div>
               ) : (
                 <div className="space-y-4 animate-fade-in">
                   <div>
                     <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Adicionar Datas Específicas</label>
                     <div className="flex gap-2 mb-2">
                       <input 
                         type="date" 
                         id="manualDateAdd"
                         className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                       />
                       <button 
                         onClick={() => {
                           const val = (document.getElementById('manualDateAdd') as HTMLInputElement).value;
                           if (val) {
                             const currentDates = editingForm.manualDates || [];
                             if (!currentDates.includes(val)) {
                               setEditingForm({...editingForm, manualDates: [...currentDates, val].sort()});
                             }
                           }
                         }}
                         className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl font-bold transition-colors"
                       >
                         <Plus size={16} />
                       </button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {(editingForm.manualDates || []).map(d => (
                         <div key={d} className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-lg text-xs font-medium">
                           {d}
                           <button 
                             onClick={() => setEditingForm({...editingForm, manualDates: editingForm.manualDates?.filter(x => x !== d)})}
                             className="hover:text-primary-900 dark:hover:text-primary-200"
                           >
                             <X size={12} />
                           </button>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               )}

               <button 
                 onClick={() => {
                   setAssignedForms(assignedForms.map(f => f.id === editingForm.id ? editingForm : f));
                   setIsEditFormOpen(false);
                   setEditingForm(null);
                 }}
                 className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-colors"
               >
                 Guardar Configuração
               </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};
