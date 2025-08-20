import { motion } from 'framer-motion';
import { Briefcase, Users, Scale, Shield } from 'lucide-react';

const ProfessionalSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b587?...',
    },
    {
      id: 2,
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?...',
    },
    {
      id: 4,
      name: 'David Park',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?...',
    },
  ];

  const stats = [
    { label: 'Years of Experience', value: '15+' },
    { label: 'Successful Cases', value: '1200+' },
    { label: 'Trusted Clients', value: '900+' },
    { label: 'Expert Lawyers', value: '20+' },
  ];

  const practiceAreas = [
    {
      icon: Briefcase,
      title: 'Business Law',
      desc: 'Helping businesses grow with legal confidence.',
    },
    {
      icon: Users,
      title: 'Family Law',
      desc: 'Protecting relationships, resolving disputes with care.',
    },
    { icon: Scale, title: 'Civil Litigation', desc: 'Defending your rights in critical matters.' },
    {
      icon: Shield,
      title: 'Intellectual Property',
      desc: 'Safeguarding your ideas and innovations.',
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Pattern phủ đều */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/dot-grid.png')] bg-repeat"
          style={{ backgroundSize: '60px 60px' }}
        />
      </div>

      {/* Overlay gradient đậm hơn để text rõ */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30 mix-blend-overlay"></div>

      <div className="relative z-10 container mx-auto px-6 py-8 lg:py-10 lg:space-y-10 space-y-14">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Proudly <span className="text-blue-400">unconventional.</span>
            </h1>

            <p className="text-lg text-gray-200 max-w-lg">
              At <span className="font-semibold text-white">Lawstand</span>, we redefine legal
              practice by combining deep expertise with innovative strategies to deliver clarity,
              confidence, and justice.
            </p>

            {/* Team Avatars */}
            <div className="space-y-5">
              <div className="flex -space-x-4">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.15 }}
                    className="group relative"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-xl group-hover:ring-4 group-hover:ring-blue-400 transition"
                    />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                      {member.name}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-transparent border border-white/30 text-white font-medium rounded-full shadow-md hover:border-white hover:shadow-lg transition"
              >
                Meet the Team
              </motion.button>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?..."
                  alt="Executive Director"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 max-w-xs">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  Executive Director & <br /> General Counsel
                </h3>
              </div>
              {/* Decorative dots */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full opacity-80"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-9 -right-3 w-6 h-6 bg-orange-400 rounded-full opacity-60"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute -bottom-2 left-9 w-4 h-4 bg-green-400 rounded-full opacity-70"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-md hover:bg-white/20 transition"
            >
              <h3 className="text-4xl font-bold text-white">{item.value}</h3>
              <p className="text-gray-300 text-sm mt-2">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Practice Areas */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {practiceAreas.map((area, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition"
            >
              <area.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-gray-900 text-lg mb-2">{area.title}</h4>
              <p className="text-gray-600 text-sm">{area.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProfessionalSection;
