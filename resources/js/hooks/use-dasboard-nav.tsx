import React from 'react'
import useImport from './use-imports';
import { BarChart3, FolderTree, Globe, LayoutGrid, ShieldCheck, Superscript, Users2 } from 'lucide-react';

export default function useDasboardnav() {
    const { t } = useImport()
    const navItems = [
        {
            title: t('dashboard.sidebar.overview'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('dashboard.sidebar.categories'),
            href: '/categories',
            icon: LayoutGrid,
        },
        {
            title: t('dashboard.sidebar.products'),
            href: '/products/page',
            icon: LayoutGrid,
        },
        {
            title: t('dashboard.sidebar.orders'),
            href: '/orders/page',
            icon: LayoutGrid,
        },
        {
            title: t('dashboard.sidebar.store_setting'),
            href: '/website/settings/page',
            icon: LayoutGrid,
        },
        {
            title: t('dashboard.sidebar.banners'),
            href: '/banners/page',
            icon: LayoutGrid,
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

    ];
    return {
        navItems
    }
}
