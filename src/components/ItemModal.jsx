import { X, Phone, MessageSquare, Heart, Bookmark } from 'lucide-react';
import ContactButton from './ContactButton';

const ItemModal = ({ item, isFavorite, onToggleFavorite, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-full overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row">
                {/* Header (Mobile) */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800">
                    <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{item.sku}</span>
                    <button onClick={onClose} className="p-2 text-slate-400"><X /></button>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-3/5 bg-slate-950 flex items-center justify-center overflow-hidden h-64 md:h-auto">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto">
                    <div className="hidden md:flex items-center justify-between mb-6">
                        <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{item.sku}</span>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="size-6" /></button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">{item.category}</span>
                        <div className="text-2xl font-bold text-emerald-500">{item.price},-</div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{item.name}</h2>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 mb-8">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Tilgængelig nu
                            </p>
                            {item.quantity > 1 && (
                                <span className="text-slate-500 text-xs font-bold">Antal: {item.quantity}</span>
                            )}
                        </div>
                        <p className="text-slate-400 text-xs">Varen kan ses og afhentes på vores lager efter aftale.</p>
                    </div>

                    <div className="prose prose-invert max-w-none mb-10">
                        <h4 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-2">Beskrivelse</h4>
                        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {item.description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        <button
                            onClick={() => onToggleFavorite(item.sku)}
                            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border ${isFavorite
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-800 border-slate-700 text-white hover:border-slate-500'
                                }`}
                        >
                            <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
                            {isFavorite ? 'Gemt i favoritter' : 'Gem som favorit'}
                        </button>
                    </div>

                    <div className="space-y-3">
                        <ContactButton
                            variant="primary"
                            label="Ring for aftale"
                            className="w-full py-4 text-white rounded-2xl shadow-xl shadow-emerald-500/20"
                        />
                        <ContactButton
                            variant="secondary"
                            type="sms"
                            label="Send SMS"
                            itemInfo={`${item.name} (SKU: ${item.sku})`}
                            className="w-full py-4 text-white border border-slate-700 rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;
