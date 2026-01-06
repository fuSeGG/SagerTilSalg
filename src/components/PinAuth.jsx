import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

const PinAuth = ({ onAuthSuccess, onCancel }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleNumber = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');

            if (newPin === '1234') { // Default PIN
                onAuthSuccess();
            } else if (newPin.length === 4) {
                setError('FORKERT ADGANGSKODE');
                setTimeout(() => {
                    setPin('');
                    setError('');
                }, 1000);
            }
        }
    };

    const handleClear = () => {
        setPin('');
        setError('');
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
        setError('');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
            <button
                onClick={onCancel}
                className="absolute top-8 right-8 p-3 text-slate-600 hover:text-white transition-colors group"
            >
                <X className="size-8 transition-transform group-hover:rotate-90" />
            </button>

            <div className="bg-slate-900 border-x-4 border-yellow-400 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative overflow-hidden">
                <div className="text-center mb-10">
                    <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-400/20 rotate-3">
                        <Lock className="text-black size-8" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">ADGANG <span className="text-yellow-400">KONTROL</span></h2>
                    <p className="text-slate-500 text-[10px] font-black mt-2 uppercase tracking-[0.3em]">Indtast 4-cifret kode</p>
                </div>

                <div className="flex justify-center gap-5 mb-10">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-5 h-5 rounded-md border-4 transition-all duration-300 ${pin.length > i
                                ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-xl shadow-yellow-400/40'
                                : 'border-slate-800 bg-black'
                                }`}
                        />
                    ))}
                </div>

                {error && (
                    <div className="absolute top-0 left-0 w-full h-full bg-red-600/90 flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <span className="text-white font-black text-xl italic uppercase tracking-widest">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((val) => (
                        <button
                            key={val}
                            onClick={() => {
                                if (val === 'C') handleClear();
                                else if (val === '←') handleBackspace();
                                else handleNumber(val.toString());
                            }}
                            className={`py-5 rounded-2xl text-2xl font-black transition-all active:scale-95 ${typeof val === 'number'
                                ? 'bg-slate-800 text-white hover:bg-slate-700 border-b-4 border-slate-950'
                                : 'bg-black text-slate-600 hover:text-white border-b-4 border-slate-800'
                                }`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PinAuth;
