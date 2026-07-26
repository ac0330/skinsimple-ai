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

// In-memory single-account stand-in; swap for a real backend behind the same AuthService interface.
export class MockAuthService implements AuthService {
  private registeredAccount: (SignUpInput & { name: string }) | null = null;

  async signUp(input: SignUpInput): Promise<AuthUser> {
    if (!EMAIL_RE.test(input.email)) {
      throw new AuthError('Enter a valid email address');
    }
    if (input.password.length < 6) {
      throw new AuthError('Password must be at least 6 characters');
    }
    this.registeredAccount = { ...input };
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
