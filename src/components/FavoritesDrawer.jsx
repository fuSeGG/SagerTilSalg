import React from 'react';
import { X, Trash2, Printer, Phone, Heart, Bookmark, ArrowRight } from 'lucide-react';

const FavoritesDrawer = ({ isOpen, onClose, items, onRemove, onClear }) => {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[150] flex justify-end">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Heart className="text-emerald-500 fill-emerald-500 size-5" />
                            Mine Favoritter
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">{items.length} {items.length === 1 ? 'vare' : 'varer'} gemt</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-800 p-4 rounded-full mb-4">
                                <Bookmark className="text-slate-600 size-8" />
                            </div>
                            <h3 className="text-white font-bold mb-2">Ingen favoritter endnu</h3>
                            <p className="text-slate-500 text-sm px-8 mb-8">Gem de varer du er interesseret i, så du kan finde dem frem når du ringer eller besøger os.</p>
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all active:scale-95"
                            >
                                <ArrowRight className="size-4 rotate-180" />
                                Tilbage til varer
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.sku} className="group flex gap-4 bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl relative">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 pr-8">
                                    <span className="text-[10px] font-mono font-bold text-emerald-500">{item.sku}</span>
                                    <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <p className="text-slate-400 text-xs truncate">{item.category}</p>
                                        <span className="text-emerald-500 text-xs font-bold">{item.price},-</span>
                                        {item.quantity > 1 && <span className="text-slate-500 text-[10px]">x{item.quantity}</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemove(item.sku)}
                                    className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-slate-800 bg-slate-900/50 space-y-3">
                        <button
                            onClick={handlePrint}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-bold transition-all"
                        >
                            <Printer className="size-5" />
                            Print Liste
                        </button>
                        <a
                            href="tel:+4540781488"
                            className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Phone className="size-5" />
                            Ring til Peter
                        </a>
                        <button
                            onClick={onClear}
                            className="w-full text-slate-500 text-sm font-medium hover:text-slate-300 transition-colors"
                        >
                            Ryd liste
                        </button>
                    </div>
                )}
            </div>

            {/* Hidden Print Content */}
            <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-[1000]">
                <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tighter">SagerTilSalg</h1>
                        <p className="text-sm font-bold">Peter Behrends Lager</p>
                        <p className="text-sm">Mårsøvej 1, 4300 Holbæk</p>
                        <p className="text-sm font-bold">Tlf: +45 40 78 14 88</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs">Dato: {new Date().toLocaleDateString('da-DK')}</p>
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-6">Min Ønskeliste</h2>
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.sku} className="flex gap-4 border-b border-slate-200 pb-4">
                            <div className="w-20 h-20 border border-slate-300">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-600">{item.sku}</p>
                                <h3 className="text-lg font-bold leading-none mb-1">{item.name}</h3>
                                <p className="text-sm font-bold uppercase text-slate-500">{item.category} — {item.price},- {item.quantity > 1 ? `(Antal: ${item.quantity})` : ''}</p>
                                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t-2 border-black text-center text-sm font-bold">
                    Ring venligst for at aftale besøg før du kører til lageret.
                </div>
            </div>
        </div>
    );
};

export default FavoritesDrawer;
