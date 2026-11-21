import React, { useMemo } from 'react';
import ImageGallery, { GalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/image-gallery.css';
import { Package, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import useImports from '@/hooks/use-imports';
import { Product, ProductImage } from '@/types/product';

interface ProductGalleryProps {
    product?: Product;
    images?: ProductImage[] | string[];
    title?: string;
    hasDiscount?: boolean;
    discountPercent?: number;
    isFeatured?: boolean;
    isPopular?: boolean;
    isOutOfStock?: boolean;
    className?: string;
}

export default function ProductGallery({
    product,
    images: propImages,
    title: propTitle,
    hasDiscount: propHasDiscount,
    discountPercent: propDiscountPercent,
    isFeatured: propIsFeatured,
    isPopular: propIsPopular,
    isOutOfStock: propIsOutOfStock,
    className = '',
}: ProductGalleryProps) {
    const { t } = useImports();

    // Resolve values either from product object or individual props
    const rawImages = propImages ?? product?.images ?? [];
    const title = propTitle ?? product?.title ?? 'Product';

    const priceNum = Number(product?.price) || 0;
    const salePriceNum =
        product?.sale_price !== null && product?.sale_price !== undefined
            ? Number(product.sale_price)
            : null;
    const computedHasDiscount =
        salePriceNum !== null && salePriceNum < priceNum;
    const computedDiscountPercent = computedHasDiscount
        ? Math.round(((priceNum - salePriceNum) / priceNum) * 100)
        : 0;

    const hasDiscount = propHasDiscount ?? computedHasDiscount;
    const discountPercent = propDiscountPercent ?? computedDiscountPercent;
    const isFeatured = propIsFeatured ?? Boolean(product?.is_featured);
    const isPopular = propIsPopular ?? Boolean(product?.is_popular);
    const isOutOfStock =
        propIsOutOfStock ?? (product !== undefined && product.stock <= 0);

    // Transform images into react-image-gallery items
    const galleryItems: GalleryItem[] = useMemo(() => {
        if (!rawImages || rawImages.length === 0) return [];

        return (rawImages as Array<ProductImage | string>)
            .map((item, index) => {
                const url =
                    typeof item === 'object' && item !== null
                        ? item.image
                        : typeof item === 'string'
                          ? item
                          : '';

                if (!url) return null;

                return {
                    original: url,
                    thumbnail: url,
                    originalAlt: `${title} - image ${index + 1}`,
                    thumbnailAlt: `${title} - thumb ${index + 1}`,
                    originalClass:
                        'w-full h-auto object-contain aspect-square select-none max-h-[520px]',
                    thumbnailClass:
                        'rounded-lg overflow-hidden border-2 border-transparent transition-all hover:opacity-100',
                    loading: index === 0 ? 'eager' : 'lazy',
                    thumbnailLoading: 'lazy',
                } as GalleryItem;
            })
            .filter((item): item is GalleryItem => item !== null);
    }, [rawImages, title]);

    return (
        <div className={`relative ${className}`}>
            {/* Floating Badges */}
            <div className="pointer-events-none absolute start-4 top-4 z-20 flex flex-col items-start gap-2">
                {hasDiscount && discountPercent > 0 && (
                    <Badge className="rounded-md border-0 bg-red-500 px-2.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-md hover:bg-red-500">
                        -{discountPercent}%
                    </Badge>
                )}

                {isFeatured && !hasDiscount && (
                    <Badge className="gap-1.5 rounded-md border-0 bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-md hover:bg-amber-500">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t('home_products.featured', 'Featured')}</span>
                    </Badge>
                )}

                {isPopular && (
                    <Badge className="rounded-md border-0 bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary">
                        {t('home_products.popular', 'Popular')}
                    </Badge>
                )}
            </div>

            {/* Main Gallery or Fallback Container */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-xs sm:p-4 dark:border-neutral-800 dark:bg-neutral-900">
                {galleryItems.length > 0 ? (
                    <div className="product-details-gallery">
                        <ImageGallery
                            items={galleryItems}
                            showPlayButton={false}
                            showFullscreenButton={true}
                            showNav={galleryItems.length > 1}
                            showThumbnails={galleryItems.length > 1}
                            showBullets={false}
                            lazyLoad={true}
                            thumbnailPosition="bottom"
                            slideDuration={350}
                            slideInterval={3000}
                            useBrowserFullscreen={true}
                        />
                    </div>
                ) : (
                    <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-neutral-100 p-8 text-neutral-400 dark:bg-neutral-800/60">
                        <Package className="mb-3 h-16 w-16 stroke-[1.25] text-neutral-300 dark:text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-500">
                            {t('products.no_images', 'No images available')}
                        </p>
                    </div>
                )}

                {/* Out of stock banner */}
                {isOutOfStock && (
                    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                        <span className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-bold tracking-wider text-white uppercase shadow-xl">
                            {t('home_products.out_of_stock', 'Out of Stock')}
                        </span>
                    </div>
                )}
            </div>

            {/* Gallery CSS Overrides */}
            <style>{`
        .product-details-gallery .image-gallery {
          position: relative;
        }
        .product-details-gallery .image-gallery-slide-wrapper {
          border-radius: 0.75rem;
          overflow: hidden;
          background: transparent;
        }
        .product-details-gallery .image-gallery-slide {
          background: transparent;
          display: flex;
          align-items: center;
          justify-center;
        }
        .product-details-gallery .image-gallery-slide img {
          max-height: 480px;
          object-fit: contain;
          margin: 0 auto;
          border-radius: 0.5rem;
        }
        .product-details-gallery .image-gallery-thumbnails-wrapper {
          margin-top: 0.75rem;
        }
        .product-details-gallery .image-gallery-thumbnail {
          border-radius: 0.5rem;
          border-width: 2px;
          border-color: transparent;
          overflow: hidden;
          padding: 2px;
          transition: all 0.2s ease;
        }
        .product-details-gallery .image-gallery-thumbnail.active,
        .product-details-gallery .image-gallery-thumbnail:focus,
        .product-details-gallery .image-gallery-thumbnail:hover {
          border-color: var(--color-primary, #000);
        }
        .product-details-gallery .image-gallery-thumbnail img {
          border-radius: 0.375rem;
          height: 64px;
          object-fit: cover;
        }
        .product-details-gallery .image-gallery-icon {
          color: #fff;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
          transition: transform 0.2s;
        }
        .product-details-gallery .image-gallery-icon:hover {
          color: #fff;
          transform: scale(1.1);
        }
      `}</style>
        </div>
    );
}
