import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const ContactButton = ({
    type = 'tel',
    label = 'Ring for info',
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
        primary: "bg-accent text-accent-contrast border-accent-hover hover:bg-accent-hover rounded-2xl shadow-xl border-b-4",
        secondary: "bg-bg-tertiary text-text-primary border-bg-primary hover:bg-bg-secondary rounded-2xl shadow-lg border-b-4",
        header: "hidden md:flex bg-accent text-accent-contrast px-6 py-2.5 rounded-xl border-accent-hover shadow-lg text-xs leading-none border-b-4",
        ghost: "text-accent hover:text-accent-hover transition-colors text-xs border-none bg-transparent tabular-nums",
        mobile: "bg-accent text-accent-contrast p-5 rounded-full shadow-2xl border-accent-hover fixed bottom-24 right-6 z-40 md:hidden border-b-4",
        sidebar: "bg-accent hover:bg-accent-hover text-accent-contrast font-black py-3 rounded-xl shadow-lg shadow-accent/10 uppercase tracking-wide text-xs"
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
