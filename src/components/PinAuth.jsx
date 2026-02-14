import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

const LOCKOUT_SCHEDULE = {
    3: 5 * 60 * 1000,        // 5 minutes
    4: 30 * 60 * 1000,       // 30 minutes
    5: 2 * 60 * 60 * 1000,   // 2 hours
    6: 12 * 60 * 60 * 1000   // 12 hours
};

const PinAuth = ({ onAuthSuccess, onCancel }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(() => {
        return parseInt(localStorage.getItem('admin_failed_attempts') || '0');
    });
    const [lockoutUntil, setLockoutUntil] = useState(() => {
        return parseInt(localStorage.getItem('admin_lockout_until') || '0');
    });
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Update current time every second for the countdown
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Persist attempts/lockout
    React.useEffect(() => {
        localStorage.setItem('admin_failed_attempts', failedAttempts.toString());
        localStorage.setItem('admin_lockout_until', lockoutUntil.toString());
    }, [failedAttempts, lockoutUntil]);

    const isLockedOut = currentTime < lockoutUntil;
    const remainingTime = Math.max(0, lockoutUntil - currentTime);

    const formatTime = (ms) => {
        const totalSecs = Math.ceil(ms / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        if (hours > 0) return `${hours}t ${mins}m`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    };

    const handleNumber = async (num) => {
        if (isLockedOut) return;

        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');

            if (newPin.length === 4) {
                try {
                    const response = await fetch('/verify-pin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pin: newPin })
                    });

                    if (response.ok) {
                        setFailedAttempts(0);
                        setLockoutUntil(0);
                        onAuthSuccess(newPin);
                    } else {
                        const newAttempts = failedAttempts + 1;
                        setFailedAttempts(newAttempts);

                        // Check if we should trigger lockout
                        if (newAttempts >= 3) {
                            const delay = LOCKOUT_SCHEDULE[newAttempts] || LOCKOUT_SCHEDULE[6];
                            setLockoutUntil(Date.now() + delay);
                            setError('FOR MANGE FORSØG');
                        } else {
                            setError('FORKERT ADGANGSKODE');
                        }

                        setTimeout(() => {
                            setPin('');
                            setError('');
                        }, 1000);
                    }
                } catch (e) {
                    console.error('Auth error:', e);
                    setError('FEJL I FORBINDELSE');
                    setTimeout(() => {
                        setPin('');
                        setError('');
                    }, 1000);
                }
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
        <div className="fixed inset-0 z-[200] bg-bg-primary flex items-center justify-center p-4">
            <button
                onClick={onCancel}
                className="absolute top-8 right-8 p-3 text-text-muted hover:text-text-primary transition-colors group"
            >
                <X className="size-8 transition-transform group-hover:rotate-90" />
            </button>

            <div className="bg-bg-secondary border-x-4 border-accent p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative overflow-hidden">
                <div className="text-center mb-10">
                    <div className="bg-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20 rotate-3">
                        <Lock className="text-accent-contrast size-8" />
                    </div>
                    <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter italic">ADGANG <span className="text-accent">KONTROL</span></h2>
                    <p className="text-text-muted text-xs font-black mt-2 uppercase tracking-[0.3em]">Indtast 4-cifret kode</p>
                </div>

                <div className="flex justify-center gap-5 mb-10">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-5 h-5 rounded-md border-4 transition-all duration-300 ${pin.length > i
                                ? 'bg-accent border-accent-hover scale-125 shadow-xl shadow-accent/40'
                                : 'border-border bg-bg-primary'
                                }`}
                        />
                    ))}
                </div>

                {error && (
                    <div className="absolute top-0 left-0 w-full h-full bg-error/90 flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <span className="text-white font-black text-xl italic uppercase tracking-widest">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((val) => (
                        <button
                            key={val}
                            disabled={isLockedOut}
                            onClick={() => {
                                if (val === 'C') handleClear();
                                else if (val === '←') handleBackspace();
                                else handleNumber(val.toString());
                            }}
                            className={`py-5 rounded-2xl text-2xl font-black transition-all active:scale-95 ${isLockedOut ? 'opacity-20 grayscale cursor-not-allowed' : ''} ${typeof val === 'number'
                                ? 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary border-b-4 border-bg-primary'
                                : 'bg-bg-primary text-text-muted hover:text-text-primary border-b-4 border-border'
                                }`}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                {isLockedOut && (
                    <div className="absolute inset-0 bg-bg-secondary/95 backdrop-blur flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 rounded-[2.5rem]">
                        <div className="bg-error/10 p-4 rounded-full mb-4">
                            <Lock className="text-error size-12" />
                        </div>
                        <h3 className="text-text-primary font-black text-xl italic uppercase tracking-tighter mb-2">FOR MANGE FORSØG</h3>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Systemet er låst midlertidigt for at beskytte Peters lager.<br />
                            <span className="text-accent text-lg mt-4 block">Prøv igen om {formatTime(remainingTime)}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinAuth;
