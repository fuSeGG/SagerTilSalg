import React from 'react';
import { Heart, Maximize2 } from 'lucide-react';

// Helper to format SKU for display (AUT-00003 -> AU 3)
const formatSku = (sku) => {
    if (!sku) return '';
    const parts = sku.split('-');
    if (parts.length < 2) return sku; // Fallback
    const prefix = parts[0].substring(0, 2); // First 2 chars of prefix
    const number = parseInt(parts[1], 10); // Parse int to remove leading zeros
    return `${prefix} ${number}`;
};

const getPrimaryImage = (item) => {
    if (item?.images && item.images.length > 0) return item.images[0];
    return item?.image || '';
};

export const ItemCard = ({ item, isFavorite, onToggleFavorite, onClick, isSelected }) => {
    return (
        <div className={`group bg-bg-secondary border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isSelected ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:border-text-muted/30'}`}>
            <div className={`relative aspect-video overflow-hidden bg-black cursor-pointer group-hover:scale-[1.02] transition-transform duration-500`} onClick={onClick}>
                <img
                    src={getPrimaryImage(item)}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.sku);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-orange-500 text-white' : 'bg-black/50 text-text-primary/50 hover:bg-black/80 hover:text-text-primary'}`}
                    >
                        <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>
                {(item.images?.length > 1) && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        +{item.images.length - 1} Billeder
                    </div>
                )}
            </div>

            <div className="p-3" onClick={onClick}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-text-muted uppercase tracking-widest">{formatSku(item.sku)}</span>
                    <span className="h-1 w-1 bg-border rounded-full" />
                    <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{item.category}</span>
                </div>

                <h3 className={`font-black text-lg leading-tight mb-1 truncate transition-colors ${isSelected ? 'text-accent' : 'text-text-primary group-hover:text-accent'}`}>
                    {item.name}
                </h3>

                <p className="text-text-muted text-xs line-clamp-2 font-medium opacity-80 leading-tight mb-2">
                    {item.description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                    <p className={`text-xl font-black tracking-tighter ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                        {item.price ? `${item.price},-` : 'Ring'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const ItemRow = ({ item, isFavorite, onToggleFavorite, onClick, isSelected }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative flex items-start p-1.5 gap-3 rounded-xl border border-border transition-all cursor-pointer ${isSelected
                ? 'bg-accent/5 border-accent'
                : 'bg-bg-primary border-border hover:border-text-muted/30'
                }`}
        >
            <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 z-20 bg-black">
                <img
                    src={getPrimaryImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg shadow-sm border border-border"
                />
                {(item.images?.length > 1) && (
                    <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-bold px-1 rounded-tl-md backdrop-blur-sm">
                        +{item.images.length - 1}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-x-4 py-0.5">
                {/* Name & Metadata */}
                <div className="min-w-0 md:w-1/4 flex-shrink-0">
                    <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
                        <span className="text-xs font-black text-text-muted tracking-tighter uppercase tabular-nums">{formatSku(item.sku)}</span>
                        <span className="text-xs text-text-muted mx-0.5">•</span>
                        <span className="text-xs font-black text-orange-600 uppercase tracking-wider">{item.category}</span>
                    </div>
                    <h3 className={`font-black text-sm truncate transition-colors leading-tight ${isSelected ? 'text-accent' : 'text-text-primary group-hover:text-accent'}`}>
                        {item.name}
                    </h3>
                    <p className="md:hidden text-text-muted text-xs truncate max-w-[95%] font-medium mt-0.5 leading-tight">
                        {item.description}
                    </p>
                </div>

                {/* Desktop Description */}
                <div className="hidden md:block flex-1 min-w-0">
                    <p className="text-text-secondary text-[11px] font-medium line-clamp-2 max-w-3xl opacity-90">
                        {item.description}
                    </p>
                </div>
            </div>

            <div className="text-right flex-shrink-0 ml-1 flex flex-col items-end gap-1">
                <div className={`text-sm font-black tracking-tighter transition-colors ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                    {item.price ? `${item.price},-` : 'Ring'}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.sku);
                    }}
                    className={`p-1.5 rounded-md transition-all ${isFavorite ? 'text-orange-500 bg-orange-500/10' : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary'
                        }`}
                >
                    <Heart className={`size-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>
    );
};
