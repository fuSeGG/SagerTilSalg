import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGE_TOPICS = ['tools', 'machinery', 'furniture', 'industrial', 'warehouse'];

async function uploadSampleImages(count = 20) {
    console.log(`🖼️ Downloading and uploading ${count} sample images...`);

    for (let i = 0; i < count; i++) {
        const topic = IMAGE_TOPICS[i % IMAGE_TOPICS.length];
        const url = `https://loremflickr.com/1200/800/${topic}?lock=${i + 1000}`;
        const filename = `test-base-${i + 1}.jpg`;

        try {
            console.log(`⬇️ Downloading ${url}...`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            console.log(`⬆️ Uploading ${filename} to 'inventory'...`);
            const { data, error } = await supabase.storage
                .from('inventory')
                .upload(`stress-test/${filename}`, buffer, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (error) throw error;
            console.log(`✅ Uploaded: ${data.path}`);
        } catch (err) {
            console.error(`❌ Failed to process ${filename}:`, err.message);
        }
    }

    console.log('🏁 Base images ready.');
}

uploadSampleImages();
