import React, { useState } from 'react';
import { Plus, LayoutGrid, List, Download, ArrowLeft, Search, Trash2, Edit, ExternalLink } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

const AdminDashboard = ({ items, onAdd, onEdit, onDelete, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2">
                        <ArrowLeft className="size-4" />
                        <span>Tilbage til shoppen</span>
                    </button>
                    <h2 className="text-3xl font-bold text-white">Admin Overblik</h2>
                    <p className="text-slate-500">Administrer dit lager og tilføj nye sager.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => exportToCSV(items)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 hover:text-white rounded-2xl font-bold transition-all border border-slate-700"
                    >
                        <Download className="size-5" />
                        <span>Eksport CSV</span>
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <Plus className="size-5" />
                        <span>Tilføj Vare</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl text-center">
                    <div className="text-3xl font-bold text-white mb-1">{items.length}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Varer</div>
                </div>
                {['Værktøj', 'Møbler', 'Bildele', 'Maskiner'].map(cat => (
                    <div key={cat} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl text-center">
                        <div className="text-3xl font-bold text-white mb-1">{items.filter(i => i.category === cat).length}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cat}</div>
                    </div>
                ))}
            </div>

            {/* Inventory List */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden mb-20">
                <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-white font-bold text-lg">Lagerliste</h3>
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors size-4" />
                        <input
                            type="text"
                            placeholder="Søg i lager..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                                <th className="px-6 py-4">Vare</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Pris</th>
                                <th className="px-6 py-4">Antal</th>
                                <th className="px-6 py-4 text-right">Handlinger</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {filteredItems.map((item) => (
                                <tr key={item.sku} className="group hover:bg-slate-700/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/50 flex-shrink-0">
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-white font-bold truncate max-w-[200px]">{item.name}</div>
                                                <div className="text-slate-500 text-xs truncate max-w-[200px]">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-emerald-500 font-bold text-xs">{item.sku}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-bold text-sm">
                                        {item.price ? `${item.price},-` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {item.quantity || 1}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {deleteConfirm === item.sku ? (
                                                <>
                                                    <span className="text-slate-400 text-xs mr-2 font-bold uppercase tracking-wider animate-pulse">Sikker?</span>
                                                    <button
                                                        onClick={() => onDelete(item.sku)}
                                                        className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-all shadow-lg shadow-red-500/20"
                                                        title="Bekræft sletning"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                                        title="Fortryd"
                                                    >
                                                        <ArrowLeft className="size-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                                        title="Rediger"
                                                    >
                                                        <Edit className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(item.sku)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
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
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
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
