import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Bell } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Notification } from '../../services/api'; // 👈 Correct import for the type
import ThemeToggle from '../ThemeToggle';

interface AdminNavbarProps {
  user?: {
    username: string;
    email: string;
    is_superuser: boolean;
  } | null;
  onLogout: () => void;
    onToggleTheme: () => void;   // <-- add this
  theme: "light" | "dark";  
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?.is_superuser) {
        try {
          const response = await apiService.getUnreadAdminNotificationCount();
          setUnreadCount(response.unread_count);
        } catch (error) {
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };
    
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowDropdown(false);
    onLogout();
  };

  const fetchAndShowNotifications = async () => {
    if (!showNotifications) {
      try {
        const response = await apiService.getAdminNotifications();
        setNotifications(response.notifications);
        setUnreadCount(0);
        
        response.notifications.forEach(notif => {
          if (!notif.is_read) {
            apiService.markNotificationAsRead(notif.id).catch(console.error);
          }
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      }
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <nav className="bg-light-neutral/95 dark:bg-dark-primary/95 backdrop-blur-sm shadow-lg border-b border-light-secondary/20 dark:border-dark-secondary/20 fixed top-0 left-0 right-0 z-50 theme-transition">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">🐕‍🦺</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-light-text dark:text-dark-secondary">
                  Admin Dashboard
                </span>
                <p className="text-xs text-light-text/70 dark:text-dark-neutral">PetRescue Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle variant="navbar" />
              
              <div className="relative" ref={notificationsRef}>
                <button
                  className="p-2 rounded-full hover:bg-light-primary dark:hover:bg-dark-background transition-colors"
                  onClick={fetchAndShowNotifications}
                >
                  <Bell className="w-6 h-6 text-light-text dark:text-dark-secondary" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-light-accent dark:bg-dark-accent rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-lg shadow-lg border border-light-secondary/20 dark:border-dark-secondary/20 py-2 z-50">
                    <h3 className="px-4 py-2 font-semibold text-light-text dark:text-dark-secondary border-b border-light-secondary/20 dark:border-dark-secondary/20">Notifications</h3>
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b border-light-secondary/10 dark:border-dark-secondary/10">
                          <p className={`text-sm ${notif.is_read ? 'text-light-text/70 dark:text-dark-neutral' : 'text-light-text dark:text-dark-secondary font-medium'}`}>
                            {notif.content}
                          </p>
                          <p className="text-xs text-light-text/50 dark:text-dark-neutral mt-1">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-light-text/70 dark:text-dark-neutral text-sm">No new notifications.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-light-primary dark:hover:bg-dark-background transition-colors"
                >
                  <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-light-text dark:text-dark-secondary">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-light-text/70 dark:text-dark-neutral">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-light-text/50 dark:text-dark-neutral" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-lg shadow-lg border border-light-secondary/20 dark:border-dark-secondary/20 py-2 z-50">
                    <div className="px-4 py-3 border-b border-light-secondary/20 dark:border-dark-secondary/20">
                      <p className="text-sm font-medium text-light-text dark:text-dark-secondary">{user?.username}</p>
                      <p className="text-xs text-light-text/70 dark:text-dark-neutral">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent text-xs font-medium rounded-full">
                        Super Admin
                      </span>
                    </div>
                    
                    <button className="w-full px-4 py-2 text-left text-sm text-light-text dark:text-dark-secondary hover:bg-light-primary dark:hover:bg-dark-background flex items-center space-x-2">
                      <span className="text-lg">⚙️</span>
                      <span>Admin Settings</span>
                    </button>
                    
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-secondary mb-2">Confirm Logout</h3>
            <p className="text-light-text/70 dark:text-dark-neutral mb-6">Are you sure you want to logout from admin dashboard?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 text-light-text dark:text-dark-secondary bg-light-primary dark:bg-dark-background rounded-lg hover:opacity-80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-white bg-red-500 dark:bg-red-600 rounded-lg hover:opacity-90 transition-colors"
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

export default AdminNavbar;