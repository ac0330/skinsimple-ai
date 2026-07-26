import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { Budget, SkinProfile, SkinType } from '../types/domain';

interface SkinProfileContextValue {
  profile: SkinProfile;
  setSkinType: (skinType: SkinType) => void;
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
  sensitive: null,
  concerns: [],
  otherConcern: '',
  budget: null,
};

const SkinProfileContext = createContext<SkinProfileContextValue | undefined>(undefined);

export function SkinProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SkinProfile>(initialProfile);
  const [otherSelected, setOtherSelectedState] = useState(false);

  const setSkinType = useCallback((skinType: SkinType) => {
    setProfile((prev) => ({ ...prev, skinType }));
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

  const isTypeStepValid = !!profile.skinType && profile.sensitive !== null;
  const isConcernsStepValid = otherSelected
    ? profile.otherConcern.trim().length > 0
    : profile.concerns.length > 0;
  const isBudgetStepValid = !!profile.budget;

  const skinTypeSummary = profile.skinType
    ? profile.skinType + (profile.sensitive ? ', Sensitive' : '')
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
