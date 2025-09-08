import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, ArrowRight, CheckCircle } from 'lucide-react';

const CallToActionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="animate-fadeInUp">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of pet lovers who are helping reunite families every day. 
            Your next action could bring a pet home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="animate-glow bg-white text-purple-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center space-x-3 shadow-2xl"
            >
              <PawPrint className="w-7 h-7" />
              <span>Get Started Now</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 text-white/80">
              <CheckCircle className="w-5 h-5" />
              <span className="text-lg">Free to use</span>
              <CheckCircle className="w-5 h-5" />
              <span className="text-lg">24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;