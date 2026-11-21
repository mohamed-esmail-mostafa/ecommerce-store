import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Bookmark,
    Edit2,
    Plus,
    Search,
    Tag,
    Trash2,
    X,
} from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import NoDataFound from '@/components/no-data-found';
import DeleteDialog from '@/components/delete-dialog';
import InputError from '@/components/input-error';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import useImports from '@/hooks/use-imports';
import { Brand } from '@/types/brand';

interface BrandsPageProps {
    brands?: Brand[];
}

interface BrandFormValues {
    [key: string]: string;
    name: string;
}

export default function BrandsPage({ brands = [] }: BrandsPageProps) {
    const { t } = useImports();

    // Modal & Dialog States
    const [showModal, setShowModal] = useState(false);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteBrandItem, setDeleteBrandItem] = useState<Brand | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .required(t('validation.is_required'))
            .max(255),
    });

    // Formik Form
    const formik = useFormik<BrandFormValues>({
        initialValues: {
            name: editBrand?.name || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            if (editBrand) {
                // Update
                router.post(`/brands/update/${editBrand.id}`, values, {
                    onSuccess: () => {
                        toast.success(t('common.saved_success'));
                        setShowModal(false);
                        setEditBrand(null);
                        formik.resetForm();
                    },
                    onError: (errors) => {
                        toast.error(t('common.error'));
                        Object.keys(errors).forEach((key) => {
                            formik.setFieldError(key as any, errors[key]);
                        });
                    },
                    onFinish: () => setSubmitting(false),
                });
            } else {
                // Create
                router.post('/brands/store', values, {
                    onSuccess: () => {
                        toast.success(t('common.saved_success'));
                        setShowModal(false);
                        formik.resetForm();
                    },
                    onError: (errors) => {
                        toast.error(t('common.error'));
                        Object.keys(errors).forEach((key) => {
                            formik.setFieldError(key as any, errors[key]);
                        });
                    },
                    onFinish: () => setSubmitting(false),
                });
            }
        },
    });

    const handleOpenCreateModal = () => {
        setEditBrand(null);
        formik.resetForm({
            values: {
                name: '',
            },
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (brand: Brand) => {
        setEditBrand(brand);
        setShowModal(true);
    };

    const handleDeleteBrand = () => {
        if (!deleteBrandItem) return;

        router.delete(`/brands/delete/${deleteBrandItem.id}`, {
            onSuccess: () => {
                toast.success(t('common.success'));
                setShowDeleteDialog(false);
                setDeleteBrandItem(null);
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    // Filtered Brands
    const filteredBrands = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return brands;

        return brands.filter((brand) => brand.name.toLowerCase().includes(q));
    }, [brands, searchQuery]);

    return (
        <DashboardLayout>
            {/* Header */}
            <PageHeader title={t('brands.page_title', 'Brands Management')}>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('brands.add_brand', 'Add Brand')}
                </Button>
            </PageHeader>

            {/* Quick Stats & Search Bar */}
            <div className="container mx-auto px-4 mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Badge variant="outline" className="text-xs px-3 py-1.5 gap-1.5 w-fit">
                        <Tag className="w-4 h-4 text-primary" />
                        {t('brands.total_brands', 'Total Brands')}: {brands.length}
                    </Badge>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t('brands.search_placeholder', 'Search brands...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-8 h-9 text-xs rounded-lg w-full"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Brands Content Area */}
            <div className="container mx-auto px-4 pb-12">
                {brands.length === 0 ? (
                    <NoDataFound>
                        <div className="mt-4">
                            <Button onClick={handleOpenCreateModal} className="gap-2">
                                <Plus className="w-4 h-4" />
                                {t('brands.add_brand', 'Add Brand')}
                            </Button>
                        </div>
                    </NoDataFound>
                ) : filteredBrands.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed p-8">
                        <p className="text-muted-foreground text-sm">{t('common.no_results')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredBrands.map((brand) => (
                            <Card
                                key={brand.id}
                                className="overflow-hidden border border-border/70 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <CardHeader className="p-4 pb-3 flex flex-row items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Bookmark className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-base truncate" title={brand.name}>
                                                {brand.name}
                                            </h3>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-4 py-2">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span>
                                                {brand.products_count ?? 0} {t('products.page-title')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </div>

                                <CardFooter className="p-4 pt-3 flex items-center justify-end gap-2 border-t border-border/40 bg-muted/10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenEditModal(brand)}
                                        className="h-8 px-3 text-xs gap-1.5"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        {t('common.edit')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setDeleteBrandItem(brand);
                                            setShowDeleteDialog(true);
                                        }}
                                        className="h-8 px-3 text-xs gap-1.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        {t('common.delete')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create & Edit Modal Dialog */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2 border-b">
                        <DialogTitle className="text-xl font-bold">
                            {editBrand
                                ? t('brands.edit_brand', 'Edit Brand')
                                : t('brands.add_brand', 'Add Brand')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {t('brands.page_subtitle', 'Manage brand catalog')}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold">
                                {t('brands.name', 'Brand Name')} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('brands.name_placeholder', 'e.g. Nike, Apple, Samsung...')}
                                className="rounded-lg"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <InputError message={formik.errors.name} />
                            )}
                        </div>

                        <DialogFooter className="pt-4 border-t gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                disabled={formik.isSubmitting}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" disabled={formik.isSubmitting}>
                                {t('common.save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                showDeleteDialog={showDeleteDialog}
                setshowDeleteDialog={setShowDeleteDialog}
                handleDelete={handleDeleteBrand}
            />
        </DashboardLayout>
    );
}
