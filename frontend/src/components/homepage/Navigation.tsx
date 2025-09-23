import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-light-neutral/95 dark:bg-dark-primary/95 backdrop-blur-sm shadow-sm z-50 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-light-accent to-light-secondary dark:from-dark-accent dark:to-dark-secondary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-light-text dark:text-dark-secondary">
              PetRescue
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-light-text dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors font-medium">About</a>
            <a href="#features" className="text-light-text dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors font-medium">Features</a>
            <a href="#stories" className="text-light-text dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors font-medium">Stories</a>
            <ThemeToggle variant="navbar" />
            <button
              onClick={() => navigate('/login')}
              className="bg-light-accent dark:bg-dark-accent text-white px-6 py-2 rounded-full hover:opacity-90 transition-all font-medium shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-light-neutral dark:hover:bg-dark-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-light-text dark:text-dark-secondary" /> : <Menu className="w-6 h-6 text-light-text dark:text-dark-secondary" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-light-secondary/20 dark:border-dark-secondary/20">
            <div className="flex flex-col space-y-4">
              <a href="#about" className="text-light-text dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors font-medium">About</a>
              <a href="#features" className="text-light-text dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors font-medium">Features</a>
              <a href="#stories" className="text-light-text dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors font-medium">Stories</a>
              <div className="flex items-center justify-between">
                <span className="text-light-text dark:text-dark-secondary font-medium">Theme</span>
                <ThemeToggle variant="navbar" />
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-light-accent dark:bg-dark-accent text-white px-6 py-2 rounded-full hover:opacity-90 transition-all font-medium text-left shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;