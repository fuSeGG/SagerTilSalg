import React, { useState } from 'react';
import { Plus, LayoutGrid, List, Download, ArrowLeft, Search, Trash2, Edit, ExternalLink, Package } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

const AdminDashboard = ({ items, onAdd, onEdit, onDelete, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-4 border-slate-900 pb-10">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-yellow-400 font-black uppercase text-[10px] tracking-[0.2em] transition-colors mb-4 group">
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        <span>Retur til shoppen</span>
                    </button>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">LAGER<span className="text-yellow-400">STYRING</span></h2>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Peter Behrend • Industriel Lagerkontrol</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => exportToCSV(items)}
                        className="flex items-center gap-3 px-8 py-4 bg-black text-slate-500 hover:text-white rounded-[1.25rem] font-black uppercase text-xs tracking-widest transition-all border-2 border-slate-800"
                    >
                        <Download className="size-5" />
                        <span>Eksport CSV</span>
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-[1.25rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-yellow-400/20 active:scale-95 border-b-4 border-yellow-600"
                    >
                        <Plus className="size-5" />
                        <span>Tilføj Vare</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-900 border-b-4 border-slate-800 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="text-4xl font-black text-white mb-2 tracking-tighter tabular-nums italic">{items.length}</div>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">TOTAL BEHOLDNING</div>
                </div>
                {['Værktøj', 'Møbler', 'Auto', 'Maskiner'].map(cat => (
                    <div key={cat} className="bg-slate-900 border-b-4 border-slate-800 p-8 rounded-3xl text-center shadow-2xl group hover:border-yellow-400/50 transition-colors">
                        <div className="text-4xl font-black text-yellow-500 mb-2 tracking-tighter tabular-nums italic">{items.filter(i => i.category === cat).length}</div>
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{cat}</div>
                    </div>
                ))}
            </div>

            {/* Inventory List */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b-2 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-400/10 p-2 rounded-lg">
                            <Package className="text-yellow-400 size-5" />
                        </div>
                        <h3 className="text-white font-black text-xl uppercase italic tracking-tight">Inventar Liste</h3>
                    </div>
                    <div className="relative group min-w-full md:min-w-[400px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 p-1 rounded-md">
                            <Search className="text-black size-3" />
                        </div>
                        <input
                            type="text"
                            placeholder="Søg i lager..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black border-2 border-slate-800 rounded-2xl py-3.5 pl-14 pr-4 text-sm font-black text-white focus:outline-none focus:border-yellow-400 transition-all placeholder:text-slate-700 uppercase tracking-tighter"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 text-slate-600 text-[10px] uppercase font-black tracking-[0.3em]">
                                <th className="px-8 py-6">Varespecifikation</th>
                                <th className="px-8 py-6">Ref. nr</th>
                                <th className="px-8 py-6">Kategori</th>
                                <th className="px-8 py-6">Pris (DKK)</th>
                                <th className="px-8 py-6">Antal</th>
                                <th className="px-8 py-6 text-right">Handlinger</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-800/10">
                            {filteredItems.map((item) => (
                                <tr key={item.sku} className="group hover:bg-yellow-400/[0.02] transition-colors border-b border-slate-800/50">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-black border-2 border-slate-800 flex-shrink-0 group-hover:border-yellow-400/30 transition-colors">
                                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-white font-black text-lg truncate max-w-[250px] uppercase tracking-tighter italic leading-none mb-1 group-hover:text-yellow-400 transition-colors">{item.name}</div>
                                                <div className="text-slate-600 text-[11px] font-bold truncate max-w-[250px] uppercase tracking-widest opacity-60">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-700 text-xs tracking-widest italic group-hover:text-yellow-500 transition-colors uppercase tabular-nums">{item.sku}</td>
                                    <td className="px-8 py-6">
                                        <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-3 py-1.5 rounded-lg border border-slate-700 uppercase tracking-[0.2em]">{item.category}</span>
                                    </td>
                                    <td className="px-8 py-6 text-white font-black text-lg tracking-tighter italic">
                                        {item.price ? `${item.price},-` : '-'}
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 font-bold tabular-nums">
                                        {item.quantity || 1}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {deleteConfirm === item.sku ? (
                                                <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                                                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">Bekræft Slet?</span>
                                                    <button
                                                        onClick={() => onDelete(item.sku)}
                                                        className="p-3 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all shadow-xl shadow-red-600/20"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700"
                                                    >
                                                        <ArrowLeft className="size-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-3 bg-slate-950 text-slate-600 hover:text-yellow-400 border-2 border-slate-800 hover:border-yellow-400/50 rounded-xl transition-all flex items-center justify-center"
                                                        title="Rediger"
                                                    >
                                                        <Edit className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(item.sku)}
                                                        className="p-3 bg-slate-950 text-slate-600 hover:text-red-500 border-2 border-slate-800 hover:border-red-500/50 rounded-xl transition-all flex items-center justify-center"
                                                        title="Slet"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-700 font-black uppercase tracking-widest italic opacity-50">
                                        Ingen varer fundet i lageret.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
