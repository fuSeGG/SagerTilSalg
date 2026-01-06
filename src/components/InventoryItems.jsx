import React from 'react';
import { Heart, Maximize2 } from 'lucide-react';

export const ItemCard = ({ item, isFavorite, onToggleFavorite, onClick, isSelected }) => {
    return (
        <div className={`group bg-slate-900 border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-slate-800 hover:border-slate-700'}`}>
            <div className={`relative aspect-square overflow-hidden bg-black cursor-pointer group-hover:scale-[1.02] transition-transform duration-500`} onClick={onClick}>
                <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-slate-700 rounded text-[10px] font-black text-slate-400 tracking-widest uppercase">
                    {item.sku}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.sku);
                    }}
                    className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all z-10 ${isFavorite ? 'bg-orange-500 text-white shadow-lg' : 'bg-black/60 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                >
                    <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute bottom-3 right-3 bg-yellow-400 px-3 py-1.5 rounded-sm shadow-xl transform rotate-1 group-hover:rotate-0 transition-transform">
                    <span className="text-black font-black text-sm">{item.price ? `${item.price},-` : 'Ring'}</span>
                </div>
            </div>
            <div className="p-4 bg-slate-950/50 group-hover:bg-slate-900 transition-colors border-t border-slate-800">
                <h3 className="text-white font-black text-base mb-1 truncate group-hover:text-yellow-400 transition-colors">{item.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest leading-none">{item.category}</span>
                </div>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed h-8">{item.description}</p>
            </div>
        </div>
    );
};

export const ItemRow = ({ item, isFavorite, onToggleFavorite, onClick, isSelected }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative flex items-center p-3 gap-6 rounded-2xl border-2 transition-all cursor-pointer ${isSelected
                ? 'bg-yellow-400/5 border-yellow-400'
                : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                }`}
        >
            <div className="relative w-20 h-20 rounded-xl overflow-visible flex-shrink-0 z-20">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl shadow-2xl transition-all duration-300 group-hover:scale-[1.65] group-hover:-translate-x-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800"
                />
            </div>

            <div className="flex-1 min-w-0 py-1 transition-all">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-700 tracking-tighter uppercase tabular-nums">{item.sku}</span>
                    <span className="h-1 w-1 bg-slate-800 rounded-full" />
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">{item.category}</span>
                </div>
                <h3 className={`font-black text-base truncate transition-colors ${isSelected ? 'text-yellow-400' : 'text-white group-hover:text-yellow-400'}`}>
                    {item.name}
                </h3>
                <p className="text-slate-600 text-xs truncate max-w-[80%] font-medium mt-0.5">
                    {item.description}
                </p>
            </div>

            <div className="text-right flex-shrink-0 ml-2 flex flex-col items-end gap-2">
                <div className={`text-lg font-black tracking-tighter transition-colors ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                    {item.price ? `${item.price},-` : 'Ring'}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.sku);
                    }}
                    className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-orange-500 bg-orange-500/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-900'
                        }`}
                >
                    <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>
    );
};
