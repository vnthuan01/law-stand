import { useEffect, useState } from 'react';
import Calendar from '@/pages/appointments/components/calendar';
import { type TAppointment } from '@/services/appointmentService';
import { getDateKey } from '@/lib/utils';
import Layout from '@/components/layout/UserLayout';
import {
  useAppointmentActions,
  useAppointmentsByDate,
  useAppointmentsByMonth,
} from '@/hooks/useAppointment';

export default function UserAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<TAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [monthAppointments, setMonthAppointments] = useState<TAppointment[]>([]);
  const userId = 'user-1';

  const {
    data: dayData,
    isLoading: isLoadingDay,
    error: errorDay,
    refetch: refetchDay,
  } = useAppointmentsByDate({ dateISO: getDateKey(selectedDate), role: 'user', actorId: userId });
  const { data: monthData, refetch: refetchMonth } = useAppointmentsByMonth({
    monthISO: getDateKey(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)),
    role: 'user',
    actorId: userId,
  });
  const { cancel /* reschedule */ } = useAppointmentActions();

  useEffect(() => {
    setLoading(isLoadingDay);
    setError(errorDay ? (errorDay as Error).message : null);
    setAppointments(dayData ?? []);
    setMonthAppointments(monthData ?? []);
  }, [dayData, isLoadingDay, errorDay, monthData]);

  useEffect(() => {
    refetchDay();
    refetchMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (apt: TAppointment) => {
    const reason = prompt('Reason for cancel:') ?? '';
    if (!confirm('Confirm cancel?')) return;
    try {
      await cancel.mutateAsync({ id: apt.id, reason });
      await refetchDay();
      await refetchMonth();
      alert('Appointment canceled ❌');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to cancel');
    }
  };

  return (
    <Layout>
      <h1 className="mb-1 text-2xl font-semibold">My Appointments</h1>
      <p className="mb-4 text-sm text-gray-600">
        {selectedDate.toLocaleDateString()} · {monthAppointments.length} appointments this month
      </p>

      <div className="flex gap-6">
        {/* Calendar - fixed width */}
        <div className="flex-shrink-0 w-[420px]">
          <div className="sticky top-4">
            <Calendar
              value={selectedDate}
              onChange={async (d) => {
                setSelectedDate(d);
                await refetchDay();
                await refetchMonth();
              }}
              onMonthChange={async () => {
                await refetchMonth();
              }}
              markedDates={monthAppointments.map((a) => getDateKey(new Date(a.startsAt)))}
            />
          </div>
        </div>

        {/* Appointment Details - flexible */}
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-medium">
            Appointments on {selectedDate.toLocaleDateString()}
          </h2>

          {loading && <p className="text-sm">Loading...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && appointments.length === 0 && (
            <div className="rounded border p-6 text-center text-gray-500 bg-white shadow-sm">
              No appointments today
            </div>
          )}

          <div
            className={`grid gap-4 ${
              appointments.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {appointments.map((a) => (
              <div
                key={a.id}
                className={`rounded border p-3 shadow-sm bg-white flex flex-col ${
                  appointments.length === 1 ? 'col-span-full' : ''
                }`}
              >
                {/* Status */}
                <div className="mb-1 text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  {a.status === 'pending' && (
                    <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      Pending
                    </span>
                  )}
                  {a.status === 'approved' && (
                    <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Approved
                    </span>
                  )}
                  {a.status === 'canceled' && (
                    <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      Canceled
                    </span>
                  )}
                  {a.status === 'rescheduled' && (
                    <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      Rescheduled
                    </span>
                  )}
                </div>

                {/* Time */}
                <div className="mb-2 text-sm text-gray-700">
                  {new Date(a.startsAt).toLocaleString()} -{' '}
                  {new Date(a.endsAt).toLocaleTimeString()}
                </div>

                {/* Notes */}
                {a.notes && <div className="mb-2 text-xs text-gray-600 italic">“{a.notes}”</div>}

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  {a.status !== 'canceled' && (
                    <button
                      type="button"
                      className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                      onClick={() => handleCancel(a)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
