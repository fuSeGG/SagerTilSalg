import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Save, ArrowLeft, RefreshCcw } from 'lucide-react';
import { processImage } from '../utils/imageProcessor';
import { supabase } from '../utils/supabaseClient';

const ItemForm = ({ initialData, onSave, onCancel, getNextSku }) => {
    const [formData, setFormData] = useState(initialData || {
        sku: 'Loading...',
        name: '',
        category: 'Værktøj',
        price: '',
        quantity: 1,
        description: '',
        image: null,
        available: true,
        dateAdded: new Date().toISOString()
    });

    React.useEffect(() => {
        if (!initialData && getNextSku) {
            getNextSku('Værktøj').then(sku => {
                setFormData(prev => ({ ...prev, sku }));
            });
        }
    }, [initialData, getNextSku]);
    const [preview, setPreview] = useState(initialData?.image || null);
    const [imageFile, setImageFile] = useState(null); // Actual File object to upload
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const categories = ['Værktøj', 'Møbler', 'Bildele', 'Maskiner'];

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsProcessing(true);
            try {
                // Keep the original File for Supabase Upload
                setImageFile(file);

                // Still create a small preview for the UI
                const compressed = await processImage(file);
                setPreview(compressed);
            } catch (err) {
                alert('Kunne ikke behandle billedet. Prøv et andet.');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const uploadImage = async (file, sku) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${sku}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('inventory')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('inventory')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!preview && !initialData?.image) return alert('Tilføj venligst et billede.');
        if (!formData.name) return alert('Indtast venligst et navn.');
        if (!formData.price) return alert('Indtast venligst en pris.');

        setIsProcessing(true);
        try {
            let imageUrl = formData.image;

            // If a new file was selected, upload it
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, formData.sku);
            }

            await onSave({
                ...formData,
                image: imageUrl,
                price: Number(formData.price),
                quantity: formData.quantity ? Number(formData.quantity) : 1
            });
        } catch (err) {
            console.error('Upload error:', err);
            alert('Der opstod en fejl ved gemning af billedet.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="size-5" />
                    <span>Annuller</span>
                </button>
                <h2 className="text-2xl font-bold text-white">{initialData ? 'Rediger Vare' : 'Tilføj Ny Vare'}</h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Image Upload Area */}
                <div className="relative group">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${preview ? 'border-emerald-500/50 bg-slate-900' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                            }`}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                    <RefreshCcw className="text-white size-8" />
                                    <span className="text-white font-bold">Skift billede</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className="bg-slate-700 p-4 rounded-2xl w-fit mx-auto mb-4">
                                    <Camera className="text-slate-400 size-8" />
                                </div>
                                {isProcessing ? (
                                    <p className="text-emerald-400 font-bold animate-pulse">Behandler billede...</p>
                                ) : (
                                    <>
                                        <h3 className="text-white font-bold mb-2">Tag eller vælg billede</h3>
                                        <p className="text-slate-500 text-sm">Klik her for at åbne kamera eller galleri</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        capture="environment"
                    />
                </div>

                {/* Form Fields */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">SKU (Auto)</label>
                            <input
                                type="text"
                                value={formData.sku}
                                readOnly
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) => {
                                    const newCat = e.target.value;
                                    setFormData(prev => ({ ...prev, category: newCat, sku: 'Loading...' }));
                                    if (!initialData && getNextSku) {
                                        getNextSku(newCat).then(sku => {
                                            setFormData(prev => ({ ...prev, sku }));
                                        });
                                    }
                                }}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pris (DKK)</label>
                            <input
                                type="number"
                                placeholder="F.eks. 500"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Antal (Valgfri)</label>
                            <input
                                type="number"
                                placeholder="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Navn</label>
                        <input
                            type="text"
                            placeholder="F.eks. Bosch boremaskine"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Beskrivelse</label>
                        <textarea
                            placeholder="Skriv en detaljeret beskrivelse af varen..."
                            rows={6}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500 leading-relaxed"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
                >
                    <Save className="size-6" />
                    {initialData ? 'Gem ændringer' : 'Gem vare på lageret'}
                </button>
            </form>
        </div>
    );
};

export default ItemForm;
