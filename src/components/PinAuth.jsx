import React, { useState } from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';

const PinAuth = ({ onAuthSuccess, onCancel }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');

            if (newPin === '1234') { // Using default PIN for now
                onAuthSuccess();
            } else if (newPin.length === 4) {
                setError('Forkert PIN. Prøv igen.');
                setTimeout(() => setPin(''), 1000);
            }
        }
    };

    const handleClear = () => {
        setPin('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <button onClick={onCancel} className="p-3 text-slate-500 hover:text-white transition-colors bg-slate-900 rounded-full border border-slate-800">
                    <X className="size-6" />
                </button>
            </div>

            <div className="w-full max-w-sm text-center">
                <div className="bg-emerald-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                    <Lock className="text-emerald-500 size-10" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Admin Log ind</h2>
                <p className="text-slate-500 mb-12">Indtast din 4-cifrede PIN-kode for at få adgang.</p>

                <div className="flex justify-center gap-4 mb-12">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i
                                    ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-lg shadow-emerald-500/50'
                                    : 'border-slate-700 bg-transparent'
                                }`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-400 font-bold mb-8 animate-bounce">{error}</p>
                )}

                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num.toString())}
                            className="h-20 bg-slate-900 border border-slate-800/50 rounded-2xl text-2xl font-bold text-white hover:bg-slate-800 active:bg-emerald-500 active:border-emerald-500 transition-all active:scale-90"
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={handleClear} className="h-20 bg-slate-900 border border-slate-800/50 rounded-2xl text-slate-500 font-bold hover:text-white transition-colors">
                        C
                    </button>
                    <button
                        onClick={() => handleNumberClick('0')}
                        className="h-20 bg-slate-900 border border-slate-800/50 rounded-2xl text-2xl font-bold text-white hover:bg-slate-800 active:bg-emerald-500 active:border-emerald-500 transition-all active:scale-90"
                    >
                        0
                    </button>
                    <div className="h-20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinAuth;
