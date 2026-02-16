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
        const { sku, pin } = await request.json();

        // 1. Verify PIN
        const validPin = env.ADMIN_PIN || '1234';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Initialize Supabase with Service Key (Admin)
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 3. Fetch item to find associated images (for cleanup)
        const { data: item } = await supabase
            .from('items')
            .select('data')
            .eq('sku', sku)
            .single();

        if (item?.data) {
            // Normalize all images (handle legacy 'image' and new 'images' array)
            const images = item.data.images || (item.data.image ? [item.data.image] : []);

            // Extract paths
            const pathsToDelete = images.map(extractStoragePath).filter(Boolean);

            if (pathsToDelete.length > 0) {
                console.log(`Deleting ${pathsToDelete.length} images for SKU ${sku}`);
                const { error: storageError } = await supabase.storage
                    .from('inventory')
                    .remove(pathsToDelete);

                if (storageError) {
                    console.error('Failed to delete images:', storageError);
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
