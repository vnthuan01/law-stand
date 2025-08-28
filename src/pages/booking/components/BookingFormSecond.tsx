import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookingStepOne } from './BookingStepOne';
import { BookingStepTwo } from './BookingStepTwo';

export const BookingFormSection = () => {
  const [step, setStep] = useState(1);
  const today = new Date();
  const location = useLocation();
  const { serviceId, serviceTitle } =
    (location.state as { serviceId?: string; serviceTitle?: string } | null) || {};

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
    '7:00am - 8:00am',
    '8:00am - 9:30am',
    '9:00am - 10:00am',
    '9:30am - 10:30am',
    '10:00am - 11:00am',
    '10:30am - 11:30am',
    '11:00am - 12:00pm',
    '1:00pm - 2:00pm',
    '1:30pm - 2:30pm',
    '2:30pm - 3:30pm',
    '3:30pm - 4:30pm',
  ];

  const handleConfirm = (payload: unknown) => {
    const finalPayload = {
      serviceId: serviceId ?? null,
      ...((payload as object) || {}),
    };
    console.log('Confirm payload:', finalPayload);
    // setStep(1) // optionally reset
  };

  return (
    <div className="flex w-full justify-center mt-18 mb-18">
      <Card className="max-w-screen-md w-[768px] bg-white rounded-2xl shadow-md">
        <CardContent className="p-6">
          <CardHeader className="w-full flex justify-center ">
            {serviceTitle ? (
              <h2 className="text-xl text-orange-500 font-semibold ">{serviceTitle}</h2>
            ) : (
              'Appointment Booking'
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
        </CardContent>
      </Card>
    </div>
  );
};
