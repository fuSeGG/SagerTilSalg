import React, { useState } from 'react';
import { Plus, ArrowLeft, Search, Trash2, Edit, Package, BarChart3, X } from 'lucide-react';

const AdminDashboard = ({ items, onAdd, onEdit, onDelete, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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
                        className="flex items-center gap-3 w-fit px-5 py-2.5 bg-slate-800 border-2 border-slate-700 hover:border-yellow-400 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-black uppercase text-[11px] tracking-[0.2em] transition-all group shadow-lg"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                        <span>Tilbage til showroom</span>
                    </button>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">LAGER<span className="text-yellow-400">STYRING</span></h2>
                    </div>
                </div>
                <div>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-yellow-400/20 active:scale-95 border-b-4 border-yellow-600 w-full md:w-auto justify-center"
                    >
                        <Plus className="size-5" />
                        <span>Tilføj Vare</span>
                    </button>
                </div>
            </div>

            {/* Internal Stats Dashboard */}
            <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-6 mb-8 grid grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="flex flex-col border-l-2 border-yellow-400 pl-4">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Beholdning</span>
                    <span className="text-3xl font-black text-white tracking-tighter tabular-nums leading-none">{items.length}</span>
                </div>
                {['Værktøj', 'Møbler', 'Auto', 'Maskiner'].map(cat => (
                    <div key={cat} className="flex flex-col border-l-2 border-slate-800 pl-4 hover:border-slate-700 transition-colors">
                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">{cat}</span>
                        <span className="text-2xl font-black text-slate-300 tracking-tighter tabular-nums leading-none">
                            {items.filter(i => i.category === cat).length}
                        </span>
                    </div>
                ))}
            </div>

            {/* Inventory List Header */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-t-[2rem] md:rounded-t-[2.5rem] px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg">
                        <BarChart3 className="text-slate-400 size-5" />
                    </div>
                    <h3 className="text-white font-black text-xl uppercase italic tracking-tight">Vareoversigt</h3>
                </div>
                <div className="relative group w-full md:w-[400px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-slate-800 p-1.5 rounded-md">
                        <Search className="text-slate-400 size-3" />
                    </div>
                    <input
                        type="text"
                        placeholder="Søg i lager..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black border-2 border-slate-800 rounded-2xl py-3 pl-14 pr-4 text-sm font-black text-white focus:outline-none focus:border-slate-600 transition-all placeholder:text-slate-800 uppercase tracking-tighter"
                    />
                </div>
            </div>

            {/* Inventory Container - Responsive List View */}
            <div className="bg-slate-900/40 border-x-2 border-b-2 border-slate-800 rounded-b-[2rem] md:rounded-b-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950/50">
                            <tr className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em]">
                                <th className="px-4 md:px-8 py-4 border-b border-slate-800">Varer</th>
                                <th className="px-4 py-4 border-b border-slate-800 hidden sm:table-cell">Ref</th>
                                <th className="px-4 py-4 border-b border-slate-800 hidden lg:table-cell">Kategori</th>
                                <th className="px-4 py-4 border-b border-slate-800">Pris / Antal</th>
                                <th className="px-4 md:px-8 py-4 border-b border-slate-800 text-right">Valg</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredItems.map((item) => (
                                <tr key={item.sku} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 md:px-8 py-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl overflow-hidden bg-black border border-slate-800 flex-shrink-0">
                                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-white font-black text-sm md:text-lg truncate max-w-[100px] sm:max-w-[200px] md:max-w-[300px] uppercase tracking-tighter italic leading-none mb-1">{item.name}</div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                    <span className="sm:hidden text-[9px] font-black text-yellow-500/50 tracking-widest uppercase">{item.sku}</span>
                                                    <div className="text-slate-600 text-[10px] font-bold truncate max-w-[100px] md:max-w-[200px] uppercase tracking-widest opacity-60">{item.description}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-black text-slate-700 text-[10px] tracking-widest italic group-hover:text-yellow-500 transition-colors uppercase tabular-nums hidden sm:table-cell">
                                        {item.sku}
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        <span className="bg-slate-800/50 text-slate-400 text-[9px] font-black px-2.5 py-1 rounded-md border border-slate-800 uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-sm md:text-base tracking-tighter italic leading-none">{item.price ? `${item.price},-` : '-'}</span>
                                            <span className="text-slate-600 font-bold tabular-nums text-[9px] md:text-[10px] uppercase tracking-widest mt-1">{item.quantity || 1} stk</span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            {deleteConfirm === item.sku ? (
                                                <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
                                                    <button onClick={() => onDelete(item.sku)} className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all">Slet</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg border border-slate-700"><X className="size-3.5" /></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => onEdit(item)} className="p-2 md:p-2.5 bg-slate-950 text-slate-600 hover:text-yellow-400 border border-slate-800 rounded-lg transition-all" title="Rediger"><Edit className="size-4" /></button>
                                                    <button onClick={() => setDeleteConfirm(item.sku)} className="p-2 md:p-2.5 bg-slate-950 text-slate-600 hover:text-red-500 border border-slate-800 rounded-lg transition-all" title="Slet"><Trash2 className="size-4" /></button>
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
                    <div className="px-8 py-20 text-center text-slate-800 font-black uppercase tracking-[0.3em] italic opacity-30">
                        Ingen varer fundet
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
