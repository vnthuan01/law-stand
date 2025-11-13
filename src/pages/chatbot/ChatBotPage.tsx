import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Mic,
  Send,
  StopCircle,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/UserLayout';
import { useConversation } from '@/hooks/useConversation';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

type Role = 'user' | 'assistant';

interface ChatAttachment {
  id: string;
  type: 'image' | 'audio';
  file?: File;
  url: string;
  durationMs?: number;
  width?: number;
  height?: number;
}

interface ChatMessage {
  id: string;
  role: Role;
  text?: string;
  attachments?: ChatAttachment[];
  createdAt: number;
  status?: 'sending' | 'sent' | 'error';
}

const uid = () => Math.random().toString(36).slice(2);

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
};

export default function ChatGPTLikePage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'assistant',
      text: t('chatbot.initialMessage'),
      createdAt: Date.now() - 10_000,
      status: 'sent',
    },
  ]);

  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [userQuestion, setUserQuestion] = useState<string | null>(null); // track latest sent user question
  // Xoá retryQ vì không dùng
  // const [retryQ, setRetryQ] = useState<string | null>(null);

  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // useConversation chỉ gọi khi userQuestion có giá trị
  const { answerQuery, similarQuestionsQuery, validateResponseMutation, questionContextQuery } =
    useConversation({ question: userQuestion || '', limit: 5 });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const addImageFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    const images = list.filter((f) => f.type.startsWith('image/'));

    const imageAttachments = await Promise.all(
      images.map(
        (file) =>
          new Promise<ChatAttachment>((resolve) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () =>
              resolve({
                id: uid(),
                type: 'image',
                url,
                file,
                width: img.width,
                height: img.height,
              });
            img.src = url;
          }),
      ),
    );

    setPendingAttachments((prev) => [...prev, ...imageAttachments]);
  }, []);

  const onInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addImageFiles(e.target.files);
    e.currentTarget.value = ''; // allow re-select same file
  };

  // Drag & Drop
  useEffect(() => {
    const area = dropRef.current;
    if (!area) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      area.classList.add('ring-2', 'ring-primary');
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      area.classList.remove('ring-2', 'ring-primary');
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      area.classList.remove('ring-2', 'ring-primary');
      if (e.dataTransfer?.files?.length) addImageFiles(e.dataTransfer.files);
    };

    area.addEventListener('dragover', onDragOver);
    area.addEventListener('dragleave', onDragLeave);
    area.addEventListener('drop', onDrop);

    return () => {
      area.removeEventListener('dragover', onDragOver);
      area.removeEventListener('dragleave', onDragLeave);
      area.removeEventListener('drop', onDrop);
    };
  }, [addImageFiles]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];

      rec.ondataavailable = (evt) => {
        if (evt.data.size > 0) chunksRef.current.push(evt.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a: ChatAttachment = {
          id: uid(),
          type: 'audio',
          url,
          file: new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' }),
          durationMs: recordingTime,
        };
        setPendingAttachments((prev) => [...prev, a]);
        setRecordingTime(0);
      };

      rec.start(100);
      setMediaRecorder(rec);
      setIsRecording(true);

      // timer
      const startedAt = Date.now();
      timerRef.current = window.setInterval(() => {
        setRecordingTime(Date.now() - startedAt);
      }, 200) as unknown as number;
    } catch (err) {
      console.error('Mic error:', err);
      alert('Unable to access microphone. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    setMediaRecorder(null);
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const sendMessage = useCallback(
    async (customInput?: string) => {
      const value = (customInput !== undefined ? customInput : input).trim();
      if (!value && pendingAttachments.length === 0) return;
      setIsSending(true);
      // User message bubble
      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        text: value || undefined,
        attachments: pendingAttachments,
        createdAt: Date.now(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setPendingAttachments([]);
      setUserQuestion(value);
      // Xoá retryQ vì không dùng
      // setRetryQ(null); // clear lỗi cũ nếu có
    },
    [input, pendingAttachments],
  );

  // Khi có lỗi, add bubble assistant error ngay sau tin nhắn user cuối cùng
  useEffect(() => {
    if (
      userQuestion &&
      answerQuery.isError &&
      messages[messages.length - 1]?.text === userQuestion
    ) {
      // Chưa có bubble lỗi assistant cho userQuestion này ?
      const lastAssistantError = messages
        .slice()
        .reverse()
        .find((m) => m.role === 'assistant' && m.status === 'error');
      if (!lastAssistantError || lastAssistantError.text !== userQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            text: userQuestion,
            createdAt: Date.now(),
            status: 'error',
          } as ChatMessage,
        ]);
        // Xoá retryQ vì không dùng
        // setRetryQ(userQuestion); // gợi ý retry đúng câu này
      }
    }
    // Nếu answer thành công và từng có bubble lỗi thì xóa đi
    if (answerQuery.isSuccess && messages[messages.length - 1]?.status === 'error') {
      setMessages((prev) => prev.filter((m) => m.status !== 'error'));
    }
  }, [answerQuery.isError, answerQuery.isSuccess, userQuestion, messages]);

  const removePendingAttachment = useCallback((id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearPendingAttachments = useCallback(() => setPendingAttachments([]), []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Hàm reset/khởi tạo cuộc trò chuyện mới
  const resetConversation = useCallback(() => {
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        text: t('chatbot.initialMessage'),
        createdAt: Date.now(),
        status: 'sent',
      },
    ]);
    setUserQuestion(null);
    setInput('');
    setPendingAttachments([]);
    toast.info('Đã bắt đầu cuộc trò chuyện mới.');
  }, [t]);

  const handleSuggestionClick = useCallback((question: string) => {
    setInput(question);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const composer = document.getElementById('chatbot-composer-textarea');
        composer?.focus();
      }, 20);
    }
  }, []);

  return (
    <Layout>
      {/* Chat area */}
      <main className="flex-1 my-2">
        <div className="max-w-5xl mx-auto h-full px-2 sm:px-4">
          <Card className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] rounded-2xl shadow-sm border">
            {/* container */}
            <CardHeader className="py-3 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Chat with AI</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-full mt-2">
              {/* Messages list */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-3 sm:px-6 pb-4 space-y-4"
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
                aria-label="Lịch sử hội thoại chatbot"
              >
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, translateY: 8 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      exit={{ opacity: 0, translateY: -8 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                      aria-label={
                        m.role === 'user'
                          ? 'Tin nhắn người dùng'
                          : m.status === 'error'
                            ? 'Lỗi AI'
                            : 'Trả lời từ AI'
                      }
                      tabIndex={-1}
                    >
                      {/* Avatar */}
                      <div
                        className={`size-8 shrink-0 rounded-xl grid place-items-center font-bold text-white ${m.role === 'user' ? 'bg-blue-600' : m.status === 'error' ? 'bg-red-500' : 'bg-zinc-900'}`}
                      >
                        {m.role === 'user' ? (
                          'U'
                        ) : m.status === 'error' ? (
                          <AlertTriangle className="size-5" />
                        ) : (
                          'AI'
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3 text-sm shadow ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : m.status === 'error' ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none' : 'bg-white border rounded-tl-none'}`}
                        aria-label={
                          m.role === 'user'
                            ? 'Nội dung người dùng'
                            : m.status === 'error'
                              ? 'Nội dung lỗi AI'
                              : 'Nội dung trả lời AI'
                        }
                        tabIndex={0}
                      >
                        {m.status === 'error' ? (
                          <div className="flex gap-2 items-center">
                            <AlertTriangle
                              className="size-4 text-red-500 mr-1"
                              aria-hidden="true"
                            />
                            <span className="flex-1">
                              Xin lỗi, hệ thống không thể trả lời do lỗi máy chủ. Hãy thử lại sau
                              hoặc bấm “Thử lại”.
                            </span>
                            <Button
                              aria-label="Thử lại câu hỏi này"
                              size="sm"
                              variant="outline"
                              className="ml-2 focus-visible:ring-red-500 focus:outline-none"
                              onClick={() => sendMessage(m.text!)}
                            >
                              Thử lại
                            </Button>
                          </div>
                        ) : (
                          m.text && (
                            <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                          )
                        )}

                        {/* Attachments */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {m.attachments.map((a) => (
                              <div
                                key={a.id}
                                className="group relative overflow-hidden rounded-xl border bg-white"
                              >
                                {a.type === 'image' ? (
                                  <img
                                    src={a.url}
                                    alt="attachment"
                                    className="w-full h-36 object-cover"
                                  />
                                ) : (
                                  <div className="p-3 flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-100 grid place-items-center">
                                      <Mic className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-muted-foreground truncate">
                                        {t('chatbot.voiceRecording')}
                                      </p>
                                      <p className="text-xs font-medium">
                                        {formatTime(a.durationMs ?? 0)}
                                      </p>
                                      <audio src={a.url} controls className="mt-1 w-full" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Status */}
                        {m.status !== 'sent' && (
                          <div className="mt-2 text-[11px] opacity-70 flex items-center gap-1">
                            {m.status === 'sending' && <Loader2 className="size-3 animate-spin" />}
                            <span>
                              {m.status === 'sending'
                                ? t('chatbot.sending')
                                : m.status === 'error'
                                  ? t('chatbot.failedToSend')
                                  : null}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Composer */}
              <div ref={dropRef} className="" aria-label="Vùng nhập tin nhắn">
                {/* Pending attachments preview */}
                {pendingAttachments.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">
                        {t('chatbot.attachments')} ({pendingAttachments.length})
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={clearPendingAttachments}
                      >
                        <Trash2 className="size-4" /> {t('chatbot.clearAll')}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {pendingAttachments.map((a) => (
                        <div
                          key={a.id}
                          className="relative group rounded-xl overflow-hidden border bg-white"
                        >
                          {a.type === 'image' ? (
                            <img src={a.url} className="w-full h-28 object-cover" />
                          ) : (
                            <div className="p-3 flex items-center gap-3">
                              <div className="size-9 rounded-full bg-gray-100 grid place-items-center">
                                <Mic className="size-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {t('chatbot.voiceRecording')}
                                </p>
                                <p className="text-xs font-medium">
                                  {formatTime(a.durationMs ?? 0)}
                                </p>
                                <audio src={a.url} controls className="mt-1 w-full" />
                              </div>
                            </div>
                          )}
                          <button
                            className="absolute top-1 right-1 size-6 rounded-full bg-white/90 border shadow hidden group-hover:grid place-items-center"
                            onClick={() => removePendingAttachment(a.id)}
                            title="Remove"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-end gap-2 bg-gray-50 rounded-xl p-2 border">
                  {/* Attach image */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={onInputFileChange}
                    />
                    <div className="size-10 rounded-2xl border grid place-items-center hover:bg-gray-50 active:scale-95 transition">
                      <ImageIcon className="size-5" />
                    </div>
                  </label>

                  {/* Record button */}
                  {!isRecording ? (
                    <button
                      className="size-10 rounded-2xl border grid place-items-center hover:bg-gray-50 active:scale-95 transition"
                      onClick={startRecording}
                      title={t('chatbot.record')}
                    >
                      <Mic className="size-5" />
                    </button>
                  ) : (
                    <button
                      className="size-10 rounded-2xl border grid place-items-center hover:bg-gray-50 active:scale-95 transition"
                      onClick={stopRecording}
                      title={t('chatbot.stopRecording')}
                    >
                      <StopCircle className="size-5" />
                    </button>
                  )}

                  {/* Composer input */}
                  <Textarea
                    id="chatbot-composer-textarea"
                    aria-label="Nhập tin nhắn cho chatbot"
                    aria-describedby="message-helper"
                    aria-autocomplete="both"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chatbot.messagePlaceholder')}
                    className="flex-1 rounded-2xl resize-none min-h-[44px] max-h-[180px] border px-4 py-3 focus:outline-none focus-visible:ring-2 ring-primary"
                    rows={1}
                  />

                  {/* Send */}
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isSending || (!input.trim() && pendingAttachments.length === 0)}
                    className="h-11 rounded-2xl px-4 focus:outline-none focus-visible:ring-2 ring-primary"
                    aria-label="Gửi tin nhắn"
                    type="submit"
                  >
                    {isSending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                  </Button>
                </div>
                {/* Recording indicator */}
                {isRecording && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-600 animate-pulse" />
                    Recording… {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {messages.length > 1 &&
        messages[messages.length - 1].role === 'assistant' &&
        userQuestion && (
          <div className="pt-2 pb-2 px-6">
            {/* Answer loading/error */}
            {answerQuery.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-start gap-3"
              >
                <div className="size-8 shrink-0 rounded-xl grid place-items-center font-bold text-white bg-zinc-900">
                  AI
                </div>
                <div
                  className="bg-zinc-100 rounded-2xl h-14 w-60 sm:w-80 mb-2 animate-pulse shimmer-bubble"
                  aria-busy
                  aria-live="polite"
                />
              </motion.div>
            )}
            {answerQuery.isError && (
              <Alert
                variant="destructive"
                appearance="light"
                className="mb-2"
                aria-live="assertive"
              >
                {answerQuery.error?.message || 'Có lỗi khi lấy câu trả lời.'}
              </Alert>
            )}
            {answerQuery.isError && (
              <div className="pb-6 px-6">
                <Alert
                  variant="destructive"
                  appearance="solid"
                  className="mb-2"
                  aria-live="assertive"
                >
                  Đã xảy ra lỗi server khi lấy kết quả. Vui lòng thử lại hoặc bắt đầu cuộc trò
                  chuyện mới.
                </Alert>
                <Button
                  variant="primary"
                  aria-label="Tạo cuộc trò chuyện mới"
                  onClick={resetConversation}
                  className="mt-1"
                >
                  Tạo cuộc trò chuyện mới
                </Button>
              </div>
            )}
            {/* Answer result */}
            {answerQuery.isSuccess && answerQuery.data && (
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <Badge
                    variant="success"
                    size="sm"
                    aria-label={`Độ tin cậy: ${answerQuery.data.confidence.toFixed(2)}`}
                  >{`Độ tin cậy: ${answerQuery.data.confidence.toFixed(2)}`}</Badge>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Nguồn tham chiếu">
                        Nguồn
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="max-h-48 overflow-y-auto">
                        <div className="font-medium mb-2">Nguồn tham chiếu:</div>
                        <ul className="pl-4 text-xs">
                          {answerQuery.data.sources?.length ? (
                            answerQuery.data.sources.map((src, i) => <li key={i}>{src}</li>)
                          ) : (
                            <li>Không tìm thấy nguồn rõ ràng.</li>
                          )}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Ngữ cảnh">
                        Ngữ cảnh
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom">
                      <pre className="text-xs whitespace-pre-wrap max-w-xs max-h-60 overflow-x-auto">
                        {JSON.stringify(questionContextQuery.data, null, 2)}
                      </pre>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="prose prose-sm leading-relaxed bg-zinc-50/60 rounded-lg px-3 py-2 mt-2 border">
                  {answerQuery.data.answer}
                </div>
              </div>
            )}
            {/* Similar Questions */}
            <div className="pt-2">
              {similarQuestionsQuery.isLoading ? (
                <Skeleton className="w-full h-16 animate-pulse" aria-busy aria-live="polite" />
              ) : similarQuestionsQuery.isError ? (
                <Alert variant="warning" appearance="light" size="sm" aria-live="assertive">
                  Không lấy được gợi ý câu hỏi tương tự.
                </Alert>
              ) : similarQuestionsQuery.data &&
                similarQuestionsQuery.data.similar_questions.length > 0 ? (
                <Accordion type="single" collapsible className="mb-0 border-none">
                  <AccordionItem value="related-questions">
                    <AccordionTrigger>Câu hỏi liên quan</AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid gap-2 py-1">
                        {similarQuestionsQuery.data.similar_questions.map((q) => (
                          <li key={q.question} className="flex items-center justify-between gap-2">
                            <span className="flex-1 text-xs text-muted-foreground">
                              {q.question}
                            </span>
                            <Button
                              size="sm"
                              variant="secondary"
                              aria-label={`Đặt câu hỏi: ${q.question}`}
                              tabIndex={0}
                              className="focus:outline-none focus-visible:ring-2 ring-primary"
                              onClick={() => handleSuggestionClick(q.question)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSuggestionClick(q.question);
                              }}
                            >
                              Đặt câu này
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : null}
            </div>
            {/* Answer Validation (trigger sau khi có answer) */}
            <div className="pt-1">
              {answerQuery.isSuccess && validateResponseMutation.status !== 'pending' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      const data = await validateResponseMutation.mutateAsync({
                        question: userQuestion,
                        response: answerQuery.data!.answer,
                      });
                      if (data.is_valid) toast.success('Trả lời tin cậy, nội dung được xác thực!');
                      else toast.warning(`AI nghi ngờ: ${data.suggestions?.join('; ')}`);
                    } catch (e: any) {
                      toast.error('Không xác thực được độ hợp lệ trả lời.');
                      console.log(e.data.message);
                    }
                  }}
                >
                  Kiểm tra độ hợp lệ
                </Button>
              )}
              {validateResponseMutation.status === 'pending' && (
                <span className="text-xs ml-2">Đang kiểm tra...</span>
              )}
            </div>
          </div>
        )}
    </Layout>
  );
}
