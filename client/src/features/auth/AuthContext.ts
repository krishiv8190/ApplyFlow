import { createContext } from 'react';
import type { AuthUser, LoginInput, RegisterInput } from '../../api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
