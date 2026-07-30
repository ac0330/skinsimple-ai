export interface AuthUser {
  name: string;
  email: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface LogInInput {
  email: string;
  password: string;
}

export class AuthError extends Error {}

export interface AuthService {
  signUp(input: SignUpInput): Promise<AuthUser>;
  logIn(input: LogInInput): Promise<AuthUser>;
  logOut(): Promise<void>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

type StoredAccount = SignUpInput & { name: string };

const ACCOUNTS_STORAGE_KEY = 'skinsimple_mock_accounts';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Persisted to localStorage on web only, so accounts survive across tabs/refreshes
// (each tab is otherwise a separate JS runtime with its own in-memory state).
function readPersistedAccounts(): Record<string, StoredAccount> {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Record<string, StoredAccount>) : {};
}

function persistAccounts(accounts: Record<string, StoredAccount>): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

// In-memory multi-account stand-in, keyed by email; swap for a real backend behind the same AuthService interface.
// `accounts` re-syncs from localStorage on every call (not just once at construction) so accounts created
// in other tabs are visible immediately — on native, where there's no localStorage, this is a no-op and the
// in-memory map is the only store, matching the existing "no persistence across app restarts" behavior there.
export class MockAuthService implements AuthService {
  private accounts: Record<string, StoredAccount> = readPersistedAccounts();

  private syncAccounts(): Record<string, StoredAccount> {
    this.accounts = { ...this.accounts, ...readPersistedAccounts() };
    return this.accounts;
  }

  async signUp(input: SignUpInput): Promise<AuthUser> {
    if (!EMAIL_RE.test(input.email)) {
      throw new AuthError('Enter a valid email address');
    }
    if (input.password.length < 6) {
      throw new AuthError('Password must be at least 6 characters');
    }
    const accounts = this.syncAccounts();
    const key = normalizeEmail(input.email);
    if (accounts[key]) {
      throw new AuthError('An account with this email already exists');
    }
    accounts[key] = { ...input };
    persistAccounts(accounts);
    return { name: input.name, email: input.email };
  }

  async logIn(input: LogInInput): Promise<AuthUser> {
    if (!EMAIL_RE.test(input.email)) {
      throw new AuthError('Enter a valid email address');
    }
    if (input.password.length < 6) {
      throw new AuthError('Password must be at least 6 characters');
    }
    const account = this.syncAccounts()[normalizeEmail(input.email)];
    if (!account || account.password !== input.password) {
      throw new AuthError('Email or password doesn’t match our records');
    }
    return { name: account.name, email: account.email };
  }

  async logOut(): Promise<void> {}
}

export const authService: AuthService = new MockAuthService();
