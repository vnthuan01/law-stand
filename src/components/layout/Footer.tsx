import React from 'react';
import logo from '@/assets/law-firm-logo.png';
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Cột 1 - Logo + About */}
        <div>
          <div className="flex items-center mb-4">
            <img src={logo} alt="Lawstand Logo" className="h-10 w-auto mr-2" />
            <span className="text-xl font-bold text-white">Lawstand</span>
          </div>
          <p className="text-sm">
            Providing legal consultation with accountability & transparency.
          </p>
        </div>

        {/* Cột 2 - Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Resources</a>
            </li>
            <li>
              <a href="#">Consultation</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>

        {/* Cột 3 - Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Cột 4 - Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-sm">(+84) 334 999 999</p>
          <p className="text-sm">support@lawstand.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
