// components/TestimonialsSection.tsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock testimonials (nhiều hơn để đủ dài cho hiệu ứng loop)
  const testimonials = [
    {
      name: 'Anthony Williams',
      text: `"Lawstand's speed, clarity, and confidence are unmatched."`,
      initial: 'A',
    },
    {
      name: 'John Shea',
      text: `"Peace of mind and long-term assurance every time."`,
      initial: 'J',
    },
    { name: 'Maria Lopez', text: `"Transparent, fast, and professional service."`, initial: 'M' },
    { name: 'David Nguyen', text: `"Legal help that’s efficient and stress-free."`, initial: 'D' },
    {
      name: 'Sophie Clarke',
      text: `"Empathy and attention to detail made the difference."`,
      initial: 'S',
    },
    {
      name: 'Liam Carter',
      text: `"Clear explanations, human support, professional tone."`,
      initial: 'L',
    },
    { name: 'Emma Watson', text: `"Quick responses and genuinely caring staff."`, initial: 'E' },
    { name: 'Noah Kim', text: `"Lawstand made complex topics easy to understand."`, initial: 'N' },
  ];

  // Lặp lại 2 lần để khi scroll vòng không bị trống
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('home.testimonials_title')}{' '}
            <span className="text-orange-500">{t('home.testimonials_titleHighlight')}</span>
          </h2>
          <p className="text-gray-600">{t('home.testimonials_subtitle')}</p>
        </motion.div>

        {/* Continuous scrolling line */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: ['0%', '-50%'], // Di chuyển nửa chiều dài (vì doubledTestimonials)
            }}
            transition={{
              repeat: Infinity,
              duration: 30, // tốc độ: tăng giảm để nhanh/chậm hơn
              ease: 'linear',
            }}
          >
            {doubledTestimonials.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    {t.initial}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed">{t.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Optional gradient fade edges */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            variant="orange"
            size="lg"
            className="px-8 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            onClick={() => navigate('/booking')}
          >
            {t('home.book_consultation')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
