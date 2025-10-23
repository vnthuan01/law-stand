import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/enums/UserRole';
import type { ReactNode } from 'react';

type RoleBasedRouteProps = {
  element: ReactNode;
  roles?: UserRole[];
};

export default function RoleBasedRoute({
  element,
  roles = [], // nếu undefined thì gán mảng rỗng
}: RoleBasedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // QUAN TRỌNG: Phải đợi loading xong mới kiểm tra auth
  // Nếu không, sẽ redirect về login ngay khi page load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Chỉ check role nếu route có yêu cầu role cụ thể
  if (roles.length > 0 && user.role && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
}
