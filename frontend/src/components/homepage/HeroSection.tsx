import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-light-primary dark:bg-dark-background overflow-hidden theme-transition">
      <div className="absolute inset-0 bg-light-accent/10 dark:bg-dark-accent/10"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          filter: 'brightness(0.5) opacity(1)'
        }}
      ></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-bold text-light-text dark:text-dark-secondary mb-6 leading-tight">
            Lost a Pet?{' '}
            <span className="text-light-accent dark:text-dark-accent">
              Found a Friend?
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-light-text/90 dark:text-dark-neutral mb-8 font-light">
            Let's Reunite Them Together
          </h2>
          <p className="text-xl text-light-text/80 dark:text-dark-neutral mb-12 max-w-2xl mx-auto leading-relaxed">
            Helping lost pets find their way home through our caring community network
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="animate-glow bg-light-accent dark:bg-dark-accent text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="text-2xl">🐾</span>
              <span>Start Your Search</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/register')}
              className="bg-light-neutral/20 dark:bg-dark-primary/20 backdrop-blur-sm text-light-text dark:text-dark-secondary px-8 py-4 rounded-full text-lg font-semibold hover:bg-light-neutral/30 dark:hover:bg-dark-primary/30 transition-all border border-light-secondary/30 dark:border-dark-secondary/30"
            >
              Join Our Community
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-light-text/50 dark:border-dark-secondary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-light-text/70 dark:bg-dark-secondary/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;