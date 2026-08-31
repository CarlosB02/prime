import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, toggleSidebar, title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full px-6 py-4 flex items-center justify-between glass-panel border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
        
        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Center Search - Dynamic Width */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Pesquisar clientes, planos ou tarefas..." 
          className="block w-full pl-10 pr-3 py-2.5 rounded-xl border-none bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm shadow-inner"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
            <span className="text-xs text-slate-400 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5">⌘K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative overflow-hidden group"
          aria-label="Toggle Dark Mode"
        >
          <div className="relative z-10">
            {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
        </button>

        {/* User Profile */}
        <div className="relative flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700" ref={profileRef}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Renato Rodrigues</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personal Trainer Pro</p>
          </div>
          <button 
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img 
              src="https://picsum.photos/100/100?random=100" 
              alt="Profile" 
              className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-700 shadow-lg object-cover"
            />
            <ChevronDown size={16} className={`text-slate-400 hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700/50 sm:hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Renato Rodrigues</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personal Trainer Pro</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  <User size={18} className="text-slate-400" />
                  Perfil do PT
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Settings size={18} className="text-slate-400" />
                  Minha conta
                </button>
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-700/50">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                  <LogOut size={18} />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;