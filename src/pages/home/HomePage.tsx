import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/layout/Section';
import ServicesSection from './components/ServicesSectionComponents';
import TestimonialsSection from './components/TestimonialsSectionComponents';
import CTASection from './components/CTASectionComponents';
import TeamSectionComponents from './components/TeamSectionComponents';
import FAQSection from './components/QASectionComponents';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />
      <main>
        <ServicesSection />
        <TestimonialsSection />
        <TeamSectionComponents />
        <FAQSection />
        <CTASection />
      </main>
      {/* Footer */}
    </MainLayout>
  );
};

export default HomePage;
