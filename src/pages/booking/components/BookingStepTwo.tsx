import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BookingStepTwoProps {
  selectedSlot: any;
  userInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
  };
  setUserInfo: (info: any) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const BookingStepTwo = ({
  selectedSlot,
  userInfo,
  setUserInfo,
  onBack,
  onConfirm,
}: BookingStepTwoProps) => {
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Please review and update your contact details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Appointment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">
                    {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.startTime)} -{' '}
                    {formatTime(selectedSlot.endTime)}
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedSlot.service?.name || 'Legal Consultation'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">
                    {selectedSlot.lawyer?.fullName || 'Available Lawyer'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedSlot.lawyer?.email || 'lawyer@example.com'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Consultation Fee</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {selectedSlot.service?.price
                      ? `${selectedSlot.service.price.toLocaleString('vi-VN')} VND`
                      : 'Free'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={userInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country *
                </Label>
                <Input
                  id="country"
                  value={userInfo.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter your country"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Textarea
                id="address"
                value={userInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your full address"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Please ensure all information is accurate as it will be used
                for your appointment confirmation and communication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Time Selection
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!userInfo.name || !userInfo.email || !userInfo.phone}
          className="px-8 py-3 text-lg"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};
