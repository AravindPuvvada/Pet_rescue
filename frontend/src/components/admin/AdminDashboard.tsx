// import React, { useState, useEffect, useCallback } from "react";
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
// import RewardsPage from "./RewardsPage";
// import { apiService } from "../../services/api";
// import AdminUserReports from "./AdminUserReports";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   is_superuser: boolean;
// }

// const AdminDashboard: React.FC = () => {
//   const [activeSection, setActiveSection] = useState("overview");
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [theme, setTheme] = useState<"light" | "dark">("light"); // theme state
//   const navigate = useNavigate();

//   // Toggle theme
//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   // Persist theme in localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") as "light" | "dark";
//     if (savedTheme) setTheme(savedTheme);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//     document.documentElement.classList.toggle("dark", theme === "dark");
//   }, [theme]);

//   // Logout
//  const handleLogout = useCallback(() => {
//     localStorage.clear();
//     navigate("/login", { replace: true });
//   }, [navigate]);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userData = await apiService.getProfile();
//         if (!userData.is_superuser) {
//           navigate("/mainpage");
//           return;
//         }
//         setUser({
//           id: userData.id,
//           username: userData.username,
//           email: userData.email,
//           is_superuser: userData.is_superuser ?? false,
//         });
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         handleLogout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [navigate, handleLogout]); // now stable

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
//       case "rewards":
//         return <RewardsPage />;
//       case 'report-status': // This is the new case
//         return <AdminUserReports />;
//       default:
//         return <AdminOverview />;
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         className={`min-h-screen flex items-center justify-center ${
//           theme === "light" ? "bg-[#E8E0D3]" : "bg-gray-900"
//         }`}
//       >
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         theme === "light" ? "bg-[#E8E0D3] text-[#5B4438]" : "bg-gray-900 text-gray-100"
//       }`}
//     >
//       {/* Top Navbar */}
//       <AdminNavbar
//         user={user}
//         onLogout={handleLogout}
//         onToggleTheme={toggleTheme}
//         theme={theme}
//       />

//       {/* Main Layout */}
//       <div className="flex">
//         {/* Left Sidebar */}
//         <AdminSidebar
//           activeSection={activeSection}
//           onSectionChange={setActiveSection}
//           theme={theme}
//         />

//         {/* Main Content */}
//         <div
//           className={`flex-1 ml-64 mt-16 p-6 ${
//             theme === "light" ? "text-[#5B4438]" : "text-gray-100"
//           }`}
//         >
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useCallback } from "react";
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
import RewardsPage from "./RewardsPage";
import { apiService } from "../../services/api";
import AdminUserReports from "./AdminUserReports";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await apiService.getProfile();
        if (!userData.is_superuser) {
          navigate("/mainpage");
          return;
        }
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          is_superuser: userData.is_superuser ?? false,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate, handleLogout]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers theme={theme} />;
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
      case 'report-status':
        return <AdminUserReports />;
      default:
        return <AdminOverview />;
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "light" ? "bg-[#E8E0D3]" : "bg-gray-900"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "light" ? "bg-[#E8E0D3] text-[#5B4438]" : "bg-gray-900 text-gray-100"
      }`}
    >
      <AdminNavbar
        user={user}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      <div className="flex">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          theme={theme}
        />

        <div
          className={`flex-1 ml-64 mt-16 p-6 ${
            theme === "light" ? "text-[#5B4438]" : "text-gray-100"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;