import React from 'react';
import { PawPrint } from 'lucide-react';

interface FloatingPawProps {
  delay?: number;
  size?: number;
  left?: string;
  animationDuration?: string;
}

const FloatingPaw: React.FC<FloatingPawProps> = ({ 
  delay = 0, 
  size = 20, 
  left = "10%", 
  animationDuration = "6s" 
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      animation: `float ${animationDuration} ease-in-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.1,
      zIndex: 1
    }}
  >
    <PawPrint size={size} className="text-orange-400" />
  </div>
);

const FloatingPaws: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <FloatingPaw delay={0} size={24} left="5%" animationDuration="8s" />
      <FloatingPaw delay={1} size={18} left="15%" animationDuration="6s" />
      <FloatingPaw delay={2} size={22} left="85%" animationDuration="7s" />
      <FloatingPaw delay={3} size={16} left="75%" animationDuration="9s" />
      <FloatingPaw delay={4} size={20} left="45%" animationDuration="5s" />
      <FloatingPaw delay={5} size={26} left="65%" animationDuration="8s" />
    </div>
  );
};

export default FloatingPaws;