import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';

import useImports from '@/hooks/use-imports';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { Supplier } from '@/types/supplier';

import ProductForm from './components/product-form';
import useProductForm from './hooks/use-product-form';

interface UpdateProductPageProps {
    product: Product;
    suppliers?: Supplier[];
    categories?: Category[];
    brands?: Brand[];
}

export default function UpdateProductPage({
    product,
    suppliers = [],
    categories = [],
    brands = [],
}: UpdateProductPageProps) {
    const { t } = useImports();
    const { formik, existingImages, handleRemoveExistingImage } = useProductForm({ product });

    const selectedCategory = categories.find(
        (c) => String(c.id) === String(formik.values.category_id)
    );
    const selectedBrand = brands.find(
        (b) => String(b.id) === String(formik.values.brand_id)
    );

    return (
        <DashboardLayout>
            <Head title={`${t('products.edit-page-title', 'Edit Product')} — ${product.title}`} />

            <PageHeader
                title={t('products.edit-page-title', 'Edit Product')}
                description={product.title}
            >
                <div className="flex items-center gap-2">
                    <Link href="/products/page">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <ArrowLeft className="w-4 h-4" />
                            {t('products.page-title', 'Products List')}
                        </Button>
                    </Link>
                    <Button
                        type="button"
                        size="sm"
                        disabled={formik.isSubmitting}
                        onClick={() => formik.handleSubmit()}
                        className="gap-1.5 shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        {formik.isSubmitting
                            ? t('common.saving', 'Saving...')
                            : t('common.update', 'Update Product')}
                    </Button>
                </div>
            </PageHeader>

            <ProductForm
                formik={formik}
                categories={categories}
                brands={brands}
                suppliers={suppliers}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                existingImages={existingImages}
                onRemoveExistingImage={handleRemoveExistingImage}
            />
        </DashboardLayout>
    );
}
