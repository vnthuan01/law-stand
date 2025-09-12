import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { type TAppointment } from '@/services/appointmentService';

interface BookingInfoProps {
  appointment: TAppointment;
}

export const BookingInfo = ({ appointment }: BookingInfoProps) => {
  return (
    <section className="border rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium">Date & Time</p>
          <p className="text-muted-foreground">
            {new Date(appointment.startsAt).toLocaleString()} -{' '}
            {new Date(appointment.endsAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div>
        <p className="font-medium">Appointment Type</p>
        <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-300">Consultation</Badge>
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium">Location</p>
          <p className="text-muted-foreground">{(appointment as any).location || 'Google Meet'}</p>
        </div>
      </div>
    </section>
  );
};
