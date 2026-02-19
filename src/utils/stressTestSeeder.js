import { supabase } from './supabaseClient';

/**
 * UTILITY: Stress Test Seeder
 * Generates 2000 items and upserts them to Supabase in batches.
 * SKUs are prefixed with STRESS- for easy identification and cleanup.
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

    const name = `${adjective} ${cat.id === 'Materialer' ? 'Materiale' : noun} #${index}`;
    const price = Math.floor(Math.random() * 5000) + 50;
    const sku = `STRESS-${index}`;

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
        .like('sku', 'STRESS-%');

    if (error) {
        console.error('❌ Error during cleanup:', error);
    } else {
        console.log('✅ Cleanup complete!');
    }
}

// Expose to window for manual execution in console
if (typeof window !== 'undefined') {
    window.runStressTestSeeder = runStressTestSeeder;
    window.cleanupStressTestData = cleanupStressTestData;
}
