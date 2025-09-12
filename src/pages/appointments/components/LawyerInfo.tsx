import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { type TAppointment } from '@/services/appointmentService';

interface LawyerInfoProps {
  appointment: TAppointment;
}

// Mock data (khi chưa có API thật)
const mockLawyer = {
  name: 'Luật sư B',
  email: 'b@example.com',
  phone: '0987654321',
  avatarUrl: 'https://i.pravatar.cc/100?img=2',
};

export const LawyerInfo = ({ appointment }: LawyerInfoProps) => {
  const lawyer = (appointment as any).lawyer ?? mockLawyer;

  return (
    <section className="border rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-sm">Lawyer Information</h4>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={lawyer.avatarUrl} />
          <AvatarFallback>{lawyer.name?.[0] || 'L'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{lawyer.name}</p>
          <p className="text-sm text-muted-foreground">{lawyer.email}</p>
          <p className="text-sm text-muted-foreground">{lawyer.phone}</p>
        </div>
      </div>
    </section>
  );
};
