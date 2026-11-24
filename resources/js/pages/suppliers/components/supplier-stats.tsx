import React from 'react';
import { Building2, CheckCircle2, MessageCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import useImports from '@/hooks/use-imports';
import { Supplier } from '@/types/supplier';

interface SupplierStatsProps {
    suppliers: Supplier[];
}

export default function SupplierStats({ suppliers }: SupplierStatsProps) {
    const { t } = useImports();

    const totalCount = suppliers.length;
    const activeCount = suppliers.filter((s) => s.is_active !== false).length;
    const inactiveCount = suppliers.filter((s) => s.is_active === false).length;
    const whatsappCount = suppliers.filter((s) => Boolean(s.whatsup && s.whatsup.trim())).length;

    const stats = [
        {
            title: t('suppliers.total_suppliers', 'Total Suppliers'),
            value: totalCount.toLocaleString(),
            icon: Building2,
            bgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
            description: t('suppliers.all_status', 'All registered partners'),
        },
        {
            title: t('suppliers.active_suppliers', 'Active Suppliers'),
            value: activeCount.toLocaleString(),
            icon: CheckCircle2,
            bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
            description: `${Math.round((activeCount / (totalCount || 1)) * 100)}% of total suppliers`,
        },
        {
            title: t('suppliers.inactive_suppliers', 'Inactive Suppliers'),
            value: inactiveCount.toLocaleString(),
            icon: XCircle,
            bgClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
            description: `${Math.round((inactiveCount / (totalCount || 1)) * 100)}% of total suppliers`,
        },
        {
            title: t('suppliers.whatsapp_available', 'WhatsApp Connected'),
            value: whatsappCount.toLocaleString(),
            icon: MessageCircle,
            bgClass: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400',
            description: `${Math.round((whatsappCount / (totalCount || 1)) * 100)}% instant messaging ready`,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={idx} className="p-4 border border-border/60 shadow-xs hover:border-primary/30 transition-colors">
                        <CardContent className="p-0 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{stat.description}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgClass}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
