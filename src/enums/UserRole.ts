// src/enums/UserRole.ts
export const UserRole = {
  Admin: "admin",
  Customer: "customer",
  Staff: "staff",
  Lawyer: "lawyer",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
