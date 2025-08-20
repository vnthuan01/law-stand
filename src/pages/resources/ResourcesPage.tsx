import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ResourceHeroSection from './components/ResourceHeroSection';
import ResouceHeroSection from './components/ResourceHeroSection';
import CTASection from '../home/components/CTASectionComponents';
// import ResourceUpdateSection from './components/ResourceUpdateSection';
// import BlogSection from './components/BlogSection';

const ResourcePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <ResourceHeroSection />
      <main>
        {/* Search law & categories */}
        <ResouceHeroSection />

        {/* Latest updates list */}
        {/* <ResourceUpdateSection /> */}

        {/* Blogs */}
        {/* <BlogSection /> */}
        <CTASection />
      </main>
      {/* Footer  */}
    </MainLayout>
  );
};

export default ResourcePage;
