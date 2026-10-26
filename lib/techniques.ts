export interface ExerciseTechnique {
  id: string;
  name: string;
  acronym: string;
  defaultVolume: number;
  description: string;
  isActive: boolean;
}

export const DEFAULT_TECHNIQUES: ExerciseTechnique[] = [
  { id: '1', name: 'Drop Set', acronym: 'DS', defaultVolume: 1, description: 'Redução de carga após falha muscular.', isActive: true },
  { id: '2', name: 'Rest Pause', acronym: 'RP', defaultVolume: 1, description: 'Pausa curta entre repetições.', isActive: true },
  { id: '3', name: 'Bi-Set', acronym: 'BS', defaultVolume: 2, description: 'Dois exercícios sem descanso.', isActive: true },
  { id: '4', name: 'Super-Set', acronym: 'SS', defaultVolume: 2, description: 'Dois exercícios de grupos opostos sem descanso.', isActive: true },
  { id: '5', name: 'Cluster Set', acronym: 'CS', defaultVolume: 1, description: 'Micro-pausas dentro da mesma série.', isActive: true },
  { id: '6', name: 'Myo-Reps', acronym: 'MR', defaultVolume: 1, description: 'Série de ativação seguida de mini-séries.', isActive: true },
  { id: '7', name: 'FST-7', acronym: 'FST7', defaultVolume: 7, description: '7 séries com 30-45s de descanso para expansão de fáscia.', isActive: true },
  { id: '8', name: 'Série Excêntrica', acronym: 'EXC', defaultVolume: 1, description: 'Foco na fase negativa (4 a 6 segundos).', isActive: true },
];

const STORAGE_KEY = 'pr1me_exercise_techniques';

export const getRegisteredTechniques = (): ExerciseTechnique[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(t => {
          const n = (t.name || '').trim().toLowerCase();
          return n !== 'normal' && n !== 'sem técnica' && n !== 'sem tecnica';
        });
      }
    }
  } catch (e) {
    console.warn('Error reading registered techniques from localStorage:', e);
  }
  return DEFAULT_TECHNIQUES;
};

export const saveRegisteredTechniques = (techniques: ExerciseTechnique[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(techniques));
    window.dispatchEvent(new Event('pr1me_techniques_updated'));
  } catch (e) {
    console.warn('Error saving registered techniques to localStorage:', e);
  }
};
