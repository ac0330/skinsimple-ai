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

const ACCOUNT_STORAGE_KEY = 'skinsimple_mock_account';

// Persisted to localStorage on web only, so the mock account survives across tabs/refreshes
// (each tab is otherwise a separate JS runtime with its own in-memory state).
function readPersistedAccount(): StoredAccount | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredAccount) : null;
}

function persistAccount(account: StoredAccount | null): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (account) {
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  } else {
    window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  }
}

// In-memory single-account stand-in; swap for a real backend behind the same AuthService interface.
export class MockAuthService implements AuthService {
  private registeredAccount: StoredAccount | null = readPersistedAccount();

  async signUp(input: SignUpInput): Promise<AuthUser> {
    if (!EMAIL_RE.test(input.email)) {
      throw new AuthError('Enter a valid email address');
    }
    if (input.password.length < 6) {
      throw new AuthError('Password must be at least 6 characters');
    }
    this.registeredAccount = { ...input };
    persistAccount(this.registeredAccount);
    return { name: input.name, email: input.email };
  }

  async logIn(input: LogInInput): Promise<AuthUser> {
    if (!EMAIL_RE.test(input.email)) {
      throw new AuthError('Enter a valid email address');
    }
    if (input.password.length < 6) {
      throw new AuthError('Password must be at least 6 characters');
    }
    if (!this.registeredAccount) {
      throw new AuthError('No account found — create one first');
    }
    if (
      this.registeredAccount.email !== input.email ||
      this.registeredAccount.password !== input.password
    ) {
      throw new AuthError('Email or password doesn’t match our records');
    }
    return { name: this.registeredAccount.name, email: this.registeredAccount.email };
  }

  async logOut(): Promise<void> {}
}

export const authService: AuthService = new MockAuthService();
