import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Heart,
    Home,
    Lock,
    Minus,
    Package,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Tag,
    Trash2,
    Truck,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import UserLayout from '@/layouts/user-layout';
import { Cart, CartItem } from '@/types/cart';

interface CartPageProps {
    cart?: Cart;
}

export default function CartPage({ cart }: CartPageProps) {
    const { t, isArabic } = useImports();
    const { settings } = useWebsiteSettings();

    // Loading states per item ID to give smooth, instant feedback
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
    const [isClearing, setIsClearing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);

    const items = cart?.items || [];

    // Currency resolution
    const currency = isArabic
        ? settings?.currency_ar || 'ر.س'
        : settings?.currency_en || '$';

    // Total calculations
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

    // Free shipping threshold logic ($50 or 200 in local currency)
    const freeShippingThreshold = 50;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingProgress = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100),
    );
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    // Grand total calculation
    const discountAmount = couponApplied ? couponDiscount : 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    // 1. Manage quantity: Increase
    const handleIncreaseQuantity = (item: CartItem) => {
        const productStock = item.product?.stock ?? 999;
        if (productStock > 0 && item.quantity >= productStock) {
            toast.info(
                isArabic
                    ? `الكمية المتوفرة في المخزون هي ${productStock} فقط.`
                    : `Only ${productStock} units available in stock.`,
            );
            return;
        }

        setLoadingItemId(item.id);
        router.patch(
            `/cart/items/${item.id}`,
            { quantity: item.quantity + 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        isArabic
                            ? 'تم تحديث الكمية بنجاح'
                            : 'Quantity updated successfully',
                    );
                },
                onError: () => {
                    toast.error(
                        isArabic
                            ? 'حدث خطأ أثناء تحديث الكمية'
                            : 'Failed to update quantity',
                    );
                },
                onFinish: () => setLoadingItemId(null),
            },
        );
    };

    // 2. Manage quantity: Decrease
    const handleDecreaseQuantity = (item: CartItem) => {
        if (item.quantity <= 1) {
            // If at 1, decreasing triggers remove
            handleRemoveItem(item);
            return;
        }

        setLoadingItemId(item.id);
        router.patch(
            `/cart/items/${item.id}`,
            { quantity: item.quantity - 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        isArabic
                            ? 'تم تحديث الكمية بنجاح'
                            : 'Quantity updated successfully',
                    );
                },
                onError: () => {
                    toast.error(
                        isArabic
                            ? 'حدث خطأ أثناء تحديث الكمية'
                            : 'Failed to update quantity',
                    );
                },
                onFinish: () => setLoadingItemId(null),
            },
        );
    };

    // 3. Remove product from cart
    const handleRemoveItem = (item: CartItem) => {
        setLoadingItemId(item.id);
        router.delete(`/cart/items/${item.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isArabic
                        ? 'تم إزالة المنتج من سلة التسوق'
                        : 'Product removed from cart',
                );
            },
            onError: () => {
                toast.error(
                    isArabic
                        ? 'حدث خطأ أثناء حذف المنتج'
                        : 'Failed to remove product',
                );
            },
            onFinish: () => setLoadingItemId(null),
        });
    };

    // 4. Clear entire cart
    const handleClearCart = () => {
        if (
            !confirm(
                isArabic
                    ? 'هل أنت متأكد من رغبتك في إفراغ سلة التسوق بالكامل؟'
                    : 'Are you sure you want to clear your entire cart?',
            )
        ) {
            return;
        }

        setIsClearing(true);
        router.delete('/cart/clear', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isArabic
                        ? 'تم إفراغ سلة التسوق بنجاح'
                        : 'Shopping cart cleared successfully',
                );
            },
            onError: () => {
                toast.error(
                    isArabic
                        ? 'حدث خطأ أثناء إفراغ السلة'
                        : 'Failed to clear cart',
                );
            },
            onFinish: () => setIsClearing(false),
        });
    };

    // 5. Apply coupon simulation
    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        if (
            couponCode.trim().toUpperCase() === 'SAVE10' ||
            couponCode.trim().toUpperCase() === 'SHOPELLA'
        ) {
            const discount = Math.round(subtotal * 0.1);
            setCouponDiscount(discount);
            setCouponApplied(true);
            toast.success(
                isArabic
                    ? `تم تطبيق كود الخصم! وفرت 10% (${discount.toLocaleString()} ${currency})`
                    : `Coupon applied! You saved 10% (${discount.toLocaleString()} ${currency})`,
            );
        } else {
            toast.error(
                isArabic
                    ? 'كود الخصم غير صالح أو منتهي الصلاحية'
                    : 'Invalid or expired coupon code',
            );
        }
    };

    return (
        <UserLayout>
            <Head
                title={
                    isArabic
                        ? 'سلة التسوق — Shopella'
                        : 'Shopping Cart — Shopella'
                }
            />

            {/* Breadcrumbs Navigation */}
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
                            href="/shop/page"
                            className="transition-colors hover:text-primary"
                        >
                            {t('common.shop', 'Shop')}
                        </Link>

                        <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />

                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {t('common.cart', 'Shopping Cart')}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Page Title & Count */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-neutral-50">
                            <span>
                                {isArabic ? 'سلة التسوق' : 'Shopping Cart'}
                            </span>
                            <Badge
                                variant="secondary"
                                className="rounded-full px-2.5 py-0.5 text-xs font-bold sm:text-sm"
                            >
                                {totalItemsCount}{' '}
                                {isArabic
                                    ? 'منتج'
                                    : totalItemsCount === 1
                                      ? 'item'
                                      : 'items'}
                            </Badge>
                        </h1>
                        <p className="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                            {isArabic
                                ? 'راجع المنتجات في سلتك وقم بإدارتها قبل إتمام عملية الدفع.'
                                : 'Review and manage your selected items before proceeding to checkout.'}
                        </p>
                    </div>

                    {items.length > 0 && (
                        <Link
                            href="/shop/page"
                            className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-primary hover:underline sm:self-auto sm:text-sm"
                        >
                            {isArabic ? (
                                <>
                                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                                    <span>متابعة التسوق</span>
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Continue Shopping</span>
                                </>
                            )}
                        </Link>
                    )}
                </div>

                {/* EMPTY CART STATE */}
                {items.length === 0 ? (
                    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner sm:h-28 sm:w-28">
                            <ShoppingBag className="h-12 w-12 stroke-[1.5] sm:h-14 sm:w-14" />
                        </div>

                        <h2 className="mb-3 text-2xl font-extrabold text-neutral-900 sm:text-3xl dark:text-neutral-100">
                            {isArabic
                                ? 'سلة التسوق فارغة حالياً'
                                : 'Your cart is empty'}
                        </h2>

                        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
                            {isArabic
                                ? 'يبدو أنك لم تقم بإضافة أي منتج إلى سلتك بعد. استكشف تشكيلتنا الواسعة وابدأ تجربة التسوق الآن!'
                                : "Looks like you haven't added anything to your cart yet. Explore our top products and find great deals!"}
                        </p>

                        <Link href="/shop/page">
                            <Button
                                size="lg"
                                className="h-12 cursor-pointer gap-2 rounded-xl px-8 text-base font-bold shadow-md transition-all hover:shadow-lg"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                <span>
                                    {isArabic
                                        ? 'ابدأ التسوق الآن'
                                        : 'Start Shopping Now'}
                                </span>
                            </Button>
                        </Link>

                        {/* Perks Under Empty State */}
                        <div className="mt-16 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-10 text-center sm:grid-cols-3 dark:border-neutral-800">
                            <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900/40">
                                <Truck className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    {isArabic
                                        ? 'شحن سريع ومجاني'
                                        : 'Free Express Delivery'}
                                </span>
                                <span className="mt-0.5 text-[11px] text-neutral-500">
                                    {isArabic
                                        ? 'للطلبات فوق 50$'
                                        : 'On orders over $50'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900/40">
                                <RotateCcw className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    {isArabic
                                        ? 'استرجاع سهل 30 يوم'
                                        : '30-Day Easy Returns'}
                                </span>
                                <span className="mt-0.5 text-[11px] text-neutral-500">
                                    {isArabic
                                        ? 'ضمان استرجاع بدون متاعب'
                                        : 'Hassle-free guarantee'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900/40">
                                <ShieldCheck className="mb-2 h-6 w-6 text-emerald-500" />
                                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    {isArabic
                                        ? 'دفع آمن 100%'
                                        : '100% Secure Checkout'}
                                </span>
                                <span className="mt-0.5 text-[11px] text-neutral-500">
                                    {isArabic
                                        ? 'تشفير وحماية تامة'
                                        : '256-bit SSL encrypted'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ACTIVE CART LAYOUT */
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                        {/* LEFT COLUMN: Cart Items & Actions (8 cols on lg) */}
                        <div className="flex flex-col gap-6 lg:col-span-8">
                            {/* Free Shipping Progress Card */}
                            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="mb-2.5 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                                            <Truck className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-bold text-neutral-800 sm:text-sm dark:text-neutral-200">
                                            {isFreeShipping
                                                ? isArabic
                                                    ? 'تهانينا! لقد حصلت على شحن مجاني لهذا الطلب!'
                                                    : "Congratulations! You've unlocked FREE Shipping!"
                                                : isArabic
                                                  ? `أضف ${amountToFreeShipping.toFixed(2)} ${currency} إضافية للحصول على شحن مجاني!`
                                                  : `Add ${amountToFreeShipping.toFixed(2)} ${currency} more to qualify for FREE Shipping!`}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-primary">
                                        {shippingProgress}%
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isFreeShipping
                                                ? 'bg-emerald-500'
                                                : 'bg-primary'
                                        }`}
                                        style={{
                                            width: `${shippingProgress}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Cart Items Container */}
                            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                {/* Desktop Table Header */}
                                <div className="hidden gap-4 border-b border-neutral-200/80 bg-neutral-50/80 px-6 py-3.5 text-xs font-bold tracking-wider text-neutral-500 uppercase md:grid md:grid-cols-12 dark:border-neutral-800 dark:bg-neutral-800/40">
                                    <div className="col-span-6">
                                        {isArabic ? 'المنتج' : 'Product'}
                                    </div>
                                    <div className="col-span-2 text-center">
                                        {isArabic ? 'السعر' : 'Price'}
                                    </div>
                                    <div className="col-span-2 text-center">
                                        {isArabic ? 'الكمية' : 'Quantity'}
                                    </div>
                                    <div className="col-span-2 text-end">
                                        {isArabic ? 'الإجمالي' : 'Subtotal'}
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                                    {items.map((item) => {
                                        const product = item.product;
                                        const itemPrice =
                                            Number(item.price) || 0;
                                        const originalPrice =
                                            Number(product?.price) || itemPrice;
                                        const hasDiscount =
                                            originalPrice > itemPrice;
                                        const itemSubtotal =
                                            itemPrice * item.quantity;
                                        const isItemLoading =
                                            loadingItemId === item.id;

                                        // Image extraction
                                        const firstImage =
                                            typeof product?.images?.[0] ===
                                                'object' && product.images[0]
                                                ? product.images[0].image
                                                : typeof product
                                                        ?.images?.[0] ===
                                                    'string'
                                                  ? product.images[0]
                                                  : null;

                                        const categoryName = isArabic
                                            ? product?.category?.name_ar
                                            : product?.category?.name_en ||
                                              product?.category?.name_ar;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`p-4 transition-opacity sm:p-6 ${
                                                    isItemLoading
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }`}
                                            >
                                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                                                    {/* 1. Product Image & Details (6 cols on md) */}
                                                    <div className="col-span-1 flex items-center gap-4 md:col-span-6">
                                                        {/* Product Thumbnail */}
                                                        <Link
                                                            href={
                                                                product?.slug
                                                                    ? `/product/${product.slug}/details`
                                                                    : '#'
                                                            }
                                                            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200/70 bg-neutral-100 sm:h-24 sm:w-24 dark:border-neutral-700/60 dark:bg-neutral-800"
                                                        >
                                                            {firstImage ? (
                                                                <img
                                                                    src={
                                                                        firstImage
                                                                    }
                                                                    alt={
                                                                        product?.title ||
                                                                        'Product'
                                                                    }
                                                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                                                    <Package className="h-8 w-8 stroke-[1.25]" />
                                                                </div>
                                                            )}
                                                        </Link>

                                                        {/* Title & Metadata */}
                                                        <div className="flex min-w-0 flex-col gap-1">
                                                            {categoryName && (
                                                                <span className="truncate text-[11px] font-semibold text-primary/80">
                                                                    {
                                                                        categoryName
                                                                    }
                                                                </span>
                                                            )}

                                                            <Link
                                                                href={
                                                                    product?.slug
                                                                        ? `/product/${product.slug}/details`
                                                                        : '#'
                                                                }
                                                                className="line-clamp-2 text-sm font-bold text-neutral-900 transition-colors hover:text-primary sm:text-base dark:text-neutral-100"
                                                            >
                                                                {product?.title ||
                                                                    'Product'}
                                                            </Link>

                                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                                {product?.sku && (
                                                                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-800">
                                                                        SKU:{' '}
                                                                        {
                                                                            product.sku
                                                                        }
                                                                    </span>
                                                                )}

                                                                {product?.stock !==
                                                                    undefined &&
                                                                    product.stock >
                                                                        0 &&
                                                                    product.stock <=
                                                                        5 && (
                                                                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-950/40">
                                                                            {isArabic
                                                                                ? `متبقي ${product.stock} فقط!`
                                                                                : `Only ${product.stock} left!`}
                                                                        </span>
                                                                    )}
                                                            </div>

                                                            {/* Mobile Only: Unit Price Display */}
                                                            <div className="mt-2 flex items-baseline gap-2 md:hidden">
                                                                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                                    {itemPrice.toLocaleString()}{' '}
                                                                    {currency}
                                                                </span>
                                                                {hasDiscount && (
                                                                    <span className="text-xs text-neutral-400 line-through">
                                                                        {originalPrice.toLocaleString()}{' '}
                                                                        {
                                                                            currency
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 2. Desktop Unit Price (2 cols on md) */}
                                                    <div className="hidden flex-col items-center justify-center md:col-span-2 md:flex">
                                                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                            {itemPrice.toLocaleString()}{' '}
                                                            {currency}
                                                        </span>
                                                        {hasDiscount && (
                                                            <span className="mt-0.5 text-xs text-neutral-400 line-through">
                                                                {originalPrice.toLocaleString()}{' '}
                                                                {currency}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* 3. Quantity Controller (2 cols on md) */}
                                                    <div className="col-span-1 mt-2 flex items-center justify-between gap-4 md:col-span-2 md:mt-0 md:justify-center">
                                                        <span className="text-xs font-semibold text-neutral-500 md:hidden">
                                                            {isArabic
                                                                ? 'الكمية:'
                                                                : 'Quantity:'}
                                                        </span>

                                                        <div className="inline-flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-800">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isItemLoading
                                                                }
                                                                onClick={() =>
                                                                    handleDecreaseQuantity(
                                                                        item,
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                                                aria-label="Decrease quantity"
                                                                title={
                                                                    item.quantity ===
                                                                    1
                                                                        ? isArabic
                                                                            ? 'حذف المنتج'
                                                                            : 'Remove item'
                                                                        : undefined
                                                                }
                                                            >
                                                                {item.quantity ===
                                                                1 ? (
                                                                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                                                ) : (
                                                                    <Minus className="h-3.5 w-3.5" />
                                                                )}
                                                            </button>

                                                            <span className="w-9 text-center text-xs font-bold text-neutral-800 select-none sm:w-10 sm:text-sm dark:text-neutral-200">
                                                                {item.quantity}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isItemLoading ||
                                                                    (product?.stock !==
                                                                        undefined &&
                                                                        product.stock >
                                                                            0 &&
                                                                        item.quantity >=
                                                                            product.stock)
                                                                }
                                                                onClick={() =>
                                                                    handleIncreaseQuantity(
                                                                        item,
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* 4. Subtotal & Remove Action (2 cols on md) */}
                                                    <div className="col-span-1 mt-2 flex items-center justify-between gap-3 md:col-span-2 md:mt-0 md:justify-end">
                                                        <span className="text-xs font-semibold text-neutral-500 md:hidden">
                                                            {isArabic
                                                                ? 'الإجمالي:'
                                                                : 'Subtotal:'}
                                                        </span>

                                                        <div className="flex items-center gap-3">
                                                            <div className="text-end">
                                                                <span className="text-sm font-extrabold text-primary sm:text-base">
                                                                    {itemSubtotal.toLocaleString()}{' '}
                                                                    {currency}
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isItemLoading
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        item,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                                                aria-label="Remove item from cart"
                                                                title={
                                                                    isArabic
                                                                        ? 'إزالة المنتج'
                                                                        : 'Remove item'
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Cart Table Footer: Clear Cart & Shopping Link */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 bg-neutral-50/60 p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-800/40">
                                    <Link
                                        href="/shop/page"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:text-primary sm:text-sm dark:text-neutral-300"
                                    >
                                        {isArabic ? (
                                            <>
                                                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                                                <span>متابعة التسوق</span>
                                            </>
                                        ) : (
                                            <>
                                                <ArrowLeft className="h-4 w-4" />
                                                <span>Continue Shopping</span>
                                            </>
                                        )}
                                    </Link>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isClearing}
                                        onClick={handleClearCart}
                                        className="cursor-pointer gap-1.5 rounded-xl border-neutral-300 text-xs font-semibold text-neutral-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-neutral-700 dark:text-neutral-300"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-neutral-500 hover:text-red-600" />
                                        <span>
                                            {isClearing
                                                ? isArabic
                                                    ? 'جاري الإفراغ...'
                                                    : 'Clearing...'
                                                : isArabic
                                                  ? 'إفراغ السلة'
                                                  : 'Clear Cart'}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Order Summary & Checkout (4 cols on lg) */}
                        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-4">
                            <div className="space-y-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <h2 className="border-b border-neutral-200/80 pb-4 text-xl font-extrabold text-neutral-900 dark:border-neutral-800 dark:text-neutral-100">
                                    {isArabic ? 'ملخص الطلب' : 'Order Summary'}
                                </h2>

                                {/* Breakdown List */}
                                <div className="space-y-3.5 text-sm">
                                    {/* Items Subtotal */}
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

                                    {/* Savings if on sale */}
                                    {totalSavings > 0 && (
                                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                                            <span className="flex items-center gap-1">
                                                <Tag className="h-3.5 w-3.5" />
                                                <span>
                                                    {isArabic
                                                        ? 'إجمالي الخصم'
                                                        : 'Savings'}
                                                </span>
                                            </span>
                                            <span className="font-bold">
                                                -{totalSavings.toLocaleString()}{' '}
                                                {currency}
                                            </span>
                                        </div>
                                    )}

                                    {/* Coupon Discount */}
                                    {couponApplied && couponDiscount > 0 && (
                                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                                            <span className="flex items-center gap-1">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span>
                                                    {isArabic
                                                        ? 'خصم الكوبون (10%)'
                                                        : 'Coupon Discount (10%)'}
                                                </span>
                                            </span>
                                            <span className="font-bold">
                                                -
                                                {couponDiscount.toLocaleString()}{' '}
                                                {currency}
                                            </span>
                                        </div>
                                    )}

                                    {/* Shipping */}
                                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                                        <span className="flex items-center gap-1">
                                            <Truck className="h-3.5 w-3.5" />
                                            <span>
                                                {isArabic
                                                    ? 'الشحن'
                                                    : 'Shipping'}
                                            </span>
                                        </span>
                                        <span>
                                            {isFreeShipping ? (
                                                <span className="text-xs font-bold text-emerald-600 uppercase dark:text-emerald-400">
                                                    {isArabic
                                                        ? 'مجاني'
                                                        : 'FREE'}
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {isArabic
                                                        ? 'يحسب عند الدفع'
                                                        : 'Calculated at checkout'}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Taxes */}
                                    <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                                        <span>
                                            {isArabic
                                                ? 'الضريبة المضافة'
                                                : 'Taxes (VAT)'}
                                        </span>
                                        <span className="text-neutral-500">
                                            {isArabic
                                                ? 'مشمولة في الأسعار'
                                                : 'Included in prices'}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-neutral-200/80 pt-3 dark:border-neutral-800" />

                                    {/* Final Total */}
                                    <div className="flex items-baseline justify-between text-base font-black text-neutral-900 sm:text-lg dark:text-neutral-100">
                                        <span>
                                            {isArabic
                                                ? 'الإجمالي النهائي'
                                                : 'Order Total'}
                                        </span>
                                        <div className="text-end">
                                            <span className="text-2xl font-black text-primary">
                                                {finalTotal.toLocaleString()}
                                            </span>
                                            <span className="ms-1 text-sm font-bold text-primary/80">
                                                {currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Code Box */}
                                <form
                                    onSubmit={handleApplyCoupon}
                                    className="border-t border-neutral-200/80 pt-2 dark:border-neutral-800"
                                >
                                    <label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        {isArabic
                                            ? 'هل لديك كود خصم؟'
                                            : 'Have a promo code?'}
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value)
                                            }
                                            placeholder={
                                                isArabic
                                                    ? 'أدخل الكود (مثال: SAVE10)'
                                                    : 'e.g. SAVE10'
                                            }
                                            className="h-10 rounded-xl text-xs uppercase"
                                        />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="h-10 shrink-0 cursor-pointer rounded-xl px-4 text-xs font-bold"
                                        >
                                            {isArabic ? 'تطبيق' : 'Apply'}
                                        </Button>
                                    </div>
                                    {couponApplied && (
                                        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>
                                                {isArabic
                                                    ? 'تم تفعيل كود الخصم بنجاح!'
                                                    : 'Promo code applied!'}
                                            </span>
                                        </p>
                                    )}
                                </form>

                                {/* Proceed to Checkout CTA */}
                                <Link href="/checkout/page" className="block">
                                    <Button
                                        size="lg"
                                        className="h-12 w-full cursor-pointer gap-2 rounded-xl text-base font-bold shadow-md transition-all hover:shadow-lg"
                                    >
                                        <Lock className="h-4 w-4" />
                                        <span>
                                            {isArabic
                                                ? 'المتابعة لإتمام الطلب'
                                                : 'Proceed to Checkout'}
                                        </span>
                                    </Button>
                                </Link>

                                {/* Trust Badges */}
                                <div className="space-y-2.5 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                                        <span>
                                            {isArabic
                                                ? 'دفع آمن ومشفّر بتقنية SSL 256-bit'
                                                : 'Safe & Secure 256-bit SSL encrypted checkout'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <RotateCcw className="h-4 w-4 shrink-0 text-primary" />
                                        <span>
                                            {isArabic
                                                ? 'ضمان استرجاع الأموال لمدة 30 يوماً'
                                                : '30-day money-back satisfaction guarantee'}
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
