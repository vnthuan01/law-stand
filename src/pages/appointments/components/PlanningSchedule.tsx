import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { type TAppointment } from '@/services/appointmentService';

interface PlanningScheduleProps {
  appointment: TAppointment;
}

const getTimelineItem = (appointment: TAppointment) => {
  const startTime = new Date(appointment.startsAt);
  const endTime = new Date(appointment.endsAt);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  // Mock data for lawyer
  const lawyer = (appointment as any).lawyer ?? { name: 'Luật sư B' };

  const timelineItems = [
    {
      id: 1,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'System sent confirmation email',
      time: startTime.toLocaleString(),
      status: 'completed',
      description: 'Confirmation email sent to customer and lawyer',
    },
    {
      id: 2,
      icon:
        appointment.status === 'approved' ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : appointment.status === 'cancelled' ? (
          <XCircle className="h-5 w-5 text-red-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-600" />
        ),
      title: `Meeting with ${lawyer.name}`,
      time: `${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`,
      status: appointment.status,
      description: `Duration: ${duration} minutes`,
    },
    {
      id: 3,
      icon:
        appointment.status === 'approved' ? (
          <Clock className="h-5 w-5 text-gray-400" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400" />
        ),
      title: appointment.status === 'approved' ? 'Meeting in progress' : 'Meeting cancelled',
      time: appointment.status === 'approved' ? 'Upcoming' : 'Cancelled',
      status: appointment.status === 'approved' ? 'upcoming' : 'cancelled',
      description:
        appointment.status === 'approved'
          ? 'Waiting for meeting to start'
          : 'This meeting has been cancelled',
    },
  ];

  return timelineItems;
};

export const PlanningSchedule = ({ appointment }: PlanningScheduleProps) => {
  const timelineItems = getTimelineItem(appointment);

  return (
    <section>
      <h4 className="font-medium mb-4 text-sm">Planning Schedule</h4>
      <div className="space-y-4">
        {timelineItems.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Timeline line */}
            {index < timelineItems.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
            )}

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200">
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{item.title}</h5>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'completed'
                          ? 'bg-green-500'
                          : item.status === 'upcoming'
                            ? 'bg-blue-500'
                            : item.status === 'cancelled'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                      }`}
                    />
                    <span className="text-xs font-medium capitalize">{item.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
