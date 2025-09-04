'use client';

import { AppSidebar } from './sidebar/Sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLocation, Link } from 'react-router-dom';
import { menuConfig } from './sidebar/MenuItemConfig';
import type { UserRole } from '@/enums/UserRole';

const userRole: UserRole = 'customer';

// Role prefix mapping (có thể mở rộng thêm nếu sau này có role khác)
const rolePrefixMap: Record<UserRole, string> = {
  staff: 'profile',
  admin: 'dashboard',
  customer: 'profile',
  lawyer: 'profile',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Tách pathname
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Nếu có role trong path (vd: /staff/...) thì thay bằng route thực tế
  if (pathnames[0] && rolePrefixMap[pathnames[0] as UserRole]) {
    pathnames[0] = rolePrefixMap[pathnames[0] as UserRole];
  }

  const menuItems = menuConfig[userRole];

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
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {pathnames.map((segment, index) => {
                  const url = '/' + pathnames.slice(0, index + 1).join('/');
                  const isLast = index === pathnames.length - 1;

                  return (
                    <div className="flex items-center" key={url}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <span className="font-medium capitalize">{segment}</span>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={url} className="capitalize">
                              {segment}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
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
