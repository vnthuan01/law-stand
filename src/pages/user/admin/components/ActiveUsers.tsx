'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { formatCurrencyVND } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  plan: string;
  city: string;
  status: 'Online' | 'Offline' | 'Banned';
  bookings: number;
}

interface Contributor {
  id: number;
  name: string;
  plan: string;
  contribution: number;
  avatar: string;
  description: string;
}

const sampleUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  plan: i % 3 === 0 ? 'Premium' : i % 3 === 1 ? 'Gold' : 'Free',
  city: ['Hanoi', 'HCM', 'Da Nang', 'Hue'][i % 4],
  status: i % 5 === 0 ? 'Banned' : i % 2 === 0 ? 'Online' : 'Offline',
  bookings: Math.floor(Math.random() * 40),
}));

const sampleContributors: Contributor[] = [
  {
    id: 1,
    name: 'Nguyen Van A',
    plan: 'Premium',
    contribution: 2_500_000,
    avatar: 'https://i.pravatar.cc/100?img=1',
    description: 'Lawyer with over 10 years of experience in civil law.',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    plan: 'Gold',
    contribution: 1_500_000,
    avatar: 'https://i.pravatar.cc/100?img=2',
    description: 'Legal expert specializing in corporate contracts.',
  },
  {
    id: 3,
    name: 'Le Van C',
    plan: 'Free',
    contribution: 800_000,
    avatar: 'https://i.pravatar.cc/100?img=3',
    description: 'Law researcher contributing to academic materials.',
  },
  {
    id: 4,
    name: 'Pham Thi D',
    plan: 'Premium',
    contribution: 3_200_000,
    avatar: 'https://i.pravatar.cc/100?img=4',
    description: 'Experienced in intellectual property law.',
  },
  {
    id: 5,
    name: 'Hoang Van E',
    plan: 'Gold',
    contribution: 1_200_000,
    avatar: 'https://i.pravatar.cc/100?img=5',
    description: 'Specialist in tax and finance law.',
  },
  {
    id: 6,
    name: 'Nguyen Thi F',
    plan: 'Premium',
    contribution: 2_800_000,
    avatar: 'https://i.pravatar.cc/100?img=6',
    description: 'Corporate lawyer with a focus on mergers and acquisitions.',
  },
  {
    id: 7,
    name: 'Le Thi G',
    plan: 'Free',
    contribution: 950_000,
    avatar: 'https://i.pravatar.cc/100?img=7',
    description: 'Contributor of legal tutorials and guides.',
  },
  {
    id: 8,
    name: 'Tran Van H',
    plan: 'Gold',
    contribution: 1_800_000,
    avatar: 'https://i.pravatar.cc/100?img=8',
    description: 'Consultant in business compliance and contracts.',
  },
  {
    id: 9,
    name: 'Pham Van I',
    plan: 'Premium',
    contribution: 3_500_000,
    avatar: 'https://i.pravatar.cc/100?img=9',
    description: 'Specialist in criminal law and litigation.',
  },
  {
    id: 10,
    name: 'Hoang Thi J',
    plan: 'Free',
    contribution: 700_000,
    avatar: 'https://i.pravatar.cc/100?img=10',
    description: 'Legal researcher focused on human rights law.',
  },
];

const ActiveUsers = ({
  users = sampleUsers,
  activeUsers = 3,
  topContributors = sampleContributors,
}: {
  users?: User[];
  activeUsers?: number;
  topContributors?: Contributor[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoPage, setGotoPage] = useState('');
  const rowsPerPage = 6;

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const currentUsers = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: User Table */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <>
                {/* Scrollable table on mobile */}
                <div className="overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>#{u.id}</TableCell>
                          <TableCell>{u.name}</TableCell>
                          <TableCell className="font-semibold">{u.plan}</TableCell>
                          <TableCell>{u.city}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                u.status === 'Online'
                                  ? 'success'
                                  : u.status === 'Offline'
                                    ? 'warning'
                                    : 'destructive'
                              }
                            >
                              {u.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{u.bookings}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
                  <Pagination>
                    <PaginationContent className="flex flex-wrap gap-2">
                      {getPageNumbers().map((p, i) => (
                        <PaginationItem key={i}>
                          {p === '...' ? (
                            <span className="px-3">...</span>
                          ) : (
                            <Button
                              size="sm"
                              variant={currentPage === p ? 'primary' : 'outline'}
                              onClick={() => setCurrentPage(p as number)}
                            >
                              {p}
                            </Button>
                          )}
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                  </Pagination>

                  {/* Go to Page */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={gotoPage}
                      onChange={(e) => setGotoPage(e.target.value)}
                      placeholder="Page #"
                      className="w-24"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const pageNum = Number(gotoPage);
                        if (pageNum >= 1 && pageNum <= totalPages) {
                          setCurrentPage(pageNum);
                          setGotoPage('');
                        }
                      }}
                    >
                      Go
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No users available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Stats + Top Contributors */}
      <div className="space-y-6">
        <Card>
          <CardContent>
            <p className="text-lg font-medium">
              Active Users: <span className="text-green-600 font-bold">{activeUsers}</span>
            </p>
            <p className="text-gray-500 text-sm">(Total users online at the moment.)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[390px] overflow-y-auto">
            {topContributors.length > 0 ? (
              <ul className="space-y-4">
                {topContributors.map((u, i) => (
                  <li key={u.id} className="flex items-start gap-4 border-b pb-4 last:border-none">
                    {/* Avatar */}
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full border shadow"
                    />

                    {/* Info */}
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">
                        {i + 1}. {u.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{u.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant={
                            u.plan === 'Premium'
                              ? 'success'
                              : u.plan === 'Gold'
                                ? 'warning'
                                : 'destructive'
                          }
                        >
                          {u.plan}
                        </Badge>
                        <Badge
                          variant={
                            u.contribution >= 2_000_000
                              ? 'success'
                              : u.contribution >= 1_000_000
                                ? 'warning'
                                : 'info'
                          }
                        >
                          {u.contribution >= 2_000_000
                            ? 'VIP Contributor'
                            : u.contribution >= 1_000_000
                              ? 'Gold Supporter'
                              : 'Supporter'}
                        </Badge>
                      </div>
                    </div>

                    {/* Contribution */}
                    <span className="text-purple-700 font-bold text-lg">
                      {formatCurrencyVND(u.contribution)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No contributors yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActiveUsers;
