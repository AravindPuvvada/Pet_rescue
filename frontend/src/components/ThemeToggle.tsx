import React from 'react';
import { Sun, Moon, PawPrint } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
interface ThemeToggleProps {
  variant?: 'navbar' | 'auth';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'navbar', className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'auth') {
    return (
      <div className={`flex items-center justify-center mb-6 ${className}`}>
        <button
          onClick={toggleTheme}
          className="group relative flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <div className="relative flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-white/80" />
            <div className="relative w-12 h-6 bg-white/20 rounded-full transition-colors duration-300 ml-2">
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              >
                {theme === 'light' ? (
                  <Sun className="w-3 h-3 text-yellow-500" />
                ) : (
                  <Moon className="w-3 h-3 text-blue-600" />
                )}
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center w-12 h-12 bg-light-neutral dark:bg-dark-primary rounded-2xl border border-light-secondary/20 dark:border-dark-secondary/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <Sun
          className={`absolute w-5 h-5 text-light-accent transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
          }`}
        />
        <Moon
          className={`absolute w-5 h-5 text-dark-accent transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </div>
      
      {/* Cute paw print indicator */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PawPrint className="w-2 h-2 text-white" />
      </div>
    </button>
  );
};

export default ThemeToggle;