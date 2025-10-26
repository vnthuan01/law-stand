import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type AppointmentDetail } from '@/services/appointmentService';

interface LawyerInfoProps {
  appointment: AppointmentDetail;
}

export const LawyerInfo = ({ appointment }: LawyerInfoProps) => {
  const lawyer = appointment.slot.lawyer;

  return (
    <section className="border rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-sm">Lawyer Information</h4>
      <div className="flex items-center gap-3">
        <Avatar>
          {/* <AvatarImage src={lawyer.avatarUrl} /> */}
          <AvatarFallback>{lawyer.fullName.charAt(0) || 'L'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{lawyer.fullName}</p>
          <p className="text-sm text-muted-foreground">{lawyer.email}</p>
          <p className="text-sm text-muted-foreground">{lawyer.phoneNumber}</p>
        </div>
      </div>
    </section>
  );
};
