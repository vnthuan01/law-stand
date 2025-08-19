import { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { LoginPayload, User } from '@/services/authService';
import { AuthContext } from './AuthContextType';

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, login: loginMutate, logout: logoutMutate } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const login = (data: LoginPayload) => loginMutate(data);

  const logout = () => {
    logoutMutate();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
