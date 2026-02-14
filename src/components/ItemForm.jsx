import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Save, ArrowLeft, RefreshCcw, AlertTriangle } from 'lucide-react';
import { processImage } from '../utils/imageProcessor';
import { supabase } from '../utils/supabaseClient';
import { CATEGORIES } from '../utils/constants';

const ItemForm = ({ initialData, onSave, onCancel, getNextSku }) => {
    const [formData, setFormData] = useState(initialData || {
        sku: 'Loading...',
        name: '',
        category: CATEGORIES[0].id,
        price: '',
        quantity: 1,
        description: '',
        image: null,
        available: true,
        dateAdded: new Date().toISOString()
    });

    React.useEffect(() => {
        if (!initialData && getNextSku) {
            getNextSku(CATEGORIES[0].id).then(sku => {
                setFormData(prev => ({ ...prev, sku }));
            });
        }
    }, [initialData, getNextSku]);
    const [preview, setPreview] = useState(initialData?.image || null);
    const [imageFile, setImageFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [imageWarning, setImageWarning] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const fileInputRef = useRef(null);
    const formTopRef = useRef(null);

    const categories = CATEGORIES.map(c => c.id);

    // Clear specific error when field changes
    const clearError = (field) => {
        setFormErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            clearError('image');

            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 10) {
                setImageWarning(`Advarsel: Billedet er meget stort (${fileSizeMB.toFixed(1)}MB). Dette kan fylde databasen hurtigt. Overvej at formindske det.`);
            } else {
                setImageWarning(null);
            }

            setIsProcessing(true);
            try {
                setImageFile(file);
                const compressed = await processImage(file);
                setPreview(compressed);
            } catch (err) {
                setFormErrors(prev => ({ ...prev, image: 'Kunne ikke behandle billedet. Prøv et andet format (JPG, PNG).' }));
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

    const validate = () => {
        const errors = {};
        if (!preview && !initialData?.image) {
            errors.image = 'Du skal uploade et billede af varen.';
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
            let imageUrl = formData.image;

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
                {/* Image Upload Area */}
                <div className="relative group">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`min-h-[200px] max-h-64 w-full rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative ${formErrors.image
                            ? 'border-error bg-error/5'
                            : preview
                                ? 'border-success/50 bg-bg-secondary shadow-xl'
                                : 'border-border bg-bg-tertiary/50 hover:border-text-muted'
                            }`}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                    <RefreshCcw className="text-text-primary size-8" />
                                    <span className="text-text-primary font-bold">Skift billede</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className={`p-4 rounded-2xl w-fit mx-auto mb-4 ${formErrors.image ? 'bg-error/10' : 'bg-bg-tertiary'}`}>
                                    <Camera className={`size-8 ${formErrors.image ? 'text-error' : 'text-text-muted'}`} />
                                </div>
                                {isProcessing ? (
                                    <p className="text-success font-bold animate-pulse">Behandler billede...</p>
                                ) : (
                                    <>
                                        <h3 className={`font-bold mb-2 ${formErrors.image ? 'text-error' : 'text-white'}`}>
                                            {formErrors.image ? 'Billede mangler!' : 'Tag eller vælg billede'}
                                        </h3>
                                        <p className="text-text-muted text-sm">Klik her for at åbne kamera eller galleri</p>
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
                    <FieldError field="image" />
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
                                        getNextSku(newCat).then(sku => {
                                            setFormData(prev => ({ ...prev, sku }));
                                        });
                                    }
                                }}
                                className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary font-bold focus:ring-2 focus:ring-accent focus:outline-none appearance-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
