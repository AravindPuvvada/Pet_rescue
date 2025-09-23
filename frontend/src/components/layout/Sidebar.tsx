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
      id: "create-feedback", // ✅ New menu item for feedback
      label: "Create Feedback", // ✅ Display label
      emoji: '💬', 
    },
  ];

  const profileItem = {
    id: 'profile',
    label: 'Profile',
    emoji: '👤'
  };

  return (
    <div className="fixed left-0 top-16 mt-6 h-[calc(100vh-4rem)] w-64 bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md shadow-2xl border-r border-light-secondary/20 dark:border-dark-secondary/20 z-40 theme-transition flex flex-col justify-between">
      <div className="p-6">
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

      <div className="p-6">
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




// const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
//   const menuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//     },
//     {
//       id: "lost-pets",
//       label: "Lost Pets",
//       icon: Dog, // 🐶
//     },
//     {
//       id: "rescued-pets",
//       label: "Rescued Pets",
//       icon: Heart,
//     },
//     {
//       id: "adoption-pets",
//       label: "Adopt Pet",
//       icon: PawPrint, // 🐱
//     },
//     {
//       id: "recent-pets",
//       label: "Recent Pets",
//       icon: Bird, // 🐦
//     },
//     {
//       id: "reward-points",
//       label: "Reward Points",
//       icon: Gift, // 🎁
//     },
//     {
//       id: "create-feedback", // ✅ New menu item for feedback
//       label: "Create Feedback", // ✅ Display label
//       icon: MessageSquare, 
//     },
//     {
//       id: "profile",
//       label: "Profile",
//       icon: User,
//     },
//   ];