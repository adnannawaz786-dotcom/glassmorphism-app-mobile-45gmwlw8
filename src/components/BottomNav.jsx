import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, Settings, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const BottomNav = ({ activeTab = 'home', onTabChange, onAddTodo }) => {
  const [isAddPressed, setIsAddPressed] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      color: 'text-blue-400'
    },
    {
      id: 'todos',
      label: 'Todos',
      icon: CheckSquare,
      color: 'text-green-400'
    },
    {
      id: 'add',
      label: 'Add',
      icon: Plus,
      color: 'text-purple-400',
      isSpecial: true
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      color: 'text-orange-400'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-400'
    }
  ];

  const handleTabPress = (itemId) => {
    if (itemId === 'add') {
      setIsAddPressed(true);
      setTimeout(() => setIsAddPressed(false), 150);
      onAddTodo?.();
    } else {
      onTabChange?.(itemId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Glassmorphism background */}
      <div className="relative mx-4 mb-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10" />
        
        {/* Navigation content */}
        <div className="relative flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAddButton = item.id === 'add';
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabPress(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-300 relative group",
                  isAddButton 
                    ? "p-3" 
                    : "p-2 min-w-[60px]"
                )}
              >
                {/* Add button special styling */}
                {isAddButton ? (
                  <div className={cn(
                    "relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300",
                    "bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg",
                    "hover:shadow-purple-500/25 hover:shadow-xl",
                    "active:scale-95",
                    isAddPressed && "scale-95"
                  )}>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-75 blur-sm animate-pulse" />
                    <Icon 
                      size={24} 
                      className="relative z-10 text-white drop-shadow-sm" 
                    />
                  </div>
                ) : (
                  <>
                    {/* Regular nav item */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                      isActive 
                        ? "bg-white/20 shadow-lg scale-110" 
                        : "hover:bg-white/10 active:scale-95"
                    )}>
                      <Icon 
                        size={20} 
                        className={cn(
                          "transition-colors duration-300",
                          isActive 
                            ? item.color 
                            : "text-white/70 group-hover:text-white/90"
                        )} 
                      />
                    </div>
                    
                    {/* Label */}
                    <span className={cn(
                      "text-xs mt-1 transition-all duration-300 font-medium",
                      isActive 
                        ? cn("text-white scale-105", item.color)
                        : "text-white/60 group-hover:text-white/80"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className={cn(
                        "absolute -top-1 w-1 h-1 rounded-full transition-all duration-300",
                        item.color.replace('text-', 'bg-')
                      )} />
                    )}
                  </>
                )}
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-50" />
      </div>
    </div>
  );
};

export default BottomNav;