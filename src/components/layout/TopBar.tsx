import React from 'react';
import { useTranslation } from 'react-i18next';

const TopBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-black">
      <div className="text-white text-sm max-w-7xl mx-auto px-4 py-2 grid grid-cols-3 items-center">
        <div className="text-left">{t('topbar.working_hours')}</div>
        <div className="text-center font-semibold">{t('topbar.booking_online')}</div>
        <div className="text-right">(+84) 375 852 406</div>
      </div>
    </div>
  );
};

export default TopBar;
