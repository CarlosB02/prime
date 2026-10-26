import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowLeft, ArrowRight, Edit2, Bell, StickyNote, Mail, Phone, Smartphone, 
  User, Activity, Dumbbell, Apple, CreditCard, MessageSquare, Plus, Trash2, CheckCircle2, PlusCircle, Search,
  LayoutDashboard, Image, FileText, CheckSquare, TrendingUp, LineChart, HeartPulse, Settings, Info, ChevronDown, X, Clock, Eye, Stethoscope,
  ClipboardList
} from 'lucide-react';
import CustomCalendarIcon from '../icons/CustomCalendarIcon';
import { 
  CustomDashboardIcon, 
  CustomDumbbellIcon, 
  CustomClipboardIcon, 
  CustomAppleIcon, 
  CustomBellIcon, 
  CustomChatIcon, 
  CustomTargetIcon,
  CustomVitalIcon,
  CustomEvolutionIcon,
  CustomSettingsIcon
} from '../icons';
import { Client } from '../../types';
import SendNotificationModal from './SendNotificationModal';
import SendMessageModal from './SendMessageModal';
import ClientNotesModal from './ClientNotesModal';
import ContactModal from './ContactModal';
import ClientInfoModal from './ClientInfoModal';
import { ClientEditModal } from './ClientEditModal';
import { ClientSettingsTab } from './ClientSettingsTab';
import { ClientTrainingPlanTab } from './ClientTrainingPlanTab';
import { ClientCalendarTab } from './ClientCalendarTab';
import { ClientPhotosTab } from './ClientPhotosTab';
import { ClientNutritionTab } from './ClientNutritionTab';
import { ClientExamsTab } from './ClientExamsTab';
import { ClientAssessmentsTab } from './ClientAssessmentsTab';
import { ClientAssessmentModal, AssessmentData } from './ClientAssessmentModal';
import { ClientConfigTab } from './ClientConfigTab';
import { ClientRegistosTab } from './ClientRegistosTab';
import { ClientRegisterWorkoutTab } from './ClientRegisterWorkoutTab';
import { ClientTimelineTab } from './ClientTimelineTab';
import { ClientOverviewDashboard } from './ClientOverviewDashboard';
import { ClientContextDrawer } from './ClientContextDrawer';

const MOCK_ASSESSMENTS: AssessmentData[] = [
  {
    id: '#002',
    date: '2024-03-15',
    status: 'validado',
    measures: {
      ombros: '110', peitoral: '98', bracoDir: '34', bracoEsq: '34',
      cintura: '82', abdomen: '84', anca: '98', coxaDir: '55',
      coxaEsq: '55', gemeoDir: '38', gemeoEsq: '38'
    },
    weight: 76.5,
    weightVariation: -1.2,
    cinturaVariation: -2,
    questions: 'Cliente referiu sentir-se mais leve esta semana e com melhor digestão.',
    trainerFeedback: 'Excelente progresso, vamos manter o plano.',
    photos: [
      { id: '3', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop', date: '2024-03-15', label: 'Frente' }
    ]
  },
  {
    id: '#001',
    date: '2024-02-15',
    status: 'concluido',
    measures: {
      ombros: '112', peitoral: '100', bracoDir: '35', bracoEsq: '35',
      cintura: '84', abdomen: '86', anca: '100', coxaDir: '57',
      coxaEsq: '57', gemeoDir: '39', gemeoEsq: '39'
    },
    weight: 77.7,
    weightVariation: 0,
    cinturaVariation: 0,
    questions: '',
    trainerFeedback: '',
    photos: [
      { id: '1', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop', date: '2024-02-15', label: 'Frente' }
    ]
  }
];

interface ClientDetailsViewProps {
  client: Client;
  onBack: () => void;
  onUpdateClient?: (updatedFields: Partial<Client>) => Promise<void> | void;
}

type TabType = 'dashboard' | 'calendario' | 'timeline' | 'avaliacoes' | 'fotos' | 'plano-treino' | 'registar-sessao-pt' | 'registos' | 'registar-treino' | 'evolucao-treino' | 'cardio' | 'plano-nutricao' | 'registo-nutricao' | 'subscricoes' | 'definicoes' | 'exames' | 'configuracoes';

const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({ client, onBack, onUpdateClient }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isAddNutritionModalOpen, setIsAddNutritionModalOpen] = useState(false);

  // Client visibility configurations for Exames and Timeline
  const [examesEnabled, setExamesEnabled] = useState<boolean>(client.examesEnabled ?? true);
  const [timelineEnabled, setTimelineEnabled] = useState<boolean>(client.timelineEnabled ?? true);

  const handleToggleExames = async (enabled: boolean) => {
    setExamesEnabled(enabled);
    if (!enabled && activeTab === 'exames') {
      setActiveTab('dashboard');
    }
    if (onUpdateClient) {
      await onUpdateClient({ examesEnabled: enabled });
    }
  };

  const handleToggleTimeline = async (enabled: boolean) => {
    setTimelineEnabled(enabled);
    if (!enabled && activeTab === 'timeline') {
      setActiveTab('dashboard');
    }
    if (onUpdateClient) {
      await onUpdateClient({ timelineEnabled: enabled });
    }
  };

  // Dynamic fields synchronized with client & Firestore
  const [objetivo, setObjetivo] = useState(client.objetivo || 'Perda de Massa Gorda');
  const [estrategia, setEstrategia] = useState(client.estrategia || 'Défice Calórico + Hipertrofia');
  const [isEditingObjetivo, setIsEditingObjetivo] = useState(false);
  const [isEditingEstrategia, setIsEditingEstrategia] = useState(false);
  const [tempObjetivo, setTempObjetivo] = useState('');
  const [tempEstrategia, setTempEstrategia] = useState('');
  
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isPhysicalAssessmentModalOpen, setIsPhysicalAssessmentModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [assessmentModalMode, setAssessmentModalMode] = useState<'add' | 'view'>('add');
  const [currentAssessmentData, setCurrentAssessmentData] = useState<AssessmentData | undefined>(undefined);
  const [previousAssessmentData, setPreviousAssessmentData] = useState<AssessmentData | undefined>(undefined);

  const [assessmentDate, setAssessmentDate] = useState(client.nextEvaluationDate || '2024-04-15');
  const [assessmentPeriodicity, setAssessmentPeriodicity] = useState('none');
  const [customPeriodicity, setCustomPeriodicity] = useState('');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAssessmentNotesModalOpen, setIsAssessmentNotesModalOpen] = useState(false);
  const [currentAssessmentNotes, setCurrentAssessmentNotes] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditTargetModalOpen, setIsEditTargetModalOpen] = useState(false);
  const [targetForm, setTargetForm] = useState({
    objetivo: client.objetivo || 'Perda de Massa Gorda',
    estrategia: client.estrategia || 'Défice Calórico + Hipertrofia',
    dataFim: client.targetEndDate || '2026-06-30',
    notas: client.targetNotes || 'Focar na ingestão de proteína',
    visibleToClient: client.visibleToClient ?? true
  });

  // Real physical assessments synced with Firestore subcollection
  const [assessmentsList, setAssessmentsList] = useState<AssessmentData[]>(() => {
    try {
      const saved = localStorage.getItem(`pr1me_evals_${client.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return MOCK_ASSESSMENTS;
  });

  // Listen to Firestore subcollection clients/{clientId}/evaluations
  useEffect(() => {
    try {
      const evalsRef = collection(db, 'clients', client.id, 'evaluations');
      const unsub = onSnapshot(evalsRef, (snap) => {
        if (!snap.empty) {
          const list: AssessmentData[] = snap.docs.map(d => ({
            id: d.id,
            ...(d.data() as any)
          }));
          list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setAssessmentsList(list);
          try {
            localStorage.setItem(`pr1me_evals_${client.id}`, JSON.stringify(list));
          } catch(err) {}
        }
      }, (err) => {
        console.warn("Firestore evals snapshot notice:", err);
      });
      return () => unsub();
    } catch(e) {
      console.warn("Firestore evals init notice:", e);
    }
  }, [client.id]);

  // Handlers to persist changes
  const handleSaveObjetivo = async (newVal: string) => {
    setObjetivo(newVal);
    setIsEditingObjetivo(false);
    if (onUpdateClient) {
      await onUpdateClient({ objetivo: newVal });
    }
  };

  const handleSaveEstrategia = async (newVal: string) => {
    setEstrategia(newVal);
    setIsEditingEstrategia(false);
    if (onUpdateClient) {
      await onUpdateClient({ estrategia: newVal });
    }
  };

  const handleSaveTargetForm = async () => {
    setObjetivo(targetForm.objetivo);
    setEstrategia(targetForm.estrategia);
    setIsEditTargetModalOpen(false);
    if (onUpdateClient) {
      await onUpdateClient({
        objetivo: targetForm.objetivo,
        estrategia: targetForm.estrategia,
        targetEndDate: targetForm.dataFim,
        targetNotes: targetForm.notas,
        visibleToClient: targetForm.visibleToClient
      });
    }
  };

  const handleSaveAssessmentConfig = async () => {
    setIsAssessmentModalOpen(false);
    if (onUpdateClient) {
      await onUpdateClient({
        nextEvaluationDate: assessmentDate,
        evaluationStatus: 'pendente'
      });
    }
  };

  const handleSaveAssessment = async (data: AssessmentData) => {
    const id = data.id || `eval_${Date.now()}`;
    const assessmentToSave = { ...data, id };
    
    // 1. Update state & localStorage
    setAssessmentsList(prev => {
      const filtered = prev.filter(a => a.id !== id);
      const updated = [assessmentToSave, ...filtered];
      updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      try {
        localStorage.setItem(`pr1me_evals_${client.id}`, JSON.stringify(updated));
      } catch(e) {}
      return updated;
    });

    // 2. Persist to Firestore subcollection
    try {
      await setDoc(doc(db, 'clients', client.id, 'evaluations', id), {
        ...assessmentToSave,
        updatedAt: serverTimestamp()
      });
      console.log("Evaluation saved to Firestore successfully:", id);
    } catch (e) {
      console.warn("Firestore save evaluation note:", e);
    }

    // 3. Update client summary (weight, progress, status)
    if (onUpdateClient) {
      onUpdateClient({
        evaluationStatus: 'concluida',
        lastActive: 'Agora'
      });
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    setAssessmentsList(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem(`pr1me_evals_${client.id}`, JSON.stringify(updated));
      } catch(e) {}
      return updated;
    });

    try {
      await deleteDoc(doc(db, 'clients', client.id, 'evaluations', id));
      console.log("Evaluation deleted from Firestore:", id);
    } catch (e) {
      console.warn("Firestore delete evaluation note:", e);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: CustomDashboardIcon },
    { id: 'calendario', label: 'Calendário', icon: CustomCalendarIcon },
    ...(timelineEnabled ? [{ id: 'timeline', label: 'Timeline', icon: Clock }] : []),
    { id: 'avaliacoes', label: 'Avaliações físicas', icon: CustomVitalIcon },
    { id: 'fotos', label: 'Fotos', icon: Image },
    { id: 'plano-treino', label: 'Plano de treino', icon: CustomDumbbellIcon },
    { id: 'registar-sessao-pt', label: 'Registar sessão de PT', icon: Dumbbell },
    { id: 'registos', label: 'Registos', icon: CustomClipboardIcon },
    { id: 'plano-nutricao', label: 'Plano de nutrição', icon: CustomAppleIcon },
    ...(examesEnabled ? [{ id: 'exames', label: 'Exames', icon: Stethoscope }] : []),
    { id: 'configuracoes', label: 'Configurações', icon: CustomSettingsIcon },
  ];

  // Calculate days in team
  const joinDate = new Date('2024-01-12'); // Mock date
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate days until payment expires
  const paymentDate = new Date('2024-04-15'); // Mock date
  const daysUntilPayment = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  let paymentColorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
  if (daysUntilPayment < 0) {
    paymentColorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
  } else if (daysUntilPayment < 5) {
    paymentColorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Bar - Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detalhes do Cliente</h1>
      </div>

      {/* Top Bar - Client Info (visível apenas em abas secundárias para manter contexto do atleta) */}
      {activeTab !== 'dashboard' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50 dark:border-slate-700" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{client.name}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${client.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>Objetivo: {objetivo}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>Estratégia: {estrategia}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer" title="Editar">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setIsNotificationModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer" title="Enviar Notificação">
                <CustomBellIcon size={16} />
              </button>
              <button onClick={() => setIsNotesModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer" title="Notas">
                <StickyNote size={16} />
              </button>
              <button onClick={() => setIsInfoModalOpen(true)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer" title="Informação">
                <Info size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 rounded-t-2xl">
        <div className="flex overflow-x-auto hide-scrollbar gap-1 mx-auto w-max max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`group flex items-center gap-2 px-3.5 py-3.5 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-semibold' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon size={18} className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className="whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        {activeTab === 'dashboard' && (
          <ClientOverviewDashboard
            client={client}
            assessments={assessmentsList}
            objetivo={objetivo}
            estrategia={estrategia}
            onEditObjetivo={() => { setTempObjetivo(objetivo); setIsEditingObjetivo(true); }}
            onEditEstrategia={() => { setTempEstrategia(estrategia); setIsEditingEstrategia(true); }}
            onEditTarget={() => setIsEditTargetModalOpen(true)}
            onOpenAssessmentModal={() => setIsAssessmentModalOpen(true)}
            onOpenNotesModal={() => setIsNotesModalOpen(true)}
            onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
            onOpenMessageModal={() => setIsMessageModalOpen(true)}
            onOpenContactModal={() => setIsContactModalOpen(true)}
            onOpenInfoModal={() => setIsInfoModalOpen(true)}
            onOpenEditModal={() => setIsEditModalOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
            onUpdateClient={onUpdateClient}
          />
        )}
        {activeTab === 'avaliacoes' && (
          <ClientAssessmentsTab
            client={client}
            assessments={assessmentsList}

            onNewAssessment={() => {
              setAssessmentModalMode('add');
              setCurrentAssessmentData(undefined);
              setIsPhysicalAssessmentModalOpen(true);
            }}
            onCompare={() => setIsCompareModalOpen(true)}
            onView={(assessment, prev) => {
              setAssessmentModalMode('view');
              setCurrentAssessmentData(assessment);
              setPreviousAssessmentData(prev);
              setIsPhysicalAssessmentModalOpen(true);
            }}
            onEdit={(assessment) => {
              setAssessmentModalMode('add');
              setCurrentAssessmentData(assessment);
              setIsPhysicalAssessmentModalOpen(true);
            }}
            onDelete={handleDeleteAssessment}
            onExport={(id) => console.log("Exportar avaliação:", id)}
          />
        )}

        {(activeTab === 'registar-sessao-pt' || activeTab === 'registar-treino') && (
          <ClientRegisterWorkoutTab client={client} />
        )}

        {activeTab === 'evolucao-treino' && (
          <ClientRegistosTab client={client} initialSubTab="treino" onUpdateClient={onUpdateClient} />
        )}

        {activeTab === 'plano-treino' && (
          <ClientContextDrawer client={client} type="workout">
            <ClientTrainingPlanTab client={client} />
          </ClientContextDrawer>
        )}

        {activeTab === 'calendario' && (
          <ClientCalendarTab timelineEnabled={timelineEnabled} />
        )}

        {timelineEnabled && activeTab === 'timeline' && (
          <ClientTimelineTab />
        )}

        {activeTab === 'fotos' && (
          <ClientPhotosTab />
        )}

        {/* Nutrition Tab */}
        {activeTab === 'plano-nutricao' && (
          <ClientContextDrawer client={client} type="nutrition">
            <ClientNutritionTab client={client} />
          </ClientContextDrawer>
        )}

        {examesEnabled && activeTab === 'exames' && (
          <ClientExamsTab />
        )}

        {activeTab === 'registos' && (
          <ClientRegistosTab client={client} onUpdateClient={onUpdateClient} />
        )}

        {activeTab === 'registo-nutricao' && (
          <ClientRegistosTab client={client} initialSubTab="nutricao" onUpdateClient={onUpdateClient} />
        )}

        {/* Configurations Tab */}
        {activeTab === 'configuracoes' && (
          <ClientConfigTab 
            client={client} 
            examesEnabled={examesEnabled}
            timelineEnabled={timelineEnabled}
            onToggleExames={handleToggleExames}
            onToggleTimeline={handleToggleTimeline}
          />
        )}
      </div>

      <SendNotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        clients={[client]}
      />

      <ClientAssessmentModal
        isOpen={isPhysicalAssessmentModalOpen}
        onClose={() => setIsPhysicalAssessmentModalOpen(false)}
        mode={assessmentModalMode}
        initialData={currentAssessmentData}
        previousData={previousAssessmentData}
        onSave={handleSaveAssessment}
      />

      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        client={client}
      />

      <ClientNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        client={client}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        client={client}
      />

      <ClientInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        client={client}
      />

      {/* Modals for Editing Objetivo and Estratégia */}
      {isEditingObjetivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Editar Objetivo</h2>
            <input 
              type="text" 
              value={tempObjetivo} 
              onChange={(e) => setTempObjetivo(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-6 text-slate-800 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditingObjetivo(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">Cancelar</button>
              <button onClick={() => handleSaveObjetivo(tempObjetivo)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {isEditingEstrategia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Editar Estratégia</h2>
            <input 
              type="text" 
              value={tempEstrategia} 
              onChange={(e) => setTempEstrategia(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-6 text-slate-800 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditingEstrategia(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">Cancelar</button>
              <button onClick={() => handleSaveEstrategia(tempEstrategia)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Vencimento and Próxima Avaliação */}
      {isEditTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Editar Objetivo e Estratégia</h2>
              <button 
                onClick={() => setIsEditTargetModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Objetivo</label>
                  <input type="text" value={targetForm.objetivo} onChange={(e) => setTargetForm(p => ({...p, objetivo: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Estratégia</label>
                  <input type="text" value={targetForm.estrategia} onChange={(e) => setTargetForm(p => ({...p, estrategia: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data de Fim</label>
                  <input type="date" value={targetForm.dataFim} onChange={(e) => setTargetForm(p => ({...p, dataFim: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notas Rápidas (Interno)</label>
                  <textarea rows={3} value={targetForm.notas} onChange={(e) => setTargetForm(p => ({...p, notas: e.target.value}))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white resize-none"></textarea>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div>
                   <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Visível para o cliente</h4>
                   <p className="text-xs text-slate-500">Mostrar na app móvel do cliente</p>
                 </div>
                 <button 
                   onClick={() => setTargetForm(p => ({...p, visibleToClient: !p.visibleToClient}))}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                     targetForm.visibleToClient ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
                   }`}
                 >
                   <span className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${
                     targetForm.visibleToClient ? 'translate-x-6' : 'translate-x-1'
                   }`} />
                 </button>
               </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 flex justify-end gap-3 flex-col sm:flex-row">
              <button onClick={() => setIsEditTargetModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancelar</button>
              <button onClick={handleSaveTargetForm} className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg transition-all flex items-center gap-2 justify-center">Guardar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configurar Avaliação</h2>
              <button 
                onClick={() => setIsAssessmentModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Data da Próxima Avaliação
                </label>
                <input 
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Periodicidade (Opcional)
                </label>
                <div className="relative">
                  <select 
                    value={assessmentPeriodicity}
                    onChange={(e) => setAssessmentPeriodicity(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="none">Não repetir</option>
                    <option value="7">A cada 7 dias</option>
                    <option value="15">A cada 15 dias</option>
                    <option value="30">A cada 30 dias (Mensal)</option>
                    <option value="60">A cada 60 dias (Bimestral)</option>
                    <option value="custom">Personalizado...</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {assessmentPeriodicity === 'custom' && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Repetir a cada:
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      value={customPeriodicity}
                      onChange={(e) => setCustomPeriodicity(e.target.value)}
                      placeholder="Ex: 45"
                      className="w-24 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">dias</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <button 
                onClick={() => { setIsAssessmentModalOpen(false); setActiveTab('avaliacoes'); }} 
                className="px-4 py-3 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors font-semibold text-sm sm:mr-auto"
              >
                Ir para Histórico
              </button>
              <button 
                onClick={() => setIsAssessmentModalOpen(false)} 
                className="px-5 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveAssessmentConfig} 
                className="px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-bold text-sm border-2 border-transparent focus:ring-4 focus:ring-primary-500/20 shadow-lg shadow-primary-500/20 flex items-center gap-2"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">Vencimento da Subscrição</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">A subscrição vence a 15 Abr 2024 ({daysUntilPayment} dias restantes). Deseja ir para a página de Subscrição?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">Cancelar</button>
              <button onClick={() => { setIsPaymentModalOpen(false); setActiveTab('avaliacoes'); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-500/25">Ir para Avaliações</button>
            </div>
          </div>
        </div>
      )}

      {isAssessmentNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="text-primary-500" />
                Observações da Avaliação
              </h2>
              <button 
                onClick={() => setIsAssessmentNotesModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <textarea 
                value={currentAssessmentNotes}
                onChange={(e) => setCurrentAssessmentNotes(e.target.value)}
                rows={5}
                placeholder="Escreva aqui as suas observações sobre esta avaliação física..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsAssessmentNotesModalOpen(false)} 
                className="px-5 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsAssessmentNotesModalOpen(false)} 
                className="px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-bold text-sm border-2 border-transparent focus:ring-4 focus:ring-primary-500/20 shadow-lg shadow-primary-500/20 flex items-center gap-2"
              >
                Guardar Observações
              </button>
            </div>
          </div>
        </div>
      )}

      <ClientEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
      />
    </div>
  );
};

export default ClientDetailsView;
