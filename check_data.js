import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('items')
        .select('data')
        .ilike('sku', 'STRESS-%')
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    console.log('--- STRESS TEST DATA STRUCTURE ---');
    data.forEach(d => {
        console.log(`SKU: ${d.data.sku}`);
        console.log(`Image: ${d.data.image}`);
        console.log(`Images: ${JSON.stringify(d.data.images)}`);
        console.log('---');
    });
}

check();
