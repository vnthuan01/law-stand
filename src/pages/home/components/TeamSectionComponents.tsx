import { motion } from 'framer-motion';
import { Briefcase, Users, Scale, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeamSectionComponents = () => {
  const { t } = useTranslation();
  const teamMembers: { id: number; nameKey: string; image: string }[] = [
    {
      id: 1,
      nameKey: 'home.team_member_1_name',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      nameKey: 'home.team_member_2_name',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      nameKey: 'home.team_member_3_name',
      image:
        'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      nameKey: 'home.team_member_4_name',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
  ];

  const stats = [
    { labelKey: 'home.stat_experience', value: '15+' },
    { labelKey: 'home.stat_cases', value: '1200+' },
    { labelKey: 'home.stat_clients', value: '900+' },
    { labelKey: 'home.stat_lawyers', value: '20+' },
  ];

  const practiceAreas = [
    {
      icon: Briefcase,
      titleKey: 'home.practice_area_business_title',
      descKey: 'home.practice_area_business_desc',
    },
    {
      icon: Users,
      titleKey: 'home.practice_area_family_title',
      descKey: 'home.practice_area_family_desc',
    },
    {
      icon: Scale,
      titleKey: 'home.practice_area_civil_title',
      descKey: 'home.practice_area_civil_desc',
    },
    {
      icon: Shield,
      titleKey: 'home.practice_area_ip_title',
      descKey: 'home.practice_area_ip_desc',
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
              {t('home.team_title')}
            </h1>

            <p className="text-lg text-gray-200 max-w-lg">{t('home.team_subtitle')}</p>

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
                      alt={t(member.nameKey)}
                      className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-xl group-hover:ring-4 group-hover:ring-blue-400 transition"
                    />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                      {t(member.nameKey)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-transparent border border-white/30 text-white font-medium rounded-full shadow-md hover:border-white hover:shadow-lg transition"
              >
                {t('home.meet_the_team')}
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
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
                  alt={t('home.team_role_director')}
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 max-w-xs">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {t('home.team_role_director')}
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
              <p className="text-gray-300 text-sm mt-2">{t(item.labelKey)}</p>
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
              <h4 className="font-bold text-gray-900 text-lg mb-2">{t(area.titleKey)}</h4>
              <p className="text-gray-600 text-sm">{t(area.descKey)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSectionComponents;
