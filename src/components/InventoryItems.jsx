import React from 'react';
import { Heart, Maximize2 } from 'lucide-react';

export const ItemCard = ({ item, isFavorite, onToggleFavorite, onClick, isSelected }) => {
    return (
        <div className={`group bg-slate-800/40 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 ${isSelected ? 'border-emerald-500 shadow-xl ring-1 ring-emerald-500/20' : 'border-slate-700/50 hover:border-emerald-500/50'}`}>
            <div className="relative aspect-square overflow-hidden bg-slate-900 cursor-pointer" onClick={onClick}>
                <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white size-8 opacity-75" />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.sku);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 text-white hover:bg-slate-900'
                        }`}
                >
                    <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{item.sku}</span>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-bold leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-slate-700/50 px-2.5 py-1 rounded-md">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">{item.category}</span>
                    </div>
                    <div className="text-emerald-500 font-bold">
                        {item.price},-
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-3">
                    <p className="text-slate-400 line-clamp-3 leading-relaxed flex-1 mr-2">
                        {item.description}
                    </p>
                    {item.quantity > 1 && (
                        <span className="text-slate-500 whitespace-nowrap self-start mt-1">Antal: {item.quantity}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ItemRow = ({ item, isFavorite, onToggleFavorite, onClick, isSelected }) => {
    return (
        <div
            onClick={onClick}
            className={`group flex items-center gap-10 bg-slate-800/20 border border-slate-700/10 rounded-lg transition-all duration-200 cursor-pointer p-2
                ${isSelected ? 'bg-slate-800/40 border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-xl' : 'hover:bg-slate-800/30 border-transparent'}
            `}
        >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-slate-900 flex-shrink-0 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-md transition-all duration-300 shadow-lg group-hover:scale-[1.8] group-hover:shadow-2xl z-10 group-hover:z-50 relative pointer-events-none"
                />
            </div>
            <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2 font-mono">
                        <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/5 px-1 py-0 rounded">{item.sku}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">{item.category}</span>
                    </div>
                    <span className="text-emerald-500 font-bold text-[10px]">{item.price},-</span>
                </div>
                <h3 className="text-white font-bold truncate group-hover:text-emerald-400 transition-all leading-tight mb-0.5 text-xs md:text-sm">
                    {item.name}
                </h3>
                <div className="flex items-center gap-3">
                    <p className="text-slate-500 truncate flex-1 leading-none text-[9px] md:text-xs">
                        {item.description}
                    </p>
                    {item.quantity > 1 && <span className="text-slate-600 text-[8px] whitespace-nowrap">x{item.quantity}</span>}
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.sku);
                }}
                className={`p-1.5 rounded-lg transition-all ${isFavorite ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'
                    }`}
            >
                <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
        </div>
    );
};
