import HomePage from "@/pages/home/HomePage";
import AboutPage from "@/pages/about/AboutPage";
import LoginPage from "@/pages/auth/LoginPage";
import AdminPage from "@/pages/admin/AdminPage";
import {UserRole} from "@/enums/UserRole";
// import LawyerPage from "../pages/LawyerPage";
// import StaffPage from "../pages/StaffPage";
import CustomerPage from "@/pages/user/CustomerPage";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    isProtected: false,
  },
  {
    path: "/about",
    element: <AboutPage />,
    isProtected: false,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    isProtected: true,
    roles: [UserRole.Admin],
  },
  //   {
  //     path: "/lawyer",
  //     element: <LawyerPage />,
  //     isProtected: true,
  //     roles: ["lawyer"],
  //   },
  //   {path: "/staff", element: <StaffPage />, isProtected: true, roles: ["staff"]},
  {
    path: "/customer",
    element: <CustomerPage />,
    isProtected: true,
    roles: [UserRole.Customer],
  },
  {path: "/login", element: <LoginPage />, isProtected: false},
];
