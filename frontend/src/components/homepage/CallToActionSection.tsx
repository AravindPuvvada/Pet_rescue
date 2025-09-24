import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToActionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-light-secondary dark:bg-dark-secondary theme-transition">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="animate-fadeInUp">
          <h2 className="text-4xl md:text-6xl font-bold text-white dark:text-dark-background mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 dark:text-dark-background/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of pet lovers who are helping reunite families every day.
            Your next action could bring a pet home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="animate-glow bg-white dark:bg-dark-background text-light-secondary dark:text-dark-secondary px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 dark:hover:bg-dark-primary transition-all transform hover:scale-105 flex items-center space-x-3 shadow-2xl"
            >
              <span className="text-2xl">🐾</span>
              <span>Get Started Now</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 text-white/80 dark:text-dark-background/80">
              <span className="text-xl">✅</span>
              <span className="text-lg">Free to use</span>
              <span className="text-xl">✅</span>
              <span className="text-lg">24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;