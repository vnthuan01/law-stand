'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from 'recharts';

// Dữ liệu mẫu Revenue theo Plan
const revenueData = [
  { name: 'Jan', Free: 400, VIP: 240, Premium: 320 },
  { name: 'Feb', Free: 300, VIP: 139, Premium: 221 },
  { name: 'Mar', Free: 200, VIP: 980, Premium: 229 },
  { name: 'Apr', Free: 278, VIP: 390, Premium: 200 },
  { name: 'May', Free: 189, VIP: 480, Premium: 218 },
];

// ✅ Dữ liệu mẫu Weekly Bookings
const bookingData = [
  { name: 'Week 1', bookings: 50 },
  { name: 'Week 2', bookings: 80 },
  { name: 'Week 3', bookings: 65 },
  { name: 'Week 4', bookings: 120 },
];

const PlanStats = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Revenue by Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Free" fill="#10b981" />
              <Bar dataKey="VIP" fill="#6366f1" />
              <Bar dataKey="Premium" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanStats;
