import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type TAppointment } from '@/services/appointmentService';

interface AppointmentDialogProps {
  appointment: TAppointment | null;
  role: 'user' | 'lawyer';
  onClose: () => void;
  onReschedule?: (apt: TAppointment) => void;
  onCancel?: (apt: TAppointment) => void;
  onDelete?: (apt: TAppointment) => void;
  onApprove?: (apt: TAppointment) => void;
}

export default function AppointmentDialog({
  appointment,
  role,
  onClose,
  onReschedule,
  onCancel,
  onDelete,
  onApprove,
}: AppointmentDialogProps) {
  if (!appointment) return null;

  return (
    <Dialog open={!!appointment} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <strong>ID:</strong> {appointment.id}
          </p>
          <p>
            <strong>Starts At:</strong> {new Date(appointment.startsAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {appointment.status}
          </p>
          <hr />
          <p>
            <strong>User:</strong> {appointment.userId}
          </p>
          <p>
            <strong>Lawyer:</strong> {appointment.lawyerId}
          </p>
          <p>
            <strong>Reason:</strong> {appointment.reason || '—'}
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          {role === 'user' && (
            <>
              {onReschedule && (
                <Button variant="secondary" onClick={() => onReschedule(appointment)}>
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button variant="destructive" onClick={() => onCancel(appointment)}>
                  Cancel
                </Button>
              )}
            </>
          )}

          {role === 'lawyer' && (
            <>
              {onApprove && (
                <Button variant="primary" onClick={() => onApprove(appointment)}>
                  Approve
                </Button>
              )}
              {onCancel && (
                <Button variant="destructive" onClick={() => onCancel(appointment)}>
                  Cancel
                </Button>
              )}
            </>
          )}

          {onDelete && (
            <Button variant="outline" onClick={() => onDelete(appointment)}>
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
