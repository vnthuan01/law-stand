import { createContext, useContext, useState, type ReactNode } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ChatbotContextType = {
  isOpen: boolean;
  toggleChatbot: () => void;
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error('useChatbot must be used within ChatbotProvider');
  return context;
};

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => setIsOpen((prev) => !prev);

  return (
    <ChatbotContext.Provider value={{ isOpen, toggleChatbot }}>
      {children}

      {/* Nút tròn mở/đóng chatbot */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Khung Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-orange-500 text-white px-4 py-2 font-semibold">Chat with us</div>

            {/* Body */}
            <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-700">
              <p className="text-gray-500">👋 Hi! How can we help you today?</p>
            </div>

            {/* Input */}
            <div className="border-t p-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChatbotContext.Provider>
  );
};
