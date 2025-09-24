import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

type AdminTheme = 'adminLight' | 'adminDark';

interface AdminThemeContextType {
  adminTheme: AdminTheme;
  toggleAdminTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const AdminThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminTheme, setAdminTheme] = useState<AdminTheme>(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('pet-rescue-admin-theme') as AdminTheme;
    if (storedTheme) return storedTheme;

    // Default to adminLight
    return 'adminLight';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous user-side theme classes
    root.classList.remove('light', 'dark');

    // Add current admin theme class
    if (adminTheme === 'adminDark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Store in localStorage
    localStorage.setItem('pet-rescue-admin-theme', adminTheme);

  }, [adminTheme]);

  const toggleAdminTheme = () => {
    setAdminTheme((prevTheme) => (prevTheme === 'adminLight' ? 'adminDark' : 'adminLight'));
  };

  return (
    <AdminThemeContext.Provider value={{ adminTheme, toggleAdminTheme }}>
      <div className="transition-colors duration-300 ease-in-out">
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};