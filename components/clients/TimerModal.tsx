import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeconds: number;
  exerciseName: string;
}

export const TimerModal: React.FC<TimerModalProps> = ({ isOpen, onClose, initialSeconds, exerciseName }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(initialSeconds);
      setIsRunning(true);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setTimeLeft(initialSeconds);
    setIsRunning(true);
  };

  const handleSkip = () => {
    onClose();
  };

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = initialSeconds > 0 ? circumference - (timeLeft / initialSeconds) * circumference : 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col items-center p-8 animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-colors bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 text-center px-6 leading-tight">
          {exerciseName}
        </h3>
        
        <div className="relative flex items-center justify-center mb-10">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Descanso</span>
            <span className="text-5xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-medium text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
              de {formatTime(initialSeconds)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={handleRestart}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            title="Reiniciar"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="p-6 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105 active:scale-95"
            title={isRunning ? 'Pausar' : 'Retomar'}
          >
            {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleSkip}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            title="Pular"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
