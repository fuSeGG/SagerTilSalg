import { createClient } from '@supabase/supabase-js';

// Helper: extract the storage file path from a Supabase public URL
function extractStoragePath(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') return null;
    const marker = '/storage/v1/object/public/inventory/';
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return null;
    return imageUrl.substring(idx + marker.length);
}

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

        // 3. If updating, clean up old image when a new one replaces it
        const { data: existing } = await supabase
            .from('items')
            .select('data')
            .eq('sku', item.sku)
            .single();

        if (existing?.data?.image && item.image && existing.data.image !== item.image) {
            const oldPath = extractStoragePath(existing.data.image);
            if (oldPath) {
                await supabase.storage.from('inventory').remove([oldPath]);
            }
        }

        // 4. Perform Upsert
        const { data, error } = await supabase
            .from('items')
            .upsert({
                sku: item.sku,
                category: item.category,
                data: item
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
