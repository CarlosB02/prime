import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Dumbbell, SlidersHorizontal, Timer } from 'lucide-react';
import { ExerciseRow } from './WorkoutPlanBuilder';

export interface PerSetSlotDropdownProps {
  exercise: ExerciseRow;
  title: string;
  fieldLabel: string;
  placeholder: string;
  applyPlaceholder?: string;
  icon: React.ReactNode;
  values?: Record<number, string>;
  onChange: (values: Record<number, string>) => void;
  onApplyToMain?: (val: string) => void;
  buttonTitle?: string;
}

export const PerSetSlotDropdown: React.FC<PerSetSlotDropdownProps> = ({
  exercise,
  title,
  placeholder,
  applyPlaceholder,
  icon,
  values = {},
  onChange,
  onApplyToMain,
  buttonTitle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [applyAllText, setApplyAllText] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const numSets = parseInt(exercise.sets, 10) || 0;
  const hasValues = values && Object.values(values).some(v => v !== undefined && String(v).trim() !== '');

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
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const currentSets = parseInt(exercise.sets, 10) || 0;

      const boxWidth = 64; // ~64px per set input
      const gap = 8;
      const padding = 28;

      const contentWidth = Math.max(280, padding + Math.max(1, currentSets) * boxWidth + Math.max(0, currentSets - 1) * gap);
      const maxWidth = Math.min(contentWidth, window.innerWidth - 24);

      const computedLeft = Math.max(12, Math.min(rect.left - maxWidth / 2 + rect.width / 2, window.innerWidth - maxWidth - 12));

      const style: React.CSSProperties = {
        left: computedLeft,
        width: maxWidth,
      };

      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 155;

      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        style.bottom = window.innerHeight - rect.top + 8;
      } else {
        style.top = rect.bottom + 8;
      }

      setDropdownStyle(style);
      setIsOpen(prev => !prev);
    }
  };

  const handleApplyToAll = () => {
    if (!applyAllText.trim() || numSets <= 0) return;
    const newValues: Record<number, string> = { ...values };
    for (let i = 1; i <= numSets; i++) {
      newValues[i] = applyAllText.trim();
    }
    onChange(newValues);
    if (onApplyToMain) {
      onApplyToMain(applyAllText.trim());
    }
    setApplyAllText('');
  };

  const handleChangeSingle = (setNum: number, val: string) => {
    onChange({ ...values, [setNum]: val });
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button
        type="button"
        onClick={handleOpen}
        className={`p-1.5 rounded-lg border transition-colors inline-flex items-center justify-center shrink-0 ${
          hasValues
            ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-950/40 dark:text-primary-400 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 font-bold'
            : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30'
        }`}
        title={buttonTitle || `Definir ${title.toLowerCase()} por série`}
      >
        {icon}
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="fixed z-[100] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-w-full"
        >
          {/* Header */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/80 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-primary-500 shrink-0">{icon}</span>
              <span className="font-bold text-xs text-slate-800 dark:text-white tracking-tight whitespace-nowrap">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {numSets > 1 && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={applyAllText}
                    onChange={(e) => setApplyAllText(e.target.value)}
                    placeholder={applyPlaceholder || 'Todos...'}
                    className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyToAll();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyToAll}
                    className="px-1.5 py-0.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/50 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded border border-primary-200 dark:border-primary-800 transition-colors cursor-pointer"
                    title="Aplicar a todas as séries"
                  >
                    OK
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 shrink-0 cursor-pointer"
                title="Fechar"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Slots por Série */}
          <div className="p-3 overflow-x-auto custom-scrollbar">
            {numSets > 0 ? (
              <div className="flex items-center gap-2 pb-1">
                {Array.from({ length: numSets }).map((_, idx) => {
                  const setNum = idx + 1;
                  return (
                    <div key={setNum} className="flex flex-col gap-1 items-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">#{setNum}</span>
                      <input
                        value={values?.[setNum] || ''}
                        onChange={(e) => handleChangeSingle(setNum, e.target.value)}
                        className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 rounded-lg p-1.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 outline-none transition-all"
                        placeholder={placeholder}
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

export const CargaPerSetDropdown: React.FC<{
  exercise: ExerciseRow;
  onChange: (values: Record<number, string>) => void;
  onApplyToMain?: (val: string) => void;
}> = ({ exercise, onChange, onApplyToMain }) => (
  <PerSetSlotDropdown
    exercise={exercise}
    title="Carga por Série"
    fieldLabel="Carga"
    placeholder="20kg"
    applyPlaceholder="Ex: 20kg"
    icon={<Dumbbell size={14} />}
    values={exercise.cargaPerSet}
    onChange={onChange}
    onApplyToMain={onApplyToMain}
    buttonTitle="Definir carga por série"
  />
);

export const RirPerSetDropdown: React.FC<{
  exercise: ExerciseRow;
  onChange: (values: Record<number, string>) => void;
  onApplyToMain?: (val: string) => void;
}> = ({ exercise, onChange, onApplyToMain }) => {
  const numSets = parseInt(exercise.sets, 10) || 0;
  const values: Record<number, string> = { ...(exercise.rirPerSet || {}) };
  if (exercise.rir && String(exercise.rir).trim() !== '') {
    for (let i = 1; i <= numSets; i++) {
      if (values[i] === undefined || values[i] === '') {
        values[i] = exercise.rir;
      }
    }
  }

  return (
    <PerSetSlotDropdown
      exercise={exercise}
      title="RIR por Série"
      fieldLabel="RIR"
      placeholder={exercise.rir || "1-2"}
      applyPlaceholder="Ex: 2"
      icon={<SlidersHorizontal size={14} />}
      values={values}
      onChange={onChange}
      onApplyToMain={onApplyToMain}
      buttonTitle="Definir RIR por série"
    />
  );
};

export const RestPerSetDropdown: React.FC<{
  exercise: ExerciseRow;
  onChange: (values: Record<number, string>) => void;
  onApplyToMain?: (val: string) => void;
}> = ({ exercise, onChange, onApplyToMain }) => (
  <PerSetSlotDropdown
    exercise={exercise}
    title="Descanso por Série"
    fieldLabel="Descanso"
    placeholder="90s"
    applyPlaceholder="Ex: 90s"
    icon={<Timer size={14} />}
    values={exercise.restPerSet}
    onChange={onChange}
    onApplyToMain={onApplyToMain}
    buttonTitle="Definir descanso por série"
  />
);
