import { cn } from '@/lib/utils';
import { type MyAppointment } from '@/services/appointmentService';
import { User, Clock, MapPin, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AppointmentShowCardProps {
  date: Date;
  appointments: MyAppointment[];
  onClick?: (apt: MyAppointment) => void;
  onDelete?: (apt: MyAppointment) => void;
  className?: string;
}

const getStatusStyle = (status: MyAppointment['status']) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-50 border-yellow-300 text-yellow-800';
    case 'Confirmed':
      return 'bg-green-50 border-green-300 text-green-800';
    case 'Cancelled':
      return 'bg-red-50 border-red-300 text-red-800';
    case 'Completed':
      return 'bg-blue-50 border-blue-300 text-blue-800';
    // case 'Rescheduled':
    // return 'bg-purple-50 border-purple-300 text-purple-800';
    default:
      return 'bg-gray-50 border-gray-300 text-gray-700';
  }
};

const getAppointmentDetails = (appointment: MyAppointment) => {
  const startTime = new Date(`${appointment.date} ${appointment.startTime}`);
  const endTime = new Date(`${appointment.date} ${appointment.endTime}`);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  return {
    lawyerName: appointment.lawyerName,
    customerName: appointment.userName,
    customerEmail: appointment.userEmail,
    customerPhone: appointment.userPhone,
    serviceName: appointment.serviceName,
    servicePrice: appointment.servicePrice,
    startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: startTime.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    duration: duration > 0 ? `${duration} minutes` : 'N/A',
  };
};

export default function AppointmentShowCard(props: AppointmentShowCardProps) {
  const { date, appointments, onClick, onDelete, className } = props;

  return (
    <TooltipProvider>
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

          {appointments.map((a) => {
            const details = getAppointmentDetails(a);

            return (
              <Tooltip key={a.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'relative rounded border px-3 py-2 text-sm hover:bg-gray-50 transition cursor-pointer',
                      getStatusStyle(a.status),
                    )}
                    onClick={() => onClick?.(a)}
                  >
                    {/* Delete button for cancelled appointments */}
                    {a.status === 'Cancelled' && onDelete && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(a);
                        }}
                        title="Delete appointment permanently"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}

                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{details.startTime}</span>
                      <span className="text-xs text-muted-foreground">- {a.serviceName}</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs p-4 bg-white border border-gray-200 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{details.lawyerName}</p>
                        <p className="text-xs text-gray-500">Lawyer</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">{details.customerName}</p>
                        <p className="text-xs text-gray-600">{details.customerEmail}</p>
                        <p className="text-xs text-gray-600">{details.customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                        <MapPin className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">Service</p>
                        <p className="text-xs text-gray-600">{details.serviceName}</p>
                        <p className="text-xs text-gray-500">Price: ${details.servicePrice}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">Time</p>
                        <p className="text-xs text-gray-600">
                          {details.startTime} - {details.endTime}
                        </p>
                        <p className="text-xs text-gray-500">Duration: {details.duration}</p>
                      </div>
                    </div>

                    {/* {a.notes && (
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 mt-0.5">
                          <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">Notes</p>
                          <p className="text-xs text-gray-600">{a.notes}</p>
                        </div>
                      </div>
                    )} */}

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 text-center">{details.date}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
