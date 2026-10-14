/** What Gumroad's license check returns (only the fields used here). */
export interface Verification {
  success: boolean;
  message?: string;
  purchase?: { email?: string; refunded?: boolean; chargebacked?: boolean; disputed?: boolean };
}

export interface ClaimDeps {
  /** Asks Gumroad whether the key belongs to the product, without counting a use. */
  verify: (licenseKey: string) => Promise<Verification>;
  /** The account that already holds this key, if any. */
  ownerOf: (licenseKey: string) => Promise<string | null>;
  /** Records the key against the account. Throws if another account took the key meanwhile. */
  grant: (userId: string, licenseKey: string, email: string | null) => Promise<void>;
}

export type ClaimResult = { ok: true } | { ok: false; error: string };

/** Unlocks the full app for `userId` with a Gumroad license key. One key unlocks one account. */
export async function claimLicense(userId: string, rawKey: unknown, deps: ClaimDeps): Promise<ClaimResult> {
  const key = typeof rawKey === 'string' ? rawKey.trim() : '';
  if (!key) return { ok: false, error: 'Enter the license key from your Gumroad receipt.' };
  const owner = await deps.ownerOf(key);
  if (owner === userId) return { ok: true };
  if (owner) return { ok: false, error: 'This license key is already linked to another account. If that wasn’t you, contact support.' };
  const v = await deps.verify(key);
  if (!v.success || !v.purchase) return { ok: false, error: 'That license key wasn’t recognised. Copy it exactly from your Gumroad receipt.' };
  const p = v.purchase;
  if (p.refunded || p.chargebacked || p.disputed) return { ok: false, error: 'This purchase was refunded or disputed, so it no longer unlocks the app.' };
  try {
    await deps.grant(userId, key, p.email ?? null);
  } catch {
    return { ok: false, error: 'This license key is already linked to another account. If that wasn’t you, contact support.' };
  }
  return { ok: true };
}
