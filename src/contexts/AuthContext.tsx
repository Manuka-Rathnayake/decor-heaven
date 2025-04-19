
import { createContext, useContext, useState, ReactNode } from 'react';
import { Designer } from '../types';

interface AuthContextType {
  designer: Designer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock designer for demonstration
const mockDesigner: Designer = {
  id: '1',
  name: 'Alex Designer',
  email: 'designer@example.com',
  role: 'senior',
  avatar: 'https://i.pravatar.cc/150?img=11'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [designer, setDesigner] = useState<Designer | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication logic
    if (email === 'designer@example.com' && password === 'password') {
      setDesigner(mockDesigner);
      return true;
    }
    return false;
  };

  const logout = () => {
    setDesigner(null);
  };

  const isAuthenticated = designer !== null;

  return (
    <AuthContext.Provider
      value={{
        designer,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
