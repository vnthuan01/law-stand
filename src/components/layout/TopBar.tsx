'use client';

import React from 'react';

const TopBar: React.FC = () => {
  return (
    <div className="bg-black">
      <div className="text-white text-sm max-w-7xl mx-auto px-4 py-2 grid grid-cols-3 items-center">
        <div className="text-left">Monday - Friday, 8:30AM - 5:30PM</div>
        <div className="text-center font-semibold">24/7 Booking Online</div>
        <div className="text-right">(+84) 334 999 999</div>
      </div>
    </div>
  );
};

export default TopBar;
