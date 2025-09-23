import React from 'react';
import { Users, Shield } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-light-neutral dark:bg-dark-primary theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-secondary mb-6">
            About <span className="text-light-accent dark:text-dark-accent">PetRescue</span>
          </h2>
          <div className="w-24 h-1 bg-light-accent dark:bg-dark-accent mx-auto mb-8"></div>
          <p className="text-xl text-light-text/70 dark:text-dark-neutral max-w-3xl mx-auto leading-relaxed">
            PetRescue is more than just a platform—it's a community of pet lovers dedicated to reuniting lost pets with their families. 
            Every day, we help bridge the gap between heartbroken owners and their beloved companions, creating countless happy endings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🐕</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary mb-2">Our Mission</h3>
                <p className="text-light-text/70 dark:text-dark-neutral">To create a world where no pet stays lost, and every family is reunited with their furry friends.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-light-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary mb-2">Our Community</h3>
                <p className="text-light-text/70 dark:text-dark-neutral">Thousands of volunteers, rescuers, and pet owners working together across the country.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-light-primary dark:bg-dark-background rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary mb-2">Our Promise</h3>
                <p className="text-light-text/70 dark:text-dark-neutral">24/7 support, verified rescuers, and a safe platform for all pet-related emergencies.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Happy pets"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover border-4 border-light-secondary/20 dark:border-dark-secondary/20"
            />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center animate-pulse-custom shadow-xl">
              <span className="text-4xl">🐾</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;