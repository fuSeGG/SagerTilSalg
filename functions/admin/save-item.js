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

        // 1b. Validate SKU
        if (!item.sku || item.sku === 'Loading...' || item.sku.trim() === '') {
            return new Response(JSON.stringify({ error: 'Ugyldig SKU. Vælg en kategori og vent til SKU er genereret.' }), { status: 400 });
        }

        // 2. Initialize Supabase with Service Key (Admin)
        if (!env.SUPABASE_SERVICE_ROLE_KEY) {
            return new Response(JSON.stringify({ error: 'System configuration error: Service key missing' }), { status: 500 });
        }
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 3. Extract and strip oldSku (transient field, should NOT be persisted)
        const oldSku = item.oldSku || null;
        delete item.oldSku;

        // 4. Image Cleanup Logic
        // Look up by OLD SKU if it changed, otherwise by current SKU
        const lookupSku = (oldSku && oldSku !== item.sku) ? oldSku : item.sku;
        const { data: existing } = await supabase
            .from('items')
            .select('data')
            .eq('sku', lookupSku)
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
                await supabase.storage.from('inventory').remove(pathsToDelete);
            }
        }

        // 5. If SKU changed (category edit), delete old row FIRST to avoid duplicates
        if (oldSku && oldSku !== item.sku) {
            console.log(`Category change: deleting old SKU row "${oldSku}" before creating "${item.sku}"`);
            const { error: deleteError } = await supabase
                .from('items')
                .delete()
                .eq('sku', oldSku);

            if (deleteError) {
                console.error(`Failed to delete old SKU row ${oldSku}:`, deleteError);
                // Continue anyway — better to have a temporary duplicate than lose the save
            }
        }

        // 6. Upsert the item with the (possibly new) SKU
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
