import HomePage from '@/pages/home/HomePage';
import AboutPage from '@/pages/about/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import AdminPage from '@/pages/user/admin/Dashboard';
import { UserRole } from '@/enums/UserRole';
// import LawyerPage from "../pages/LawyerPage";
import AddServicePage from '../pages/user/staff/AddServicePage';
import EditServicePage from '@/pages/user/staff/EditService';
import CustomerPage from '@/pages/user/ProfilePage';
import ServiceManagement from '@/pages/user/admin/ServiceManagement';
import SlotManagement from '@/pages/user/admin/SlotManagement';
import RegisterPage from '@/pages/auth/RegisterPage';
import ResourcesPage from '@/pages/resources/ResourcesPage';
import AllLastestUpdateLaw from '@/pages/resources/all/AllLastestUpdateLaw';
import ResourceDetail from '@/pages/resources/details/ResourceDetail';
import ContactPage from '@/pages/contact/ContactPage';
import ProfilePage from '@/pages/user/ProfilePage';
import BookingPage from '@/pages/booking/BookingPage';
import UserAppointmentsPage from '@/pages/appointments/UserAppointmentsPage';
import LawyerAppointmentsPage from '@/pages/appointments/LawyerAppointmentsPage';
import ChatGPTLikePage from '@/pages/chatbot/ChatBotPage';
import PricingPage from '@/pages/package/PremuimPage';
import UserManagement from '@/pages/user/admin/UserManagement';
import PlanManagement from '@/pages/user/admin/PlanManagement';
import MyPackagesPage from '@/pages/user/MyPackagesPage';

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
  {
    path: '/service-package',
    element: <PricingPage />,
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
  {
    path: '/profile',
    element: <ProfilePage />,
    isProtected: true,
    roles: [UserRole.Admin, UserRole.User, UserRole.Lawyer],
  },

  //Appointments Routes
  {
    path: '/customer/appointments',
    element: <UserAppointmentsPage />,
    isProtected: true,
    roles: [UserRole.User],
  },
  {
    path: '/lawyer/appointments',
    element: <LawyerAppointmentsPage />,
    isProtected: true,
    roles: [UserRole.Lawyer],
  },
  //Admin
  {
    path: '/dashboard',
    element: <AdminPage />,
    isProtected: true,
    roles: [UserRole.Admin],
  },
  {
    path: '/admin/services',
    element: <ServiceManagement />,
    isProtected: true,
    roles: [UserRole.Admin],
  },
  {
    path: '/admin/slots',
    element: <SlotManagement />,
    isProtected: true,
    roles: [UserRole.Admin],
  },
  {
    path: '/admin/user-management',
    element: <UserManagement />,
    isProtected: true,
    roles: [UserRole.Admin],
  },
  {
    path: '/admin/plan-management',
    element: <PlanManagement />,
    isProtected: true,
    roles: [UserRole.Admin],
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
    roles: [UserRole.User],
  },
  {
    path: '/chat-with-ai-supported',
    element: <ChatGPTLikePage />,
    isProtected: true,
    roles: [UserRole.User],
  },
  {
    path: '/package-type',
    element: <MyPackagesPage />,
    isProtected: true,
    roles: [UserRole.User],
  },

  //Authencication
  { path: '/login', element: <LoginPage />, isProtected: false },
  { path: '/register', element: <RegisterPage />, isProtected: false },
];
