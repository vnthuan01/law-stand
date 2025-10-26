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
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Loader2, Calendar, Clock, User, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Slot } from '@/services/slotService';

interface SlotEditFormProps {
  slot: Slot;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (slotId: string, data: { status: string }) => Promise<void>;
  isUpdating: boolean;
}

export function SlotEditForm({ slot, isOpen, onClose, onUpdate, isUpdating }: SlotEditFormProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(slot.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(slot.id, { status });
      onClose();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'booked':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('admin.edit_slot')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Slot Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t('admin.slot_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">{t('admin.service')}</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{slot.service?.name || slot.serviceId}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">{t('admin.lawyer')}</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{slot.lawyer?.fullName || slot.lawyerId}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">{t('common.date')}</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {format(new Date(slot.date), 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">{t('common.time')}</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update - Priority Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{t('admin.update_status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('common.status')}</Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{t('admin.current_status')}:</span>
                  <Badge variant={getStatusBadgeVariant(slot.status) as BadgeProps['variant']}>
                    {t(`admin.${slot.status}`)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">{t('admin.new_status')}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {t('admin.available')}
                      </div>
                    </SelectItem>
                    <SelectItem value="booked">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        {t('admin.booked')}
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {t('admin.cancelled')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status !== slot.status && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {t('admin.status_change_preview')}: {t(`admin.${slot.status}`)} →{' '}
                      {t(`admin.${status}`)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <DialogFooter className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || status === slot.status}
              className="min-w-[120px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.updating')}
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {t('common.update')}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
