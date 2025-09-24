import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Dashboard from "../dashboard/Dashboard";
import RescuedPetsPage from "../pages/RescuedPetsPage";
import ProfilePage from "../pages/ProfilePage";
import { apiService } from "../../services/api";
import LostPetsPage from "../pages/LostPetsPage";
import RecentPets from "../pages/RecentPets";
import MyRewards from "../pages/MyRewards";
import AdoptionPage from "../pages/AdoptionPage";
import CreateFeedbackPage from "../pages/CreateFeedbackPage";
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

const MainPage: React.FC = () => {
 const [activeSection, setActiveSection] = useState("dashboard");
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 // ✅ Add logout function here
 const handleLogout = () => {
 // Remove auth-related keys
 localStorage.removeItem("access_token");
 localStorage.removeItem("refresh_token");
 localStorage.removeItem("is_superuser");
 localStorage.removeItem("currentAccountId");
 localStorage.removeItem("storedAccounts");

 // Navigate immediately to login
 navigate("/login", { replace: true });
};

 useEffect(() => {
 const fetchUserProfile = async () => {
 try {
 const userData = await apiService.getProfile();
 setUser(userData);
 } catch (error) {
 console.error("Error fetching user profile:", error);
 handleLogout(); // call the logout function
 } finally {
 setLoading(false);
 }
 };

 fetchUserProfile();
 }, []);

const renderContent = () => {
 switch (activeSection) {
 case "dashboard":
 return <Dashboard />;
 case "rescued-pets":
 return <RescuedPetsPage />;
 case "profile":
 return <ProfilePage onLogout={handleLogout} />;
 case "lost-pets":
 return <LostPetsPage />;
 case "adoption-pets":
 return <AdoptionPage />;
 case "recent-pets":
 return <RecentPets />;
 case "reward-points":
 return <MyRewards />;
 case 'create-feedback': // ✅ NEW case for Create Feedback
 return <CreateFeedbackPage />;
 default:
 return <Dashboard />;
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-light-neutral dark:bg-dark-background flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent dark:border-dark-accent"></div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-light-neutral dark:bg-dark-background">
 <Navbar user={user} onLogout={handleLogout} />
 <div className="flex">
 <Sidebar
 activeSection={activeSection}
 onSectionChange={setActiveSection}
 />
 <div className="flex-1 ml-64 mt-16 p-6">{renderContent()}</div>
 </div>
 </div>
 );
};

export default MainPage;