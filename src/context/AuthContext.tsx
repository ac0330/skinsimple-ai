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

const SESSION_STORAGE_KEY = 'skinsimple_mock_session';

// Persisted to localStorage on web only, so a logged-in session survives across tabs/refreshes.
function readPersistedUser(): AuthUser | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

function persistUser(user: AuthUser | null): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (user) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readPersistedUser());

  const signUp = useCallback(async (input: { name: string; email: string; password: string }) => {
    const account = await authService.signUp(input);
    setUser(account);
    persistUser(account);
  }, []);

  const logIn = useCallback(async (input: { email: string; password: string }) => {
    const account = await authService.logIn(input);
    setUser(account);
    persistUser(account);
  }, []);

  const logOut = useCallback(async () => {
    await authService.logOut();
    setUser(null);
    persistUser(null);
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
