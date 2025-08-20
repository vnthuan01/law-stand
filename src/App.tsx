import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from '@/routes/index';
import { ChatbotProvider } from './components/provider/chatbot/ChatBotProvider';

// Tạo queryClient global
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatbotProvider>
        <AppRoutes />
      </ChatbotProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
