import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const StorySection: React.FC = () => {
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
                Our <span className="text-orange-500">Story & Missions</span> .
              </h2>
              <p className="text-gray-600">Complete legal solutions for your needs</p>
            </motion.div>{' '}
            <p className="mt-3 text-zinc-700">
              Founded to bring clarity to complex legal processes, we combine expert counsel with
              thoughtful product design. Our platform highlights what really matters so you can act
              with confidence.
            </p>
            <p className="mt-3 text-zinc-700">
              Our mission is to make trustworthy legal help available to everyone: clear
              information, transparent pricing, and access to professionals who care about
              outcomes—not just paperwork.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-zinc-800">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <span>Expert attorneys across multiple practice areas</span>
              </li>
              <li className="flex items-start gap-2 text-zinc-800">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <span>Transparent fees — no surprises</span>
              </li>
              <li className="flex items-start gap-2 text-zinc-800">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <span>Secure, privacy-first platform</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
