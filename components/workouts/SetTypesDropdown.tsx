import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tags, X } from 'lucide-react';
import { ExerciseRow } from './WorkoutPlanBuilder';

const SET_TYPE_OPTIONS = [
  { value: '', label: 'Sem tipo definido' },
  { value: 'Warm Up Set', label: 'Warm Up Set' },
  { value: 'Feeder Set', label: 'Feeder Set' },
  { value: 'Working Set', label: 'Working Set' },
  { value: 'Top Set', label: 'Top Set' },
  { value: 'Back-off Set', label: 'Back-off Set' },
  { value: 'Drop Set', label: 'Drop Set' },
  { value: 'Failure Set', label: 'Failure Set' },
];

interface SetTypesDropdownProps {
  exercise: ExerciseRow;
  onChange: (setTypes: Record<number, string>) => void;
}

export const SetTypesDropdown: React.FC<SetTypesDropdownProps> = ({ exercise, onChange }) => {
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
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 350; // max height of dropdown
      
      const style: React.CSSProperties = {
        left: rect.left - 150 + (rect.width / 2), // Center align roughly
        minWidth: 280,
      };

      if (style.left && Number(style.left) < 10) {
         style.left = 10;
      }

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
  const setTypes = exercise.setTypes || {};
  const hasTypes = Object.keys(setTypes).length > 0;

  const handleApplyToAll = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const newTypes: Record<number, string> = { ...setTypes };
    for (let i = 1; i <= numSets; i++) {
      newTypes[i] = val;
    }
    onChange(newTypes);
    e.target.value = '';
  };

  const handleChangeSingle = (setNum: number, val: string) => {
    onChange({ ...setTypes, [setNum]: val });
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button 
        onClick={handleOpen}
        className={`p-1.5 rounded-lg border transition-colors ${
          hasTypes
            ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
        }`}
        title="Definir tipos de séries"
      >
        <Tags size={14} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="fixed z-[100] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">Tipos de Séries</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {numSets > 0 ? (
              <div className="space-y-4">
                <div className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Aplicar a todas
                  </label>
                  <select 
                    onChange={handleApplyToAll}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg p-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none transition-all"
                    defaultValue=""
                  >
                    <option value="" disabled>Selecione rápido...</option>
                    {SET_TYPE_OPTIONS.filter(o => o.value).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: numSets }).map((_, idx) => {
                    const setNum = idx + 1;
                    return (
                      <div key={setNum} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                          {String(setNum).padStart(2, '0')}
                        </div>
                        <select 
                          value={setTypes[setNum] || ''}
                          onChange={(e) => handleChangeSingle(setNum, e.target.value)}
                          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg p-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none transition-all"
                        >
                          {SET_TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-xs">
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
