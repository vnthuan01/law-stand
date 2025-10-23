// src/enums/UserRole.ts
export const UserRole = {
  Admin: 'Admin',
  User: 'User',
  Staff: 'Staff',
  Lawyer: 'Lawyer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
