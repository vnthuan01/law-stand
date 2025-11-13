import { useState, useEffect, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { CreditCard, Smartphone, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

import { PaymentPage } from './PaymentPage';
import { PaymentCallback } from './PaymentCallback';
import type { Slot } from '@/services/slotService';
import { usePayment } from '@/hooks/usePayment'; // hook payment

interface BookingStepThreeProps {
  serviceTitle?: string | null;
  selectedSlot?: Slot;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
  };
  appointmentId?: string;
  appointment?: any;
  onBack: () => void;
  onComplete: (paymentData: unknown) => void;
}

// export const BookingStepThree = ({
//   serviceTitle,
//   selectedSlot,
//   userInfo,
//   appointmentId,
//   appointment,
//   onBack,
//   onComplete,
// }: BookingStepThreeProps) => {
//   const { t } = useTranslation();
//   const { createPayment, handleWebhook, handleReturn, payments, refetchPayments } = usePayment();

//   const [paymentMethod, setPaymentMethod] = useState<string>('card');
//   const [showPaymentPage, setShowPaymentPage] = useState(false);
//   const [showPaymentFallback, setShowPaymentFallback] = useState(false);
//   const [currentPayment, setCurrentPayment] = useState<any>(null);
//   const [loadingPayment, setLoadingPayment] = useState(false);

//   useEffect(() => {
//     if (!appointmentId) return;

//     const createPaymentLink = async () => {
//       try {
//         setLoadingPayment(true);
//         const res = await createPayment({
//           appointmentId,
//           returnUrl: `${window.location.origin}/payment/return`,
//           cancelUrl: `${window.location.origin}/payment/cancel`,
//         });
//         setCurrentPayment(res.data); // lưu checkoutUrl, qrCode, etc
//         setShowPaymentPage(true);
//       } catch (error) {
//         console.error('Failed to create payment:', error);
//         setShowPaymentFallback(true);
//       } finally {
//         setLoadingPayment(false);
//       }
//     };

//     createPaymentLink();
//   }, [appointmentId]);

//   const handlePaymentSuccess = (paymentData: any) => {
//     // Callback thành công
//     refetchPayments(); // tự động refetch danh sách payment
//     onComplete(paymentData);
//   };

//   const handlePaymentFailure = () => {
//     setShowPaymentFallback(true);
//   };

//   const handleBackToPayment = () => {
//     setShowPaymentFallback(false);
//   };

//   if (appointmentId && appointment && showPaymentPage && currentPayment) {
//     return (
//       <PaymentPage
//         appointmentId={appointmentId}
//         appointment={appointment}
//         payment={currentPayment}
//         onPaymentSuccess={handlePaymentSuccess}
//         onPaymentFailure={handlePaymentFailure}
//       />
//     );
//   }

//   if (appointmentId && appointment && showPaymentFallback) {
//     return (
//       <PaymentCallback
//         appointmentId={appointmentId}
//         appointment={appointment}
//         onPaymentSuccess={handlePaymentSuccess}
//         onBackToPayment={handleBackToPayment}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* ...phần UI booking summary, card input, payment method, summary giống component cũ */}
//       <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 gap-4">
//         <Button variant="outline" onClick={onBack}>
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back</span>
//         </Button>
//         <Button
//           onClick={() => setShowPaymentPage(true)}
//           disabled={loadingPayment}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8"
//         >
//           <CheckCircle className="w-4 h-4 mr-2" />
//           Pay with PayOS
//         </Button>
//       </div>
//     </div>
//   );
// };

export const BookingStepThree = ({
  // serviceTitle,
  // selectedSlot,
  // userInfo,
  appointmentId,
  appointment,
  onBack,
  onComplete,
}: BookingStepThreeProps) => {
  // const { t } = useTranslation();
  const { createPayment, refetchPayments } = usePayment();

  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showPaymentFallback, setShowPaymentFallback] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<any>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const createPaymentLink = useCallback(async () => {
    if (!appointmentId) return;
    try {
      setLoadingPayment(true);
      const res = await createPayment({
        appointmentId,
        returnUrl: `${window.location.origin}/payment/return`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });
      setCurrentPayment(res.data);
      setShowPaymentPage(true);
    } catch (error) {
      console.error('Failed to create payment:', error);
      setShowPaymentFallback(true);
    } finally {
      setLoadingPayment(false);
    }
  }, [appointmentId, createPayment]);

  useEffect(() => {
    createPaymentLink();
  }, [createPaymentLink]);

  const handlePaymentSuccess = (paymentData: any) => {
    refetchPayments(); // tự động refetch danh sách payment
    onComplete(paymentData);
  };

  const handlePaymentFailure = () => {
    setShowPaymentFallback(true);
  };

  const handleBackToPayment = () => {
    setShowPaymentFallback(false);
  };

  // ==== Chỉ hiển thị PayOS
  if (appointmentId && appointment && showPaymentPage && currentPayment) {
    return (
      <PaymentPage
        appointmentId={appointmentId}
        appointment={appointment}
        // payment prop dùng để truyền checkout info từ server
        // payment={currentPayment}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    );
  }

  if (appointmentId && appointment && showPaymentFallback) {
    return (
      <PaymentCallback
        appointmentId={appointmentId}
        appointment={appointment}
        onPaymentSuccess={handlePaymentSuccess}
        onBackToPayment={handleBackToPayment}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* UI Booking summary vẫn giữ nguyên */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button
          onClick={() => setShowPaymentPage(true)}
          disabled={loadingPayment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Pay with PayOS
        </Button>
      </div>
    </div>
  );
};
