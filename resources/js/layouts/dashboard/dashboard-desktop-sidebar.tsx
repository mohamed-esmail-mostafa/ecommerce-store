import useDasboardnav from '@/hooks/use-dasboard-nav';
import useImports from '@/hooks/use-imports';
import { Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuth from '@/hooks/use-auth';

export default function DashboardDesktopSidebar({ isCurrent }: any) {
    const { t } = useImports();
    const { navItems } = useDasboardnav()
    const { auth } = useAuth()
    return (
        <aside className="hidden w-64 shrink-0 border-e border-border/70 bg-card lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0">
            {/* Brand / Logo */}
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border/60 px-6">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                    <Shield className="size-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold tracking-tight text-foreground">
                        {t('admin_nav.admin_console')}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {t('admin_nav.management')}
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isCurrent(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${active
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

            {/* Sidebar User Footer */}
            <div className="border-t border-border/60 p-4 shrink-0">
                <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-2.5">
                    <Avatar className="size-8">
                        <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name || 'Admin'} />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {auth?.user?.name ? auth.user.name.slice(0, 2).toUpperCase() : 'AD'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-xs font-semibold text-foreground">
                            {auth?.user?.name || 'Administrator'}
                        </span>
                        <span className="truncate text-[11px] text-muted-foreground">
                            {auth?.user?.email || 'admin@system.local'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
