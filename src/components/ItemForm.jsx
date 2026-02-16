import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Save, ArrowLeft, RefreshCcw, AlertTriangle } from 'lucide-react';
import { processImage } from '../utils/imageProcessor';
import { supabase } from '../utils/supabaseClient';
import { CATEGORIES } from '../utils/constants';

const ItemForm = ({ initialData, onSave, onCancel, getNextSku, categories }) => {
    const [formData, setFormData] = useState(initialData || {
        sku: 'Loading...',
        name: '',
        category: (categories && categories.length > 0) ? categories[0].id : 'Værktøj',
        price: '',
        quantity: 1,
        description: '',
        images: [], // New array for multiple images
        available: true,
        dateAdded: new Date().toISOString()
    });

    // Backward compatibility: If initialData has 'image' but not 'images', wrap it
    useEffect(() => {
        if (initialData && initialData.image && (!initialData.images || initialData.images.length === 0)) {
            setFormData(prev => ({ ...prev, images: [initialData.image] }));
        }
    }, [initialData]);

    React.useEffect(() => {
        if (!initialData && getNextSku && categories && categories.length > 0) {
            getNextSku(categories[0].id, categories).then(sku => {
                setFormData(prev => ({ ...prev, sku }));
            });
        }
    }, [initialData, getNextSku, categories]);
    // State for image handling
    // previews: Array of objects { url: string, isLocal: boolean, blob?: Blob }
    const [previews, setPreviews] = useState([]);

    // Initialize previews from formData
    useEffect(() => {
        if (formData.images && formData.images.length > 0) {
            // Only initialize if we haven't already (to avoid overwriting local previews on re-renders)
            setPreviews(prev => {
                if (prev.length === 0) {
                    return formData.images.map(url => ({ url, isLocal: false }));
                }
                return prev;
            });
        }
    }, []); // Run once on mount (or when initialData loads)

    // Sync external changes if needed (e.g. from initialData update)
    useEffect(() => {
        if (initialData?.images) {
            setPreviews(initialData.images.map(url => ({ url, isLocal: false })));
        } else if (initialData?.image) {
            setPreviews([{ url: initialData.image, isLocal: false }]);
        }
    }, [initialData]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [imageWarning, setImageWarning] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const fileInputRef = useRef(null);
    const formTopRef = useRef(null);

    // Use dynamic categories if provided, otherwise fallback is handled by App.jsx passing them
    const activeCategories = (categories && categories.length > 0) ? categories : CATEGORIES;
    const categoryIds = activeCategories.map(c => c.id);

    // Clear specific error when field changes
    const clearError = (field) => {
        setFormErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            clearError('images');
            setIsProcessing(true);
            setImageWarning(null);

            try {
                const newPreviews = [];

                // Process in parallel
                await Promise.all(files.map(async (file) => {
                    // Size check warning (only first big one)
                    const fileSizeMB = file.size / (1024 * 1024);
                    if (fileSizeMB > 10) {
                        setImageWarning(prev => prev || `Advarsel: Et billede er meget stort (${fileSizeMB.toFixed(1)}MB).`);
                    }

                    const compressedBlob = await processImage(file);
                    const previewUrl = URL.createObjectURL(compressedBlob);

                    newPreviews.push({
                        url: previewUrl,
                        isLocal: true,
                        blob: compressedBlob
                    });
                }));

                setPreviews(prev => [...prev, ...newPreviews]);

            } catch (err) {
                console.error('Image processing error:', err);
                setFormErrors(prev => ({ ...prev, images: 'Kunne ikke behandle et eller flere billeder.' }));
            } finally {
                setIsProcessing(false);
                // Reset input so same files can be selected again if needed
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (indexToRemove) => {
        setPreviews(prev => {
            const newPreviews = prev.filter((_, idx) => idx !== indexToRemove);
            // If we removed a local preview, revoke its URL to free memory
            const removed = prev[indexToRemove];
            if (removed.isLocal) URL.revokeObjectURL(removed.url);
            return newPreviews;
        });
    };

    const uploadImage = async (blob, sku) => {
        // We now always upload as webp
        const fileName = `${sku}-${Math.random()}.webp`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('inventory')
            .upload(filePath, blob, {
                contentType: 'image/webp'
            });

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('inventory')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const validate = () => {
        const errors = {};
        if (previews.length === 0) {
            errors.images = 'Du skal uploade mindst ét billede af varen.';
        }
        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Varen skal have et navn.';
        }
        if (!formData.price && formData.price !== 0) {
            errors.price = 'Angiv en pris for varen.';
        }
        if (!formData.description || formData.description.trim() === '') {
            errors.description = 'Tilføj en beskrivelse af varen.';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        setIsProcessing(true);
        try {
            const finalImageUrls = [];

            for (const item of previews) {
                if (item.isLocal && item.blob) {
                    // Upload new image
                    const url = await uploadImage(item.blob, formData.sku);
                    finalImageUrls.push(url);
                } else {
                    // Keep existing URL
                    finalImageUrls.push(item.url);
                }
            }

            await onSave({
                ...formData,
                images: finalImageUrls,
                image: finalImageUrls[0], // Backward compatibility
                price: Number(formData.price),
                quantity: formData.quantity ? Number(formData.quantity) : 1
            });
        } catch (err) {
            console.error('Upload error:', err);
            setSubmitError('Der opstod en fejl. Tjek din internetforbindelse og prøv igen.');
        } finally {
            setIsProcessing(false);
        }
    };

    const FieldError = ({ field }) => {
        if (!formErrors[field]) return null;
        return (
            <p className="mt-1.5 text-error text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle className="size-3 flex-shrink-0" />
                {formErrors[field]}
            </p>
        );
    };

    return (
        <div className="max-w-2xl mx-auto" ref={formTopRef}>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onCancel} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                    <ArrowLeft className="size-5" />
                    <span>Annuller</span>
                </button>
                <h2 className="text-2xl font-bold text-text-primary">{initialData ? 'Rediger Vare' : 'Tilføj Ny Vare'}</h2>
                <div className="w-10" />
            </div>

            {/* Summary error banner */}
            {(Object.keys(formErrors).length > 0 || submitError) && (
                <div className="mb-6 bg-error/10 border border-error/40 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="size-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-error font-bold text-sm">
                            {submitError || `Udfyld venligst ${Object.keys(formErrors).length === 1 ? 'det markerede felt' : `de ${Object.keys(formErrors).length} markerede felter`} for at fortsætte.`}
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 pb-10">
                {/* Image Upload Area (Grid) */}
                <div className="space-y-3">
                    <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider">Billeder ({previews.length})</label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {/* Existing/New Previews */}
                        {previews.map((item, idx) => (
                            <div key={idx} className="aspect-square relative group rounded-2xl overflow-hidden border border-border bg-bg-secondary shadow-sm">
                                <img src={item.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="p-2 bg-error text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                        title="Fjern billede"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>
                                {/* Main image badge */}
                                {idx === 0 && (
                                    <div className="absolute top-2 left-2 bg-accent text-accent-contrast text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-lg">
                                        Primær
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Button */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer hover:bg-bg-tertiary/50 group ${formErrors.images ? 'border-error bg-error/5' : 'border-border'
                                }`}
                        >
                            <div className="p-3 bg-bg-tertiary rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <Camera className={`size-6 ${formErrors.images ? 'text-error' : 'text-text-muted'}`} />
                            </div>
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wide group-hover:text-text-primary">Tilføj foto</span>
                        </div>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple // Allow multiple files
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <FieldError field="images" />
                </div>

                {imageWarning && (
                    <div className="bg-error/10 border border-error/50 p-4 rounded-2xl flex items-center gap-3 text-error animate-pulse">
                        <X className="size-5 flex-shrink-0" />
                        <p className="text-xs font-bold uppercase tracking-tight">{imageWarning}</p>
                    </div>
                )}

                {/* Form Fields */}
                <div className="bg-bg-tertiary/40 border border-border/50 rounded-3xl p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">SKU (Auto)</label>
                            <input
                                type="text"
                                value={formData.sku}
                                readOnly
                                className="w-full bg-bg-secondary/50 border border-border rounded-xl px-4 py-3 text-text-muted cursor-not-allowed font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) => {
                                    const newCat = e.target.value;
                                    setFormData(prev => ({ ...prev, category: newCat, sku: 'Loading...' }));
                                    if (!initialData && getNextSku) {
                                        getNextSku(newCat, categories).then(sku => {
                                            setFormData(prev => ({ ...prev, sku }));
                                        });
                                    }
                                }}
                                className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary font-bold focus:ring-2 focus:ring-accent focus:outline-none appearance-none"
                            >
                                {categoryIds.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Pris (DKK)</label>
                            <input
                                type="number"
                                placeholder="F.eks. 500"
                                value={formData.price}
                                onChange={(e) => { setFormData(prev => ({ ...prev, price: e.target.value })); clearError('price'); }}
                                className={`w-full bg-bg-tertiary border rounded-xl px-4 py-3 text-text-primary font-bold focus:ring-2 focus:ring-accent focus:outline-none placeholder:text-text-muted ${formErrors.price ? 'border-error' : 'border-border'}`}
                            />
                            <FieldError field="price" />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Antal (Valgfri)</label>
                            <input
                                type="number"
                                placeholder="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary font-bold focus:ring-2 focus:ring-accent focus:outline-none placeholder:text-text-muted"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Navn</label>
                        <input
                            type="text"
                            placeholder="F.eks. Bosch boremaskine"
                            value={formData.name}
                            onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value })); clearError('name'); }}
                            className={`w-full bg-bg-tertiary border rounded-xl px-4 py-3 text-text-primary font-bold focus:ring-2 focus:ring-accent focus:outline-none placeholder:text-text-muted ${formErrors.name ? 'border-error' : 'border-border'}`}
                        />
                        <FieldError field="name" />
                    </div>

                    <div>
                        <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Beskrivelse</label>
                        <textarea
                            placeholder="Skriv en detaljeret beskrivelse af varen..."
                            rows={6}
                            value={formData.description}
                            onChange={(e) => { setFormData(prev => ({ ...prev, description: e.target.value })); clearError('description'); }}
                            className={`w-full bg-bg-tertiary border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none placeholder:text-text-muted leading-relaxed ${formErrors.description ? 'border-error' : 'border-border'}`}
                        />
                        <FieldError field="description" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-accent hover:bg-accent-hover text-accent-contrast rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-accent/30 active:scale-95 disabled:opacity-50"
                >
                    <Save className="size-6" />
                    {initialData ? 'Gem ændringer' : 'Gem vare på lageret'}
                </button>
            </form>
        </div>
    );
};

export default ItemForm;
