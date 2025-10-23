'use client';

import { SidebarFooter } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // <-- hook auth của bạn

export default function SidebarFooterMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // user: {name, email, avatar}

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center text-white gap-2 px-2 py-1 bg-orange-500 hover:bg-orange-300 rounded-md cursor-pointer">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold uppercase">
                {user?.fullName ? user.fullName.trim().charAt(0) : 'U'}
              </div>
            )}
            <div className="flex flex-col text-sm leading-tight text-left">
              <span className="font-medium">{user?.fullName || "User's Name"}</span>
              <span className="text-xs opacity-60">{user?.email || 'm@example.com'}</span>
            </div>
            <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-48 mb-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleNavigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>

          {/* <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
