import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, FileText, ChevronDown, ChevronRight, Download, 
  Eye, Edit2, Trash2, X, AlertTriangle, CheckCircle, Info, UploadCloud,
  ChevronLeft, FileSpreadsheet, Activity, Stethoscope
} from 'lucide-react';
import { Client } from '../../types';

interface ClientExamsTabProps {
  client?: Client;
}

type ExamStatus = 'em_analise' | 'concluido' | 'revisto' | 'draft';
type ParamStatus = 'normal' | 'atencao' | 'fora' | 'pendente';

interface ExamParam {
  id: string;
  name: string;
  ref: string; // Reference interval
  prev?: string;
  value: string;
  unit: string;
  status: ParamStatus;
}

interface ExamArea {
  id: string;
  name: string;
  params: ExamParam[];
}

interface ExamRecord {
  id: string;
  name: string;
  date: string;
  status: ExamStatus;
  desc: string;
  areas: ExamArea[];
}

const TEMPLATE_AREAS: ExamArea[] = [
  {
    id: 'a1',
    name: 'Hemograma Completo',
    params: [
      { id: 'p1', name: 'Eritrócitos', ref: '4.5 - 5.9', value: '', unit: 'x10^12/L', status: 'pendente' },
      { id: 'p2', name: 'Hemoglobina', ref: '13.5 - 17.5', value: '', unit: 'g/dL', status: 'pendente' },
      { id: 'p3', name: 'Hematócrito', ref: '41.0 - 53.0', value: '', unit: '%', status: 'pendente' },
      { id: 'p4', name: 'Leucócitos', ref: '4.5 - 11.0', value: '', unit: 'x10^9/L', status: 'pendente' },
    ]
  },
  {
    id: 'a2',
    name: 'Perfil Lipídico',
    params: [
      { id: 'p5', name: 'Colesterol Total', ref: '< 190', value: '', unit: 'mg/dL', status: 'pendente' },
      { id: 'p6', name: 'Triglicéridos', ref: '< 150', value: '', unit: 'mg/dL', status: 'pendente' },
      { id: 'p7', name: 'Colesterol HDL', ref: '> 40', value: '', unit: 'mg/dL', status: 'pendente' },
      { id: 'p8', name: 'Colesterol LDL', ref: '< 115', value: '', unit: 'mg/dL', status: 'pendente' },
    ]
  },
  {
    id: 'a3',
    name: 'Função Hepática',
    params: [
      { id: 'p9', name: 'AST / TGO', ref: '< 40', value: '', unit: 'U/L', status: 'pendente' },
      { id: 'p10', name: 'ALT / TGP', ref: '< 41', value: '', unit: 'U/L', status: 'pendente' },
      { id: 'p11', name: 'Gama GT', ref: '< 60', value: '', unit: 'U/L', status: 'pendente' },
    ]
  }
];

const MOCK_EXAMS: ExamRecord[] = [
  {
    id: '1',
    name: 'Análises de Rotina (Semestre 1)',
    date: '2024-03-15',
    status: 'revisto',
    desc: 'Hemograma, Perfil Lipídico, Função Hepática',
    areas: [
      {
        id: 'a2',
        name: 'Perfil Lipídico',
        params: [
          { id: 'p5', name: 'Colesterol Total', ref: '< 190', prev: '195', value: '185', unit: 'mg/dL', status: 'normal' },
          { id: 'p6', name: 'Triglicéridos', ref: '< 150', prev: '160', value: '142', unit: 'mg/dL', status: 'normal' },
          { id: 'p8', name: 'Colesterol LDL', ref: '< 115', prev: '125', value: '120', unit: 'mg/dL', status: 'atencao' },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Check-up Hormonal',
    date: '2024-06-10',
    status: 'concluido',
    desc: 'Testosterona, Cortisol, Tiroide',
    areas: [
      {
        id: 'h1',
        name: 'Hormonas',
        params: [
          { id: 'h_p1', name: 'Testosterona Total', ref: '2.5 - 8.4', value: '9.1', unit: 'ng/mL', status: 'fora' },
          { id: 'h_p2', name: 'Cortisol (8h)', ref: '4.8 - 19.5', value: '18.2', unit: 'µg/dL', status: 'normal' },
        ]
      }
    ]
  }
];

export const ClientExamsTab: React.FC<ClientExamsTabProps> = ({ client }) => {
  const [exams, setExams] = useState<ExamRecord[]>(MOCK_EXAMS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [editingExam, setEditingExam] = useState<ExamRecord | null>(null);
  
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setStatusFilter('');
    setAreaFilter('');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'em_analise': return { label: 'Em análise', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'concluido': return { label: 'Concluído', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'revisto': return { label: 'Revisto', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
      case 'draft': return { label: 'Rascunho', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
      default: return { label: status, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  const getParamStatusConfig = (status: string) => {
    switch (status) {
      case 'normal': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
      case 'atencao': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'fora': return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
      default: return { icon: Info, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' };
    }
  };

  const handleCreateNew = () => {
    const newAreas = JSON.parse(JSON.stringify(TEMPLATE_AREAS)).map((area: any) => {
      return {
        ...area,
        params: area.params.map((param: any) => {
          let prevValue = undefined;
          const sortedExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          for (const ex of sortedExams) {
             const prevArea = ex.areas.find(a => a.id === area.id);
             if (prevArea) {
               const prevParam = prevArea.params.find(p => p.id === param.id);
               if (prevParam && prevParam.value) {
                 prevValue = prevParam.value;
                 break;
               }
             }
          }
          return { ...param, prev: prevValue };
        })
      };
    });

    const newExam: ExamRecord = {
      id: Math.random().toString(36).substring(7),
      name: 'Novo Exame',
      date: new Date().toISOString().split('T')[0],
      status: 'em_analise',
      desc: '',
      areas: newAreas
    };
    const initialExpanded = newExam.areas.reduce((acc, area) => ({ ...acc, [area.id]: true }), {});
    setExpandedAreas(initialExpanded);
    setEditingExam(newExam);
    setViewMode('edit');
  };

  const handleEdit = (exam: ExamRecord) => {
    setEditingExam(JSON.parse(JSON.stringify(exam)));
    const initialExpanded = exam.areas.reduce((acc, area) => ({ ...acc, [area.id]: true }), {});
    setExpandedAreas(initialExpanded);
    setViewMode('edit');
  };

  const handleDelete = (examId: string) => {
    setExams(exams.filter(e => e.id !== examId));
  };

  const handleSave = (status: ExamStatus) => {
    if (editingExam) {
      const examToSave = { ...editingExam, status };
      if (exams.find(e => e.id === examToSave.id)) {
        setExams(exams.map(e => e.id === examToSave.id ? examToSave : e));
      } else {
        setExams([examToSave, ...exams]);
      }
      setViewMode('list');
      setEditingExam(null);
    }
  };

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  const updateParam = (areaId: string, paramId: string, field: keyof ExamParam, value: string) => {
    if (!editingExam) return;
    setEditingExam(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        areas: prev.areas.map(a => {
          if (a.id !== areaId) return a;
          return {
            ...a,
            params: a.params.map(p => {
              if (p.id !== paramId) return p;
              let newParam = { ...p, [field]: value };
              
              if (field === 'value' && value) {
                const numVal = parseFloat(value.replace(',', '.'));
                if (!isNaN(numVal)) {
                  let isNormal = true;
                  if (p.ref.includes('<=')) {
                    const max = parseFloat(p.ref.replace('<=', '').trim());
                    if (numVal > max) isNormal = false;
                  } else if (p.ref.includes('<')) {
                    const max = parseFloat(p.ref.replace('<', '').trim());
                    if (numVal >= max) isNormal = false;
                  } else if (p.ref.includes('>=')) {
                    const min = parseFloat(p.ref.replace('>=', '').trim());
                    if (numVal < min) isNormal = false;
                  } else if (p.ref.includes('>')) {
                    const min = parseFloat(p.ref.replace('>', '').trim());
                    if (numVal <= min) isNormal = false;
                  } else if (p.ref.includes('-')) {
                    const parts = p.ref.split('-');
                    if (parts.length === 2) {
                       const min = parseFloat(parts[0].trim());
                       const max = parseFloat(parts[1].trim());
                       if (numVal < min || numVal > max) isNormal = false;
                    }
                  }
                  newParam.status = isNormal ? 'normal' : 'fora';
                }
              }
              return newParam;
            })
          };
        })
      };
    });
  };

  const getExamSummary = (exam: ExamRecord) => {
    let normal = 0, atencao = 0, fora = 0;
    exam.areas.forEach(a => {
      a.params.forEach(p => {
        if (p.status === 'normal') normal++;
        else if (p.status === 'atencao') atencao++;
        else if (p.status === 'fora') fora++;
      });
    });
    return { normal, atencao, fora };
  };

  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      if (searchTerm && !e.name.toLowerCase().includes(searchTerm.toLowerCase()) && !e.desc.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (dateFilter && e.date !== dateFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (areaFilter && !e.areas.some(a => a.name.toLowerCase().includes(areaFilter.toLowerCase()))) return false;
      return true;
    });
  }, [exams, searchTerm, dateFilter, statusFilter, areaFilter]);

  if (viewMode === 'edit' && editingExam) {
    const summary = getExamSummary(editingExam);
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setViewMode('list')}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {exams.find(e => e.id === editingExam.id) ? 'Editar Exame' : 'Novo Exame'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Preencha os dados e anexe os resultados laboratoriais.</p>
          </div>
        </div>

        {/* Configuração Inicial */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Exame</label>
              <input 
                type="text" 
                value={editingExam.name}
                onChange={e => setEditingExam({...editingExam, name: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Data do Exame</label>
                <input 
                  type="date" 
                  value={editingExam.date}
                  onChange={e => setEditingExam({...editingExam, date: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                <select
                  value={editingExam.status}
                  onChange={e => setEditingExam({...editingExam, status: e.target.value as ExamStatus})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="em_analise">Em análise</option>
                  <option value="concluido">Concluído</option>
                  <option value="revisto">Revisto</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição / Áreas</label>
              <input 
                type="text" 
                value={editingExam.desc}
                onChange={e => setEditingExam({...editingExam, desc: e.target.value})}
                placeholder="Ex: Hemograma, Perfil Lipídico..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div className="w-full xl:w-72 flex flex-col">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Documento do Exame</label>
            <div className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors group">
               <UploadCloud size={32} className="text-slate-400 group-hover:text-primary-500 mb-2 transition-colors" />
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Fazer Upload</p>
               <p className="text-xs text-slate-500 mt-1 text-center">PDF, JPG ou PNG (Máx 10MB)</p>
            </div>
          </div>
        </div>

        {/* Resumo Dinâmico */}
        <div className="flex gap-4">
           <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                 <CheckCircle size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Normais</p>
                 <p className="text-2xl font-black text-emerald-800 dark:text-emerald-300">{summary.normal}</p>
               </div>
             </div>
           </div>
           <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                 <AlertTriangle size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Atenção</p>
                 <p className="text-2xl font-black text-amber-800 dark:text-amber-300">{summary.atencao}</p>
               </div>
             </div>
           </div>
           <div className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                 <AlertTriangle size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Fora do intervalo</p>
                 <p className="text-2xl font-black text-red-800 dark:text-red-300">{summary.fora}</p>
               </div>
             </div>
           </div>
        </div>

        {/* Áreas do Exame */}
        <div className="space-y-4">
          {editingExam.areas.map(area => (
            <div key={area.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleArea(area.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope size={18} className="text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{area.name}</h3>
                </div>
                {expandedAreas[area.id] ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
              </button>
              
              {expandedAreas[area.id] && (
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Parâmetro</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Ref.</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Anterior</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Novo Valor</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Classificação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {area.params.map(param => (
                        <tr key={param.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="py-2 px-4 text-sm font-medium text-slate-800 dark:text-white">
                            {param.name}
                          </td>
                          <td className="py-2 px-4 text-xs text-slate-500 dark:text-slate-400">
                            {param.ref}
                          </td>
                          <td className="py-2 px-4 text-xs text-slate-400">
                            {param.prev ? `${param.prev} ${param.unit}` : '-'}
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                value={param.value}
                                onChange={e => updateParam(area.id, param.id, 'value', e.target.value)}
                                className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:ring-1 focus:ring-primary-500 outline-none"
                              />
                              <span className="text-xs text-slate-500">{param.unit}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <select
                              value={param.status}
                              onChange={e => updateParam(area.id, param.id, 'status', e.target.value)}
                              className={`w-full px-2 py-1 border rounded text-xs font-medium focus:ring-1 focus:ring-primary-500 outline-none ${
                                param.status === 'normal' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' :
                                param.status === 'atencao' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400' :
                                param.status === 'fora' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' :
                                'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <option value="pendente">Pendente</option>
                              <option value="normal">Normal</option>
                              <option value="atencao">Atenção</option>
                              <option value="fora">Fora do intervalo</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary-600 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-bold text-sm">
            <Plus size={18} /> Adicionar Área
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setViewMode('list')}
            className="px-6 py-2.5 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => handleSave('draft')}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors"
          >
            Guardar Rascunho
          </button>
          <button 
            onClick={() => handleSave(editingExam.status)}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            Guardar Exame
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Barra Superior */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity size={24} className="text-primary-500" />
              Exames Laboratoriais
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Armazene e acompanhe exames e marcadores fisiológicos do cliente.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-colors shadow-sm"
          >
            <Plus size={18} /> Novo Exame
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar exame..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Todos os estados</option>
            <option value="em_analise">Em análise</option>
            <option value="concluido">Concluído</option>
            <option value="revisto">Revisto</option>
          </select>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Todas as áreas</option>
            <option value="Hemograma Completo">Hemograma</option>
            <option value="Perfil Lipídico">Perfil Lipídico</option>
            <option value="Função Hepática">Função Hepática</option>
            <option value="Hormonas">Hormonas</option>
          </select>

          {(searchTerm || dateFilter || statusFilter || areaFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de Exames */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Exame</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Resultados (N / A / F)</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                    Nenhum exame encontrado.
                  </td>
                </tr>
              ) : (
                filteredExams.map(exam => {
                  const statusConf = getStatusConfig(exam.status);
                  const summary = getExamSummary(exam);
                  return (
                    <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                      <td className="py-4 px-6">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{exam.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{exam.desc}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                        {new Date(exam.date).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold" title="Normais">
                            {summary.normal}
                          </span>
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold" title="Atenção">
                            {summary.atencao}
                          </span>
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold" title="Fora do intervalo">
                            {summary.fora}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(exam)}
                            className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(exam.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
