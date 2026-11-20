import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Edit2,
    ExternalLink,
    Eye,
    EyeOff,
    Layers,
    Plus,
    Search,
    Smartphone,
    Sliders,
    Trash2,
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
import { Checkbox } from '@/components/ui/checkbox';
import ImagePicker from '@/components/ui/image-picker';

import useImports from '@/hooks/use-imports';
import { Banner, BannerType } from '@/types/banner';

interface BannersPageProps {
    banners?: Banner[];
}

interface BannerFormValues {
    title: string;
    description: string;
    type: BannerType;
    link: string;
    button_text: string;
    is_active: boolean;
    image: File | string | null;
    mobile_image: File | string | null;
}

export default function BannersPage({ banners = [] }: BannersPageProps) {
    const { t } = useImports();

    // Modal & Dialog States
    const [showModal, setShowModal] = useState(false);
    const [editBanner, setEditBanner] = useState<Banner | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteBannerItem, setDeleteBannerItem] = useState<Banner | null>(null);

    // Filter & Search States
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'slider' | 'section'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Formik & Yup Setup
    const validationSchema = Yup.object({
        type: Yup.string()
            .oneOf(['slider', 'section'], t('validation.type_required'))
            .required(t('validation.type_required')),
        title: Yup.string().nullable().max(255),
        description: Yup.string().nullable().max(1000),
        link: Yup.string().nullable().max(500),
        button_text: Yup.string().nullable().max(100),
        is_active: Yup.boolean(),
        image: Yup.mixed().nullable(),
        mobile_image: Yup.mixed().nullable(),
    });

    const formik = useFormik<BannerFormValues>({
        initialValues: {
            title: editBanner?.title || '',
            description: editBanner?.description || '',
            type: editBanner?.type || 'slider',
            link: editBanner?.link || '',
            button_text: editBanner?.button_text || '',
            is_active: editBanner ? Boolean(editBanner.is_active) : true,
            image: editBanner?.image || null,
            mobile_image: editBanner?.mobile_image || null,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append('type', values.type);
            formData.append('title', values.title || '');
            formData.append('description', values.description || '');
            formData.append('link', values.link || '');
            formData.append('button_text', values.button_text || '');
            formData.append('is_active', values.is_active ? '1' : '0');

            if (values.image instanceof File) {
                formData.append('image', values.image);
            } else if (typeof values.image === 'string') {
                formData.append('image', values.image);
            } else if (values.image === null) {
                formData.append('image', '');
            }

            if (values.mobile_image instanceof File) {
                formData.append('mobile_image', values.mobile_image);
            } else if (typeof values.mobile_image === 'string') {
                formData.append('mobile_image', values.mobile_image);
            } else if (values.mobile_image === null) {
                formData.append('mobile_image', '');
            }

            if (editBanner) {
                // Update
                router.post(`/banners/update/${editBanner.id}`, formData, {
                    onSuccess: () => {
                        toast.success(t('common.saved_success'));
                        setShowModal(false);
                        setEditBanner(null);
                        formik.resetForm();
                    },
                    onError: (errors) => {
                        toast.error(t('common.error'));
                        Object.keys(errors).forEach((key) => {
                            formik.setFieldError(key, errors[key]);
                        });
                    },
                    onFinish: () => setSubmitting(false),
                });
            } else {
                // Create
                router.post('/banners/store', formData, {
                    onSuccess: () => {
                        toast.success(t('common.saved_success'));
                        setShowModal(false);
                        formik.resetForm();
                    },
                    onError: (errors) => {
                        toast.error(t('common.error'));
                        Object.keys(errors).forEach((key) => {
                            formik.setFieldError(key, errors[key]);
                        });
                    },
                    onFinish: () => setSubmitting(false),
                });
            }
        },
    });

    const handleOpenCreateModal = () => {
        setEditBanner(null);
        formik.resetForm({
            values: {
                title: '',
                description: '',
                type: 'slider',
                link: '',
                button_text: '',
                is_active: true,
                image: null,
                mobile_image: null,
            },
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (banner: Banner) => {
        setEditBanner(banner);
        setShowModal(true);
    };

    const handleDeleteBanner = () => {
        if (!deleteBannerItem) return;

        router.delete(`/banners/delete/${deleteBannerItem.id}`, {
            onSuccess: () => {
                toast.success(t('common.success'));
                setShowDeleteDialog(false);
                setDeleteBannerItem(null);
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    const handleToggleStatus = (banner: Banner) => {
        router.patch(`/banners/toggle/${banner.id}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('common.saved_success'));
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    // Filtered banners
    const filteredBanners = useMemo(() => {
        return banners.filter((banner) => {
            const matchesType =
                selectedTypeFilter === 'all' ? true : banner.type === selectedTypeFilter;

            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                (banner.title && banner.title.toLowerCase().includes(q)) ||
                (banner.description && banner.description.toLowerCase().includes(q)) ||
                (banner.link && banner.link.toLowerCase().includes(q));

            return matchesType && matchesSearch;
        });
    }, [banners, selectedTypeFilter, searchQuery]);

    const totalCount = banners.length;
    const activeCount = banners.filter((b) => b.is_active).length;
    const sliderCount = banners.filter((b) => b.type === 'slider').length;
    const sectionCount = banners.filter((b) => b.type === 'section').length;

    return (
        <DashboardLayout>
            {/* Header */}
            <PageHeader title={t('banners.page_title')}>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('banners.add_banner')}
                </Button>
            </PageHeader>

            {/* Quick Stats & Filters */}
            <div className="container mx-auto px-4 mb-6 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedTypeFilter === 'all' ? 'default' : 'outline'}
                            onClick={() => setSelectedTypeFilter('all')}
                            className="rounded-lg text-xs"
                        >
                            <Layers className="w-3.5 h-3.5 mr-1" />
                            {t('banners.all_types')} ({totalCount})
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedTypeFilter === 'slider' ? 'default' : 'outline'}
                            onClick={() => setSelectedTypeFilter('slider')}
                            className="rounded-lg text-xs"
                        >
                            <Sliders className="w-3.5 h-3.5 mr-1" />
                            {t('banners.sliders')} ({sliderCount})
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedTypeFilter === 'section' ? 'default' : 'outline'}
                            onClick={() => setSelectedTypeFilter('section')}
                            className="rounded-lg text-xs"
                        >
                            <Layers className="w-3.5 h-3.5 mr-1" />
                            {t('banners.sections')} ({sectionCount})
                        </Button>
                    </div>

                    {/* Search & Active Counter */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs px-2.5 py-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5" />
                            {t('banners.active_banners')}: {activeCount}
                        </Badge>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder={t('common.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-xs rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 pb-12">
                {banners.length === 0 ? (
                    <NoDataFound>
                        <div className="mt-4">
                            <Button onClick={handleOpenCreateModal} className="gap-2">
                                <Plus className="w-4 h-4" />
                                {t('banners.add_banner')}
                            </Button>
                        </div>
                    </NoDataFound>
                ) : filteredBanners.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed p-8">
                        <p className="text-muted-foreground text-sm">{t('common.no_results')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredBanners.map((banner) => (
                            <Card
                                key={banner.id}
                                className="overflow-hidden border border-border/70 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Banner Image Preview Header */}
                                    <CardHeader className="p-0 relative group aspect-[16/8] bg-muted/30 overflow-hidden">
                                        {banner.image ? (
                                            <img
                                                src={banner.image}
                                                alt={banner.title || 'Banner'}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <NoImage />
                                        )}

                                        {/* Badges Overlay */}
                                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                                            <Badge
                                                variant={banner.type === 'slider' ? 'default' : 'secondary'}
                                                className="text-xs font-semibold backdrop-blur-md shadow-sm"
                                            >
                                                {banner.type === 'slider'
                                                    ? t('banners.slider_badge')
                                                    : t('banners.section_badge')}
                                            </Badge>

                                            <div className="flex items-center gap-1.5">
                                                {banner.mobile_image && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-black/60 text-white border-white/20 text-xs backdrop-blur-md px-1.5"
                                                        title={t('banners.mobile_image')}
                                                    >
                                                        <Smartphone className="w-3 h-3" />
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant={banner.is_active ? 'default' : 'destructive'}
                                                    className={`text-xs font-medium shadow-sm ${
                                                        banner.is_active
                                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                            : ''
                                                    }`}
                                                >
                                                    {banner.is_active
                                                        ? t('banners.status_active')
                                                        : t('banners.status_inactive')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {/* Card Content */}
                                    <CardContent className="p-4 space-y-2.5">
                                        <div>
                                            <h3 className="font-semibold text-base line-clamp-1">
                                                {banner.title || (
                                                    <span className="text-muted-foreground italic">
                                                        ({t('banners.title')})
                                                    </span>
                                                )}
                                            </h3>
                                            {banner.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                    {banner.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Link & CTA Info */}
                                        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs border-t border-border/50">
                                            {banner.button_text && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                                    {banner.button_text}
                                                </span>
                                            )}
                                            {banner.link && (
                                                <a
                                                    href={banner.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors max-w-[200px] truncate"
                                                    title={banner.link}
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1 shrink-0" />
                                                    <span className="truncate">{banner.link}</span>
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </div>

                                {/* Card Footer Actions */}
                                <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-border/40 bg-muted/10">
                                    {/* Toggle Active Status */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleStatus(banner)}
                                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                                        title={
                                            banner.is_active
                                                ? t('banners.status_inactive')
                                                : t('banners.status_active')
                                        }
                                    >
                                        {banner.is_active ? (
                                            <>
                                                <EyeOff className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                                {t('banners.status_inactive')}
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                                {t('banners.status_active')}
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenEditModal(banner)}
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
                                                setDeleteBannerItem(banner);
                                                setShowDeleteDialog(true);
                                            }}
                                            className="h-8 px-3 text-xs gap-1.5"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            {t('common.delete')}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal Dialog */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2 border-b">
                        <DialogTitle className="text-xl font-bold">
                            {editBanner ? t('banners.edit_banner') : t('banners.add_banner')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {t('banners.page_subtitle')}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={formik.handleSubmit}
                        className="overflow-y-auto flex-1 p-6 space-y-5"
                        encType="multipart/form-data"
                    >
                        {/* Banner Type Selection */}
                        <div className="space-y-1.5">
                            <Label htmlFor="type" className="text-xs font-semibold">
                                {t('banners.type')} <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formik.values.type}
                                onValueChange={(val: BannerType) => formik.setFieldValue('type', val)}
                            >
                                <SelectTrigger className="w-full h-10 rounded-lg">
                                    <SelectValue placeholder={t('banners.select_type')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="slider">
                                        {t('banners.type_slider')}
                                    </SelectItem>
                                    <SelectItem value="section">
                                        {t('banners.type_section')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {formik.touched.type && formik.errors.type && (
                                <InputError message={formik.errors.type as string} />
                            )}
                        </div>

                        {/* Images Upload: Desktop & Mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <ImagePicker
                                    id="banner-desktop-image"
                                    label={t('banners.desktop_image')}
                                    initialPreview={
                                        typeof formik.values.image === 'string'
                                            ? formik.values.image
                                            : null
                                    }
                                    onChange={(file) => formik.setFieldValue('image', file)}
                                    error={
                                        formik.touched.image && formik.errors.image
                                            ? (formik.errors.image as string)
                                            : undefined
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <ImagePicker
                                    id="banner-mobile-image"
                                    label={t('banners.mobile_image')}
                                    initialPreview={
                                        typeof formik.values.mobile_image === 'string'
                                            ? formik.values.mobile_image
                                            : null
                                    }
                                    onChange={(file) => formik.setFieldValue('mobile_image', file)}
                                    error={
                                        formik.touched.mobile_image && formik.errors.mobile_image
                                            ? (formik.errors.mobile_image as string)
                                            : undefined
                                    }
                                />
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-xs font-semibold">
                                {t('banners.title')}
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('banners.title_placeholder')}
                                className="rounded-lg"
                            />
                            {formik.touched.title && formik.errors.title && (
                                <InputError message={formik.errors.title} />
                            )}
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-semibold">
                                {t('banners.description')}
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('banners.description_placeholder')}
                                rows={3}
                                className="rounded-lg resize-none"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <InputError message={formik.errors.description} />
                            )}
                        </div>

                        {/* Link & Button Text Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="link" className="text-xs font-semibold">
                                    {t('banners.link')}
                                </Label>
                                <Input
                                    id="link"
                                    name="link"
                                    value={formik.values.link}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t('banners.link_placeholder')}
                                    className="rounded-lg"
                                />
                                {formik.touched.link && formik.errors.link && (
                                    <InputError message={formik.errors.link} />
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="button_text" className="text-xs font-semibold">
                                    {t('banners.button_text')}
                                </Label>
                                <Input
                                    id="button_text"
                                    name="button_text"
                                    value={formik.values.button_text}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t('banners.button_text_placeholder')}
                                    className="rounded-lg"
                                />
                                {formik.touched.button_text && formik.errors.button_text && (
                                    <InputError message={formik.errors.button_text} />
                                )}
                            </div>
                        </div>

                        {/* Active Status Checkbox */}
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="is_active"
                                checked={formik.values.is_active}
                                onCheckedChange={(checked) =>
                                    formik.setFieldValue('is_active', Boolean(checked))
                                }
                            />
                            <Label htmlFor="is_active" className="text-xs font-medium cursor-pointer">
                                {t('banners.is_active_label')}
                            </Label>
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
                handleDelete={handleDeleteBanner}
            />
        </DashboardLayout>
    );
}
