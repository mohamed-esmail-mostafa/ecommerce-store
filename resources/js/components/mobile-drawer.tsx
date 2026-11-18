import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Logo from '@/components/ui/logo'
import useUserNav from '@/hooks/use-user-nav'

export default function MobileDrawer() {
    const { navLinks } = useUserNav()
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden "> <Menu size={24} /></SheetTrigger>
            <SheetContent className='p-4'>
                <div className='mt-10'>
                    <Logo />
                    {navLinks.map((link) => (
                        <div key={link.label}>
                            <a
                                href={link.href}
                                className="flex items-center justify-between py-4 text-sm font-medium text-black dark:text-white border-b border-gray-100 transition-colors"
                            >
                                {link.label}
                                {link.badge && (
                                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        {link.badge}
                                    </span>
                                )}
                            </a>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}
