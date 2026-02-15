import { supabase } from './supabaseClient';
import { CATEGORIES } from './constants';

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

    // Adapter to save an item (via CloudFlare Proxy)
    async set(key, value, pin) {
        try {
            // Check if it's an item
            if (key.includes('item:') && value.sku && value.category) {
                if (!pin) {
                    console.error('PIN required for saving items');
                    return false;
                }

                const response = await fetch('/admin/save-item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: value, pin })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || 'Failed to save');
                }

                return true;
            }

            // Fallback to localStorage
            localStorage.setItem(STORAGE_NAMESPACE + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage Set Error:', e);
            throw e; // Propagate error to UI
        }
    },

    // Adapter to delete an item
    async remove(key, pin) {
        try {
            if (key.includes('item:')) {
                if (!pin) {
                    console.error('PIN required for deleting items');
                    return false;
                }

                const sku = key.split('item:')[1];

                const response = await fetch('/admin/delete-item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sku, pin })
                });

                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
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
            return data.map(row => {
                const item = row.data;
                // Auto-migration: Rename legacy 'Bildele' to 'Auto'
                if (item.category === 'Bildele') {
                    item.category = 'Auto';
                }
                return item;
            });
        } catch (e) {
            console.error('Supabase GetAll Error:', e);
            return [];
        }
    },

    // New helper to calculate next SKU (collision-safe)
    async getNextSku(category, dynamicCategories = null) {
        const activeCategories = dynamicCategories || CATEGORIES;
        const prefixes = {};
        activeCategories.forEach(cat => { prefixes[cat.id] = cat.skuPrefix; });
        const prefix = prefixes[category] || 'ST';

        try {
            // Fetch ALL SKUs for this category to find the true max
            const { data, error } = await supabase
                .from('items')
                .select('sku')
                .like('sku', `${prefix}-%`);

            if (error) throw error;

            let maxNum = 0;
            const existingSkus = new Set();

            if (data && data.length > 0) {
                data.forEach(item => {
                    existingSkus.add(item.sku);
                    const parts = item.sku.split('-');
                    if (parts.length > 1) {
                        const numPart = parseInt(parts[1]);
                        if (!isNaN(numPart) && numPart > maxNum) {
                            maxNum = numPart;
                        }
                    }
                });
            }

            // Generate next SKU and verify it doesn't exist
            let nextNum = maxNum + 1;
            let candidateSku = `${prefix}-${nextNum}`;

            // Safety: loop until we find a non-existing SKU (shouldn't normally iterate)
            while (existingSkus.has(candidateSku)) {
                nextNum++;
                candidateSku = `${prefix}-${nextNum}`;
            }

            return candidateSku;
        } catch (e) {
            console.error('GetNextSku Error:', e);
            // Fallback: use timestamp to ensure uniqueness (not random!)
            const timestamp = Date.now().toString(36).toUpperCase();
            return `${prefix}-T${timestamp}`;
        }
    }
};
