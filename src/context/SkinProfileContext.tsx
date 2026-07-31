import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from './AuthContext';
import type { AuthUser } from '../services/authService';
import type { Budget, SkinProfile, SkinType } from '../types/domain';

interface SkinProfileContextValue {
  profile: SkinProfile;
  setSkinType: (skinType: SkinType) => void;
  setOtherSkinType: (text: string) => void;
  setSensitive: (sensitive: boolean) => void;
  toggleConcern: (concern: string) => void;
  setOtherSelected: (selected: boolean) => void;
  setOtherConcern: (text: string) => void;
  setBudget: (budget: Budget) => void;
  isTypeStepValid: boolean;
  isConcernsStepValid: boolean;
  isBudgetStepValid: boolean;
  skinTypeSummary: string;
  concernsSummary: string;
  otherSelected: boolean;
}

const initialProfile: SkinProfile = {
  skinType: null,
  otherSkinType: '',
  sensitive: null,
  concerns: [],
  otherConcern: '',
  budget: null,
};

const SkinProfileContext = createContext<SkinProfileContextValue | undefined>(undefined);

const PROFILE_STORAGE_PREFIX = 'skinsimple_skin_profile';
// Old un-scoped key from before per-account profiles existed.
const LEGACY_GLOBAL_STORAGE_KEY = PROFILE_STORAGE_PREFIX;

interface StoredProfileState {
  profile: SkinProfile;
  otherSelected: boolean;
}

function storageKeyFor(user: AuthUser | null): string | null {
  return user ? `${PROFILE_STORAGE_PREFIX}:${user.email.trim().toLowerCase()}` : null;
}

// Persisted to localStorage on web only, scoped per logged-in account, so two accounts on the
// same browser never see each other's quiz answers. Not persisted while signed out (pre-signup
// quiz progress lives in memory only, same as before per-account scoping existed).
function readPersistedState(key: string): StoredProfileState | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as StoredProfileState) : null;
}

function persistState(key: string, state: StoredProfileState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(key, JSON.stringify(state));
}

// One-time upgrade path from the old single shared key (before accounts had separate profiles).
function readLegacyGlobalState(): StoredProfileState | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = window.localStorage.getItem(LEGACY_GLOBAL_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredProfileState) : null;
}

function loadInitialState(user: AuthUser | null): StoredProfileState {
  const key = storageKeyFor(user);
  if (!key) return { profile: initialProfile, otherSelected: false };

  const existing = readPersistedState(key);
  if (existing) return existing;

  const legacy = readLegacyGlobalState();
  if (legacy) {
    persistState(key, legacy);
    window.localStorage.removeItem(LEGACY_GLOBAL_STORAGE_KEY);
    return legacy;
  }

  return { profile: initialProfile, otherSelected: false };
}

export function SkinProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const initialStateRef = useRef<StoredProfileState | null>(null);
  if (initialStateRef.current === null) {
    initialStateRef.current = loadInitialState(user);
  }

  const [profile, setProfile] = useState<SkinProfile>(() => initialStateRef.current!.profile);
  const [otherSelected, setOtherSelectedState] = useState(() => initialStateRef.current!.otherSelected);

  const activeKeyRef = useRef<string | null>(storageKeyFor(user));
  const justSwitchedRef = useRef(false);

  const setSkinType = useCallback((skinType: SkinType) => {
    setProfile((prev) => ({ ...prev, skinType }));
  }, []);

  const setOtherSkinType = useCallback((text: string) => {
    setProfile((prev) => ({ ...prev, otherSkinType: text }));
  }, []);

  const setSensitive = useCallback((sensitive: boolean) => {
    setProfile((prev) => ({ ...prev, sensitive }));
  }, []);

  const toggleConcern = useCallback((concern: string) => {
    setProfile((prev) => {
      const has = prev.concerns.includes(concern);
      const concerns = has ? prev.concerns.filter((c) => c !== concern) : [...prev.concerns, concern];
      return { ...prev, concerns };
    });
  }, []);

  const setOtherSelected = useCallback((selected: boolean) => {
    setOtherSelectedState(selected);
  }, []);

  const setOtherConcern = useCallback((text: string) => {
    setProfile((prev) => ({ ...prev, otherConcern: text }));
  }, []);

  const setBudget = useCallback((budget: Budget) => {
    setProfile((prev) => ({ ...prev, budget }));
  }, []);

  // Runs when the signed-in account changes (login, logout, or a fresh signup). Loads that
  // account's saved profile, or — for a brand-new account — attaches whatever was just filled
  // in during the quiz to it. Guarded with justSwitchedRef so the effect below doesn't immediately
  // clobber this with the stale pre-switch profile in the same render pass.
  useEffect(() => {
    const nextKey = storageKeyFor(user);
    if (activeKeyRef.current === nextKey) return;
    activeKeyRef.current = nextKey;
    justSwitchedRef.current = true;

    if (!nextKey) {
      setProfile(initialProfile);
      setOtherSelectedState(false);
      return;
    }

    const stored = readPersistedState(nextKey);
    if (stored) {
      setProfile(stored.profile);
      setOtherSelectedState(stored.otherSelected);
    } else {
      persistState(nextKey, { profile, otherSelected });
    }
  }, [user]);

  useEffect(() => {
    if (justSwitchedRef.current) {
      justSwitchedRef.current = false;
      return;
    }
    const key = storageKeyFor(user);
    if (!key) return;
    persistState(key, { profile, otherSelected });
  }, [user, profile, otherSelected]);

  const isTypeStepValid =
    !!profile.skinType &&
    (profile.skinType !== 'Other' || profile.otherSkinType.trim().length > 0) &&
    profile.sensitive !== null;
  const isConcernsStepValid = otherSelected
    ? profile.otherConcern.trim().length > 0
    : profile.concerns.length > 0;
  const isBudgetStepValid = !!profile.budget;

  const skinTypeSummary = profile.skinType
    ? (profile.skinType === 'Other' ? profile.otherSkinType.trim() || 'Other' : profile.skinType) +
      (profile.sensitive ? ', Sensitive' : '')
    : 'Not set';

  const concernsSummary = useMemo(() => {
    const parts = [...profile.concerns];
    if (otherSelected && profile.otherConcern.trim()) parts.push(profile.otherConcern.trim());
    return parts.length ? parts.join(', ') : 'None set';
  }, [profile.concerns, otherSelected, profile.otherConcern]);

  const value = useMemo(
    () => ({
      profile,
      setSkinType,
      setOtherSkinType,
      setSensitive,
      toggleConcern,
      setOtherSelected,
      setOtherConcern,
      setBudget,
      isTypeStepValid,
      isConcernsStepValid,
      isBudgetStepValid,
      skinTypeSummary,
      concernsSummary,
      otherSelected,
    }),
    [
      profile,
      setSkinType,
      setOtherSkinType,
      setSensitive,
      toggleConcern,
      setOtherSelected,
      setOtherConcern,
      setBudget,
      isTypeStepValid,
      isConcernsStepValid,
      isBudgetStepValid,
      skinTypeSummary,
      concernsSummary,
      otherSelected,
    ],
  );

  return <SkinProfileContext.Provider value={value}>{children}</SkinProfileContext.Provider>;
}

export function useSkinProfile(): SkinProfileContextValue {
  const ctx = useContext(SkinProfileContext);
  if (!ctx) throw new Error('useSkinProfile must be used within a SkinProfileProvider');
  return ctx;
}
