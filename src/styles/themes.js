export const THEMES = [
    // --- Standard (Standard) ---
    {
        id: 'theme-1',
        name: 'Standard',
        type: 'standard',
        colors: {
            '--bg-primary': '#020617',    // slate-950
            '--bg-secondary': '#0f172a',  // slate-900
            '--bg-tertiary': '#1e293b',   // slate-800
            '--bg-sidebar': '#020617',    // MATCHES PRIMARY
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
        id: 'theme-3', // Formerly Deep Blueprint
        name: 'Dyb Blå',
        type: 'standard',
        colors: {
            '--bg-primary': '#102A63',    // Technical Blue
            '--bg-secondary': '#183B8C',  // List Item BG
            '--bg-tertiary': '#204CB5',
            '--bg-sidebar': '#102A63',    // MATCHES PRIMARY
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#A5C4FF',
            '--text-muted': '#6D91D9',
            '--accent': '#FFD700',        // Yellow indicators
            '--accent-hover': '#FFE44D',
            '--accent-contrast': '#102A63',
            '--border': '#6D91D9',        // Guidelines
            '--success': '#4CAF50',
            '--error': '#FF5252',
        },
        styles: {
            '--radius': '4px',
            '--font-family': '"Consolas", monospace',
        }
    },
    {
        id: 'theme-7', // Formerly Marketplace Blue
        name: 'Markedsplads Blå',
        type: 'standard', // MOVED TO STANDARD
        colors: {
            '--bg-sidebar': '#002E5D',    // Classic Navy Blue
            '--bg-primary': '#f3f4f6',    // Light Gray Background
            '--bg-secondary': '#ffffff',  // White Cards
            '--bg-tertiary': '#e5e7eb',   // Gray borders/hover
            '--text-primary': '#111827',  // Near Black
            '--text-secondary': '#4b5563',// Dark Gray
            '--text-muted': '#9ca3af',
            '--accent': '#002E5D',        // Navy Blue
            '--accent-hover': '#004286',
            '--accent-contrast': '#ffffff',
            '--border': '#d1d5db',
            '--success': '#059669',
            '--error': '#dc2626',
        },
        styles: {
            '--radius': '0.5rem',
            '--font-family': 'ui-sans-serif, system-ui, sans-serif',
        }
    },

    // --- High Contrast (Høj Kontrast) ---
    {
        id: 'theme-4', // Formerly Standard Contrast
        name: 'Standard Kontrast',
        type: 'contrast',
        colors: {
            '--bg-sidebar': '#020617',    // Dark Slate (Sidebar)
            '--bg-primary': '#0f172a',    // Lighter Slate (Main Content)
            '--bg-secondary': '#1e293b',  // Even Lighter (Cards)
            '--bg-tertiary': '#334155',
            '--text-primary': '#f1f5f9',
            '--text-secondary': '#94a3b8',
            '--text-muted': '#64748b',
            '--accent': '#facc15',
            '--accent-hover': '#eab308',
            '--accent-contrast': '#000000',
            '--border': '#334155',
            '--success': '#10b981',
            '--error': '#ef4444',
        },
        styles: {
            '--radius': '0.75rem',
        }
    },
    {
        id: 'theme-6', // Formerly Blueprint Contrast - SWAPPED UP
        name: 'Dyb Blå Kontrast',
        type: 'contrast',
        colors: {
            '--bg-sidebar': '#0a1d47',    // Darker Blue (Sidebar)
            '--bg-primary': '#102A63',    // Standard Blue (Main Content)
            '--bg-secondary': '#183B8C',  // Lighter (Cards)
            '--bg-tertiary': '#204CB5',
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#A5C4FF',
            '--text-muted': '#6D91D9',
            '--accent': '#FFD700',
            '--accent-hover': '#FFE44D',
            '--accent-contrast': '#102A63',
            '--border': '#6D91D9',
            '--success': '#4CAF50',
            '--error': '#FF5252',
        },
        styles: {
            '--radius': '4px',
            '--font-family': '"Consolas", monospace',
        }
    },
    {
        id: 'theme-5', // Formerly Gruvbox Contrast - SWAPPED DOWN
        name: 'Gruvbox Kontrast',
        type: 'contrast',
        colors: {
            '--bg-sidebar': '#1d2021',    // Hard Dark (Sidebar)
            '--bg-primary': '#282828',    // Lighter Dark (Main Content)
            '--bg-secondary': '#3c3836',  // Lighter (Cards)
            '--bg-tertiary': '#504945',
            '--text-primary': '#ebdbb2',
            '--text-secondary': '#bdae93',
            '--text-muted': '#928374',
            '--accent': '#d65d0e',
            '--accent-hover': '#fe8019',
            '--accent-contrast': '#1d2021',
            '--border': '#504945',
            '--success': '#b8bb26',       // Green
            '--error': '#cc241d',         // Red
        },
        styles: {
            '--radius': '0.25rem',
        }
    },
];
