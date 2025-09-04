import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ResourceHeroSection from './components/ResourceHeroSection';
import CTASection from '../home/components/CTASectionComponents';
import LatestUpdateLawSection from './components/LatestUpdateLawSection';
import BlogSectionComponents from './components/BlogSectionComponents';
import PopularLawSidebar from './components/PopularLawSidebar';

const ResourcePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <ResourceHeroSection />
      <main>
        {/* Content with sidebar */}
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <LatestUpdateLawSection />
              <BlogSectionComponents />
            </div>
            <div className="lg:sticky lg:top-20 lg:self-start">
              <PopularLawSidebar />
            </div>
          </div>
        </div>

        <CTASection />
      </main>
      {/* Footer  */}
    </MainLayout>
  );
};

export default ResourcePage;
