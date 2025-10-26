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
import { getDateKey } from '@/lib/utils'; // Assuming this is correct
import Layout from '@/components/layout/UserLayout';
import AppointmentShowCard from '@/pages/appointments/components/AppointmentShowCard';
import {
  useAppointmentsByLawyer,
  useAppointments,
  useAppointmentDetail,
} from '@/hooks/useAppointment';
import AppointmentDialog from './components/AppointmentShowDetail';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAppointmentView, getGridColsClass } from '@/hooks/useAppointmentView';

export default function LawyerAppointmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'cancel' | 'approve' | 'complete' | null>(null);
  const [appointmentToAction, setAppointmentToAction] = useState<MyAppointment | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Use lawyer ID from authenticated user
  const lawyerId = user?.id || '';

  // Fetch lawyer appointments
  const { data: appointments, isLoading, error, refetch } = useAppointmentsByLawyer(lawyerId);

  // Fetch full appointment detail when selected
  const { data: selectedAppointment } = useAppointmentDetail(selectedAppointmentId || '');

  const { cancel, updateStatus } = useAppointments();

  const openDialog = (apt: MyAppointment, action: 'cancel' | 'approve' | 'complete') => {
    setAppointmentToAction(apt);
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    if (!appointmentToAction || !dialogAction) return;

    try {
      switch (dialogAction) {
        case 'cancel':
          await cancel(appointmentToAction.id);
          toast.success(t('appointments.appointment_cancelled'));
          break;
        case 'approve':
          await updateStatus({
            appointmentId: appointmentToAction.id,
            data: { status: 'Confirmed' },
          });
          toast.success(t('appointments.appointment_approved'));
          break;
        case 'complete':
          await updateStatus({
            appointmentId: appointmentToAction.id,
            data: { status: 'Completed' },
          });
          toast.success(t('appointments.appointment_completed'));
          break;
      }
    } catch (e: unknown) {
      const errorMessageMap = {
        cancel: 'appointments.cancel_failed',
        approve: 'appointments.approve_failed',
        complete: 'appointments.complete_failed',
      };
      toast.error(e instanceof Error ? e.message : t(errorMessageMap[dialogAction]));
    } finally {
      await refetch();
      setIsDialogOpen(false);
      setAppointmentToAction(null);
      setDialogAction(null);
    }
  };

  const dialogContent = {
    cancel: { title: t('appointments.cancel_appointment'), desc: t('appointments.cancel_confirm') },
    approve: {
      title: t('appointments.approve_appointment'),
      desc: t('appointments.approve_confirm'),
    },
    complete: {
      title: t('appointments.complete_appointment'),
      desc: t('appointments.complete_confirm'),
    },
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
      <h1 className="mb-1 text-2xl font-semibold">{t('appointments.lawyer_appointments')}</h1>
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
                  onDelete={(apt) => openDialog(apt, 'cancel')}
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
        role="Lawyer"
        onClose={() => setSelectedAppointmentId(null)}
        onApprove={(apt) => {
          openDialog(apt as unknown as MyAppointment, 'approve');
          setSelectedAppointmentId(null);
        }}
        onCancel={(apt) => {
          openDialog(apt as unknown as MyAppointment, 'cancel');
          setSelectedAppointmentId(null);
        }}
        onFinish={(apt) => {
          openDialog(apt as unknown as MyAppointment, 'complete');
          setSelectedAppointmentId(null);
        }}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogAction && dialogContent[dialogAction].title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction && dialogContent[dialogAction].desc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDialogConfirm}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
