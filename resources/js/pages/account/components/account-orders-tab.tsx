import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Eye,
    Package,
    Search,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useImports from '@/hooks/use-imports';
import { Order } from '@/types/order';
import { Pagination } from '@/types/pagination';

interface AccountOrdersTabProps {
    orders: Pagination<Order>;
    onViewOrder: (order: Order) => void;
}

export default function AccountOrdersTab({
    orders,
    onViewOrder,
}: AccountOrdersTabProps) {
    const { t, isArabic, currency } = useImports();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Filter orders locally for fast and smooth response
    const filteredOrders = useMemo(() => {
        if (!orders?.data) return [];

        return orders.data.filter((order) => {
            const matchesSearch =
                !searchQuery ||
                order.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items?.some((item) =>
                    item.product_title?.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesStatus =
                selectedStatus === 'all' || order.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [orders?.data, searchQuery, selectedStatus]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="size-3 me-1" />
                        {t('account_page.orders.status_badges.delivered', 'Delivered')}
                    </Badge>
                );
            case 'processing':
                return (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Package className="size-3 me-1" />
                        {t('account_page.orders.status_badges.processing', 'Processing')}
                    </Badge>
                );
            case 'cancelled':
            case 'failed':
                return (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        <AlertCircle className="size-3 me-1" />
                        {t('account_page.orders.status_badges.cancelled', 'Cancelled')}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="size-3 me-1" />
                        {t('account_page.orders.status_badges.pending', 'Pending')}
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (status?: string | null) => {
        if (status === 'paid') {
            return (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {t('account_page.orders.payment_badges.paid', 'Paid')}
                </span>
            );
        }
        return (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                {t('account_page.orders.payment_badges.pending', 'Unpaid')}
            </span>
        );
    };

    const changePage = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <Card className="border shadow-sm">
            <CardHeader className="border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Package className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                {t('account_page.orders.title', 'My Orders')}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                {t(
                                    'account_page.orders.description',
                                    'View and track the status of all your current and past purchases.'
                                )}
                            </CardDescription>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-56">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t(
                                    'account_page.orders.search_placeholder',
                                    'Search by order #...'
                                )}
                                className="ps-9 h-9 text-xs"
                            />
                        </div>

                        <Select
                            value={selectedStatus}
                            onValueChange={(val) => setSelectedStatus(val)}
                        >
                            <SelectTrigger className="w-36 h-9 text-xs">
                                <SelectValue
                                    placeholder={t(
                                        'account_page.orders.all_status',
                                        'All Statuses'
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('account_page.orders.all_status', 'All Statuses')}
                                </SelectItem>
                                <SelectItem value="pending">
                                    {t('account_page.orders.status_badges.pending', 'Pending')}
                                </SelectItem>
                                <SelectItem value="processing">
                                    {t(
                                        'account_page.orders.status_badges.processing',
                                        'Processing'
                                    )}
                                </SelectItem>
                                <SelectItem value="delivered">
                                    {t(
                                        'account_page.orders.status_badges.delivered',
                                        'Delivered'
                                    )}
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    {t(
                                        'account_page.orders.status_badges.cancelled',
                                        'Cancelled'
                                    )}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {filteredOrders.length === 0 ? (
                    /* Empty State */
                    <div className="py-16 px-4 text-center">
                        <div className="size-16 rounded-2xl bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center mb-4">
                            <ShoppingBag className="size-8 stroke-[1.5]" />
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-1">
                            {t('account_page.orders.empty_title', 'No orders found')}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                            {searchQuery || selectedStatus !== 'all'
                                ? t(
                                      'account_page.orders.empty_desc',
                                      'No orders match your current search and filters.'
                                  )
                                : t(
                                      'account_page.orders.empty_desc',
                                      "You haven't placed any orders yet. Discover our latest collections and start shopping!"
                                  )}
                        </p>
                        <Button asChild size="sm" className="gap-2">
                            <Link href="/shop">
                                <ShoppingBag className="size-4" />
                                <span>
                                    {t('account_page.orders.empty_cta', 'Start Shopping')}
                                </span>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-start text-xs border-collapse">
                                <thead>
                                    <tr className="border-b bg-muted/30 text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                                        <th className="py-3.5 px-6 text-start">
                                            {t('account_page.orders.order_no', 'Order #')}
                                        </th>
                                        <th className="py-3.5 px-4 text-start">
                                            {t('account_page.orders.date', 'Date')}
                                        </th>
                                        <th className="py-3.5 px-4 text-start">
                                            {t('account_page.orders.items', 'Items')}
                                        </th>
                                        <th className="py-3.5 px-4 text-start">
                                            {t('account_page.orders.payment', 'Payment')}
                                        </th>
                                        <th className="py-3.5 px-4 text-start">
                                            {t('account_page.orders.status', 'Status')}
                                        </th>
                                        <th className="py-3.5 px-4 text-start">
                                            {t('account_page.orders.total', 'Total')}
                                        </th>
                                        <th className="py-3.5 px-6 text-end">
                                            {t('account_page.orders.actions', 'Action')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredOrders.map((order) => {
                                        const formattedDate = order.created_at
                                            ? new Date(order.created_at).toLocaleDateString(
                                                  isArabic ? 'ar-EG' : 'en-US',
                                                  {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  }
                                              )
                                            : '—';

                                        const items = order.items || [];
                                        const itemsCount = items.reduce(
                                            (acc, item) => acc + (item.quantity || 1),
                                            0
                                        ) || 1;

                                        return (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                {/* Order No */}
                                                <td className="py-4 px-6 font-semibold text-foreground">
                                                    <span className="font-mono">{order.order_no}</span>
                                                </td>

                                                {/* Date */}
                                                <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                                                    {formattedDate}
                                                </td>

                                                {/* Purchased Preview items */}
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-2 overflow-hidden rtl:space-x-reverse">
                                                            {items.slice(0, 3).map((item, idx) => {
                                                                const firstImg = item.product?.images?.[0];
                                                                const img =
                                                                    (typeof firstImg === 'string'
                                                                        ? firstImg
                                                                        : (firstImg as any)?.image) ||
                                                                    (item.product as any)?.thumbnail;
                                                                return (
                                                                    <div
                                                                        key={idx}
                                                                        className="inline-block size-8 rounded-lg ring-2 ring-background bg-muted overflow-hidden border shrink-0"
                                                                    >
                                                                        {img ? (
                                                                            <img
                                                                                src={img}
                                                                                alt={item.product_title || ''}
                                                                                className="size-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="size-full flex items-center justify-center text-muted-foreground">
                                                                                <Package className="size-3.5" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">
                                                            {itemsCount}{' '}
                                                            {itemsCount === 1 ? 'item' : 'items'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Payment */}
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground capitalize">
                                                            {order.payement_method === 'cash_on_delivery'
                                                                ? 'COD'
                                                                : 'Card'}
                                                        </span>
                                                        {getPaymentBadge(order.payement_status)}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-4">
                                                    {getStatusBadge(order.status)}
                                                </td>

                                                {/* Total */}
                                                <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                                                    {Number(order.total || 0).toFixed(2)}{' '}
                                                    <span className="text-muted-foreground font-normal text-[11px]">
                                                        {currency || 'USD'}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-end">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onViewOrder(order)}
                                                        className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Eye className="size-3.5" />
                                                        <span>
                                                            {t(
                                                                'account_page.orders.view_details',
                                                                'View'
                                                            )}
                                                        </span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="md:hidden divide-y">
                            {filteredOrders.map((order) => {
                                const formattedDate = order.created_at
                                    ? new Date(order.created_at).toLocaleDateString(
                                          isArabic ? 'ar-EG' : 'en-US',
                                          {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          }
                                      )
                                    : '—';

                                const items = order.items || [];
                                const itemsCount = items.reduce(
                                    (acc, item) => acc + (item.quantity || 1),
                                    0
                                ) || 1;

                                return (
                                    <div key={order.id} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <span className="font-mono font-bold text-sm text-foreground block">
                                                    {order.order_no}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Calendar className="size-3" />
                                                    <span>{formattedDate}</span>
                                                </span>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-1.5 overflow-hidden rtl:space-x-reverse">
                                                    {items.slice(0, 3).map((item, idx) => {
                                                        const firstImg = item.product?.images?.[0];
                                                        const img =
                                                            (typeof firstImg === 'string'
                                                                ? firstImg
                                                                : (firstImg as any)?.image) ||
                                                            (item.product as any)?.thumbnail;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="inline-block size-7 rounded-md ring-2 ring-background bg-muted overflow-hidden border shrink-0"
                                                            >
                                                                {img ? (
                                                                    <img
                                                                        src={img}
                                                                        alt={item.product_title || ''}
                                                                        className="size-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="size-full flex items-center justify-center text-muted-foreground">
                                                                        <Package className="size-3" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-muted-foreground font-medium">
                                                    {itemsCount}{' '}
                                                    {itemsCount === 1 ? 'item' : 'items'}
                                                </span>
                                            </div>

                                            <div className="text-end">
                                                <span className="font-bold text-sm text-foreground block">
                                                    {Number(order.total || 0).toFixed(2)}{' '}
                                                    {currency || 'USD'}
                                                </span>
                                                {getPaymentBadge(order.payement_status)}
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onViewOrder(order)}
                                            className="w-full h-8 text-xs gap-1.5"
                                        >
                                            <Eye className="size-3.5" />
                                            <span>
                                                {t(
                                                    'account_page.orders.view_details',
                                                    'View Details'
                                                )}
                                            </span>
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {orders?.total > orders?.per_page && (
                            <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-muted-foreground">
                                    {t('common.showing', 'Showing')}{' '}
                                    <span className="font-semibold text-foreground">
                                        {orders.from ?? 1}
                                    </span>{' '}
                                    {t('common.to', 'to')}{' '}
                                    <span className="font-semibold text-foreground">
                                        {orders.to ?? orders.data.length}
                                    </span>{' '}
                                    {t('common.of', 'of')}{' '}
                                    <span className="font-semibold text-foreground">
                                        {orders.total}
                                    </span>{' '}
                                    {t('account_page.orders.title', 'orders')}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2.5 text-xs gap-1"
                                        disabled={!orders.prev_page_url}
                                        onClick={() => changePage(orders.prev_page_url)}
                                    >
                                        <ChevronLeft className="size-3.5" />
                                        <span className="hidden sm:inline">
                                            {t('common.previous', 'Previous')}
                                        </span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2.5 text-xs gap-1"
                                        disabled={!orders.next_page_url}
                                        onClick={() => changePage(orders.next_page_url)}
                                    >
                                        <span className="hidden sm:inline">
                                            {t('common.next', 'Next')}
                                        </span>
                                        <ChevronRight className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
