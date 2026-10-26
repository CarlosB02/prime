export interface ExerciseTextSnippet {
  id: string;
  title: string;
  category: string; // ex: 'Execução', 'Segurança', 'Respiração', 'Aquecimento', 'Geral'
  content: string;
  tags?: string[];
  createdAt: string;
}

const STORAGE_KEY = 'pr1me_exercise_text_bank';

export const DEFAULT_TEXT_SNIPPETS: ExerciseTextSnippet[] = [
  {
    id: '1',
    title: 'Manter a coluna neutra e core ativo',
    category: 'Postura & Core',
    content: 'Manter a curvatura natural da coluna lombar durante toda a amplitude do movimento. Ativar o transverso abdominal (brace abdominal) antes de iniciar a fase excêntrica.',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Cadência controlada na fase excêntrica (3-0-1-0)',
    category: 'Cadência & Ritmo',
    content: 'Controlar a descida/fase excêntrica em 3 segundos, inverter o movimento sem ressaltos no ponto de estiramento e subir de forma explosiva em 1 segundo.',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Padrão respiratório no esforço',
    category: 'Respiração',
    content: 'Inspirar profundamente e estabilizar a caixa torácica antes de descer a carga. Expirar controladamente na passagem do ponto de estagnação da fase concêntrica.',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    title: 'Amplitude máxima sem comprometer alinhamento',
    category: 'Execução',
    content: 'Trabalhar na máxima amplitude ativa permitida pela mobilidade articular, sem compensações pélvicas ou arredondamento dos ombros.',
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    title: 'Depressão e retração escapular',
    category: 'Postura & Core',
    content: 'Puxar as omoplatas para trás e para baixo antes do início da puxada ou supino, garantindo uma base estável e proteção da articulação gleno-umeral.',
    createdAt: '2024-02-18'
  },
  {
    id: '6',
    title: 'Proximidade da falha muscular (RIR 1-2)',
    category: 'Intensidade',
    content: 'Executar as séries efetivas até restarem apenas 1 a 2 repetições em reserva com técnica estrita. Nunca sacrificar a forma por carga.',
    createdAt: '2024-03-01'
  }
];

export const getTextSnippets = (): ExerciseTextSnippet[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load text snippets from storage', e);
  }
  return DEFAULT_TEXT_SNIPPETS;
};

export const saveTextSnippets = (snippets: ExerciseTextSnippet[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  } catch (e) {
    console.error('Failed to save text snippets to storage', e);
  }
};
