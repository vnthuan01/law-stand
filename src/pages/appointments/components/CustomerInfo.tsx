import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type AppointmentDetail } from '@/services/appointmentService';

interface CustomerInfoProps {
  appointment: AppointmentDetail;
}

export const CustomerInfo = ({ appointment }: CustomerInfoProps) => {
  const user = appointment.user;

  return (
    <section className="border rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-sm">Customer Information</h4>
      <div className="flex items-center gap-3">
        <Avatar>
          {/* <AvatarImage src={user.avatar || 'https://i.pravatar.cc/100?img=1'} /> */}
          <AvatarFallback>{user.fullName.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
        </div>
      </div>
    </section>
  );
};
