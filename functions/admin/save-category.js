import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
    try {
        const { category, pin, oldId } = await request.json();

        // 1. Verify PIN
        const validPin = env.ADMIN_PIN || '3757';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Validate input
        if (!category.label || (!category.skuPrefix && !category.sku_prefix)) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const skuPrefix = category.skuPrefix || category.sku_prefix;

        // 3. Initialize Supabase
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 4. Handle Rename if oldId is provided and different from new label
        if (oldId && oldId !== category.label) {
            console.log(`Renaming category from ${oldId} to ${category.label}`);

            // Note: Since ID is the PK and used in items table, we should update items first 
            // OR use a transaction. Supabase doesn't support multi-table RPC easily here, 
            // but we can update items then the category.

            const { error: itemUpdateError } = await supabase
                .from('items')
                .update({ category: category.label })
                .eq('category', oldId);

            if (itemUpdateError) {
                console.error('Error updating items during category rename:', itemUpdateError);
                // We proceed anyway, or should we fail? Let's try to proceed.
            }

            // Delete the old category if the label changed (since label is the ID)
            await supabase.from('categories').delete().eq('id', oldId);
        }

        // 5. Upsert Category
        const { data, error } = await supabase
            .from('categories')
            .upsert({
                id: category.label, // ID is the label/name
                label: category.label,
                sku_prefix: skuPrefix,
                icon: category.icon,
                color: category.color,
                sort_order: category.sort_order || 100
            }, { onConflict: 'id' })
            .select();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Save category error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
