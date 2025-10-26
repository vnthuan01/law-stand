// components/ServicesSection.tsx
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ServiceImage01 from '@/assets/images/workpermits.jpg';
import ServiceImage02 from '@/assets/images/inheritance.png';
import ServiceImage03 from '@/assets/images/marriage.jpg';
import ServiceImage04 from '@/assets/images/tax.jpeg';
import ServiceImage05 from '@/assets/images/document.jpg';
import ServiceImage06 from '@/assets/images/consulting.jpg';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  desc: string;
  image: string;
}

const getServices = (t: (key: string) => string): ServiceItem[] => [
  {
    id: '01',
    number: '01',
    title: t('services.immigration'),
    desc: t('services.immigration_desc'),
    image: ServiceImage01,
  },
  {
    id: '02',
    number: '02',
    title: t('services.property'),
    desc: t('services.property_desc'),
    image: ServiceImage02,
  },
  {
    id: '03',
    number: '03',
    title: t('services.family'),
    desc: t('services.family_desc'),
    image: ServiceImage03,
  },
  {
    id: '04',
    number: '04',
    title: t('services.business'),
    desc: t('services.business_desc'),
    image: ServiceImage04,
  },
  {
    id: '05',
    number: '05',
    title: t('services.document'),
    desc: t('services.document_desc'),
    image: ServiceImage05,
  },
  {
    id: '06',
    number: '06',
    title: t('services.dispute'),
    desc: t('services.dispute_desc'),
    image: ServiceImage06,
  },
];

export default function ServicesSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const services = getServices(t);

  const handleOpenDetail = useCallback((service: ServiceItem) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  }, []);

  const handleBooking = useCallback(
    (svc: ServiceItem) => {
      navigate('/booking', { state: { serviceId: svc.id, serviceTitle: svc.title } });
    },
    [navigate],
  );

  const handleContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">{t('services.title')}</span>{' '}
            {t('home.services_title')}
          </h2>
          <p className="text-gray-600">{t('home.services_subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <div
                className="flex-1 flex flex-col justify-between cursor-pointer"
                onClick={() => handleOpenDetail(service)}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-500 font-bold text-lg">{service.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
                <div className="aspect-[4/3] w-full mt-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <button
          onClick={() => navigate('/resources')}
          className={cn(
            'mt-10 mx-auto flex justify-center items-center cursor-pointer px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm',
          )}
        >
          {t('home.view_more')}
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedService?.title ?? t('home.service_detail')}</DialogTitle>
              {selectedService?.desc ? (
                <DialogDescription>{selectedService.desc}</DialogDescription>
              ) : null}
            </DialogHeader>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{t('home.service_detail_desc')}</p>
            </div>
            <DialogFooter className="gap-2 sm:gap-3">
              <Button
                type="button"
                onClick={() => selectedService && handleBooking(selectedService)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {t('home.booking_appointment')}
              </Button>
              <Button type="button" variant="outline" onClick={handleContact}>
                {t('nav.contact')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
