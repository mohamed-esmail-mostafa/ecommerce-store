import React from 'react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Mail,
    MapPin,
    Package,
    Phone,
    Truck,
    User as UserIcon,
    X,
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

interface AccountOrderDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
}

export default function AccountOrderDetailsModal({
    open,
    onOpenChange,
    order,
}: AccountOrderDetailsModalProps) {
    const { t, isArabic, currency } = useImports();

    if (!order) return null;

    const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString(
              isArabic ? 'ar-EG' : 'en-US',
              {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              }
          )
        : '—';

    // Normalize items
    const orderItems = order.items && order.items.length > 0
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
        { label: t('account_page.orders.modal.timeline.placed', 'Order Placed'), icon: Clock },
        { label: t('account_page.orders.modal.timeline.processing', 'Processing'), icon: Package },
        { label: t('account_page.orders.modal.timeline.shipped', 'Shipped'), icon: Truck },
        { label: t('account_page.orders.modal.timeline.delivered', 'Delivered'), icon: CheckCircle2 },
    ];

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
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {t('account_page.orders.payment_badges.paid', 'Paid')}
                </Badge>
            );
        }
        return (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {t('account_page.orders.payment_badges.pending', 'Unpaid')}
            </Badge>
        );
    };

    const getPaymentMethodLabel = (method?: string | null) => {
        if (!method) return '—';
        if (method === 'cash_on_delivery') {
            return t('account_page.orders.payment_methods.cash_on_delivery', 'Cash on Delivery');
        }
        if (method === 'credit_card' || method === 'card') {
            return t('account_page.orders.payment_methods.credit_card', 'Credit Card');
        }
        return method;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Modal Header */}
                <DialogHeader className="p-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    <div className="flex flex-wrap items-center justify-between gap-3 pe-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl font-bold">
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
                    {/* Stepper Timeline or Cancelled Notice */}
                    {isCancelled ? (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
                            <AlertCircle className="size-5 shrink-0" />
                            <div className="text-xs sm:text-sm">
                                <p className="font-semibold">
                                    {t(
                                        'account_page.orders.status_badges.cancelled',
                                        'This order has been cancelled.'
                                    )}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            <p className="text-xs font-semibold text-muted-foreground mb-4">
                                {t('account_page.orders.modal.timeline', 'Order Progress')}
                            </p>
                            <div className="grid grid-cols-4 relative gap-2 text-center">
                                {/* Connector Line */}
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
                                        <div
                                            key={idx}
                                            className="flex flex-col items-center gap-2 relative z-10"
                                        >
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

                    {/* Delivery & Recipient Details */}
                    <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-primary" />
                            <span>
                                {t(
                                    'account_page.orders.modal.shipping_details',
                                    'Delivery Address & Contact'
                                )}
                            </span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground block">
                                    {t('account_page.orders.modal.customer_name', 'Recipient')}
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
                                <span
                                    className="font-semibold text-foreground flex items-center gap-1.5"
                                    dir="ltr"
                                >
                                    <Phone className="size-3.5 text-muted-foreground" />
                                    {order.phone || '—'}
                                </span>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <span className="text-xs text-muted-foreground block">
                                    {t(
                                        'account_page.orders.modal.destination',
                                        'Delivery Address'
                                    )}
                                </span>
                                <span className="font-medium text-foreground">
                                    {order.address
                                        ? `${order.address}${
                                              order.city ? `, ${order.city}` : ''
                                          }${
                                              order.governorate
                                                  ? `, ${order.governorate}`
                                                  : ''
                                          }`
                                        : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Package className="size-3.5 text-primary" />
                            <span>
                                {t(
                                    'account_page.orders.modal.order_items',
                                    'Purchased Items'
                                )}
                            </span>
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
                                        className="p-3.5 flex items-center justify-between gap-3 bg-card hover:bg-muted/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="size-14 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.product_title || 'Product'}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="size-6 text-muted-foreground/60" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                                                    {item.product_title ||
                                                        item.product?.title ||
                                                        'Product'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.quantity} ×{' '}
                                                    {Number(item.price).toFixed(2)}{' '}
                                                    {currency || 'USD'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-end shrink-0">
                                            <span className="text-xs sm:text-sm font-bold text-foreground">
                                                {Number(item.total).toFixed(2)}{' '}
                                                {currency || 'USD'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Financial Summary & Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Payment info */}
                        <div className="p-4 rounded-xl border bg-card space-y-2.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <CreditCard className="size-3.5 text-primary" />
                                <span>
                                    {t(
                                        'account_page.orders.modal.payment_details',
                                        'Payment Summary'
                                    )}
                                </span>
                            </p>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        {t('account_page.orders.modal.method', 'Method')}:
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {getPaymentMethodLabel(order.payement_method)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'account_page.orders.modal.payment_status',
                                            'Payment Status'
                                        )}
                                        :
                                    </span>
                                    {getPaymentBadge(order.payement_status)}
                                </div>
                            </div>

                            {order.notes && (
                                <div className="pt-2 border-t mt-2 text-xs">
                                    <span className="text-muted-foreground block font-medium mb-0.5">
                                        {t('account_page.orders.modal.notes', 'Delivery Notes')}:
                                    </span>
                                    <p className="text-muted-foreground italic bg-muted/40 p-2 rounded-lg">
                                        "{order.notes}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Cost Breakdown */}
                        <div className="p-4 rounded-xl border bg-card space-y-2 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>
                                    {t('account_page.orders.modal.subtotal', 'Subtotal')}
                                </span>
                                <span>
                                    {Number(order.subtotal || 0).toFixed(2)}{' '}
                                    {currency || 'USD'}
                                </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>
                                    {t(
                                        'account_page.orders.modal.shipping_cost',
                                        'Shipping Fee'
                                    )}
                                </span>
                                <span>
                                    {Number(order.shipping_cost || 0) === 0 ? (
                                        <span className="text-emerald-600 font-semibold">
                                            {t(
                                                'account_page.orders.modal.free_shipping',
                                                'Free'
                                            )}
                                        </span>
                                    ) : (
                                        `${Number(order.shipping_cost || 0).toFixed(2)} ${
                                            currency || 'USD'
                                        }`
                                    )}
                                </span>
                            </div>
                            {Number(order.discount || 0) > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>
                                        {t('account_page.orders.modal.discount', 'Discount')}
                                    </span>
                                    <span>
                                        -{Number(order.discount || 0).toFixed(2)}{' '}
                                        {currency || 'USD'}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-sm sm:text-base text-foreground pt-2 border-t">
                                <span>
                                    {t('account_page.orders.modal.total', 'Order Total')}
                                </span>
                                <span className="text-primary">
                                    {Number(order.total || 0).toFixed(2)}{' '}
                                    {currency || 'USD'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-muted/20">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t('account_page.orders.modal.close', 'Close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
