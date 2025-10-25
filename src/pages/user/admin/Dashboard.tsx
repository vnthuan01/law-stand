import { useEffect, useState } from 'react';
import { LayoutDashboardIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileCards from './components/ProfileCard';
import ActiveUsers from './components/ActiveUsers';
import PlanStats from './components/PlanStats';
import VisitorsRevenueStats from './components/VisitorsRevenueStats';
import { formatCurrencyVND } from '@/lib/utils';
import Layout from '@/components/layout/UserLayout';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Giả lập fetch API
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2s loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboardIcon />
          Dashboard
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Users" value={200} change="-5% this month" />
            <StatCard title="Revenue" value={32000000} change="+12% YoY" positive money />
            <StatCard title="Growth" value={15} change="vs last year" positive percent />
          </>
        )}
      </div>

      {/* Charts */}
      {loading ? <SkeletonChart /> : <VisitorsRevenueStats />}

      {/* Revenue by Plan & Weekly Bookings */}
      <div className="mt-6">{loading ? <SkeletonChart /> : <PlanStats />}</div>

      {/* Active Users */}
      <div className="mt-6">{loading ? <SkeletonChart /> : <ActiveUsers />}</div>

      {/* Profile of users */}
      <div className="mt-6">{loading ? <SkeletonList /> : <ProfileCards />}</div>
    </Layout>
  );
}

// --------- Reusable Stat Card (with Badge) ----------
function StatCard({
  title,
  value,
  change,
  positive,
  money,
  percent,
}: {
  title: string;
  value: number;
  change: string;
  positive?: boolean;
  money?: boolean; // Nếu true thì format VNĐ
  percent?: boolean; // Nếu true thì thêm dấu %
}) {
  const displayValue = money
    ? formatCurrencyVND(value)
    : percent
      ? `${value}%`
      : value.toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{change}</CardDescription>
        </div>
        <Badge
          variant={positive ? 'info' : 'destructive'}
          className={`text-xs px-2 py-1 ${
            positive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
          }`}
        >
          {positive ? '↑' : '↓'} {change}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{displayValue}</p>
      </CardContent>
    </Card>
  );
}

// -------- Skeleton Components --------
function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
      </CardContent>
    </Card>
  );
}

function SkeletonChart() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function SkeletonList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-12 w-12 rounded-full mb-2" />
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
