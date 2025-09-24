import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      emoji: '🏠'
    },
    {
      id: 'lost-pets',
      label: 'Lost Pets',
      emoji: '🔍'
    },
    {
      id: 'rescued-pets',
      label: 'Rescued Pets',
      emoji: '🐕‍🦺'
    },
    {
      id: "adoption-pets",
      label: "Adopt Pet",
      emoji: '🐱', 
    },
    {
      id: 'recent-pets',
      label: 'Recent Pets',
      emoji: '🐾'
    },
    {
      id: "reward-points",
      label: "Reward Points",
      emoji: '🎁', 
    },
    {
      id: "create-feedback", 
      label: "Create Feedback", 
      emoji: '💬', 
    },
  ];

  const profileItem = {
    id: 'profile',
    label: 'Profile',
    emoji: '👤'
  };

  return (
    // Removed justify-between to let the child elements handle the layout
    <div className="fixed left-0 top-16 mt-6 h-[calc(100vh-4rem)] w-64 bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md shadow-2xl border-r border-light-secondary/20 dark:border-dark-secondary/20 z-40 theme-transition flex flex-col">
      {/* Added flex-1 and overflow-y-auto to make this area scrollable */}
      <div className="p-6 flex-1 overflow-y-auto">
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 group ${
                  isActive
                    ? 'bg-light-accent dark:bg-dark-accent text-white shadow-xl'
                    : 'text-light-text dark:text-dark-secondary hover:bg-light-primary dark:hover:bg-dark-background hover:shadow-lg'
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* This profile section will now stick to the bottom because the above div is flex-1 */}
      <div className="p-6 border-t border-light-secondary/20 dark:border-dark-secondary/20">
        <button
          onClick={() => onSectionChange(profileItem.id)}
          className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 group ${
            activeSection === profileItem.id
              ? 'bg-light-accent dark:bg-dark-accent text-white shadow-xl'
              : 'text-light-text dark:text-dark-secondary hover:bg-light-primary dark:hover:bg-dark-background hover:shadow-lg'
          }`}
        >
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            {profileItem.emoji}
          </span>
          <span className="font-semibold text-sm">{profileItem.label}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;