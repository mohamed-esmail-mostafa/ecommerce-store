import React from 'react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    MoreHorizontal,
    Package,
    PackageCheck,
    Phone,
    ShoppingBag,
    Trash2,
    Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NoDataFound from '@/components/no-data-found';
import useImports from '@/hooks/use-imports';
import { Order } from '@/types/order';

interface OrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
    onUpdateStatus: (order: Order) => void;
    onDelete: (order: Order) => void;
}

export default function OrdersTable({
    orders,
    onViewDetails,
    onUpdateStatus,
    onDelete,
}: OrdersTableProps) {
    const { t, isArabic, currency } = useImports();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t(`orders_page.statuses.${status}`, status)}
                    </Badge>
                );
            case 'processing':
            case 'shipped':
                return (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] gap-1">
                        <Truck className="w-3 h-3" />
                        {t(`orders_page.statuses.${status}`, status)}
                    </Badge>
                );
            case 'cancelled':
            case 'failed':
                return (
                    <Badge
                        variant="destructive"
                        className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] gap-1"
                    >
                        <AlertCircle className="w-3 h-3" />
                        {t(`orders_page.statuses.${status}`, status)}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] gap-1">
                        <Clock className="w-3 h-3" />
                        {t('orders_page.statuses.pending', 'Pending')}
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (status?: string | null) => {
        if (status === 'paid') {
            return (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {t('orders_page.payment_statuses.paid', 'Paid')}
                </span>
            );
        }
        if (status === 'refunded') {
            return (
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    {t('orders_page.payment_statuses.refunded', 'Refunded')}
                </span>
            );
        }
        if (status === 'failed') {
            return (
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                    {t('orders_page.payment_statuses.failed', 'Failed')}
                </span>
            );
        }
        return (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                {t('orders_page.payment_statuses.pending', 'Unpaid')}
            </span>
        );
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (!orders || orders.length === 0) {
        return (
            <Card className="border border-border/60 shadow-xs">
                <CardContent className="py-12">
                    <NoDataFound />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border border-border/70 bg-card shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start border-collapse">
                        <thead>
                            <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-4 text-start font-semibold">
                                    {t('orders_page.table.order_no', 'Order #')}
                                </th>
                                <th className="py-3.5 px-4 text-start font-semibold">
                                    {t('orders_page.table.customer', 'Customer')}
                                </th>
                                <th className="py-3.5 px-4 text-start font-semibold">
                                    {t('orders_page.table.items', 'Items')}
                                </th>
                                <th className="py-3.5 px-4 text-start font-semibold">
                                    {t('orders_page.table.payment', 'Payment')}
                                </th>
                                <th className="py-3.5 px-4 text-start font-semibold">
                                    {t('orders_page.table.status', 'Status')}
                                </th>
                                <th className="py-3.5 px-4 text-start font-semibold">
                                    {t('orders_page.table.total', 'Total')}
                                </th>
                                <th className="py-3.5 px-4 text-end font-semibold">
                                    {t('orders_page.table.actions', 'Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {orders.map((order) => {
                                const items = order.items || [];
                                const itemsCount =
                                    items.reduce((acc, item) => acc + (item.quantity || 1), 0) || 1;

                                return (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-muted/30 transition-colors group"
                                    >
                                        <td className="py-3.5 px-4">
                                            <div className="font-mono font-semibold text-foreground text-xs">
                                                {order.order_no}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(order.created_at)}
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="font-medium text-foreground text-xs">
                                                {order.name || order.user?.name || 'Guest'}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5" dir="ltr">
                                                <Phone className="w-3 h-3 shrink-0" />
                                                <span>{order.phone || '—'}</span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
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
                                                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                                                    {itemsCount}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-foreground capitalize">
                                                    {order.payement_method === 'cash_on_delivery'
                                                        ? 'COD'
                                                        : order.payement_method?.replace(/_/g, ' ') || '—'}
                                                </span>
                                                {getPaymentBadge(order.payement_status)}
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateStatus(order)}
                                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('orders_page.table.update_status', 'Update Status')}
                                            >
                                                {getStatusBadge(order.status)}
                                            </button>
                                        </td>

                                        <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap text-xs">
                                            {Number(order.total || 0).toFixed(2)}{' '}
                                            <span className="text-muted-foreground font-normal">
                                                {currency || 'USD'}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4 text-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuLabel className="text-xs">
                                                        {t('orders_page.table.actions', 'Actions')}
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onViewDetails(order)}
                                                        className="gap-2 cursor-pointer text-xs"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                                                        <span>
                                                            {t('orders_page.table.view_details', 'View Details')}
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onUpdateStatus(order)}
                                                        className="gap-2 cursor-pointer text-xs"
                                                    >
                                                        <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>
                                                            {t('orders_page.table.update_status', 'Update Status')}
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(order)}
                                                        className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>
                                                            {t('orders_page.table.delete_order', 'Delete Order')}
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {orders.map((order) => {
                    return (
                        <Card key={order.id} className="border border-border/70 shadow-xs">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="font-mono font-bold text-sm text-foreground block">
                                            {order.order_no}
                                        </span>
                                        <span className="text-xs text-muted-foreground block mt-0.5">
                                            {order.name || 'Guest'} • {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t text-xs">
                                    <div>
                                        <span className="text-muted-foreground block">
                                            {order.payement_method === 'cash_on_delivery' ? 'COD' : 'Card'}
                                        </span>
                                        {getPaymentBadge(order.payement_status)}
                                    </div>
                                    <div className="text-end font-bold text-sm">
                                        {Number(order.total || 0).toFixed(2)} {currency || 'USD'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-8 text-xs gap-1.5"
                                        onClick={() => onViewDetails(order)}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>{t('orders_page.table.view_details', 'Details')}</span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1 h-8 text-xs gap-1.5"
                                        onClick={() => onUpdateStatus(order)}
                                    >
                                        <PackageCheck className="w-3.5 h-3.5" />
                                        <span>{t('orders_page.table.update_status', 'Status')}</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => onDelete(order)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
