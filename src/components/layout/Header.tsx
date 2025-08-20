'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Earth, Menu, X, User, Settings, LogOut } from 'lucide-react';
import logo from '@/assets/law-firm-logo.png';
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
} from '@/components/ui/accordion-menu';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [lang, setLang] = useState<'EN' | 'VI'>('EN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleLang = () => setLang(lang === 'EN' ? 'VI' : 'EN');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-14 h-14 border border-gray-200 bg-white rounded-full flex items-center justify-center mr-3 overflow-hidden">
            <img src={logo} alt="Logo Law" className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
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

          {/* User Avatar + Language */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 relative" ref={menuRef}>
              <Avatar className="cursor-pointer" onClick={() => setIsMenuOpen((prev) => !prev)}>
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name || ''} />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                )}
                <AvatarStatus variant="online" />
              </Avatar>

              {/* Dropdown AccordionMenu */}
              {isMenuOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <AccordionMenu type="single" collapsible>
                    <AccordionMenuLabel className="px-4 py-2 text-sm font-semibold">
                      My Account
                    </AccordionMenuLabel>
                    <AccordionMenuGroup>
                      <AccordionMenuItem
                        value="profile"
                        onClick={() => {
                          navigate('/profile');
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </AccordionMenuItem>
                      <AccordionMenuItem
                        value="settings"
                        onClick={() => {
                          navigate('/settings');
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </AccordionMenuItem>
                      <AccordionMenuItem
                        value="logout"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2 text-red-600 font-semibold">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </AccordionMenuItem>
                    </AccordionMenuGroup>
                  </AccordionMenu>
                </div>
              )}

              {/* Language toggle */}

              <div
                className="flex items-center space-x-1 cursor-pointer border rounded-md px-2 py-1 bg-gray-100"
                onClick={toggleLang}
              >
                <Earth className="size-4" />
                <span className="text-sm">{lang}</span>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                size="md"
                className="px-6 py-2 rounded-lg"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
              <Button
                variant="orange"
                size="md"
                className="px-6 py-2 rounded-lg"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Logo Law" className="max-w-full max-h-full object-contain" />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation Links */}
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

            {/* Footer: Avatar / Login */}

            <div className="px-6 py-4 border-t">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Avatar className="cursor-pointer">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
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
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full rounded-lg"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                  <Button
                    variant="orange"
                    size="md"
                    className="w-full rounded-lg"
                    onClick={() => navigate('/login')}
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
