import React, { useState, useEffect } from 'react'; // Trigger redeploy
import { Plus, ArrowLeft, Search, Trash2, Edit, Package, BarChart3, X, HardDrive, Settings, ChevronDown } from 'lucide-react';
import { getStorageUsage } from '../utils/storageUsage';
import { CATEGORIES, COLORS, ICON_MAP, getIconComponent } from '../utils/constants';

const AdminDashboard = ({ items, onAdd, onEdit, onDelete, onBack, categories = [], onInspect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [storageInfo, setStorageInfo] = useState(null);

    // Category Management State
    const [isManagingCategories, setIsManagingCategories] = useState(false);
    const [newCategory, setNewCategory] = useState({ label: '', skuPrefix: '', icon: 'Box', color: 'text-purple-500' });
    const [editingCategory, setEditingCategory] = useState(null);
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

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* New/Edit Category Form */}
                        <div className={`space-y-4 lg:col-span-1 border-r-0 lg:border-r border-border pr-0 lg:pr-8 ${editingCategory ? 'bg-bg-tertiary/20 p-4 rounded-2xl border border-dashed border-accent/30' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                                    {editingCategory ? `Redigerer: ${editingCategory.label}` : 'Tilføj Ny Kategori'}
                                </h4>
                                {editingCategory && (
                                    <button
                                        onClick={() => setEditingCategory(null)}
                                        className="text-[10px] font-black uppercase text-text-muted hover:text-error transition-colors"
                                    >
                                        Annuller
                                    </button>
                                )}
                            </div>

                            {(() => {
                                // Normalize used icons to names for the indicator logic
                                const usedIcons = activeCategories.map(c => {
                                    if (typeof c.icon === 'string') return c.icon;
                                    // If it's a component, find its name in ICON_MAP
                                    const entry = Object.entries(ICON_MAP).find(([name, comp]) => comp === c.icon);
                                    return entry ? entry[0] : null;
                                }).filter(Boolean);

                                const usedColors = activeCategories.map(c => c.color);
                                const currentData = editingCategory || newCategory;
                                const isEditing = !!editingCategory;

                                return (
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {!isEditing && (
                                                <input
                                                    placeholder="Navn (f.eks. Cykler)"
                                                    value={newCategory.label}
                                                    onChange={e => {
                                                        const label = e.target.value;
                                                        const nameStart = label.replace(/[^a-zA-ZæøåÆØÅ]/g, '').substring(0, 3).toUpperCase();
                                                        let prefix = nameStart.substring(0, 2);
                                                        const existingPrefixes = activeCategories.map(c => (c.skuPrefix || c.sku_prefix || '').toUpperCase());
                                                        if (existingPrefixes.includes(prefix) && nameStart.length >= 3) {
                                                            prefix = nameStart.substring(0, 3);
                                                        }
                                                        setNewCategory({ ...newCategory, label, skuPrefix: prefix });
                                                    }}
                                                    className="bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-accent outline-none col-span-2 shadow-inner transition-all"
                                                />
                                            )}
                                            {currentData.label && !isEditing && (
                                                <div className="col-span-2 px-4 py-2 bg-bg-tertiary/50 rounded-xl border border-dashed border-border flex items-center justify-between animate-in zoom-in-95">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">SKU Prefix:</span>
                                                    <span className="font-mono text-xs font-black text-accent">{currentData.skuPrefix}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {/* Icon Grid Picker */}
                                            <div>
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Vælg Ikon</h5>
                                                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2 bg-bg-tertiary p-3 rounded-2xl border border-border max-h-48 overflow-y-auto custom-scrollbar shadow-inner">
                                                    {Object.entries(ICON_MAP).map(([name, Icon]) => {
                                                        const isUsed = usedIcons.includes(name);
                                                        const isSelected = currentData.icon === name;
                                                        return (
                                                            <button
                                                                key={name}
                                                                type="button"
                                                                onClick={() => isEditing ? setEditingCategory({ ...editingCategory, icon: name }) : setNewCategory({ ...newCategory, icon: name })}
                                                                className={`p-2.5 rounded-xl transition-all flex items-center justify-center border-2 relative ${isSelected ? 'bg-accent/10 border-accent text-accent' : 'border-transparent text-text-muted hover:bg-bg-secondary hover:text-text-primary'}`}
                                                                title={name + (isUsed ? ' (I brug)' : '')}
                                                            >
                                                                <Icon className={`size-5 ${isUsed && !isSelected ? 'opacity-30' : ''}`} />
                                                                {isUsed && (
                                                                    <span className="absolute top-1 right-1 size-1.5 bg-accent rounded-full animate-pulse" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Color Picker with Dots */}
                                            <div>
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Vælg Farve</h5>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {COLORS.map((col) => {
                                                        const isUsed = usedColors.includes(col.class);
                                                        const isSelected = currentData.color === col.class;
                                                        return (
                                                            <button
                                                                key={col.name}
                                                                type="button"
                                                                onClick={() => isEditing ? setEditingCategory({ ...editingCategory, color: col.class }) : setNewCategory({ ...newCategory, color: col.class })}
                                                                className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 transition-all relative ${isSelected ? 'bg-bg-tertiary border-accent shadow-sm' : 'bg-bg-tertiary/30 border-transparent hover:bg-bg-tertiary hover:border-border'}`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="size-3 rounded-full shadow-sm" style={{ backgroundColor: col.hex }} />
                                                                    <span className={`text-xs font-bold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                                                                        {col.name}
                                                                    </span>
                                                                </div>
                                                                {isUsed && (
                                                                    <span className="text-[8px] font-black text-accent uppercase tracking-tighter bg-accent/10 px-1.5 py-0.5 rounded">I brug</span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <button
                                                onClick={async () => {
                                                    const target = isEditing ? editingCategory : newCategory;
                                                    if (!target.label || !target.skuPrefix) return;

                                                    try {
                                                        const pin = prompt(`Indtast PIN for at ${isEditing ? 'opdatere' : 'oprette'} kategori:`);
                                                        if (!pin) return;

                                                        const res = await fetch('/admin/save-category', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                category: { id: target.id || target.label, ...target },
                                                                pin
                                                            })
                                                        });

                                                        if (res.ok) {
                                                            window.location.reload();
                                                        } else {
                                                            alert('Fejl: Kunne ikke gemme kategori');
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert('Fejl');
                                                    }
                                                }}
                                                className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 ${isEditing ? 'bg-success hover:bg-success/90 text-white' : 'bg-accent hover:bg-accent-hover text-accent-contrast'}`}
                                            >
                                                {isEditing ? 'Gem Ændringer' : 'Opret Kategori'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Existing Categories List */}
                        <div className="lg:col-span-2 space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-4">
                            <div className="flex items-center justify-between sticky top-0 bg-bg-secondary pb-4 z-10">
                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Eksisterende Kategorier</h4>
                                <span className="text-[10px] font-black text-text-muted uppercase bg-bg-tertiary px-2 py-1 rounded-full">{activeCategories.length} i alt</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {activeCategories.map(cat => {
                                    const itemCount = items.filter(i => i.category === (cat.id || cat.label)).length;
                                    const isDeleting = catDeleteConfirm === cat.id;
                                    const isEditing = editingCategory?.id === cat.id;
                                    const IconComp = typeof cat.icon === 'string'
                                        ? getIconComponent(cat.icon)
                                        : cat.icon;

                                    return (
                                        <div
                                            key={cat.id}
                                            className={`bg-bg-primary border-2 rounded-2xl p-4 flex items-center justify-between group transition-all duration-300 ${isEditing ? 'border-accent shadow-xl bg-accent/5' : 'border-border hover:border-text-muted'}`}
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <button
                                                    onClick={() => {
                                                        const iconName = typeof cat.icon === 'string' ? cat.icon :
                                                            Object.entries(ICON_MAP).find(([name, comp]) => comp === cat.icon)?.[0] || 'Box';
                                                        setEditingCategory({
                                                            id: cat.id,
                                                            label: cat.label,
                                                            skuPrefix: cat.skuPrefix || cat.sku_prefix,
                                                            icon: iconName,
                                                            color: cat.color
                                                        });
                                                        // Scroll the form into view on mobile
                                                        if (window.innerWidth < 1024) {
                                                            document.querySelector('.bg-bg-secondary')?.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    }}
                                                    className={`relative p-3 rounded-xl bg-bg-tertiary transition-all group/icon shadow-inner ${cat.color} hover:ring-2 hover:ring-accent/30`}
                                                    title="Rediger ikon/farve"
                                                >
                                                    <IconComp className="size-6" />
                                                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Edit className="size-3 text-white" />
                                                    </div>
                                                </button>
                                                <div className="min-w-0">
                                                    <div className="font-black text-text-primary text-base uppercase italic tracking-tighter flex items-center gap-2">
                                                        {cat.label}
                                                        <span className="font-mono text-[10px] text-text-muted bg-bg-tertiary px-2 py-0.5 rounded border border-border/50">{cat.skuPrefix || cat.sku_prefix}</span>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-0.5">
                                                        {itemCount} {itemCount === 1 ? 'vare' : 'varer'}
                                                    </div>
                                                </div>
                                            </div>

                                            {isDeleting ? (
                                                <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                                                    <input
                                                        className="w-24 bg-bg-tertiary border border-error rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none"
                                                        placeholder="Varenavn..."
                                                        value={catDeleteInput}
                                                        onChange={e => setCatDeleteInput(e.target.value)}
                                                        autoFocus
                                                    />
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
                                                            else alert('Fejl ved sletning');
                                                        }}
                                                        className="p-1.5 bg-error text-white rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                    <button onClick={() => { setCatDeleteConfirm(null); setCatDeleteInput(''); }} className="p-1.5 bg-bg-tertiary rounded-lg"><X className="size-4" /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const iconName = typeof cat.icon === 'string' ? cat.icon :
                                                                Object.entries(ICON_MAP).find(([name, comp]) => comp === cat.icon)?.[0] || 'Box';
                                                            setEditingCategory({
                                                                id: cat.id,
                                                                label: cat.label,
                                                                skuPrefix: cat.skuPrefix || cat.sku_prefix,
                                                                icon: iconName,
                                                                color: cat.color
                                                            });
                                                        }}
                                                        className="p-2.5 rounded-xl border border-border hover:border-accent hover:text-accent transition-all text-text-muted"
                                                    >
                                                        <Edit className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (itemCount > 0) {
                                                                alert('Flyt eller slet varerne først');
                                                                return;
                                                            }
                                                            setCatDeleteConfirm(cat.id);
                                                            setCatDeleteInput('');
                                                        }}
                                                        disabled={itemCount > 0}
                                                        className={`p-2.5 rounded-xl border transition-all ${itemCount > 0 ? 'opacity-20 cursor-not-allowed' : 'border-border hover:border-error hover:text-error text-text-muted'}`}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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
                                <tr
                                    key={item.sku}
                                    onClick={() => onInspect?.(item)}
                                    className="group hover:bg-bg-tertiary/30 transition-colors cursor-pointer"
                                >
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
                                    <td className="px-8 py-4 text-right" onClick={(e) => e.stopPropagation()}>
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
                        <div
                            key={item.sku}
                            onClick={() => onInspect?.(item)}
                            className="bg-bg-primary/50 border border-border rounded-2xl p-3 flex gap-4 shadow-sm relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                        >
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

                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
