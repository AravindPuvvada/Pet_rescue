// import React from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Heart,
//   Bell,
//   Dog,
//   Cat,
//   Gift,
//   PawPrint,
// } from "lucide-react";

// interface AdminSidebarProps {
//   activeSection: string;
//   onSectionChange: (section: string) => void;
// }

// const AdminSidebar: React.FC<AdminSidebarProps> = ({
//   activeSection,
//   onSectionChange,
// }) => {
//   const menuItems = [
//     {
//       id: "overview",
//       label: "Overview",
//       icon: LayoutDashboard,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       id: "users",
//       label: "Users",
//       icon: Users,
//       color: "from-green-500 to-green-600",
//     },
//     {
//       id: "pets",
//       label: "Pets",
//       icon: PawPrint, // 🐾 (better than heart for general pets)
//       color: "from-pink-500 to-pink-600",
//     },
//     {
//       id: "lost-requests",
//       label: "Lost Requests",
//       icon: Dog, // 🐶 (lost dogs/cats fit well)
//       color: "from-red-500 to-red-600",
//     },
//     {
//       id: "found-requests",
//       label: "Found Requests",
//       icon: Cat, // 🐱 (found pets - cats icon for variation)
//       color: "from-emerald-500 to-emerald-600",
//     },
//     {
//       id: "adopt-requests",
//       label: "Adopt Requests",
//       icon: Heart, // ❤️ (love/adoption)
//       color: "from-purple-500 to-purple-600",
//     },
//     {
//       id: "rewards",
//       label: "Rewards Page",
//       icon: Gift, // 🎁 (gift box for rewards)
//       color: "from-pink-500 to-purple-600",
//     },
//     {
//       id: "notifications",
//       label: "Notifications",
//       icon: Bell,
//       color: "from-orange-500 to-orange-600",
//     },
//   ];

//   return (
//     <div className="fixed left-0 top-16 mt-5 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 z-40">
//       <div className="p-4">
//         <nav className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeSection === item.id;
            
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => onSectionChange(item.id)}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
//                   isActive
//                     ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
//                     : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;

import React from "react";
import {
  LayoutDashboard,
  Users,
  Heart,
  Bell,
  Dog,
  Cat,
  Gift,
  PawPrint,
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  theme: "light" | "dark";
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  theme,
}) => {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      id: "pets",
      label: "Pets",
      icon: PawPrint,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "lost-requests",
      label: "Lost Requests",
      icon: Dog,
      color: "from-red-500 to-red-600",
    },
    {
      id: "found-requests",
      label: "Found Requests",
      icon: Cat,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "adopt-requests",
      label: "Adopt Requests",
      icon: Heart,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "rewards",
      label: "Rewards Page",
      icon: Gift,
      color: "from-pink-500 to-purple-600",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-16 mt-5 h-[calc(100vh-4rem)] w-64 shadow-sm border-r z-40
        ${
          theme === "light"
            ? "bg-[#E8E0D3] border-[#5B4438]/20"
            : "bg-gray-900 border-gray-700"
        }`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : `${
                          theme === "light"
                            ? "text-[#5B4438] hover:bg-[#D8CFC0]"
                            : "text-gray-300 hover:bg-gray-700"
                        } hover:scale-102`
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
