// components/TestimonialsSection.tsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const testimonials = [
    {
      name: 'Anthony Williams',
      initial: 'A',
      textKey: 'home.testimonial_1_text',
    },
    {
      name: 'John Shea',
      initial: 'J',
      textKey: 'home.testimonial_2_text',
    },
  ];
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('home.testimonials_title')}
          </h2>
          <p className="text-gray-600">{t('home.testimonials_subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-lg p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.initial}
                  </div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{t(testimonial.textKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="orange"
            size="lg"
            className="px-8 py-3 font-semibold rounded-lg"
            onClick={() => navigate('/booking')}
          >
            {t('home.book_consultation')}
          </Button>
        </div>
      </div>
    </section>
  );
}
