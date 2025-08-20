import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, imageSrc }) => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side (Image/Animation) */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100">
        {imageSrc ? (
          <img src={imageSrc} alt="Auth illustration" className="w-full h-full object-cover" />
        ) : (
          <div className="text-2xl font-bold text-gray-500">Your animation / image here</div>
        )}
      </div>

      {/* Right side (Form) */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
