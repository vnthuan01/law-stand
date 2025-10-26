'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const BookingStepOne = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setDuration,
  setSelectedTimeSlot,
  timeSlots,
  locations,
  selectedLocation,
  setSelectedLocation,
  onNext,
}: any) => {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNext) onNext();
  };

  const parseTimeToMinutes = (timeStr: string) => {
    const match = timeStr.trim().match(/ˆ(\d{1,2}):(\d{2})(am|pm)$/i);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toLowerCase();
    let h24 = hours % 12;
    if (period === 'pm') h24 += 12;
    return h24 * 60 + minutes;
  };

  const computeDurationFromSlot = (slot: string) => {
    const [start, end] = slot.split('-').map((s) => s.trim());
    if (!start || !end) return null;
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    if (startMin == null || endMin == null) return null;
    const diff = endMin - startMin;
    return diff > 0 ? String(diff) : null;
  };
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calendar */}
        <div>
          <div className="bg-sky-100 rounded-md p-3 text-center font-bold text-slate-800 text-sm md:text-base">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : t('booking.stepOne.selectADate')}
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
            className="mt-2 rounded-md border p-3 bg-white text-primary shadow-sm h-auto md:h-[420px] overflow-y-auto"
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          {/* Timezone */}
          <div>
            <p className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-800 mb-1">
              {t('booking.stepOne.confirmTimezone')}
            </p>
            <Select defaultValue="vietnam">
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder={t('booking.stepOne.selectTimezone')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vietnam">{t('booking.stepOne.vietnamTimezone')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <p className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-800 mb-1">
              {t('booking.stepOne.location')}
            </p>
            <Select
              value={selectedLocation || undefined}
              onValueChange={(val) => setSelectedLocation(val)}
            >
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder={t('booking.stepOne.chooseLocation')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {locations.map((loc: any) => (
                  <SelectItem key={loc.name} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slots */}
          <div>
            <p className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-800 mb-1">
              {t('booking.stepOne.chooseTime')}
            </p>
            <ScrollArea className="h-60 md:h-72 w-full pr-2">
              <div className="flex flex-col gap-2">
                {timeSlots.map((time: string) => (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? 'primary' : 'outline'}
                    className={cn(
                      'w-full justify-center text-sm md:text-base',
                      selectedTimeSlot === time && 'bg-green-600 text-white',
                    )}
                    onClick={() => {
                      setSelectedTimeSlot(time);
                      const dur = computeDurationFromSlot(time);
                      if (dur) setDuration(dur);
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-6">
        <Button
          disabled={!selectedDate || !selectedTimeSlot || !selectedLocation}
          onClick={handleNext}
          className="px-6"
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};
