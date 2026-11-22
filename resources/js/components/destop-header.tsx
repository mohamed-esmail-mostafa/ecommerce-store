import Logo from '@/components/ui/logo'
import { Link, usePage } from '@inertiajs/react'
import { Heart, Menu, Search, ShoppingBagIcon, ShoppingCart, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import useImports from '@/hooks/use-imports'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/use-auth'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import useUserNav from '@/hooks/use-user-nav'
import NavbarIcon from './navbar-icon'
import AuthMenu from '@/components/auth-menu'
import DestopNavbar from './destop-navbar'
import SearchBar from './search-bar'
import useUserCart from '@/hooks/use-user-cart'
import { Category } from '@/types/category'


export default function DestopHeader({categories}:{categories:Category[]}) {
    const { t } = useImports()
    const [scrolled, setScrolled] = useState(false);
    const { auth } = useAuth()
    const {cartCount}=useUserCart()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header className={`bg-white hidden lg:block sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-4 h-18 py-3">
                    <Logo />

                    {/* DesktopSearch */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
                        <SearchBar/>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                        {/* Mobile search */}


                        {/* Wishlist */}

                        <NavbarIcon
                            href="/wishlist/page"
                            icon={<Heart size={22} className="group-hover:scale-110 transition-transform" />}
                            count={4}
                            label={t('common.wishlist')}
                        />

                        {/* Cart */}
                        <NavbarIcon
                            href="/cart/page"
                            icon={<ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />}
                            count={cartCount}
                            label={t('common.cart')}
                        />




                        {auth ? <AuthMenu /> :
                            <NavbarIcon
                                icon={<User size={22} className="group-hover:scale-110 transition-transform" />}
                                href="/login"
                                label={t('common.account')}
                            />
                        }


                    </div>
                </div>
            </div>
            {/* <DesktopNavbar /> */}
            <DestopNavbar categories={categories} />
        </header>
    )
}
