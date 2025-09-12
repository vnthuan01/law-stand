import { useEffect, useMemo, useState } from 'react';
import Calendar from '@/pages/appointments/components/calendar';
import { type TAppointment } from '@/services/appointmentService';
import { getDateKey } from '@/lib/utils';
import Layout from '@/components/layout/UserLayout';
import AppointmentDetail from '@/pages/appointments/components/AppointmentShowCard';
import {
  useAppointmentActions,
  useAppointmentsByDate,
  useAppointmentsByMonth,
} from '@/hooks/useAppointment';
import AppointmentDialog from './components/AppointmentShowDetail';

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [monthAppointments, setMonthAppointments] = useState<TAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);

  const lawyerId = 'lawyer-1';

  const {
    data: dayData,
    isLoading: isLoadingDay,
    error: errorDay,
    refetch: refetchDay,
  } = useAppointmentsByDate({
    dateISO: getDateKey(selectedDate),
    role: 'lawyer',
    actorId: lawyerId,
  });

  const {
    data: monthData,
    refetch: refetchMonth,
    isFetching: isFetchingMonth,
  } = useAppointmentsByMonth({
    monthISO: getDateKey(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)),
    role: 'lawyer',
    actorId: lawyerId,
  });

  const { cancel, remove, approve, finish } = useAppointmentActions();

  useEffect(() => {
    setLoading(isLoadingDay || isFetchingMonth);
    setError(errorDay ? (errorDay as Error).message : null);
    setMonthAppointments(monthData ?? []);
  }, [dayData, isLoadingDay, errorDay, monthData, isFetchingMonth]);

  useEffect(() => {
    refetchDay();
    refetchMonth();
  }, [selectedDate]);

  // Actions
  const handleCancel = async (apt: TAppointment, reason: string) => {
    try {
      await cancel.mutateAsync({ id: apt.id, reason });
      await Promise.all([refetchDay(), refetchMonth()]);
      alert('Appointment canceled');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to cancel');
    }
  };

  const handleDelete = async (apt: TAppointment) => {
    if (!confirm('Confirm delete this appointment?')) return;
    try {
      await remove.mutateAsync(apt.id);
      await refetchMonth();
      alert('Appointment deleted');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  const handleApprove = async (apt: TAppointment) => {
    if (!confirm('Approve this appointment?')) return;
    try {
      await approve.mutateAsync(apt.id);
      await Promise.all([refetchDay(), refetchMonth()]);
      alert('Appointment approved');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to approve');
    }
  };

  const handleFinish = async (apt: TAppointment) => {
    if (!confirm('Mark this appointment as finished?')) return;
    try {
      await finish.mutateAsync(apt.id);
      await Promise.all([refetchDay(), refetchMonth()]);
      alert('Appointment marked as finished');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to finish appointment');
    }
  };

  // Week & days view
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

  const daysCount = useResponsiveDays();
  const visibleDays = useMemo(() => weekDays.slice(0, daysCount), [weekDays, daysCount]);

  const appointmentsByDay = useMemo(() => {
    const byKey: Record<string, TAppointment[]> = {};
    for (const a of monthAppointments) {
      const d = new Date(a.startsAt);
      const key = d.toDateString();
      if (!byKey[key]) byKey[key] = [];
      byKey[key].push(a);
    }
    Object.values(byKey).forEach((list) =>
      list.sort((x, y) => new Date(x.startsAt).getTime() - new Date(y.startsAt).getTime()),
    );
    return byKey;
  }, [monthAppointments]);

  return (
    <Layout>
      <h1 className="mb-1 text-2xl font-semibold">My Appointments</h1>
      <p className="mb-4 text-sm text-gray-600">
        {selectedDate.toLocaleDateString()} · {monthAppointments.length} appointments this month
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-shrink-0 w-full lg:w-[380px]">
          <div className="sticky top-4">
            <Calendar
              value={selectedDate}
              onChange={async (d) => {
                setSelectedDate(d);
              }}
              onMonthChange={async (newMonth) => {
                // refetch month khi đổi tháng
                setSelectedDate(newMonth);
              }}
              markedDates={monthAppointments.map((a) => getDateKey(new Date(a.startsAt)))}
            />
          </div>
        </div>

        {/* Appointments grid */}
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-medium">Appointments ({daysCount} days view)</h2>

          {loading && <p className="text-sm">Loading...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className={`grid gap-4 ${getGridColsClass(daysCount)}`}>
            {visibleDays.map((d) => (
              <AppointmentDetail
                key={d.toDateString()}
                date={d}
                appointments={appointmentsByDay[d.toDateString()] ?? []}
                onDelete={handleDelete}
                onClick={(apt) => setSelectedAppointment(apt)}
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Appointment detail dialog */}
      <AppointmentDialog
        appointment={selectedAppointment}
        role="lawyer"
        onClose={() => setSelectedAppointment(null)}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onFinish={handleFinish}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
