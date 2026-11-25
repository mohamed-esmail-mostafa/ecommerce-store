import React from 'react';
import { CheckCircle2, Clock, CreditCard, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import useImports from '@/hooks/use-imports';
import { AccountOrderStats } from '@/types/account';

interface AccountStatsProps {
    stats: AccountOrderStats;
}

export default function AccountStats({ stats }: AccountStatsProps) {
    const { t, currency } = useImports();

    const statItems = [
        {
            title: t('account_page.stats.total_orders', 'Total Orders'),
            value: stats.total_orders || 0,
            icon: ShoppingBag,
            bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20',
            borderColor: 'border-blue-500/20',
        },
        {
            title: t('account_page.stats.pending_orders', 'Pending Orders'),
            value: stats.pending_orders || 0,
            icon: Clock,
            bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20',
            borderColor: 'border-amber-500/20',
        },
        {
            title: t('account_page.stats.completed_orders', 'Delivered Orders'),
            value: stats.completed_orders || 0,
            icon: CheckCircle2,
            bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20',
            borderColor: 'border-emerald-500/20',
        },
        {
            title: t('account_page.stats.total_spent', 'Total Spent'),
            value: `${Number(stats.total_spent || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })} ${currency || 'USD'}`,
            icon: CreditCard,
            bgColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20',
            borderColor: 'border-purple-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Card
                        key={index}
                        className="p-5 border transition-all duration-200 hover:shadow-md hover:border-primary/20 gap-0"
                    >
                        <CardContent className="p-0 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {item.title}
                                </p>
                                <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                    {item.value}
                                </p>
                            </div>
                            <div
                                className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${item.bgColor} border ${item.borderColor}`}
                            >
                                <Icon className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
