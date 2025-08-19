'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Earth, Menu, X } from 'lucide-react';
import logo from '@/assets/law-firm-logo.png';
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const [lang, setLang] = useState<'EN' | 'VI'>('EN');
  const [isOpen, setIsOpen] = useState(false);

  const toggleLang = () => setLang(lang === 'EN' ? 'VI' : 'EN');
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-14 h-14 border boder-gray bg-white rounded-full flex items-center justify-center mr-3 overflow-hidden">
            <img src={logo} alt="Logo Law" className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Navigation luôn hiển thị */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/about">About Us</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/resources">Resources</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Nếu login thì hiển thị Avatar + Language toggle */}
          {isAuthenticated ? (
            <>
              <Avatar className="cursor-pointer">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                )}
                <AvatarStatus variant="online" />
              </Avatar>

              <div
                className="flex items-center space-x-1 cursor-pointer border rounded-md px-2 py-1 bg-gray-100"
                onClick={toggleLang}
              >
                <Earth className="size-4" />
                <span className="text-sm">{lang}</span>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" size="md" className="px-6 py-2 rounded-lg">
                Register
              </Button>
              <Button
                variant="orange"
                size="md"
                className="px-6 py-2 rounded-lg"
                onClick={() => login({ email: 'test@test.com', password: '123456' })}
              >
                Login
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)}></div>

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            {/* Sidebar Header with Logo + Close */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="w-12 h-12 bg-white border border-gray rounded-full flex items-center justify-center mr-3 overflow-hidden">
                <img src={logo} alt="Logo Law" className="max-w-full max-h-full object-contain" />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Sidebar Nav */}
            <div className="flex-1 px-6 py-6 space-y-4">
              <Link to="/about" className="block text-lg font-medium text-gray-700">
                About Us
              </Link>
              <Link to="/resources" className="block text-lg font-medium text-gray-700">
                Resources
              </Link>
              <Link to="/contact" className="block text-lg font-medium text-gray-700">
                Contact
              </Link>
            </div>

            {/* Sidebar Footer */}
            <div className="px-6 py-4 border-t">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Avatar className="cursor-pointer">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    )}
                    <AvatarStatus variant="online" />
                  </Avatar>
                  <div
                    className="flex items-center space-x-1 cursor-pointer border rounded-md px-2 py-1 bg-gray-100"
                    onClick={toggleLang}
                  >
                    <Earth className="size-4" />
                    <span className="text-sm">{lang}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" size="md" className="w-full rounded-lg">
                    Register
                  </Button>
                  <Button
                    variant="orange"
                    size="md"
                    className="w-full rounded-lg"
                    onClick={() => login({ email: 'test@test.com', password: '123456' })}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
