import HomePage from '@/pages/home/HomePage';
import AboutPage from '@/pages/about/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import AdminPage from '@/pages/user/admin/Dashboard';
import { UserRole } from '@/enums/UserRole';
// import LawyerPage from "../pages/LawyerPage";
import AddServicePage from '../pages/user/staff/AddServicePage';
import EditServicePage from '@/pages/user/staff/EditService';
import CustomerPage from '@/pages/user/ProfilePage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ResourcesPage from '@/pages/resources/ResourcesPage';
import AllLastestUpdateLaw from '@/pages/resources/all/AllLastestUpdateLaw';
import ResourceDetail from '@/pages/resources/details/ResourceDetail';
import ContactPage from '@/pages/contact/ContactPage';
import ProfilePage from '@/pages/user/ProfilePage';
import BookingPage from '@/pages/booking/BookingPage';

export const routes = [
  //Public routes
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

  //Resource Page
  //======================================
  {
    path: '/resources',
    element: <ResourcesPage />,
    isProtected: false,
  },
  {
    path: '/resources/updates',
    element: <AllLastestUpdateLaw />,
    isProtected: false,
  },
  {
    path: '/resources/law-detail/:id',
    element: <ResourceDetail />,
    isProtected: false,
  },
  {
    path: 'resources/blog-detail/:id',
    element: <ResourceDetail />,
    isProtected: false,
  },
  //===================================

  {
    path: '/contact',
    element: <ContactPage />,
    isProtected: false,
  },
  {
    path: '/booking',
    element: <BookingPage />,
    isProtected: false,
  },
  //For all users is authenticated
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
  // {
  //   path: '/admin',
  //   element: <AdminPage />,
  //   isProtected: true,
  //   roles: [UserRole.Admin],
  // },
  {
    path: '/dashboard',
    element: <AdminPage />,
    isProtected: false,
    // roles: [UserRole.Admin],
  },
  //Staff
  {
    path: '/staff/add-service',
    element: <AddServicePage />,
    isProtected: false,
    // roles: [UserRole.Staff],
  },
  {
    path: '/staff/edit-service/:id',
    element: <EditServicePage />,
    isProtected: false,
    // roles: [UserRole.Staff],
  },
  //Lawyer

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
