import { storage } from './storage';

const initialMaterialer = [
    {
        sku: 'MAT-1',
        name: 'Gipsplader (Standard)',
        category: 'Materialer',
        description: 'Ubrugte gipsplader i standardmål (90x240cm). Rest fra byggeri. Opbevaret tørt.',
        price: 45,
        quantity: 12,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
    },
    {
        sku: 'MAT-2',
        name: 'Reglar (45x95mm)',
        category: 'Materialer',
        description: 'Høvlet fyrretræ. Længder á 3 meter. Perfekt til skillevægge.',
        price: 25,
        quantity: 20,
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop'
    }
];

async function seedMaterialer() {
    console.log('SEEDING STARTER MATERIALER...');
    const pin = '3757';

    for (const item of initialMaterialer) {
        console.log(`Adding ${item.sku}: ${item.name}`);
        await storage.set(`item:${item.sku}`, item, pin);
    }

    console.log('SEEDING COMPLETE.');
}

window.seedMaterialer = seedMaterialer;
