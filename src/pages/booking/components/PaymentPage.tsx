import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { usePayment } from '@/hooks/usePayment'; // hook payment mới

interface PaymentPageProps {
  appointmentId: string;
  appointment: {
    id: string;
    status: string;
    createdAt: string;
    user: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    slot: {
      date: string;
      startTime: string;
      endTime: string;
      service: {
        name: string;
        price: number;
      };
      lawyer: {
        fullName: string;
        email: string;
        phoneNumber: string;
      };
    };
  };
  // payment: any;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentFailure: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  appointmentId,
  appointment,
  // payment,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const { createPayment } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState<'payos' | 'card' | 'wallet'>('payos');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayOSPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await createPayment({
        appointmentId,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });
      toast.success('Payment initiated successfully!');
      onPaymentSuccess(res);
    } catch (err) {
      console.error(err);
      toast.error('Payment failed. Please try again.');
      onPaymentFailure();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (paymentMethod) {
      case 'payos':
        handlePayOSPayment();
        break;
      case 'card':
        toast.error('Card payment is not implemented yet.');
        break;
      case 'wallet':
        toast.error('Wallet payment is not implemented yet.');
        break;
      default:
        toast.error('Please select a payment method');
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (timeString: string) =>
    new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
        <p className="text-gray-600 mt-2">Secure payment for your legal consultation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Appointment ID</span>
              <Badge variant="outline">{appointmentId}</Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Service</span>
                <p className="font-medium">{appointment.slot.service.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date & Time</span>
                <p className="font-medium">
                  {formatDate(appointment.slot.date)} at {formatTime(appointment.slot.startTime)} -{' '}
                  {formatTime(appointment.slot.endTime)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Lawyer</span>
                <p className="font-medium">{appointment.slot.lawyer.fullName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Client</span>
                <p className="font-medium">{appointment.user.fullName}</p>
                <p className="text-sm text-gray-500">{appointment.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'payos'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('payos')}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <p className="font-medium">PayOS Payment</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-medium">
                  {appointment.slot.service.price.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">
                  {(appointment.slot.service.price * 0.1).toLocaleString('vi-VN')} VND
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-lg text-blue-600">
                  {(appointment.slot.service.price * 1.1).toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Secure Payment</p>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                `Pay ${(appointment.slot.service.price * 1.1).toLocaleString('vi-VN')} VND`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
