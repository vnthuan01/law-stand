'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { slotService, type Slot } from '@/services/slotService';
import { serviceService } from '@/services/serviceService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BookingStepOneProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;
  onNext: () => void;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const BookingStepOne = ({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  onNext,
}: BookingStepOneProps) => {
  const { t } = useTranslation();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate date range for next 7 days
  const getDateRange = () => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);

    return {
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  // Fetch services on component mount
  useEffect(() => {
    setIsLoadingServices(true);
    serviceService
      .getAll()
      .then((response) => {
        if (response.data.success) {
          setServices(response.data.data || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      })
      .finally(() => {
        setIsLoadingServices(false);
      });
  }, []);

  // Fetch available slots when service is selected
  useEffect(() => {
    if (selectedServiceId) {
      setIsLoadingSlots(true);
      const { startDate, endDate } = getDateRange();

      slotService
        .getAvailable({
          serviceId: selectedServiceId,
          lawyerId: '',
          startDate,
          endDate,
        })
        .then((response) => {
          if (response.data.success) {
            setAvailableSlots(response.data.data || []);
          }
        })
        .catch((error) => {
          console.error('Error fetching available slots:', error);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedServiceId]);

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNext) onNext();
  };

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

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('booking.stepOne.title')}</h2>
        <p className="text-gray-600 mt-2">{t('booking.stepOne.description')}</p>
      </div>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            {t('booking.stepOne.selectService')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {t('booking.stepOne.chooseService')}
              </label>
              {isLoadingServices ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('booking.stepOne.selectServicePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex flex-row gap-4 items-start w-full">
                          <span className="font-medium text-purple-600 text-sm">
                            {service.name}
                          </span>
                          -<span className="text-sm text-orange-600">{service.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {selectedServiceId && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    {t('booking.stepOne.selected')}:{' '}
                    {services.find((s) => s.id === selectedServiceId)?.name}
                  </span>
                </div>
                <p className="text-sm text-purple-600 mt-1">
                  {services.find((s) => s.id === selectedServiceId)?.description}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {t('common.price')}:{' '}
                  {services.find((s) => s.id === selectedServiceId)?.price.toLocaleString('vi-VN')}{' '}
                  VND
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedServiceId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {t('booking.stepOne.selectDate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium">
                  {selectedDate
                    ? selectedDate.toLocaleDateString('en-GB', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : t('booking.stepOne.pleaseSelectDate')}
                </p>
              </div>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                className="rounded-md border p-3 bg-white text-primary shadow-sm"
              />
            </CardContent>
          </Card>

          {/* Available Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                {t('booking.stepOne.availableTimeSlots')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Slots Summary */}
              {availableSlots.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {availableSlots.length} {t('booking.stepOne.availableSlots')}
                      </span>
                    </div>
                    {selectedDate && (
                      <span className="text-xs text-blue-600">
                        {t('booking.stepOne.filteredBy')} {selectedDate.toLocaleDateString('en-GB')}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <ScrollArea className="h-80 w-full">
                <div className="space-y-3">
                  {isLoadingSlots ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 w-full" />
                    ))
                  ) : availableSlots.length > 0 ? (
                    // Available slots from API
                    availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <div
                          key={slot.id}
                          className={cn(
                            'p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300',
                          )}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                                {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </p>
                                <p className="text-sm text-gray-500">{formatDate(slot.date)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {slot.service?.name || t('booking.stepOne.legalConsultation')}
                              </p>
                              <p className="text-sm text-gray-500">
                                {slot.lawyer?.fullName || t('booking.stepOne.availableLawyer')}
                              </p>
                              <p className="text-xs text-green-600 font-medium">
                                {slot.service?.price
                                  ? `${slot.service.price.toLocaleString('vi-VN')} VND`
                                  : t('common.free')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>{t('booking.stepOne.noAvailableSlots')}</p>
                      <p className="text-sm mt-2">{t('booking.stepOne.tryDifferentService')}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">
                  {t('booking.stepOne.selectedAppointment')}
                </h3>
                <p className="text-sm text-green-700">
                  {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.startTime)} -{' '}
                  {formatTime(selectedSlot.endTime)}
                </p>
                <p className="text-sm text-green-600">
                  {selectedSlot.service?.name} {t('booking.stepOne.with')}{' '}
                  {selectedSlot.lawyer?.fullName}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {selectedSlot.service?.price
                  ? `${selectedSlot.service.price.toLocaleString('vi-VN')} VND`
                  : t('common.free')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          disabled={!selectedServiceId || !selectedDate || !selectedSlot}
          onClick={handleNext}
          className="px-8 py-3 text-lg"
        >
          {t('booking.stepOne.continueToPersonalInfo')}
        </Button>
      </div>
    </div>
  );
};
