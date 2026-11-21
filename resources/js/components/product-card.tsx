import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Eye,
  Heart,
  Package,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { t, isArabic } = useImports();
  const { settings } = useWebsiteSettings();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Extract images
  const firstImage =
    typeof product.images?.[0] === 'object' && product.images[0]
      ? product.images[0].image
      : typeof product.images?.[0] === 'string'
        ? product.images[0]
        : null;

  const secondImage =
    typeof product.images?.[1] === 'object' && product.images[1]
      ? product.images[1].image
      : typeof product.images?.[1] === 'string'
        ? product.images[1]
        : null;

  // Price calculations
  const price = Number(product.price) || 0;
  const salePrice =
    product.sale_price !== null && product.sale_price !== undefined
      ? Number(product.sale_price)
      : null;
  const hasDiscount = salePrice !== null && salePrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  // Stock status
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Category and Brand
  const categoryName = isArabic
    ? product.category?.name_ar
    : product.category?.name_en || product.category?.name_ar;
  const brandName = product.brandModel?.name || product.brand;

  // Currency
  const currency = isArabic
    ? settings?.currency_ar || 'ر.س'
    : settings?.currency_en || '$';

  const productUrl = `/product/${product.slug}/details`;

  return (
    <div
      className={`group relative bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      {/* 1. Image & Badges Container */}
      <div className="relative aspect-square w-full bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden">
        {/* Clickable Image Layer */}
        <Link href={productUrl} className="block w-full h-full">
          {firstImage ? (
            <div className="relative w-full h-full overflow-hidden">
              {/* Primary Image */}
              <img
                src={firstImage}
                alt={product.title}
                className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
                  secondImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                }`}
                loading="lazy"
              />

              {/* Secondary Image on Hover */}
              {secondImage && (
                <img
                  src={secondImage}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  loading="lazy"
                />
              )}
            </div>
          ) : (
            /* Modern Fallback Pattern */
            <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 text-neutral-400 p-4">
              <Package className="w-12 h-12 stroke-[1.25] text-neutral-300 dark:text-neutral-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs font-medium text-neutral-500 line-clamp-1 text-center">
                {categoryName || product.title}
              </span>
            </div>
          )}
        </Link>

        {/* Top Badges (Discount, Featured, Best Seller) */}
        <div className="absolute top-2.5 start-2.5 flex flex-col items-start gap-1.5 pointer-events-none z-10">
          {hasDiscount && (
            <Badge className="bg-red-500 hover:bg-red-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-sm border-0">
              -{discountPercent}%
            </Badge>
          )}

          {product.is_featured && !hasDiscount && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm border-0 gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{t('home_products.featured', 'Featured')}</span>
            </Badge>
          )}

          {product.is_popular && (
            <Badge className="bg-primary hover:bg-primary text-primary-foreground font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm border-0">
              {t('home_products.popular', 'Popular')}
            </Badge>
          )}
        </div>

        {/* Floating Action Buttons (Wishlist & Quick View) */}
        <div className="absolute top-2.5 end-2.5 flex flex-col items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted((prev) => !prev);
            }}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md cursor-pointer ${
              isWishlisted
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/80 dark:bg-neutral-800/80 hover:bg-white text-neutral-600 hover:text-red-500'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-current' : ''}`}
            />
          </button>

          <Link
            href={productUrl}
            aria-label="View product details"
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 hover:bg-white text-neutral-600 hover:text-primary flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-15 pointer-events-none">
            <span className="bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              {t('home_products.out_of_stock', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>

      {/* 2. Content & Price */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Brand Metadata */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            {categoryName && (
              <span className="font-medium hover:text-primary transition-colors truncate max-w-[60%]">
                {categoryName}
              </span>
            )}
            {brandName && (
              <span className="font-semibold text-neutral-600 dark:text-neutral-300 truncate max-w-[40%]">
                {brandName}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={productUrl} className="block group/title">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover/title:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Low Stock Warning */}
          {isLowStock && (
            <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
              {t('home_products.low_stock', `Only {{count}} left in stock`, {
                count: product.stock,
              })}
            </p>
          )}
        </div>

        {/* Price & Rating */}
        <div className="pt-2 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              {hasDiscount ? (
                <>
                  <span className="text-base sm:text-lg font-extrabold text-primary">
                    {salePrice?.toFixed(2)} {currency}
                  </span>
                  <span className="text-xs text-neutral-400 line-through">
                    {price.toFixed(2)} {currency}
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                  {price.toFixed(2)} {currency}
                </span>
              )}
            </div>

            {/* Subtle Rating */}
            <div className="flex items-center gap-1 text-[11px] text-amber-500 shrink-0 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Add to Cart Button Footer */}
      <div className="px-4 pb-4 pt-1">
        <Link href={productUrl} className="block w-full">
          <Button
            size="sm"
            disabled={isOutOfStock}
            className="w-full h-10 rounded-xl font-bold text-xs sm:text-sm gap-2 shadow-xs group-hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? t('home_products.out_of_stock', 'Out of Stock')
                : t('home_products.add_to_cart', 'Add to Cart')}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
