import {UserRole} from "@/enums/UserRole";
/**
 * Check xem role user có hợp lệ với route không
 */
export function checkRole(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole);
}
