import React from 'react';
import { Search, Heart, Shield, Users } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: "Search Lost Pets",
      description: "Browse our database of lost pets and help reunite them with their families.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Report Found Pet",
      description: "Found a pet? Report it quickly and help us connect them with their owner.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Shield,
      title: "Rescue Support",
      description: "Professional rescue team ready to help with emergency pet situations.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Join thousands of pet lovers working together to keep pets safe.",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How We <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Help</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to report, search, and reunite pets with their families
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;