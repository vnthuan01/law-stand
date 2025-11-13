import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_RAG_CHATBOT_URI,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});
export interface SimilarQuestion {
  category: string;
  question: string;
  similarity_score: number;
}

export interface ResponseResult {
  answer: string;
  confidence: number;
  metadata: {
    documents_searched: number;
    processing_time: number;
  };
  sources: string[];
  status: 'success' | string;
}

export const conversationService = {
  // POST /api/responses/similar
  getSimilarQuestions: async (question: string, limit = 5) => {
    const res = await apiClient.post<{ similar_questions: SimilarQuestion[]; total_count: number }>(
      '/api/responses/similar',
      { question, limit },
    );
    return res.data;
  },

  // POST /api/responses
  getAnswer: async (question: string, context?: string, limit = 5) => {
    const res = await apiClient.post<ResponseResult>('/api/responses', {
      question,
      context,
      limit,
    });
    return res.data;
  },

  // POST /api/responses/validate
  validateResponse: async (question: string, response: string) => {
    const res = await apiClient.post<{
      confidence: number;
      is_valid: boolean;
      suggestions: string[];
    }>('/api/responses/validate', { question, response });
    return res.data;
  },

  // GET /api/questions/context/{question_id}
  getQuestionContext: async (question_id: string) => {
    const res = await apiClient.get(`/api/questions/context/${question_id}`);
    return res.data;
  },

  // GET /api/questions/sources/{question}?limit=5
  getQuestionSources: async (question: string, limit = 5) => {
    const res = await apiClient.get(`/api/questions/sources/${encodeURIComponent(question)}`, {
      params: { limit },
    });
    return res.data;
  },
};
