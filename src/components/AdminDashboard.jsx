import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Search, Trash2, Edit, Package, BarChart3, X, HardDrive } from 'lucide-react';
import { getStorageUsage } from '../utils/storageUsage';

const AdminDashboard = ({ items, onAdd, onEdit, onDelete, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [storageInfo, setStorageInfo] = useState(null);

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
                        <h2 className="text-4xl md:text-5xl font-black text-text-primary uppercase italic tracking-tighter leading-none">LAGER<span className="text-accent">STYRING</span></h2>
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
                {['Værktøj', 'Møbler', 'Auto', 'Maskiner'].map(cat => (
                    <div key={cat} className="flex flex-col border-l-2 border-border pl-4 hover:border-text-muted transition-colors">
                        <span className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">{cat}</span>
                        <span className="text-2xl font-black text-text-secondary tracking-tighter tabular-nums leading-none">
                            {items.filter(i => i.category === cat).length}
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
                <div className="overflow-x-auto custom-scrollbar -mx-[2px]">
                    <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
                        <thead className="bg-bg-primary/50">
                            <tr className="text-text-muted text-xs uppercase font-black tracking-[0.3em]">
                                <th className="px-4 md:px-8 py-4 border-b border-border">Varer</th>
                                <th className="px-4 py-4 border-b border-border hidden sm:table-cell">Ref</th>
                                <th className="px-4 py-4 border-b border-border hidden lg:table-cell">Kategori</th>
                                <th className="px-4 py-4 border-b border-border">Pris / Antal</th>
                                <th className="px-4 md:px-8 py-4 border-b border-border text-right">Valg</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredItems.map((item) => (
                                <tr key={item.sku} className="group hover:bg-bg-tertiary/30 transition-colors">
                                    <td className="px-4 md:px-8 py-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl overflow-hidden bg-bg-primary border border-border flex-shrink-0">
                                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-text-primary font-black text-sm md:text-lg truncate max-w-[100px] sm:max-w-[200px] md:max-w-[300px] uppercase tracking-tighter italic leading-none mb-1">{item.name}</div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                    <span className="sm:hidden text-xs font-black text-accent/50 tracking-widest uppercase">{item.sku}</span>
                                                    <div className="text-text-muted text-xs font-bold truncate max-w-[100px] md:max-w-[200px] uppercase tracking-widest opacity-60">{item.description}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-black text-text-muted text-xs tracking-widest italic group-hover:text-accent transition-colors uppercase tabular-nums hidden sm:table-cell">
                                        {item.sku}
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        <span className="bg-bg-tertiary/50 text-text-secondary text-xs font-black px-2.5 py-1 rounded-md border border-border uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-text-primary font-black text-sm md:text-base tracking-tighter italic leading-none">{item.price ? `${item.price},-` : '-'}</span>
                                            <span className="text-text-muted font-bold tabular-nums text-xs md:text-xs uppercase tracking-widest mt-1">{item.quantity || 1} stk</span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            {deleteConfirm === item.sku ? (
                                                <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
                                                    <button onClick={() => onDelete(item.sku)} className="px-3 py-1.5 bg-error text-white hover:bg-error/80 rounded-lg font-black uppercase text-xs tracking-widest transition-all">Slet</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="p-1.5 bg-bg-tertiary text-text-muted rounded-lg border border-border"><X className="size-3.5" /></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => onEdit(item)} className="p-2 md:p-2.5 bg-bg-primary text-text-muted hover:text-accent border border-border rounded-lg transition-all" title="Rediger"><Edit className="size-4" /></button>
                                                    <button onClick={() => setDeleteConfirm(item.sku)} className="p-2 md:p-2.5 bg-bg-primary text-text-muted hover:text-error border border-border rounded-lg transition-all" title="Slet"><Trash2 className="size-4" /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
