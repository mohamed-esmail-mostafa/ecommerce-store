import React from 'react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    Mail,
    MapPin,
    Package,
    PackageCheck,
    Phone,
    Truck,
    User as UserIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import useImports from '@/hooks/use-imports';
import { Order } from '@/types/order';

interface OrderDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    onUpdateStatus: (order: Order) => void;
}

export default function OrderDetailsModal({
    open,
    onOpenChange,
    order,
    onUpdateStatus,
}: OrderDetailsModalProps) {
    const { t, isArabic, currency } = useImports();

    if (!order) return null;

    const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '—';

    const orderItems =
        order.items && order.items.length > 0
            ? order.items
            : order.product
            ? [
                  {
                      id: 1,
                      order_id: order.id,
                      product_id: order.product.id,
                      product_title: order.product.title,
                      quantity: 1,
                      price: order.product.price,
                      total: order.subtotal || order.total,
                      product: order.product,
                  },
              ]
            : [];

    const isCancelled = order.status === 'cancelled' || order.status === 'failed';

    const getStatusStepIndex = (status: string) => {
        switch (status) {
            case 'pending':
                return 0;
            case 'processing':
                return 1;
            case 'shipped':
                return 2;
            case 'delivered':
            case 'completed':
                return 3;
            default:
                return 0;
        }
    };

    const currentStep = getStatusStepIndex(order.status);

    const steps = [
        { label: t('orders_page.statuses.pending', 'Pending'), icon: Clock },
        { label: t('orders_page.statuses.processing', 'Processing'), icon: Package },
        { label: t('orders_page.statuses.shipped', 'Shipped'), icon: Truck },
        { label: t('orders_page.statuses.delivered', 'Delivered'), icon: CheckCircle2 },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="size-3 me-1" />
                        {t(`orders_page.statuses.${status}`, status)}
                    </Badge>
                );
            case 'processing':
            case 'shipped':
                return (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Truck className="size-3 me-1" />
                        {t(`orders_page.statuses.${status}`, status)}
                    </Badge>
                );
            case 'cancelled':
            case 'failed':
                return (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        <AlertCircle className="size-3 me-1" />
                        {t(`orders_page.statuses.${status}`, status)}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="size-3 me-1" />
                        {t('orders_page.statuses.pending', 'Pending')}
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (status?: string | null) => {
        if (status === 'paid') {
            return (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {t('orders_page.payment_statuses.paid', 'Paid')}
                </Badge>
            );
        }
        if (status === 'refunded') {
            return (
                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {t('orders_page.payment_statuses.refunded', 'Refunded')}
                </Badge>
            );
        }
        if (status === 'failed') {
            return (
                <Badge variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    {t('orders_page.payment_statuses.failed', 'Failed')}
                </Badge>
            );
        }
        return (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {t('orders_page.payment_statuses.pending', 'Unpaid')}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="p-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    <div className="flex flex-wrap items-center justify-between gap-3 pe-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl font-bold font-mono">
                                    {order.order_no}
                                </DialogTitle>
                                {getStatusBadge(order.status)}
                            </div>
                            <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Calendar className="size-3.5" />
                                <span>{formattedDate}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Timeline */}
                    {isCancelled ? (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
                            <AlertCircle className="size-5 shrink-0" />
                            <p className="text-xs sm:text-sm font-semibold">
                                {t(`orders_page.statuses.${order.status}`, 'Order Cancelled / Failed')}
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="grid grid-cols-4 relative gap-2 text-center">
                                <div className="absolute top-4 start-1/8 end-1/8 h-0.5 bg-muted -z-0" />
                                <div
                                    className="absolute top-4 start-1/8 h-0.5 bg-primary transition-all duration-300 -z-0"
                                    style={{
                                        width: `${(currentStep / (steps.length - 1)) * 75}%`,
                                    }}
                                />
                                {steps.map((step, idx) => {
                                    const StepIcon = step.icon;
                                    const isCompleted = idx <= currentStep;
                                    const isCurrent = idx === currentStep;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
                                            <div
                                                className={`size-8 rounded-full flex items-center justify-center transition-all ${
                                                    isCompleted
                                                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                <StepIcon className="size-4" />
                                            </div>
                                            <span
                                                className={`text-[11px] font-medium leading-tight ${
                                                    isCurrent
                                                        ? 'text-primary font-bold'
                                                        : isCompleted
                                                        ? 'text-foreground'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Customer & Shipping Info */}
                    <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-primary" />
                            <span>
                                {t(
                                    'account_page.orders.modal.shipping_details',
                                    'Customer & Delivery Details'
                                )}
                            </span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground block">
                                    {t('account_page.orders.modal.customer_name', 'Customer')}
                                </span>
                                <span className="font-semibold text-foreground flex items-center gap-1.5">
                                    <UserIcon className="size-3.5 text-muted-foreground" />
                                    {order.name || '—'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground block">
                                    {t('account_page.orders.modal.customer_phone', 'Phone')}
                                </span>
                                <span className="font-semibold text-foreground flex items-center gap-1.5" dir="ltr">
                                    <Phone className="size-3.5 text-muted-foreground" />
                                    {order.phone || '—'}
                                </span>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <span className="text-xs text-muted-foreground block">
                                    {t('account_page.orders.modal.customer_email', 'Email')}
                                </span>
                                <span className="font-medium text-foreground flex items-center gap-1.5">
                                    <Mail className="size-3.5 text-muted-foreground" />
                                    {order.email || '—'}
                                </span>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <span className="text-xs text-muted-foreground block">
                                    {t('account_page.orders.modal.destination', 'Delivery Address')}
                                </span>
                                <span className="font-medium text-foreground">
                                    {order.address
                                        ? `${order.address}${order.city ? `, ${order.city}` : ''}${
                                              order.governorate ? `, ${order.governorate}` : ''
                                          }`
                                        : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Package className="size-3.5 text-primary" />
                            <span>{t('account_page.orders.modal.order_items', 'Order Items')}</span>
                        </p>
                        <div className="divide-y rounded-xl border overflow-hidden">
                            {orderItems.map((item, idx) => {
                                const firstImg = item.product?.images?.[0];
                                const imageSrc =
                                    (typeof firstImg === 'string'
                                        ? firstImg
                                        : (firstImg as any)?.image) ||
                                    (item.product as any)?.thumbnail ||
                                    null;

                                return (
                                    <div
                                        key={item.id || idx}
                                        className="p-3.5 flex items-center justify-between gap-3 bg-card"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.product_title || 'Product'}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="size-5 text-muted-foreground/60" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                                                    {item.product_title || item.product?.title || 'Product'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.quantity} × {Number(item.price).toFixed(2)}{' '}
                                                    {currency || 'USD'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-end shrink-0 font-bold text-xs sm:text-sm">
                                            {Number(item.total).toFixed(2)} {currency || 'USD'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Financial & Payment Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border bg-card space-y-2.5 text-xs">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <CreditCard className="size-3.5 text-primary" />
                                <span>
                                    {t('account_page.orders.modal.payment_details', 'Payment Summary')}
                                </span>
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">
                                    {t('account_page.orders.modal.method', 'Method')}:
                                </span>
                                <span className="font-semibold capitalize">
                                    {order.payement_method?.replace(/_/g, ' ') || '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">
                                    {t('account_page.orders.modal.payment_status', 'Payment Status')}:
                                </span>
                                {getPaymentBadge(order.payement_status)}
                            </div>
                            {order.notes && (
                                <div className="pt-2 border-t mt-2">
                                    <span className="text-muted-foreground block font-medium mb-0.5">
                                        {t('account_page.orders.modal.notes', 'Notes')}:
                                    </span>
                                    <p className="text-muted-foreground italic bg-muted/40 p-2 rounded-lg">
                                        "{order.notes}"
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-xl border bg-card space-y-2 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>{t('account_page.orders.modal.subtotal', 'Subtotal')}</span>
                                <span>
                                    {Number(order.subtotal || 0).toFixed(2)} {currency || 'USD'}
                                </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>{t('account_page.orders.modal.shipping_cost', 'Shipping')}</span>
                                <span>
                                    {Number(order.shipping_cost || 0) === 0
                                        ? t('account_page.orders.modal.free_shipping', 'Free')
                                        : `${Number(order.shipping_cost || 0).toFixed(2)} ${currency || 'USD'}`}
                                </span>
                            </div>
                            {Number(order.discount || 0) > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>{t('account_page.orders.modal.discount', 'Discount')}</span>
                                    <span>
                                        -{Number(order.discount || 0).toFixed(2)} {currency || 'USD'}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-sm sm:text-base text-foreground pt-2 border-t">
                                <span>{t('account_page.orders.modal.total', 'Total')}</span>
                                <span className="text-primary">
                                    {Number(order.total || 0).toFixed(2)} {currency || 'USD'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-muted/20 flex flex-row justify-between sm:justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            onOpenChange(false);
                            onUpdateStatus(order);
                        }}
                        className="gap-1.5"
                    >
                        <PackageCheck className="size-4" />
                        <span>{t('orders_page.table.update_status', 'Update Status')}</span>
                    </Button>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('account_page.orders.modal.close', 'Close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
