import React from 'react';
import { Facebook, Twitter, Instagram, Plus } from 'lucide-react';

interface Error404Props {
  onReturnHome?: () => void;
  className?: string;
}

const Error404: React.FC<Error404Props> = ({ onReturnHome, className = '' }) => {
  const handleReturnHome = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      // Default behavior - navigate to home
      window.location.href = '/';
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${className}`}>
      <div className="text-center max-w-2xl mx-auto">
        {/* Large 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-light text-orange-400 leading-none">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-4 tracking-wide">
            OOPS! NOTHING WAS FOUND
          </h2>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been removed had its name changed or is
            temporarily unavailable.{' '}
            <button
              onClick={handleReturnHome}
              className="text-orange-400 hover:text-orange-500 underline transition-colors duration-200"
            >
              Return to homepage
            </button>
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center space-x-6">
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-orange-200 text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-orange-200 text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
            aria-label="Twitter"
          >
            <Twitter size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-orange-200 text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-orange-200 text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
            aria-label="Google Plus"
          >
            <Plus size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Error404;
