import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlignLeft, X } from 'lucide-react';
import { ExerciseRow } from './WorkoutPlanBuilder';

interface RepsPerSetDropdownProps {
  exercise: ExerciseRow;
  onChange: (repsPerSet: Record<number, string>) => void;
}

export const RepsPerSetDropdown: React.FC<RepsPerSetDropdownProps> = ({ exercise, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const numSets = parseInt(exercise.sets, 10) || 0;
      
      // Calculate approximate width needed for the horizontal layout
      const boxWidth = 56; // w-14 ~ 56px
      const gap = 8; // gap-2 ~ 8px
      const padding = 24; // p-3 * 2 ~ 24px
      
      const contentWidth = padding + Math.max(1, numSets) * boxWidth + Math.max(0, numSets - 1) * gap;
      // Cap at viewport width minus some margin
      const maxWidth = Math.min(contentWidth, window.innerWidth - 40);

      const style: React.CSSProperties = {
        left: Math.max(10, rect.left - maxWidth / 2 + rect.width / 2),
        width: maxWidth,
      };

      // Decide if opens above or below
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 120; // approximate height needed
      
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

  const handleChangeSingle = (setNum: number, val: string) => {
    onChange({ ...repsPerSet, [setNum]: val });
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button 
        onClick={handleOpen}
        className={`p-1.5 rounded-lg border transition-colors ${
          hasReps
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
            : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
        }`}
        title="Definir reps por série"
      >
        <AlignLeft size={14} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="fixed z-[100] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-w-full"
        >
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider pl-1">Reps por Série</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="p-3 overflow-x-auto custom-scrollbar">
            {numSets > 0 ? (
              <div className="flex items-center gap-2 pb-1">
                {Array.from({ length: numSets }).map((_, idx) => {
                  const setNum = idx + 1;
                  return (
                    <div key={setNum} className="flex flex-col gap-1 items-center">
                      <span className="text-[10px] font-bold text-slate-400">#{setNum}</span>
                      <input 
                        value={repsPerSet[setNum] || ''}
                        onChange={(e) => handleChangeSingle(setNum, e.target.value)}
                        className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-lg p-1.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 outline-none transition-all"
                        placeholder="Ex: 10"
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
