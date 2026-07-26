import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { authService, AuthError, type AuthUser } from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>;
  logIn: (input: { email: string; password: string }) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signUp = useCallback(async (input: { name: string; email: string; password: string }) => {
    const account = await authService.signUp(input);
    setUser(account);
  }, []);

  const logIn = useCallback(async (input: { email: string; password: string }) => {
    const account = await authService.logIn(input);
    setUser(account);
  }, []);

  const logOut = useCallback(async () => {
    await authService.logOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, signUp, logIn, logOut }),
    [user, signUp, logIn, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { AuthError };
