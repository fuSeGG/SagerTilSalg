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
        const validPin = env.ADMIN_PIN || '3757';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Initialize Supabase with Service Key (Admin)
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 3. Image Cleanup Logic
        // Fetch existing item to see what images it had
        const { data: existing } = await supabase
            .from('items')
            .select('data')
            .eq('sku', item.sku)
            .single();

        if (existing?.data) {
            // Normalize old images to array (handle legacy 'image' string)
            const oldImages = existing.data.images || (existing.data.image ? [existing.data.image] : []);

            // Normalize new images to array
            const newImages = item.images || (item.image ? [item.image] : []);

            // Identify orphaned images (in old but not in new)
            const pathsToDelete = oldImages
                .filter(img => !newImages.includes(img))
                .map(extractStoragePath)
                .filter(Boolean);

            if (pathsToDelete.length > 0) {
                console.log('Deleting orphaned images:', pathsToDelete);
                // Batch delete
                await supabase.storage.from('inventory').remove(pathsToDelete);
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
        console.error('Save item error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
