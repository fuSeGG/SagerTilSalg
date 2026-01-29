import React from 'react';
import { Package, X, Lock, Heart, Wrench, Armchair, Car, Settings, Search, List, LayoutGrid } from 'lucide-react';
import ContactButton from './ContactButton';

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
    currentView
}) => {
    // Calculate stats
    const stats = React.useMemo(() => {
        const counts = { total: items.length, 'Værktøj': 0, 'Møbler': 0, 'Auto': 0, 'Maskiner': 0, 'Favoritter': favoritesCount };
        items.forEach(item => { if (counts[item.category] !== undefined) counts[item.category]++; });
        return counts;
    }, [items, favoritesCount]);

    const categories = [
        { label: 'Alle Varer', key: 'Alle', count: stats.total, icon: Package, color: 'text-white' },
        { label: 'Favoritter', key: 'Favoritter', count: stats['Favoritter'], icon: Heart, color: 'text-orange-500' },
        { label: 'Værktøj', key: 'Værktøj', count: stats['Værktøj'], icon: Wrench, color: 'text-yellow-400' },
        { label: 'Møbler', key: 'Møbler', count: stats['Møbler'], icon: Armchair, color: 'text-slate-400' },
        { label: 'Auto', key: 'Auto', count: stats['Auto'], icon: Car, color: 'text-orange-500' },
        { label: 'Maskiner', key: 'Maskiner', count: stats['Maskiner'], icon: Settings, color: 'text-blue-400' },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 w-64 shadow-2xl">
            {/* Branding Header */}
            <div className="p-6 pb-2 flex flex-col items-center relative">
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="size-6" />
                </button>

                <div className="bg-yellow-400 p-2 rounded-xl rotate-3 shadow-lg shadow-yellow-400/20 mb-3 group hover:rotate-6 transition-transform">
                    <Package className="text-black size-6" />
                </div>
                <h1 className="text-white font-black text-2xl leading-none tracking-tighter italic whitespace-nowrap">
                    SAGER<span className="text-yellow-400">TIL</span>SALG
                </h1>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-2 mb-2">
                    Professionel genbrug
                </p>
            </div>

            {/* Search and View Mode */}
            <div className="px-4 py-4 space-y-4 border-b border-slate-900">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-600 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Søg i lager..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-8 text-xs font-bold text-white focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-slate-700 uppercase tracking-widest"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-black uppercase tracking-tighter transition-all ${viewMode === 'list' ? 'bg-yellow-400 text-black' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <List className="size-3" />
                        <span>Liste</span>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-black uppercase tracking-tighter transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-black' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <LayoutGrid className="size-3" />
                        <span>Gitter</span>
                    </button>
                </div>
            </div>

            {/* Navigation / Categories */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 custom-scrollbar">
                <div className="space-y-1">
                    <h3 className="text-slate-600 text-xs font-black uppercase tracking-[0.2em] px-2 mb-3">Kategorier</h3>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => {
                                onSelectCategory(cat.key);
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group ${selectedCategory === cat.key
                                ? 'bg-slate-900 border border-slate-800 shadow-inner'
                                : 'hover:bg-slate-900/50 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <cat.icon className={`size-4 ${selectedCategory === cat.key ? cat.color : 'text-slate-600 group-hover:text-slate-400'} ${cat.key === 'Favoritter' && selectedCategory === 'Favoritter' ? 'fill-orange-500' : ''}`} />
                                <span className={`text-[11px] font-black uppercase tracking-wide ${selectedCategory === cat.key ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {cat.label}
                                </span>
                            </div>
                            <span className={`text-xs font-black px-1.5 py-0.5 rounded ${selectedCategory === cat.key
                                ? 'bg-yellow-400 text-black'
                                : 'bg-slate-900 text-slate-700'
                                }`}>
                                {cat.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900 space-y-1">
                    <h3 className="text-slate-600 text-xs font-black uppercase tracking-[0.2em] px-2 mb-3">Admin</h3>
                    <button
                        onClick={() => {
                            onAdminClick();
                            if (window.innerWidth < 768) onClose();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900 transition-all group border border-transparent hover:border-slate-800"
                    >
                        <Lock className="size-4 text-slate-600 group-hover:text-yellow-400 transition-colors" />
                        <span className="text-[11px] font-black uppercase tracking-wide text-slate-500 group-hover:text-slate-200">Lagerstyring</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-900 bg-slate-950">
                <ContactButton
                    variant="sidebar"
                    label="Ring for bestilling"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 rounded-xl shadow-lg shadow-yellow-400/10 mb-2 uppercase tracking-wide text-xs flex justify-center items-center gap-2"
                />
                <div className="text-center space-y-1">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Mårsøvej 1, 4300 Holbæk</p>
                    <p className="text-slate-700 text-xs font-bold uppercase tracking-widest">+45 40 78 14 88</p>
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
