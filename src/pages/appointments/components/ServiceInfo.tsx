import { Badge } from '@/components/ui/badge';
import { type AppointmentDetail } from '@/services/appointmentService';

interface ServiceInfoProps {
  appointment: AppointmentDetail;
}

const getStatusBadge = (status: AppointmentDetail['status']) => {
  switch (status) {
    case 'Pending':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Pending
        </Badge>
      );
    case 'Confirmed':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
          Confirmed
        </Badge>
      );
    case 'Cancelled':
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
          Cancelled
        </Badge>
      );
    case 'Completed':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
          Completed
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export const ServiceInfo = ({ appointment }: ServiceInfoProps) => {
  const service = appointment.slot?.service;

  return (
    <section className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Selected Service</h4>
        {getStatusBadge(appointment.status)}
      </div>
      <div className="space-y-2 text-sm">
        <p className="font-semibold">{service?.name || 'N/A'}</p>
        <p className="text-muted-foreground">
          {service?.description || 'No description available'}
        </p>
        <p className="font-medium text-green-700">
          Price:{' '}
          {service?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0}
        </p>
      </div>
    </section>
  );
};
