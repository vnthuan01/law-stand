import HomePage from '@/pages/home/HomePage';
import AboutPage from '@/pages/about/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import AdminPage from '@/pages/user/admin/Dashboard';
import { UserRole } from '@/enums/UserRole';
// import LawyerPage from "../pages/LawyerPage";
// import StaffPage from "../pages/StaffPage";
import CustomerPage from '@/pages/user/ProfilePage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ResourcesPage from '@/pages/resources/ResourcesPage';
import ContactPage from '@/pages/contact/ContactPage';
import ProfilePage from '@/pages/user/ProfilePage';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    isProtected: false,
  },
  {
    path: '/about',
    element: <AboutPage />,
    isProtected: false,
  },
  {
    path: '/resources',
    element: <ResourcesPage />,
    isProtected: false,
  },
  {
    path: '/contact',
    element: <ContactPage />,
    isProtected: false,
  },
  //For all users
  // {
  //   path: '/profile',
  //   element: <ProfilePage />,
  //   isProtected: true,
  //   roles: [UserRole.Admin, UserRole.Customer, UserRole.Lawyer],
  // },
  {
    path: '/profile',
    element: <ProfilePage />,
    isProtected: false,
  },
  //Appointments Routes
  {
    path: '/appointments/history',
    element: <ProfilePage />,
    isProtected: false,
  },
  //Admin
  {
    path: '/admin',
    element: <AdminPage />,
    isProtected: true,
    roles: [UserRole.Admin],
  },
  //Staff
  //Lawyer
  //   {
  //     path: "/lawyer",
  //     element: <LawyerPage />,
  //     isProtected: true,
  //     roles: ["lawyer"],
  //   },
  //   {path: "/staff", element: <StaffPage />, isProtected: true, roles: ["staff"]},
  //Customer
  {
    path: '/customer',
    element: <CustomerPage />,
    isProtected: true,
    roles: [UserRole.Customer],
  },
  { path: '/login', element: <LoginPage />, isProtected: false },
  { path: '/register', element: <RegisterPage />, isProtected: false },
];
