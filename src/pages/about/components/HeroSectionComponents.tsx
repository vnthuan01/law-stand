import React from 'react';
import { motion } from 'framer-motion';

const AboutHeroSection: React.FC = () => {
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
            <span className="text-orange-500">About</span> Us.
          </h2>
          <p className="text-gray-600">Complete legal solutions for your needs</p>
        </motion.div>{' '}
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-zinc-700 max-w-3xl mx-auto leading-relaxed">
          Lawstand is a digital platform that makes legal guidance simple and accessible for
          everyone, including foreigners living in Vietnam. It offers bilingual legal search
          (Vietnamese–English), AI-powered summaries that turn lengthy regulations into
          under-100-word highlights with real-world examples, and a 24/7 legal chatbot that
          instantly answers common questions.
        </p>
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-zinc-700 max-w-3xl mx-auto leading-relaxed">
          Need expert help? Easily browse transparent lawyer profiles, view credentials and reviews,
          and book consultations online. Designed for speed and scale, Lawstand handles thousands of
          users simultaneously on both mobile apps and web, helping you understand and navigate the
          law with confidence.
        </p>
      </div>
    </section>
  );
};

export default AboutHeroSection;
