import React, { useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Banknote,
    Check,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Home,
    Info,
    Lock,
    Package,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Truck,
    User as UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import UserLayout from '@/layouts/user-layout';
import { User } from '@/types/auth';
import { Cart } from '@/types/cart';

interface CheckoutPageProps {
    cart?: Cart;
    user?: User | null;
}

export default function CheckoutPage({ cart, user }: CheckoutPageProps) {
    const { t, isArabic } = useImports();
    const { settings } = useWebsiteSettings();

    const items = cart?.items || [];

    // Currency resolution
    const currency = isArabic
        ? settings?.currency_ar || 'ر.س'
        : settings?.currency_en || '$';

    // Subtotal and shipping calculations
    const { subtotal, originalTotal, totalSavings, totalItemsCount } =
        useMemo(() => {
            let sub = 0;
            let orig = 0;
            let count = 0;

            items.forEach((item) => {
                const itemPrice = Number(item.price) || 0;
                const itemOriginalPrice =
                    Number(item.product?.price) || itemPrice;
                const qty = item.quantity || 1;

                sub += itemPrice * qty;
                orig += itemOriginalPrice * qty;
                count += qty;
            });

            const savings = orig > sub ? orig - sub : 0;

            return {
                subtotal: sub,
                originalTotal: orig,
                totalSavings: savings,
                totalItemsCount: count,
            };
        }, [items]);

    const shippingCost = subtotal >= 50 ? 0 : 10;
    const isFreeShipping = shippingCost === 0;

    // Form management using Inertia useForm
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        governorate: isArabic ? 'الرياض' : 'Riyadh',
        city: '',
        address: '',
        notes: '',
        payement_method: 'cash_on_delivery',
        shipping_cost: shippingCost,
        discount: 0,
    });

    const grandTotal = Math.max(0, subtotal + shippingCost - data.discount);

    // Submit checkout form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error(
                isArabic
                    ? 'سلة التسوق فارغة، يرجى إضافة منتجات قبل إتمام الطلب.'
                    : 'Your cart is empty. Please add items before checking out.',
            );
            return;
        }

        post('/checkout', {
            preserveScroll: true,
            onError: (errs) => {
                const firstErrorKey = Object.keys(errs)[0];
                if (firstErrorKey) {
                    toast.error(errs[firstErrorKey]);
                } else {
                    toast.error(
                        isArabic
                            ? 'حدث خطأ أثناء معالجة الطلب، يرجى مراجعة البيانات.'
                            : 'Failed to process checkout. Please check the entered fields.',
                    );
                }
            },
        });
    };

    return (
        <UserLayout>
            <Head
                title={
                    isArabic ? 'إتمام الطلب — Shopella' : 'Checkout — Shopella'
                }
            />

            {/* Breadcrumb Navigation */}
            <div className="border-b border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/30">
                <div className="container mx-auto px-4 py-3">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex scrollbar-none items-center overflow-x-auto text-xs whitespace-nowrap text-neutral-500 sm:text-sm"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                        >
                            <Home className="h-3.5 w-3.5" />
                            <span>{t('common.home', 'Home')}</span>
                        </Link>

                        <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />

                        <Link
                            href="/cart/page"
                            className="transition-colors hover:text-primary"
                        >
                            {t('common.cart', 'Cart')}
                        </Link>

                        <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />

                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {isArabic ? 'إتمام الطلب' : 'Checkout'}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Checkout Steps Tracker */}
                <div className="mx-auto mb-10 max-w-xl">
                    <div className="relative flex items-center justify-between">
                        <div className="absolute start-0 end-0 top-1/2 -z-1 h-0.5 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800" />

                        {/* Step 1: Cart */}
                        <Link
                            href="/cart/page"
                            className="group flex cursor-pointer flex-col items-center gap-1.5"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
                                <Check className="h-4 w-4 stroke-[2.5]" />
                            </div>
                            <span className="text-xs font-semibold text-neutral-600 transition-colors group-hover:text-primary dark:text-neutral-400">
                                {isArabic ? 'سلة التسوق' : 'Cart'}
                            </span>
                        </Link>

                        {/* Step 2: Checkout (Active) */}
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm ring-4 ring-primary/20">
                                2
                            </div>
                            <span className="text-xs font-extrabold text-primary">
                                {isArabic ? 'بيانات الشحن والدفع' : 'Checkout'}
                            </span>
                        </div>

                        {/* Step 3: Confirmation */}
                        <div className="flex flex-col items-center gap-1.5 opacity-60">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-500 dark:bg-neutral-800">
                                3
                            </div>
                            <span className="text-xs font-medium text-neutral-500">
                                {isArabic ? 'تأكيد الطلب' : 'Confirmation'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Empty Cart Warning */}
                {items.length === 0 ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200/80 bg-white px-4 py-12 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-neutral-300 dark:text-neutral-600" />
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            {isArabic
                                ? 'سلة التسوق فارغة'
                                : 'Your cart is empty'}
                        </h2>
                        <p className="mb-6 text-sm text-neutral-500">
                            {isArabic
                                ? 'يرجى إضافة منتجات إلى سلة التسوق الخاصة بك قبل المتابعة لإتمام الطلب.'
                                : 'Please add items to your cart before proceeding to checkout.'}
                        </p>
                        <Link href="/shop/page">
                            <Button
                                size="lg"
                                className="gap-2 rounded-xl font-bold"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>
                                    {isArabic
                                        ? 'استكشف المنتجات'
                                        : 'Explore Products'}
                                </span>
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* ACTIVE CHECKOUT LAYOUT */
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* LEFT COLUMN: Checkout Form (7 cols on lg) */}
                        <div className="flex flex-col gap-8 lg:col-span-7">
                            {/* Auth / Guest Banner */}
                            {user ? (
                                <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                            <UserIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-800 dark:text-neutral-200">
                                                {isArabic
                                                    ? 'تم تسجيل الدخول كـ'
                                                    : 'Logged in as'}{' '}
                                                <span className="text-primary">
                                                    {user.name}
                                                </span>
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-white text-[11px] dark:bg-neutral-800"
                                    >
                                        {isArabic
                                            ? 'حساب مسجل'
                                            : 'Registered Member'}
                                    </Badge>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-100/70 p-4 text-xs sm:text-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                                        <Info className="h-4 w-4 shrink-0 text-primary" />
                                        <span>
                                            {isArabic
                                                ? 'طلب سريع كزائر. هل لديك حساب بالفعل؟'
                                                : 'Quick Guest Checkout. Already have an account?'}
                                        </span>
                                    </div>
                                    <Link
                                        href="/login"
                                        className="shrink-0 font-bold text-primary hover:underline"
                                    >
                                        {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                                    </Link>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* 1. Contact Information Card */}
                                <div className="space-y-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                1
                                            </span>
                                            <span>
                                                {isArabic
                                                    ? 'معلومات الاتصال'
                                                    : 'Contact Information'}
                                            </span>
                                        </h3>
                                        <span className="text-xs text-neutral-400">
                                            *{isArabic ? 'مطلوب' : 'Required'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Full Name */}
                                        <div className="sm:col-span-2">
                                            <Label
                                                htmlFor="name"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic
                                                    ? 'الاسم الكامل'
                                                    : 'Full Name'}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="name"
                                                required
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isArabic
                                                        ? 'مثال: محمد عبدالله'
                                                        : 'e.g. John Doe'
                                                }
                                                className="h-11 rounded-xl text-sm"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <Label
                                                htmlFor="email"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic
                                                    ? 'البريد الإلكتروني'
                                                    : 'Email Address'}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="john@example.com"
                                                className="h-11 rounded-xl text-sm"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone Number */}
                                        <div>
                                            <Label
                                                htmlFor="phone"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic
                                                    ? 'رقم الهاتف'
                                                    : 'Phone Number'}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isArabic
                                                        ? '+966 5X XXX XXXX'
                                                        : '+1 (555) 000-0000'
                                                }
                                                className="h-11 rounded-xl font-mono text-sm"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Shipping Address Card */}
                                <div className="space-y-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                2
                                            </span>
                                            <span>
                                                {isArabic
                                                    ? 'عنوان التوصيل'
                                                    : 'Delivery Address'}
                                            </span>
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Governorate / Region */}
                                        <div>
                                            <Label
                                                htmlFor="governorate"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic
                                                    ? 'المنطقة / المحافظة'
                                                    : 'State / Governorate'}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="governorate"
                                                required
                                                value={data.governorate}
                                                onChange={(e) =>
                                                    setData(
                                                        'governorate',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isArabic
                                                        ? 'الرياض، مكة، القاهرة...'
                                                        : 'Region or State'
                                                }
                                                className="h-11 rounded-xl text-sm"
                                            />
                                            {errors.governorate && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.governorate}
                                                </p>
                                            )}
                                        </div>

                                        {/* City */}
                                        <div>
                                            <Label
                                                htmlFor="city"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic ? 'المدينة' : 'City'}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="city"
                                                required
                                                value={data.city}
                                                onChange={(e) =>
                                                    setData(
                                                        'city',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isArabic
                                                        ? 'المدينة أو الحي'
                                                        : 'City or District'
                                                }
                                                className="h-11 rounded-xl text-sm"
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>

                                        {/* Detailed Street Address */}
                                        <div className="sm:col-span-2">
                                            <Label
                                                htmlFor="address"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic
                                                    ? 'العنوان بالتفصيل'
                                                    : 'Detailed Street Address'}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="address"
                                                required
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isArabic
                                                        ? 'اسم الشارع، رقم المبنى، الشقة أو المعلم المميز'
                                                        : 'Street name, building number, apartment/suite'
                                                }
                                                className="h-11 rounded-xl text-sm"
                                            />
                                            {errors.address && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>

                                        {/* Order Notes (Optional) */}
                                        <div className="sm:col-span-2">
                                            <Label
                                                htmlFor="notes"
                                                className="mb-1.5 block text-xs font-semibold"
                                            >
                                                {isArabic
                                                    ? 'ملاحظات إضافية للتوصيل (اختياري)'
                                                    : 'Delivery Notes (Optional)'}
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                rows={2}
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        'notes',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isArabic
                                                        ? 'أي تعليمات خاصة للمندوب أو وقت التوصيل المفضل...'
                                                        : 'Special instructions for delivery courier...'
                                                }
                                                className="resize-y rounded-xl text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Payment Method Card */}
                                <div className="space-y-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                3
                                            </span>
                                            <span>
                                                {isArabic
                                                    ? 'طريقة الدفع'
                                                    : 'Payment Method'}
                                            </span>
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Method 1: Cash on Delivery (COD) */}
                                        <label
                                            className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                                                data.payement_method ===
                                                'cash_on_delivery'
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payement_method"
                                                value="cash_on_delivery"
                                                checked={
                                                    data.payement_method ===
                                                    'cash_on_delivery'
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'payement_method',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 text-primary focus:ring-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                        <Banknote className="h-4 w-4 text-emerald-600" />
                                                        {isArabic
                                                            ? 'الدفع عند الاستلام (نقداً)'
                                                            : 'Cash on Delivery (COD)'}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                                    >
                                                        {isArabic
                                                            ? 'الأكثر طلباً'
                                                            : 'Popular'}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                                    {isArabic
                                                        ? 'ادفع نقداً لمندوب الشحن عند استلام الطلب وفحصه عند باب منزلك.'
                                                        : 'Pay in cash upon doorstep delivery after inspecting your order.'}
                                                </p>
                                            </div>
                                        </label>

                                        {/* Method 2: Credit / Debit Card */}
                                        <label
                                            className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                                                data.payement_method === 'card'
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payement_method"
                                                value="card"
                                                checked={
                                                    data.payement_method ===
                                                    'card'
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'payement_method',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 text-primary focus:ring-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                        <CreditCard className="h-4 w-4 text-primary" />
                                                        {isArabic
                                                            ? 'البطاقات الائتمانية / الخصم'
                                                            : 'Credit / Debit Card'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400">
                                                        <span>VISA</span>
                                                        <span>•</span>
                                                        <span>Mastercard</span>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                                    {isArabic
                                                        ? 'دفع فوري آمن ومشفّر بأعلى معايير الأمان العالمية.'
                                                        : 'Secure and encrypted instant payment via Visa or Mastercard.'}
                                                </p>
                                            </div>
                                        </label>

                                        {/* Method 3: Mada / Local Card */}
                                        <label
                                            className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                                                data.payement_method === 'mada'
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payement_method"
                                                value="mada"
                                                checked={
                                                    data.payement_method ===
                                                    'mada'
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'payement_method',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 text-primary focus:ring-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                                        <span>
                                                            مدى / Mada / الدفع
                                                            الإلكتروني
                                                        </span>
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                                    {isArabic
                                                        ? 'الدفع المباشر عبر بطاقة مدى أو المحافظ الرقمية المحلية.'
                                                        : 'Direct electronic settlement via Mada cards or local digital wallets.'}
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Order Action Button */}
                                <div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={
                                            processing || items.length === 0
                                        }
                                        className="h-14 w-full cursor-pointer gap-3 rounded-2xl text-base font-extrabold shadow-lg transition-all hover:shadow-xl sm:text-lg"
                                    >
                                        <Lock className="h-5 w-5" />
                                        <span>
                                            {processing
                                                ? isArabic
                                                    ? 'جاري تأكيد الطلب...'
                                                    : 'Placing your order...'
                                                : isArabic
                                                  ? `تأكيد الطلب بمبلغ ${grandTotal.toLocaleString()} ${currency}`
                                                  : `Place Order • ${grandTotal.toLocaleString()} ${currency}`}
                                        </span>
                                    </Button>

                                    <p className="mt-3 text-center text-[11px] text-neutral-500">
                                        {isArabic
                                            ? 'بالضغط على "تأكيد الطلب"، فإنك توافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمتجر.'
                                            : 'By clicking "Place Order", you agree to our Terms of Service and Privacy Policy.'}
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: Order Summary Sidebar (5 cols on lg, sticky) */}
                        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-5">
                            <div className="space-y-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800">
                                    <h3 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                                        {isArabic
                                            ? 'ملخص المنتجات'
                                            : 'Order Items'}
                                    </h3>
                                    <Link
                                        href="/cart/page"
                                        className="text-xs font-semibold text-primary hover:underline"
                                    >
                                        {isArabic ? 'تعديل السلة' : 'Edit Cart'}
                                    </Link>
                                </div>

                                {/* Items Mini List */}
                                <div className="max-h-80 scrollbar-thin divide-y divide-neutral-100 overflow-y-auto pe-1 dark:divide-neutral-800">
                                    {items.map((item) => {
                                        const product = item.product;
                                        const itemPrice =
                                            Number(item.price) || 0;
                                        const itemTotal =
                                            itemPrice * item.quantity;

                                        const firstImage =
                                            typeof product?.images?.[0] ===
                                                'object' && product.images[0]
                                                ? product.images[0].image
                                                : typeof product
                                                        ?.images?.[0] ===
                                                    'string'
                                                  ? product.images[0]
                                                  : null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0"
                                            >
                                                {/* Thumbnail with quantity pill */}
                                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200/70 bg-neutral-100 dark:border-neutral-700/60 dark:bg-neutral-800">
                                                    {firstImage ? (
                                                        <img
                                                            src={firstImage}
                                                            alt={
                                                                product?.title ||
                                                                'Product'
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                                            <Package className="h-5 w-5 stroke-[1.25]" />
                                                        </div>
                                                    )}
                                                    <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                                {/* Title & Price */}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-xs font-bold text-neutral-800 sm:text-sm dark:text-neutral-200">
                                                        {product?.title ||
                                                            'Product'}
                                                    </h4>
                                                    <span className="text-[11px] text-neutral-400">
                                                        {item.quantity} ×{' '}
                                                        {itemPrice.toLocaleString()}{' '}
                                                        {currency}
                                                    </span>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-end">
                                                    <span className="text-xs font-extrabold text-neutral-900 sm:text-sm dark:text-neutral-100">
                                                        {itemTotal.toLocaleString()}{' '}
                                                        {currency}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Totals Breakdown */}
                                <div className="space-y-3 border-t border-neutral-200/80 pt-4 text-sm dark:border-neutral-800">
                                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                                        <span>
                                            {isArabic
                                                ? 'المجموع الفرعي'
                                                : 'Items Subtotal'}
                                        </span>
                                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {subtotal.toLocaleString()}{' '}
                                            {currency}
                                        </span>
                                    </div>

                                    {totalSavings > 0 && (
                                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                                            <span>
                                                {isArabic
                                                    ? 'إجمالي الخصم'
                                                    : 'Savings'}
                                            </span>
                                            <span className="font-bold">
                                                -{totalSavings.toLocaleString()}{' '}
                                                {currency}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                                        <span className="flex items-center gap-1.5">
                                            <Truck className="h-4 w-4" />
                                            <span>
                                                {isArabic
                                                    ? 'الشحن'
                                                    : 'Shipping'}
                                            </span>
                                        </span>
                                        <span>
                                            {isFreeShipping ? (
                                                <span className="text-xs font-bold text-emerald-600 uppercase">
                                                    {isArabic
                                                        ? 'مجاني'
                                                        : 'FREE'}
                                                </span>
                                            ) : (
                                                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                                    {shippingCost.toLocaleString()}{' '}
                                                    {currency}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-neutral-500">
                                        <span>
                                            {isArabic
                                                ? 'الضريبة'
                                                : 'Estimated Tax'}
                                        </span>
                                        <span>
                                            {isArabic ? 'مشمولة' : 'Included'}
                                        </span>
                                    </div>

                                    {/* Grand Total */}
                                    <div className="flex items-baseline justify-between border-t border-neutral-200/80 pt-3 dark:border-neutral-800">
                                        <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                            {isArabic
                                                ? 'المبلغ الإجمالي'
                                                : 'Total'}
                                        </span>
                                        <div className="text-end">
                                            <span className="text-2xl font-black text-primary">
                                                {grandTotal.toLocaleString()}
                                            </span>
                                            <span className="ms-1 text-sm font-bold text-primary/80">
                                                {currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Guarantee Cards */}
                                <div className="space-y-3 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                                        <span>
                                            {isArabic
                                                ? 'تشفير آمن وضمان حماية المشتريات 100%'
                                                : '100% Buyer Protection & Encrypted Checkout'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                                        <RotateCcw className="h-4 w-4 shrink-0 text-primary" />
                                        <span>
                                            {isArabic
                                                ? 'إمكانية الاسترجاع والاستبدال خلال 30 يوماً'
                                                : 'Easy returns and exchanges within 30 days'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
