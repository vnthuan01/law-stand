import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  conversationService,
  type ResponseResult,
  type SimilarQuestion,
} from '@/services/conversationService';

interface UseConversationProps {
  question: string;
  context?: string;
  limit?: number;
}

export function useConversation({ question, context, limit = 5 }: UseConversationProps) {
  const queryClient = useQueryClient();

  const answerQuery = useQuery<ResponseResult, Error>({
    queryKey: ['conversation', 'answer', question, context, limit],
    queryFn: () => conversationService.getAnswer(question, context, limit),
    enabled: !!question,
    staleTime: 1000 * 60 * 5,
  });

  const similarQuestionsQuery = useQuery<
    { similar_questions: SimilarQuestion[]; total_count: number },
    Error
  >({
    queryKey: ['conversation', 'similar', question, limit],
    queryFn: () => conversationService.getSimilarQuestions(question, limit),
    enabled: !!question,
    staleTime: 1000 * 60 * 5,
  });

  const validateResponseMutation = useMutation<
    { confidence: number; is_valid: boolean; suggestions: string[] },
    Error,
    { question: string; response: string }
  >({
    mutationFn: ({ question, response }) =>
      conversationService.validateResponse(question, response),
  });

  const questionContextQuery = useQuery<Record<string, unknown>, Error>({
    queryKey: ['conversation', 'context', question],
    queryFn: () => conversationService.getQuestionContext(question),
    enabled: !!question,
  });

  const questionSourcesQuery = useQuery<string[], Error>({
    queryKey: ['conversation', 'sources', question, limit],
    queryFn: async () => {
      const data = await conversationService.getQuestionSources(question, limit);
      // giả sử API trả về { sources: string[] }
      return data.sources ?? [];
    },
    enabled: !!question,
    staleTime: 1000 * 60 * 5,
  });

  return {
    answerQuery,
    similarQuestionsQuery,
    validateResponseMutation,
    questionContextQuery,
    questionSourcesQuery,
    queryClient,
  };
}
