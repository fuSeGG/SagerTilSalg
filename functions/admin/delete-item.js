import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
    try {
        const { sku, pin } = await request.json();

        // 1. Verify PIN
        const validPin = env.ADMIN_PIN || '1234';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Initialize Supabase with Service Key (Admin)
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 3. Fetch item to find associated image (for cleanup) - OPTIONAL but good practice
        // For now, we'll let the client handle image deletion logic or do it here?
        // Better to do it here for security, but we need to know the path.
        // Let's first just delete the row.

        const { error } = await supabase
            .from('items')
            .delete()
            .eq('sku', sku);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
