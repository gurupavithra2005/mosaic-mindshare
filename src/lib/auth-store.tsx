import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Frontend-only accounts. Everything lives in localStorage — there is no
 * server, no database and no network call anywhere in this file.
 */

export interface Account {
  id: string;
  name: string;
  email: string;
  /** Obfuscated locally so the raw string isn't sitting in storage. */
  secret: string;
  initials: string;
  createdAt: string;
}

const ACCOUNTS_KEY = "mosaic.accounts.v1";
const SESSION_KEY = "mosaic.session.v1";

const scramble = (s: string) =>
  Array.from(s)
    .map((c) => String.fromCharCode(c.charCodeAt(0) ^ 42))
    .join("");

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "ME";

interface AuthValue {
  account: Account | null;
  accountId: string;
  hydrated: boolean;
  signUp: (input: { name: string; email: string; password: string }) => { error?: string };
  signIn: (input: { email: string; password: string }) => { error?: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function readAccounts(): Account[] {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as Account[];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const id = window.localStorage.getItem(SESSION_KEY);
      if (id) setAccount(readAccounts().find((a) => a.id === id) ?? null);
    } catch {
      /* storage unavailable — browse as a guest */
    }
    setHydrated(true);
  }, []);

  const persistSession = useCallback((next: Account | null) => {
    setAccount(next);
    try {
      if (next) window.localStorage.setItem(SESSION_KEY, next.id);
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      account,
      accountId: account?.id ?? "guest",
      hydrated,
      signUp: ({ name, email, password }) => {
        const clean = email.trim().toLowerCase();
        if (!name.trim()) return { error: "Please add your name." };
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { error: "That email doesn't look right." };
        if (password.length < 6) return { error: "Use at least 6 characters for your password." };
        const accounts = readAccounts();
        if (accounts.some((a) => a.email === clean)) return { error: "An account with this email already exists." };
        const next: Account = {
          id: `acc-${Math.random().toString(36).slice(2, 10)}`,
          name: name.trim(),
          email: clean,
          secret: scramble(password),
          initials: initialsOf(name),
          createdAt: new Date().toISOString(),
        };
        try {
          window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, next]));
        } catch {
          /* ignore */
        }
        persistSession(next);
        return {};
      },
      signIn: ({ email, password }) => {
        const clean = email.trim().toLowerCase();
        const found = readAccounts().find((a) => a.email === clean);
        if (!found || found.secret !== scramble(password)) return { error: "Email or password is incorrect." };
        persistSession(found);
        return {};
      },
      signOut: () => persistSession(null),
    }),
    [account, hydrated, persistSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
