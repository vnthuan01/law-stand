import { cn } from '@/lib/utils';
import { type TAppointment } from '@/services/appointmentService';
import { X } from 'lucide-react';

interface AppointmentDetailProps {
  date: Date;
  appointments: TAppointment[];
  onCancel?: (apt: TAppointment) => void;
  onApprove?: (apt: TAppointment) => void;
  onDelete?: (apt: TAppointment) => void;
  onClick?: (apt: TAppointment) => void;
  className?: string;
}

const getStatusStyle = (status: TAppointment['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 border-yellow-300 text-yellow-800';
    case 'approved':
      return 'bg-green-50 border-green-300 text-green-800';
    case 'canceled':
      return 'bg-red-50 border-red-300 text-red-800';
    default:
      return 'bg-gray-50 border-gray-300 text-gray-700';
  }
};

export default function AppointmentDetail(props: AppointmentDetailProps) {
  const { date, appointments, onCancel, onApprove, onDelete, onClick, className } = props;

  return (
    <div className={cn('rounded border bg-white shadow-sm', className)}>
      <div className="border-b px-3 py-2 text-sm font-medium">
        {date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })}
      </div>
      <div className="p-3 space-y-3">
        {appointments.length === 0 && (
          <p className="text-xs text-gray-500">No morning appointments</p>
        )}

        {appointments.map((a) => (
          <div
            key={a.id}
            className={cn(
              'relative rounded border px-3 py-2 text-sm hover:bg-gray-50 transition cursor-pointer',
              getStatusStyle(a.status),
            )}
            onClick={() => onClick?.(a)}
          >
            {/* Nút delete top-right khi status === canceled */}
            {a.status === 'canceled' && onDelete && (
              <button
                type="button"
                className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(a);
                }}
                title="Delete appointment"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="mb-1 flex items-center gap-2">
              <span className="font-medium">
                {new Date(a.startsAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {(onCancel || onApprove) && (
              <div className="mt-2 flex gap-2">
                {onCancel && a.status !== 'canceled' && (
                  <button
                    type="button"
                    className="rounded bg-red-600 px-2.5 py-1 text-xs text-white hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(a);
                    }}
                  >
                    Cancel
                  </button>
                )}
                {onApprove && a.status === 'pending' && (
                  <button
                    type="button"
                    className="rounded bg-green-600 px-2.5 py-1 text-xs text-white hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(a);
                    }}
                  >
                    Approve
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
