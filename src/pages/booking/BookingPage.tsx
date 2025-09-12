import React from 'react';
import { BookingFormSection } from './components/BookingFormSecond';
import MainLayout from '@/components/layout/MainLayout';

const BookingPage: React.FC = () => {
  return (
    <MainLayout>
      {' '}
      <main>
        <BookingFormSection />
      </main>
    </MainLayout>
  );
};

export default BookingPage;
