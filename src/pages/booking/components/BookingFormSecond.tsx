import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookingStepOne } from './BookingStepOne';
import { BookingStepTwo } from './BookingStepTwo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// demo services (có thể import từ constants/serviceData.ts)
const services = [
  { id: '01', title: 'Immigration & Work Permits' },
  { id: '02', title: 'Property & Inheritance Law' },
  { id: '03', title: 'Family & Marriage Law' },
  { id: '04', title: 'Business Setup & Tax' },
  { id: '05', title: 'Document Legalization & Notarization' },
  { id: '06', title: 'Dispute Resolution & Investment Consulting' },
];

export const BookingFormSection = () => {
  const [step, setStep] = useState(1);
  const today = new Date();
  const location = useLocation();
  const { serviceId: initialServiceId, serviceTitle: initialServiceTitle } =
    (location.state as { serviceId?: string; serviceTitle?: string } | null) || {};

  const [serviceId, setServiceId] = useState<string | null>(initialServiceId ?? null);
  const [serviceTitle, setServiceTitle] = useState<string | null>(initialServiceTitle ?? null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [locations] = useState<{ name: string }[]>([{ name: 'Zoom' }, { name: 'GG Meet' }]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState({
    name: 'Alex',
    address: '155/1 Gia Kiệm',
    phone: '0375853406',
    email: 'vnthuan02@gmail.com',
    country: 'Việt Nam',
  });
  const [agree, setAgree] = useState(false);

  const timeSlots = [
    '7:00AM - 8:00AM',
    '8:00AM - 9:30AM',
    '9:00AM - 10:00AM',
    '9:30AM - 10:30AM',
    '10:00AM - 11:00AM',
    '10:30AM - 11:30AM',
    '11:00AM - 12:00PM',
    '1:00PM - 2:00PM',
    '1:30PM - 2:30PM',
    '2:30PM - 3:30PM',
    '3:30PM - 4:30PM',
  ];

  const handleConfirm = (payload: unknown) => {
    const finalPayload = {
      serviceId: serviceId ?? null,
      serviceTitle: serviceTitle ?? null,
      ...((payload as object) || {}),
    };
    console.log('Confirm payload:', finalPayload);
  };

  return (
    <div className="flex w-full justify-center mt-18 mb-18">
      <Card className="max-w-screen-md w-[768px] bg-white rounded-2xl shadow-md">
        <CardContent className="p-6">
          <CardHeader className="w-full flex justify-between items-center">
            {serviceTitle ? (
              <h2 className="text-xl text-orange-500 font-semibold">{serviceTitle}</h2>
            ) : (
              'Appointment Booking'
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="ml-2"
            >
              Change Service
            </Button>
          </CardHeader>

          {step === 1 && (
            <BookingStepOne
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTimeSlot={selectedTimeSlot}
              setDuration={setDuration}
              setSelectedTimeSlot={setSelectedTimeSlot}
              timeSlots={timeSlots}
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <BookingStepTwo
              serviceId={serviceId}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              duration={duration}
              selectedLocation={selectedLocation}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              agree={agree}
              setAgree={setAgree}
              onBack={() => setStep(1)}
              onConfirm={handleConfirm}
            />
          )}
        </CardContent>
      </Card>

      {/* Service selection dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select a Service</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {services.map((svc) => (
              <Button
                key={svc.id}
                variant="outline"
                onClick={() => {
                  setServiceId(svc.id);
                  setServiceTitle(svc.title);
                  setIsDialogOpen(false);
                }}
                className={`justify-start ${
                  svc.id === serviceId ? 'border-orange-500 text-orange-600' : ''
                }`}
              >
                {svc.title}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
