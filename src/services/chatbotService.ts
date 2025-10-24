export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  hideInChat?: boolean;
  isLoading?: boolean;
}

export interface ChatHistory {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export const companyInfo = `
Giới thiệu:
Xin chào! Tôi là chatbot pháp lý của Lawstand, sẵn sàng hỗ trợ bạn trong việc tóm tắt văn bản pháp luật, giải đáp thủ tục cơ bản và kết nối với luật sư uy tín.

Chi tiết:
Lawstand là nền tảng pháp lý số (LegalTech) thuộc startup LinkSpace. Sứ mệnh của chúng tôi là giúp người Việt, Việt kiều và người nước ngoài tại Việt Nam tiếp cận thông tin pháp luật minh bạch, dễ hiểu và hiệu quả. 
Các tính năng chính:
- Tóm tắt văn bản pháp luật bằng AI, kèm ví dụ thực tế.
- Chatbot AI 24/7 trả lời câu hỏi pháp lý cơ bản.
- Kết nối trực tuyến với luật sư có chứng chỉ và đánh giá minh bạch.
- Hỗ trợ đa ngôn ngữ: Tiếng Việt, Tiếng Anh (sắp tới mở rộng Hàn/Nhật).
- Gói dịch vụ linh hoạt: miễn phí cơ bản, nâng cấp trả phí khi cần tư vấn chuyên sâu.

Liên hệ:
Website: https://law-stand.vercel.app/
Email: support@lawstand.vn
Hotline: +84 123 456 789
Địa chỉ: Tầng 5, Tòa nhà LinkSpace, Hà Nội, Việt Nam
Facebook: https://www.facebook.com/profile.php?id=61581765902865
LinkedIn: https://linkedin.com/company/lawstand

Dịch vụ:
- AI tóm tắt pháp luật: rút gọn nhanh, dễ hiểu.
- Chatbot pháp lý 24/7: hỗ trợ thủ tục cơ bản.
- Tìm kiếm đa ngôn ngữ: Việt – Anh.
- Kết nối luật sư online: minh bạch, đánh giá công khai.

Tại Lawstand, chúng tôi tin rằng kiến thức pháp luật chỉ thật sự có giá trị khi mỗi người hiểu và bảo vệ được quyền lợi của mình.

---

Introduction:
Hello! I'm the Lawstand legal chatbot, here to assist you with summarizing legal documents, answering basic procedures, and connecting you with trusted lawyers.

Details:
Lawstand is a digital legal platform (LegalTech) developed by LinkSpace. Our mission is to make legal information transparent, accessible, and easy to understand for Vietnamese citizens, overseas Vietnamese, and foreigners living in Vietnam. 
Key features:
- AI-powered legal document summarization with practical examples.
- 24/7 legal chatbot for basic legal inquiries.
- Online lawyer connection with certified and publicly reviewed experts.
- Multilingual support: Vietnamese, English (expanding to Korean/Japanese).
- Flexible service plans: free basic package, upgrade for in-depth consultation.

Contact:
Website: https://law-stand.vercel.app/
Email: support@lawstand.vn
Hotline: +84 123 456 789
Address: 5th Floor, LinkSpace Building, Ho Chi Minh City, Vietnam
Facebook: https://www.facebook.com/profile.php?id=61581765902865
LinkedIn: https://linkedin.com/company/lawstand

Services:
- AI legal summarization: concise, clear, with examples.
- 24/7 legal chatbot: answers to basic procedures.
- Multilingual legal search: Vietnamese – English.
- Online lawyer connection: transparent, with public reviews.

At Lawstand, we believe legal knowledge is only valuable when people can truly understand and protect their rights.
`;

export class ChatbotService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Generate bot response using AI service
   * @param chatHistory - Array of chat messages
   * @returns Promise with bot response
   */
  static async generateBotResponse(chatHistory: ChatMessage[]): Promise<string> {
    // Format chat history for the API request
    const formattedHistory = chatHistory.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    let retries = 0;

    while (retries < this.MAX_RETRIES) {
      try {
        // Make the API call to get the bot's response
        const response = await fetch(
          import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:5000/chat',
          requestOptions,
        );

        if (response.status === 503) {
          // If it's a 503 error, wait and retry
          retries++;
          console.warn(`503 Service Unavailable. Retrying... Attempt ${retries}`);
          await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY * retries));
          continue;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Something went wrong');
        }

        // Clean and return the bot's response
        const apiResponseText = data.candidates[0].content.parts[0].text
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .trim();

        return apiResponseText;
      } catch (error) {
        if (
          retries === this.MAX_RETRIES - 1 ||
          (error as Error).message !== 'Something went wrong'
        ) {
          // If max retries reached or it's not a generic error, throw the error
          throw error;
        }
        retries++;
        console.warn(`Error fetching response. Retrying... Attempt ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY * retries));
      }
    }

    throw new Error('Service is currently unavailable. Please try again later.');
  }

  /**
   * Get initial chat history with company info
   * @returns Initial chat messages
   */
  static getInitialChatHistory(): ChatMessage[] {
    return [
      {
        hideInChat: true,
        role: 'model',
        text: companyInfo,
      },
    ];
  }
}
