import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Mic, Send, StopCircle, Trash2, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/UserLayout';

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
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  const sendMessage = async () => {
    if (!input.trim() && pendingAttachments.length === 0) return;

    setIsSending(true);

    // Create user message locally
    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      text: input.trim() || undefined,
      attachments: pendingAttachments,
      createdAt: Date.now(),
      status: 'sending',
    };
    setMessages((prev) => [...prev, userMsg]);

    // Reset input & attachments
    setInput('');
    setPendingAttachments([]);

    try {
      // Simulate assistant response
      await new Promise((r) => setTimeout(r, 900));
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        text:
          userMsg.attachments && userMsg.attachments.length > 0
            ? t('chatbot.fileReceivedResponse')
            : t('chatbot.textResponse', { text: userMsg.text ?? t('chatbot.empty') }),
        createdAt: Date.now(),
        status: 'sent',
      };

      // Mark user message as sent and add assistant message
      setMessages((prev) => {
        const updated: ChatMessage[] = prev.map(
          (m): ChatMessage => (m.id === userMsg.id ? { ...m, status: 'sent' as const } : m),
        );
        return [...updated, assistantMsg];
      });
    } catch (e) {
      console.error(e);
      setMessages((prev) => prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'error' } : m)));
    } finally {
      setIsSending(false);
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const clearPendingAttachments = () => setPendingAttachments([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 pb-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, translateY: 8 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      exit={{ opacity: 0, translateY: -8 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`size-8 shrink-0 rounded-xl grid place-items-center font-bold text-white ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900'}`}
                      >
                        {m.role === 'user' ? 'U' : 'AI'}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3 text-sm shadow ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}
                      >
                        {m.text && (
                          <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
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
              <div ref={dropRef} className="">
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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chatbot.messagePlaceholder')}
                    className="flex-1 rounded-2xl resize-none min-h-[44px] max-h-[180px] border px-4 py-3"
                    rows={1}
                  />

                  {/* Send */}
                  <Button
                    onClick={sendMessage}
                    disabled={isSending || (!input.trim() && pendingAttachments.length === 0)}
                    className="h-11 rounded-2xl px-4"
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
    </Layout>
  );
}
