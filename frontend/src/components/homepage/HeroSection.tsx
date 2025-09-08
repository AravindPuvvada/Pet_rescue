import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          filter: 'brightness(0.7)'
        }}
      ></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Lost a Pet?{' '}
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Found a Friend?
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/90 mb-8 font-light">
            Let's Reunite Them Together
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Helping lost pets find their way home through our caring community network
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="animate-glow bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <PawPrint className="w-6 h-6" />
              <span>Start Your Search</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/register')}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              Join Our Community
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;