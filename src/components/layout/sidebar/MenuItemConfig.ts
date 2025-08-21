// src/config/menuConfig.ts

import type { UserRole } from '@/enums/UserRole';
import type { LucideIcon } from 'lucide-react';

import {
  LayoutDashboard,
  Calendar,
  History,
  Edit,
  CreditCard,
  ReceiptText,
  Briefcase,
  FileEdit,
  Eye,
  Bookmark,
  Package,
  MessageSquare,
  Users,
} from 'lucide-react';

export interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
  icon?: LucideIcon;
}

export const menuConfig: Record<UserRole, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      children: [
        { label: 'History', path: '/appointments/history', icon: History },
        { label: 'Edit', path: '/appointments/edit', icon: Edit },
      ],
    },
    {
      label: 'Payments',
      path: '/payments',
      icon: CreditCard,
      children: [{ label: 'History', path: '/payments/history', icon: ReceiptText }],
    },
    {
      label: 'Services',
      path: '/services',
      icon: Briefcase,
      children: [
        { label: 'Edit', path: '/services/edit', icon: FileEdit },
        { label: 'View', path: '/services/view', icon: Eye },
      ],
    },
  ],

  customer: [
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      children: [{ label: 'History', path: '/appointments/history', icon: History }],
    },
    { label: 'Saved Services', path: '/saved-services', icon: Bookmark },
    { label: 'Package Type', path: '/package-type', icon: Package },
    { label: 'Chat History', path: '/chat-history', icon: MessageSquare },
  ],

  lawyer: [
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      children: [
        { label: 'History', path: '/appointments/history', icon: History },
        { label: 'Edit', path: '/appointments/edit', icon: Edit },
      ],
    },
    {
      label: 'Consultant Management',
      path: '/consultant-management',
      icon: Users,
    },
  ],

  staff: [
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      children: [
        { label: 'History', path: '/appointments/history', icon: History },
        { label: 'Edit', path: '/appointments/edit', icon: Edit },
      ],
    },
    {
      label: 'Consultant Management',
      path: '/consultant-management',
      icon: Users,
    },
  ],
};
