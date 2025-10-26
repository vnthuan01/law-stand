import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from './components/HeroSectionComponents';
import ServicesSection from './components/ServicesSectionComponents';
import TestimonialsSection from './components/TestimonialsSectionComponents';
import CTASection from './components/CTASectionComponents';
import TeamSectionComponents from './components/TeamSectionComponents';
import BlogSection from './components/BlogSectionComponents';
import PricingSection from './components/PricingSectionComponents';
import FAQSection from './components/FAQSectionComponents';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />
      <main>
        <ServicesSection />
        <PricingSection />
        <TestimonialsSection />
        <TeamSectionComponents />
        <FAQSection />
        <BlogSection />
        <CTASection />
      </main>
      {/* Footer */}
    </MainLayout>
  );
};

export default HomePage;
