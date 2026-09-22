import { type PropsWithChildren, useState } from 'react';

import {
  loginUser,
  registerUser,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from '../../api/auth';

import { AuthContext } from './AuthContext';

const TOKEN_KEY = 'applyflow_token';
const USER_KEY = 'applyflow_user';

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  async function login(input: LoginInput) {
    const result = await loginUser(input);

    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));

    setToken(result.token);
    setUser(result.user);
  }

  async function register(input: RegisterInput) {
    const registeredUser = await registerUser(input);
    setUser(registeredUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
