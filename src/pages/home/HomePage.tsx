import React from 'react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/Section';
import Footer from '@/components/layout/Footer';
import ServicesSection from './components/ServicesSectionComponents';
import TestimonialsSection from './components/TestimonialsSectionComponents';
import CTASection from './components/CTASectionComponents';
import TeamSectionComponents from './components/TeamSectionComponents';
import FAQSection from './components/QASectionComponents';

const HomePage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <TopBar />
      {/* Header Section */}
      <div className="sticky top-0 z-50 bg-white border-b">
        {' '}
        <Header />
      </div>
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
      <Footer />
    </div>
  );
};

export default HomePage;
