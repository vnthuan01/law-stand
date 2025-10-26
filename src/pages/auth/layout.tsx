import React from 'react';
import { motion } from 'framer-motion';
import { User, Scale } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
}

const messages = [
  {
    icon: <Scale className="w-4 h-4 inline mr-1" />,
    text: 'AI: Hello! What do you want to know about Labor Law in Vietnam?',
  },
  {
    icon: <User className="w-4 h-4 inline mr-1" />,
    text: 'User: I want to know about the probation period in labor contracts.',
  },
  {
    icon: <Scale className="w-4 h-4 inline mr-1" />,
    text: 'AI: According to Labor Code 2019, probation is:\n- Up to 180 days for managers\n- Up to 60 days for technical jobs\n- Up to 30 days for others',
  },
  {
    icon: <User className="w-4 h-4 inline mr-1" />,
    text: 'User: What happens if the company doesn’t sign a contract after probation?',
  },
  {
    icon: <Scale className="w-4 h-4 inline mr-1" />,
    text: 'AI: If you keep working after probation without a contract, an official labor contract is automatically established.',
  },
];

// config
const gap = 4; // delay between appearances
const fade = 1.2; // fade in/out time
const visibleTime = 6; // how long each bubble stays fully visible

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, imageSrc }) => {
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
