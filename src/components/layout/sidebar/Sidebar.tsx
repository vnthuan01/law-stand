'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';

import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/law-firm-logo.png';
import type { MenuItem } from './MenuItemConfig';
import SidebarFooterMenu from './SideBarFooter';

interface AppSidebarProps {
  items: MenuItem[];
}

export function AppSidebar({ items }: AppSidebarProps) {
  const navigate = useNavigate();
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between mx-auto">
          <div>
            <img
              src={logo}
              alt="Logo Law"
              className="max-w-32 max-h-28 object-contain cursor-pointer rounded-full border border-black"
              onClick={() => navigate('/')}
            />
            <p className="font-medium text-center">Lawstand Inc</p>
            <p className="text-xs text-muted-foreground text-center">A legal digital platform</p>
          </div>
        </div>
        <hr />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  {item.children ? (
                    <Collapsible defaultOpen className="w-full">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.label}
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6">
                        <SidebarMenu>
                          {item.children.map((child) => (
                            <SidebarMenuItem key={child.label}>
                              <SidebarMenuButton asChild>
                                <Link to={child.path || '#'}>
                                  {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                                  {child.label}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={item.path || '#'}>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooterMenu />
    </Sidebar>
  );
}
