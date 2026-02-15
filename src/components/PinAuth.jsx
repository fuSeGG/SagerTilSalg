import React, { useState } from 'react';
import { Lock, X, ShieldAlert } from 'lucide-react';

const PinAuth = ({ onAuthSuccess, onCancel }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attemptsRemaining, setAttemptsRemaining] = useState(null);

    // Server-enforced lockout (primary protection)
    const [serverLockoutUntil, setServerLockoutUntil] = useState(() => {
        const saved = localStorage.getItem('admin_lockout_until');
        return saved ? parseInt(saved) : 0;
    });
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Tick every second for countdown
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Persist lockout to localStorage (UX convenience, not security)
    React.useEffect(() => {
        localStorage.setItem('admin_lockout_until', serverLockoutUntil.toString());
    }, [serverLockoutUntil]);

    const isLockedOut = currentTime < serverLockoutUntil;
    const remainingTime = Math.max(0, serverLockoutUntil - currentTime);

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
        if (isLockedOut || isSubmitting) return;

        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');
            setAttemptsRemaining(null);

            if (newPin.length === 4) {
                setIsSubmitting(true);
                try {
                    const response = await fetch('/verify-pin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pin: newPin })
                    });

                    if (response.ok) {
                        // Success — clear lockout and enter admin
                        setServerLockoutUntil(0);
                        localStorage.removeItem('admin_lockout_until');
                        onAuthSuccess(newPin);
                        return;
                    }

                    const data = await response.json();

                    if (response.status === 429) {
                        // Server-enforced lockout
                        const lockUntil = data.lockedUntil
                            ? new Date(data.lockedUntil).getTime()
                            : Date.now() + (data.retryAfter || 300) * 1000;
                        setServerLockoutUntil(lockUntil);
                        setError('FOR MANGE FORSØG');
                    } else {
                        // Wrong PIN, not yet locked
                        setError('FORKERT ADGANGSKODE');
                        if (data.attemptsRemaining !== undefined) {
                            setAttemptsRemaining(data.attemptsRemaining);
                        }
                    }

                    setTimeout(() => {
                        setPin('');
                        setError('');
                    }, 1200);

                } catch (e) {
                    console.error('Auth error:', e);
                    setError('FEJL I FORBINDELSE');
                    setTimeout(() => {
                        setPin('');
                        setError('');
                    }, 1200);
                } finally {
                    setIsSubmitting(false);
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

                {/* Attempts remaining warning */}
                {attemptsRemaining !== null && attemptsRemaining <= 2 && attemptsRemaining > 0 && !error && (
                    <div className="text-center mb-4 animate-in fade-in duration-300">
                        <p className="text-orange-400 text-xs font-black uppercase tracking-widest">
                            {attemptsRemaining} forsøg tilbage
                        </p>
                    </div>
                )}

                {/* Submitting indicator */}
                {isSubmitting && (
                    <div className="absolute top-0 left-0 w-full h-full bg-bg-secondary/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                    </div>
                )}

                {error && !isSubmitting && (
                    <div className="absolute top-0 left-0 w-full h-full bg-error/90 flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <span className="text-white font-black text-xl italic uppercase tracking-widest">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((val) => (
                        <button
                            key={val}
                            disabled={isLockedOut || isSubmitting}
                            onClick={() => {
                                if (val === 'C') handleClear();
                                else if (val === '←') handleBackspace();
                                else handleNumber(val.toString());
                            }}
                            className={`py-5 rounded-2xl text-2xl font-black transition-all active:scale-95 ${(isLockedOut || isSubmitting) ? 'opacity-20 grayscale cursor-not-allowed' : ''} ${typeof val === 'number'
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
                            <ShieldAlert className="text-error size-12" />
                        </div>
                        <h3 className="text-text-primary font-black text-xl italic uppercase tracking-tighter mb-2">ADGANG BLOKERET</h3>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-widest leading-relaxed">
                            IP-adresse midlertidigt blokeret.<br />
                            <span className="text-accent text-lg mt-4 block">Prøv igen om {formatTime(remainingTime)}</span>
                        </p>
                        <p className="text-text-muted/50 text-[10px] font-bold uppercase tracking-widest mt-6">
                            Server-beskyttet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinAuth;
