import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ChatbotService, type ChatMessage } from '@/services/chatbotService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { UserRole } from '@/enums/UserRole';

type ChatbotContextType = { isOpen: boolean; toggleChatbot: () => void };
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error('useChatbot must be used within ChatbotProvider');
  return context;
};

// --- Helper xử lý URL và Citation ---
function extractSourcesWithCitations(text: string) {
  const lines = text.split('\n');
  let body = '';
  const sources: string[] = [];
  let inSources = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().includes('nguồn tham khảo')) {
      inSources = true;
    } else if (inSources) {
      // Chỉ lấy URL thực sự
      const url = cleanUrl(trimmed);
      if (url) sources.push(url);
    } else {
      body += line + '\n';
    }
  });

  // Thêm citation vào body: ¹, ², ³...
  const bodyWithCitations = body.replace(/\[SOURCE\]/gi, () => {
    return `¹`;
  });

  return { body: bodyWithCitations, sources };
}

// Hàm clean URL
function cleanUrl(rawUrl: string) {
  // Chỉ lấy phần từ http/https trở đi
  const match = rawUrl.match(/https?:\/\/\S+/);
  return match ? match[0].trim() : '';
}

// chèn citation số vào cuối body
function bodyWithCitations(body: string, sources: string[]) {
  if (!sources.length) return body;
  const superscriptNumbers = '¹²³⁴⁵⁶⁷⁸⁹⁰';
  const citationText = sources.map((_, i) => superscriptNumbers[i] || `[${i + 1}]`).join('');
  return `${body.trim()} ${citationText}`;
}

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    ChatbotService.getInitialChatHistory(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 60 });
  const [size, setSize] = useState({ width: 360, height: 480 });
  const [isResizing, setIsResizing] = useState(false);
  const isUserLoaded = isAuthenticated !== undefined && user !== undefined;

  const toggleChatbot = () => setIsOpen((prev) => !prev);
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPathname(window.location.pathname);

    // Listen back/forward
    window.addEventListener('popstate', handleRouteChange);

    // Override pushState & replaceState để emit event custom
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('locationchange')); // custom event
      return result;
    };

    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange')); // custom event
      return result;
    };

    window.addEventListener('locationchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('locationchange', handleRouteChange);
    };
  }, []);

  const excludedPaths = ['/login', '/register', '/chat-with-ai-supported'];
  const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));
  const canShowChatbot =
    isUserLoaded && isAuthenticated && user && user.role === UserRole.User && !isExcluded;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  if (!isUserLoaded) {
    return <>{children}</>;
  }
  const sampleQuestions = [
    t('chatbot.sampleQuestions.trafficLaw'),
    t('chatbot.sampleQuestions.laborLaw'),
    t('chatbot.sampleQuestions.marriageLaw'),
    t('chatbot.sampleQuestions.civilLaw'),
  ];

  const handleSampleClick = (q: string) => setInputValue(q);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    const newUserMsg: ChatMessage = { role: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);
    setChatHistory((prev) => [...prev, { role: 'model', text: t('chatbot.thinking') }]);

    try {
      const updatedHistory = [...chatHistory, newUserMsg];
      const botResponse = await ChatbotService.generateBotResponse(updatedHistory);
      setChatHistory((prev) => [
        ...prev.filter((m) => m.text !== t('chatbot.thinking')),
        { role: 'model', text: botResponse },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev.filter((m) => m.text !== t('chatbot.thinking')),
        {
          role: 'model',
          text: err instanceof Error ? err.message : t('chatbot.errorMessage'),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Drag
  const handleDrag = (e: MouseEvent<HTMLDivElement>) => {
    if (isExpanded || isResizing) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPosition({ x: Math.max(0, startPos.x - dx), y: Math.max(0, startPos.y - dy) });
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // --- Resize
  const handleResize = (e: MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startSize = { ...size };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(280, startSize.width - (moveEvent.clientX - startX));
      const newHeight = Math.max(360, startSize.height - (moveEvent.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };
    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove as any);
    document.addEventListener('mouseup', onMouseUp);
  };

  const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
      <path
        d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <ChatbotContext.Provider value={{ isOpen, toggleChatbot }}>
      {children}
      {canShowChatbot && (
        <>
          {/* Floating button */}
          <button
            onClick={toggleChatbot}
            className="fixed bottom-5 right-5 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-[9999]"
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </button>

          {/* Chat window */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={chatbotRef}
                style={{
                  position: 'fixed',
                  bottom: isExpanded ? '5%' : `${position.y}px`,
                  right: isExpanded ? '5%' : `${position.x}px`,
                  width: isExpanded ? '90vw' : `${size.width}px`,
                  height: isExpanded ? '85vh' : `${size.height}px`,
                  zIndex: 9998,
                  cursor: isResizing ? 'nwse-resize' : 'default',
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden border border-gray-200"
              >
                {/* Header */}
                <div
                  className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between select-none"
                  onMouseDown={handleDrag}
                >
                  <div className="flex items-center gap-2">
                    <ChatbotIcon />
                    <span className="font-semibold">{t('chatbot.title')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="hover:text-orange-200"
                    >
                      {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button onClick={toggleChatbot} className="hover:text-orange-200">
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {/* Intro */}
                  <div className="flex items-start gap-2">
                    <ChatbotIcon />
                    <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[85%] shadow-sm">
                      <p className="text-sm text-gray-700">{t('chatbot.welcomeMessage')}</p>
                    </div>
                  </div>

                  {/* Gợi ý */}
                  {chatHistory.length <= 1 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500 ml-1">{t('chatbot.tryAsking')}</p>
                      <div className="flex flex-wrap gap-2">
                        {sampleQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSampleClick(q)}
                            className="text-xs border border-orange-300 text-orange-600 hover:bg-orange-100 rounded-lg px-2 py-1 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {chatHistory
                    .filter((chat) => !chat.hideInChat)
                    .map((chat, i) => {
                      const isUser = chat.role === 'user';
                      const avatar = isUser ? null : <ChatbotIcon />;

                      if (isUser) {
                        return (
                          <div key={i} className="flex justify-end">
                            <div className="bg-orange-500 text-white rounded-xl p-3 max-w-[85%] whitespace-pre-wrap break-words">
                              {chat.text}
                            </div>
                          </div>
                        );
                      }

                      const { body, sources } = extractSourcesWithCitations(chat.text || '');

                      return (
                        <div key={i} className="flex gap-2 justify-start">
                          {avatar}
                          <div className="max-w-[85%]">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed [&>p]:mb-2 [&>ul]:my-2 [&>li]:ml-4">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                  components={{
                                    a: ({ ...props }) => {
                                      let href = encodeURI((props.href || '#').trim());
                                      if (!href.startsWith('http')) href = 'https://' + href;
                                      return (
                                        <a
                                          href={href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline break-all"
                                        >
                                          {props.children}
                                        </a>
                                      );
                                    },
                                    li: ({ ...props }) => (
                                      <li
                                        className="ml-4 list-decimal marker:text-orange-500"
                                        {...props}
                                      />
                                    ),
                                    blockquote: ({ ...props }) => (
                                      <blockquote
                                        className="border-l-2 border-gray-300 pl-4 italic text-gray-600"
                                        {...props}
                                      />
                                    ),
                                    code: ({ ...props }) => (
                                      <code className="bg-gray-100 px-1 rounded" {...props} />
                                    ),
                                  }}
                                >
                                  {bodyWithCitations(body, sources)}
                                </ReactMarkdown>
                              </div>

                              {sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-700">
                                  <strong>Nguồn Tham Khảo:</strong>
                                  <ul className="list-decimal list-inside space-y-1 text-[13px]">
                                    {sources.map((url, idx) => (
                                      <li key={idx}>
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline break-all"
                                        >
                                          {url}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Input */}
                <div className="border-t bg-white p-3">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={t('chatbot.inputPlaceholder')}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </form>
                </div>

                {/* Resize handle */}
                {!isExpanded && (
                  <div
                    onMouseDown={handleResize}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-transparent"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </ChatbotContext.Provider>
  );
};
