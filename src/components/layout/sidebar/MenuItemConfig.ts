// src/config/menuConfig.ts

import type { UserRole } from '@/enums/UserRole';
import type { LucideIcon } from 'lucide-react';

import {
  LayoutDashboard,
  Calendar,
  History,
  Edit,
  Briefcase,
  Bookmark,
  Package,
  Users,
  Bot,
} from 'lucide-react';

export interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
  icon?: LucideIcon;
}

export const menuConfig: Record<UserRole, MenuItem[]> = {
  Admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Service Management',
      path: '/admin/services',
      icon: Briefcase,
    },
    {
      label: 'Slot Management',
      path: '/admin/slots',
      icon: Calendar,
    },
    {
      label: 'User Management',
      path: '/admin/user-management',
      icon: Users,
    },
    // {
    //   label: 'Payments',
    //   path: '/payments',
    //   icon: CreditCard,
    //   children: [{ label: 'History', path: '/payments/history', icon: ReceiptText }],
    // },
  ],

  User: [
    {
      label: 'Appointments',
      path: '/customer/appointments',
      icon: Calendar,
      children: [{ label: 'History', path: '/customer/appointments/', icon: History }],
    },
    { label: 'Saved Services', path: '/saved-services', icon: Bookmark },
    { label: 'Package Type', path: '/package-type', icon: Package },
    { label: 'Chat With AI', path: '/chat-with-ai-supported', icon: Bot },
  ],

  Lawyer: [
    {
      label: 'Appointments',
      path: '/lawyer/appointments',
      icon: Calendar,
      children: [{ label: 'History', path: '/lawyer/appointments/', icon: History }],
    },
    {
      label: 'Consultant Management',
      path: '/consultant-management',
      icon: Users,
    },
  ],

  Staff: [
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
