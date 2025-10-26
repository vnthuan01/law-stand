import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookingStepOne } from './BookingStepOne';
import { BookingStepTwo } from './BookingStepTwo';
import { BookingStepThree } from './BookingStepThree';
import { BookingTimeline } from './BookingTimeline';
import { appointmentService } from '@/services/appointmentService';
import { toast } from 'sonner';

export const BookingFormSection = () => {
  const [step, setStep] = useState(1);
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  const [userInfo, setUserInfo] = useState({
    name: 'Alex',
    address: '155/1 Gia Kiệm',
    phone: '0375853406',
    email: 'vnthuan02@gmail.com',
    country: 'Việt Nam',
  });
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<any | null>(null);

  const handleConfirm = async () => {
    try {
      // Create appointment using the selected slot
      if (selectedSlot?.id) {
        const appointmentResponse = await appointmentService.create({
          slotId: selectedSlot.id,
        });

        if (appointmentResponse.data.success) {
          const appointment = appointmentResponse.data.data;
          setCreatedAppointment(appointment);
          toast.success('Appointment created successfully!');
          setStep(3);
        } else {
          toast.error('Failed to create appointment');
        }
      } else {
        toast.error('Please select a time slot');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };

  const handleCompletePayment = (paymentData: unknown) => {
    const finalPayload = {
      selectedDate,
      selectedSlot,
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
          <CardHeader className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4  "></CardHeader>

          {step === 1 && (
            <BookingStepOne
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <BookingStepTwo
              selectedSlot={selectedSlot}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onBack={() => setStep(1)}
              onConfirm={handleConfirm}
            />
          )}

          {step === 3 && (
            <BookingStepThree
              selectedSlot={selectedSlot}
              userInfo={userInfo}
              appointmentId={createdAppointment?.id}
              appointment={createdAppointment}
              onBack={() => setStep(2)}
              onComplete={handleCompletePayment}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
