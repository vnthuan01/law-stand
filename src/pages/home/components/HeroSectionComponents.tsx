import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSectionComponents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gray-800 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-400 font-semibold tracking-wider uppercase">
            {t('home.hero_tagline')}
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
            {t('home.hero_title_1')}{' '}
            <span className="text-orange-400">{t('home.hero_title_2')}</span>
            <br />
            {t('home.hero_title_3')} {t('home.hero_title_4')}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">{t('home.hero_subtitle')}</p>
          <div className="mt-10">
            <Button size="lg" onClick={() => navigate('/booking')}>
              {t('home.book_consultation')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionComponents;
