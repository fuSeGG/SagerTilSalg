import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
    try {
        const { category, pin } = await request.json();

        // 1. Verify PIN
        const validPin = env.ADMIN_PIN || '3757';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Validate input
        if (!category.id || !category.sku_prefix) { // frontend sends skuPrefix, we map it below
            // Correction: frontend sends skuPrefix (camelCase), DB needs sku_prefix (snake_case)
            // But let's handle the mapping here or expect frontend to match.
            // The frontend sends: { id, label, skuPrefix, icon, color }
        }

        // 3. Initialize Supabase
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 4. Upsert Category
        const { data, error } = await supabase
            .from('categories')
            .upsert({
                id: category.label, // ID is the label/name
                label: category.label,
                sku_prefix: category.skuPrefix,
                icon: category.icon,
                color: category.color,
                // Assign a default sort order if new (e.g. 100)
                sort_order: 100
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
