import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
    try {
        const { item, pin } = await request.json();

        // 1. Verify PIN
        const validPin = env.ADMIN_PIN || '1234';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Initialize Supabase with Service Key (Admin)
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 3. Perform Upsert
        const { data, error } = await supabase
            .from('items')
            .upsert({
                sku: item.sku,
                category: item.category,
                data: item // storing the full JSON blob in 'data' column
            }, { onConflict: 'sku' })
            .select();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
