import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Check } from 'lucide-react';

import { createPortal } from 'react-dom';

export default function ThemeSelector({ isOpen, onClose }) {
    const { themes, activeThemeId, setTheme } = useTheme();

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-bg-secondary border border-border w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-bg-secondary/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-2xl font-black text-text-primary italic tracking-tighter">
                            TEMA <span className="text-accent">VÆLGER</span>
                        </h2>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">
                            Vælg et visuelt udtryk til løsningen
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-bg-tertiary rounded-full transition-colors text-text-secondary hover:text-text-primary"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                {/* Categories */}
                <div className="p-6 space-y-8">
                    {['standard', 'contrast'].map((group) => (
                        <div key={group}>
                            <h3 className="text-text-muted text-xs font-black uppercase tracking-[0.2em] mb-4 pl-1">
                                {group === 'standard' ? 'Standard' : 'Høj Kontrast'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {themes.filter(t => t.type === group).map(theme => {
                                    const isActive = activeThemeId === theme.id;

                                    return (
                                        <div
                                            key={theme.id}
                                            onClick={() => setTheme(theme.id)}
                                            className={`
                                                group relative aspect-[4/3] rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                                                ${isActive ? 'border-accent ring-4 ring-accent/30 scale-[1.02]' : 'border-border hover:scale-[1.02] hover:border-text-muted'}
                                            `}
                                            style={{
                                                backgroundColor: theme.colors['--bg-primary']
                                            }}
                                        >
                                            {/* Theme Preview Content */}
                                            <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                                                <div className="flex gap-2">
                                                    <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: theme.colors['--accent'] }} />
                                                    <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: theme.colors['--bg-secondary'] }} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-2 w-16 rounded-full opacity-50" style={{ backgroundColor: theme.colors['--text-muted'] }} />
                                                    <div className="h-4 w-24 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors['--text-primary'] }} />
                                                </div>
                                            </div>

                                            {/* Meta Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${isActive ? 'text-accent' : 'text-text-secondary'}`}>
                                                            {theme.id.replace('-', ' ')}
                                                        </span>
                                                        <h4 className="text-white font-bold leading-none">{theme.name}</h4>
                                                    </div>
                                                    {isActive && (
                                                        <div className="bg-accent text-accent-contrast p-1 rounded-full">
                                                            <Check className="size-3.5 stroke-[4px]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}
