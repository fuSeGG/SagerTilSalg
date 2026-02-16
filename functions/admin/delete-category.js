import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
    try {
        const { id, pin } = await request.json();

        // 1. Verify PIN
        const validPin = env.ADMIN_PIN || '3757';
        if (pin !== validPin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 2. SAFETY CHECK: Ensure no items use this category
        const { count, error: countError } = await supabase
            .from('items')
            .select('*', { count: 'exact', head: true })
            .eq('category', id);

        if (countError) throw countError;

        if (count > 0) {
            return new Response(JSON.stringify({
                error: `Cannot delete category. ${count} item(s) still assigned to it.`
            }), { status: 400 });
        }

        // 3. Delete Category
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Delete category error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
