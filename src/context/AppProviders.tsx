import React from 'react';

import { AuthProvider } from './AuthContext';
import { SkinProfileProvider } from './SkinProfileContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SkinProfileProvider>{children}</SkinProfileProvider>
    </AuthProvider>
  );
}
