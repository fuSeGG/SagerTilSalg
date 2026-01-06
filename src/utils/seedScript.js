import { storage } from './storage';

const sampleItems = [
    // Værktøj
    {
        sku: 'VRK-00001',
        name: 'Makita DHR242Z Borehammer',
        category: 'Værktøj',
        description: 'Professionel 18V borehammer med SDS-plus opsætning. Let brugt med enkelte brugsspor, men fungerer upåklageligt. Inklusiv støvudsugningsenhed.',
        price: 1450,
        quantity: 2,
        image: '/images/sample/makita.png'
    },
    {
        sku: 'VRK-00002',
        name: 'Bosch GSL 2 Overfladelaser',
        category: 'Værktøj',
        description: 'Præcis laser til kontrol af gulvjævnhed. Ideel til entreprenøren der vil sikre et perfekt resultat før fliselægning. Leveres i original kuffert.',
        price: 2200,
        quantity: 1,
        image: '/images/sample/bosch.png'
    },
    {
        sku: 'VRK-00003',
        name: 'Hultafors Værktøjskasse i Stål',
        category: 'Værktøj',
        description: 'Klassisk rød værktøjskasse i kraftig stålkonstruktion med 5 rum. Uopslidelig kvalitet fra svenske Hultafors. Perfekt til opbevaring af håndværktøj.',
        price: 450,
        quantity: 5,
        image: '/images/sample/hultafors.png'
    },
    // Møbler
    {
        sku: 'MBL-00001',
        name: 'Dansk Teaktræ Skænk (1960erne)',
        category: 'Møbler',
        description: 'Flot og velholdt skænk i massiv teaktræ med skydelåger og fire skuffer. Klassisk dansk design fra midten af århundredet. Enkelte mindre ridser på toppen.',
        price: 3800,
        quantity: 1,
        image: '/images/sample/teak.png'
    },
    {
        sku: 'MBL-00002',
        name: 'Industrielt Arkivskab i Metal',
        category: 'Møbler',
        description: 'Autentisk vintage arkivskab med 15 skuffer. Patineret grå lakering der giver det helt rigtige rå look til kontoret eller stuen.',
        price: 1250,
        quantity: 2,
        image: '/images/sample/arkivskab.png'
    },
    {
        sku: 'MBL-00003',
        name: 'Wegner y-stol (Sort Eg)',
        category: 'Møbler',
        description: 'Original y-stol designet af Hans J. Wegner. Stolen står med det originale flet og er i rigtig god stand uden løse led.',
        price: 2900,
        quantity: 4,
        image: '/images/sample/y-stol.png'
    },
    // Auto
    {
        sku: 'AUT-00001',
        name: 'Alufælge 18 til Audi/VW',
        category: 'Auto',
        description: 'Sæt med 4 stk. originale alufælge. Passer til de fleste modeller fra Audi og VW. Monteret med sommerdæk der har ca. 4mm mønster tilbage.',
        price: 4500,
        quantity: 1,
        image: '/images/sample/alufaelge.png'
    },
    {
        sku: 'AUT-00002',
        name: 'Tagboks Thule Motion XT L',
        category: 'Auto',
        description: 'Rummelig og strømlinet tagboks i sort højglans. Nem montering med PowerClick-system. Kun brugt på to skiferier. Nøgle medfølger.',
        price: 3200,
        quantity: 1,
        image: '/images/sample/thule.png'
    },
    {
        sku: 'AUT-00003',
        name: 'Varta Startbatteri 12V 95Ah',
        category: 'Auto',
        description: 'Kraftigt AGM batteri med høj startstrøm. Perfekt til biler med start-stop teknologi. Testet og fuldt opladet.',
        price: 850,
        quantity: 3,
        image: '/images/sample/varta.png'
    },
    // Maskiner
    {
        sku: 'MSK-00001',
        name: 'Nilfisk Alto Højtryksrenser',
        category: 'Maskiner',
        description: 'Kraftig maskine til krævende opgaver. Leveres med 15 meter slange og variabel dyse. Perfekt til rensning af fliser og facader.',
        price: 2100,
        quantity: 1,
        image: '/images/sample/nilfisk.png'
    },
    {
        sku: 'MSK-00002',
        name: 'Søjleboremaskine Scantool',
        category: 'Maskiner',
        description: 'Solid værkstedsmodel med 12 hastigheder og selvspændende borepatron. Kører præcist og støjsvagt. Monteret på tung støbejernsfod.',
        price: 4800,
        quantity: 1,
        image: '/images/sample/scantool.png'
    },
    {
        sku: 'MSK-00003',
        name: 'Honda Generator EU20i',
        category: 'Maskiner',
        description: 'Kompakt og ekstremt støjsvag inverter-generator. Giver ren strøm til følsom elektronik. Meget lidt brugt og fremstår som ny.',
        price: 5500,
        quantity: 1,
        image: '/images/sample/honda.png'
    }
];

async function seed() {
    console.log('Seeding Supabase with realistic Danish data...');

    for (const item of sampleItems) {
        const fullItem = {
            ...item,
            dateAdded: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            available: true
        };
        console.log(`Seeding ${item.sku}: ${item.name}`);
        await storage.set(`item:${item.sku}`, fullItem);
    }

    console.log('Seeding complete! Refresh the page.');
}

window.seed = seed;
