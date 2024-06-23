import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, ReactNode, useContext } from 'react';

interface IUser {
  userId: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useQuery<IUser>({
    queryFn: () => axios.get<IUser>("/api/auth/user").then(data => data.data),
    queryKey: ["user"],
  });

  const logout = () => {
    axios.post("/api/auth/logout").then(() => {
      queryClient.invalidateQueries({
        queryKey: ["user"]
      });
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !isError && !!user?.userId, logout }}>
      {isLoading ? <div>Loading...</div> : children}
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

