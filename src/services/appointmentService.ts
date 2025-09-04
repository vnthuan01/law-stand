export type AppointmentStatus = 'pending' | 'approved' | 'canceled' | 'rescheduled';

export interface Appointment {
  id: string;
  userId: string;
  lawyerId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
}

export interface GetAppointmentsParams {
  dateISO: string;
  role: 'user' | 'lawyer';
  actorId: string;
}

export interface GetMonthAppointmentsParams {
  monthISO: string;
  role: 'user' | 'lawyer';
  actorId: string;
}

export const mockAppointments: Appointment[] = [
  // Ngày 5 - 1 appointment
  {
    id: 'apt-1',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-05T09:00:00', // 👈 không dùng new Date()
    endsAt: '2025-09-05T10:00:00',
    status: 'pending',
    notes: 'Consultation about contract',
  },
  // Ngày 10 - nhiều appointments
  {
    id: 'apt-2',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-10T14:00:00',
    endsAt: '2025-09-10T15:00:00',
    status: 'approved',
    notes: 'Case review',
  },
  {
    id: 'apt-3',
    userId: 'user-1',
    lawyerId: 'lawyer-2',
    startsAt: '2025-09-10T15:30:00',
    endsAt: '2025-09-10T16:30:00',
    status: 'pending',
    notes: 'Family law consultation',
  },
  {
    id: 'apt-4',
    userId: 'user-1',
    lawyerId: 'lawyer-3',
    startsAt: '2025-09-10T17:00:00',
    endsAt: '2025-09-10T18:00:00',
    status: 'canceled',
    notes: 'Cancelled meeting',
  },
  {
    id: 'apt-4',
    userId: 'user-1',
    lawyerId: 'lawyer-3',
    startsAt: '2025-09-10T17:00:00',
    endsAt: '2025-09-10T18:00:00',
    status: 'canceled',
    notes: 'Cancelled meeting',
  },
  {
    id: 'apt-4',
    userId: 'user-1',
    lawyerId: 'lawyer-3',
    startsAt: '2025-09-10T17:00:00',
    endsAt: '2025-09-10T18:00:00',
    status: 'canceled',
    notes: 'Cancelled meeting',
  },
  // Ngày 15 - 2 appointments
  {
    id: 'apt-5',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-15T11:00:00',
    endsAt: '2025-09-15T12:00:00',
    status: 'approved',
    notes: 'Business consultation',
  },
  {
    id: 'apt-6',
    userId: 'user-1',
    lawyerId: 'lawyer-2',
    startsAt: '2025-09-15T14:00:00',
    endsAt: '2025-09-15T15:30:00',
    status: 'pending',
    notes: 'Follow-up consultation',
  },
  // Ngày 20 - 1 appointment
  {
    id: 'apt-7',
    userId: 'user-1',
    lawyerId: 'lawyer-2',
    startsAt: '2025-09-20T10:00:00',
    endsAt: '2025-09-20T11:30:00',
    status: 'approved',
    notes: 'Immigration case',
  },
  // Ngày 25 - nhiều appointments
  {
    id: 'apt-8',
    userId: 'user-8',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-25T09:00:00',
    endsAt: '2025-09-25T10:00:00',
    status: 'approved',
    notes: 'Court preparation',
  },
  {
    id: 'apt-9',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-25T13:00:00',
    endsAt: '2025-09-25T14:00:00',
    status: 'pending',
    notes: 'Contract review',
  },
  {
    id: 'apt-10',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-25T13:00:00',
    endsAt: '2025-09-25T14:00:00',
    status: 'pending',
    notes: 'Contract review',
  },
  {
    id: 'apt-11',
    userId: 'user-9',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-25T13:00:00',
    endsAt: '2025-09-25T14:00:00',
    status: 'pending',
    notes: 'Contract review',
  },
  {
    id: 'apt-12',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-09-25T13:00:00',
    endsAt: '2025-09-25T14:00:00',
    status: 'pending',
    notes: 'Contract review',
  },
  // ================================
  // Tháng 10 - October
  // ================================
  {
    id: 'apt-13',
    userId: 'user-10',
    lawyerId: 'lawyer-2',
    startsAt: '2025-10-03T10:00:00',
    endsAt: '2025-10-03T11:00:00',
    status: 'approved',
    notes: 'Real estate consultation',
  },
  {
    id: 'apt-14',
    userId: 'user-11',
    lawyerId: 'lawyer-3',
    startsAt: '2025-10-08T14:00:00',
    endsAt: '2025-10-08T15:30:00',
    status: 'pending',
    notes: 'Criminal law discussion',
  },
  {
    id: 'apt-15',
    userId: 'user-1',
    lawyerId: 'lawyer-1',
    startsAt: '2025-10-15T09:00:00',
    endsAt: '2025-10-15T10:00:00',
    status: 'approved',
    notes: 'Startup legal advice',
  },
  {
    id: 'apt-16',
    userId: 'user-1',
    lawyerId: 'lawyer-2',
    startsAt: '2025-10-15T11:00:00',
    endsAt: '2025-10-15T12:00:00',
    status: 'pending',
    notes: 'Trademark consultation',
  },
  {
    id: 'apt-17',
    userId: 'user-14',
    lawyerId: 'lawyer-3',
    startsAt: '2025-10-22T16:00:00',
    endsAt: '2025-10-22T17:00:00',
    status: 'canceled',
    notes: 'Cancelled client meeting',
  },
  {
    id: 'apt-18',
    userId: 'user-15',
    lawyerId: 'lawyer-1',
    startsAt: '2025-10-29T15:00:00',
    endsAt: '2025-10-29T16:00:00',
    status: 'approved',
    notes: 'Mediation session',
  },

  // ================================
  // Tháng 11 - November
  // ================================
  {
    id: 'apt-19',
    userId: 'user-16',
    lawyerId: 'lawyer-1',
    startsAt: '2025-11-04T09:30:00',
    endsAt: '2025-11-04T10:30:00',
    status: 'approved',
    notes: 'Employment contract review',
  },
  {
    id: 'apt-20',
    userId: 'user-17',
    lawyerId: 'lawyer-2',
    startsAt: '2025-11-12T13:00:00',
    endsAt: '2025-11-12T14:00:00',
    status: 'pending',
    notes: 'Insurance dispute',
  },
  {
    id: 'apt-21',
    userId: 'user-18',
    lawyerId: 'lawyer-3',
    startsAt: '2025-11-18T11:00:00',
    endsAt: '2025-11-18T12:00:00',
    status: 'approved',
    notes: 'Civil case hearing preparation',
  },
  {
    id: 'apt-22',
    userId: 'user-19',
    lawyerId: 'lawyer-1',
    startsAt: '2025-11-25T15:30:00',
    endsAt: '2025-11-25T16:30:00',
    status: 'pending',
    notes: 'Partnership agreement',
  },
  {
    id: 'apt-23',
    userId: 'user-20',
    lawyerId: 'lawyer-2',
    startsAt: '2025-11-28T10:00:00',
    endsAt: '2025-11-28T11:00:00',
    status: 'approved',
    notes: 'Immigration paperwork',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appointmentService = {
  async getAppointmentsByDate(params: GetAppointmentsParams): Promise<Appointment[]> {
    await delay(200);
    const dateOnly = new Date(params.dateISO).toDateString();
    return mockAppointments.filter((a) => {
      const sameDay = new Date(a.startsAt).toDateString() === dateOnly;
      if (!sameDay) return false;
      return params.role === 'user' ? a.userId === params.actorId : a.lawyerId === params.actorId;
    });
  },

  async getAppointmentsByMonth(params: GetMonthAppointmentsParams): Promise<Appointment[]> {
    await delay(200);
    const base = new Date(params.monthISO);
    const month = base.getMonth();
    const year = base.getFullYear();
    return mockAppointments.filter((a) => {
      const d = new Date(a.startsAt);
      const sameMonth = d.getMonth() === month && d.getFullYear() === year;
      if (!sameMonth) return false;
      return params.role === 'user' ? a.userId === params.actorId : a.lawyerId === params.actorId;
    });
  },

  async rescheduleAppointment(
    id: string,
    startsAtISO: string,
    reason: string,
  ): Promise<Appointment> {
    await delay(200);
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    const durationMs =
      new Date(mockAppointments[index].endsAt).getTime() -
      new Date(mockAppointments[index].startsAt).getTime();
    const updated: Appointment = {
      ...mockAppointments[index],
      startsAt: startsAtISO,
      endsAt: new Date(new Date(startsAtISO).getTime() + durationMs).toISOString(),
      status: 'rescheduled',
      reason,
    };
    mockAppointments[index] = updated;
    return updated;
  },

  async cancelAppointment(id: string, reason: string): Promise<Appointment> {
    await delay(200);
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    const updated: Appointment = { ...mockAppointments[index], status: 'canceled', reason };
    mockAppointments[index] = updated;
    return updated;
  },

  async approveAppointment(id: string): Promise<Appointment> {
    await delay(200);
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    const updated: Appointment = { ...mockAppointments[index], status: 'approved' };
    mockAppointments[index] = updated;
    return updated;
  },
};

export type { Appointment as TAppointment };
