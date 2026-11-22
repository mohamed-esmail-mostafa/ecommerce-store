import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Banknote,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    Home,
    MapPin,
    Package,
    Phone,
    Printer,
    RotateCcw,
    ShoppingBag,
    Sparkles,
    Truck,
    User,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import UserLayout from '@/layouts/user-layout';
import { Order } from '@/types/order';

interface ConfirmationPageProps {
    order: Order;
}

export default function OrderConfirmationPage({
    order,
}: ConfirmationPageProps) {
    const { t, isArabic } = useImports();
    const { settings } = useWebsiteSettings();
    const [copied, setCopied] = useState(false);

    const currency = isArabic
        ? settings?.currency_ar || 'ر.س'
        : settings?.currency_en || '$';

    const handleCopyOrderNo = () => {
        navigator.clipboard.writeText(order.order_no);
        setCopied(true);
        toast.success(
            isArabic
                ? 'تم نسخ رقم الطلب إلى الحافظة'
                : 'Order number copied to clipboard',
        );
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    const subtotalNum = Number(order.subtotal) || 0;
    const shippingNum = Number(order.shipping_cost) || 0;
    const discountNum = Number(order.discount) || 0;
    const totalNum = Number(order.total) || 0;

    return (
        <UserLayout>
            <Head
                title={
                    isArabic
                        ? `تأكيد الطلب #${order.order_no} — Shopella`
                        : `Order Confirmed #${order.order_no} — Shopella`
                }
            />

            <div className="container mx-auto px-4 py-10 lg:py-16">
                <div className="mx-auto max-w-3xl space-y-8">
                    {/* 1. Header Celebration Card */}
                    <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm sm:p-12 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5 sm:h-24 sm:w-24">
                            <CheckCircle2 className="h-12 w-12 stroke-[2] sm:h-14 sm:w-14" />
                        </div>

                        <Badge className="mb-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-500">
                            {isArabic
                                ? 'تم تأكيد طلبك بنجاح'
                                : 'Order Placed Successfully'}
                        </Badge>

                        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-neutral-50">
                            {isArabic
                                ? 'شكراً لتسوقك معنا!'
                                : 'Thank you for your order!'}
                        </h1>

                        <p className="mx-auto max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
                            {isArabic
                                ? `لقد تم استلام طلبك وجاري تجهيزه للشحن. تم إرسال تفاصيل الفاتورة إلى بريدك الإلكتروني (${order.email}).`
                                : `We have received your order and are preparing it for delivery. A confirmation has been sent to (${order.email}).`}
                        </p>

                        {/* Order Reference Pill */}
                        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-800">
                            <span className="text-xs text-neutral-500">
                                {isArabic ? 'رقم الطلب:' : 'Order Ref:'}
                            </span>
                            <span className="font-mono text-sm font-bold text-neutral-900 sm:text-base dark:text-neutral-100">
                                {order.order_no}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyOrderNo}
                                className="p-1 text-neutral-500 transition-colors hover:text-primary"
                                title={
                                    isArabic
                                        ? 'نسخ رقم الطلب'
                                        : 'Copy order number'
                                }
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 2. Order Details Summary Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Delivery Address Card */}
                        <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-2.5 border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
                                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    {isArabic
                                        ? 'عنوان التوصيل'
                                        : 'Delivery Address'}
                                </h3>
                            </div>

                            <div className="space-y-1.5 text-xs text-neutral-600 sm:text-sm dark:text-neutral-300">
                                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                                    {order.name}
                                </p>
                                <p>{order.phone}</p>
                                <p>{order.address}</p>
                                <p>
                                    {order.city}
                                    {order.governorate
                                        ? `, ${order.governorate}`
                                        : ''}
                                </p>
                                {order.notes && (
                                    <p className="pt-1 text-xs text-neutral-400 italic">
                                        "{order.notes}"
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Payment & Status Card */}
                        <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-2.5 border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
                                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    {isArabic
                                        ? 'طريقة الدفع والحالة'
                                        : 'Payment & Status'}
                                </h3>
                            </div>

                            <div className="space-y-2.5 text-xs sm:text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500">
                                        {isArabic
                                            ? 'طريقة الدفع'
                                            : 'Payment Method'}
                                        :
                                    </span>
                                    <span className="font-bold text-neutral-800 capitalize dark:text-neutral-200">
                                        {order.payement_method ===
                                        'cash_on_delivery'
                                            ? isArabic
                                                ? 'الدفع عند الاستلام'
                                                : 'Cash on Delivery'
                                            : order.payement_method}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500">
                                        {isArabic
                                            ? 'حالة الطلب'
                                            : 'Order Status'}
                                        :
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="bg-amber-50 text-xs font-bold text-amber-700 capitalize dark:bg-amber-950/40 dark:text-amber-300"
                                    >
                                        {order.status || 'Pending'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500">
                                        {isArabic
                                            ? 'حالة الدفع'
                                            : 'Payment Status'}
                                        :
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-700 capitalize dark:text-neutral-300">
                                        {order.payement_status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Purchased Items List */}
                    <div className="space-y-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="border-b border-neutral-200/80 pb-3 text-base font-bold text-neutral-900 dark:border-neutral-800 dark:text-neutral-100">
                            {isArabic ? 'المنتجات المطلوبة' : 'Purchased Items'}
                        </h3>

                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {(order.items || []).map((item) => {
                                const product = item.product;
                                const firstImage =
                                    typeof product?.images?.[0] === 'object' &&
                                    product.images[0]
                                        ? product.images[0].image
                                        : typeof product?.images?.[0] ===
                                            'string'
                                          ? product.images[0]
                                          : null;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                                                {firstImage ? (
                                                    <img
                                                        src={firstImage}
                                                        alt={
                                                            item.product_title ||
                                                            'Product'
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-6 w-6 stroke-[1.25] text-neutral-400" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="truncate text-xs font-bold text-neutral-900 sm:text-sm dark:text-neutral-100">
                                                    {item.product_title ||
                                                        product?.title ||
                                                        'Product'}
                                                </h4>
                                                <span className="text-xs text-neutral-400">
                                                    {item.quantity} ×{' '}
                                                    {Number(
                                                        item.price,
                                                    ).toLocaleString()}{' '}
                                                    {currency}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-end">
                                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                {Number(
                                                    item.total,
                                                ).toLocaleString()}{' '}
                                                {currency}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Financial Totals */}
                        <div className="space-y-2.5 border-t border-neutral-200/80 pt-4 text-sm dark:border-neutral-800">
                            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                                <span>
                                    {isArabic ? 'المجموع الفرعي' : 'Subtotal'}
                                </span>
                                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                    {subtotalNum.toLocaleString()} {currency}
                                </span>
                            </div>

                            {discountNum > 0 && (
                                <div className="flex items-center justify-between text-emerald-600">
                                    <span>
                                        {isArabic ? 'الخصم' : 'Discount'}
                                    </span>
                                    <span className="font-bold">
                                        -{discountNum.toLocaleString()}{' '}
                                        {currency}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                                <span>
                                    {isArabic ? 'تكلفة الشحن' : 'Shipping'}
                                </span>
                                <span>
                                    {shippingNum === 0 ? (
                                        <span className="text-xs font-bold text-emerald-600 uppercase">
                                            {isArabic ? 'مجاني' : 'FREE'}
                                        </span>
                                    ) : (
                                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {shippingNum.toLocaleString()}{' '}
                                            {currency}
                                        </span>
                                    )}
                                </span>
                            </div>

                            <div className="flex items-baseline justify-between border-t border-neutral-200/80 pt-3 dark:border-neutral-800">
                                <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                    {isArabic
                                        ? 'المبلغ الإجمالي'
                                        : 'Total Paid'}
                                </span>
                                <span className="text-2xl font-black text-primary">
                                    {totalNum.toLocaleString()} {currency}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Action Buttons */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row print:hidden">
                        <Link href="/shop/page" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="h-12 w-full cursor-pointer gap-2 rounded-xl px-8 font-bold shadow-md sm:w-auto"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>
                                    {isArabic
                                        ? 'متابعة التسوق'
                                        : 'Continue Shopping'}
                                </span>
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrint}
                            className="h-12 w-full cursor-pointer gap-2 rounded-xl border-neutral-300 px-6 font-semibold sm:w-auto dark:border-neutral-700"
                        >
                            <Printer className="h-4 w-4" />
                            <span>
                                {isArabic ? 'طباعة الفاتورة' : 'Print Receipt'}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
