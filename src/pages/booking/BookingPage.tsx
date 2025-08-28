import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { BookingFormSection } from './components/BookingFormSecond';

const BookingPage: React.FC = () => {
  return (
    <MainLayout>
      <main>
        <BookingFormSection />
      </main>
      {/* Footer */}
    </MainLayout>
  );
};

export default BookingPage;
