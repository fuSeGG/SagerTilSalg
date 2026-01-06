import { X, Phone, MessageSquare, Heart, Save } from 'lucide-react';
import ContactButton from './ContactButton';

const ItemModal = ({ item, isFavorite, onToggleFavorite, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-slate-900 border-2 border-slate-800 w-full max-w-5xl max-h-full overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
                {/* Close Button (Universal) */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl transition-all shadow-2xl z-[110] group"
                >
                    <X className="size-6 transition-transform group-hover:rotate-90" />
                </button>

                {/* Left: Image Section */}
                <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden h-72 md:h-auto relative">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                    <div className="absolute bottom-6 left-6">
                        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 font-black text-slate-400 text-[10px] tracking-[0.3em] uppercase">
                            Ref: {item.sku}
                        </div>
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col">
                    <div className="mb-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-orange-500 text-xs font-black uppercase tracking-[0.3em]">{item.category}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter mb-8 italic uppercase">
                            {item.name}
                        </h2>

                        <div className="flex flex-col gap-1 mb-10 pb-10 border-b border-slate-800">
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Kontant Pris</span>
                            <div className="text-5xl font-black text-yellow-400 tracking-tighter tabular-nums drop-shadow-lg">
                                {item.price ? `${item.price},-` : 'RING'}
                            </div>
                        </div>

                        <div className="prose prose-invert mb-10">
                            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Varebeskrivelse</h4>
                            <p className="text-slate-100 text-sm leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 mt-auto">
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12">
                                <ContactButton
                                    variant="primary"
                                    label="Ring til Peter"
                                    className="w-full py-5 bg-yellow-400 text-black hover:bg-yellow-500 rounded-[1.25rem] font-black text-xl tracking-tighter shadow-xl shadow-yellow-400/10 active:scale-95 transition-all border-b-4 border-yellow-600"
                                />
                            </div>
                            <div className="col-span-9">
                                <ContactButton
                                    variant="secondary"
                                    type="sms"
                                    label="Send Forespørgsel (SMS)"
                                    itemInfo={`${item.name} (SKU: ${item.sku})`}
                                    className="w-full py-4 bg-slate-800 text-white hover:bg-slate-700 rounded-[1.25rem] font-bold text-sm tracking-tight border-b-4 border-slate-950"
                                />
                            </div>
                            <div className="col-span-3">
                                <button
                                    onClick={() => onToggleFavorite(item.sku)}
                                    className={`w-full h-full flex items-center justify-center rounded-[1.25rem] border-2 transition-all ${isFavorite
                                        ? 'bg-orange-500 border-orange-600 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-white hover:border-slate-600'
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
