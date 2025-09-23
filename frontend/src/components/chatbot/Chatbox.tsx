import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "./ChatContext";
import ReactMarkdown from "react-markdown";

const Chatbot: React.FC = () => {
  const { activeSection } = useChatContext();
  const [isOpen, setIsOpen] = useState(false); // ✅ starts closed
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Force chatbox to start closed on mount
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages from local storage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Reset unread count when chatbox opens + show welcome message if no history
  useEffect(() => {
  if (isOpen) {
    setUnreadCount(0);
    if (messages.length === 0) {
      setMessages([{ sender: "Bot", text: "This is Blob 🤖, how can I help you?" }]);
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
          section: activeSection, // ✅ send section from context
        }),
      });

      const data = await response.json();
      const botReply = {
        sender: "Bot",
        text: data.reply || "Sorry, I didn’t get that.",
      };

      setMessages([...newMessages, botReply]);

      // If chatbot is closed, increase unread count
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
  console.error(error); // ✅ logs the actual error
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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
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
        <div className="fixed bottom-6 right-6 w-[28rem] h-[32rem] bg-white shadow-lg rounded-2xl flex flex-col">
          {/* Header with Minimize Button */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 flex justify-between items-center rounded-t-2xl">
            <span>Help & Support</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold leading-none"
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
                className={`px-3 py-2 rounded-lg max-w-[75%] ${
                  msg.sender === "You"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm self-start">Bot is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 rounded-full disabled:opacity-50"
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
