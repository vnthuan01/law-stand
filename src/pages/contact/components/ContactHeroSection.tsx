import { useTranslation } from 'react-i18next';
import ContactHeroImage from '@/assets/images/img9.jpg';
export default function ContactHeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative w-full aspect-[16/9] h-[400px] bg-black">
      <img
        src={ContactHeroImage}
        alt="Contact background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 block"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-6xl font-bold">{t('contact.title')}</h1>
      </div>
    </section>
  );
}
