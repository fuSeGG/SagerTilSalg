import { supabase } from './supabaseClient';

const STORAGE_NAMESPACE = 'sts_';

export const storage = {
    // Adapter to get a specific item
    async get(key) {
        try {
            // Check if it's an item key
            if (key.includes('item:')) {
                const sku = key.split('item:')[1];
                const { data, error } = await supabase
                    .from('items')
                    .select('data')
                    .eq('sku', sku)
                    .single();

                if (error) throw error;
                return data?.data || null;
            }
            // Fallback to localStorage for non-item keys (settings, etc)
            return JSON.parse(localStorage.getItem(STORAGE_NAMESPACE + key));
        } catch (e) {
            console.error('Storage Get Error:', e);
            return null;
        }
    },

    // Adapter to save an item
    async set(key, value) {
        try {
            // Check if it's an item
            if (key.includes('item:') && value.sku && value.category) {
                // Upsert into Supabase
                const { error } = await supabase
                    .from('items')
                    .upsert({
                        sku: value.sku,
                        category: value.category,
                        data: value,
                        // We rely on default created_at for new items, 
                        // but for updates we might want to keep original or update modified_at.
                        // For this prototype, simple upsert is fine.
                    }, { onConflict: 'sku' });

                if (error) throw error;
                return true;
            }

            // Fallback to localStorage
            localStorage.setItem(STORAGE_NAMESPACE + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage Set Error:', e);
            return false;
        }
    },

    async remove(key) {
        try {
            if (key.includes('item:')) {
                const sku = key.split('item:')[1];
                const { error } = await supabase
                    .from('items')
                    .delete()
                    .eq('sku', sku);

                if (error) throw error;
                return true;
            }
            localStorage.removeItem(STORAGE_NAMESPACE + key);
            return true;
        } catch (e) {
            console.error('Storage Remove Error:', e);
            return false;
        }
    },

    // Get all items from Supabase
    async getAllItems() {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('data, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Return the 'data' column content
            return data.map(row => row.data);
        } catch (e) {
            console.error('Supabase GetAll Error:', e);
            return [];
        }
    },

    // New helper to calculate next SKU
    async getNextSku(category) {
        const prefixes = {
            'Værktøj': 'VRK',
            'Møbler': 'MBL',
            'Auto': 'AUT',
            'Maskiner': 'MSK'
        };
        const prefix = prefixes[category] || 'STS';

        try {
            // Find the highest SKU for this category
            const { data, error } = await supabase
                .from('items')
                .select('sku')
                .like('sku', `${prefix}-%`)
                .order('sku', { ascending: false })
                .limit(1);

            if (error) throw error;

            let nextNum = 1;
            if (data && data.length > 0) {
                const lastSku = data[0].sku;
                const numPart = parseInt(lastSku.split('-')[1]);
                if (!isNaN(numPart)) {
                    nextNum = numPart + 1;
                }
            }

            return `${prefix}-${nextNum.toString().padStart(5, '0')}`;
        } catch (e) {
            console.error('GetNextSku Error:', e);
            // Fallback random if offline
            return `${prefix}-${Math.floor(Math.random() * 10000)}`;
        }
    }
};
