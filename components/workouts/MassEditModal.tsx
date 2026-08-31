import React, { useState, useEffect } from 'react';
import { X, ListChecks, Check } from 'lucide-react';
import { ExerciseRow } from './WorkoutPlanBuilder';

export interface MassEditChanges {
  sets: { type: 'none' | 'set' | 'add', value: string };
  reps: { type: 'none' | 'set' | 'add', value: string };
  rest: { type: 'none' | 'set' | 'add', value: string };
}

interface MassEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: ExerciseRow[];
  onApply: (selectedIds: string[], changes: MassEditChanges) => void;
}

export function MassEditModal({ isOpen, onClose, exercises, onApply }: MassEditModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [changes, setChanges] = useState<MassEditChanges>({
    sets: { type: 'none', value: '' },
    reps: { type: 'none', value: '' },
    rest: { type: 'none', value: '' }
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setChanges({
        sets: { type: 'none', value: '' },
        reps: { type: 'none', value: '' },
        rest: { type: 'none', value: '' }
      });
    }
  }, [isOpen, exercises]);

  if (!isOpen) return null;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(exercises.map(e => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleApply = () => {
    onApply(Array.from(selectedIds), changes);
    onClose();
  };

  const ChangeRow = ({ label, field }: { label: string, field: keyof MassEditChanges }) => (
    <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">{label}</h4>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={changes[field].type}
          onChange={(e) => setChanges(prev => ({ ...prev, [field]: { ...prev[field], type: e.target.value as any } }))}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="none">Não alterar</option>
          <option value="set">Definir valor específico</option>
          <option value="add">Adicionar/Subtrair valor</option>
        </select>
        {changes[field].type !== 'none' && (
          <input
            type="text"
            value={changes[field].value}
            onChange={(e) => setChanges(prev => ({ ...prev, [field]: { ...prev[field], value: e.target.value } }))}
            placeholder={changes[field].type === 'add' ? 'Ex: +1, -10s' : 'Novo valor...'}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
              <ListChecks size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">Edição em Massa</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Modifique múltiplos exercícios simultaneamente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Esquerda: Seleção */}
          <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === exercises.length && exercises.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition-colors">Selecionar Todos</span>
              </label>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                {selectedIds.size} / {exercises.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
              {exercises.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-sm">Nenhum exercício neste treino.</div>
              ) : (
                exercises.map(ex => (
                  <label key={ex.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedIds.has(ex.id) ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'}`}>
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(ex.id)}
                      onChange={(e) => handleSelect(ex.id, e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {ex.exerciseName || "Exercício sem nome"}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">{ex.sets || '0'}s</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">{ex.reps || '0'}r</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">{ex.rest || '0s'}</span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Direita: Modificações */}
          <div className="w-full lg:w-1/2 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <div className="mb-2">
                 <h3 className="text-base font-bold text-slate-800 dark:text-white">Modificações a Aplicar</h3>
                 <p className="text-xs text-slate-500 mt-1">Defina as alterações que deseja aplicar aos {selectedIds.size} exercícios selecionados.</p>
              </div>

              <ChangeRow label="Séries" field="sets" />
              <ChangeRow label="Repetições" field="reps" />
              <ChangeRow label="Descanso" field="rest" />

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900 shrink-0">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleApply}
                disabled={selectedIds.size === 0}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/20"
              >
                <Check size={16} /> APLICAR ALTERAÇÕES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
