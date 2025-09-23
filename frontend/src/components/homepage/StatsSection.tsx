import React, { useState, useEffect } from 'react';

const StatsSection: React.FC = () => {
  const [counters, setCounters] = useState({
    petsReunited: 0,
    activeCases: 0,
    volunteers: 0,
    successRate: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      petsReunited: 120,
      activeCases: 45,
      volunteers: 89,
      successRate: 94
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        petsReunited: Math.floor(targets.petsReunited * progress),
        activeCases: Math.floor(targets.activeCases * progress),
        volunteers: Math.floor(targets.volunteers * progress),
        successRate: Math.floor(targets.successRate * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-light-accent dark:bg-dark-accent theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Impact
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Real numbers from real rescues that made a difference
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
              {counters.petsReunited}+
            </div>
            <div className="text-white/90 text-lg font-medium flex items-center justify-center">
              <span className="mr-2">🐕</span>Pets Reunited
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
              {counters.activeCases}
            </div>
            <div className="text-white/90 text-lg font-medium flex items-center justify-center">
              <span className="mr-2">📋</span>Active Cases
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
              {counters.volunteers}
            </div>
            <div className="text-white/90 text-lg font-medium flex items-center justify-center">
              <span className="mr-2">👥</span>Volunteers
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
              {counters.successRate}%
            </div>
            <div className="text-white/90 text-lg font-medium flex items-center justify-center">
              <span className="mr-2">⭐</span>Success Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;