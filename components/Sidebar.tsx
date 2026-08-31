import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../constants';
import { LogOut, Zap, ChevronDown } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Auto-expand group if active tab is inside it
  useEffect(() => {
    MENU_ITEMS.forEach(item => {
      if (item.subItems) {
        const isChildActive = item.subItems.some(sub => sub.id === activeTab);
        if (isChildActive) {
          setExpandedGroups(prev => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [activeTab]);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20 xl:w-64'}
        glass-panel border-r border-slate-200 dark:border-slate-800
        flex flex-col py-6
      `}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-center xl:justify-start xl:px-8 mb-8 shrink-0">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center text-white font-bold text-xl shrink-0">
          <Zap size={24} fill="white" />
        </div>
        <span className={`ml-3 font-bold text-xl tracking-tight ${isOpen ? 'block' : 'hidden xl:block'} bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent`}>
          Evolve
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 px-3 pb-4" style={{ scrollbarWidth: 'thin' }}>
          {MENU_ITEMS.map((item) => {
            const hasSubItems = !!item.subItems;
            const isChildActive = hasSubItems && item.subItems!.some(sub => sub.id === activeTab);
            const isActive = activeTab === item.id || isChildActive;
            const isExpanded = expandedGroups[item.id];
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="flex flex-col">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleGroup(item.id);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`
                    flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden shrink-0
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}
                  `}
                >
                  {isActive && !hasSubItems && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className={`ml-3 font-medium text-sm ${isOpen ? 'block' : 'hidden xl:block'} flex-1 text-left ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  
                  {hasSubItems && (
                    <ChevronDown 
                      size={16} 
                      className={`${isOpen ? 'block' : 'hidden xl:block'} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  )}
                  
                  {/* Tooltip for collapsed mode */}
                  <div className="absolute left-16 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 xl:group-hover:opacity-0 pointer-events-none transition-opacity z-50 whitespace-nowrap lg:block hidden">
                     {item.label}
                  </div>
                </button>

                {/* Sub Items */}
                {hasSubItems && (
                  <div 
                    className={`
                      ${isOpen ? 'flex' : 'hidden xl:flex'} flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out
                      ${isExpanded ? 'max-h-40 mt-1 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    {item.subItems!.map(subItem => {
                      const isSubActive = activeTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id)}
                          className={`
                            flex items-center pl-12 pr-4 py-2.5 rounded-xl transition-all duration-200 relative
                            ${isSubActive 
                              ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50/50 dark:bg-primary-900/10' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30'}
                          `}
                        >
                          {isSubActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full" />
                          )}
                          <span className="text-sm">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
    </aside>
  );
};

export default Sidebar;