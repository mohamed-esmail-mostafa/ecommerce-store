import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Edit2,
    Package,
    Plus,
    Search,
    Tag,
    Trash2,
    X,
} from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import NoDataFound from '@/components/no-data-found';
import NoImage from '@/components/no-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import { Pagination } from '@/types/pagination';
import { Product } from '@/types/product';

interface ProductsPageProps {
    products: Pagination<Product>;
    filters?: {
        search?: string;
    };
}

export default function ProductsPage({ products, filters }: ProductsPageProps) {
    const { t } = useImports();
    const { settings } = useWebsiteSettings();
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    // Service-side search function (dispatches to backend ProductService)
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/products/page',
            { search: searchQuery.trim() || undefined },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        router.get(
            '/products/page',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const changePage = (url: string | null) => {
        if (url) {
            router.get(
                url,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    const currency = settings?.currency_ar || '$';

    return (
        <DashboardLayout>
            <PageHeader title={t('products.page-title', 'Products Management')}>
                <Link href="/create/product/page">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('common.add', 'Add Product')}
                    </Button>
                </Link>
            </PageHeader>

            {/* Toolbar: Service-Side Search & Counter */}
            <div className="container mx-auto px-4 mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-3 py-1.5 gap-1.5">
                            <Package className="w-4 h-4 text-primary" />
                            {t('products.total_products', 'Total Products')}: {products.total ?? products.data.length}
                        </Badge>
                    </div>

                    {/* Backend Search Form */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder={t('products.search_placeholder', 'Search products on server...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8 h-9 text-xs rounded-lg w-full"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <Button type="submit" size="sm" className="h-9 text-xs px-3">
                            {t('common.search', 'Search')}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 pb-12">
                {products.data.length === 0 ? (
                    <NoDataFound>
                        <div className="mt-4">
                            <Link href="/create/product/page">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    {t('common.add', 'Add Product')}
                                </Button>
                            </Link>
                        </div>
                    </NoDataFound>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.data.map((product: Product) => {
                            const firstImage =
                                typeof product.images?.[0] === 'object' && product.images[0]
                                    ? product.images[0].image
                                    : typeof product.images?.[0] === 'string'
                                      ? product.images[0]
                                      : null;

                            return (
                                <Card
                                    key={product.id}
                                    className="overflow-hidden border border-border/70 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group p-0 gap-0"
                                >
                                    <div>
                                        {/* Product Image Header */}
                                        <CardHeader className="p-0 relative aspect-square bg-muted/30 overflow-hidden">
                                            {firstImage ? (
                                                <img
                                                    src={firstImage}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <NoImage />
                                            )}

                                            {/* Badges Overlay */}
                                            <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                                                {product.category && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-black/60 text-white border-white/20 text-[10px] backdrop-blur-md px-1.5 py-0.5"
                                                    >
                                                        {product.category.name_ar || product.category.name_en}
                                                    </Badge>
                                                )}
                                                {product.brand && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-white/80 dark:bg-black/80 text-[10px] px-1.5 py-0.5"
                                                    >
                                                        {product.brand}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>

                                        {/* Product Content */}
                                        <CardContent className="p-3.5 space-y-2">
                                            <h3
                                                className="font-bold text-sm line-clamp-2 text-foreground"
                                                title={product.title}
                                            >
                                                {product.title}
                                            </h3>

                                            {product.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* Price & Stock */}
                                            <div className="flex items-center justify-between pt-1">
                                                <div className="font-bold text-sm">
                                                    {product.sale_price ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="line-through text-xs text-muted-foreground font-normal">
                                                                {currency}
                                                                {product.price}
                                                            </span>
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                                {currency}
                                                                {product.sale_price}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span>
                                                            {currency}
                                                            {product.price}
                                                        </span>
                                                    )}
                                                </div>

                                                <Badge
                                                    variant={product.stock > 0 ? 'default' : 'destructive'}
                                                    className={`text-[10px] px-1.5 py-0 ${
                                                        product.stock > 0
                                                            ? 'bg-emerald-600 text-white'
                                                            : ''
                                                    }`}
                                                >
                                                    {product.stock > 0
                                                        ? `${product.stock} in stock`
                                                        : t('common.stockout', 'Out Of Stock')}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </div>

                                    {/* Action Buttons */}
                                    <CardFooter className="p-3 pt-0 flex items-center justify-end gap-1.5 border-t border-border/40 bg-muted/10">
                                        <Link href={`/products/update/${product.slug || product.id}`}>
                                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1">
                                                <Edit2 className="w-3.5 h-3.5" />
                                                {t('common.edit', 'Edit')}
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {products.data.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!products.prev_page_url}
                            onClick={() => changePage(products.prev_page_url)}
                        >
                            {t('common.previous', 'Previous')}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Page {products.current_page} of {products.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!products.next_page_url}
                            onClick={() => changePage(products.next_page_url)}
                        >
                            {t('common.next', 'Next')}
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
