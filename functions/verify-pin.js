import { createClient } from '@supabase/supabase-js';

/**
 * Server-side PIN verification with IP-based rate limiting.
 * 
 * Rate limit data is stored in the Supabase `rate_limits` table.
 * Schema: ip (text PK), attempts (int), locked_until (timestamptz), updated_at (timestamptz)
 * 
 * Lockout schedule:
 *   3 failures → 5 minutes
 *   5 failures → 2 hours
 *   8+ failures → 24 hours
 */

const LOCKOUT_SCHEDULE = [
    { threshold: 8, durationMs: 24 * 60 * 60 * 1000 },  // 24 hours
    { threshold: 5, durationMs: 2 * 60 * 60 * 1000 },   // 2 hours
    { threshold: 3, durationMs: 5 * 60 * 1000 },         // 5 minutes
];

function getLockoutDuration(attempts) {
    for (const tier of LOCKOUT_SCHEDULE) {
        if (attempts >= tier.threshold) return tier.durationMs;
    }
    return 0;
}

function getClientIp(request) {
    // Cloudflare provides the real IP via CF-Connecting-IP header
    return request.headers.get('CF-Connecting-IP')
        || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
        || 'unknown';
}

export async function onRequestPost({ request, env }) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const ip = getClientIp(request);

    try {
        const { pin } = await request.json();

        // 1. Check existing rate limit record for this IP
        const { data: record } = await supabase
            .from('rate_limits')
            .select('attempts, locked_until')
            .eq('ip', ip)
            .single();

        const now = new Date();

        // 2. If locked out, reject immediately
        if (record?.locked_until) {
            const lockedUntil = new Date(record.locked_until);
            if (now < lockedUntil) {
                const retryAfter = Math.ceil((lockedUntil - now) / 1000);
                return new Response(JSON.stringify({
                    error: 'Too many attempts',
                    retryAfter,
                    lockedUntil: lockedUntil.toISOString()
                }), {
                    status: 429,
                    headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) }
                });
            }
        }

        // 3. Verify PIN
        const validPin = env.ADMIN_PIN || '3757';
        if (!env.ADMIN_PIN) {
            console.warn('ADMIN_PIN not set in environment variables. Using default.');
        }

        if (pin === validPin) {
            // Success → clear this IP's record
            if (record) {
                await supabase
                    .from('rate_limits')
                    .delete()
                    .eq('ip', ip);
            }
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 4. Wrong PIN → increment attempts and maybe lock
        // Artificial delay to slow down automated attacks
        await new Promise(resolve => setTimeout(resolve, 5000));

        const currentAttempts = (record?.attempts || 0) + 1;
        const lockoutMs = getLockoutDuration(currentAttempts);
        const lockedUntil = lockoutMs > 0 ? new Date(Date.now() + lockoutMs) : null;

        // Upsert rate limit record
        await supabase
            .from('rate_limits')
            .upsert({
                ip,
                attempts: currentAttempts,
                locked_until: lockedUntil?.toISOString() || null,
                updated_at: now.toISOString()
            }, { onConflict: 'ip' });

        // If this attempt triggered a lockout, return 429
        if (lockedUntil) {
            const retryAfter = Math.ceil(lockoutMs / 1000);
            return new Response(JSON.stringify({
                error: 'Too many attempts',
                retryAfter,
                lockedUntil: lockedUntil.toISOString()
            }), {
                status: 429,
                headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) }
            });
        }

        // Wrong but not yet locked
        return new Response(JSON.stringify({
            success: false,
            attemptsRemaining: 3 - currentAttempts
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('PIN verification error:', err);
        return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
    }
}
