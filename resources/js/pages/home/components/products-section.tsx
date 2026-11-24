import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Flame, Layers, Sparkles, Tag } from 'lucide-react';

import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import { Pagination } from '@/types/pagination';
import { Product } from '@/types/product';

interface ProductsSectionProps {
  products: Pagination<Product>;
}

type FilterType = 'all' | 'featured' | 'popular' | 'on_sale';

export default function ProductsSection({ products }: ProductsSectionProps) {
  const { t, isArabic ,currency} = useImports();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const productList = products?.data || [];
  

  // Filter products based on active status filter tab
  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case 'featured':
        return productList.filter((p) => p.is_featured);
      case 'popular':
        return productList.filter((p) => p.is_popular);
      case 'on_sale':
        return productList.filter(
          (p) =>
            p.sale_price !== null &&
            p.sale_price !== undefined &&
            Number(p.sale_price) < Number(p.price)
        );
      case 'all':
      default:
        return productList;
    }
  }, [productList, activeFilter]);

  // Filter Tabs Configuration
  const filterTabs: { id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: t('home_products.all', 'All Products'), icon: Layers },
    { id: 'featured', label: t('home_products.featured', 'Featured'), icon: Sparkles },
    { id: 'popular', label: t('home_products.popular', 'Best Sellers'), icon: Flame },
    { id: 'on_sale', label: t('home_products.on_sale', 'On Sale'), icon: Tag },
  ];

  return (
    <section className="py-12 md:py-16 bg-neutral-50/60 dark:bg-neutral-950/40">
      <div className="container mx-auto px-4">
        {/* Section Header with View All Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home_products.subtitle', 'Discover our handpicked collection')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t('home_products.title', 'Trending Products')}
            </h2>
          </div>

          <Link
            href="/shop/page"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
          >
            <span>{t('home_products.view_all', 'View All Products')}</span>
            {isArabic ? (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-[1.02]'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-800'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-foreground' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-12 text-center my-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 dark:bg-neutral-800 flex items-center justify-center text-primary">
              <Tag className="w-8 h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t('home_products.no_products', 'No products match this filter.')}
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveFilter('all')}>
              {t('home_products.all', 'View All Products')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Callout & Explore Button */}
        <div className="flex flex-col items-center justify-center mt-12 space-y-3">
          <Link href="/shop/page">
            <Button
              size="lg"
              className="px-8 py-3 h-12 rounded-xl font-bold text-sm sm:text-base gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
            >
              <span>{t('home_products.show_more', 'Explore All Products')}</span>
              {isArabic ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </Link>

          {products?.total ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {products.total.toLocaleString()} {t('home_products.in_stock', 'Products available')}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
