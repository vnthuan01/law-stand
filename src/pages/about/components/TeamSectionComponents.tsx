import React from 'react';
import TeamCard from './TeamCardComponents';
import { motion } from 'framer-motion';

const TEAM_MEMBERS = [
  {
    name: 'Joseph Gibson',
    role: 'Executive Director & General Counsel',
    photo:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1200&auto=format&fit=crop',
    linkedin: '#',
    email: 'joseph@example.com',
    leader: true,
    bio: 'Joseph leads our team with over 15 years of experience in corporate law.',
  },
  {
    name: 'Bethany Carlson',
    role: 'Attorney',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    linkedin: '#',
    email: 'bethany@example.com',
    bio: 'Passionate about client advocacy and dispute resolution.',
  },

  {
    name: 'William Chavez',
    role: 'Senior Attorney',
    photo:
      'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop',
    linkedin: '#',
    email: 'william@example.com',
  },
  {
    name: 'Lauren Thomas',
    role: 'Attorney',
    photo:
      'https://images.unsplash.com/photo-1544005316-04ce1f7c219c?q=80&w=1200&auto=format&fit=crop',
    linkedin: '#',
    email: 'lauren@example.com',
  },
  {
    name: 'Michael Brown',
    role: 'Paralegal',
    photo:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop',
    linkedin: '#',
    email: 'michael@example.com',
  },
  {
    name: 'Sophia Nguyen',
    role: 'Client Success Manager',
    photo:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop',
    linkedin: '#',
    email: 'sophia@example.com',
  },
];

const TeamSection: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">Meet</span> The Team.
          </h2>
          <p className="text-gray-600">Experienced, empathetic, and focused on outcomes</p>
        </motion.div>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {TEAM_MEMBERS.map((m, i) => (
            <motion.li
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <TeamCard member={m} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamSection;
