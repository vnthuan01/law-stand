import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  // CreditCard,
  // Smartphone,
  Banknote,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Phone,
  // Mail,
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCallbackProps {
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
  onPaymentSuccess: (paymentData: any) => void;
  onBackToPayment: () => void;
}

export const PaymentCallback: React.FC<PaymentCallbackProps> = ({
  appointmentId,
  appointment,
  onPaymentSuccess,
  onBackToPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'manual'>(
    'bank_transfer',
  );
  const [isProcessing, setIsProcessing] = useState(false);
  // const [bankDetails, setBankDetails] = useState({
  //   bankName: 'Vietcombank',
  //   accountNumber: '1234567890',
  //   accountHolder: 'Law Firm ABC',
  //   transferContent: `APPOINTMENT_${appointmentId}`,
  // });
  // const [cashDetails, setCashDetails] = useState({
  //   location: 'Law Firm Office - 123 Main Street, District 1, HCMC',
  //   contactPerson: 'Ms. Nguyen Thi A',
  //   phone: '0901234567',
  //   notes: 'Please bring exact amount and appointment confirmation',
  // });
  const [manualDetails, setManualDetails] = useState({
    reason: '',
    alternativeMethod: '',
    contactInfo: '',
    notes: '',
  });

  const handleBankTransfer = async () => {
    setIsProcessing(true);
    try {
      // Simulate bank transfer processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const paymentData = {
        appointmentId,
        amount: appointment.slot.service.price,
        currency: 'VND',
        paymentMethod: 'bank_transfer',
        status: 'pending',
        // bankDetails,
      };

      toast.success('Bank transfer details provided. Please complete the transfer.');
      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Bank transfer error:', error);
      toast.error('Failed to process bank transfer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate cash payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentData = {
        appointmentId,
        amount: appointment.slot.service.price,
        currency: 'VND',
        paymentMethod: 'cash',
        status: 'pending',
        // cashDetails,
      };

      toast.success('Cash payment arrangement confirmed.');
      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Cash payment error:', error);
      toast.error('Failed to arrange cash payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate manual payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const paymentData = {
        appointmentId,
        amount: appointment.slot.service.price,
        currency: 'VND',
        paymentMethod: 'manual',
        status: 'pending',
        manualDetails,
      };

      toast.success('Manual payment request submitted. We will contact you soon.');
      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Manual payment error:', error);
      toast.error('Failed to submit manual payment request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (paymentMethod) {
      case 'bank_transfer':
        handleBankTransfer();
        break;
      case 'cash':
        handleCashPayment();
        break;
      case 'manual':
        handleManualPayment();
        break;
      default:
        toast.error('Please select a payment method');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Alternative Payment Methods</h1>
        <p className="text-gray-600 mt-2">
          Choose an alternative payment method for your consultation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Appointment Summary
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
                <p className="text-sm text-gray-500">{appointment.slot.lawyer.email}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Client</span>
                <p className="font-medium">{appointment.user.fullName}</p>
                <p className="text-sm text-gray-500">{appointment.user.email}</p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total Amount</span>
                <span className="font-bold text-lg text-orange-600">
                  {(appointment.slot.service.price * 1.1).toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Alternative Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                    {paymentMethod === 'bank_transfer' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <Banknote className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Transfer to our bank account</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                    {paymentMethod === 'cash' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <Banknote className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Cash Payment</p>
                    <p className="text-sm text-gray-500">Pay in cash at our office</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'manual'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('manual')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                    {paymentMethod === 'manual' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Manual Arrangement</p>
                    <p className="text-sm text-gray-500">Contact us for custom payment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'bank_transfer' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Bank Transfer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bank:</span>
                    {/* <span className="font-medium">{bankDetails.bankName}</span> */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Number:</span>
                    {/* <span className="font-medium">{bankDetails.accountNumber}</span> */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Holder:</span>
                    {/* <span className="font-medium">{bankDetails.accountHolder}</span> */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Transfer Content:</span>
                    {/* <span className="font-medium">{bankDetails.transferContent}</span> */}
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Please include the transfer content exactly as shown above for faster
                    processing.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Cash Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <span className="text-green-700 font-medium">Contact Person:</span>
                      {/* <p className="font-medium">{cashDetails.contactPerson}</p> */}
                      {/* <p className="text-green-600">{cashDetails.phone}</p> */}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Banknote className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <span className="text-green-700 font-medium">Location:</span>
                      {/* <p className="font-medium">{cashDetails.location}</p> */}
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    {/* {cashDetails.notes} */}
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'manual' && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800">Manual Payment Request</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="reason">Reason for Manual Payment</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please explain why you need manual payment arrangement..."
                      value={manualDetails.reason}
                      onChange={(e) =>
                        setManualDetails((prev) => ({ ...prev, reason: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternativeMethod">Preferred Alternative Method</Label>
                    <Input
                      id="alternativeMethod"
                      placeholder="e.g., Installment, Different payment method..."
                      value={manualDetails.alternativeMethod}
                      onChange={(e) =>
                        setManualDetails((prev) => ({ ...prev, alternativeMethod: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactInfo">Best Contact Method</Label>
                    <Input
                      id="contactInfo"
                      placeholder="Phone number or email for contact..."
                      value={manualDetails.contactInfo}
                      onChange={(e) =>
                        setManualDetails((prev) => ({ ...prev, contactInfo: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      value={manualDetails.notes}
                      onChange={(e) =>
                        setManualDetails((prev) => ({ ...prev, notes: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onBackToPayment} className="flex-1">
                Back to Online Payment
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Confirm Payment Method'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
