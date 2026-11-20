import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Edit2,
    Folder,
    FolderTree,
    Layers,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import NoDataFound from '@/components/no-data-found';
import NoImage from '@/components/no-image';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ImagePicker from '@/components/ui/image-picker';

import useImports from '@/hooks/use-imports';
import { Category } from '@/types/category';

interface CategoriesPageProps {
    categories?: Category[];
}

interface CategoryFormValues {
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    image: File | string | null;
    parent_id: string;
}

export default function CategoriesPage({ categories = [] }: CategoriesPageProps) {
    const { t } = useImports();

    // Modal & Dialog States
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteCategoryItem, setDeleteCategoryItem] = useState<Category | null>(null);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'all' | 'main' | 'sub'>('all');

    // Validation Schema
    const validationSchema = Yup.object({
        name_ar: Yup.string().trim().required(t('validation.is_required')),
        name_en: Yup.string().trim().nullable(),
        description_ar: Yup.string().trim().nullable(),
        description_en: Yup.string().trim().nullable(),
        image: Yup.mixed().nullable(),
        parent_id: Yup.string().nullable(),
    });

    // Formik Form
    const formik = useFormik<CategoryFormValues>({
        initialValues: {
            name_ar: editCategory?.name_ar || '',
            name_en: editCategory?.name_en || '',
            description_ar: editCategory?.description_ar || '',
            description_en: editCategory?.description_en || '',
            image: editCategory?.image || null,
            parent_id: editCategory?.parent_id ? editCategory.parent_id.toString() : 'none',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append('name_ar', values.name_ar);
            if (values.name_en) formData.append('name_en', values.name_en);
            if (values.description_ar) formData.append('description_ar', values.description_ar);
            if (values.description_en) formData.append('description_en', values.description_en);

            if (values.parent_id && values.parent_id !== 'none') {
                formData.append('parent_id', values.parent_id);
            } else {
                formData.append('parent_id', '');
            }

            if (values.image instanceof File) {
                formData.append('image', values.image);
            }

            if (editCategory) {
                // Update
                router.put(`/update/category/${editCategory.slug}`, formData, {
                    onSuccess: () => {
                        toast.success(t('common.saved_success'));
                        setEditCategory(null);
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
            } else {
                // Store
                router.post('/store/categories', formData, {
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
        setEditCategory(null);
        formik.resetForm({
            values: {
                name_ar: '',
                name_en: '',
                description_ar: '',
                description_en: '',
                image: null,
                parent_id: 'none',
            },
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (category: Category) => {
        setEditCategory(category);
        setShowModal(true);
    };

    const handleDeleteCategory = () => {
        if (!deleteCategoryItem) return;

        router.delete(`/delete/category/${deleteCategoryItem.slug}`, {
            onSuccess: () => {
                setDeleteDialog(false);
                setDeleteCategoryItem(null);
                toast.success(t('common.success'));
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    // Filter categories for the parent dropdown (exclude the category itself)
    const availableParents = useMemo(() => {
        return categories.filter((c) => !editCategory || c.id !== editCategory.id);
    }, [categories, editCategory]);

    // Live Search & Tab Filtering
    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            // Tab filter
            if (selectedTab === 'main' && category.parent_id !== null) return false;
            if (selectedTab === 'sub' && category.parent_id === null) return false;

            // Search query
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;

            const nameArMatch = category.name_ar?.toLowerCase().includes(q);
            const nameEnMatch = category.name_en?.toLowerCase().includes(q);
            const descArMatch = category.description_ar?.toLowerCase().includes(q);
            const descEnMatch = category.description_en?.toLowerCase().includes(q);
            const parentArMatch = category.parent?.name_ar?.toLowerCase().includes(q);
            const parentEnMatch = category.parent?.name_en?.toLowerCase().includes(q);

            return (
                nameArMatch ||
                nameEnMatch ||
                descArMatch ||
                descEnMatch ||
                parentArMatch ||
                parentEnMatch
            );
        });
    }, [categories, searchQuery, selectedTab]);

    const totalCount = categories.length;
    const mainCount = categories.filter((c) => c.parent_id === null).length;
    const subCount = categories.filter((c) => c.parent_id !== null).length;

    return (
        <DashboardLayout>
            {/* Header */}
            <PageHeader title={t('categories.page-title')}>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('categories.add_category')}
                </Button>
            </PageHeader>

            {/* Toolbar: Filter Tabs & Live Search */}
            <div className="container mx-auto px-4 mb-6 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedTab === 'all' ? 'default' : 'outline'}
                            onClick={() => setSelectedTab('all')}
                            className="rounded-lg text-xs"
                        >
                            <Layers className="w-3.5 h-3.5 mr-1" />
                            {t('categories.all_categories')} ({totalCount})
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedTab === 'main' ? 'default' : 'outline'}
                            onClick={() => setSelectedTab('main')}
                            className="rounded-lg text-xs"
                        >
                            <Folder className="w-3.5 h-3.5 mr-1" />
                            {t('categories.main_categories')} ({mainCount})
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedTab === 'sub' ? 'default' : 'outline'}
                            onClick={() => setSelectedTab('sub')}
                            className="rounded-lg text-xs"
                        >
                            <FolderTree className="w-3.5 h-3.5 mr-1" />
                            {t('categories.subcategories')} ({subCount})
                        </Button>
                    </div>

                    {/* Live Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t('categories.search_placeholder')}
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

            {/* Main Content Area */}
            <div className="container mx-auto px-4 pb-12">
                {categories.length === 0 ? (
                    <NoDataFound>
                        <div className="mt-4">
                            <Button onClick={handleOpenCreateModal} className="gap-2">
                                <Plus className="w-4 h-4" />
                                {t('categories.add_category')}
                            </Button>
                        </div>
                    </NoDataFound>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed p-8">
                        <p className="text-muted-foreground text-sm">{t('common.no_results')}</p>
                        {searchQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSearchQuery('')}
                                className="mt-3 text-xs"
                            >
                                {t('common.cancel')}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
                        {filteredCategories.map((category) => (
                            <Card
                                key={category.id}
                                className="overflow-hidden border border-border/70 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group p-0 gap-0"
                            >
                                <div>
                                    {/* Category Image Header */}
                                    <CardHeader className="p-0 relative aspect-[16/10] bg-muted/30 overflow-hidden">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name_ar}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <NoImage />
                                        )}

                                        {/* Badges Overlay */}
                                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
                                            {category.parent ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-black/60 text-white border-white/20 text-[11px] backdrop-blur-md px-2 py-0.5 gap-1"
                                                >
                                                    <FolderTree className="w-3 h-3" />
                                                    <span className="truncate max-w-[120px]">
                                                        {category.parent.name_ar}
                                                    </span>
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="default"
                                                    className="text-[11px] font-semibold backdrop-blur-md shadow-xs gap-1"
                                                >
                                                    <Folder className="w-3 h-3" />
                                                    {t('categories.main_categories')}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    {/* Category Details */}
                                    <CardContent className="p-4 space-y-2">
                                        <div>
                                            <h3 className="font-bold text-base line-clamp-1 text-foreground">
                                                {category.name_ar}
                                            </h3>
                                            {category.name_en && (
                                                <p className="text-xs font-medium text-muted-foreground line-clamp-1 mt-0.5">
                                                    {category.name_en}
                                                </p>
                                            )}
                                        </div>

                                        {(category.description_ar || category.description_en) && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {category.description_ar || category.description_en}
                                            </p>
                                        )}
                                    </CardContent>
                                </div>

                                {/* Actions Footer */}
                                <CardFooter className="p-3 pt-0 flex items-center justify-end gap-2 border-t border-border/40 bg-muted/10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenEditModal(category)}
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
                                            setDeleteCategoryItem(category);
                                            setDeleteDialog(true);
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

            {/* Create & Edit Modal Dialog with Fixed Scrollable Content & Pinned Actions */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-5 pb-3 border-b shrink-0 bg-card">
                        <DialogTitle className="text-lg font-bold">
                            {editCategory
                                ? t('categories.edit_category')
                                : t('categories.add_category')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {t('categories.page_subtitle')}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={formik.handleSubmit}
                        className="flex flex-col flex-1 min-h-0 overflow-hidden"
                        encType="multipart/form-data"
                    >
                        {/* Scrollable Form Body */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                            {/* Category Image Picker */}
                            <div className="space-y-1.5">
                                <ImagePicker
                                    id="category-image"
                                    label={t('categories.image')}
                                    initialPreview={editCategory?.image || null}
                                    onChange={(file) => formik.setFieldValue('image', file)}
                                    error={
                                        formik.touched.image && formik.errors.image
                                            ? (formik.errors.image as string)
                                            : undefined
                                    }
                                />
                            </div>

                            {/* Parent Category Selection */}
                            <div className="space-y-1.5">
                                <Label htmlFor="parent_id" className="text-xs font-semibold">
                                    {t('categories.parent_category')}
                                </Label>
                                <Select
                                    name="parent_id"
                                    value={formik.values.parent_id}
                                    onValueChange={(val) => formik.setFieldValue('parent_id', val)}
                                >
                                    <SelectTrigger className="w-full h-10 rounded-lg">
                                        <SelectValue placeholder={t('categories.select-parent-category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            {t('categories.no_parent')}
                                        </SelectItem>
                                        {availableParents.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name_ar} {cat.name_en ? `(${cat.name_en})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Names Grid (Arabic & English) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name_ar" className="text-xs font-semibold">
                                        {t('common.name_ar')} <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name_ar"
                                        name="name_ar"
                                        value={formik.values.name_ar}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="مثال: الحلويات، المشروبات، الأطباق الرئيسية"
                                        className="rounded-lg"
                                    />
                                    {formik.touched.name_ar && formik.errors.name_ar && (
                                        <InputError message={formik.errors.name_ar} />
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="name_en" className="text-xs font-semibold">
                                        {t('common.name_en')}
                                    </Label>
                                    <Input
                                        id="name_en"
                                        name="name_en"
                                        value={formik.values.name_en}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="e.g. Desserts, Beverages, Main Course"
                                        className="rounded-lg"
                                    />
                                    {formik.touched.name_en && formik.errors.name_en && (
                                        <InputError message={formik.errors.name_en} />
                                    )}
                                </div>
                            </div>

                            {/* Category Descriptions (Arabic & English) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="description_ar" className="text-xs font-semibold">
                                        {t('common.description_ar')}
                                    </Label>
                                    <Textarea
                                        id="description_ar"
                                        name="description_ar"
                                        value={formik.values.description_ar}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="وصف اختياري للقسم..."
                                        rows={3}
                                        className="rounded-lg resize-none"
                                    />
                                    {formik.touched.description_ar && formik.errors.description_ar && (
                                        <InputError message={formik.errors.description_ar} />
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="description_en" className="text-xs font-semibold">
                                        {t('common.description_en')}
                                    </Label>
                                    <Textarea
                                        id="description_en"
                                        name="description_en"
                                        value={formik.values.description_en}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Optional description of the category..."
                                        rows={3}
                                        className="rounded-lg resize-none"
                                    />
                                    {formik.touched.description_en && formik.errors.description_en && (
                                        <InputError message={formik.errors.description_en} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pinned Action Buttons Footer */}
                        <DialogFooter className="p-4 border-t shrink-0 bg-background/95 backdrop-blur-xs flex items-center justify-end gap-2 sticky bottom-0">
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
                showDeleteDialog={deleteDialog}
                setshowDeleteDialog={setDeleteDialog}
                handleDelete={handleDeleteCategory}
            />
        </DashboardLayout>
    );
}
