import { supabase } from './supabaseClient';

// Supabase free tier: 1GB storage
const MAX_STORAGE_BYTES = 1 * 1024 * 1024 * 1024; // 1GB

/**
 * Fetches the total storage used in the 'inventory' bucket.
 * @returns {Promise<{usedBytes: number, maxBytes: number, usedPercent: number, formattedUsed: string, formattedMax: string}>}
 */
export const getStorageUsage = async () => {
    try {
        const { data: files, error } = await supabase.storage
            .from('inventory')
            .list('', { limit: 1000 }); // List up to 1000 files

        if (error) {
            console.error('Error fetching storage usage:', error);
            return null;
        }

        const usedBytes = files.reduce((total, file) => {
            // Folders have no size, only files do
            return total + (file.metadata?.size || 0);
        }, 0);

        const usedPercent = Math.round((usedBytes / MAX_STORAGE_BYTES) * 100);

        return {
            usedBytes,
            maxBytes: MAX_STORAGE_BYTES,
            usedPercent,
            formattedUsed: formatBytes(usedBytes),
            formattedMax: formatBytes(MAX_STORAGE_BYTES)
        };
    } catch (err) {
        console.error('Storage usage calculation failed:', err);
        return null;
    }
};

/**
 * Formats bytes into a human-readable string.
 */
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
