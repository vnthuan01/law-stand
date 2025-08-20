import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

// Container để stagger children
const textContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

// Variants an toàn (không dùng ease string)
const fromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const fromTop: Variants = {
  hidden: { opacity: 0, y: -40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7 } },
};

const HeroSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Content */}
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="show"
          className="space-y-6 sm:space-y-8 text-center md:text-left"
        >
          <motion.div variants={fromTop}>
            <p className="text-gray-600 text-base sm:text-lg font-jersey25">
              Lawstand is a digital platform
            </p>

          </motion.div>

          <motion.h1 className="space-y-2">
            <motion.div
              variants={fromBottom}
              className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 font-bold"

            >
              WE COMMITTED TO
            </motion.div>
            <motion.div
              variants={fromBottom}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            >
              <span className="text-orange-500">ACCOUNTABILITY</span>{' '}
              <span className="text-orange-500">AND</span>{' '}

              <span className="text-orange-500">TRANSPARENCY</span>
            </motion.div>
          </motion.h1>

          <motion.p
            variants={fromTop}
            className="text-gray-600 text-base sm:text-lg max-w-md mx-auto md:mx-0"
          >
            If you are unsure about the laws of Vietnam, we can help you address those issues.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={scaleUp}
            className="flex flex-col items-center sm:flex-row sm:items-center max-w-md mx-auto md:mx-0 w-full gap-3 sm:gap-0"
          >
            <Input
              type="text"
              placeholder="Searching law needed"
              className="w-full text-base px-4 py-3 md:py-6 border border-gray-300 rounded-lg sm:rounded-r-none sm:border-r-0 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Button
              variant="orange"
              size="lg"
              className="rounded-lg sm:rounded-l-none text-sm font-medium px-5 py-3 md:py-6 flex items-center justify-center gap-2 border border-orange-500 sm:border-l-0"
            >
              Search <Search className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          className="relative flex flex-col items-center md:items-start gap-4"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl w-full">
            <img
              src="/api/placeholder/600/400"
              alt="Legal gavel and books"
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
          </div>

          {/* Book button - mobile */}
          <div className="block md:hidden w-full flex justify-center mt-4 sm:mt-6">
            <Button
              variant="orange"
              size="lg"
              className="mt-4 px-6 py-4 font-semibold rounded-lg text-sm max-w-xs mx-auto"
            >
              Book a Consultation
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Book button - desktop */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block mt-6"
      >
        <Button variant="orange" size="lg" className="px-8 py-5 font-semibold rounded-lg">
          Book a Consultation
        </Button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
