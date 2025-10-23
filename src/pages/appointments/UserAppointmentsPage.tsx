import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from '@/pages/appointments/components/calendar';
import { type MyAppointment } from '@/services/appointmentService';
import { getDateKey } from '@/lib/utils';
import Layout from '@/components/layout/UserLayout';
import AppointmentShowCard from '@/pages/appointments/components/AppointmentShowCard';
import { useMyAppointments, useAppointments, useAppointmentDetail } from '@/hooks/useAppointment';
import AppointmentDialog from './components/AppointmentShowDetail';
import { toast } from 'sonner';

// Hook responsive: chỉ 1, 3, 5
function useResponsiveDays() {
  const [daysCount, setDaysCount] = useState<number>(5);

  useEffect(() => {
    function updateDays() {
      const w = window.innerWidth;
      if (w < 640)
        setDaysCount(1); // mobile
      else if (w < 1024)
        setDaysCount(3); // tablet & laptop nhỏ
      else setDaysCount(5); // desktop
    }
    updateDays();
    window.addEventListener('resize', updateDays);
    return () => window.removeEventListener('resize', updateDays);
  }, []);

  return daysCount;
}

// Helper map số cột → class Tailwind
function getGridColsClass(daysCount: number) {
  switch (daysCount) {
    case 1:
      return 'grid-cols-1';
    case 3:
      return 'grid-cols-3';
    case 5:
      return 'grid-cols-5';
    default:
      return 'grid-cols-1';
  }
}

export default function UserAppointmentsPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Fetch my appointments
  const { data: appointments, isLoading, error, refetch } = useMyAppointments();

  // Fetch full appointment detail when selected
  const { data: selectedAppointment } = useAppointmentDetail(selectedAppointmentId || '');

  const { cancel } = useAppointments();

  // Actions
  const handleCancel = async (apt: MyAppointment) => {
    if (!confirm(t('appointments.cancel_confirm'))) return;
    try {
      await cancel(apt.id);
      await refetch();
      toast.success(t('appointments.appointment_cancelled'));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('appointments.cancel_failed'));
    }
  };

  // Filter appointments by selected month
  const monthAppointments = useMemo(() => {
    if (!appointments) return [];
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getMonth() === month && aptDate.getFullYear() === year;
    });
  }, [appointments, selectedDate]);

  // Group appointments by day for calendar view
  const appointmentsByDay = useMemo(() => {
    const byKey: Record<string, MyAppointment[]> = {};
    for (const apt of monthAppointments) {
      if (!byKey[apt.date]) byKey[apt.date] = [];
      byKey[apt.date].push(apt);
    }
    Object.values(byKey).forEach((list) =>
      list.sort((x, y) => {
        const timeA = new Date(`${x.date} ${x.startTime}`).getTime();
        const timeB = new Date(`${y.date} ${y.startTime}`).getTime();
        return timeA - timeB;
      }),
    );
    return byKey;
  }, [monthAppointments]);

  const daysCount = useResponsiveDays();
  const startOfWindow = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [selectedDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(startOfWindow);
      dd.setDate(startOfWindow.getDate() + i);
      return dd;
    });
  }, [startOfWindow]);

  const visibleDays = useMemo(() => weekDays.slice(0, daysCount), [weekDays, daysCount]);

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
                  onDelete={handleCancel}
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
        onCancel={async (apt) => {
          await handleCancel(apt as unknown as MyAppointment);
          setSelectedAppointmentId(null);
        }}
      />
    </Layout>
  );
}
