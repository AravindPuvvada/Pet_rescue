import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";

interface NavbarProps {
  user?: {
    username: string;
    email: string;
    profile_image?: string;
  } | null;
  onLogout: () => void;
}

interface Notification {
  id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://127.0.0.1:8000/api/get-notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const updated = await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map(async (n) => {
            const res = await fetch(
              `http://127.0.0.1:8000/api/notifications/${n.id}/mark_as_read/`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            return res.ok;
          })
      );

      // Update frontend instantly
      if (updated.some((ok) => ok)) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
      }
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  // Handle dropdown open → mark all as read
  const handleNotificationClick = () => {
    setShowNotifications((prev) => {
      const newState = !prev;
      if (newState) {
        markAllAsRead();
      }
      return newState;
    });
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowDropdown(false);
    onLogout();
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 fixed top-0 left-0 right-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                PetRescue Pro
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-3 rounded-xl hover:bg-white/50 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-3 z-50 animate-in slide-in-from-top">
                    <h3 className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-100">
                      Notifications
                    </h3>
                    {loading ? (
                      <p className="px-4 py-2 text-sm text-gray-500">Loading...</p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 text-sm border-b border-gray-100 ${
                            n.is_read ? "bg-white" : "bg-blue-50"
                          }`}
                        >
                          <p className="text-gray-800">{n.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-4 px-5 py-3 rounded-xl hover:bg-white/50 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt="Profile"
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-3 z-50 animate-in slide-in-from-top">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {user?.email}
                      </p>
                    </div>

                    <button className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 flex items-center space-x-3 font-medium">
                      <Settings className="w-4 h-4 text-blue-500" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 flex items-center space-x-3 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20 animate-in slide-in-from-bottom">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

