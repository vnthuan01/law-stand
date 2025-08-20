import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const LATEST_UPDATES = [
  {
    date: 'July 1, 2025',
    text: 'Amended Land Law: Additional requirements for overseas Vietnamese to buy houses in Vietnam',
  },
  {
    date: 'June 30, 2025',
    text: 'Immigration Law 2025 officially takes effect',
  },
  {
    date: 'June 15, 2025',
    text: 'Updated personal income tax regulations',
  },
];

export default function ResourceHeroSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-orange-500 font-semibold tracking-wide uppercase mb-4"
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

        {/* Latest Updates */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-left max-w-2xl mx-auto"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-blue-500 text-lg">🛈</span> Latest Updates:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {LATEST_UPDATES.map((item, i) => (
              <li key={i}>
                <span className="font-semibold">[{item.date}]</span> {item.text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
