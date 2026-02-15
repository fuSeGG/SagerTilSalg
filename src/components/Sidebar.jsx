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
    setViewMode
}) => {
    // Calculate stats
    const stats = React.useMemo(() => {
        const counts = { total: items.length, Favoritter: favoritesCount };
        // Initialize counts for all categories (dynamic or static)
        const activeCategories = (props.categories && props.categories.length > 0) ? props.categories : CATEGORIES;
        activeCategories.forEach(cat => { counts[cat.id] = 0; });

        items.forEach(item => { if (counts[item.category] !== undefined) counts[item.category]++; });
        return counts;
    }, [items, favoritesCount, props.categories]);

    // Use dynamic categories or fallback
    const activeCategories = (props.categories && props.categories.length > 0) ? props.categories : CATEGORIES;

    const categories = [
        { label: 'Alle Varer', key: 'Alle', count: stats.total, icon: Package, color: 'text-text-primary' },
        { label: 'Favoritter', key: 'Favoritter', count: stats['Favoritter'], icon: Heart, color: 'text-orange-500' },
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

            {/* Search and View Mode */}
            <div className="px-4 py-4 space-y-4 border-b border-bg-secondary">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Søg i lager..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-lg py-2 pl-9 pr-8 text-xs font-bold text-text-primary focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-muted uppercase tracking-widest"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex p-1 bg-bg-secondary rounded-lg border border-border">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-black uppercase tracking-tighter transition-all ${viewMode === 'list' ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text-secondary'}`}
                    >
                        <List className="size-3" />
                        <span>Liste</span>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-black uppercase tracking-tighter transition-all ${viewMode === 'grid' ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text-secondary'}`}
                    >
                        <LayoutGrid className="size-3" />
                        <span>Gitter</span>
                    </button>
                </div>
            </div>

            {/* Navigation / Categories */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 custom-scrollbar">
                <div className="space-y-1">
                    <h3 className="text-text-muted text-xs font-black uppercase tracking-[0.2em] px-2 mb-3">Kategorier</h3>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
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
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-bg-secondary space-y-1">
                    <h3 className="text-text-muted text-xs font-black uppercase tracking-[0.2em] px-2 mb-3">Admin</h3>
                    <button
                        onClick={() => {
                            onAdminClick();
                            if (window.innerWidth < 768) onClose();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-secondary transition-all group border border-transparent hover:border-border"
                    >
                        <Lock className="size-4 text-text-muted group-hover:text-accent transition-colors" />
                        <span className="text-[11px] font-black uppercase tracking-wide text-text-secondary group-hover:text-text-primary">Lagerstyring</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-bg-primary">
                <ContactButton
                    variant="sidebar"
                    label="Ring for bestilling"
                    className="w-full mb-2 gap-2"
                />
                <div className="text-center space-y-1">
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-tight">Mårsøvej 1, 4300 Holbæk</p>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest">+45 40 78 14 88</p>
                </div>
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
