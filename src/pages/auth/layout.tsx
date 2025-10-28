import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Scale } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
}

const getMessages = (t: (key: string) => string) => [
  {
    icon: <Scale className="w-4 h-4 inline mr-1" />,
    text: t('auth.demo.ai1'),
  },
  {
    icon: <User className="w-4 h-4 inline mr-1" />,
    text: t('auth.demo.user1'),
  },
  {
    icon: <Scale className="w-4 h-4 inline mr-1" />,
    text: t('auth.demo.ai2'),
  },
  {
    icon: <User className="w-4 h-4 inline mr-1" />,
    text: t('auth.demo.user2'),
  },
  {
    icon: <Scale className="w-4 h-4 inline mr-1" />,
    text: t('auth.demo.ai3'),
  },
];

// config
const gap = 4; // delay between appearances
const fade = 1.2; // fade in/out time
const visibleTime = 6; // how long each bubble stays fully visible

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, imageSrc }) => {
  const { t } = useTranslation();
  const messages = getMessages(t);

  return (
    <div className="flex w-full min-h-screen">
      {/* Left side */}
      <div className="hidden md:flex flex-1 sticky top-0 h-screen relative overflow-hidden">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Auth illustration"
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Fake Chat Bubbles */}
        <div className="absolute inset-0 flex flex-col items-start p-10 space-y-4 pointer-events-none">
          {messages.map((msg, i) => {
            const delay = i * gap; // message i xuất hiện muộn hơn

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [20, 0, 0, -20],
                }}
                transition={{
                  duration: fade * 2 + visibleTime, // vòng đời 1 bubble
                  times: [
                    0, // start
                    fade / (fade * 2 + visibleTime), // fade in done
                    (fade + visibleTime) / (fade * 2 + visibleTime), // still visible
                    1, // fade out done
                  ],
                  ease: 'easeInOut',
                  delay: delay, // xuất hiện cách nhau 4s
                  repeat: Infinity,
                  repeatDelay: (messages.length - 1) * gap, // chờ trước khi vòng lặp mới
                }}
                className={`rounded-2xl px-4 py-2 shadow-lg max-w-sm ${
                  msg.text.startsWith('User') ? 'bg-blue-500/80 text-white self-end' : 'bg-white/80'
                }`}
              >
                <div>
                  {msg.icon}{' '}
                  {msg.text.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-start justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
