import React from 'react';
import Navigation from './components/homepage/Navigation';
import HeroSection from './components/homepage/HeroSection';
import AboutSection from './components/homepage/AboutSection';
import FeaturesSection from './components/homepage/FeaturesSection';
import StatsSection from './components/homepage/StatsSection';
import SuccessStoriesSection from './components/homepage/SuccessStoriesSection';
import CallToActionSection from './components/homepage/CallToActionSection';
import Footer from './components/homepage/Footer';
import FloatingPaws from './components/homepage/FloatingPaws';

const HomePage: React.FC = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: 'Poppins', sans-serif;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(5deg); }
      50% { transform: translateY(-10px) rotate(-5deg); }
      75% { transform: translateY(-15px) rotate(3deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
      50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.6); }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .animate-pulse-custom {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
    
    .hero-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card-hover {
      transition: all 0.3s ease;
    }
    
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-white overflow-hidden">
        <FloatingPaws />
        <Navigation />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <StatsSection />
        <SuccessStoriesSection />
        <CallToActionSection />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;