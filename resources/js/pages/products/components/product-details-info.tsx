import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Check,
    Copy,
    Facebook,
    Heart,
    HelpCircle,
    Minus,
    Package,
    Plus,
    RotateCcw,
    Share2,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Tag,
    Truck,
    Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import { Product } from '@/types/product';

interface ProductDetailsInfoProps {
    product: Product;
    onOpenReviews?: () => void;
}

export default function ProductDetailsInfo({
    product,
    onOpenReviews,
}: ProductDetailsInfoProps) {
    const { t, isArabic } = useImports();
    const { settings } = useWebsiteSettings();

    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [copiedSku, setCopiedSku] = useState(false);

    // Price calculations
    const priceNum = Number(product.price) || 0;
    const salePriceNum =
        product.sale_price !== null && product.sale_price !== undefined
            ? Number(product.sale_price)
            : null;
    const hasDiscount = salePriceNum !== null && salePriceNum < priceNum;
    const currentPrice =
        hasDiscount && salePriceNum !== null ? salePriceNum : priceNum;
    const discountPercent = hasDiscount
        ? Math.round(((priceNum - salePriceNum) / priceNum) * 100)
        : 0;
    const savingsAmount = hasDiscount
        ? (priceNum - salePriceNum).toFixed(2)
        : '0';

    // Currency
    const currency = isArabic
        ? settings?.currency_ar || 'ر.س'
        : settings?.currency_en || '$';

    // Stock status
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    // Category and Brand
    const categoryName = isArabic
        ? product.category?.name_ar
        : product.category?.name_en || product.category?.name_ar;

    const brandName =
        product.brandModel?.name || product.brand_model?.name || product.brand;

    // Handle quantity changes
    const handleIncrease = () => {
        if (quantity < product.stock) {
            setQuantity((prev) => prev + 1);
        } else {
            toast.info(
                t(
                    'products.max_stock_reached',
                    'Maximum available quantity reached',
                ),
            );
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    // Copy SKU
    const handleCopySku = () => {
        if (!product.sku) return;
        navigator.clipboard.writeText(product.sku);
        setCopiedSku(true);
        toast.success(t('products.sku_copied', 'SKU copied to clipboard'));
        setTimeout(() => setCopiedSku(false), 2000);
    };

    // Share product
    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description || product.title,
                    url,
                });
                return;
            } catch (err) {
                // Fallback to clipboard
            }
        }
        navigator.clipboard.writeText(url);
        toast.success(
            t('products.link_copied', 'Product link copied to clipboard!'),
        );
    };

    // Toggle wishlist
    const handleToggleWishlist = () => {
        setIsWishlisted((prev) => {
            const next = !prev;
            if (next) {
                toast.success(
                    t('products.added_to_wishlist', 'Added to your wishlist'),
                );
            } else {
                toast.info(
                    t(
                        'products.removed_from_wishlist',
                        'Removed from your wishlist',
                    ),
                );
            }
            return next;
        });
    };

    // Add to cart simulation
    const handleAddToCart = () => {
        if (isOutOfStock) return;
        toast.success(
            t('common.product_added', 'Product added to cart successfully!'),
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* 1. Header Metadata: Category, Brand, Stock Status */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                    {categoryName && (
                        <Link
                            href={
                                product.category
                                    ? `/categories?category=${product.category.slug}`
                                    : '#'
                            }
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                            <Tag className="h-3 w-3" />
                            <span>{categoryName}</span>
                        </Link>
                    )}

                    {brandName && (
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                            {t('common.brand')}:{' '}
                            <strong className="text-neutral-800 dark:text-neutral-200">
                                {brandName}
                            </strong>
                        </span>
                    )}
                </div>

                {/* Stock Badge */}
                <div>
                    {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            {t('common.stockout', 'Out of Stock')}
                        </span>
                    ) : isLowStock ? (
                        <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            {t(
                                'products.low_stock',
                                `Only ${product.stock} left in stock!`,
                            )}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {t('common.stockin', 'In Stock')}
                        </span>
                    )}
                </div>
            </div>

            {/* 2. Product Title */}
            <div>
                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-neutral-50">
                    {product.title}
                </h1>

                {/* Rating summary & Review anchor */}
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className="h-4 w-4 fill-amber-400 stroke-[1.5] text-amber-400"
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        5.0
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">
                        |
                    </span>
                    <button
                        type="button"
                        onClick={onOpenReviews}
                        className="cursor-pointer text-sm font-medium text-primary hover:underline"
                    >
                        {t('products.customer_reviews', 'Reviews (0)')}
                    </button>
                    <span className="text-neutral-300 dark:text-neutral-700">
                        |
                    </span>
                    <button
                        type="button"
                        onClick={onOpenReviews}
                        className="cursor-pointer text-xs text-neutral-500 transition-colors hover:text-primary"
                    >
                        {t('products.write_review', 'Write a review')}
                    </button>
                </div>
            </div>

            {/* 3. Pricing Section */}
            <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex flex-wrap items-baseline gap-3">
                    <div className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                        <span>{currentPrice.toLocaleString()}</span>
                        <span className="ms-1 text-lg font-bold text-primary/80 sm:text-xl">
                            {currency}
                        </span>
                    </div>

                    {hasDiscount && (
                        <>
                            <div className="text-lg font-semibold text-neutral-400 line-through sm:text-xl">
                                <span>{priceNum.toLocaleString()}</span>
                                <span className="ms-1">{currency}</span>
                            </div>
                            <Badge className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-xs hover:bg-red-500">
                                {t('products.save', 'Save')} {discountPercent}%
                                ({savingsAmount} {currency})
                            </Badge>
                        </>
                    )}
                </div>

                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {t(
                        'products.tax_included',
                        'Tax included. Free shipping available on qualifying orders.',
                    )}
                </p>
            </div>

            {/* 4. Short Description */}
            {product.description && (
                <div className="border-s-2 border-primary/40 py-0.5 ps-4 text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300">
                    {product.description}
                </div>
            )}

            {/* 5. Product Key Identifiers (SKU, Type, Kind) */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                {product.sku && (
                    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200/60 bg-neutral-100/60 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40">
                        <span className="font-medium text-neutral-500">
                            SKU
                        </span>
                        <div className="flex items-center justify-between gap-1">
                            <span className="truncate font-mono font-bold text-neutral-800 dark:text-neutral-200">
                                {product.sku}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopySku}
                                className="p-1 text-neutral-500 transition-colors hover:text-primary"
                                title={t('common.copy', 'Copy SKU')}
                            >
                                {copiedSku ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-1 rounded-xl border border-neutral-200/60 bg-neutral-100/60 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40">
                    <span className="font-medium text-neutral-500">
                        {t('common.product-kind', 'Product Kind')}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-neutral-800 capitalize dark:text-neutral-200">
                        <Package className="h-3.5 w-3.5 text-primary" />
                        {product.product_kind === 'physical'
                            ? t('common.physical-product', 'Physical')
                            : t('common.digital-product', 'Digital')}
                    </span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-neutral-200/60 bg-neutral-100/60 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40">
                    <span className="font-medium text-neutral-500">
                        {t('products.type', 'Type')}
                    </span>
                    <span className="font-bold text-neutral-800 capitalize dark:text-neutral-200">
                        {product.product_type}
                    </span>
                </div>
            </div>

            {/* 6. Quantity Selector & Action Buttons */}
            <div className="flex flex-col gap-4 pt-2">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {t('common.quantity')}:
                    </Label>
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-800">
                        <button
                            type="button"
                            disabled={quantity <= 1 || isOutOfStock}
                            onClick={handleDecrease}
                            className="flex h-10 w-10 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-neutral-800 select-none dark:text-neutral-200">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            disabled={quantity >= product.stock || isOutOfStock}
                            onClick={handleIncrease}
                            className="flex h-10 w-10 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <span className="text-xs text-neutral-500">
                        {product.stock > 0
                            ? `${product.stock} ${t('products.available', 'available')}`
                            : t('common.stockout', 'Out of stock')}
                    </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                    {/* Add to Cart */}
                    <Button
                        size="lg"
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                        className="h-12 flex-1 cursor-pointer gap-2.5 rounded-xl text-base font-bold shadow-md transition-all hover:shadow-lg"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <span>{t('common.add_to_cart')}</span>
                    </Button>

                    {/* Buy Now */}
                    <Link
                        href="/checkout"
                        className={`flex-1 ${isOutOfStock ? 'pointer-events-none' : ''}`}
                    >
                        <Button
                            size="lg"
                            variant="secondary"
                            disabled={isOutOfStock}
                            className="h-12 w-full cursor-pointer gap-2 rounded-xl border border-neutral-300 text-base font-bold transition-all hover:bg-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        >
                            <Zap className="h-5 w-5 fill-amber-500 text-amber-500" />
                            <span>{t('common.buy_now')}</span>
                        </Button>
                    </Link>

                    {/* Wishlist button */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleToggleWishlist}
                        className={`h-12 w-12 shrink-0 rounded-xl border-neutral-300 transition-all dark:border-neutral-700 ${
                            isWishlisted
                                ? 'border-red-300 bg-red-50 text-red-500 dark:bg-red-950/40'
                                : 'text-neutral-600 hover:text-red-500'
                        }`}
                        aria-label="Add to wishlist"
                    >
                        <Heart
                            className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`}
                        />
                    </Button>

                    {/* Share button */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleShare}
                        className="h-12 w-12 shrink-0 rounded-xl border-neutral-300 text-neutral-600 transition-all hover:text-primary dark:border-neutral-700"
                        aria-label="Share product"
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* 7. Trust & Guarantee Badges */}
            <div className="grid grid-cols-2 gap-3 border-t border-neutral-200 pt-4 sm:grid-cols-4 dark:border-neutral-800">
                <div className="flex flex-col items-center rounded-xl border border-neutral-200/50 bg-neutral-50/80 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
                    <Truck className="mb-1.5 h-5 w-5 text-primary" />
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {t('common.free_shipping', 'Free Shipping')}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                        {t('products.shipping_sub', 'Orders over 50$')}
                    </span>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-neutral-200/50 bg-neutral-50/80 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
                    <ShieldCheck className="mb-1.5 h-5 w-5 text-emerald-500" />
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {t('products.genuine', '100% Genuine')}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                        {t('products.genuine_sub', 'Authentic products')}
                    </span>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-neutral-200/50 bg-neutral-50/80 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
                    <RotateCcw className="mb-1.5 h-5 w-5 text-primary" />
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {t('products.returns', 'Easy Returns')}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                        {t('products.returns_sub', '30-Day guarantee')}
                    </span>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-neutral-200/50 bg-neutral-50/80 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
                    <Sparkles className="mb-1.5 h-5 w-5 text-amber-500" />
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {t('products.secure', 'Secure Checkout')}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                        {t('products.secure_sub', '256-bit SSL encrypted')}
                    </span>
                </div>
            </div>
        </div>
    );
}
