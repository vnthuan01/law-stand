import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AboutHeroSection from './components/HeroSectionComponents';
import StorySection from './components/DescriptionSectionComponents';
import TeamSection from './components/TeamSectionComponents';
import CTASection from '@/pages/home/components/CTASectionComponents';

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <AboutHeroSection />
      <main>
        <StorySection />
        <TeamSection />
        <CTASection />
      </main>
      {/* Footer */}
    </MainLayout>
  );
};

export default AboutPage;
