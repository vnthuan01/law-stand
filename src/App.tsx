import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/components/provider/auth/AuthContext';

import AppRoutes from '@/routes/index';
import { ChatbotProvider } from './components/provider/chatbot/ChatBotProvider';

// Tạo queryClient global
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatbotProvider>
          <AppRoutes />
        </ChatbotProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
