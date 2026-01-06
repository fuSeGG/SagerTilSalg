import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';

const SearchFilter = ({ searchQuery, setSearchQuery, viewMode, setViewMode }) => {
    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors size-5" />
                    <input
                        type="text"
                        placeholder="Søg efter navn, SKU eller beskrivelse..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600 shadow-inner"
                    />
                </div>

                {/* View Toggles */}
                <div className="flex bg-slate-800/50 border border-slate-700/50 p-1.5 rounded-2xl md:w-auto self-end md:self-auto">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${viewMode === 'list' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <List className="size-4" />
                        <span className="hidden sm:inline">Liste</span>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${viewMode === 'grid' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <LayoutGrid className="size-4" />
                        <span className="hidden sm:inline">Grid</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
