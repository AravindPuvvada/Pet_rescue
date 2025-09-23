import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminPets from "./AdminPets";
import AdminLostRequests from "./AdminLostRequests";
import AdminFoundRequests from "./AdminFoundRequests";
import AdminAdoptRequests from "./AdminAdoptRequests";
import AdminNotifications from "./AdminNotifications";
import { apiService } from "../../services/api";
import RewardsPage from "./RewardsPage";

interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ FIX: handleLogout inside component so it has access to navigate
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await apiService.getProfile();
        if (!userData.is_superuser) {
          navigate("/mainpage");
          return;
        }
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        handleLogout(); // force logout if profile fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers />;
      case "pets":
        return <AdminPets />;
      case "lost-requests":
        return <AdminLostRequests />;
      case "found-requests":
        return <AdminFoundRequests />;
      case "adopt-requests":
        return <AdminAdoptRequests />;
      case "notifications":
        return <AdminNotifications />;
      case "rewards":
        return <RewardsPage />;
      default:
        return <AdminOverview />;
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
      <AdminNavbar user={user} onLogout={handleLogout} />

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 ml-64 mt-16 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AdminNavbar from "./AdminNavbar";
// import AdminSidebar from "./AdminSidebar";
// import AdminOverview from "./AdminOverview";
// import AdminUsers from "./AdminUsers";
// import AdminPets from "./AdminPets";
// import AdminLostRequests from "./AdminLostRequests";
// import AdminFoundRequests from "./AdminFoundRequests";
// import AdminAdoptRequests from "./AdminAdoptRequests";
// import AdminNotifications from "./AdminNotifications";
// import { apiService } from "../../services/api";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   is_superuser: boolean;
// }

// interface AdminDashboardProps {
//   onLogout: () => void;
// }
// // Parent component

// const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
//   const [activeSection, setActiveSection] = useState("overview");
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userData = await apiService.getProfile();
//         if (!userData.is_superuser) {
//           navigate("/mainpage");
//           return;
//         }
//         setUser(userData);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         onLogout(); // ✅ use the passed down logout
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [onLogout, navigate]);

//   const renderContent = () => {
//     switch (activeSection) {
//       case "overview":
//         return <AdminOverview />;
//       case "users":
//         return <AdminUsers />;
//       case "pets":
//         return <AdminPets />;
//       case "lost-requests":
//         return <AdminLostRequests />;
//       case "found-requests":
//         return <AdminFoundRequests />;
//       case "adopt-requests":
//         return <AdminAdoptRequests />;
//       case "notifications":
//         return <AdminNotifications />;
//       default:
//         return <AdminOverview />;
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
//       <AdminNavbar user={user} onLogout={onLogout} />

//       {/* Main Layout */}
//       <div className="flex">
//         {/* Left Sidebar */}
//         <AdminSidebar
//           activeSection={activeSection}
//           onSectionChange={setActiveSection}
//         />

//         {/* Main Content */}
//         <div className="flex-1 ml-64 mt-16 p-6">{renderContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
