import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-light-text dark:bg-dark-background text-white py-16 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">🐕</span>
              </div>
              <span className="text-2xl font-bold text-light-accent dark:text-dark-accent">
                PetRescue
              </span>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 max-w-md">
              Connecting lost pets with their families through technology and community care. 
              Every pet deserves to find their way home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center hover:bg-light-accent dark:hover:bg-dark-accent transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center hover:bg-light-accent dark:hover:bg-dark-accent transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center hover:bg-light-accent dark:hover:bg-dark-accent transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#stories" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
              <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition-colors">Login</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">help@petrescue.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Available Nationwide</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">24/7 Emergency Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70">
            © 2025 PetRescue. Made with 🐕 for pets and their families. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;