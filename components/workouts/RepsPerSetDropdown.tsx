import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlignLeft, X } from 'lucide-react';
import { ExerciseRow } from './WorkoutPlanBuilder';

export type RepsMetricUnit = 'reps' | 'kcal' | 'distancia' | 'tempo' | 'rondas';

export interface MetricOption {
  value: RepsMetricUnit;
  label: string;
  placeholder: string;
  shortLabel: string;
}

export const METRIC_OPTIONS: MetricOption[] = [
  { value: 'reps', label: 'Reps (Repetições)', placeholder: 'Ex: 10', shortLabel: 'reps' },
  { value: 'kcal', label: 'Kcal (Calorias)', placeholder: 'Ex: 250', shortLabel: 'kcal' },
  { value: 'distancia', label: 'Distância (km/m)', placeholder: 'Ex: 5km', shortLabel: 'dist.' },
  { value: 'tempo', label: 'Tempo (seg/min)', placeholder: 'Ex: 45s', shortLabel: 'tempo' },
  { value: 'rondas', label: 'Rondas', placeholder: 'Ex: 3', shortLabel: 'rondas' },
];

interface RepsPerSetDropdownProps {
  exercise: ExerciseRow;
  onChange: (repsPerSet: Record<number, string>, unit?: RepsMetricUnit) => void;
  onUnitChange?: (unit: RepsMetricUnit) => void;
}

export const RepsPerSetDropdown: React.FC<RepsPerSetDropdownProps> = ({ 
  exercise, 
  onChange,
  onUnitChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUnit: RepsMetricUnit = (exercise.repsUnit as RepsMetricUnit) || 'reps';
  const selectedOption = METRIC_OPTIONS.find(o => o.value === currentUnit) || METRIC_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const numSets = parseInt(exercise.sets, 10) || 0;
      
      // Calculate width needed for horizontal layout, ensuring minWidth accommodates the header dropdown
      const boxWidth = 62; // ~62px per set input
      const gap = 8;
      const padding = 28;
      
      const contentWidth = Math.max(270, padding + Math.max(1, numSets) * boxWidth + Math.max(0, numSets - 1) * gap);
      const maxWidth = Math.min(contentWidth, window.innerWidth - 24);

      const computedLeft = Math.max(12, Math.min(rect.left - maxWidth / 2 + rect.width / 2, window.innerWidth - maxWidth - 12));

      const style: React.CSSProperties = {
        left: computedLeft,
        width: maxWidth,
      };

      // Decide if opens above or below
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 145;
      
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        style.bottom = window.innerHeight - rect.top + 8;
      } else {
        style.top = rect.bottom + 8;
      }
      
      setDropdownStyle(style);
      setIsOpen(prev => !prev);
    }
  };

  const numSets = parseInt(exercise.sets, 10) || 0;
  const repsPerSet = exercise.repsPerSet || {};
  const hasReps = Object.keys(repsPerSet).length > 0;

  const handleUnitChange = (newUnit: RepsMetricUnit) => {
    if (onUnitChange) {
      onUnitChange(newUnit);
    }
    onChange(repsPerSet, newUnit);
  };

  const handleChangeSingle = (setNum: number, val: string) => {
    onChange({ ...repsPerSet, [setNum]: val }, currentUnit);
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button 
        onClick={handleOpen}
        className={`p-1.5 rounded-lg border transition-colors inline-flex items-center gap-1 ${
          hasReps || (currentUnit && currentUnit !== 'reps')
            ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-950/40 dark:text-primary-400 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 font-bold'
            : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30'
        }`}
        title={`Definir por série (${selectedOption.label})`}
      >
        <AlignLeft size={14} />
        {currentUnit !== 'reps' && (
          <span className="text-[9px] font-extrabold uppercase tracking-tight text-primary-600 dark:text-primary-400">
            {selectedOption.shortLabel}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="fixed z-[100] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-w-full"
        >
          {/* Header com mini dropdown de seleção de métrica (kcal, distancia, tempo, rondas, reps) */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/80 gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5 whitespace-nowrap">
                Métrica:
              </span>
              
              <select
                value={currentUnit}
                onChange={(e) => handleUnitChange(e.target.value as RepsMetricUnit)}
                className="text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-primary-600 dark:text-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shadow-xs transition-colors truncate max-w-[170px]"
              >
                {METRIC_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 shrink-0"
              title="Fechar"
            >
              <X size={14} />
            </button>
          </div>
          
          {/* Inputs por Série */}
          <div className="p-3 overflow-x-auto custom-scrollbar">
            {numSets > 0 ? (
              <div className="flex items-center gap-2 pb-1">
                {Array.from({ length: numSets }).map((_, idx) => {
                  const setNum = idx + 1;
                  return (
                    <div key={setNum} className="flex flex-col gap-1 items-center">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400">#{setNum}</span>
                        {currentUnit !== 'reps' && (
                          <span className="text-[8px] font-semibold text-primary-500 lowercase">
                            {selectedOption.shortLabel}
                          </span>
                        )}
                      </div>
                      <input 
                        value={repsPerSet[setNum] || ''}
                        onChange={(e) => handleChangeSingle(setNum, e.target.value)}
                        className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 rounded-lg p-1.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 outline-none transition-all"
                        placeholder={selectedOption.placeholder}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-3 text-slate-500 dark:text-slate-400 text-xs">
                Defina o número de séries primeiro.
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
