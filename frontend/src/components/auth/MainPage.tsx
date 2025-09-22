// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../layout/Navbar';
// import Sidebar from '../layout/Sidebar';
// import Dashboard from '../dashboard/Dashboard';
// import RescuedPetsPage from '../pages/RescuedPetsPage';
// import ProfilePage from '../pages/ProfilePage';
// import { apiService } from '../../services/api';
// import LostPetsPage from '../pages/LostPetsPage';

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   phone?: string;
//   address?: string;
//   pincode?: string;
//   gender?: string;
//   profile_image?: string;
// }

// const MainPage: React.FC = () => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const handleLogout = useCallback(() => {
//   apiService.logout();
//   navigate('/login');
// }, [navigate]);

// useEffect(() => {
//   const fetchUserProfile = async () => {
//     try {
//       const userData = await apiService.getProfile();
//       setUser(userData);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUserProfile();
// }, [handleLogout]); // safe now ✅

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'rescued-pets':
//         return <RescuedPetsPage />;
//       case 'profile':
//         return <ProfilePage onLogout={handleLogout} />;
//       case 'lost-pets': 
//         return <LostPetsPage />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navbar */}
//       <Navbar user={user} onLogout={handleLogout} />
      
//       {/* Main Layout */}
//       <div className="flex">
//         {/* Left Sidebar */}
//         <Sidebar 
//           activeSection={activeSection} 
//           onSectionChange={setActiveSection} 
//         />
        
//         {/* Main Content */}
//         <div className="flex-1 ml-64 mt-16 p-6">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Dashboard from "../dashboard/Dashboard";
import RescuedPetsPage from "../pages/RescuedPetsPage";
import ProfilePage from "../pages/ProfilePage";
import { apiService } from "../../services/api";
import LostPetsPage from "../pages/LostPetsPage";

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;
  gender?: string;
  profile_image?: string;
}

interface MainPageProps {
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await apiService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        onLogout(); // ✅ use the passed down logout
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [onLogout, navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "rescued-pets":
        return <RescuedPetsPage />;
      case "profile":
        return <ProfilePage onLogout={onLogout} />;
      case "lost-pets":
        return <LostPetsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 ml-64 mt-16 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainPage;
