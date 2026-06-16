export const USER_ROLES = [
  'student',
  'officer_finance',
  'officer_library',
  'officer_hostel',
  'registrar',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'disabled';
}