import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Globe,
    Home,
    LayoutGrid,
    ShoppingCart,
    User,
} from 'lucide-react';

import useImports from '@/hooks/use-imports';
import useDasboardnav from '@/hooks/use-dasboard-nav';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function DashboardNavigationBottom() {
    const { t } = useImports();
    const { navItems } = useDasboardnav();
    const { url } = usePage();
    const [sheetOpen, setSheetOpen] = useState(false);

    const isCurrent = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(href);
    };

    return (
        <nav
            aria-label="Dashboard mobile navigation"
            className="fixed bottom-0 right-0 left-0 z-40 h-16 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 lg:hidden shadow-lg pb-[env(safe-area-inset-bottom)]"
        >
            {/* 1. Home / Dashboard */}
            <Link
                href="/dashboard"
                className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
                    isCurrent('/dashboard')
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <Home className="w-5 h-5" />
                <span className="text-[11px] mt-1 line-clamp-1">{t('admin_nav.home')}</span>
            </Link>

            {/* 2. Orders */}
            <Link
                href="/orders/page"
                className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
                    isCurrent('/orders/page')
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-[11px] mt-1 line-clamp-1">{t('admin_nav.orders')}</span>
            </Link>

            {/* 3. Center Sheet Button: All Sections Grid */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <button
                        type="button"
                        aria-label={t('admin_nav.all_sections')}
                        className="flex flex-1 flex-col items-center justify-center py-1 text-muted-foreground hover:text-foreground group focus:outline-hidden"
                    >
                        <div className="w-10 h-10 -mt-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md transition-transform group-hover:scale-105 active:scale-95">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground mt-0.5 line-clamp-1">
                            {t('admin_nav.menu')}
                        </span>
                    </button>
                </SheetTrigger>

                <SheetContent
                    side="bottom"
                    className="rounded-t-3xl border-t border-border bg-card/98 backdrop-blur-xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
                >
                    <SheetHeader className="text-start pb-2">
                        <SheetTitle className="text-base font-bold text-foreground">
                            {t('admin_nav.all_sections')}
                        </SheetTitle>
                        <SheetDescription className="text-xs text-muted-foreground">
                            {t('admin_nav.management')}
                        </SheetDescription>
                    </SheetHeader>

                    {/* Navigation Items Grid */}
                    <div className="grid grid-cols-4 gap-3 pt-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isCurrent(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSheetOpen(false)}
                                    className={`group flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all ${
                                        active
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                                            active
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'bg-muted/80 text-foreground'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-medium text-center line-clamp-1 mt-2 w-full">
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </SheetContent>
            </Sheet>

            {/* 4. Website Settings */}
            <Link
                href="/website/settings/page"
                className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
                    isCurrent('/website/settings/page')
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <Globe className="w-5 h-5" />
                <span className="text-[11px] mt-1 line-clamp-1">
                    {t('admin_nav.website_settings')}
                </span>
            </Link>

            {/* 5. Profile */}
            <Link
                href="/settings/profile"
                className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
                    isCurrent('/settings/profile')
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <User className="w-5 h-5" />
                <span className="text-[11px] mt-1 line-clamp-1">{t('admin_nav.profile')}</span>
            </Link>
        </nav>
    );
}
