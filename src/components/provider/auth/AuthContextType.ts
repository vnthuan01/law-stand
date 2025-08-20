import { createContext } from 'react';
import type { LoginPayload, User } from '@/services/authService';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
