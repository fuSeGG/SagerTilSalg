import { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, Heart, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import ContactButton from './ContactButton';

const ItemModal = ({ item, isFavorite, onToggleFavorite, onClose }) => {
    const [activeImage, setActiveImage] = useState(null);

    // Prepare images array (backward compat)
    const allImages = item?.images && item.images.length > 0
        ? item.images
        : (item?.image ? [item.image] : []);

    useEffect(() => {
        if (allImages.length > 0) setActiveImage(allImages[0]);
    }, [item]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-bg-secondary border-2 border-border w-full max-w-5xl max-h-full overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
                {/* Close Button (Universal) */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-accent hover:bg-accent-hover text-accent-contrast rounded-2xl transition-all shadow-2xl z-[110] group"
                >
                    <X className="size-6 transition-transform group-hover:rotate-90" />
                </button>

                {/* Left: Image Section */}
                <div className="w-full md:w-3/5 bg-black flex flex-col items-center justify-center overflow-hidden h-72 md:h-auto relative group">
                    <img
                        src={activeImage || allImages[0]}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 pointer-events-none" />

                    {/* Thumbnails (only if > 1) */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-2xl overflow-x-auto max-w-[90%] custom-scrollbar z-10">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setActiveImage(img); }}
                                    className={`relative size-12 md:size-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-accent scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="absolute top-6 left-6 pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border font-black text-text-secondary text-xs tracking-[0.3em] uppercase">
                            Ref: {item.sku}
                        </div>
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col custom-scrollbar">
                    <div className="mb-auto w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-orange-500 text-xs font-black uppercase tracking-[0.3em]">{item.category}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-text-primary leading-tight tracking-tighter mb-8 italic uppercase break-words hyphens-auto">
                            {item.name}
                        </h2>

                        <div className="flex flex-col gap-1 mb-10 pb-10 border-b border-border">
                            <span className="text-text-muted text-xs font-black uppercase tracking-widest">Kontant Pris</span>
                            <div className="text-5xl font-black text-accent tracking-tighter tabular-nums drop-shadow-lg break-words">
                                {item.price ? `${item.price},-` : 'RING'}
                            </div>
                        </div>

                        <div className="prose prose-invert mb-10 w-full max-w-none">
                            <h4 className="text-text-muted text-xs font-black uppercase tracking-widest mb-3">Varebeskrivelse</h4>
                            <p className="text-text-primary text-sm leading-relaxed font-medium break-words whitespace-pre-wrap">
                                {item.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 mt-auto">
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12">
                                <ContactButton
                                    variant="primary"
                                    label="Ring for info"
                                    className="w-full py-5 bg-accent text-accent-contrast hover:bg-accent-hover rounded-[1.25rem] font-black text-xl tracking-tighter shadow-xl shadow-accent/10 active:scale-95 transition-all border-b-4 border-accent-hover/50"
                                />
                            </div>
                            <div className="col-span-9">
                                <ContactButton
                                    variant="secondary"
                                    type="sms"
                                    label="Send Forespørgsel (SMS)"
                                    itemInfo={`${item.name} (SKU: ${item.sku})`}
                                    className="w-full py-4 bg-bg-tertiary text-text-primary hover:bg-bg-secondary rounded-[1.25rem] font-bold text-sm tracking-tight border-b-4 border-bg-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <button
                                    onClick={() => onToggleFavorite(item.sku)}
                                    className={`w-full h-full flex items-center justify-center rounded-[1.25rem] border-2 transition-all ${isFavorite
                                        ? 'bg-orange-500 border-orange-600 text-white'
                                        : 'bg-bg-primary border-border text-text-muted hover:text-text-primary hover:border-text-secondary'
                                        }`}
                                >
                                    <Heart className={`size-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;
