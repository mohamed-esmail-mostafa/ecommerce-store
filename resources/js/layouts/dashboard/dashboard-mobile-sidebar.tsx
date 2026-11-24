import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Shield } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useDasboardnav from '@/hooks/use-dasboard-nav';
import useImports from '@/hooks/use-imports';
import useAuth from '@/hooks/use-auth';

export default function DashboardMobileSidebar() {
    const [open, setOpen] = useState(false);
    const { navItems } = useDasboardnav();
    const { t, isArabic } = useImports();
    const { auth } = useAuth();
    const { url } = usePage();

    const isCurrent = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(href);
    };

    const side = isArabic ? 'right' : 'left';

    return (
        <div className="lg:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 p-0 hover:bg-muted"
                        aria-label={t('admin_nav.menu', 'Toggle menu')}
                    >
                        <Menu className="size-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side={side}
                    className="p-0 flex flex-col gap-0 w-72 sm:w-80 border-border/70 bg-card text-card-foreground"
                >
                    {/* Header with Brand Logo */}
                    <SheetHeader className="p-0 border-b border-border/60">
                        <div className="flex h-16 items-center gap-3 px-6">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                                <Shield className="size-5" />
                            </div>
                            <div className="flex flex-col text-start">
                                <SheetTitle className="font-bold tracking-tight text-foreground text-sm">
                                    {t('admin_nav.admin_console')}
                                </SheetTitle>
                                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                    {t('admin_nav.management')}
                                </span>
                            </div>
                        </div>
                    </SheetHeader>

                    {/* Navigation Items (Scrollable) */}
                    <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto overflow-x-hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isCurrent(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Footer */}
                    <div className="border-t border-border/60 p-4 shrink-0 bg-card">
                        <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-2.5">
                            <Avatar className="size-8">
                                <AvatarImage
                                    src={auth?.user?.avatar}
                                    alt={auth?.user?.name || 'Admin'}
                                />
                                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                    {auth?.user?.name
                                        ? auth.user.name.slice(0, 2).toUpperCase()
                                        : 'AD'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-1 flex-col text-start">
                                <span className="truncate text-xs font-semibold text-foreground">
                                    {auth?.user?.name || 'Administrator'}
                                </span>
                                <span className="truncate text-[11px] text-muted-foreground">
                                    {auth?.user?.email || 'admin@system.local'}
                                </span>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
