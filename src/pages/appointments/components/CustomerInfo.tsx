import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { type TAppointment } from '@/services/appointmentService';

interface CustomerInfoProps {
  appointment: TAppointment;
}

// Mock data (khi chưa có API thật)
const mockUser = {
  name: 'Nguyễn Văn A',
  email: 'a@example.com',
  phone: '0123456789',
  avatarUrl: 'https://i.pravatar.cc/100?img=1',
};

export const CustomerInfo = ({ appointment }: CustomerInfoProps) => {
  const user = (appointment as any).user ?? mockUser;

  return (
    <section className="border rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-sm">Customer Information</h4>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
        </div>
      </div>
      {appointment.reason && (
        <div className="bg-muted p-3 rounded-md text-sm">
          <strong className="block mb-1">Reason</strong>
          <p>{appointment.reason}</p>
        </div>
      )}
    </section>
  );
};
