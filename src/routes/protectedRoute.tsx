import {Navigate} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth";
import {UserRole} from "@/enums/UserRole";
import type {ReactNode} from "react";

type RoleBasedRouteProps = {
  element: ReactNode;
  roles?: UserRole[];
};

export default function RoleBasedRoute({
  element,
  roles = [], // nếu undefined thì gán mảng rỗng
}: RoleBasedRouteProps) {
  const {isAuthenticated, role} = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return element;
}
