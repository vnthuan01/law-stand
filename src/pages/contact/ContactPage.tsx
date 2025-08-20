import MainLayout from '@/components/layout/MainLayout';
import ContactHeroSection from './components/ContactHeroSection';
import ContactInfoSection from './components/ContactInfoSection';
import ContactFormSection from './components/ContactForm';

export default function ContactPage() {
  return (
    <MainLayout>
      <ContactHeroSection />
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto px-4 py-20">
          {/* Sticky left column */}
          <div className="relative">
            <div className="sticky top-24">
              <ContactInfoSection />
            </div>
          </div>

          {/* Scrollable form */}
          <ContactFormSection />
        </div>
      </main>
    </MainLayout>
  );
}
