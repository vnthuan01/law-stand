import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function ResourceHeroSection() {
  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-orange-500 font-semibold tracking-wide uppercase "
        >
          Resource
        </motion.h2>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-3"
        >
          Information is empowering.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-500 mb-10"
        >
          Find the laws and updates you need.
        </motion.p>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative flex items-center max-w-2xl mx-auto mb-12"
        >
          <input
            type="text"
            placeholder="Searching law needed"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="ml-3 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-white text-sm font-medium hover:bg-orange-600">
            <Search className="w-4 h-4" /> Search
          </button>
        </motion.div>
      </div>
    </section>
  );
}
