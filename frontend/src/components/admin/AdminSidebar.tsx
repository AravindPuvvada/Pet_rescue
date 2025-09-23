import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  AlertCircle, 
  Search, 
  UserPlus, 
  Bell 
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'pets',
      label: 'Pets',
      icon: Heart,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'lost-requests',
      label: 'Lost Requests',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'found-requests',
      label: 'Found Requests',
      icon: Search,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'adopt-requests',
      label: 'Adopt Requests',
      icon: UserPlus,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'rewards',
      label: 'Rewards Page',
      icon: UserPlus,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'from-orange-500 to-orange-600'
    },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 z-40">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;