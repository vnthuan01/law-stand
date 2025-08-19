// components/MainLayout.tsx
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return <div className={clsx('max-w-7xl mx-auto px-4 py-12 sm:py-16', className)}>{children}</div>;
};

export default MainLayout;
