import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/Dashboard';
import CalendarView from './components/calendar/CalendarView';
import ClientsView from './components/clients/ClientsView';
import FinanceView from './components/finance/FinanceView';
import WorkoutsView from './components/workouts/WorkoutsView';
import ExercisesView from './components/exercises/ExercisesView';
import ExerciseTechniquesView from './components/exercises/ExerciseTechniquesView';
import FoodView from './components/nutrition/FoodView';
import NutritionPlansView from './components/nutrition_plans/NutritionPlansView';
import SupplementsView from './components/supplements/SupplementsView';
import ContentView from './components/content/ContentView';
import PlansView from './components/payments/PlansView';
import PromosView from './components/promos/PromosView';
import QuestionnairesView from './components/questionnaires/QuestionnairesView';
import NotificationsView from './components/notifications/NotificationsView';
import AutomationsView from './components/settings/AutomationsView';
import LoginView from './components/LoginView';

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial theme check
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Update HTML class for Tailwind dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Geral';
      case 'calendar': return 'Agenda Global';
      case 'clients': return 'Gestão de Clientes';
      case 'finance': return 'Financeiro';
      case 'workouts': return 'Planos de Treino';
      case 'team': return 'Equipa';
      case 'exercises': return 'Base de Exercícios';
      case 'exercise_techniques': return 'Técnica de Exercícios';
      case 'nutrition': return 'Alimentos';
      case 'nutrition_plans': return 'Planos de Nutrição';
      case 'supplements': return 'Catálogo de Suplementos';
      case 'content': return 'Biblioteca de Conteúdos';
      case 'payments': return 'Planos de Pagamento';
      case 'promos': return 'Códigos Promocionais';
      case 'questionnaires': return 'Questionários';
      case 'notifications': return 'Notificações';
      case 'automations': return 'Automações';
      default: return 'pr1me';
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView onNavigate={(view, id) => {
        const tabMap: Record<string, string> = {
          'new-client': 'clients',
          'community': 'dashboard',
          'community-create': 'dashboard',
          'messages': 'dashboard' // we don't have a standalone messages tab yet
        };
        setActiveTab(tabMap[view] || view);
      }} />;
      case 'calendar': return <CalendarView />;
      case 'clients': return <ClientsView />;
      case 'finance': return <FinanceView />;
      case 'workouts': return <WorkoutsView />;
      case 'exercises': return <ExercisesView />;
      case 'exercise_techniques': return <ExerciseTechniquesView />;
      case 'nutrition': return <FoodView />;
      case 'nutrition_plans': return <NutritionPlansView />;
      case 'supplements': return <SupplementsView />;
      case 'content': return <ContentView />;
      case 'payments': return <PlansView />;
      case 'promos': return <PromosView />;
      case 'questionnaires': return <QuestionnairesView />;
      case 'notifications': return <NotificationsView />;
      case 'automations': return <AutomationsView />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🚧</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Módulo em Desenvolvimento</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            A secção <strong>{getPageTitle()}</strong> estará disponível brevemente na versão completa do SaaS.
          </p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg shadow-primary-500/30 transition-all mt-4"
          >
            Voltar à Dashboard
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // if (!user) {
  //   return <LoginView />;
  // }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 relative overflow-hidden">
      
      {/* Background Ambience (Glow effects) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => {
            setActiveTab(id);
            if(window.innerWidth < 1024) setSidebarOpen(false);
        }} 
        isOpen={sidebarOpen}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full relative z-10 lg:ml-20 xl:ml-64 transition-all duration-300">
        
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          toggleSidebar={toggleSidebar}
          title={getPageTitle()}
          onNotificationsClick={() => setActiveTab('notifications')}
        />

        {/* Scrollable Content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 2xl:p-10 scroll-smooth w-full">
          <div className="w-full min-w-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;