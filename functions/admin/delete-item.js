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

        // 3. Fetch item to find associated image (for cleanup)
        const { data: item } = await supabase
            .from('items')
            .select('data')
            .eq('sku', sku)
            .single();

        if (item && item.data && item.data.image) {
            const imageUrl = item.data.image;
            if (imageUrl.includes('supabase.co/storage/v1/object/public/inventory/')) {
                const fileName = imageUrl.split('inventory/').pop();
                if (fileName) {
                    // Delete from Storage
                    await supabase.storage.from('inventory').remove([fileName]);
                }
            }
        }

        // 4. Delete the Item Row
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
