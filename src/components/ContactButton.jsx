import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const ContactButton = ({
    type = 'tel',
    label = 'Ring Peter',
    itemInfo = '',
    className = '',
    variant = 'primary'
}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const phoneNumber = "+45 12 34 56 78";
    const cleanNumber = phoneNumber.replace(/\s/g, '');

    // Check if on PC
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

    const baseStyles = "flex items-center justify-center gap-2 transition-all font-bold active:scale-95";

    const variants = {
        primary: "bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20",
        secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl",
        header: "hidden md:flex bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 border border-emerald-400/20",
        ghost: "text-slate-400 hover:text-white transition-colors text-sm",
        mobile: "bg-emerald-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-slate-900"
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <Icon className={variant === 'mobile' ? 'size-6' : 'size-4'} />
            {variant !== 'mobile' && (
                <span>{isRevealed ? phoneNumber : label}</span>
            )}
        </a>
    );
};

export default ContactButton;
