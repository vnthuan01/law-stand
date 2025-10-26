import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Smartphone, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { PaymentPage } from './PaymentPage';
import { PaymentCallback } from './PaymentCallback';
import type { Slot } from '@/services/slotService';

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

export const BookingStepThree = ({
  serviceTitle,
  selectedSlot,
  userInfo,
  appointmentId,
  appointment,
  onBack,
  onComplete,
}: BookingStepThreeProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState(userInfo?.name || '');
  const [saveCard, setSaveCard] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showPaymentFallback, setShowPaymentFallback] = useState(false);

  // Mock pricing - in real app this would come from API
  const basePrice = 150;
  const taxRate = 0.1;
  const tax = basePrice * taxRate;
  const total = basePrice + tax;

  const handleCompletePayment = () => {
    if (!termsAccepted) return;

    const paymentData = {
      paymentMethod,
      cardDetails:
        paymentMethod === 'card'
          ? {
              cardNumber: cardNumber.replace(/\s/g, ''),
              expiryDate,
              cvv,
              cardHolderName,
              saveCard,
            }
          : null,
      amount: total,
      currency: 'USD',
    };

    onComplete(paymentData);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    onComplete(paymentData);
  };

  const handlePaymentFailure = () => {
    setShowPaymentFallback(true);
  };

  const handleBackToPayment = () => {
    setShowPaymentFallback(false);
  };

  // Show payment page if appointment is created
  if (appointmentId && appointment && showPaymentPage) {
    return (
      <PaymentPage
        appointmentId={appointmentId}
        appointment={appointment}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    );
  }

  // Show payment fallback if needed
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-slate-50 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium">{serviceTitle || 'Legal Consultation'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">
                {new Date(selectedSlot?.date || '').toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                at {selectedSlot?.startTime} - {selectedSlot?.endTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">
                {selectedSlot?.service?.price
                  ? `${selectedSlot?.service?.price.toLocaleString('vi-VN')} VND`
                  : 'Free'}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium">{selectedSlot?.service?.name || 'To be assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lawyer</p>
              <p className="font-medium">{selectedSlot?.lawyer?.fullName || 'To be assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">
                {userInfo?.name} ({userInfo?.email})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                <CreditCard className="w-5 h-5" />
                <span>Credit/Debit Card</span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Smartphone className="w-5 h-5" />
                <span>Digital Wallet</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Card Details */}
      {paymentMethod === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Card Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardHolderName">Cardholder Name</Label>
              <Input
                id="cardHolderName"
                placeholder="John Doe"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveCard"
                checked={saveCard}
                onCheckedChange={(checked) => setSaveCard(checked as boolean)}
              />
              <Label htmlFor="saveCard" className="text-sm">
                Save card for future payments
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Consultation Fee</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800">Secure Payment</p>
          <p className="text-sm text-green-700">
            Your payment information is encrypted and secure. We use industry-standard SSL
            encryption to protect your data.
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm cursor-pointer">
          I agree to the{' '}
          <a href="#" className="text-orange-600 hover:underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-orange-600 hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center justify-center space-x-2 order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div className="flex gap-2 order-1 sm:order-2">
          {appointmentId && appointment && (
            <Button
              onClick={() => setShowPaymentPage(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Pay with PayOS
            </Button>
          )}
          <Button
            onClick={handleCompletePayment}
            disabled={
              !termsAccepted ||
              (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardHolderName))
            }
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8"
          >
            Complete Payment - ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};
