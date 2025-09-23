import React from "react";
import {
  LayoutDashboard,
  Heart,
  User,
  PawPrint,
  Dog,
  Bird,
  Gift,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "lost-pets",
      label: "Lost Pets",
      icon: Dog, // 🐶
    },
    {
      id: "rescued-pets",
      label: "Rescued Pets",
      icon: Heart,
    },
    {
      id: "adoption-pets",
      label: "Adopt Pet",
      icon: PawPrint, // 🐱
    },
    {
      id: "recent-pets",
      label: "Recent Pets",
      icon: Bird, // 🐦
    },
    {
      id: "reward-points",
      label: "Reward Points",
      icon: Gift, // 🎁
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-md shadow-2xl border-r border-white/20 z-40 mt-10">
      <div className="p-6">
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-xl shadow-orange-200'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:shadow-lg'
                }`}
              >
                <Icon
  className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'} transition-colors duration-300`}
/>
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;