import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { formatCurrencyVND, formatCurrencyVNDSHORT } from '@/lib/utils';

//  Data mẫu
const chartData = [
  { name: 'Jan', visitors: 400, revenue: 24000000 },
  { name: 'Feb', visitors: 300, revenue: 13900000 },
  { name: 'Mar', visitors: 200, revenue: 9800000 },
  { name: 'Apr', visitors: 278, revenue: 39000000 },
  { name: 'May', visitors: 189, revenue: 48000000 },
  { name: 'Jun', visitors: 239, revenue: 38000000 },
  { name: 'Jul', visitors: 349, revenue: 43000000 },
];

const VisitorsRevenueStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Visitors */}
      <Card>
        <CardHeader>
          <CardTitle>Visitors</CardTitle>
          <CardDescription>Monthly active visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrencyVNDSHORT(value)} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'revenue' ? formatCurrencyVND(Number(value)) : value
                }
              />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Performance per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrencyVNDSHORT(value)} />

              <Tooltip formatter={(value) => formatCurrencyVND(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorsRevenueStats;
