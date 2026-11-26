import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import DeleteDialog from '@/components/delete-dialog';
import NoDataFound from '@/components/no-data-found';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';

import useImports from '@/hooks/use-imports';
import useWebsiteSettings from '@/hooks/use-website-settings';
import { Pagination } from '@/types/pagination';
import { Product } from '@/types/product';

import ProductCard from './components/product-card';
import ProductPagination from './components/product-pagination';
import ProductToolbar from './components/product-toolbar';

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

    // Selection & Deletion States
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

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

    const toggleSelectProduct = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const currentPageIds = products.data.map((p) => p.id);
    const allOnPageSelected =
        currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

    const toggleSelectAllOnPage = () => {
        if (allOnPageSelected) {
            setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
        }
    };

    const handleOpenSingleDelete = (product: Product) => {
        setBulkDeleteMode(false);
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleOpenBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setBulkDeleteMode(true);
        setProductToDelete(null);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (bulkDeleteMode) {
            router.post(
                '/products/bulk-delete',
                { ids: selectedIds },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            t('products.bulk_deleted_success', 'Selected products deleted successfully.')
                        );
                        setSelectedIds([]);
                        setDeleteDialogOpen(false);
                        setBulkDeleteMode(false);
                    },
                    onError: () => {
                        toast.error(t('common.error_occurred', 'Failed to delete selected products.'));
                    },
                }
            );
            return;
        }

        if (!productToDelete) return;

        router.delete(`/products/delete/${productToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('products.deleted_success', 'Product deleted successfully.'));
                setSelectedIds((prev) => prev.filter((id) => id !== productToDelete.id));
                setDeleteDialogOpen(false);
                setProductToDelete(null);
            },
            onError: () => {
                toast.error(t('common.error_occurred', 'Failed to delete product.'));
            },
        });
    };

    const currency = settings?.currency_ar || '$';

    return (
        <DashboardLayout>
            <Head title={t('products.page-title', 'Products Management')} />

            <PageHeader title={t('products.page-title', 'Products Management')}>
                <Link href="/create/product/page">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('common.add', 'Add Product')}
                    </Button>
                </Link>
            </PageHeader>

            <ProductToolbar
                totalProducts={products.total ?? products.data.length}
                pageProductsCount={products.data.length}
                selectedCount={selectedIds.length}
                allSelected={allOnPageSelected}
                onToggleSelectAll={toggleSelectAllOnPage}
                onBulkDelete={handleOpenBulkDelete}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearchSubmit={handleSearch}
                onClearSearch={handleClearSearch}
            />

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
                        {products.data.map((product: Product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                currency={currency}
                                isSelected={selectedIds.includes(product.id)}
                                onToggleSelect={toggleSelectProduct}
                                onDelete={handleOpenSingleDelete}
                            />
                        ))}
                    </div>
                )}

                <ProductPagination products={products} />
            </div>

            <DeleteDialog
                showDeleteDialog={deleteDialogOpen}
                setshowDeleteDialog={setDeleteDialogOpen}
                handleDelete={handleConfirmDelete}
            />
        </DashboardLayout>
    );
}
