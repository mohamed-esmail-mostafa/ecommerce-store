import React from 'react'
import useImports from './use-imports';

export default function useUserNav() {
  const { t, i18n } = useImports()
//    const { categories } = useCategories();
    
    const navLinks = [
        {
            label: t('common.home'), href: '/', hasDropdown: false,
        },
        {
            label: t('common.shop'), href: '#', hasDropdown: true,
            children: ['New Arrivals', 'Trending Now', 'Best Sellers', 'Clearance Sale'],
        },
        {
            label: t('common.categories'), href: '#', hasDropdown: true,
            // children: categories.map((category: any) => i18n.language === 'en' ? category.name_en : category.name_ar),
        },
        {
            label: t('common.brand'), href: '#', hasDropdown: true,
            // children: brands.map((brand: any) => i18n.language === 'en' ? brand.name_en : brand.name_ar),
        },
        {
            label: t('common.sale'), href: '#', hasDropdown: false, badge: 'HOT',
        },
        {
            label: t('common.blog'), href: '#', hasDropdown: false,
        },
        {
            label: t('common.contact'), href: '#', hasDropdown: false,
        },
    ];
    return {
        navLinks
    }
}
