import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import ThemeToggle from '../ThemeToggle';

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
      <nav className="bg-light-neutral/80 dark:bg-dark-primary/80 backdrop-blur-md shadow-lg border-b border-light-secondary/20 dark:border-dark-secondary/20 fixed top-0 left-0 right-0 z-50 theme-transition">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-light-accent via-light-secondary to-light-primary dark:from-dark-accent dark:via-dark-secondary dark:to-dark-primary rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                >
                  {/* Paw print icon */}
                  <circle cx="32" cy="48" r="8" />
                  <circle cx="16" cy="32" r="6" />
                  <circle cx="48" cy="32" r="6" />
                  <circle cx="24" cy="16" r="5" />
                  <circle cx="40" cy="16" r="5" />
                </svg>
              </div>

              
              <span className="text-3xl font-bold text-light-text dark:text-dark-secondary">
                Furry Finder
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle variant="navbar" />
              
              {/* Notification Icon */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-3 rounded-xl hover:bg-light-neutral/50 dark:hover:bg-dark-primary/50 transition-all duration-300 backdrop-blur-sm border border-light-secondary/20 dark:border-dark-secondary/20 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Bell className="w-5 h-5 text-light-text dark:text-dark-secondary" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-2xl shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 py-3 z-50 animate-in slide-in-from-top">
                    <h3 className="px-4 py-2 font-semibold text-light-text dark:text-dark-secondary border-b border-light-secondary/20 dark:border-dark-secondary/20">
                      Notifications
                    </h3>
                    {loading ? (
                      <p className="px-4 py-2 text-sm text-light-text/70 dark:text-dark-neutral">Loading...</p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-light-text/70 dark:text-dark-neutral">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 text-sm border-b border-light-secondary/10 dark:border-dark-secondary/10 ${
                            n.is_read ? "bg-transparent" : "bg-light-accent/10 dark:bg-dark-accent/10"
                          }`}
                        >
                          <p className="text-light-text dark:text-dark-secondary">{n.content}</p>
                          <p className="text-xs text-light-text/50 dark:text-dark-neutral mt-1">
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
                  className="flex items-center space-x-4 px-5 py-3 rounded-xl hover:bg-light-neutral/50 dark:hover:bg-dark-primary/50 transition-all duration-300 backdrop-blur-sm border border-light-secondary/20 dark:border-dark-secondary/20 shadow-lg hover:shadow-xl"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-light-secondary to-light-accent dark:from-dark-secondary dark:to-dark-accent rounded-xl flex items-center justify-center shadow-lg">
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
                    <p className="text-sm font-bold text-light-text dark:text-dark-secondary">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-light-text/70 dark:text-dark-neutral font-medium">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-light-text/50 dark:text-dark-neutral transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-2xl shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 py-3 z-50 animate-in slide-in-from-top">
                    <div className="px-6 py-4 border-b border-light-secondary/20 dark:border-dark-secondary/20">
                      <p className="text-sm font-bold text-light-text dark:text-dark-secondary">
                        {user?.username}
                      </p>
                      <p className="text-xs text-light-text/70 dark:text-dark-neutral font-medium">
                        {user?.email}
                      </p>
                    </div>

                    <button className="w-full px-6 py-3 text-left text-sm text-light-text dark:text-dark-secondary hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-all duration-300 flex items-center space-x-3 font-medium">
                      <Settings className="w-4 h-4 text-light-accent dark:text-dark-accent" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full px-6 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 flex items-center space-x-3 font-medium"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 theme-transition">
          <div className="bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 animate-in slide-in-from-bottom">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-secondary mb-3">
              Confirm Logout
            </h3>
            <p className="text-light-text/70 dark:text-dark-neutral mb-8 leading-relaxed">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 text-light-text dark:text-dark-secondary bg-light-primary dark:bg-dark-background rounded-xl hover:opacity-80 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 text-white bg-red-500 dark:bg-red-600 rounded-xl hover:opacity-90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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