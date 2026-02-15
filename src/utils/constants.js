import { Wrench, Armchair, Car, Settings, Box, Package, User, Star, Key, Shield, Tag, Hash, FileText, Image, LayoutGrid, List } from 'lucide-react';

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
    'List': List
};

export const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || Package;
};

export const DEFAULT_CATEGORY_ICON = Package;
