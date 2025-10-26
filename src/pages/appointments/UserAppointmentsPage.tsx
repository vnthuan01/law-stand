import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Calendar from '@/pages/appointments/components/calendar';
import { type MyAppointment } from '@/services/appointmentService';
import { getDateKey } from '@/lib/utils';
import Layout from '@/components/layout/UserLayout';
import AppointmentShowCard from '@/pages/appointments/components/AppointmentShowCard';
import { useMyAppointments, useAppointments, useAppointmentDetail } from '@/hooks/useAppointment';
import AppointmentDialog from './components/AppointmentShowDetail';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { useAppointmentView, getGridColsClass } from '@/hooks/useAppointmentView';

export default function UserAppointmentsPage() {
  const { t } = useTranslation();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<MyAppointment | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive';
    confirmText: string;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default',
    confirmText: 'Confirm',
  });

  // Fetch my appointments
  const { data: appointments, isLoading, error, refetch } = useMyAppointments();

  // Fetch full appointment detail when selected
  const { data: selectedAppointment } = useAppointmentDetail(selectedAppointmentId || '');

  const { cancel } = useAppointments();

  // Actions
  const handleCancel = async (apt: MyAppointment) => {
    setConfirmDialog({
      open: true,
      title: t('appointments.cancel_title'),
      description: t('appointments.cancel_confirm'),
      variant: 'destructive',
      confirmText: t('common.delete'),
      onConfirm: async () => {
        try {
          await cancel(apt.id);
          await refetch();
          toast.success(t('appointments.appointment_cancelled'));
        } catch (e: unknown) {
          toast.error(e instanceof Error ? e.message : t('appointments.cancel_failed'));
        }
      },
    });
  };

  const {
    selectedDate,
    setSelectedDate,
    daysCount,
    monthAppointments,
    appointmentsByDay,
    visibleDays,
  } = useAppointmentView(appointments, new Date());

  return (
    <Layout>
      <h1 className="mb-1 text-2xl font-semibold">{t('appointments.my_appointments')}</h1>
      <p className="mb-4 text-sm text-gray-600">
        {selectedDate.toLocaleDateString()} · {monthAppointments.length}{' '}
        {t('appointments.appointments_this_month')}
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-shrink-0 w-full lg:w-[380px]">
          <div className="sticky top-4">
            <Calendar
              value={selectedDate}
              onChange={(d) => setSelectedDate(d)}
              onMonthChange={(newMonth) => setSelectedDate(newMonth)}
              markedDates={monthAppointments.map((a) => a.date)}
            />
          </div>
        </div>

        {/* Appointments grid */}
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-medium">
            {t('appointments.title')} ({daysCount} {t('appointments.days_view')})
          </h2>

          {isLoading && <p className="text-sm">{t('common.loading')}</p>}
          {error && <p className="text-sm text-red-600">{t('appointments.error_loading')}</p>}

          <div className={`grid gap-4 ${getGridColsClass(daysCount)}`}>
            {visibleDays.map((d) => {
              const dateKey = getDateKey(d);
              const dayAppts = appointmentsByDay[dateKey] ?? [];
              return (
                <AppointmentShowCard
                  key={d.toDateString()}
                  date={d}
                  appointments={dayAppts}
                  onDelete={openCancelDialog}
                  onClick={(apt) => setSelectedAppointmentId(apt.id)}
                  className="cursor-pointer"
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment detail dialog */}
      <AppointmentDialog
        appointment={selectedAppointment || null}
        role="User"
        onClose={() => setSelectedAppointmentId(null)}
        onCancel={(apt) => {
          openCancelDialog(apt as unknown as MyAppointment);
          setSelectedAppointmentId(null);
        }}
      />

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={t('common.cancel')}
        onConfirm={confirmDialog.onConfirm}
        variant={confirmDialog.variant}
      />
    </Layout>
  );
}
