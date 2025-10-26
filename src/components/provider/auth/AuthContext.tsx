import { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { LoginPayload, User } from '@/services/authService';
import { AuthContext } from './AuthContextType';
import { useNavigate } from 'react-router-dom';

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, login: loginMutate, logout: logoutMutate } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const navigate = useNavigate();
  //When user have role will navigate base on user's role
  useEffect(() => {
    setCurrentUser(user);

    if (user) {
      navigate('/');
    }
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
