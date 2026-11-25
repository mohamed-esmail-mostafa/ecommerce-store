import React from 'react';
import useImport from './use-imports';
import {
    BarChart3,
    FolderTree,
    Globe,
    Image,
    LayoutGrid,
    Package,
    ShieldCheck,
    ShoppingCart,
    Tag,
    Users2,
    Star,
} from 'lucide-react';

export default function useDasboardnav() {
    const { t } = useImport();
    const navItems = [
        {
            title: t('dashboard.sidebar.overview'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('dashboard.sidebar.categories'),
            href: '/categories',
            icon: FolderTree,
        },
        {
            title: t('dashboard.sidebar.products'),
            href: '/products/page',
            icon: Package,
        },
        {
            title: t('dashboard.sidebar.orders'),
            href: '/orders/page',
            icon: ShoppingCart,
        },
        {
            title: t('dashboard.sidebar.brands', 'Brands'),
            href: '/brands/page',
            icon: Tag,
        },
        {
            title: t('dashboard.sidebar.store_setting'),
            href: '/website/settings/page',
            icon: Globe,
        },
        {
            title: t('dashboard.sidebar.banners'),
            href: '/banners/page',
            icon: Image,
        },
        {
            title: t('dashboard.sidebar.suppliers'),
            href: '/suppliers/page',
            icon: Users2,
        },
        {
            title: t('dashboard.sidebar.roles'),
            href: '/roles/page',
            icon: ShieldCheck,
        },
        {
            title: t('dashboard.sidebar.users'),
            href: '/users/page',
            icon: Users2,
        },
        {
            title: t('dashboard.sidebar.reviews', 'Reviews'),
            href: '/reviews/page',
            icon: Star,
        },
    ];

    return {
        navItems,
    };
}
