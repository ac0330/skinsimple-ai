import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { authService, AuthError, type AuthUser } from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>;
  logIn: (input: { email: string; password: string }) => Promise<void>;
  logOut: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_STORAGE_KEY = 'skinsimple_mock_session';

// Persisted to sessionStorage (not localStorage) on web, so each tab keeps its own independent
// login — two tabs can be signed into two different accounts at once without one overwriting the
// other's session. sessionStorage still survives refreshes within that same tab, just not across
// brand-new tabs (which start signed out, same as opening the site on a second device would).
function readPersistedUser(): AuthUser | null {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;
  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

function persistUser(user: AuthUser | null): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  if (user) {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
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

  const updateName = useCallback(
    async (name: string) => {
      if (!user) return;
      const account = await authService.updateName(user.email, name);
      setUser(account);
      persistUser(account);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, signUp, logIn, logOut, updateName }),
    [user, signUp, logIn, logOut, updateName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { AuthError };
