import { Badge } from '@/components/ui/badge';
import { type TAppointment } from '@/services/appointmentService';

interface ServiceInfoProps {
  appointment: TAppointment;
}

// Danh sách dịch vụ luật
const services = [
  {
    id: '01',
    number: '01',
    title: 'Immigration & Work Permits',
    desc: 'Expert guidance through visa and work permit processes',
  },
  {
    id: '02',
    number: '02',
    title: 'Property & Inheritance Law',
    desc: 'Secure your property rights and inheritance matters',
  },
  {
    id: '03',
    number: '03',
    title: 'Family & Marriage Law',
    desc: 'Professional support for family legal matters',
  },
  {
    id: '04',
    number: '04',
    title: 'Business Setup & Tax',
    desc: 'Complete business registration and tax compliance',
  },
  {
    id: '05',
    number: '05',
    title: 'Document Legalization & Notarization',
    desc: 'Official document authentication services',
  },
  {
    id: '06',
    number: '06',
    title: 'Dispute Resolution & Investment Consulting',
    desc: 'Legal dispute resolution and investment advice',
  },
];

const getStatusBadge = (status: TAppointment['status']) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
          Approved
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
          Cancelled
        </Badge>
      );
    case 'rescheduled':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
          Rescheduled
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export const ServiceInfo = ({ appointment }: ServiceInfoProps) => {
  const service = services.find((s) => s.id === (appointment as any).serviceId);

  if (!service) return null;

  return (
    <section className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Selected Service</h4>
        {getStatusBadge(appointment.status)}
      </div>
      <div className="space-y-2 text-sm">
        <p className="font-semibold">
          {service.number}. {service.title}
        </p>
        <p className="text-muted-foreground">{service.desc}</p>
      </div>
    </section>
  );
};
