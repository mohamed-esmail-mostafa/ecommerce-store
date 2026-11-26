
import { Link, usePage } from '@inertiajs/react'
import {
    Heart,
    Home,
    ShoppingCart,
    Store,
    UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useImports from '@/hooks/use-imports'

type NavigationIconProps = {
    label: string
    icon: React.ReactNode
    href: string
    active?: boolean
}

function NavigationIcon({
    label,
    icon,
    href,
    active = false,
}: NavigationIconProps) {
    return (
        <Link
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
            }`}
        >
            <span className="relative">
                {icon}
                {active && (
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
            </span>

            <span className="text-[11px] font-semibold">
                {label}
            </span>
        </Link>
    )
}

export default function BottomNavigation() {
    const { t } = useImports()
    const { url } = usePage()

    const isActive = (path: string) => {
        return url === path || url.startsWith(`${path}/`)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="relative mx-auto max-w-lg">

                {/* Navigation background */}
                <div className="absolute inset-0 rounded-t-[28px] border-t border-border/60 bg-background/95 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl" />

                {/* Navigation items */}
                <div className="relative grid h-[76px] grid-cols-5 items-center px-3 pb-2">

                    <NavigationIcon
                        href="/"
                        label={t('common.home')}
                        icon={<Home size={23} strokeWidth={isActive('/') ? 2.5 : 1.8} />}
                        active={url === '/'}
                    />

                    <NavigationIcon
                        href="/shop/page"
                        label={t('common.shop')}
                        icon={<Store size={23} strokeWidth={isActive('/shop') ? 2.5 : 1.8} />}
                        active={isActive('/shop')}
                    />

                    {/* Center cart */}
                    <div className="flex h-full items-center justify-center">
                        <Link
                            href="/cart/page"
                            className="relative -mt-9 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[5px] border-background bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                            <ShoppingCart size={25} strokeWidth={2} />
                        </Link>
                    </div>

                    <NavigationIcon
                        href="/wishlist/page"
                        label={t('common.wishlist')}
                        icon={<Heart size={23} strokeWidth={isActive('/wishlist') ? 2.5 : 1.8} />}
                        active={isActive('/wishlist')}
                    />

                    <NavigationIcon
                        href="/account/page"
                        label={t('auth.account')}
                        icon={<UserRound size={23} strokeWidth={isActive('/account') ? 2.5 : 1.8} />}
                        active={isActive('/account')}
                    />

                </div>
            </div>
        </div>
    )
}
