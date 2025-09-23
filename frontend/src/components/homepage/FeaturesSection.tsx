import React from 'react';
import { Search, Shield, Users } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: "Search Lost Pets",
      description: "Browse our database of lost pets and help reunite them with their families.",
      emoji: "🔍"
    },
    {
      icon: Search,
      title: "Report Found Pet",
      description: "Found a pet? Report it quickly and help us connect them with their owner.",
      emoji: "🐕‍🦺"
    },
    {
      icon: Shield,
      title: "Rescue Support",
      description: "Professional rescue team ready to help with emergency pet situations.",
      emoji: "🚑"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Join thousands of pet lovers working together to keep pets safe.",
      emoji: "👥"
    }
  ];

  return (
    <section id="features" className="py-20 bg-light-primary dark:bg-dark-background theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-secondary mb-6">
            How We <span className="text-light-accent dark:text-dark-accent">Help</span>
          </h2>
          <div className="w-24 h-1 bg-light-accent dark:bg-dark-accent mx-auto mb-8"></div>
          <p className="text-xl text-light-text/70 dark:text-dark-neutral max-w-2xl mx-auto">
            Our platform provides everything you need to report, search, and reunite pets with their families
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="card-hover bg-light-neutral dark:bg-dark-primary rounded-2xl p-8 shadow-lg border border-light-secondary/20 dark:border-dark-secondary/20 text-center group theme-transition"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-light-accent dark:bg-dark-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{feature.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary mb-4">{feature.title}</h3>
                <p className="text-light-text/70 dark:text-dark-neutral leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;