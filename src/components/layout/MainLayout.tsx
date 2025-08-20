// components/MainLayout.tsx
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className={clsx('w-full', className)}>
      <TopBar />
      {/* Header Section */}
      <div className="sticky top-0 z-50 bg-white border-b">
        {' '}
        <Header />
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
