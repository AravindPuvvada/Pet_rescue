import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              PetRescue
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">About</a>
            <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Features</a>
            <a href="#stories" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Stories</a>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all font-medium"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#about" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">About</a>
              <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Features</a>
              <a href="#stories" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Stories</a>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all font-medium text-left"
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