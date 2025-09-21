import React, { createContext, useState, useContext } from "react";

type ChatContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState("dashboard"); // default
  return (
    <ChatContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook for easy access
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within ChatProvider");
  return context;
};
