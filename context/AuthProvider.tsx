import { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';

type AuthContextType = {
  signIn: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const signIn = () => {
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}