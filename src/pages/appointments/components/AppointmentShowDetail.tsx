import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { type AppointmentDetail } from '@/services/appointmentService';
import { useTranslation } from 'react-i18next';

import { CustomerInfo } from './CustomerInfo';
import { LawyerInfo } from './LawyerInfo';
import { ServiceInfo } from './ServiceInfo';
import { BookingInfo } from './BookingInfo';
import { PlanningSchedule } from './PlanningSchedule';

interface AppointmentDialogProps {
  appointment: AppointmentDetail | null;
  role: 'User' | 'Lawyer';
  onClose: () => void;
  onReschedule?: (apt: AppointmentDetail, newDate: Date) => void;
  onCancel?: (apt: AppointmentDetail, reason: string) => void;
  onDelete?: (apt: AppointmentDetail) => void;
  onApprove?: (apt: AppointmentDetail) => void;
  onFinish?: (apt: AppointmentDetail) => void;
}

export default function AppointmentDialog({
  appointment,
  role,
  onClose,
  onReschedule,
  onCancel,
  onDelete,
  onApprove,
  onFinish,
}: AppointmentDialogProps) {
  const { t } = useTranslation();
  const [cancelReason, setCancelReason] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (!appointment) return null;

  return (
    <TooltipProvider>
      <Dialog open={!!appointment} onOpenChange={onClose}>
        <DialogContent className="!w-[95vw] !max-w-[90vw] !h-[95vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between mb-2">
            <div>
              <DialogTitle className="text-lg font-semibold">
                {t('appointments.dialog.title')}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">ID #{appointment.id}</p>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CustomerInfo appointment={appointment} />
                <ServiceInfo appointment={appointment} />
                <PlanningSchedule appointment={appointment} />
              </div>

              <div className="space-y-6">
                <LawyerInfo appointment={appointment} />
                <BookingInfo appointment={appointment} />

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">{t('common.actions')}</h4>

                  <div className="flex flex-col gap-2">
                    {role === 'User' && appointment.status !== 'Cancelled' && (
                      <>
                        {onReschedule && (
                          <Popover open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
                            <p className="text-xs text-muted-foreground ml-1">
                              {t('appointments.dialog.rescheduleDescription')}
                            </p>
                            <PopoverTrigger asChild>
                              <Button variant="primary">{t('appointments.reschedule')}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                              />
                              <Button
                                className="mt-2 w-full"
                                disabled={!selectedDate}
                                onClick={() => {
                                  if (selectedDate) {
                                    onReschedule(appointment, selectedDate);
                                    setRescheduleOpen(false);
                                  }
                                }}
                              >
                                {t('appointments.dialog.confirmReschedule')}
                              </Button>
                            </PopoverContent>
                          </Popover>
                        )}

                        {onCancel && (
                          <Popover open={cancelOpen} onOpenChange={setCancelOpen}>
                            <p className="text-xs text-muted-foreground ml-1">
                              {t('appointments.dialog.cancelDescription')}
                            </p>
                            <PopoverTrigger asChild>
                              <Button variant="destructive">
                                {t('appointments.cancel_appointment')}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 space-y-2">
                              <p className="text-sm font-medium">
                                {t('appointments.dialog.cancelReason')}:
                              </p>
                              <Textarea
                                placeholder={t('appointments.dialog.enterReason')}
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                              />
                              <Button
                                className="w-full"
                                disabled={!cancelReason}
                                onClick={() => {
                                  onCancel(appointment, cancelReason);
                                  setCancelReason('');
                                  setCancelOpen(false);
                                }}
                              >
                                {t('appointments.dialog.confirmCancel')}
                              </Button>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
                    )}

                    {role === 'Lawyer' && appointment.status !== 'Cancelled' && (
                      <>
                        {appointment.status === 'Confirmed' && onFinish && (
                          <>
                            <p className="text-xs text-muted-foreground ml-1">
                              {t('appointments.dialog.finishDescription')}
                            </p>
                            <Button variant="primary" onClick={() => onFinish(appointment)}>
                              {t('appointments.dialog.markAsFinished')}
                            </Button>
                          </>
                        )}

                        {appointment.status === 'Pending' && (
                          <>
                            {onCancel && (
                              <Popover open={cancelOpen} onOpenChange={setCancelOpen}>
                                <p className="text-xs text-muted-foreground ml-1">
                                  {t('appointments.dialog.declineDescription')}
                                </p>
                                <PopoverTrigger asChild>
                                  <Button variant="destructive">
                                    {t('appointments.dialog.decline')}
                                  </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-80 space-y-2">
                                  <p className="text-sm font-medium">
                                    {t('appointments.dialog.declineReason')}:
                                  </p>
                                  <Textarea
                                    placeholder={t('appointments.dialog.enterReason')}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                  />
                                  <Button
                                    className="w-full"
                                    disabled={!cancelReason}
                                    onClick={() => {
                                      onCancel(appointment, cancelReason);
                                      setCancelReason('');
                                      setCancelOpen(false);
                                    }}
                                  >
                                    {t('appointments.dialog.confirmDecline')}
                                  </Button>
                                </PopoverContent>
                              </Popover>
                            )}

                            {onApprove && (
                              <>
                                <p className="text-xs text-muted-foreground ml-1">
                                  {t('appointments.dialog.approveDescription')}
                                </p>
                                <Button onClick={() => onApprove(appointment)}>
                                  {t('appointments.approve_appointment')}
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {onDelete && appointment.status === 'Cancelled' && (
                      <>
                        {onReschedule && (
                          <Popover open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
                            <p className="text-xs text-muted-foreground ml-1">
                              {t('appointments.dialog.rescheduleCancelled')}
                            </p>
                            <PopoverTrigger asChild>
                              <Button variant="primary">{t('appointments.reschedule')}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                              />
                              <Button
                                className="mt-2 w-full"
                                disabled={!selectedDate}
                                onClick={() => {
                                  if (selectedDate) {
                                    onReschedule(appointment, selectedDate);
                                    setRescheduleOpen(false);
                                  }
                                }}
                              >
                                {t('appointments.dialog.confirmReschedule')}
                              </Button>
                            </PopoverContent>
                          </Popover>
                        )}
                        <p className="text-xs text-muted-foreground ml-1">
                          {t('appointments.dialog.deleteDescription')}
                        </p>
                        <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>
                          {t('appointments.dialog.deletePermanently')}
                        </Button>

                        <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t('appointments.dialog.deleteTitle')}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('appointments.dialog.deleteConfirmation')}
                                <br />
                                <strong>ID#:</strong> {appointment.id}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onDelete?.(appointment);
                                  setDeleteConfirm(false);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('appointments.dialog.deletePermanently')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
