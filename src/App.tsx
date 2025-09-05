import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from '@/routes/index';
import { ChatbotProvider } from './components/provider/chatbot/ChatBotProvider';
import { SignalRProvider } from '@/components/provider/signalr/SignalRProvider';
import { ConnectionIndicator } from '@/components/provider/signalr/ConnectionIndicator';

// Tạo queryClient global
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignalRProvider>
        <ChatbotProvider>
          <AppRoutes />
          <ConnectionIndicator />
        </ChatbotProvider>
      </SignalRProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
