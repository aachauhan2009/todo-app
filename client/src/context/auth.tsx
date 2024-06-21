// src/contexts/AuthContext.tsx
import { createContext, useState, ReactNode, useContext } from 'react';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AUTH_COOKIE = "isAuthenticated"
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies([AUTH_COOKIE])

  const login = () => {

    setCookie(AUTH_COOKIE, "true");
  };

  const logout = () => {
    removeCookie(AUTH_COOKIE);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: cookies[AUTH_COOKIE], login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

