import { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getDateKey } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface CalendarProps {
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date) => void;
  onMonthChange?: (monthStart: Date) => void;
  className?: string;
  markedDates?: string[];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export default function Calendar(props: CalendarProps) {
  const { t } = useTranslation();
  const { value, minDate, maxDate, onChange, onMonthChange, className, markedDates = [] } = props;
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(value ?? today);

  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const startOfMonth = useMemo(
    () => new Date(viewDate.getFullYear(), viewDate.getMonth(), 1),
    [viewDate],
  );
  const endOfMonth = useMemo(
    () => new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0),
    [viewDate],
  );

  const startWeekday = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  useEffect(() => {
    onMonthChange?.(startOfMonth);
  }, [viewDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const weeks = useMemo(() => {
    const days: Array<{ date: Date; inMonth: boolean }> = [];

    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(startOfMonth);
      d.setDate(d.getDate() - (startWeekday - i));
      days.push({ date: d, inMonth: false });
    }

    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: new Date(viewDate.getFullYear(), viewDate.getMonth(), d), inMonth: true });
    }

    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      days.push({ date: next, inMonth: false });
    }

    const grouped: Array<Array<{ date: Date; inMonth: boolean }>> = [];
    for (let i = 0; i < days.length; i += 7) grouped.push(days.slice(i, i + 7));
    return grouped;
  }, [startWeekday, startOfMonth, totalDays, viewDate]);

  const handleSelect = (date: Date) => {
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    onChange?.(date);
  };

  const months = [
    t('months.january'),
    t('months.february'),
    t('months.march'),
    t('months.april'),
    t('months.may'),
    t('months.june'),
    t('months.july'),
    t('months.august'),
    t('months.september'),
    t('months.october'),
    t('months.november'),
    t('months.december'),
  ];

  const weekdays = [
    t('weekdays.sun'),
    t('weekdays.mon'),
    t('weekdays.tue'),
    t('weekdays.wed'),
    t('weekdays.thu'),
    t('weekdays.fri'),
    t('weekdays.sat'),
  ];

  return (
    <div
      className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-md ${className ?? ''}`}
      aria-label={t('calendar.aria.calendar')}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t('calendar.aria.previousMonth')}
          onClick={() => setViewDate((prev) => addMonths(prev, -1))}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          className="flex items-center gap-2 text-base font-semibold text-gray-800 cursor-pointer select-none"
          onClick={() => setShowMonthPicker((prev) => !prev)}
        >
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          {viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t('calendar.aria.nextMonth')}
          onClick={() => setViewDate((prev) => addMonths(prev, 1))}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {showMonthPicker ? (
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, idx) => (
            <button
              key={m}
              type="button"
              className={`p-2 rounded-lg text-sm font-medium transition 
                ${idx === viewDate.getMonth() ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-100'}
              `}
              onClick={() => {
                setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                setShowMonthPicker(false);
              }}
            >
              {m}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500">
            {weekdays.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {weeks.flat().map(({ date, inMonth }) => {
              const isToday = isSameDay(date, today);
              const isSelected = value ? isSameDay(date, value) : false;
              const isDisabled =
                !inMonth || (minDate && date < minDate) || (maxDate && date > maxDate);

              const isMarked = markedDates.includes(getDateKey(date));

              return (
                <button
                  key={getDateKey(date)}
                  type="button"
                  className={`h-10 w-full rounded-lg text-sm transition font-medium relative
                    ${!inMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${isToday && inMonth ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100'}
                    ${isDisabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : ''}
                  `}
                  aria-pressed={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSelect(date)}
                >
                  {date.getDate()}
                  {isMarked && inMonth && (
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full 
                        ${isSelected ? 'bg-white' : 'bg-blue-500'}`}
                    ></span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
