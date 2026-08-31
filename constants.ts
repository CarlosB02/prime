import { Client, DashboardEvent, PendingItem, Feedback, Metric, Exercise, Food, FoodCategory, FoodUnit, Supplement, SupplementCategory, ContentItem, ContentType, ContentCategory, PaymentPlan, PromoCode } from './types';
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
  Settings,
  Calendar
} from 'lucide-react';

export const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Calendário', icon: Calendar, id: 'calendar' },
  { label: 'Clientes', icon: Users, id: 'clients' },
  { 
    label: 'Negócio', 
    icon: Wallet, 
    id: 'business_group',
    subItems: [
      { label: 'Financeiro', id: 'finance' },
      { label: 'Planos de Pagamento', id: 'payments' },
      { label: 'Códigos Promo', id: 'promos' }
    ]
  },
  { label: 'Equipa', icon: Users, id: 'team' },
  { label: 'Planos de Treino', icon: Dumbbell, id: 'workouts' },
  { 
    label: 'Alimentos e Suplementação', 
    icon: Apple, 
    id: 'nutrition_group',
    subItems: [
      { label: 'Alimentos', id: 'nutrition' },
      { label: 'Suplementação', id: 'supplements' }
    ]
  },
  { label: 'Planos de Nutrição', icon: Utensils, id: 'nutrition_plans' },
  { 
    label: 'Exercícios', 
    icon: Activity, 
    id: 'exercises_group',
    subItems: [
      { label: 'Exercícios', id: 'exercises' },
      { label: 'Técnica de Exercícios', id: 'exercise_techniques' }
    ]
  },
  { label: 'Conteúdos', icon: FileText, id: 'content' },
  { label: 'Questionários', icon: HelpCircle, id: 'questionnaires' },
  { label: 'Notificações', icon: Bell, id: 'notifications' },
  {
    label: 'Definições',
    icon: Settings,
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
    isDeleted: false
  },
  {
    id: '3',
    name: 'Abacate',
    category: 'Gordura',
    image: 'https://images.unsplash.com/photo-1523049673856-356c64cf11d9?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    isDeleted: false
  },
  {
    id: '4',
    name: 'Whey Protein (Scoop)',
    category: 'Suplementos',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'unidade',
    baseQuantity: 1,
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1,
    isDeleted: false
  },
  {
    id: '5',
    name: 'Brócolos Cozidos',
    category: 'Vegetais',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=200&h=200',
    unit: 'g',
    baseQuantity: 100,
    calories: 35,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    isDeleted: true
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
