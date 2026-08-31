export type Status = 'active' | 'pending' | 'inactive' | 'completed' | 'warning';

export interface Client {
  id: string;
  name: string;
  avatar: string;
  plan: string;
  status: Status;
  lastActive: string;
  contact: string;
  progress: number;
  // New fields for quick filters
  evaluationStatus?: 'por_validar' | 'pendente' | 'concluida';
  isNew?: boolean;
  paymentStatus?: 'pago' | 'expirado' | 'a_expirar';
  birthday?: string; // MM-DD format for easy checking
  paymentExpiryDate?: string; // YYYY-MM-DD
  age?: number;
  
  // New fields for table
  isPaying?: boolean;
  hasSubscription?: boolean;
  nextEvaluationDate?: string; // YYYY-MM-DD
}

export interface DashboardEvent {
  id: string;
  type: 'birthday' | 'check-in' | 'goal' | 'payment';
  clientId: string;
  clientName: string;
  title: string;
  time: string;
  isUrgent?: boolean;
}

export interface PendingItem {
  id: string;
  type: 'workout_submission' | 'physical_assessment' | 'nutrition_update';
  clientId: string;
  clientName: string;
  date: string;
  status: Status;
  details: string;
}

export interface Feedback {
  id: string;
  clientId: string;
  clientName: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  read: boolean;
}

export interface Metric {
  label: string;
  value: string;
  trend: number; // percentage
  trendLabel: string;
}

export type VideoType = 'link' | 'upload';

export interface ExerciseVideo {
  type: VideoType;
  url: string; // URL for link or object URL/filename for upload
}

export interface Exercise {
  id: string;
  name: string;
  image: string;
  muscleGroup: string;
  type: 'Indefinido' | 'Alongamento' | 'Mobilidade' | 'Força';
  equipment: string; // 'Peso Livre', 'Máquina', 'Peso Corporal', 'Cabo'
  difficulty: 'Iniciante' | 'Intermédio' | 'Avançado';
  videos: ExerciseVideo[];
  description: string;
  notes?: string;
  isDeleted: boolean;
}

export type FoodCategory = 'Proteína' | 'Hidratos' | 'Gordura' | 'Vegetais' | 'Fruta' | 'Laticínios' | 'Suplementos' | 'Bebidas' | 'Outros';
export type FoodUnit = 'g' | 'ml' | 'unidade';

export interface Food {
  id: string;
  name: string;
  image: string;
  category: FoodCategory;
  unit: FoodUnit;
  baseQuantity: number; // e.g. 100g or 1 unit
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  description?: string;
  isDeleted: boolean;
}

export type SupplementCategory = 'Proteína' | 'Creatina' | 'Pré-Treino' | 'Vitaminas' | 'Recuperação' | 'Perda de Peso' | 'Saúde Geral' | 'Outros';

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: SupplementCategory;
  description: string;
  link: string; // URL to product page
  isDeleted: boolean;
}

export type ContentType = 'video' | 'article' | 'pdf' | 'audio';
export type ContentCategory = 'Nutrição' | 'Treino' | 'Mindset' | 'Receitas' | 'Tutorial' | 'Outros';

export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  type: ContentType;
  category: ContentCategory;
  description: string;
  url: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface PaymentPlan {
  id: string;
  name: string;
  durationMonths: number; // 1 to 12
  price: number;
  isSubscription: boolean;
  allowOneTimePayment: boolean;
  allowInstallments: boolean;
  isTemporary: boolean;
  hasContentAccess: boolean;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isDeleted: boolean;
}

export type PromoType = 'percent' | 'fixed_amount' | 'fixed_price';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  planIds: string[]; // IDs of linked PaymentPlans
  validityMinutes: number; // Optional, kept for data structure compatibility
  validUntil: string; // Date string
  usageCount: number;
  maxUsage: number;
  applyToRecurring: boolean; // "Aplicar desconto nos pagamentos seguintes"
  createdAt: string;
  isDeleted: boolean;
}

export type QuestionnaireType = 'Avaliação inicial' | 'Periódico' | 'Registo diário' | 'Inicial de treino' | 'Pós-treino' | 'Personalizado';
export type QuestionType = 'text' | 'number' | 'boolean' | 'multiple_choice' | 'scale';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  type: QuestionnaireType;
  frequency?: number; // Repetir a cada ___ dias
  isDefault?: boolean;
  metrics?: string[];
  questions: Question[];
  createdAt: string;
  isDeleted: boolean;
}
