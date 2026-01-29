import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Check, Lock, Unlock } from 'lucide-react';

export default function ThemeSelector({ isOpen, onClose }) {
    const { themes, activeThemeId, setTheme, lockedThemes, toggleLock } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter">
                            THEME <span className="text-yellow-400">AUDITION</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                            Select a visual identity for the prototype
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                {/* Categories */}
                <div className="p-6 space-y-8">
                    {['conservative', 'radical'].map((group) => (
                        <div key={group}>
                            <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4 pl-1">
                                {group === 'conservative' ? 'Group A: Refinements' : 'Group B: Creative Explorations'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {themes.filter(t => t.type === group).map(theme => {
                                    const isActive = activeThemeId === theme.id;
                                    const isLocked = lockedThemes.has(theme.id);

                                    return (
                                        <div
                                            key={theme.id}
                                            onClick={() => setTheme(theme.id)}
                                            className={`
                                        group relative aspect-[4/3] rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                                        ${isActive ? 'ring-4 ring-yellow-400/30 scale-[1.02]' : 'hover:scale-[1.02] hover:border-slate-500'}
                                        ${isLocked ? 'border-yellow-500 shadow-xl shadow-yellow-900/10' : isActive ? 'border-yellow-400' : 'border-slate-800'}
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

                                            {/* Meta/Controls Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity p-4 flex flex-col justify-between">
                                                <div className="flex justify-end">
                                                    {/* Lock Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleLock(theme.id);
                                                        }}
                                                        className={`p-2 rounded-full backdrop-blur-md border transition-all ${isLocked ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-black/30 text-slate-400 border-white/10 hover:bg-black/50 hover:text-white'}`}
                                                    >
                                                        {isLocked ? <Lock className="size-3.5 fill-current" /> : <Unlock className="size-3.5" />}
                                                    </button>
                                                </div>

                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${isActive ? 'text-yellow-400' : 'text-slate-400'}`}>
                                                            {theme.id.replace('-', ' ')}
                                                        </span>
                                                        <h4 className="text-white font-bold leading-none">{theme.name}</h4>
                                                    </div>
                                                    {isActive && (
                                                        <div className="bg-yellow-400 text-black p-1 rounded-full">
                                                            <Check className="size-3.5 stroke-[4px]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Active border glow */}
                                            {isActive && <div className="absolute inset-0 border-2 border-yellow-400 rounded-2xl pointer-events-none" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
