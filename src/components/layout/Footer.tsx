import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/law-firm-logo.png';
const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Cột 1 - Logo + About */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src={logo}
              alt="Lawstand Logo"
              className="h-14 w-auto mr-2 cover-contain bg-white rounded-full"
            />
            <span className="text-xl font-bold text-white">{t('common.app_name')}</span>
          </div>
          <p className="text-sm">{t('footer.description')}</p>
        </div>

        {/* Cột 2 - Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#">{t('nav.home')}</a>
            </li>
            <li>
              <a href="#">{t('nav.resources')}</a>
            </li>
            <li>
              <a href="#">{t('nav.consultation')}</a>
            </li>
            <li>
              <a href="#">{t('nav.contact')}</a>
            </li>
          </ul>
        </div>

        {/* Cột 3 - Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t('footer.support')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#">{t('footer.faqs')}</a>
            </li>
            <li>
              <a href="#">{t('auth.privacy_policy')}</a>
            </li>
            <li>
              <a href="#">{t('auth.terms_of_service')}</a>
            </li>
          </ul>
        </div>

        {/* Cột 4 - Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t('nav.contact')}</h3>
          <p className="text-sm">(+84) 334 999 999</p>
          <p className="text-sm">support@lawstand.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
