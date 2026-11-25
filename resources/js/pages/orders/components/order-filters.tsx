import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { CreditCard, PackageCheck, RotateCcw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useImports from '@/hooks/use-imports';
import { OrderFilters } from '@/types/order';

interface OrderFiltersProps {
    filters?: OrderFilters;
}

export default function OrderFiltersComponent({ filters }: OrderFiltersProps) {
    const { t } = useImports();
    const [search, setSearch] = useState<string>(filters?.search || '');
    const currentStatus = filters?.status || 'all';
    const currentPaymentStatus = filters?.payement_status || 'all';

    const applyFilters = (
        searchVal: string,
        statusVal: string,
        paymentStatusVal: string
    ) => {
        const query: Record<string, string> = {};
        if (searchVal.trim()) query.search = searchVal.trim();
        if (statusVal && statusVal !== 'all') query.status = statusVal;
        if (paymentStatusVal && paymentStatusVal !== 'all') {
            query.payement_status = paymentStatusVal;
        }

        router.get('/orders/page', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        applyFilters(search, currentStatus, currentPaymentStatus);
    };

    const handleReset = () => {
        setSearch('');
        router.get('/orders/page', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(
        search.trim() ||
            (currentStatus && currentStatus !== 'all') ||
            (currentPaymentStatus && currentPaymentStatus !== 'all')
    );

    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-4 bg-card p-3 rounded-lg border border-border/70 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t(
                            'orders_page.filters.search_placeholder',
                            'Search by order #, name, email, or phone...'
                        )}
                        className="ps-9 pe-8 h-9 text-sm w-full"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                applyFilters('', currentStatus, currentPaymentStatus);
                            }}
                            className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <Button type="submit" size="sm" variant="secondary" className="h-9 px-3 gap-1.5 shrink-0">
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('common.search', 'Search')}</span>
                </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Order Status Filter */}
                <div className="w-full sm:w-44">
                    <Select
                        value={currentStatus}
                        onValueChange={(val) => applyFilters(search, val, currentPaymentStatus)}
                    >
                        <SelectTrigger className="h-9 text-xs w-full">
                            <div className="flex items-center gap-1.5 truncate">
                                <PackageCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <SelectValue
                                    placeholder={t('orders_page.filters.all_statuses', 'All Statuses')}
                                />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('orders_page.filters.all_statuses', 'All Statuses')}
                            </SelectItem>
                            <SelectItem value="pending">
                                {t('orders_page.statuses.pending', 'Pending')}
                            </SelectItem>
                            <SelectItem value="processing">
                                {t('orders_page.statuses.processing', 'Processing')}
                            </SelectItem>
                            <SelectItem value="shipped">
                                {t('orders_page.statuses.shipped', 'Shipped')}
                            </SelectItem>
                            <SelectItem value="delivered">
                                {t('orders_page.statuses.delivered', 'Delivered')}
                            </SelectItem>
                            <SelectItem value="completed">
                                {t('orders_page.statuses.completed', 'Completed')}
                            </SelectItem>
                            <SelectItem value="cancelled">
                                {t('orders_page.statuses.cancelled', 'Cancelled')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Status Filter */}
                <div className="w-full sm:w-40">
                    <Select
                        value={currentPaymentStatus}
                        onValueChange={(val) => applyFilters(search, currentStatus, val)}
                    >
                        <SelectTrigger className="h-9 text-xs w-full">
                            <div className="flex items-center gap-1.5 truncate">
                                <CreditCard className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <SelectValue
                                    placeholder={t('orders_page.filters.all_payments', 'All Payments')}
                                />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('orders_page.filters.all_payments', 'All Payments')}
                            </SelectItem>
                            <SelectItem value="pending">
                                {t('orders_page.payment_statuses.pending', 'Unpaid')}
                            </SelectItem>
                            <SelectItem value="paid">
                                {t('orders_page.payment_statuses.paid', 'Paid')}
                            </SelectItem>
                            <SelectItem value="failed">
                                {t('orders_page.payment_statuses.failed', 'Failed')}
                            </SelectItem>
                            <SelectItem value="refunded">
                                {t('orders_page.payment_statuses.refunded', 'Refunded')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
                        title={t('common.reset', 'Reset filters')}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('common.reset', 'Reset')}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
