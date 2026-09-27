import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CustomTargetIcon, CustomUsersIcon } from '../icons';

export function DashboardCommunity({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
  const activeChallenge = {
    id: 'c1',
    title: 'Desafio 30 Dias: Definição',
    goal: 'Atingir 10.000 passos diários',
    progress: 65,
    daysLeft: 12,
    participants: 45,
    avatars: [
      'https://i.pravatar.cc/150?u=1',
      'https://i.pravatar.cc/150?u=2',
      'https://i.pravatar.cc/150?u=3'
    ],
    leaderboard: [
      { id: '1', name: 'João P.', score: '85k', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: '2', name: 'Ana S.', score: '82k', avatar: 'https://i.pravatar.cc/150?u=2' },
      { id: '3', name: 'Miguel R.', score: '79k', avatar: 'https://i.pravatar.cc/150?u=3' },
    ]
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CustomTargetIcon size={20} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">Comunidade</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeChallenge ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 pr-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{activeChallenge.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{activeChallenge.goal}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg whitespace-nowrap shrink-0">
                  {activeChallenge.daysLeft} dias
                </span>
              </div>

              <div className="mt-4 mb-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Progresso Global</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeChallenge.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full" 
                    style={{ width: `${activeChallenge.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {activeChallenge.leaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between bg-white dark:bg-slate-800/50 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black w-4 text-center ${
                        index === 0 ? 'text-amber-500' :
                        index === 1 ? 'text-slate-400' :
                        'text-orange-400'
                      }`}>{index + 1}º</span>
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{user.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{user.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {activeChallenge.avatars.map((url, i) => (
                    <img key={i} src={url} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{activeChallenge.participants} users</span>
              </div>
              <button 
                onClick={() => onNavigate('community', activeChallenge.id)}
                className="text-primary-600 hover:text-primary-700 p-1.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <CustomUsersIcon size={18} />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Nenhuma atividade</p>
            <p className="text-xs text-slate-500 mb-3">Crie um desafio para engajar a comunidade.</p>
            <button 
              onClick={() => onNavigate('community-create')}
              className="text-xs font-bold text-primary-600 hover:text-primary-700"
            >
              + Iniciar
            </button>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => onNavigate('community')}
        className="w-full mt-auto pt-4 pb-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        Ver Comunidade
      </button>
    </div>
  );
}
