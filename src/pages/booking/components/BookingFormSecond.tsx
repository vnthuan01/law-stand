import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookingStepOne } from './BookingStepOne';
import { BookingStepTwo } from './BookingStepTwo';
import { BookingStepThree } from './BookingStepThree';
import { BookingTimeline } from './BookingTimeline';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// demo services (có thể import từ constants/serviceData.ts)
const services = [
  {
    id: '01',
    title: 'Immigration & Work Permits',
    description: 'Help with visas, work permits, and residency applications',
  },
  {
    id: '02',
    title: 'Property & Inheritance Law',
    description: 'Property transactions, inheritance planning, and estate matters',
  },
  {
    id: '03',
    title: 'Family & Marriage Law',
    description: 'Divorce, custody, adoption, and family mediation services',
  },
  {
    id: '04',
    title: 'Business Setup & Tax',
    description: 'Company formation, tax planning, and business compliance',
  },
  {
    id: '05',
    title: 'Document Legalization & Notarization',
    description: 'Document authentication, notarization, and legal verification',
  },
  {
    id: '06',
    title: 'Dispute Resolution & Investment Consulting',
    description: 'Commercial disputes, arbitration, and investment law advice',
  },
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
  const [selectedHost, setSelectedHost] = useState<any | null>(null);

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
    const payloadData = payload as any;
    setSelectedHost(payloadData?.selectedHost || null);

    const finalPayload = {
      serviceId: serviceId ?? null,
      serviceTitle: serviceTitle ?? null,
      ...((payload as object) || {}),
    };
    console.log('Confirm payload:', finalPayload);
    setStep(3);
  };

  const handleCompletePayment = (paymentData: unknown) => {
    const finalPayload = {
      serviceId: serviceId ?? null,
      serviceTitle: serviceTitle ?? null,
      selectedDate,
      selectedTimeSlot,
      duration,
      selectedLocation,
      hostName: selectedHost?.name ?? null,
      userInfo,
      paymentData,
    };
    console.log('Complete booking payload:', finalPayload);
    // Here you would typically send the data to your backend API
    alert('Booking completed successfully!');
  };

  return (
    <div className="flex w-full flex-col items-center mt-8 mb-8 px-4 sm:mt-18 sm:mb-18 sm:px-0">
      {/* Timeline */}
      <BookingTimeline currentStep={step} />

      <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-md">
        <CardContent className="p-4 sm:p-6">
          <CardHeader className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4  ">
            <div className="flex items-center justify-between w-full sm:w-auto">
              {/* Label mờ hơn */}
              <span className="text-sm text-gray-400 mx-2">Service choosed:</span>

              <div className="flex items-center gap-2">
                <h2
                  className={`text-lg sm:text-xl text-orange-500 font-semibold ${
                    step < 3 ? 'cursor-pointer hover:text-orange-600 transition-colors' : ''
                  }`}
                  onClick={() => step < 3 && setIsDialogOpen(true)}
                >
                  {serviceTitle || 'Select your needed service'}
                </h2>

                {step < 3 && <span className="text-xs text-gray-400 sm:hidden">Tap to change</span>}
              </div>
            </div>

            {step < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="hidden sm:flex"
              >
                Change Service
              </Button>
            )}
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

          {step === 3 && (
            <BookingStepThree
              serviceTitle={serviceTitle}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              duration={duration}
              selectedLocation={selectedLocation}
              hostName={selectedHost?.name}
              userInfo={userInfo}
              onBack={() => setStep(2)}
              onComplete={handleCompletePayment}
            />
          )}
        </CardContent>
      </Card>

      {/* Service selection dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-[calc(100vw-2rem)] sm:w-full sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Select a Service</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-2 max-h-96 overflow-y-auto">
            {services.map((svc) => (
              <Button
                key={svc.id}
                variant="outline"
                onClick={() => {
                  setServiceId(svc.id);
                  setServiceTitle(svc.title);
                  setIsDialogOpen(false);
                }}
                className={`justify-start text-left h-auto py-4 px-4 ${
                  svc.id === serviceId ? 'border-orange-500 text-orange-600 bg-orange-50' : ''
                }`}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm sm:text-base font-medium">{svc.title}</span>
                  <span className="text-xs text-gray-500 mt-1">{svc.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
