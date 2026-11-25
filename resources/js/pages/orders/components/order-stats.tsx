import React from 'react';
import { CheckCircle2, Clock, CreditCard, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import useImports from '@/hooks/use-imports';
import { OrderStats as OrderStatsType } from '@/types/order';
import { Pagination } from '@/types/pagination';
import { Order } from '@/types/order';

interface OrderStatsProps {
    stats: OrderStatsType;
    orders: Pagination<Order>;
}

export default function OrderStats({ stats, orders }: OrderStatsProps) {
    const { t, currency } = useImports();

    const statItems = [
        {
            title: t('orders_page.stats.total_orders', 'Total Orders'),
            value: (stats?.total_orders ?? orders.total ?? 0).toLocaleString(),
            icon: ShoppingBag,
            bgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
            description: `${orders.per_page} ${t('common.per_page', 'per page')}`,
        },
        {
            title: t('orders_page.stats.pending_orders', 'In Progress'),
            value: (stats?.pending_orders ?? 0).toLocaleString(),
            icon: Clock,
            bgClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
            description: t('orders_page.statuses.pending', 'Pending') + ' / ' + t('orders_page.statuses.processing', 'Processing'),
        },
        {
            title: t('orders_page.stats.completed_orders', 'Delivered'),
            value: (stats?.completed_orders ?? 0).toLocaleString(),
            icon: CheckCircle2,
            bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
            description: t('orders_page.stats.cancelled_count', {
                count: stats?.cancelled_orders ?? 0,
                defaultValue: `${stats?.cancelled_orders ?? 0} cancelled`,
            }),
        },
        {
            title: t('orders_page.stats.total_revenue', 'Total Revenue'),
            value: `${Number(stats?.total_revenue ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })} ${currency || 'USD'}`,
            icon: CreditCard,
            bgClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
            description: t('orders_page.statuses.completed', 'Excluding cancelled'),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                    <Card
                        key={idx}
                        className="p-4 border border-border/60 shadow-xs hover:border-primary/30 transition-colors"
                    >
                        <CardContent className="p-0 flex items-center justify-between gap-2">
                            <div className="space-y-1 min-w-0">
                                <p className="text-xs font-medium text-muted-foreground truncate">
                                    {stat.title}
                                </p>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                                    {stat.value}
                                </h3>
                                <p className="text-[11px] text-muted-foreground truncate">
                                    {stat.description}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl shrink-0 ${stat.bgClass}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
