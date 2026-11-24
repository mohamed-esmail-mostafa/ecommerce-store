import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Building2,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import useImports from '@/hooks/use-imports';
import { Supplier, SupplierFormValues } from '@/types/supplier';

interface SupplierFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier?: Supplier | null;
}

export default function SupplierFormModal({
    open,
    onOpenChange,
    supplier,
}: SupplierFormModalProps) {
    const { t } = useImports();
    const isEdit = Boolean(supplier);

    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .required(t('validation.name_required', 'Supplier name is required'))
            .max(255),
        phone: Yup.string().nullable().max(50),
        address: Yup.string().nullable().max(500),
        whatsup: Yup.string().nullable().max(50),
        is_active: Yup.boolean(),
    });

    const formik = useFormik<SupplierFormValues>({
        initialValues: {
            name: supplier?.name || '',
            phone: supplier?.phone || '',
            address: supplier?.address || '',
            whatsup: supplier?.whatsup || '',
            is_active: supplier?.is_active !== false,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            const payload = {
                name: values.name.trim(),
                phone: values.phone?.trim() || null,
                address: values.address?.trim() || null,
                whatsup: values.whatsup?.trim() || null,
                is_active: values.is_active,
            };

            if (isEdit && supplier) {
                router.post(`/suppliers/update/${supplier.slug}`, payload, {
                    onSuccess: () => {
                        toast.success(t('suppliers.updated_success', 'Supplier updated successfully'));
                        onOpenChange(false);
                        formik.resetForm();
                    },
                    onError: (errors) => {
                        toast.error(t('common.error', 'An error occurred'));
                        Object.keys(errors).forEach((key) => {
                            formik.setFieldError(key as any, errors[key]);
                        });
                    },
                    onFinish: () => setSubmitting(false),
                });
            } else {
                router.post('/suppliers/store', payload, {
                    onSuccess: () => {
                        toast.success(t('suppliers.created_success', 'Supplier created successfully'));
                        onOpenChange(false);
                        formik.resetForm();
                    },
                    onError: (errors) => {
                        toast.error(t('common.error', 'An error occurred'));
                        Object.keys(errors).forEach((key) => {
                            formik.setFieldError(key as any, errors[key]);
                        });
                    },
                    onFinish: () => setSubmitting(false),
                });
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {isEdit
                            ? t('suppliers.edit_supplier', 'Edit Supplier')
                            : t('suppliers.add_supplier', 'Add New Supplier')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? t('suppliers.edit_desc', 'Update partner details, direct contact, and supply status.')
                            : t('suppliers.add_desc', 'Fill in the information below to add a new supplier.')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="supplier_name" className="text-xs font-semibold flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                            {t('suppliers.name', 'Supplier Name')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="supplier_name"
                            name="name"
                            type="text"
                            placeholder="e.g. Apex Global Distributors"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <InputError message={formik.touched.name ? formik.errors.name : undefined} />
                    </div>

                    {/* Phone & WhatsApp Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label htmlFor="supplier_phone" className="text-xs font-semibold flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                {t('suppliers.phone', 'Phone Number')}
                            </Label>
                            <Input
                                id="supplier_phone"
                                name="phone"
                                type="tel"
                                dir="ltr"
                                placeholder="01012345678"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <InputError message={formik.touched.phone ? formik.errors.phone : undefined} />
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-1.5">
                            <Label htmlFor="supplier_whatsup" className="text-xs font-semibold flex items-center gap-1.5">
                                <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                                {t('suppliers.whatsup', 'WhatsApp Number')}
                            </Label>
                            <Input
                                id="supplier_whatsup"
                                name="whatsup"
                                type="tel"
                                dir="ltr"
                                placeholder="01012345678"
                                value={formik.values.whatsup}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <InputError message={formik.touched.whatsup ? formik.errors.whatsup : undefined} />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label htmlFor="supplier_address" className="text-xs font-semibold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            {t('suppliers.address', 'Address')}
                        </Label>
                        <Textarea
                            id="supplier_address"
                            name="address"
                            rows={3}
                            placeholder="Warehouse / Company address, street, city..."
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="resize-none text-sm"
                        />
                        <InputError message={formik.touched.address ? formik.errors.address : undefined} />
                    </div>

                    {/* Active Status Checkbox */}
                    <div className="flex items-center space-x-2 pt-1">
                        <Checkbox
                            id="is_active"
                            checked={formik.values.is_active}
                            onCheckedChange={(checked) => formik.setFieldValue('is_active', Boolean(checked))}
                        />
                        <Label
                            htmlFor="is_active"
                            className="text-xs font-medium cursor-pointer text-foreground"
                        >
                            {t('suppliers.is_active_label', 'Active supplier (can supply products)')}
                        </Label>
                    </div>

                    <DialogFooter className="pt-3 gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={formik.isSubmitting}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={formik.isSubmitting} className="min-w-24">
                            {formik.isSubmitting
                                ? t('common.saving', 'Saving...')
                                : isEdit
                                ? t('common.save', 'Save Changes')
                                : t('common.create', 'Create Supplier')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
