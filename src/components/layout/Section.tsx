import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroImage from '@/assets/robot_lawyer.jpg';

const textContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};
const fromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Zoom-in & parallax transformations
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with zoom and parallax */}
      <motion.div
        style={{ scale, y, opacity, backgroundImage: `url(${HeroImage})` }}
        className="absolute inset-0 bg-cover bg-center"
      />

      {/* Futuristic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-[1px]" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent mix-blend-overlay" />

      {/* Glowing reflection accent */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-24 bg-gradient-to-r from-orange-400/30 via-white/20 to-blue-500/30 blur-3xl rounded-full opacity-50 animate-pulse" />

      {/* Main content */}
      <motion.div
        variants={textContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto text-center px-6 py-10 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl"
      >
        <motion.p variants={fromBottom} className="text-gray-200 text-lg font-medium">
          {t('home.hero_tagline')}
        </motion.p>

        <motion.h1
          variants={fromBottom}
          className="text-5xl sm:text-6xl font-extrabold text-white mt-4 leading-tight"
        >
          {t('home.hero_title_1')} <span className="text-orange-400">{t('home.hero_title_2')}</span>{' '}
          <span className="text-blue-400">{t('home.hero_title_3')}</span>{' '}
          <span className="text-orange-400">{t('home.hero_title_4')}</span>
        </motion.h1>

        <motion.p
          variants={fromBottom}
          className="text-gray-300 text-base sm:text-lg mt-4 max-w-xl mx-auto"
        >
          {t('home.hero_subtitle')}
        </motion.p>

        {/* Search bar */}
        <motion.div
          variants={fromBottom}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0"
        >
          <Input
            type="text"
            placeholder={t('home.search_placeholder')}
            className="w-full sm:w-96 text-base px-4 py-5 rounded-lg sm:rounded-r-none border border-white/30 bg-white/20 text-white placeholder:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Button
            variant="orange"
            size="lg"
            className="rounded-lg sm:rounded-l-none px-6 py-5 font-medium flex items-center justify-center gap-2 border border-orange-500 sm:border-l-0"
          >
            {t('common.search')} <Search className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={fromBottom} className="mt-8" onClick={() => navigate('/booking')}>
          <Button
            variant="orange"
            size="lg"
            className="px-8 py-5 font-semibold rounded-lg shadow-md"
          >
            {t('home.book_consultation')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
