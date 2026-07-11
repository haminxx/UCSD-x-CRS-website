/**
 * Staff portal auth (client-side, static site).
 * Invite codes are managed here — add/remove codes your team generates.
 * Accounts persist in the browser localStorage (per device).
 */

const STORAGE_KEY = "ucsdxcrs_staff_accounts_v1";

/** Valid invite codes staff can distribute. Remove a code after all slots are used if one-time. */
export const STAFF_INVITE_CODES = [
  "CRS-STAFF-2026",
  "UCSD-CRS-INVITE",
  "FALL26-TEAM",
] as const;

export type StaffAccount = {
  email: string;
  passwordHash: string;
  inviteCode: string;
  createdAt: number;
};

export type StaffAuthResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isUcsdEmail(email: string) {
  return /^[^\s@]+@ucsd\.edu$/i.test(email.trim());
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readAccounts(): StaffAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StaffAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StaffAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function isValidInviteCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return STAFF_INVITE_CODES.some((c) => c.toUpperCase() === normalized);
}

export async function createStaffAccount(
  email: string,
  password: string,
  inviteCode: string,
): Promise<StaffAuthResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!isUcsdEmail(normalizedEmail)) {
    return { ok: false, error: "Use your UCSD email (@ucsd.edu)." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (!isValidInviteCode(inviteCode)) {
    return { ok: false, error: "Invite code is invalid." };
  }

  const accounts = readAccounts();
  if (accounts.some((a) => a.email === normalizedEmail)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const normalizedInvite = inviteCode.trim().toUpperCase();
  const passwordHash = await hashPassword(password);

  accounts.push({
    email: normalizedEmail,
    passwordHash,
    inviteCode: normalizedInvite,
    createdAt: Date.now(),
  });
  writeAccounts(accounts);

  return { ok: true };
}

export async function signInStaff(
  email: string,
  password: string,
): Promise<StaffAuthResult & { email?: string }> {
  const normalizedEmail = normalizeEmail(email);

  if (!isUcsdEmail(normalizedEmail)) {
    return { ok: false, error: "Use your UCSD email (@ucsd.edu)." };
  }

  const account = readAccounts().find((a) => a.email === normalizedEmail);
  if (!account) {
    return { ok: false, error: "No account found for this email." };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: "Incorrect password." };
  }

  return { ok: true, email: normalizedEmail };
}

export async function recoverStaffPassword(
  email: string,
  inviteCode: string,
  newPassword: string,
): Promise<StaffAuthResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!isUcsdEmail(normalizedEmail)) {
    return { ok: false, error: "Use your UCSD email (@ucsd.edu)." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const accounts = readAccounts();
  const index = accounts.findIndex((a) => a.email === normalizedEmail);
  if (index === -1) {
    return { ok: false, error: "No account found for this email." };
  }

  const account = accounts[index]!;
  const normalizedInvite = inviteCode.trim().toUpperCase();
  if (account.inviteCode !== normalizedInvite) {
    return {
      ok: false,
      error: "Invite code does not match this account. Use the code from signup.",
    };
  }

  account.passwordHash = await hashPassword(newPassword);
  accounts[index] = account;
  writeAccounts(accounts);

  return { ok: true };
}
