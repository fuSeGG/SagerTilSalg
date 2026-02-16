import React, { useState } from 'react';
import { Package, X, Lock, Heart, Search, List, LayoutGrid } from 'lucide-react';
import ContactButton from './ContactButton';
import { CATEGORIES, ICON_MAP } from '../utils/constants';

const Sidebar = ({
    isOpen,
    onClose,
    items,
    selectedCategory,
    onSelectCategory,
    favoritesCount,
    onAdminClick,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    categories: propCategories // Renamed to avoid name collision with the local 'categories' array we create below
}) => {
    // Determine the base categories to work with
    const activeCategories = (propCategories && propCategories.length > 0) ? propCategories : CATEGORIES;

    // Calculate stats
    const stats = React.useMemo(() => {
        const counts = { total: items.length, Favoritter: favoritesCount };
        // Initialize counts for all categories (dynamic or static)
        activeCategories.forEach(cat => { counts[cat.id] = 0; });

        items.forEach(item => { if (counts[item.category] !== undefined) counts[item.category]++; });
        return counts;
    }, [items, favoritesCount, activeCategories]);

    const categories = [
        { label: 'Favoritter', key: 'Favoritter', count: stats['Favoritter'], icon: Heart, color: 'text-orange-500' },
        { label: 'Alle Varer', key: 'Alle', count: stats.total, icon: Package, color: 'text-text-primary' },
        ...activeCategories.map(cat => ({
            label: cat.label,
            key: cat.id,
            count: stats[cat.id],
            // Handle both Lucide components (static) and string names (dynamic from DB)
            icon: typeof cat.icon === 'string' ? (ICON_MAP[cat.icon] || Package) : cat.icon,
            color: cat.color
        }))
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-bg-sidebar border-r border-border w-64 shadow-2xl">
            {/* Branding Header */}
            <div className="p-6 pb-2 flex flex-col items-center relative">
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary transition-colors"
                >
                    <X className="size-6" />
                </button>

                <div className="bg-accent p-2 rounded-xl rotate-3 shadow-lg shadow-accent/20 mb-3 group hover:rotate-6 transition-transform">
                    <Package className="text-accent-contrast size-6" />
                </div>
                <h1 className="text-text-primary font-black text-2xl leading-none tracking-tighter italic whitespace-nowrap">
                    SAGER<span className="text-accent">TIL</span>SALG
                </h1>
                <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em] mt-2 mb-2">
                    Professionel genbrug
                </p>
            </div>

            {/* Navigation / Categories */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 custom-scrollbar">
                <div className="space-y-1">
                    <h3 className="text-text-muted text-xs font-black uppercase tracking-[0.2em] px-2 mb-3">Kategorier</h3>
                    {categories.map((cat, index) => (
                        <React.Fragment key={cat.key}>
                            <button
                                onClick={() => {
                                    onSelectCategory(cat.key);
                                    if (window.innerWidth < 768) onClose();
                                }}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group ${selectedCategory === cat.key
                                    ? 'bg-bg-secondary border border-border shadow-inner'
                                    : 'hover:bg-bg-secondary/50 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <cat.icon className={`size-4 ${selectedCategory === cat.key ? cat.color : 'text-text-muted group-hover:text-text-secondary'} ${cat.key === 'Favoritter' && selectedCategory === 'Favoritter' ? 'fill-orange-500' : ''}`} />
                                    <span className={`text-[11px] font-black uppercase tracking-wide ${selectedCategory === cat.key ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                        {cat.label}
                                    </span>
                                </div>
                                <span className={`text-xs font-black px-1.5 py-0.5 rounded ${selectedCategory === cat.key
                                    ? 'bg-accent text-accent-contrast'
                                    : 'bg-bg-secondary text-text-muted'
                                    }`}>
                                    {cat.count}
                                </span>
                            </button>
                            {/* Add separator after the first special category (Favoritter) */}
                            {index === 0 && (
                                <div className="mx-2 my-3 border-b border-bg-secondary/50" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-bg-primary">
                <ContactButton
                    variant="sidebar"
                    label="Ring for bestilling"
                    className="w-full mb-2 gap-2"
                />
            </div>
        </div>
    );

    return (
        <>
            <div className="hidden md:block fixed top-0 left-0 bottom-0 h-full z-40">
                {sidebarContent}
            </div>

            <div
                className={`md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`md:hidden fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full overflow-hidden">
                    {sidebarContent}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
