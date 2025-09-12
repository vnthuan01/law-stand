// components/ServicesSection.tsx
import { useState, useCallback } from 'react';
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

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  desc: string;
}

const services: ServiceItem[] = [
  {
    id: '01',
    number: '01',
    title: 'Immigration & Work Permits',
    desc: 'Expert guidance through visa and work permit processes',
  },
  {
    id: '02',
    number: '02',
    title: 'Property & Inheritance Law',
    desc: 'Secure your property rights and inheritance matters',
  },
  {
    id: '03',
    number: '03',
    title: 'Family & Marriage Law',
    desc: 'Professional support for family legal matters',
  },
  {
    id: '04',
    number: '04',
    title: 'Business Setup & Tax',
    desc: 'Complete business registration and tax compliance',
  },
  {
    id: '05',
    number: '05',
    title: 'Document Legalization & Notarization',
    desc: 'Official document authentication services',
  },
  {
    id: '06',
    number: '06',
    title: 'Dispute Resolution & Investment Consulting',
    desc: 'Legal dispute resolution and investment advice',
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

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
            <span className="text-orange-500">Legal</span> Main services.
          </h2>
          <p className="text-gray-600">Complete legal solutions for your needs</p>
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
                <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mt-4"></div>
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
          View More
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedService?.title ?? 'Service Detail'}</DialogTitle>
              {selectedService?.desc ? (
                <DialogDescription>{selectedService.desc}</DialogDescription>
              ) : null}
            </DialogHeader>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                We provide comprehensive consultation tailored to your needs. Choose an action below
                to continue.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-3">
              <Button
                type="button"
                onClick={() => selectedService && handleBooking(selectedService)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Booking Appointment
              </Button>
              <Button type="button" variant="outline" onClick={handleContact}>
                Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
