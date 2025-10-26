import { useState, useEffect, useMemo } from 'react';
import { type MyAppointment } from '@/services/appointmentService';

export function useAppointmentView(
  appointments: MyAppointment[] | undefined,
  initialSelectedDate: Date,
) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);

  // Hook responsive: chỉ 1, 3, 5
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

  const startOfWindow = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [selectedDate]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const dd = new Date(startOfWindow);
        dd.setDate(startOfWindow.getDate() + i);
        return dd;
      }),
    [startOfWindow],
  );

  const visibleDays = useMemo(() => weekDays.slice(0, daysCount), [weekDays, daysCount]);

  return {
    selectedDate,
    setSelectedDate,
    daysCount,
    monthAppointments,
    appointmentsByDay,
    visibleDays,
  };
}

// Helper map số cột → class Tailwind
export function getGridColsClass(daysCount: number) {
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
