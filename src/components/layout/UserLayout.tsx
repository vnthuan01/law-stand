'use client';

import { AppSidebar } from './sidebar/Sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLocation, Link } from 'react-router-dom';

import { menuConfig, type MenuItem } from './sidebar/MenuItemConfig';
import { useTranslation } from 'react-i18next';
import type { UserRole } from '@/enums/UserRole';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const rolePrefixMap: Record<UserRole, string> = {
  Staff: 'profile',
  Admin: 'dashboard',
  User: 'profile',
  Lawyer: 'profile',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const userRole = user?.role || 'User';

  const pathnames = location.pathname.split('/').filter(Boolean);

  const firstSegment = pathnames[0];
  if (firstSegment && rolePrefixMap[firstSegment as UserRole]) {
    pathnames[0] = rolePrefixMap[firstSegment as UserRole];
  }

  const menuItems: MenuItem[] = menuConfig[userRole] || [];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex w-full min-h-screen">
        {/* Sidebar left */}
        <AppSidebar items={menuItems} />

        <SidebarInset>
          {/* Topbar: trigger + breadcrumb */}
          <div className="flex h-12 items-center gap-2 border-b px-4">
            {/* Luôn hiển thị nút toggle sidebar */}
            <SidebarTrigger />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">{t('nav.home')}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {pathnames.map((segment, index) => {
                  const url = '/' + pathnames.slice(0, index + 1).join('/');
                  const isLast = index === pathnames.length - 1;

                  return (
                    <React.Fragment key={url}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>
                            {/* Dịch segment cuối cùng */}
                            {t(`paths.${segment}`, { defaultValue: segment.replace('-', ' ') })}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={url}>
                              {/* Dịch các segment ở giữa */}
                              {t(`paths.${segment}`, { defaultValue: segment.replace('-', ' ') })}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* content page */}
          <div className="p-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
