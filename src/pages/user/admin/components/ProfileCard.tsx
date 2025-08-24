'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Music, Settings, Activity, FileWarning } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  badge: string;
  actions: { icon: React.ReactNode; label: string }[];
}

const profiles: Profile[] = [
  {
    id: 1,
    name: 'Jeff Walberg',
    role: 'Lead UX Developer',
    description: 'Passionate about creating seamless user experiences with modern tools.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    badge: 'Messages',
    actions: [
      { icon: <FileText className="w-5 h-5" />, label: 'View Profile' },
      { icon: <Music className="w-5 h-5" />, label: 'Leads Generated' },
    ],
  },
  {
    id: 2,
    name: 'John Rosenberg',
    role: 'Frontend Engineer',
    description: 'Loves building scalable interfaces with React & TypeScript.',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    badge: 'Profile',
    actions: [
      { icon: <FileText className="w-5 h-5" />, label: 'View Profile' },
      { icon: <FileWarning className="w-5 h-5" />, label: 'View Leads' },
    ],
  },
  {
    id: 3,
    name: 'Ruben Tillman',
    role: 'System Architect',
    description: 'Focused on reliability and performance at scale.',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    badge: 'Reports',
    actions: [
      { icon: <Activity className="w-5 h-5" />, label: 'Activity' },
      { icon: <FileWarning className="w-5 h-5" />, label: 'Reports' },
      { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    ],
  },
];

const ProfileCards: React.FC = () => {
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Profile Cards</h2>

      {/* Tabs (mock) */}
      <div className="flex justify-center gap-4 mb-8">
        {['Hour', 'Day', 'Week', 'Month'].map((tab) => (
          <Button key={tab} variant="secondary" className="rounded-full px-4">
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className="relative group rounded-2xl overflow-hidden shadow-md border transition 
            hover:shadow-xl hover:border-primary/40"
          >
            {/* Hiệu ứng lấp lánh khi hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
              <div className="absolute -inset-[200%] animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20" />
            </div>

            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white p-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-12 h-12 rounded-lg border-2 border-white"
                />
                <div>
                  <CardTitle className="text-white">{profile.name}</CardTitle>
                  <CardDescription className="text-white/80">{profile.role}</CardDescription>
                </div>
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-3 rounded-full shadow">
                {profile.badge}
              </Button>
            </CardHeader>

            {/* Body */}
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm mb-4">{profile.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {profile.actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 text-foreground hover:text-primary transition"
                  >
                    <div className="text-purple-600 dark:text-purple-400">{action.icon}</div>
                    <span className="text-sm">{action.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileCards;
