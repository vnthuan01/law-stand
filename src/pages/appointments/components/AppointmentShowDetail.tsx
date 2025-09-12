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
import { type TAppointment } from '@/services/appointmentService';

import { CustomerInfo } from './CustomerInfo';
import { LawyerInfo } from './LawyerInfo';
import { ServiceInfo } from './ServiceInfo';
import { BookingInfo } from './BookingInfo';
import { PlanningSchedule } from './PlanningSchedule';

interface AppointmentDialogProps {
  appointment: TAppointment | null;
  role: 'user' | 'lawyer';
  onClose: () => void;
  onReschedule?: (apt: TAppointment, newDate: Date) => void;
  onCancel?: (apt: TAppointment, reason: string) => void;
  onDelete?: (apt: TAppointment) => void;
  onApprove?: (apt: TAppointment) => void;
  onFinish?: (apt: TAppointment) => void;
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
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between mb-2">
            <div>
              <DialogTitle className="text-lg font-semibold">Appointment Request</DialogTitle>
              <p className="text-xs text-muted-foreground">ID #{appointment.id}</p>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <CustomerInfo appointment={appointment} />
                <ServiceInfo appointment={appointment} />
                <PlanningSchedule appointment={appointment} />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <LawyerInfo appointment={appointment} />
                <BookingInfo appointment={appointment} />

                {/* Actions section */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">Actions</h4>

                  <div className="flex flex-col gap-2">
                    {/* USER actions */}
                    {role === 'user' && appointment.status !== 'cancelled' && (
                      <>
                        {/* Reschedule */}
                        {onReschedule && (
                          <Popover open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
                            <p className="text-xs text-muted-foreground ml-1">
                              Change your appointment to a new date.
                            </p>
                            <PopoverTrigger asChild>
                              <Button variant="primary">Reschedule</Button>
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
                                Confirm Reschedule
                              </Button>
                            </PopoverContent>
                          </Popover>
                        )}

                        {/* Cancel */}
                        {onCancel && (
                          <Popover open={cancelOpen} onOpenChange={setCancelOpen}>
                            <p className="text-xs text-muted-foreground ml-1">
                              Cancel this appointment permanently.
                            </p>
                            <PopoverTrigger asChild>
                              <Button variant="destructive">Cancel Appointment</Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 space-y-2">
                              <p className="text-sm font-medium">Reason for cancellation:</p>
                              <Textarea
                                placeholder="Enter your reason..."
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
                                Confirm Cancel
                              </Button>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
                    )}

                    {/* LAWYER actions */}
                    {role === 'lawyer' && appointment.status !== 'cancelled' && (
                      <>
                        {/* For approved appointments - only show Finished button */}
                        {appointment.status === 'approved' && onFinish && (
                          <>
                            <p className="text-xs text-muted-foreground ml-1">
                              Mark this appointment as completed and finished.
                            </p>
                            <Button variant="primary" onClick={() => onFinish(appointment)}>
                              Mark as Finished
                            </Button>
                          </>
                        )}

                        {/* For pending appointments - show Decline and Approve */}
                        {appointment.status === 'pending' && (
                          <>
                            {/* Decline */}
                            {onCancel && (
                              <Popover open={cancelOpen} onOpenChange={setCancelOpen}>
                                <p className="text-xs text-muted-foreground ml-1">
                                  Reject this appointment request with a reason.
                                </p>
                                <PopoverTrigger asChild>
                                  <Button variant="destructive">Decline Appointment</Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-80 space-y-2">
                                  <p className="text-sm font-medium">Reason for decline:</p>
                                  <Textarea
                                    placeholder="Enter reason..."
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
                                    Confirm Decline
                                  </Button>
                                </PopoverContent>
                              </Popover>
                            )}

                            {/* Approve */}
                            {onApprove && (
                              <>
                                <p className="text-xs text-muted-foreground ml-1">
                                  Accept and confirm this appointment request.
                                </p>
                                <Button onClick={() => onApprove(appointment)}>
                                  Approve Appointment
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* DELETE only after cancelled */}
                    {onDelete && appointment.status === 'cancelled' && (
                      <>
                        {onReschedule && (
                          <Popover open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
                            <p className="text-xs text-muted-foreground ml-1">
                              Choose a new date to reschedule this cancelled appointment.
                            </p>
                            <PopoverTrigger asChild>
                              <Button variant="primary">Reschedule</Button>
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
                                Confirm Reschedule
                              </Button>
                            </PopoverContent>
                          </Popover>
                        )}
                        <p className="text-xs text-muted-foreground ml-1">
                          Remove this appointment record permanently from the system.
                        </p>
                        <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>
                          Delete Permanently
                        </Button>

                        {/* Delete Confirmation Dialog */}
                        <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this appointment permanently? This
                                action cannot be undone.
                                <br />
                                <strong>ID#:</strong> {appointment.id}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onDelete?.(appointment);
                                  setDeleteConfirm(false);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Permanently
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
