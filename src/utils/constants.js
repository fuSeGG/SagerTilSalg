import { Wrench, Armchair, Car, Settings, Box, Package } from 'lucide-react';

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

export const GET_CATEGORY_BY_ID = (id) => CATEGORIES.find(c => c.id === id);
export const DEFAULT_CATEGORY_ICON = Package;
