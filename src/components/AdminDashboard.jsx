import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Search, Trash2, Edit, Package, BarChart3, X, HardDrive, Settings, ChevronDown } from 'lucide-react';
import { getStorageUsage } from '../utils/storageUsage';
import { CATEGORIES, COLORS, ICON_MAP, getIconComponent } from '../utils/constants';

const AdminDashboard = ({ items, onAdd, onEdit, onDelete, onBack, categories = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [storageInfo, setStorageInfo] = useState(null);

    // Category Management State
    const [isManagingCategories, setIsManagingCategories] = useState(false);
    const [newCategory, setNewCategory] = useState({ label: '', skuPrefix: '', icon: 'Box', color: 'text-purple-500' });
    const [catDeleteConfirm, setCatDeleteConfirm] = useState(null); // ID of category to delete
    const [catDeleteInput, setCatDeleteInput] = useState(''); // Text input for confirmation

    // Fallback if categories prop is empty
    const activeCategories = (categories && categories.length > 0) ? categories : CATEGORIES;

    useEffect(() => {
        getStorageUsage().then(setStorageInfo);
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto flex flex-col pb-20 px-4 md:px-0">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex flex-col gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-3 w-fit px-5 py-2.5 bg-bg-tertiary border-2 border-border/80 hover:border-accent hover:bg-bg-secondary text-text-secondary hover:text-text-primary rounded-xl font-black uppercase text-[11px] tracking-[0.2em] transition-all group shadow-lg"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                        <span>Tilbage til showroom</span>
                    </button>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-text-primary uppercase italic tracking-tighter leading-none">LAGER<span className="text-accent">STYRING</span></h2>
                    </div>
                </div>
                <div>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-hover text-accent-contrast rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-accent/20 active:scale-95 border-b-4 border-accent-hover w-full md:w-auto justify-center"
                    >
                        <Plus className="size-5" />
                        <span>Tilføj Vare</span>
                    </button>
                </div>
            </div>

            {/* Internal Stats Dashboard */}
            <div className="bg-bg-secondary/50 border-2 border-border rounded-3xl p-3 md:p-6 mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-6">
                <div className="flex flex-col border-l-2 border-accent pl-4">
                    <span className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">Total Beholdning</span>
                    <span className="text-3xl font-black text-text-primary tracking-tighter tabular-nums leading-none">{items.length}</span>
                </div>
                {activeCategories.map(cat => (
                    <div key={cat.id} className="flex flex-col border-l-2 border-border pl-4 hover:border-text-muted transition-colors">
                        <span className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">{cat.label}</span>
                        <span className="text-2xl font-black text-text-secondary tracking-tighter tabular-nums leading-none">
                            {items.filter(i => i.category === cat.id).length}
                        </span>
                    </div>
                ))}
                {/* Storage Usage Indicator */}
                <div className="flex flex-col border-l-2 border-border pl-4 col-span-2 sm:col-span-1 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-1">
                        <HardDrive className="size-3 text-text-muted" />
                        <span className="text-text-muted text-xs font-black uppercase tracking-widest">Billeder</span>
                    </div>
                    {storageInfo ? (
                        <>
                            <span className="text-xl font-black text-text-secondary tracking-tighter tabular-nums leading-none">
                                {storageInfo.formattedUsed}
                            </span>
                            <div className="mt-2 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${storageInfo.usedPercent > 80 ? 'bg-error' : storageInfo.usedPercent > 50 ? 'bg-accent' : 'bg-success'}`}
                                    style={{ width: `${Math.min(storageInfo.usedPercent, 100)}%` }}
                                />
                            </div>
                            <span className="text-text-muted text-[10px] font-bold mt-1">{storageInfo.usedPercent}% af 1 GB</span>
                        </>
                    ) : (
                        <span className="text-text-muted text-xs font-bold">Indlæser...</span>
                    )}
                </div>
            </div>

            {/* Category Management Toggle */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsManagingCategories(!isManagingCategories)}
                    className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors flex items-center gap-2"
                >
                    <Settings className="size-4" />
                    <span>{isManagingCategories ? 'Skjul kategorier' : 'Administrer kategorier'}</span>
                </button>
            </div>

            {/* Category Management Section */}
            {isManagingCategories && (
                <div className="bg-bg-secondary border-2 border-accent/20 rounded-3xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-xl font-black text-text-primary uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                        <Package className="text-accent size-6" />
                        Kategorier
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* New Category Form */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Tilføj Ny</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    placeholder="Navn (f.eks. Cykler)"
                                    value={newCategory.label}
                                    onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
                                    className="bg-bg-tertiary border border-border rounded-xl px-3 py-2 text-sm font-bold focus:border-accent outline-none"
                                />
                                <input
                                    placeholder="Prefix (f.eks. CYK)"
                                    maxLength={4}
                                    value={newCategory.skuPrefix}
                                    onChange={e => setNewCategory({ ...newCategory, skuPrefix: e.target.value.toUpperCase() })}
                                    className="bg-bg-tertiary border border-border rounded-xl px-3 py-2 text-sm font-bold focus:border-accent outline-none uppercase font-mono"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Icon Grid Picker */}
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Vælg Ikon</h5>
                                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 bg-bg-tertiary p-3 rounded-2xl border border-border max-h-32 overflow-y-auto custom-scrollbar">
                                        {Object.entries(ICON_MAP).map(([name, Icon]) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setNewCategory({ ...newCategory, icon: name })}
                                                className={`p-2.5 rounded-xl transition-all flex items-center justify-center border-2 ${newCategory.icon === name ? 'bg-accent/10 border-accent text-accent' : 'border-transparent text-text-muted hover:bg-bg-secondary hover:text-text-primary'}`}
                                                title={name}
                                            >
                                                <Icon className="size-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Picker with Dots */}
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Vælg Farve</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {COLORS.map((col) => (
                                            <button
                                                key={col.name}
                                                type="button"
                                                onClick={() => setNewCategory({ ...newCategory, color: col.class })}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${newCategory.color === col.class ? 'bg-bg-tertiary border-accent' : 'bg-bg-tertiary/50 border-border hover:border-text-muted'}`}
                                            >
                                                <div className="size-2.5 rounded-full" style={{ backgroundColor: col.hex }} />
                                                <span className={`text-xs font-bold ${col.class === newCategory.color ? 'text-text-primary' : 'text-text-secondary'}`}>
                                                    {col.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!newCategory.label || !newCategory.skuPrefix) return;
                                    const catId = newCategory.label; // Use label as ID for simplicity

                                    try {
                                        // We need the PIN to save
                                        const pin = prompt('Indtast PIN for at gemme kategori:');
                                        if (!pin) return;

                                        const res = await fetch('/admin/save-category', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                category: { id: catId, ...newCategory },
                                                pin
                                            })
                                        });

                                        if (res.ok) {
                                            window.location.reload(); // Simple reload to refresh
                                        } else {
                                            alert('Fejl: Kunne ikke gemme kategori');
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert('Fejl');
                                    }
                                }}
                                className="w-full bg-accent hover:bg-accent-hover text-accent-contrast py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
                            >
                                Opret Kategori
                            </button>
                        </div>

                        {/* Existing Categories List */}
                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest sticky top-0 bg-bg-secondary pb-2 z-10">Eksisterende</h4>
                            {activeCategories.map(cat => {
                                const itemCount = items.filter(i => i.category === cat.id).length;
                                const isDeleting = catDeleteConfirm === cat.id;
                                const isProtected = (cat.id === 'Værktøj' || cat.id === 'Materialer'); // Example protection if needed, currently not enforcing

                                const IconComp = getIconComponent(cat.icon);

                                return (
                                    <div key={cat.id} className="bg-bg-primary border border-border rounded-xl p-3 flex items-center justify-between group hover:border-text-muted transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-bg-tertiary ${cat.color}`}>
                                                <IconComp className="size-4" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                                                    {cat.label}
                                                    <span className="font-mono text-[10px] text-text-muted bg-bg-tertiary px-1 rounded">{cat.skuPrefix}</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{itemCount} varer</div>
                                            </div>
                                        </div>

                                        {isDeleting ? (
                                            <div className="flex flex-col items-end gap-2 animate-in slide-in-from-right-4">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-error uppercase">Skriv PRÆCIS:</span>
                                                    <span className="text-[10px] font-black text-text-primary select-all">{cat.id}</span>
                                                </div>
                                                <input
                                                    className="w-32 bg-bg-tertiary border border-error rounded-lg px-2 py-1 text-xs font-bold focus:outline-none placeholder:text-text-muted/50"
                                                    placeholder="Skriv navn her..."
                                                    value={catDeleteInput}
                                                    onChange={e => setCatDeleteInput(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={async () => {
                                                            if (catDeleteInput !== cat.id) return;
                                                            const pin = prompt('Indtast PIN for at slette:');
                                                            if (!pin) return;

                                                            const res = await fetch('/admin/delete-category', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ id: cat.id, pin })
                                                            });

                                                            if (res.ok) window.location.reload();
                                                            else alert('Kunne ikke slette (måske har den stadig varer?)');
                                                        }}
                                                        disabled={catDeleteInput !== cat.id}
                                                        className="px-2 py-1 bg-error text-white rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Slet
                                                    </button>
                                                    <button onClick={() => { setCatDeleteConfirm(null); setCatDeleteInput(''); }} className="px-2 py-1 bg-bg-tertiary rounded text-xs">Annuller</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (itemCount > 0) {
                                                        alert('Du kan ikke slette en kategori, der indeholder varer. Slet eller flyt varerne først.');
                                                        return;
                                                    }
                                                    setCatDeleteConfirm(cat.id);
                                                    setCatDeleteInput('');
                                                }}
                                                disabled={itemCount > 0}
                                                className={`p-2 rounded-lg border transition-all ${itemCount > 0
                                                    ? 'opacity-20 cursor-not-allowed border-transparent text-text-muted bg-bg-tertiary'
                                                    : 'border-border hover:border-error hover:text-error hover:bg-error/10 text-text-muted cursor-pointer'}`}
                                                title={itemCount > 0 ? "Kan ikke slette kategori med varer" : "Slet kategori"}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory List Header */}
            <div className="bg-bg-secondary border-2 border-border rounded-t-[2rem] md:rounded-t-[2.5rem] px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-bg-tertiary p-2 rounded-lg">
                        <BarChart3 className="text-text-secondary size-5" />
                    </div>
                    <h3 className="text-text-primary font-black text-xl uppercase italic tracking-tight">Vareoversigt</h3>
                </div>
                <div className="relative group w-full md:w-[400px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-bg-tertiary p-1.5 rounded-md">
                        <Search className="text-text-secondary size-3" />
                    </div>
                    <input
                        type="text"
                        placeholder="Søg i lager..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-primary border-2 border-border rounded-2xl py-3 pl-14 pr-4 text-sm font-black text-text-primary focus:outline-none focus:border-text-muted transition-all placeholder:text-text-muted uppercase tracking-tighter"
                    />
                </div>
            </div>

            {/* Inventory Container - Responsive List View */}
            <div className="bg-bg-secondary/40 border-x-2 border-b-2 border-border rounded-b-[2rem] md:rounded-b-[2.5rem] overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar -mx-[2px]">
                    <table className="w-full text-left border-collapse w-full">
                        <thead className="bg-bg-primary/50">
                            <tr className="text-text-muted text-xs uppercase font-black tracking-[0.3em]">
                                <th className="px-8 py-4 border-b border-border">Varer</th>
                                <th className="px-4 py-4 border-b border-border">Ref</th>
                                <th className="px-4 py-4 border-b border-border">Kategori</th>
                                <th className="px-4 py-4 border-b border-border">Pris / Antal</th>
                                <th className="px-8 py-4 border-b border-border text-right">Valg</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredItems.map((item) => (
                                <tr key={item.sku} className="group hover:bg-bg-tertiary/30 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-primary border border-border flex-shrink-0 relative">
                                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                                {(item.images?.length > 1) && (
                                                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] font-bold px-1 rounded-tl-md backdrop-blur-sm">
                                                        +{item.images.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-text-primary font-black text-lg truncate max-w-[300px] uppercase tracking-tighter italic leading-none mb-1">{item.name}</div>
                                                <div className="text-text-muted text-xs font-bold truncate max-w-[200px] uppercase tracking-widest opacity-60">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-black text-text-muted text-xs tracking-widest italic group-hover:text-accent transition-colors uppercase tabular-nums">
                                        {item.sku}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="bg-bg-tertiary/50 text-text-secondary text-xs font-black px-2.5 py-1 rounded-md border border-border uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-text-primary font-black text-base tracking-tighter italic leading-none">{item.price ? `${item.price},-` : '-'}</span>
                                            <span className="text-text-muted font-bold tabular-nums text-xs uppercase tracking-widest mt-1">{item.quantity || 1} stk</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {deleteConfirm === item.sku ? (
                                                <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
                                                    <button onClick={() => onDelete(item.sku)} className="px-3 py-1.5 bg-error text-white hover:bg-error/80 rounded-lg font-black uppercase text-xs tracking-widest transition-all">Slet</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="p-1.5 bg-bg-tertiary text-text-muted rounded-lg border border-border"><X className="size-3.5" /></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => onEdit(item)} className="p-2.5 bg-bg-primary text-text-muted hover:text-accent border border-border rounded-lg transition-all" title="Rediger"><Edit className="size-4" /></button>
                                                    <button onClick={() => setDeleteConfirm(item.sku)} className="p-2.5 bg-bg-primary text-text-muted hover:text-error border border-border rounded-lg transition-all" title="Slet"><Trash2 className="size-4" /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col gap-3 p-4">
                    {filteredItems.map((item) => (
                        <div key={item.sku} className="bg-bg-primary/50 border border-border rounded-2xl p-3 flex gap-4 shadow-sm relative overflow-hidden group">
                            {/* Delete Confirmation Overlay */}
                            {deleteConfirm === item.sku && (
                                <div className="absolute inset-0 bg-bg-primary/95 z-20 flex items-center justify-center gap-3 animate-in fade-in duration-200 backdrop-blur-sm">
                                    <span className="text-text-primary font-bold text-xs uppercase tracking-widest">Slet vare?</span>
                                    <button onClick={() => onDelete(item.sku)} className="px-4 py-2 bg-error text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-error/20">Bekræft</button>
                                    <button onClick={() => setDeleteConfirm(null)} className="p-2 bg-bg-tertiary text-text-muted rounded-xl border border-border"><X className="size-4" /></button>
                                </div>
                            )}

                            <div className="w-20 h-24 rounded-xl bg-bg-secondary border border-border overflow-hidden flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-text-primary font-black text-base uppercase italic tracking-tighter leading-none truncate">{item.name}</h4>
                                        <span className="text-accent font-black text-sm tracking-tighter whitespace-nowrap">{item.price},-</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold bg-bg-tertiary px-1.5 py-0.5 rounded text-text-secondary uppercase tracking-wider">{item.category}</span>
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{item.sku}</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex items-center gap-1.5 bg-bg-tertiary/50 px-2 py-1 rounded-lg border border-border/50">
                                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Lager:</span>
                                        <span className="text-text-primary text-xs font-black tabular-nums">{item.quantity || 1}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary border border-border rounded-lg active:scale-95 transition-all"
                                        >
                                            <Edit className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(item.sku)}
                                            className="p-2 bg-bg-primary hover:bg-error hover:text-white text-text-muted border border-border rounded-lg active:scale-95 transition-all"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="px-8 py-20 text-center text-text-muted font-black uppercase tracking-[0.3em] italic opacity-30">
                        Ingen varer fundet
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
