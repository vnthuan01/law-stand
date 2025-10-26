import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { type AppointmentDetail } from '@/services/appointmentService';
import { useTranslation } from 'react-i18next';

interface BookingInfoProps {
  appointment: AppointmentDetail;
}

export const BookingInfo = ({ appointment }: BookingInfoProps) => {
  const { t } = useTranslation();

  return (
    <section className="border rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium">{t('appointments.date_and_time')}</p>
          <p className="text-muted-foreground">
            {new Date(appointment.slot.startTime).toLocaleString()} -{' '}
            {new Date(appointment.slot.endTime).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div>
        <p className="font-medium">{t('appointments.appointment_type')}</p>
        <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-300">
          {t('appointments.consultation')}
        </Badge>
      </div>
    </section>
  );
};
