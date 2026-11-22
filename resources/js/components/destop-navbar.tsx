import useImports from '@/hooks/use-imports';
import useUserNav from '@/hooks/use-user-nav';
import { ChevronDown, Menu } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from '@inertiajs/react';
import { Category } from '@/types/category';

export default function DestopNavbar({categories}:{categories:Category[]}) {
    const {t,i18n,isArabic}=useImports();
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const {navLinks}=useUserNav()
    console.log(categories)
  return (
     <nav className="hidden lg:block border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-0">
                    {/* Browse by Category button */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowCatDropdown(true)}
                        onMouseLeave={() => setShowCatDropdown(false)}
                    >
                        <button className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 hover:bg-primary/90 transition-colors">
                            <Menu size={16} />
                            {t('common.categories')}
                            <ChevronDown size={14} className={`transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showCatDropdown && (
                            <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-b-lg z-50 w-56 py-2">
                                {categories.map((category: any) => (
                                    <Link
                                        key={category.id}
                                        href={category.href}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#c96] transition-colors"
                                    >
                                        <img src={category.image} alt="" className='w-5 h-5' />
                                        {i18n.language === 'en' ? category.name_en : category.name_ar}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main nav links */}
                    {navLinks.map((link) => (
                        <div
                            key={link.label}
                            className="relative group"
                            onMouseEnter={() => setOpenDropdown(link.label)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                            >
                                {link.label}
                                {link.badge && (
                                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 animate-pulse">
                                        {link.badge}
                                    </span>
                                )}
                                {link.hasDropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />}
                            </Link>
                            {link.hasDropdown && openDropdown === link.label && (
                                <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-b-lg z-50 min-w-45 py-2">
                                    {link.children?.map((child: any) => (
                                        <a
                                            key={child.id}
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#c96] transition-colors"
                                        >
                                            {child}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
  )
}
