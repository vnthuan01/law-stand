import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StorySection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <figure className="overflow-hidden rounded-xl border border-zinc-200 shadow-xs">
            <img
              src="https://watermark.lovepik.com/photo/20211122/large/lovepik-business-team-meeting-discussion-picture_500704821.jpg"
              alt="Team collaboration"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </figure>
          <div className="px-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('about.story_mission_title_1')}{' '}
                <span className="text-orange-500">{t('about.story_mission_title_2')}</span>.
              </h2>
              <p className="text-gray-600">{t('about.subtitle')}</p>
            </motion.div>{' '}
            <p className="mt-3 text-zinc-700">{t('about.story_p1')}</p>
            <p className="mt-3 text-zinc-700">{t('about.story_p2')}</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-zinc-800">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <span>{t('about.feature1')}</span>
              </li>
              <li className="flex items-start gap-2 text-zinc-800">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <span>{t('about.feature2')}</span>
              </li>
              <li className="flex items-start gap-2 text-zinc-800">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <span>{t('about.feature3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
