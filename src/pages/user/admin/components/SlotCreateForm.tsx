import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomCalendar from '@/components/ui/customCalendar';
import TimePicker from '@/components/ui/timePicker';
import { Loader2, Plus, Calendar, Clock, User, Briefcase } from 'lucide-react';
import type { CreateSlotPayload } from '@/services/slotService';

interface SlotCreateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateSlotPayload) => Promise<void>;
  isCreating: boolean;
  servicesData?: any[];
  lawyersData?: any[];
  selectedLawyerId?: string;
}

export function SlotCreateForm({
  isOpen,
  onClose,
  onCreate,
  isCreating,
  servicesData,
  lawyersData,
  selectedLawyerId,
}: SlotCreateFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateSlotPayload & { date: Date | string }>({
    serviceId: '',
    lawyerId: selectedLawyerId || '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format data chuẩn cho backend
      const formattedData = {
        serviceId: formData.serviceId,
        lawyerId: formData.lawyerId,
        date:
          formData.date instanceof Date
            ? formData.date.toISOString().split('T')[0] // YYYY-MM-DD format
            : formData.date,
        startTime: formData.startTime ? `${formData.startTime}:00.0000000` : '', // HH:mm:ss.fffffff
        endTime: formData.endTime ? `${formData.endTime}:00.0000000` : '', // HH:mm:ss.fffffff
      };

      // Validation
      if (
        !formattedData.serviceId ||
        !formattedData.lawyerId ||
        !formattedData.date ||
        !formattedData.startTime ||
        !formattedData.endTime
      ) {
        console.error('Missing required fields:', formattedData);
        return;
      }

      console.log('Formatted data for backend:', formattedData);
      await onCreate(formattedData);
      onClose();
      // Reset form
      setFormData({
        serviceId: '',
        lawyerId: selectedLawyerId || '',
        date: '',
        startTime: '',
        endTime: '',
      });
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      serviceId: '',
      lawyerId: selectedLawyerId || '',
      date: '',
      startTime: '',
      endTime: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('admin.create_slot')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service & Lawyer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t('admin.basic_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Service */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t('admin.service')} *</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.select_service')} />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesData?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{service.name}</span>
                            <span className="text-sm text-gray-500 ml-2">${service.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lawyer */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t('admin.lawyer')} *</Label>
                  <Select
                    value={formData.lawyerId}
                    onValueChange={(value) => setFormData({ ...formData, lawyerId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.select_lawyer')} />
                    </SelectTrigger>
                    <SelectContent>
                      {lawyersData?.map((lawyer) => (
                        <SelectItem key={lawyer.id} value={lawyer.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{lawyer.fullName}</span>
                            <span className="text-sm text-gray-500">({lawyer.email})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('admin.schedule_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date */}
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('common.date')} *</Label>
                <CustomCalendar
                  value={
                    formData.date instanceof Date
                      ? formData.date
                      : formData.date
                        ? new Date(formData.date)
                        : undefined
                  }
                  onChange={(date) => {
                    if (date) {
                      setFormData({ ...formData, date: date }); // Store as Date object
                    }
                  }}
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('admin.start_time')} *
                  </Label>
                  <TimePicker
                    value={formData.startTime ? `${formData.startTime}:00.0000000` : undefined}
                    onChange={(timeString: string) => {
                      const timeOnly = timeString.split(':').slice(0, 2).join(':'); // Extract HH:mm
                      setFormData({ ...formData, startTime: timeOnly });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('admin.end_time')} *
                  </Label>
                  <TimePicker
                    value={formData.endTime ? `${formData.endTime}:00.0000000` : undefined}
                    onChange={(timeString: string) => {
                      const timeOnly = timeString.split(':').slice(0, 2).join(':'); // Extract HH:mm
                      setFormData({ ...formData, endTime: timeOnly });
                    }}
                  />
                </div>
              </div>

              {/* Time Validation */}
              {formData.startTime && formData.endTime && formData.startTime >= formData.endTime && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">{t('admin.time_validation_error')}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <DialogFooter className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                isCreating ||
                !formData.serviceId ||
                !formData.lawyerId ||
                !formData.date ||
                !formData.startTime ||
                !formData.endTime ||
                formData.startTime >= formData.endTime
              }
              className="min-w-[120px]"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.creating')}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('common.create')}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
