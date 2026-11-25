import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Calendar,
    LayoutDashboard,
    Lock,
    Mail,
    Package,
    Phone,
    Shield,
    User as UserIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import { User } from '@/types/auth';

interface AccountHeaderProps {
    user: User;
    activeTab: 'profile' | 'security' | 'orders';
    onTabChange: (tab: 'profile' | 'security' | 'orders') => void;
    ordersCount?: number;
}

export default function AccountHeader({
    user,
    activeTab,
    onTabChange,
    ordersCount = 0,
}: AccountHeaderProps) {
    const { t, isArabic } = useImports();

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const joinedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '—';

    const isAdminOrStaff =
        user.role?.name?.toLowerCase().includes('admin') ||
        user.role?.name?.toLowerCase().includes('staff') ||
        user.role_id === 1;

    return (
        <div className="relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm mb-8">
            {/* Background Decorative Gradient Banner */}
            <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-primary/15 via-primary/5 to-primary/20 border-b relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="absolute top-4 end-4 flex items-center gap-2">
                    {isAdminOrStaff && (
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="bg-background/80 backdrop-blur-sm shadow-xs hover:bg-background"
                        >
                            <Link href="/dashboard" className="flex items-center gap-1.5 font-medium text-xs">
                                <LayoutDashboard className="size-3.5 text-primary" />
                                <span>{t('dashboard.sidebar.overview', 'Dashboard')}</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Profile Info Row */}
            <div className="px-6 pb-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
                    {/* Avatar & Identifiers */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-start">
                        {/* Avatar */}
                        <div className="relative size-24 sm:size-28 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-lg ring-4 ring-card select-none">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="size-full object-cover rounded-2xl"
                                />
                            ) : (
                                <span>{getInitials(user.name)}</span>
                            )}
                            <span className="absolute bottom-1 end-1 size-4 rounded-full bg-emerald-500 ring-2 ring-card" />
                        </div>

                        {/* Name & Metadata */}
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                    {user.name}
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="capitalize font-semibold text-xs border border-primary/20 bg-primary/10 text-primary"
                                >
                                    <Shield className="size-3 me-1 inline" />
                                    {user.role?.name || t('account_page.customer', 'Customer')}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail className="size-3.5 shrink-0" />
                                    <span>{user.email}</span>
                                </span>
                                {user.phone && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Phone className="size-3.5 shrink-0" />
                                        <span dir="ltr">{user.phone}</span>
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="size-3.5 shrink-0" />
                                    <span>
                                        {t('account_page.member_since', {
                                            date: joinedDate,
                                            defaultValue: `Joined ${joinedDate}`,
                                        })}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 border-t pt-4 overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => onTabChange('orders')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 cursor-pointer ${
                            activeTab === 'orders'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }`}
                    >
                        <Package className="size-4" />
                        <span>{t('account_page.tabs.orders', 'My Orders')}</span>
                        {ordersCount > 0 && (
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                    activeTab === 'orders'
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {ordersCount}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange('profile')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 cursor-pointer ${
                            activeTab === 'profile'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }`}
                    >
                        <UserIcon className="size-4" />
                        <span>{t('account_page.tabs.profile', 'Personal Information')}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange('security')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 cursor-pointer ${
                            activeTab === 'security'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }`}
                    >
                        <Lock className="size-4" />
                        <span>{t('account_page.tabs.security', 'Security & Password')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
