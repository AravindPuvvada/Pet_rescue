import React from 'react';
import { Heart, Users, Shield, PawPrint } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">PetRescue</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            PetRescue is more than just a platform—it's a community of pet lovers dedicated to reuniting lost pets with their families. 
            Every day, we help bridge the gap between heartbroken owners and their beloved companions, creating countless happy endings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">To create a world where no pet stays lost, and every family is reunited with their furry friends.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Community</h3>
                <p className="text-gray-600">Thousands of volunteers, rescuers, and pet owners working together across the country.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Promise</h3>
                <p className="text-gray-600">24/7 support, verified rescuers, and a safe platform for all pet-related emergencies.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Happy pets"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse-custom">
              <PawPrint className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;