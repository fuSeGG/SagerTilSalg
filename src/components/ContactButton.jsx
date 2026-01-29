import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const ContactButton = ({
    type = 'tel',
    label = 'Ring for bestilling',
    itemInfo = '',
    className = '',
    variant = 'primary'
}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const phoneNumber = "+45 40 78 14 88";
    const cleanNumber = phoneNumber.replace(/\s/g, '');

    const isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleClick = (e) => {
        if (!isRevealed) {
            setIsRevealed(true);
            if (isPC) {
                e.preventDefault();
            }
        } else if (isPC) {
            e.preventDefault();
        }
    };

    const href = type === 'tel'
        ? `tel:${cleanNumber}`
        : `sms:${cleanNumber}${itemInfo ? `?body=${encodeURIComponent(`Hej Peter, jeg er interesseret i ${itemInfo}`)}` : ''}`;

    const Icon = type === 'tel' ? Phone : MessageSquare;

    const baseStyles = "flex items-center justify-center gap-3 transition-all font-black uppercase tracking-tighter active:scale-95";

    const variants = {
        primary: "bg-yellow-400 text-black border-yellow-600 hover:bg-yellow-500 rounded-2xl shadow-xl border-b-4",
        secondary: "bg-slate-800 text-white border-slate-950 hover:bg-slate-700 rounded-2xl shadow-lg border-b-4",
        header: "hidden md:flex bg-yellow-400 text-black px-6 py-2.5 rounded-xl border-yellow-600 shadow-lg text-xs leading-none border-b-4",
        ghost: "text-yellow-400 hover:text-yellow-300 transition-colors text-xs border-none bg-transparent tabular-nums",
        mobile: "bg-yellow-400 text-black p-5 rounded-full shadow-2xl border-yellow-600 fixed bottom-24 right-6 z-40 md:hidden border-b-4",
        sidebar: "bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 rounded-xl shadow-lg shadow-yellow-400/10 uppercase tracking-wide text-xs"
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <Icon className={variant === 'mobile' ? 'size-8' : 'size-5'} />
            {variant !== 'mobile' && (
                <span>{isRevealed ? phoneNumber : label}</span>
            )}
        </a>
    );
};

export default ContactButton;
