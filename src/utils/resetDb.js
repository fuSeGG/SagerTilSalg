import { storage } from './storage';

async function resetDb() {
    console.log('STARTING DATABASE PURGE...');
    const pin = '3757'; // Hardcoded for dev convenience

    try {
        const items = await storage.getAllItems();
        console.log(`Found ${items.length} items to delete.`);

        for (const item of items) {
            console.log(`Deleting ${item.sku}...`);
            await storage.remove(`item:${item.sku}`, pin);
        }

        console.log('DATABASE PURGE COMPLETE. Please refresh the page.');
    } catch (error) {
        console.error('Purge failed:', error);
    }
}

window.resetDb = resetDb;
