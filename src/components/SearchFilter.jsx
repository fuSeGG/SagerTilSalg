import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';

const SearchFilter = ({ searchQuery, setSearchQuery, viewMode, setViewMode }) => {
    return (
        <div className="space-y-6 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Search Input */}
                <div className="relative group w-full max-w-xl">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 p-2 rounded-lg shadow-lg group-focus-within:rotate-3 transition-transform">
                        <Search className="text-black size-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="SØG I LAGERET..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-black focus:outline-none focus:border-yellow-400 transition-all placeholder:text-slate-700 uppercase tracking-widest shadow-2xl"
                    />
                </div>

                {/* View Toggles */}
                <div className="flex bg-slate-900 border-2 border-slate-800 p-1.5 rounded-2xl shadow-xl">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${viewMode === 'list' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-slate-600 hover:text-slate-300'
                            }`}
                    >
                        <List className="size-4" />
                        <span>Liste</span>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-slate-600 hover:text-slate-300'
                            }`}
                    >
                        <LayoutGrid className="size-4" />
                        <span>Gitter</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
