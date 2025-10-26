import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const AboutHeroSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-zinc-50">
      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')} <span className="text-orange-500">{t('about.titileHighlight')}</span>
          </h2>
          <p className="text-gray-600">{t('about.subtitle')}</p>
        </motion.div>{' '}
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-zinc-700 max-w-3xl mx-auto leading-relaxed">
          {t('about.description_1')}
        </p>
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-zinc-700 max-w-3xl mx-auto leading-relaxed">
          {t('about.description_2')}
        </p>
      </div>
    </section>
  );
};

export default AboutHeroSection;
