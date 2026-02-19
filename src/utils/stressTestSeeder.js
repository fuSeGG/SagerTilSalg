import { supabase } from './supabaseClient';

/**
 * UTILITY: Stress Test Seeder
 * Generates 2000 items and upserts them to Supabase in batches.
 * SKUs are prefixed with BT- (Bucket Test) for easy identification.
 */

const CATEGORY_DATA = [
    { id: 'Værktøj', keywords: 'tools,hardware' },
    { id: 'Møbler', keywords: 'furniture,interior' },
    { id: 'Auto', keywords: 'car,mechanic' },
    { id: 'Maskiner', keywords: 'machinery,industrial' },
    { id: 'Materialer', keywords: 'construction,timber' }
];

const RANDOM_ADJECTIVES = ['Eksklusiv', 'Brugt', 'Kraftig', 'Professionel', 'Lille', 'Stor', 'Moderne', 'Klassisk', 'Solid', 'Billig'];
const RANDOM_NOUNS = ['Genstand', 'Modul', 'Enhed', 'Pakke', 'System', 'Udstyr', 'Del', 'Komponent'];

const BUCKET_BASE_URL = 'https://fglojljzbhhcrxjeipgf.supabase.co/storage/v1/object/public/inventory/stress-test';

function generateRandomItem(index) {
    const cat = CATEGORY_DATA[Math.floor(Math.random() * CATEGORY_DATA.length)];
    const adjective = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
    const noun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)];

    const name = `Bucket Test Ware #${index}`;
    const price = Math.floor(Math.random() * 5000) + 50;
    const sku = `BT-${index}-${Math.random().toString(36).substring(7)}`; // Unique suffix to avoid conflicts

    // Randomly pick one of the 20 base images from our bucket
    const imageIndex = (index % 20) + 1;
    const imageUrl = `${BUCKET_BASE_URL}/test-base-${imageIndex}.jpg`;
    const images = [imageUrl];

    return {
        sku,
        name,
        category: cat.id,
        price,
        description: `Dette er en stresstest-vare genereret automatisk. Kategori: ${cat.id}. Stand: ${adjective.toLowerCase()}.`,
        image: images[0] || '', // Backward compat
        images,
        created_at: new Date().toISOString()
    };
}

export async function runStressTestSeeder(count = 2000) {
    console.log(`🚀 Starting stress test seeder for ${count} items...`);

    const BATCH_SIZE = 100;
    const batches = Math.ceil(count / BATCH_SIZE);

    for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, count);
        const batchItems = [];

        for (let j = start; j < end; j++) {
            batchItems.push(generateRandomItem(j + 1));
        }

        console.log(`📦 Seeding batch ${i + 1}/${batches} (${start} to ${end})...`);

        // Transform to match DB structure (data column + top-level category column)
        const dbRows = batchItems.map(item => ({
            sku: item.sku,
            category: item.category,
            data: item,
            created_at: item.created_at
        }));

        const { error } = await supabase
            .from('items')
            .upsert(dbRows, { onConflict: 'sku' });

        if (error) {
            console.error(`❌ Error seeding batch ${i + 1}:`, error);
            break;
        }
    }

    console.log('✅ Stress test seeding complete!');
}

export async function cleanupStressTestData() {
    console.log('🧹 Cleaning up stress test data...');

    const { error } = await supabase
        .from('items')
        .delete()
        .like('sku', 'BT-%');

    if (error) {
        console.error('❌ Error during cleanup:', error);
    } else {
        console.log('✅ Cleanup complete!');
    }
}

/**
 * Fixes existing BT items that have broken images (pointing to base_images/)
 */
export async function fixBTImages() {
    console.log('🔧 Starting bulk fix for BT- items...');

    const { data: items, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .or('sku.ilike.BT-%,sku.ilike.STRESS-%')
        .limit(5000);

    if (fetchError) {
        console.error('Error fetching items:', fetchError);
        return;
    }

    console.log(`🔍 Found ${items.length} items to check.`);
    const BATCH_SIZE = 50;
    const updates = [];

    for (const item of items) {
        const currentImg = item.data?.image || '';
        // If it's a base_image or loremflickr, it needs fixing
        if (currentImg.includes('base_images') || currentImg.includes('loremflickr') || !currentImg) {
            const mockIndex = Math.floor(Math.random() * 20) + 1;
            const newUrl = `${BUCKET_BASE_URL}/test-base-${mockIndex}.jpg`;

            const updatedData = {
                ...item.data,
                image: newUrl,
                images: [newUrl]
            };

            updates.push({
                sku: item.sku,
                category: item.category,
                data: updatedData
            });
        }
    }

    if (updates.length === 0) {
        console.log('✅ All images already look correct.');
        return;
    }

    console.log(`🛠️ Patching ${updates.length} items...`);

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('items').upsert(batch);
        if (error) console.error(`Error in batch ${i}:`, error);
        else console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} complete`);
    }

    console.log('🏁 Fix complete!');
}

// Expose to window for manual execution in console
if (typeof window !== 'undefined') {
    window.runStressTestSeeder = runStressTestSeeder;
    window.cleanupStressTestData = cleanupStressTestData;
    window.fixBTImages = fixBTImages;
}
