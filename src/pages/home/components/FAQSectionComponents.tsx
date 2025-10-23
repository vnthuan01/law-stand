import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function FAQSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {t('home.faq_title')}
          </h2>
          <p className="text-gray-600">{t('home.faq_subtitle')}</p>
        </motion.div>

        {/* Accordion FAQ */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* FAQ 1 */}
          <AccordionItem value="faq-1" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium text-left">
              {t('faq.q1')}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">{t('faq.a1')}</AccordionContent>
          </AccordionItem>

          {/* FAQ 2 */}
          <AccordionItem value="faq-2" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium text-left">
              {t('faq.q2')}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">{t('faq.a2')}</AccordionContent>
          </AccordionItem>

          {/* FAQ 3 */}
          <AccordionItem value="faq-3" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium text-left">
              {t('faq.q3')}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">{t('faq.a3')}</AccordionContent>
          </AccordionItem>

          {/* FAQ 4 */}
          <AccordionItem value="faq-4" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium text-left">
              {t('faq.q4')}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {t('faq.a4')} <br />
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 5 */}
          <AccordionItem value="faq-5" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium text-left">
              {t('faq.q5')}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {t('faq.a5')} <br />
            </AccordionContent>
          </AccordionItem>
          {/* FAQ 6 */}
          <AccordionItem value="faq-6" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium text-left">
              {t('faq.q6')}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {t('faq.a6')} <br />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
