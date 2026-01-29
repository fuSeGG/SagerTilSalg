export const THEMES = [
    // --- Group A: Conservative Refinements ---
    {
        id: 'theme-1',
        name: 'Standard',
        type: 'conservative',
        colors: {
            '--bg-primary': '#020617',    // slate-950
            '--bg-secondary': '#0f172a',  // slate-900
            '--bg-tertiary': '#1e293b',   // slate-800
            '--text-primary': '#f1f5f9',  // slate-100
            '--text-secondary': '#94a3b8',// slate-400
            '--text-muted': '#64748b',    // slate-500
            '--accent': '#facc15',        // yellow-400
            '--accent-hover': '#eab308',  // yellow-500
            '--accent-contrast': '#000000',
            '--border': '#1e293b',        // slate-800
            '--success': '#10b981',       // emerald-500
            '--error': '#ef4444',         // red-500
        },
        styles: {
            '--radius': '0.75rem',        // rounded-xl
            '--font-family': 'ui-sans-serif, system-ui, sans-serif',
        }
    },
    {
        id: 'theme-2',
        name: 'Soft Slate',
        type: 'conservative',
        colors: {
            '--bg-primary': '#1e293b',    // slate-800 base
            '--bg-secondary': '#334155',  // slate-700
            '--bg-tertiary': '#475569',   // slate-600
            '--text-primary': '#f8fafc',  // slate-50
            '--text-secondary': '#cbd5e1',// slate-300
            '--text-muted': '#94a3b8',    // slate-400
            '--accent': '#38bdf8',        // sky-400 (SaaS blue)
            '--accent-hover': '#0ea5e9',  // sky-500
            '--accent-contrast': '#0f172a',
            '--border': '#334155',
            '--success': '#34d399',
            '--error': '#f87171',
        },
        styles: {
            '--radius': '0.5rem',         // rounded-lg (more corporate)
        }
    },
    {
        id: 'theme-3',
        name: 'High Contrast',
        type: 'conservative',
        colors: {
            '--bg-primary': '#000000',
            '--bg-secondary': '#111111',
            '--bg-tertiary': '#222222',
            '--text-primary': '#ffffff',
            '--text-secondary': '#e5e5e5',
            '--text-muted': '#a3a3a3',
            '--accent': '#ffff00',        // Pure yellow
            '--accent-hover': '#e6e600',
            '--accent-contrast': '#000000',
            '--border': '#404040',
            '--success': '#00ff00',
            '--error': '#ff0000',
        },
        styles: {
            '--radius': '0px',            // Square corners
        }
    },
    {
        id: 'theme-4',
        name: 'Corporate Clean',
        type: 'conservative',
        colors: {
            '--bg-primary': '#ffffff',    // White
            '--bg-secondary': '#f8fafc',  // slate-50
            '--bg-tertiary': '#e2e8f0',   // slate-200
            '--text-primary': '#0f172a',  // slate-900
            '--text-secondary': '#475569',// slate-600
            '--text-muted': '#64748b',    // slate-500
            '--accent': '#2563eb',        // blue-600
            '--accent-hover': '#1d4ed8',  // blue-700
            '--accent-contrast': '#ffffff',
            '--border': '#cbd5e1',
            '--success': '#16a34a',
            '--error': '#dc2626',
        },
        styles: {
            '--radius': '0.375rem',       // rounded-md
        }
    },
    {
        id: 'theme-5',
        name: 'Warm Industrial',
        type: 'conservative',
        colors: {
            '--bg-primary': '#1c1917',    // stone-900
            '--bg-secondary': '#292524',  // stone-800
            '--bg-tertiary': '#44403c',   // stone-700
            '--text-primary': '#fafaf9',  // stone-50
            '--text-secondary': '#d6d3d1',// stone-300
            '--text-muted': '#a8a29e',    // stone-400
            '--accent': '#f97316',        // orange-500
            '--accent-hover': '#ea580c',  // orange-600
            '--accent-contrast': '#000000',
            '--border': '#44403c',
            '--success': '#84cc16',
            '--error': '#ef4444',
        },
        styles: {
            '--radius': '0.25rem',        // rounded-sm
        }
    },

    // --- Group B: Creative Explorations ---
    {
        id: 'theme-6',
        name: 'Cyberpunk',
        type: 'radical',
        colors: {
            '--bg-primary': '#050a14',    // Deep dark blue/black
            '--bg-secondary': '#0a1428',
            '--bg-tertiary': '#0f2445',
            '--text-primary': '#00f3ff',  // Cyan text
            '--text-secondary': '#b8cce6',
            '--text-muted': '#4a6fa5',
            '--accent': '#ff0055',        // Neon Pink
            '--accent-hover': '#cc0044',
            '--accent-contrast': '#ffffff',
            '--border': '#00f3ff',        // Cyan borders
            '--success': '#00ff9d',
            '--error': '#ff2a6d',
        },
        styles: {
            '--radius': '1rem',
            '--font-family': '"Courier New", Courier, monospace',
        }
    },
    {
        id: 'theme-7',
        name: 'Retro Terminal',
        type: 'radical',
        colors: {
            '--bg-primary': '#0d1117',    // GitHub Dark Dimmed-ish
            '--bg-secondary': '#161b22',
            '--bg-tertiary': '#21262d',
            '--text-primary': '#3fb950',  // Terminal Green
            '--text-secondary': '#8b949e',
            '--text-muted': '#484f58',
            '--accent': '#3fb950',        // Green
            '--accent-hover': '#2ea043',
            '--accent-contrast': '#0d1117',
            '--border': '#30363d',
            '--success': '#3fb950',
            '--error': '#f85149',
        },
        styles: {
            '--radius': '0px',
            '--font-family': 'monospace',
        }
    },
    {
        id: 'theme-8',
        name: 'Luxury Gold',
        type: 'radical',
        colors: {
            '--bg-primary': '#0f0f0f',    // Rich Black
            '--bg-secondary': '#1a1a1a',
            '--bg-tertiary': '#2a2a2a',
            '--text-primary': '#e5cb97',  // Champagne
            '--text-secondary': '#a0a0a0',
            '--text-muted': '#606060',
            '--accent': '#d4af37',        // Gold
            '--accent-hover': '#b5952f',
            '--accent-contrast': '#1a1a1a',
            '--border': '#d4af37',        // Gold borders
            '--success': '#50c878',
            '--error': '#cd5c5c',
        },
        styles: {
            '--radius': '0px',
            '--font-family': 'serif',
        }
    },
    {
        id: 'theme-9',
        name: 'Blueprint',
        type: 'radical',
        colors: {
            '--bg-primary': '#0033cc',    // Blueprint Blue
            '--bg-secondary': '#0044ff',
            '--bg-tertiary': '#3366ff',
            '--text-primary': '#ffffff',
            '--text-secondary': '#bbccff',
            '--text-muted': '#88aaff',
            '--accent': '#ffffff',        // White lines
            '--accent-hover': '#e0e0e0',
            '--accent-contrast': '#0033cc',
            '--border': '#ffffff',        // White borders
            '--success': '#66ff66',
            '--error': '#ff6666',
        },
        styles: {
            '--radius': '2px',
            '--font-family': 'monospace',
        }
    },
    {
        id: 'theme-10',
        name: 'Pop Art',
        type: 'radical',
        colors: {
            '--bg-primary': '#ffffff',    // White
            '--bg-secondary': '#ffcc00',  // Yellow
            '--bg-tertiary': '#ff6699',   // Pink
            '--text-primary': '#000000',  // Black
            '--text-secondary': '#333333',
            '--text-muted': '#666666',
            '--accent': '#0099ff',        // Cyan/Blue
            '--accent-hover': '#0077cc',
            '--accent-contrast': '#ffffff',
            '--border': '#000000',        // Thick black borders (via CSS override usually)
            '--success': '#00cc00',
            '--error': '#ff0033',
        },
        styles: {
            '--radius': '12px',
            '--font-family': 'sans-serif',
            '--spacing-unit': '1.2rem',
        }
    }
];
