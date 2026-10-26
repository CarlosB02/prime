import { Client, DashboardEvent, PendingItem, Feedback, Metric, Exercise, Food, FoodCategory, FoodUnit, ReadyMeal, ReadyMealCategory, ReadyMealFoodItem, Supplement, SupplementCategory, ContentItem, ContentType, ContentCategory, PaymentPlan, PromoCode } from './types';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Utensils, 
  Activity, 
  ClipboardCheck, 
  Pill, 
  FileText, 
  CreditCard, 
  Tag, 
  Bell,
  HelpCircle,
  Wallet,
  Apple,
  Settings
} from 'lucide-react';
import CustomCalendarIcon from './components/icons/CustomCalendarIcon';
import CustomDashboardIcon from './components/icons/CustomDashboardIcon';
import CustomUsersIcon from './components/icons/CustomUsersIcon';
import CustomWalletIcon from './components/icons/CustomWalletIcon';
import CustomDumbbellIcon from './components/icons/CustomDumbbellIcon';
import CustomAppleIcon from './components/icons/CustomAppleIcon';
import CustomForkKnifeIcon from './components/icons/CustomForkKnifeIcon';
import CustomClipboardIcon from './components/icons/CustomClipboardIcon';
import CustomBellIcon from './components/icons/CustomBellIcon';
import { CustomVitalIcon, CustomQuestionMarkIcon, CustomSettingsIcon } from './components/icons';

export const MENU_ITEMS = [
  { label: 'Dashboard', icon: CustomDashboardIcon, id: 'dashboard' },
  { label: 'Calendário', icon: CustomCalendarIcon, id: 'calendar' },
  { label: 'Clientes', icon: CustomUsersIcon, id: 'clients' },
  { 
    label: 'Negócio', 
    icon: CustomWalletIcon, 
    id: 'business_group',
    subItems: [
      { label: 'Financeiro', id: 'finance' },
      { label: 'Planos de Pagamento', id: 'payments' },
      { label: 'Códigos Promo', id: 'promos' }
    ]
  },
  { label: 'Equipa', icon: CustomUsersIcon, id: 'team' },
  { label: 'Planos de Treino', icon: CustomDumbbellIcon, id: 'workouts' },
  { 
    label: 'Alimentos e Suplementação', 
    icon: CustomAppleIcon, 
    id: 'nutrition_group',
    subItems: [
      { label: 'Alimentos', id: 'nutrition' },
      { label: 'Suplementação', id: 'supplements' }
    ]
  },
  { label: 'Planos de Nutrição', icon: CustomForkKnifeIcon, id: 'nutrition_plans' },
  { 
    label: 'Exercícios', 
    icon: CustomVitalIcon, 
    id: 'exercises_group',
    subItems: [
      { label: 'Exercícios', id: 'exercises' },
      { label: 'Técnica de Exercícios', id: 'exercise_techniques' },
      { label: 'Banco de Textos', id: 'exercise_text_bank' }
    ]
  },
  { label: 'Conteúdos', icon: CustomClipboardIcon, id: 'content' },
  { label: 'Questionários', icon: CustomQuestionMarkIcon, id: 'questionnaires' },
  { label: 'Notificações', icon: CustomBellIcon, id: 'notifications' },
  {
    label: 'Definições',
    icon: CustomSettingsIcon,
    id: 'settings_group',
    subItems: [
      { label: 'Automações', id: 'automations' }
    ]
  }
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Ana Silva', avatar: 'https://picsum.photos/100/100?random=1', plan: 'Premium Transformation', status: 'active', lastActive: '2h atrás', contact: '+351 912 345 678', progress: 85, evaluationStatus: 'concluida', isNew: false, paymentStatus: 'pago', birthday: '03-12', age: 28, paymentExpiryDate: '2026-04-12', isPaying: true, hasSubscription: true, nextEvaluationDate: '2026-03-20' },
  { id: '2', name: 'Carlos Mendes', avatar: 'https://picsum.photos/100/100?random=2', plan: 'Hipertrofia Basic', status: 'warning', lastActive: '3d atrás', contact: '+351 912 345 679', progress: 42, evaluationStatus: 'pendente', isNew: false, paymentStatus: 'a_expirar', age: 34, paymentExpiryDate: '2026-03-15', isPaying: true, hasSubscription: false, nextEvaluationDate: '2026-03-14' },
  { id: '3', name: 'Beatriz Costa', avatar: 'https://picsum.photos/100/100?random=3', plan: 'Perda de Peso', status: 'pending', lastActive: '1d atrás', contact: '+351 912 345 670', progress: 12, evaluationStatus: 'por_validar', isNew: true, paymentStatus: 'pago', age: 25, paymentExpiryDate: '2026-04-01', isPaying: true, hasSubscription: true },
  { id: '4', name: 'João Pereira', avatar: 'https://picsum.photos/100/100?random=4', plan: 'Premium Transformation', status: 'active', lastActive: '5h atrás', contact: '+351 912 345 671', progress: 91, evaluationStatus: 'concluida', isNew: false, paymentStatus: 'pago', age: 41, paymentExpiryDate: '2026-05-10', isPaying: true, hasSubscription: true, nextEvaluationDate: '2026-04-10' },
  { id: '5', name: 'Sofia Oliveira', avatar: 'https://picsum.photos/100/100?random=5', plan: 'Manutenção', status: 'inactive', lastActive: '1sem atrás', contact: '+351 912 345 672', progress: 65, evaluationStatus: 'concluida', isNew: false, paymentStatus: 'expirado', age: 31, paymentExpiryDate: '2026-02-28', isPaying: false, hasSubscription: false },
  { id: '6', name: 'Miguel Santos', avatar: 'https://picsum.photos/100/100?random=6', plan: 'Hipertrofia Basic', status: 'pending', lastActive: '1h atrás', contact: '+351 912 345 673', progress: 0, evaluationStatus: 'por_validar', isNew: true, paymentStatus: 'pago', age: 22, paymentExpiryDate: '2026-04-05', isPaying: true, hasSubscription: false, nextEvaluationDate: '2026-03-18' },
  { id: '7', name: 'Catarina Lima', avatar: 'https://picsum.photos/100/100?random=7', plan: 'Perda de Peso', status: 'active', lastActive: 'Agora', contact: '+351 912 345 674', progress: 30, evaluationStatus: 'pendente', isNew: false, paymentStatus: 'pago', age: 37, paymentExpiryDate: '2026-04-20', isPaying: true, hasSubscription: true, nextEvaluationDate: '2026-03-25' },
];

export const MOCK_EVENTS: DashboardEvent[] = [
  { id: '1', type: 'birthday', clientId: '1', clientName: 'Ana Silva', title: 'Aniversário', time: 'Hoje', isUrgent: false },
  { id: '2', type: 'check-in', clientId: '4', clientName: 'João Pereira', title: 'Check-in Semanal', time: '09:00', isUrgent: true },
  { id: '3', type: 'goal', clientId: '2', clientName: 'Carlos Mendes', title: 'Meta 80kg Atingida', time: '10:30', isUrgent: false },
  { id: '4', type: 'payment', clientId: '5', clientName: 'Sofia Oliveira', title: 'Pagamento em Atraso', time: 'Ontem', isUrgent: true },
];

export const MOCK_PENDING: PendingItem[] = [
  { id: '101', type: 'workout_submission', clientId: '3', clientName: 'Beatriz Costa', date: '2023-10-24', status: 'pending', details: 'Treino A - Pernas' },
  { id: '102', type: 'physical_assessment', clientId: '4', clientName: 'João Pereira', date: '2023-10-24', status: 'pending', details: 'Fotos e Medidas Mensais' },
  { id: '103', type: 'nutrition_update', clientId: '1', clientName: 'Ana Silva', date: '2023-10-23', status: 'pending', details: 'Pedido de alteração no pequeno-almoço' },
];

export const MOCK_FEEDBACK: Feedback[] = [
  { id: 'f1', clientId: '1', clientName: 'Ana Silva', avatar: 'https://picsum.photos/100/100?random=1', rating: 5, comment: 'Adorei o novo plano de treino! Sinto-me muito mais energizada.', date: '2h atrás', read: false },
  { id: 'f2', clientId: '2', clientName: 'Carlos Mendes', avatar: 'https://picsum.photos/100/100?random=2', rating: 4, comment: 'O treino de pernas está muito intenso, mas estou a aguentar.', date: '1d atrás', read: true },
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Receita Mensal', value: '€4,250', trend: 12.5, trendLabel: 'vs mês passado' },
  { label: 'Clientes Ativos', value: '42', trend: 5.2, trendLabel: 'novos este mês' },
  { label: 'Taxa de Retenção', value: '94%', trend: -1.1, trendLabel: 'ligeira descida' },
];

export const CHART_DATA = [
  { name: 'Seg', treinos: 12, checkins: 4 },
  { name: 'Ter', treinos: 19, checkins: 8 },
  { name: 'Qua', treinos: 15, checkins: 12 },
  { name: 'Qui', treinos: 22, checkins: 6 },
  { name: 'Sex', treinos: 28, checkins: 14 },
  { name: 'Sab', treinos: 18, checkins: 2 },
  { name: 'Dom', treinos: 10, checkins: 1 },
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Supino Plano com Barra',
    muscleGroup: 'Peitoral',
    secondaryMuscleGroups: ['Tríceps', 'Ombros'],
    type: 'Força',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200&h=200',
    videos: [{ type: 'link', url: 'https://youtube.com' }],
    description: 'Deite-se no banco, segure a barra e empurre para cima.',
    isDeleted: false
  },
  {
    id: '2',
    name: 'Agachamento Livre',
    muscleGroup: 'Quadríceps',
    secondaryMuscleGroups: ['Glúteos', 'Isquiotibiais'],
    type: 'Força',
    image: 'https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?auto=format&fit=crop&q=80&w=200&h=200',
    videos: [{ type: 'link', url: 'https://youtube.com' }],
    description: 'Mantenha as costas retas e agache até a paralela.',
    isDeleted: false
  },
  {
    id: '3',
    name: 'Puxada Alta',
    muscleGroup: 'Dorsal',
    secondaryMuscleGroups: ['Bíceps'],
    type: 'Força',
    image: 'https://images.unsplash.com/photo-1598575435213-3958e5346d1e?auto=format&fit=crop&q=80&w=200&h=200',
    videos: [{ type: 'link', url: 'https://youtube.com' }],
    description: 'Puxe a barra em direção ao peito superior.',
    isDeleted: false
  },
  {
    id: '4',
    name: 'Elevação Lateral',
    muscleGroup: 'Ombros',
    secondaryMuscleGroups: [],
    type: 'Força',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200&h=200',
    videos: [{ type: 'link', url: 'https://youtube.com' }],
    description: 'Eleve os braços lateralmente até a altura dos ombros.',
    isDeleted: true 
  }
];

export const MOCK_FOODS: Food[] = [
  {
    id: '1',
    name: 'Peito de Frango Grelhado',
    category: 'Proteína',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '2',
    name: 'Arroz Basmati Cozido',
    category: 'Hidratos',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    isDeleted: false
  },
  {
    id: '3',
    name: 'Aveia em Flocos',
    category: 'Hidratos',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    isDeleted: false
  },
  {
    id: '4',
    name: 'Ovo Inteiro Cozido',
    category: 'Proteína',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'unidade',
    baseQuantity: 1,
    calories: 78,
    protein: 6.5,
    carbs: 0.6,
    fat: 5.5,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '5',
    name: 'Batata Doce Cozida',
    category: 'Hidratos',
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    isDeleted: false
  },
  {
    id: '6',
    name: 'Azeite Extra Virgem',
    category: 'Gordura',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'ml',
    baseQuantity: 100,
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '7',
    name: 'Brócolos Cozidos',
    category: 'Vegetais',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 35,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 3.3,
    isDeleted: false
  },
  {
    id: '8',
    name: 'Pão de Forma Integral',
    category: 'Hidratos',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'unidade',
    baseQuantity: 1,
    calories: 65,
    protein: 2.5,
    carbs: 11,
    fat: 0.9,
    fiber: 1.5,
    isDeleted: false
  },
  {
    id: '9',
    name: 'Leite Meio Gordo',
    category: 'Laticínios',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'ml',
    baseQuantity: 100,
    calories: 47,
    protein: 3.3,
    carbs: 4.8,
    fat: 1.6,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '10',
    name: 'Abacate',
    category: 'Gordura',
    image: 'https://images.unsplash.com/photo-1523049673856-356c64cf11d9?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    isDeleted: false
  },
  {
    id: '11',
    name: 'Whey Protein (Scoop)',
    category: 'Suplementos',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'unidade',
    baseQuantity: 1,
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1,
    fiber: 0.5,
    isDeleted: false
  },
  {
    id: '12',
    name: 'Salmão Grelhado',
    category: 'Proteína',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12.3,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '13',
    name: 'Atum ao Natural',
    category: 'Proteína',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44a040b?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 116,
    protein: 26,
    carbs: 0,
    fat: 0.8,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '14',
    name: 'Iogurte Grego Natural 0%',
    category: 'Laticínios',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.2,
    fiber: 0,
    isDeleted: false
  },
  {
    id: '15',
    name: 'Banana',
    category: 'Fruta',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'unidade',
    baseQuantity: 1,
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    isDeleted: false
  },
  {
    id: '16',
    name: 'Maçã',
    category: 'Fruta',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'unidade',
    baseQuantity: 1,
    calories: 52,
    protein: 0.3,
    carbs: 13.8,
    fat: 0.2,
    fiber: 2.4,
    isDeleted: false
  },
  {
    id: '17',
    name: 'Manteiga de Amendoim 100%',
    category: 'Gordura',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 588,
    protein: 25,
    carbs: 20,
    fat: 50,
    fiber: 6,
    isDeleted: false
  },
  {
    id: '18',
    name: 'Massa Cozida',
    category: 'Hidratos',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 158,
    protein: 5.8,
    carbs: 30.9,
    fat: 0.9,
    fiber: 1.8,
    isDeleted: false
  },
  {
    id: '19',
    name: 'Espinafres Cozidos',
    category: 'Vegetais',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 23,
    protein: 3,
    carbs: 3.8,
    fat: 0.3,
    fiber: 2.4,
    isDeleted: false
  },
  {
    id: '20',
    name: 'Queijo Quark 0%',
    category: 'Laticínios',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 68,
    protein: 12,
    carbs: 3.5,
    fat: 0.2,
    fiber: 0,
    isDeleted: false
  }
];

export const READY_MEAL_CATEGORIES: ReadyMealCategory[] = [
  'Pequeno-Almoço',
  'Almoço / Jantar',
  'Lanches',
  'Pré / Pós-Treino',
  'Snacks'
];

export const MOCK_READY_MEALS: ReadyMeal[] = [
  {
    id: 'rm-1',
    name: 'Frango Grelhado com Arroz Basmati e Brócolos',
    category: 'Almoço / Jantar',
    description: 'O clássico anabólico de excelência. Digestão limpa, excelente perfil proteico e micronutrientes dos brócolos.',
    prepTimeMinutes: 20,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Grelhar o peito de frango temperado com sal fino e orégãos. Servir com arroz quente e brócolos ao vapor regados com o azeite.',
    foods: [
      { foodId: '1', quantity: 160, measure: '160g' },
      { foodId: '2', quantity: 180, measure: '180g' },
      { foodId: '7', quantity: 120, measure: '120g' },
      { foodId: '6', quantity: 10, measure: '1 c. sopa (10ml)' }
    ],
    calories: 628,
    protein: 57.4,
    carbs: 58.8,
    fat: 16.8,
    fiber: 4.2,
    isDeleted: false
  },
  {
    id: 'rm-2',
    name: 'Panquecas de Aveia Proteicas com Banana',
    category: 'Pequeno-Almoço',
    description: 'Pequeno-almoço energético e altamente saciante com libertação gradual de energia ao longo da manhã.',
    prepTimeMinutes: 12,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Triturar os ovos, aveia e whey até formar massa homogénea. Cozinhar em lume brando e cobrir com rodelas de banana e canela.',
    foods: [
      { foodId: '3', quantity: 70, measure: '70g (7 c. sopa)' },
      { foodId: '4', quantity: 2, measure: '2 unidades' },
      { foodId: '11', quantity: 30, measure: '1 scoop (30g)' },
      { foodId: '15', quantity: 1, measure: '1 unidade média' }
    ],
    calories: 628,
    protein: 52.9,
    carbs: 71.0,
    fat: 16.4,
    fiber: 10.2,
    isDeleted: false
  },
  {
    id: 'rm-3',
    name: 'Salmão Fresco Grelhado com Batata Doce e Espinafres',
    category: 'Almoço / Jantar',
    description: 'Rico em ácidos gordos Ómega-3 para redução da inflamação e recuperação celular.',
    prepTimeMinutes: 25,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Selar o lombo de salmão numa frigideira quente sem gordura adicional. Acompanhar com batata doce cozida ou assada e espinafres.',
    foods: [
      { foodId: '9', quantity: 150, measure: '150g' },
      { foodId: '5', quantity: 200, measure: '200g' },
      { foodId: '19', quantity: 100, measure: '100g' }
    ],
    calories: 507,
    protein: 36.2,
    carbs: 43.8,
    fat: 20.6,
    fiber: 8.4,
    isDeleted: false
  },
  {
    id: 'rm-4',
    name: 'Tostas de Pão de Centeio com Ovos Mexidos e Abacate',
    category: 'Pequeno-Almoço',
    description: 'Pequeno-almoço balanceado com hidratos de baixo índice glicémico e gorduras monoinsaturadas saudáveis.',
    prepTimeMinutes: 8,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Torrar as fatias de centeio. Bater os ovos e mexer em lume brando. Dispor sobre as tostas com o abacate fatiado por cima.',
    foods: [
      { foodId: '8', quantity: 2, measure: '2 fatias (60g)' },
      { foodId: '4', quantity: 2, measure: '2 unidades' },
      { foodId: '13', quantity: 50, measure: '1/3 abacate (50g)' }
    ],
    calories: 402,
    protein: 19.4,
    carbs: 36.1,
    fat: 20.5,
    fiber: 8.1,
    isDeleted: false
  },
  {
    id: 'rm-5',
    name: 'Bowl Proteico de Iogurte Grego, Whey e Manteiga de Amendoim',
    category: 'Lanches',
    description: 'Snack doce, denso e proteico, pronto em 2 minutos sem qualquer cozedura.',
    prepTimeMinutes: 3,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Misturar o iogurte grego com o scoop de whey até consistência de mousse. Cobrir com maçã fatiada e manteiga de amendoim.',
    foods: [
      { foodId: '10', quantity: 180, measure: '1 boião (180g)' },
      { foodId: '11', quantity: 25, measure: '25g' },
      { foodId: '17', quantity: 15, measure: '1 c. sobremesa (15g)' },
      { foodId: '16', quantity: 1, measure: '1 maçã média' }
    ],
    calories: 339,
    protein: 44.6,
    carbs: 24.5,
    fat: 8.4,
    fiber: 4.2,
    isDeleted: false
  },
  {
    id: 'rm-6',
    name: 'Batido Rápido de Recuperação Pós-Treino',
    category: 'Pré / Pós-Treino',
    description: 'Absorção rápida de aminoácidos essenciais e reposição imediata de glicogénio muscular pós-sessão.',
    prepTimeMinutes: 3,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Juntar cerca de 300ml de água fresca ou gelo, a banana, aveia e whey. Bater 30 segundos no shaker ou liquidificadora.',
    foods: [
      { foodId: '11', quantity: 35, measure: '35g' },
      { foodId: '15', quantity: 1, measure: '1 unidade' },
      { foodId: '3', quantity: 40, measure: '40g' }
    ],
    calories: 375,
    protein: 39.4,
    carbs: 50.0,
    fat: 3.5,
    fiber: 5.3,
    isDeleted: false
  },
  {
    id: 'rm-7',
    name: 'Bife de Vaca Magro com Massa e Brócolos ao Azeite',
    category: 'Almoço / Jantar',
    description: 'Aporte substancial de ferro heme, creatina natural e hidratos de assimilação contínua para ganhos musculares.',
    prepTimeMinutes: 20,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Grelhar o bife ao ponto. Envolver a massa cozida e os brócolos com um fio de azeite e pimenta preta.',
    foods: [
      { foodId: '14', quantity: 160, measure: '160g' },
      { foodId: '18', quantity: 150, measure: '150g' },
      { foodId: '7', quantity: 100, measure: '100g' },
      { foodId: '6', quantity: 8, measure: '8ml' }
    ],
    calories: 676,
    protein: 55.9,
    carbs: 53.4,
    fat: 25.8,
    fiber: 4.3,
    isDeleted: false
  },
  {
    id: 'rm-8',
    name: 'Papas de Aveia Quentes com Queijo Quark e Banana',
    category: 'Pequeno-Almoço',
    description: 'Cremoso, altamente nutritivo e reconfortante. Excelente digestibilidade pré ou pós-atividade física.',
    prepTimeMinutes: 10,
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Cozer a aveia com água e canela. Retirar do lume, envolver o queijo quark até criar creme sedoso e guarnecer com a banana.',
    foods: [
      { foodId: '3', quantity: 60, measure: '60g' },
      { foodId: '20', quantity: 150, measure: '150g' },
      { foodId: '15', quantity: 1, measure: '1 unidade' }
    ],
    calories: 424,
    protein: 29.2,
    carbs: 67.9,
    fat: 4.7,
    fiber: 7.8,
    isDeleted: false
  },
  {
    id: 'rm-9',
    name: 'Wrap de Atum ao Natural com Queijo Quark e Espinafres',
    category: 'Lanches',
    description: 'Opção prática para transporte para o trabalho ou universidade, baixa em calorias e repleta de proteína magra.',
    prepTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600&h=400',
    notes: 'Escorrer o atum e misturar com o queijo quark, pimenta e sal. Espalhar no pão/wrap sobre cama de espinafres e enrolar.',
    foods: [
      { foodId: '12', quantity: 120, measure: '1 lata grande (120g)' },
      { foodId: '20', quantity: 60, measure: '60g' },
      { foodId: '8', quantity: 1, measure: '1 unidade (wrap/fatia)' },
      { foodId: '19', quantity: 50, measure: '50g' }
    ],
    calories: 275,
    protein: 42.6,
    carbs: 19.3,
    fat: 2.6,
    fiber: 2.5,
    isDeleted: false
  }
];

export const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: 'Gold Standard 100% Whey',
    brand: 'Optimum Nutrition',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=200&h=200',
    description: 'Isolado de proteína de soro de leite de alta qualidade. Ideal para recuperação pós-treino e construção muscular.',
    link: 'https://www.optimumnutrition.com',
    isDeleted: false
  },
  {
    id: '2',
    name: 'Creatina Monohidratada',
    brand: 'Prozis',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200',
    description: 'Creatina pura para aumento de força explosiva e volume celular. Essencial para treinos de hipertrofia.',
    link: 'https://www.prozis.com',
    isDeleted: false
  },
  {
    id: '3',
    name: 'C4 Original Pre-Workout',
    brand: 'Cellucor',
    image: 'https://images.unsplash.com/photo-1550572017-4fcd95616f9a?auto=format&fit=crop&q=80&w=200&h=200',
    description: 'Energia explosiva, foco aguçado e pump muscular. Contém cafeína, beta-alanina e nitrato de creatina.',
    link: 'https://cellucor.com',
    isDeleted: false
  },
  {
    id: '4',
    name: 'Multivitamínico Daily',
    brand: 'MyProtein',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200&h=200',
    description: 'Mistura completa de 7 vitaminas essenciais incluindo vitamina A, C, D3, E, Tiamina, Riboflavina e Niacina.',
    link: 'https://www.myprotein.com',
    isDeleted: true
  }
];

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: '1',
    title: 'Técnica Perfeita de Agachamento',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600&h=400',
    type: 'video',
    category: 'Treino',
    description: 'Aprende os 5 erros mais comuns no agachamento e como corrigir a tua postura para evitar lesões e maximizar a hipertrofia.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example Embed
    createdAt: '2023-10-15',
    isDeleted: false
  },
  {
    id: '2',
    title: 'Guia Completo de Hipertrofia',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600&h=400',
    type: 'pdf',
    category: 'Treino',
    description: 'Ebook com 20 páginas sobre os princípios fundamentais da hipertrofia, volume de treino e seleção de exercícios.',
    url: 'https://example.com/guide.pdf',
    createdAt: '2023-10-10',
    isDeleted: false
  },
  {
    id: '3',
    title: '5 Receitas Pós-Treino Rápidas',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600&h=400',
    type: 'article',
    category: 'Receitas',
    description: 'Refeições ricas em proteína que podes preparar em menos de 15 minutos para otimizar a tua recuperação.',
    url: 'https://example.com/blog/recipies',
    createdAt: '2023-10-05',
    isDeleted: false
  },
  {
    id: '4',
    title: 'Mindset de Campeão',
    thumbnail: 'https://images.unsplash.com/photo-1552674605-1e9513e5efb9?auto=format&fit=crop&q=80&w=600&h=400',
    type: 'audio',
    category: 'Mindset',
    description: 'Podcast sobre como manter a motivação e disciplina nos dias mais difíceis.',
    url: 'https://example.com/audio.mp3',
    createdAt: '2023-09-28',
    isDeleted: true
  }
];

export const MOCK_PLANS: PaymentPlan[] = [
  {
    id: '1',
    name: 'Plano Mensal',
    durationMonths: 1,
    price: 49.99,
    isSubscription: true,
    allowOneTimePayment: false,
    allowInstallments: false,
    isTemporary: false,
    hasContentAccess: true,
    startDate: '2023-01-01',
    isActive: true,
    visibility: 'Público',
    isDeleted: false
  },
  {
    id: '2',
    name: 'Transformação Trimestral',
    durationMonths: 3,
    price: 135.00,
    isSubscription: true,
    allowOneTimePayment: true,
    allowInstallments: true,
    isTemporary: false,
    hasContentAccess: true,
    startDate: '2023-01-01',
    isActive: true,
    visibility: 'Público',
    isDeleted: false
  },
  {
    id: '3',
    name: 'Pack Verão (Semestral)',
    durationMonths: 6,
    price: 250.00,
    isSubscription: false,
    allowOneTimePayment: true,
    allowInstallments: true,
    isTemporary: true,
    hasContentAccess: true,
    startDate: '2023-06-01',
    endDate: '2023-09-30',
    isActive: true,
    visibility: 'Público',
    isDeleted: false
  },
  {
    id: '4',
    name: 'Consultoria Online Anual',
    durationMonths: 12,
    price: 480.00,
    isSubscription: true,
    allowOneTimePayment: true,
    allowInstallments: true,
    isTemporary: false,
    hasContentAccess: true,
    startDate: '2023-01-01',
    isActive: true,
    visibility: 'Privado',
    isDeleted: false
  },
  {
    id: '5',
    name: 'Plano Basic',
    durationMonths: 1,
    price: 29.99,
    isSubscription: true,
    allowOneTimePayment: false,
    allowInstallments: false,
    isTemporary: false,
    hasContentAccess: false,
    startDate: '2023-01-01',
    isActive: false,
    visibility: 'Público',
    isDeleted: true
  }
];

export const MOCK_PROMOS: PromoCode[] = [
  {
    id: '1',
    code: 'BEMVINDO20',
    type: 'percent',
    value: 20,
    planIds: ['1', '2'],
    validityMinutes: 1440, // 24h
    validUntil: '2024-12-31',
    usageCount: 15,
    maxUsage: 50,
    applyToRecurring: true,
    createdAt: '2023-10-01',
    isDeleted: false
  },
  {
    id: '2',
    code: 'VERAO50',
    type: 'fixed_amount',
    value: 50,
    planIds: ['3'],
    validityMinutes: 60, // Flash sale 1h
    validUntil: '2023-08-31',
    usageCount: 42,
    maxUsage: 42,
    applyToRecurring: false,
    createdAt: '2023-06-01',
    isDeleted: false
  },
  {
    id: '3',
    code: 'BLACKFRIDAY',
    type: 'percent',
    value: 30,
    planIds: ['1', '2', '3', '4'],
    validityMinutes: 4320, // 3 days
    validUntil: '2023-11-27',
    usageCount: 128,
    maxUsage: 200,
    applyToRecurring: true,
    createdAt: '2023-11-01',
    isDeleted: false
  },
  {
    id: '4',
    code: 'AMIGO10',
    type: 'fixed_amount',
    value: 10,
    planIds: ['1'],
    validityMinutes: 0,
    validUntil: '2025-01-01',
    usageCount: 5,
    maxUsage: 1000,
    applyToRecurring: false,
    createdAt: '2023-09-15',
    isDeleted: true
  },
  {
    id: '5',
    code: 'PRECOFIXO',
    type: 'fixed_price',
    value: 25,
    planIds: ['1'],
    validityMinutes: 0,
    validUntil: '2024-06-01',
    usageCount: 2,
    maxUsage: 10,
    applyToRecurring: true,
    createdAt: '2024-01-01',
    isDeleted: false
  }
];

export const MUSCLE_GROUPS = [
  'Peitoral', 'Dorsal', 'Quadríceps', 'Isquiotibiais', 'Glúteo', 'Ombros', 'Bíceps', 'Tríceps', 'Abdominais', 'Cardio'
];

export const EQUIPMENT_TYPES = [
  'Peso Livre', 'Máquina', 'Cabo', 'Peso Corporal', 'Elásticos', 'Cardio'
];

export const DIFFICULTY_LEVELS = [
  'Iniciante', 'Intermédio', 'Avançado'
];

export const EXERCISE_TYPES = [
  'Indefinido', 'Alongamento', 'Mobilidade', 'Força'
];

export const FOOD_CATEGORIES: FoodCategory[] = ['Proteína', 'Hidratos', 'Gordura', 'Vegetais', 'Fruta', 'Laticínios', 'Suplementos', 'Bebidas', 'Outros'];
export const FOOD_UNITS: FoodUnit[] = ['g', 'ml', 'unidade'];

export const SUPPLEMENT_CATEGORIES: SupplementCategory[] = ['Proteína', 'Creatina', 'Pré-Treino', 'Vitaminas', 'Recuperação', 'Perda de Peso', 'Saúde Geral', 'Outros'];

export const CONTENT_TYPES: ContentType[] = ['video', 'article', 'pdf', 'audio'];
export const CONTENT_CATEGORIES: ContentCategory[] = ['Nutrição', 'Treino', 'Mindset', 'Receitas', 'Tutorial', 'Outros'];

export const DESCRIPTION_TEMPLATES = {
  default: `1. Posição Inicial:
- 

2. Execução:
- 

3. Pontos Chave:
- `,
  strength: `1. Preparação:
- Ajuste o equipamento para...
- Posicione-se com...

2. Execução:
- Inicie o movimento controlando a carga.
- Expire ao realizar esforço.
- Retorne à posição inicial de forma controlada.

3. Dicas de Segurança:
- Mantenha a coluna neutra.`,
  mobility: `1. Objetivo:
- Aumentar a amplitude de movimento em...

2. Como fazer:
- Mova-se suavemente até o limite da amplitude.
- Mantenha a respiração fluida.

3. Tempo/Repetições:
- Realize por 30-60 segundos.`
};

import { Questionnaire } from './types';

export const MOCK_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: '1',
    title: 'Avaliação Inicial',
    description: 'Questionário para conhecer o cliente antes de iniciar o plano.',
    type: 'Avaliação inicial',
    questions: [
      { id: 'q1', text: 'Qual é o seu objetivo principal?', type: 'text', required: true },
      { id: 'q2', text: 'Quantas vezes por semana pretende treinar?', type: 'number', required: true },
      { id: 'q3', text: 'Tem alguma lesão?', type: 'boolean', required: true }
    ],
    createdAt: '2024-01-10',
    isDeleted: false
  },
  {
    id: '2',
    title: 'Check-in Semanal',
    description: 'Acompanhamento periódico do progresso.',
    type: 'Periódico',
    frequency: 7,
    questions: [
      { id: 'q4', text: 'Como avalia a sua energia esta semana?', type: 'multiple_choice', options: ['Baixa', 'Média', 'Alta'], required: true },
      { id: 'q5', text: 'Cumpriu o plano alimentar?', type: 'boolean', required: true },
      { id: 'q6', text: 'Peso atual (kg)', type: 'number', required: false }
    ],
    createdAt: '2024-01-15',
    isDeleted: false
  },
  {
    id: '3',
    title: 'Registo de Hábitos',
    description: 'Acompanhamento diário de hábitos e rotinas.',
    type: 'Registo diário',
    frequency: 1,
    questions: [
      { id: 'q7', text: 'Bebeu 2L de água hoje?', type: 'boolean', required: true },
      { id: 'q8', text: 'Dormiu pelo menos 7 horas?', type: 'boolean', required: true }
    ],
    createdAt: '2024-03-01',
    isDeleted: false
  }
];
