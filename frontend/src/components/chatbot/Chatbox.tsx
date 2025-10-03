import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "./ChatContext";
import ReactMarkdown from "react-markdown";

const Chatbot: React.FC = () => {
  const { activeSection } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (messages.length === 0) {
        setMessages([{ sender: "Bot", text: "This is BuddyBot 🤖, how can I help you?" }]);
      }
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          section: activeSection,
        }),
      });

      const data = await response.json();
      const botReply = {
        sender: "Bot",
        text: data.reply || "Sorry, I didn’t get that.",
      };

      setMessages([...newMessages, botReply]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = { sender: "Bot", text: "⚠️ Error connecting to chatbot." };
      setMessages([...newMessages, errorMsg]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-light-accent dark:bg-dark-accent text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition theme-transition"
        >
          💬 Need Help?
          {unreadCount > 0 && (
            <span
              className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 
                bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow"
            >
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[28rem] h-[32rem] bg-light-neutral dark:bg-dark-background shadow-2xl rounded-2xl flex flex-col theme-transition border border-light-secondary/10 dark:border-dark-secondary/20">
          {/* Header with Minimize Button */}
          <div className="bg-light-accent dark:bg-dark-accent text-white p-3 flex justify-between items-center rounded-t-2xl theme-transition">
            <span className="font-semibold">Help & Support</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-bold leading-none hover:opacity-80 transition"
              aria-label="Minimize chatbot"
            >
              &minus;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg max-w-[75%] theme-transition ${
                  msg.sender === "You"
                    ? "bg-light-secondary text-white dark:bg-dark-primary dark:text-dark-secondary self-end"
                    : "bg-light-primary text-light-text dark:bg-dark-primary dark:text-dark-secondary self-start"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="text-light-secondary dark:text-dark-neutral text-sm self-start">Bot is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t border-light-primary dark:border-dark-primary flex space-x-2 theme-transition">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border border-light-secondary/30 dark:border-dark-primary rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent text-light-text dark:text-dark-secondary placeholder-light-secondary/70 dark:placeholder-dark-neutral theme-transition"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-light-accent dark:bg-dark-accent text-white px-4 rounded-full disabled:opacity-50 hover:opacity-90 transition theme-transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;