import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    Check,
    ChevronRight,
    Filter,
    Flame,
    Home,
    Layers,
    Package,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Sparkles,
    Tag,
    X,
} from 'lucide-react';

import ProductCard from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import UserLayout from '@/layouts/user-layout';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';
import { Pagination } from '@/types/pagination';
import { Product } from '@/types/product';

interface ShopFilters {
    search?: string;
    category_id?: string | number;
    brand_id?: string | number;
    min_price?: string | number;
    max_price?: string | number;
    in_stock?: boolean | string;
    on_sale?: boolean | string;
    product_kind?: string;
    sort?: string;
}

interface ShopPageProps {
    products: Pagination<Product>;
    categories: Category[];
    brands: Brand[];
    filters: ShopFilters;
    priceRange?: {
        min: number;
        max: number;
    };
    selectedCategoryId?: number | null;
}

export default function ShopPage({
    products,
    categories = [],
    brands = [],
    filters = {},
    priceRange = { min: 0, max: 1000 },
    selectedCategoryId,
}: ShopPageProps) {
    const { t, isArabic } = useImports();
    const { settings } = useWebsiteSettings();

    const currency = isArabic
        ? settings?.currency_ar || 'ر.س'
        : settings?.currency_en || '$';

    // Local state for search & price filter inputs
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [minPriceInput, setMinPriceInput] = useState(
        filters.min_price?.toString() || '',
    );
    const [maxPriceInput, setMaxPriceInput] = useState(
        filters.max_price?.toString() || '',
    );
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Identify currently selected category object if any
    const currentCategoryId = filters.category_id || selectedCategoryId;
    const activeCategory = useMemo(() => {
        if (!currentCategoryId) return null;
        return (
            categories.find(
                (c) => c.id.toString() === currentCategoryId.toString(),
            ) || null
        );
    }, [categories, currentCategoryId]);

    // Identify currently selected brand object if any
    const activeBrand = useMemo(() => {
        if (!filters.brand_id) return null;
        return (
            brands.find(
                (b) => b.id.toString() === filters.brand_id?.toString(),
            ) || null
        );
    }, [brands, filters.brand_id]);

    // Apply updated filters to Inertia route
    const updateFilters = (newFilters: Partial<ShopFilters>) => {
        const updated: Record<string, any> = {
            ...filters,
            ...newFilters,
        };

        // Clean up empty or undefined keys
        Object.keys(updated).forEach((key) => {
            if (
                updated[key] === '' ||
                updated[key] === null ||
                updated[key] === undefined ||
                updated[key] === false
            ) {
                delete updated[key];
            }
        });

        router.get('/shop/page', updated, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Clear a specific filter
    const clearFilter = (key: keyof ShopFilters) => {
        const updated = { ...filters };
        delete updated[key];

        if (key === 'category_id') {
            router.get('/shop/page', updated, {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            updateFilters({ [key]: undefined });
        }
    };

    // Reset all filters
    const resetAllFilters = () => {
        setSearchQuery('');
        setMinPriceInput('');
        setMaxPriceInput('');
        router.get(
            '/shop/page',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Search submission
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchQuery.trim() });
    };

    // Price range submission
    const handlePriceApply = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({
            min_price: minPriceInput ? Number(minPriceInput) : undefined,
            max_price: maxPriceInput ? Number(maxPriceInput) : undefined,
        });
        setIsMobileFilterOpen(false);
    };

    // Count active filter conditions
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.category_id) count++;
        if (filters.brand_id) count++;
        if (filters.min_price || filters.max_price) count++;
        if (filters.in_stock) count++;
        if (filters.on_sale) count++;
        if (filters.product_kind) count++;
        if (filters.search) count++;
        return count;
    }, [filters]);

    const productList = products?.data || [];

    // Sidebar Filter Content (Reusable for Desktop & Mobile)
    const FilterContent = (
        <div className="space-y-6 text-sm">
            {/* 1. Category Filter */}
            <div className="space-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 font-extrabold text-neutral-900 dark:text-neutral-100">
                        <Layers className="h-4 w-4 text-primary" />
                        <span>{isArabic ? 'الأقسام' : 'Categories'}</span>
                    </h4>
                    {filters.category_id && (
                        <button
                            type="button"
                            onClick={() => clearFilter('category_id')}
                            className="text-xs text-neutral-400 transition-colors hover:text-red-500"
                        >
                            {isArabic ? 'إعادة ضبط' : 'Clear'}
                        </button>
                    )}
                </div>

                <div className="max-h-60 scrollbar-thin space-y-1.5 overflow-y-auto pe-1">
                    {/* All Categories Option */}
                    <button
                        type="button"
                        onClick={() => {
                            clearFilter('category_id');
                            setIsMobileFilterOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-semibold transition-all ${
                            !currentCategoryId
                                ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                        }`}
                    >
                        <span>
                            {isArabic ? 'جميع الأقسام' : 'All Categories'}
                        </span>
                        {!currentCategoryId && (
                            <Check className="h-3.5 w-3.5" />
                        )}
                    </button>

                    {/* List of categories */}
                    {categories.map((cat) => {
                        const isSelected =
                            currentCategoryId?.toString() === cat.id.toString();
                        const catName = isArabic
                            ? cat.name_ar
                            : cat.name_en || cat.name_ar;

                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                    updateFilters({ category_id: cat.id });
                                    setIsMobileFilterOpen(false);
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-start text-xs transition-all ${
                                    isSelected
                                        ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                                        : 'font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                }`}
                            >
                                <span className="truncate">{catName}</span>
                                {isSelected && (
                                    <Check className="h-3.5 w-3.5 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Brand Filter */}
            {brands.length > 0 && (
                <div className="space-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-extrabold text-neutral-900 dark:text-neutral-100">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span>
                                {isArabic ? 'العلامة التجارية' : 'Brands'}
                            </span>
                        </h4>
                        {filters.brand_id && (
                            <button
                                type="button"
                                onClick={() => clearFilter('brand_id')}
                                className="text-xs text-neutral-400 transition-colors hover:text-red-500"
                            >
                                {isArabic ? 'إعادة ضبط' : 'Clear'}
                            </button>
                        )}
                    </div>

                    <div className="max-h-52 scrollbar-thin space-y-1.5 overflow-y-auto pe-1">
                        <button
                            type="button"
                            onClick={() => {
                                clearFilter('brand_id');
                                setIsMobileFilterOpen(false);
                            }}
                            className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-start text-xs transition-all ${
                                !filters.brand_id
                                    ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                                    : 'font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                            }`}
                        >
                            <span>
                                {isArabic ? 'جميع العلامات' : 'All Brands'}
                            </span>
                            {!filters.brand_id && (
                                <Check className="h-3.5 w-3.5" />
                            )}
                        </button>

                        {brands.map((brand) => {
                            const isSelected =
                                filters.brand_id?.toString() ===
                                brand.id.toString();

                            return (
                                <button
                                    key={brand.id}
                                    type="button"
                                    onClick={() => {
                                        updateFilters({ brand_id: brand.id });
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-start text-xs transition-all ${
                                        isSelected
                                            ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                                            : 'font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    <span className="truncate">
                                        {brand.name}
                                    </span>
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        {brand.products_count !== undefined && (
                                            <span className="font-mono text-[10px] text-neutral-400">
                                                ({brand.products_count})
                                            </span>
                                        )}
                                        {isSelected && (
                                            <Check className="h-3.5 w-3.5" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 3. Price Filter */}
            <div className="space-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 font-extrabold text-neutral-900 dark:text-neutral-100">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span>{isArabic ? 'نطاق السعر' : 'Price Range'}</span>
                    </h4>
                    {(filters.min_price || filters.max_price) && (
                        <button
                            type="button"
                            onClick={() => {
                                setMinPriceInput('');
                                setMaxPriceInput('');
                                updateFilters({
                                    min_price: undefined,
                                    max_price: undefined,
                                });
                            }}
                            className="text-xs text-neutral-400 transition-colors hover:text-red-500"
                        >
                            {isArabic ? 'إعادة ضبط' : 'Clear'}
                        </button>
                    )}
                </div>

                <form onSubmit={handlePriceApply} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold text-neutral-400">
                                {isArabic ? 'الحد الأدنى' : 'Min'} ({currency})
                            </label>
                            <Input
                                type="number"
                                min="0"
                                placeholder={priceRange.min.toString()}
                                value={minPriceInput}
                                onChange={(e) =>
                                    setMinPriceInput(e.target.value)
                                }
                                className="h-9 rounded-xl text-xs"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold text-neutral-400">
                                {isArabic ? 'الحد الأقصى' : 'Max'} ({currency})
                            </label>
                            <Input
                                type="number"
                                min="0"
                                placeholder={priceRange.max.toString()}
                                value={maxPriceInput}
                                onChange={(e) =>
                                    setMaxPriceInput(e.target.value)
                                }
                                className="h-9 rounded-xl text-xs"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        className="h-8 w-full cursor-pointer rounded-xl border border-neutral-200 text-xs font-bold dark:border-neutral-700"
                    >
                        {isArabic ? 'تطبيق السعر' : 'Apply Price'}
                    </Button>
                </form>
            </div>

            {/* 4. Availability & Specials */}
            <div className="space-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                <h4 className="flex items-center gap-2 font-extrabold text-neutral-900 dark:text-neutral-100">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span>{isArabic ? 'خيارات إضافية' : 'Preferences'}</span>
                </h4>

                {/* In Stock Only */}
                <label className="flex cursor-pointer items-center gap-3 text-xs text-neutral-700 select-none dark:text-neutral-300">
                    <Checkbox
                        checked={Boolean(filters.in_stock)}
                        onCheckedChange={(checked) =>
                            updateFilters({
                                in_stock: checked ? true : undefined,
                            })
                        }
                    />
                    <span className="font-medium">
                        {isArabic ? 'المتوفر في المخزون فقط' : 'In Stock Only'}
                    </span>
                </label>

                {/* On Sale Only */}
                <label className="flex cursor-pointer items-center gap-3 text-xs text-neutral-700 select-none dark:text-neutral-300">
                    <Checkbox
                        checked={Boolean(filters.on_sale)}
                        onCheckedChange={(checked) =>
                            updateFilters({
                                on_sale: checked ? true : undefined,
                            })
                        }
                    />
                    <span className="flex items-center gap-1.5 font-medium">
                        <Flame className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                        {isArabic ? 'العروض والتخفيضات فقط' : 'On Sale Only'}
                    </span>
                </label>
            </div>

            {/* 5. Product Kind */}
            <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-extrabold text-neutral-900 dark:text-neutral-100">
                    <Package className="h-4 w-4 text-neutral-500" />
                    <span>{isArabic ? 'نوع المنتج' : 'Product Type'}</span>
                </h4>

                <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                    <button
                        type="button"
                        onClick={() =>
                            updateFilters({ product_kind: undefined })
                        }
                        className={`rounded-lg py-1.5 transition-all ${
                            !filters.product_kind
                                ? 'bg-white font-bold text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        {isArabic ? 'الكل' : 'All'}
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            updateFilters({ product_kind: 'physical' })
                        }
                        className={`rounded-lg py-1.5 transition-all ${
                            filters.product_kind === 'physical'
                                ? 'bg-white font-bold text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        {isArabic ? 'مادي' : 'Physical'}
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            updateFilters({ product_kind: 'digital' })
                        }
                        className={`rounded-lg py-1.5 transition-all ${
                            filters.product_kind === 'digital'
                                ? 'bg-white font-bold text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        {isArabic ? 'رقمي' : 'Digital'}
                    </button>
                </div>
            </div>

            {/* Reset All Filters Button */}
            {activeFilterCount > 0 && (
                <Button
                    variant="outline"
                    onClick={resetAllFilters}
                    className="mt-4 w-full cursor-pointer gap-2 rounded-xl border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>
                        {isArabic ? 'إلغاء جميع الفلاتر' : 'Reset All Filters'}
                    </span>
                </Button>
            )}
        </div>
    );

    return (
        <UserLayout>
            <Head
                title={
                    activeCategory
                        ? isArabic
                            ? `${activeCategory.name_ar} — Shopella`
                            : `${activeCategory.name_en || activeCategory.name_ar} — Shopella`
                        : isArabic
                          ? 'المتجر والتسوق — Shopella'
                          : 'Shop Catalog — Shopella'
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
                            href="/shop/page"
                            className={
                                activeCategory
                                    ? 'transition-colors hover:text-primary'
                                    : 'font-semibold text-neutral-800 dark:text-neutral-200'
                            }
                        >
                            {t('common.shop', 'Shop')}
                        </Link>

                        {activeCategory && (
                            <>
                                <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    {isArabic
                                        ? activeCategory.name_ar
                                        : activeCategory.name_en ||
                                          activeCategory.name_ar}
                                </span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Banner Section */}
                <div className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-neutral-900 to-neutral-800 p-6 text-white shadow-md sm:p-10">
                    <div className="relative z-10 max-w-2xl">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-xs">
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                            {activeCategory
                                ? isArabic
                                    ? 'قسم المنتجات'
                                    : 'Category Collection'
                                : isArabic
                                  ? 'جميع المنتجات'
                                  : 'Full Catalog'}
                        </span>

                        <h1 className="mb-3 text-2xl font-black tracking-tight sm:text-4xl">
                            {activeCategory
                                ? isArabic
                                    ? activeCategory.name_ar
                                    : activeCategory.name_en ||
                                      activeCategory.name_ar
                                : isArabic
                                  ? 'استكشف تشكيلتنا الكاملة'
                                  : 'Discover Our Entire Collection'}
                        </h1>

                        <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                            {activeCategory
                                ? isArabic
                                    ? activeCategory.description_ar ||
                                      'تصفح أحدث وأفضل المنتجات في هذا القسم بأسعار حصرية وجودة ممتازة.'
                                    : activeCategory.description_en ||
                                      'Browse through curated premium selections in this category with guaranteed quality.'
                                : isArabic
                                  ? 'تسوق تشكيلة واسعة من المنتجات المختارة بعناية لتناسب كل احتياجاتك بأسعار لا تقبل المنافسة.'
                                  : 'Shop our curated assortment of high quality items with unbeatable deals and fast express shipping.'}
                        </p>
                    </div>

                    {/* Decorative background circles */}
                    <div className="pointer-events-none absolute -end-10 -bottom-10 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
                    <div className="pointer-events-none absolute end-40 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                </div>

                {/* Toolbar Bar: Mobile Filter Button, Search, Count, Sort */}
                <div className="mb-6 flex flex-col items-stretch justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Button */}
                        <Sheet
                            open={isMobileFilterOpen}
                            onOpenChange={setIsMobileFilterOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 gap-2 rounded-xl border-neutral-300 px-4 font-bold lg:hidden dark:border-neutral-700"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>
                                        {isArabic ? 'الفلاتر' : 'Filters'}
                                    </span>
                                    {activeFilterCount > 0 && (
                                        <Badge className="flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side={isArabic ? 'right' : 'left'}
                                className="w-80 overflow-y-auto sm:w-96"
                            >
                                <SheetHeader className="mb-4">
                                    <SheetTitle className="flex items-center gap-2 text-lg font-bold">
                                        <Filter className="h-4 w-4 text-primary" />
                                        <span>
                                            {isArabic
                                                ? 'تصفية المنتجات'
                                                : 'Filter Products'}
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                {FilterContent}
                            </SheetContent>
                        </Sheet>

                        {/* Results count display */}
                        <p className="text-xs font-medium text-neutral-500 sm:text-sm">
                            {isArabic ? (
                                <>
                                    عرض{' '}
                                    <strong className="text-neutral-900 dark:text-neutral-100">
                                        {products.total}
                                    </strong>{' '}
                                    منتج
                                </>
                            ) : (
                                <>
                                    Showing{' '}
                                    <strong className="text-neutral-900 dark:text-neutral-100">
                                        {products.total}
                                    </strong>{' '}
                                    results
                                </>
                            )}
                        </p>
                    </div>

                    {/* Search Input & Sort Selector */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative flex-1 sm:w-60"
                        >
                            <Input
                                type="text"
                                placeholder={
                                    isArabic
                                        ? 'ابحث في المنتجات...'
                                        : 'Search products...'
                                }
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 rounded-xl pe-8 text-xs sm:text-sm"
                            />
                            <button
                                type="submit"
                                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-primary"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Sort Selector */}
                        <div className="w-44">
                            <Select
                                value={filters.sort || 'latest'}
                                onValueChange={(val) =>
                                    updateFilters({ sort: val })
                                }
                            >
                                <SelectTrigger className="h-10 rounded-xl text-xs sm:text-sm">
                                    <div className="flex items-center gap-1.5 truncate">
                                        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                                        <SelectValue
                                            placeholder={
                                                isArabic ? 'الترتيب' : 'Sort by'
                                            }
                                        />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">
                                        {isArabic
                                            ? 'الأحدث أولاً'
                                            : 'Newest Arrivals'}
                                    </SelectItem>
                                    <SelectItem value="price_asc">
                                        {isArabic
                                            ? 'السعر: من الأقل للأعلى'
                                            : 'Price: Low to High'}
                                    </SelectItem>
                                    <SelectItem value="price_desc">
                                        {isArabic
                                            ? 'السعر: من الأعلى للأقل'
                                            : 'Price: High to Low'}
                                    </SelectItem>
                                    <SelectItem value="popular">
                                        {isArabic
                                            ? 'الأكثر شعبية'
                                            : 'Most Popular'}
                                    </SelectItem>
                                    <SelectItem value="featured">
                                        {isArabic ? 'المميزة' : 'Featured'}
                                    </SelectItem>
                                    <SelectItem value="title_asc">
                                        {isArabic
                                            ? 'أبجدياً (A - Z)'
                                            : 'Alphabetical (A - Z)'}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips Bar */}
                {activeFilterCount > 0 && (
                    <div className="mb-8 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">
                            {isArabic ? 'الفلاتر النشطة:' : 'Active Filters:'}
                        </span>

                        {/* Category Chip */}
                        {activeCategory && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <span>
                                    {isArabic ? 'القسم:' : 'Category:'}{' '}
                                    <strong>
                                        {isArabic
                                            ? activeCategory.name_ar
                                            : activeCategory.name_en ||
                                              activeCategory.name_ar}
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => clearFilter('category_id')}
                                    className="cursor-pointer transition-colors hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}

                        {/* Brand Chip */}
                        {activeBrand && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <span>
                                    {isArabic ? 'العلامة:' : 'Brand:'}{' '}
                                    <strong>{activeBrand.name}</strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => clearFilter('brand_id')}
                                    className="cursor-pointer transition-colors hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}

                        {/* Price Chip */}
                        {(filters.min_price || filters.max_price) && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <span>
                                    {isArabic ? 'السعر:' : 'Price:'}{' '}
                                    <strong>
                                        {filters.min_price || '0'} -{' '}
                                        {filters.max_price || '∞'} {currency}
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMinPriceInput('');
                                        setMaxPriceInput('');
                                        updateFilters({
                                            min_price: undefined,
                                            max_price: undefined,
                                        });
                                    }}
                                    className="cursor-pointer transition-colors hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}

                        {/* In Stock Chip */}
                        {filters.in_stock && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <span>
                                    {isArabic ? 'متوفر بالمخزون' : 'In Stock'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => clearFilter('in_stock')}
                                    className="cursor-pointer transition-colors hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}

                        {/* On Sale Chip */}
                        {filters.on_sale && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <span>
                                    {isArabic ? 'التخفيضات' : 'On Sale'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => clearFilter('on_sale')}
                                    className="cursor-pointer transition-colors hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}

                        {/* Search Query Chip */}
                        {filters.search && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <span>"{filters.search}"</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        clearFilter('search');
                                    }}
                                    className="cursor-pointer transition-colors hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}

                        {/* Clear All Link */}
                        <button
                            type="button"
                            onClick={resetAllFilters}
                            className="ms-2 cursor-pointer text-xs font-bold text-red-500 hover:underline"
                        >
                            {isArabic ? 'مسح الكل' : 'Clear All'}
                        </button>
                    </div>
                )}

                {/* Main Catalog Layout: Sidebar (Desktop) + Products Grid */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Desktop Left Sidebar Filters (3 cols on lg) */}
                    <aside className="sticky top-24 hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs lg:col-span-3 lg:block dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800">
                            <h3 className="flex items-center gap-2 text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                <Filter className="h-4 w-4 text-primary" />
                                <span>
                                    {isArabic
                                        ? 'فلاتر المتجر'
                                        : 'Filter Products'}
                                </span>
                            </h3>
                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={resetAllFilters}
                                    className="text-xs text-neutral-400 transition-colors hover:text-red-500"
                                >
                                    {isArabic ? 'إعادة تعيين' : 'Reset'}
                                </button>
                            )}
                        </div>

                        {FilterContent}
                    </aside>

                    {/* Right Product Grid Area (9 cols on lg) */}
                    <main className="lg:col-span-9">
                        {productList.length === 0 ? (
                            /* Empty State */
                            <div className="rounded-3xl border border-neutral-200/80 bg-white px-4 py-20 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <Package className="mx-auto mb-4 h-16 w-16 stroke-[1.25] text-neutral-300 dark:text-neutral-600" />
                                <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {isArabic
                                        ? 'لم نتمكن من العثور على أي منتجات'
                                        : 'No products found'}
                                </h3>
                                <p className="mx-auto mb-6 max-w-md text-sm text-neutral-500">
                                    {isArabic
                                        ? 'لم يتم العثور على منتجات تطابق اختيارات الفلترة المحددة. جرب تغيير الفلاتر أو إعادة ضبطها.'
                                        : 'We could not find any products matching your selected filters. Try broadening your criteria or reset filters.'}
                                </p>
                                <Button
                                    onClick={resetAllFilters}
                                    className="cursor-pointer gap-2 rounded-xl font-bold"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span>
                                        {isArabic
                                            ? 'إعادة ضبط الفلاتر'
                                            : 'Reset All Filters'}
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Products Grid */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {productList.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.links &&
                                    products.links.length > 3 && (
                                        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                                            {products.links.map((link, idx) => {
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={idx}
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                            className="cursor-not-allowed rounded-xl bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-400 opacity-60 dark:bg-neutral-800"
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={idx}
                                                        href={link.url}
                                                        preserveScroll
                                                        preserveState
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                        className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                                            link.active
                                                                ? 'bg-primary text-primary-foreground shadow-xs'
                                                                : 'border border-neutral-200 bg-white text-neutral-700 hover:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                                                        }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </UserLayout>
    );
}
