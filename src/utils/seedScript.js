import { storage } from './storage';

const categories = {
    'Værktøj': [
        'Bosch Skruemaskine', 'Makita Rundsav', 'Dewalt Borehammer', 'Stanley Værktøjskasse',
        'Bahco Skiftenøgle sæt', 'Milwaukee Slagnøgle', 'Hultafors Tommestok Professional',
        'Fiskars Økse X25', 'Knipex Kombitang', 'Wera Skruetrækkersæt'
    ],
    'Møbler': [
        'Egetræs Spisebord', 'Læder Lænestol', 'Teaktræ Skænk', 'Industrielt Jernskab',
        'Retro Sofabord', 'Chesterfield Sofa (3-personers)', 'Arkitektlampe (Klassisk)',
        'Bøgetræs Stol', 'Gammel Købmandsdisk', 'Fransk Spejl med Guldramme'
    ],
    'Bildele': [
        'Alufælge (17 tommer)', 'BMW E46 Forlygte', 'VW Golf Gearkasse', 'Mercedes Bremsekaliber',
        'Ford Focus Rat', 'Audi A4 Bagsæde (Læder)', 'Toyota Sidespejl', 'Bremseklodser (Nye)',
        'Kølerhjelm til Volvo V70', 'Startermotor til Opel Astra'
    ],
    'Maskiner': [
        'Betonblander (200L)', 'Søjleboremaskine', 'Kompressor (50L)', 'Pladevibrator (90kg)',
        'Drejebænk til metal', 'Tykkelseshøvl', 'Bandsav til træ', 'Generator (3000W)',
        'Svejseværk (Inverter)', 'Industristøvsuger'
    ]
};

const images = {
    'Værktøj': 'https://placehold.co/600x400/10b981/ffffff?text=Værktøj',
    'Møbler': 'https://placehold.co/600x400/10b981/ffffff?text=Møbler',
    'Bildele': 'https://placehold.co/600x400/10b981/ffffff?text=Bildele',
    'Maskiner': 'https://placehold.co/600x400/10b981/ffffff?text=Maskiner'
};

const categoryPrefixes = {
    'Værktøj': 'VRK',
    'Møbler': 'MBL',
    'Bildele': 'BIL',
    'Maskiner': 'MSK'
};

async function seed() {
    const counts = { 'Værktøj': 1, 'Møbler': 1, 'Bildele': 1, 'Maskiner': 1 };

    console.log('Seeding Supabase...');

    for (const [category, names] of Object.entries(categories)) {
        for (const name of names) {
            const prefix = categoryPrefixes[category] || 'STS';
            const sku = `${prefix}-${counts[category].toString().padStart(5, '0')}`;
            const item = {
                sku,
                name,
                category,
                description: `Dette er en flot ${name.toLowerCase()} i rigtig god stand. Perfekt til både private og professionelle. Ring for at høre mere eller aftal et tidspunkt for fremvisning på vores lager i Aarhus.`,
                image: images[category],
                dateAdded: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
                available: true,
                price: Math.floor(Math.random() * 2000) + 100,
                quantity: Math.floor(Math.random() * 5) + 1
            };

            // Pass object directly, new storage adapter handles it
            await storage.set(`item:${sku}`, item);
            counts[category]++;
        }
    }

    console.log('Seeding complete! Refresh the page.');
}

// Make it globally available for running in console
window.seed = seed;
