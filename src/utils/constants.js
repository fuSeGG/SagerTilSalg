import { Wrench, Armchair, Car, Settings, Box, Package, User, Star, Key, Shield, Tag, Hash, FileText, Image, LayoutGrid, List, Hammer, Sofa, Tv, Lamp, Bike, Coffee, ShoppingBag, Truck } from 'lucide-react';

export const CATEGORIES = [
    {
        id: 'Værktøj',
        label: 'Værktøj',
        skuPrefix: 'VR',
        icon: Wrench,
        color: 'text-accent'
    },
    {
        id: 'Møbler',
        label: 'Møbler',
        skuPrefix: 'MB',
        icon: Armchair,
        color: 'text-text-secondary'
    },
    {
        id: 'Auto',
        label: 'Auto',
        skuPrefix: 'AU',
        icon: Car,
        color: 'text-orange-500'
    },
    {
        id: 'Maskiner',
        label: 'Maskiner',
        skuPrefix: 'MA',
        icon: Settings,
        color: 'text-blue-400'
    },
    {
        id: 'Materialer',
        label: 'Materialer',
        skuPrefix: 'MAT',
        icon: Box,
        color: 'text-purple-500'
    }
];

export const ICON_MAP = {
    'Wrench': Wrench,
    'Armchair': Armchair,
    'Car': Car,
    'Settings': Settings,
    'Box': Box,
    'Package': Package,
    'User': User,
    'Star': Star,
    'Key': Key,
    'Shield': Shield,
    'Tag': Tag,
    'Hash': Hash,
    'FileText': FileText,
    'Image': Image,
    'LayoutGrid': LayoutGrid,
    'List': List,
    'Hammer': Hammer,
    'Sofa': Sofa,
    'Tv': Tv,
    'Lamp': Lamp,
    'Bike': Bike,
    'Coffee': Coffee,
    'ShoppingBag': ShoppingBag,
    'Truck': Truck
};

export const COLORS = [
    { name: 'Guld', class: 'text-accent', hex: '#EAB308' },
    { name: 'Orange', class: 'text-orange-500', hex: '#F97316' },
    { name: 'Rød', class: 'text-red-500', hex: '#EF4444' },
    { name: 'Pink', class: 'text-pink-500', hex: '#EC4899' },
    { name: 'Lilla', class: 'text-purple-500', hex: '#A855F7' },
    { name: 'Blå', class: 'text-blue-400', hex: '#60A5FA' },
    { name: 'Cyan', class: 'text-cyan-400', hex: '#22D3EE' },
    { name: 'Grøn', class: 'text-green-500', hex: '#22C55E' },
    { name: 'Lime', class: 'text-lime-400', hex: '#A3E635' },
    { name: 'Grå', class: 'text-text-secondary', hex: '#94A3B8' }
];

export const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || Package;
};

export const DEFAULT_CATEGORY_ICON = Package;
