import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { usernamePool } from './usernamePool';

interface GenerateUsernameOptions {
  maxAttempts?: number;
  baseName?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);
}

function randomSuffix(length = 4): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function buildCandidate(base?: string | null): string {
  const safeBase = base && base.length > 1 ? base : null;

  if (safeBase) {
    return `${safeBase}-${randomSuffix(3)}`;
  }

  try {
    const poolName = usernamePool.getRandomUsername();
    return `${poolName}-${randomSuffix(2)}`;
  } catch (error) {
    console.warn('Username pool unavailable, falling back to generic handle:', error);
  }

  return `seeker-${randomSuffix(4)}`;
}

/**
 * Attempt to allocate a globally unique username. If a Supabase client is supplied,
 * we verify uniqueness against the subscribers table. Otherwise we rely on the
 * randomness of the suffix for uniqueness.
 */
export async function generateUniqueUsername(
  supabase: SupabaseClient | null,
  options: GenerateUsernameOptions = {}
): Promise<string> {
  const { maxAttempts = 20, baseName } = options;
  const preferredBase = baseName ? slugify(baseName) : null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = buildCandidate(preferredBase);

    if (!supabase) {
      return candidate;
    }

    const { data, error } = await supabase
      .from('subscribers')
      .select('id')
      .eq('username', candidate)
      .maybeSingle();

    if (error) {
      console.error('Username lookup failed:', error);
      // fall back to returning candidate to avoid blocking signup
      return candidate;
    }

    if (!data) {
      return candidate;
    }
  }

  // As a final fallback, return a random handle without database validation.
  return buildCandidate(null);
}
