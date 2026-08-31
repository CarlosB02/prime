import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Image as ImageIcon } from 'lucide-react';

export interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: string;
  image?: string;
}

export const MOCK_EXERCISES_DB: ExerciseOption[] = [
  { id: '1', name: 'Supino Plano (Barra)', muscleGroup: 'Peitoral', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Agachamento Livre', muscleGroup: 'Pernas', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Peso Morto', muscleGroup: 'Costas', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=200&auto=format&fit=crop' },
  { id: '4', name: 'Puxada Frontal', muscleGroup: 'Costas', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
  { id: '5', name: 'Desenvolvimento (Halteres)', muscleGroup: 'Ombros', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop' },
  { id: '6', name: 'Hip Thrust Barra Livre', muscleGroup: 'Glúteos', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200&auto=format&fit=crop' },
  { id: '7', name: 'Extensão de Pernas', muscleGroup: 'Pernas', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=200&auto=format&fit=crop' },
  { id: '8', name: 'Bicep Curl (Halteres)', muscleGroup: 'Braços', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
];

interface ExerciseSelectProps {
  value: string;
  onChange: (value: string, muscleGroup?: string) => void;
  placeholder?: string;
}

export const ExerciseSelect: React.FC<ExerciseSelectProps> = ({ value, onChange, placeholder = "Nome do exercício..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300;
      
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        setDropdownStyle({
          bottom: window.innerHeight - rect.top + 4,
          left: rect.left,
          width: Math.max(300, rect.width)
        });
      } else {
        setDropdownStyle({
          top: rect.bottom + 4,
          left: rect.left,
          width: Math.max(300, rect.width)
        });
      }
    }
    setIsOpen(true);
    setSearch('');
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 300;
        
        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
          setDropdownStyle({
            bottom: window.innerHeight - rect.top + 4,
            top: 'auto',
            left: rect.left,
            width: Math.max(300, rect.width)
          });
        } else {
          setDropdownStyle({
            top: rect.bottom + 4,
            bottom: 'auto',
            left: rect.left,
            width: Math.max(300, rect.width)
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const filteredExercises = MOCK_EXERCISES_DB.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(search.toLowerCase())
  );

  const selectedExercise = MOCK_EXERCISES_DB.find(ex => ex.name === value);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 cursor-pointer hover:border-primary-500 transition-colors"
        onClick={() => {
          if (isOpen) {
             setIsOpen(false);
          } else {
             handleOpen();
          }
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedExercise?.image ? (
            <img src={selectedExercise.image} alt={selectedExercise.name} className="w-6 h-6 rounded object-cover shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-400">
              <ImageIcon size={12} />
            </div>
          )}
          <span className={`text-sm font-bold truncate ${!value ? 'text-slate-400 font-normal' : 'text-slate-800 dark:text-white'}`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          style={{...dropdownStyle, position: 'fixed'}}
          className="z-[9999] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden flex flex-col"
        >
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                autoFocus
                type="text"
                placeholder="Pesquisar exercícios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
            {filteredExercises.length > 0 ? (
              filteredExercises.map(ex => (
                <div 
                  key={ex.id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    onChange(ex.name, ex.muscleGroup);
                    setIsOpen(false);
                  }}
                >
                  {ex.image ? (
                    <img src={ex.image} alt={ex.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <ImageIcon size={16} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{ex.name}</p>
                    <p className="text-xs text-slate-500">{ex.muscleGroup}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                Nenhum exercício encontrado.
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
