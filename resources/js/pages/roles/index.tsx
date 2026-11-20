import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Edit2,
    Hash,
    Plus,
    Search,
    Shield,
    ShieldCheck,
    Trash2,
    Users,
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
import { Role } from '@/types/role';

interface RolesPageProps {
    roles?: Role[];
}

interface RoleFormValues {
    [key: string]: string;
    name: string;
    slug: string;
}

export default function RolesPage({ roles = [] }: RolesPageProps) {
    const { t } = useImports();

    // Modal & Dialog States
    const [showModal, setShowModal] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteRoleItem, setDeleteRoleItem] = useState<Role | null>(null);

    // Search & Find by Slug States
    const [searchQuery, setSearchQuery] = useState('');
    const [findSlugInput, setFindSlugInput] = useState('');
    const [isSearchingSlug, setIsSearchingSlug] = useState(false);

    // Formik & Yup Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .required(t('validation.role_name_required'))
            .max(255),
        slug: Yup.string()
            .trim()
            .nullable()
            .max(255),
    });

    const formik = useFormik<RoleFormValues>({
        initialValues: {
            name: editRole?.name || '',
            slug: editRole?.slug || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            if (editRole) {
                // Update
                router.post(`/roles/update/${editRole.slug}`, values, {
                    onSuccess: () => {
                        toast.success(t('common.saved_success'));
                        setShowModal(false);
                        setEditRole(null);
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
                router.post('/roles/store', values, {
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
        setEditRole(null);
        formik.resetForm({
            values: {
                name: '',
                slug: '',
            },
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (role: Role) => {
        setEditRole(role);
        setShowModal(true);
    };

    const handleDeleteRole = () => {
        if (!deleteRoleItem) return;

        router.delete(`/roles/delete/${deleteRoleItem.slug}`, {
            onSuccess: () => {
                toast.success(t('common.success'));
                setShowDeleteDialog(false);
                setDeleteRoleItem(null);
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    // Find role by slug from backend API
    const handleFindRoleBySlug = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSlug = findSlugInput.trim();
        if (!trimmedSlug) return;

        setIsSearchingSlug(true);
        try {
            const response = await fetch(`/roles/find/${encodeURIComponent(trimmedSlug)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.role) {
                    toast.success(t('roles.role_found'));
                    handleOpenEditModal(data.role);
                } else {
                    toast.error(t('roles.role_not_found'));
                }
            } else {
                toast.error(t('roles.role_not_found'));
            }
        } catch {
            toast.error(t('common.error'));
        } finally {
            setIsSearchingSlug(false);
        }
    };

    // Client-side search filtering
    const filteredRoles = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return roles;

        return roles.filter(
            (role) =>
                role.name.toLowerCase().includes(q) ||
                role.slug.toLowerCase().includes(q)
        );
    }, [roles, searchQuery]);

    return (
        <DashboardLayout>
            {/* Header */}
            <PageHeader title={t('roles.page_title')}>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('roles.add_role')}
                </Button>
            </PageHeader>

            {/* Quick Stats & Search Bar */}
            <div className="container mx-auto px-4 mb-6 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Role Counter */}
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-3 py-1.5 gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            {t('roles.total_roles')}: {roles.length}
                        </Badge>
                    </div>

                    {/* Find by Slug and Live Search */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {/* Find Role by Slug Form */}
                        <form onSubmit={handleFindRoleBySlug} className="flex items-center gap-2">
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('roles.find_slug_placeholder')}
                                    value={findSlugInput}
                                    onChange={(e) => setFindSlugInput(e.target.value)}
                                    className="pl-9 h-9 text-xs rounded-lg w-full sm:w-56"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                variant="secondary"
                                disabled={isSearchingSlug || !findSlugInput.trim()}
                                className="h-9 text-xs"
                            >
                                <Search className="w-3.5 h-3.5 mr-1" />
                                {t('common.search')}
                            </Button>
                        </form>

                        {/* Filter Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder={t('roles.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-xs rounded-lg w-full sm:w-60"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 pb-12">
                {roles.length === 0 ? (
                    <NoDataFound>
                        <div className="mt-4">
                            <Button onClick={handleOpenCreateModal} className="gap-2">
                                <Plus className="w-4 h-4" />
                                {t('roles.add_role')}
                            </Button>
                        </div>
                    </NoDataFound>
                ) : filteredRoles.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed p-8">
                        <p className="text-muted-foreground text-sm">{t('common.no_results')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRoles.map((role) => (
                            <Card
                                key={role.id}
                                className="overflow-hidden border border-border/70 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <CardHeader className="p-4 pb-3 flex flex-row items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Shield className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-base truncate" title={role.name}>
                                                {role.name}
                                            </h3>
                                            <Badge
                                                variant="secondary"
                                                className="text-[11px] font-mono mt-1 px-2 py-0 text-muted-foreground"
                                            >
                                                {role.slug}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-4 py-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Users className="w-3.5 h-3.5 text-primary" />
                                            <span>
                                                {t('roles.users_count', {
                                                    count: role.users_count ?? 0,
                                                })}
                                            </span>
                                        </div>
                                    </CardContent>
                                </div>

                                <CardFooter className="p-4 pt-3 flex items-center justify-end gap-2 border-t border-border/40 bg-muted/10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenEditModal(role)}
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
                                            setDeleteRoleItem(role);
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

            {/* Create / Edit Modal Dialog */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-lg p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2 border-b">
                        <DialogTitle className="text-xl font-bold">
                            {editRole ? t('roles.edit_role') : t('roles.add_role')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {t('roles.page_subtitle')}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
                        {/* Role Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold">
                                {t('roles.name')} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('roles.name_placeholder')}
                                className="rounded-lg"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <InputError message={formik.errors.name} />
                            )}
                        </div>

                        {/* Role Slug */}
                        <div className="space-y-1.5">
                            <Label htmlFor="slug" className="text-xs font-semibold">
                                {t('roles.slug')}
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formik.values.slug}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('roles.slug_placeholder')}
                                className="rounded-lg font-mono text-xs"
                            />
                            {formik.touched.slug && formik.errors.slug && (
                                <InputError message={formik.errors.slug} />
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
                handleDelete={handleDeleteRole}
            />
        </DashboardLayout>
    );
}
