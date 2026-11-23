import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    KeyRound,
    Mail,
    MapPin,
    Phone,
    Shield,
    User as UserIcon,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import useImports from '@/hooks/use-imports';
import { Role } from '@/types/role';
import { User, UserFormValues } from '@/types/user';

interface UserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    roles: Role[];
}

export default function UserFormModal({
    open,
    onOpenChange,
    user,
    roles,
}: UserFormModalProps) {
    const { t } = useImports();
    const isEdit = Boolean(user);

    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .required(t('validation.name_required', 'Name is required'))
            .max(255),
        email: Yup.string()
            .trim()
            .email(t('validation.email_invalid', 'Please enter a valid email address'))
            .required(t('validation.email_required', 'Email is required'))
            .max(255),
        password: isEdit
            ? Yup.string()
                  .nullable()
                  .test('len', t('validation.password_min', 'Password must be at least 8 characters'), (val) => !val || val.length >= 8)
            : Yup.string()
                  .required(t('validation.password_required', 'Password is required'))
                  .min(8, t('validation.password_min', 'Password must be at least 8 characters')),
        phone: Yup.string().nullable().max(50),
        address: Yup.string().nullable().max(500),
        role_id: Yup.string().nullable(),
    });

    const formik = useFormik<UserFormValues>({
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            phone: user?.phone || '',
            address: user?.address || '',
            role_id: user?.role_id ? String(user.role_id) : 'none',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            const payload: Record<string, any> = {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone?.trim() || null,
                address: values.address?.trim() || null,
                role_id: values.role_id === 'none' ? null : Number(values.role_id),
            };

            if (values.password && values.password.trim()) {
                payload.password = values.password.trim();
            }

            if (isEdit && user) {
                router.post(`/users/update/${user.id}`, payload, {
                    onSuccess: () => {
                        toast.success(t('users.updated_success', 'User updated successfully'));
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
                router.post('/users/store', payload, {
                    onSuccess: () => {
                        toast.success(t('users.created_success', 'User created successfully'));
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
                        <UserIcon className="w-5 h-5 text-primary" />
                        {isEdit
                            ? t('users.edit_user', 'Edit User')
                            : t('users.add_user', 'Add New User')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? t('users.edit_user_desc', 'Update personal details, contact information and role for this user.')
                            : t('users.add_user_desc', 'Fill in the information below to create a new user account.')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            {t('users.name', 'Full Name')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. John Doe"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <InputError message={formik.touched.name ? formik.errors.name : undefined} />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            {t('users.email', 'Email Address')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            dir="ltr"
                            placeholder="name@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <InputError message={formik.touched.email ? formik.errors.email : undefined} />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-semibold flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                            {t('users.password', 'Password')} {!isEdit && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            dir="ltr"
                            placeholder={isEdit ? '••••••••' : 'Minimum 8 characters'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {isEdit && (
                            <p className="text-[11px] text-muted-foreground">
                                {t('users.password_edit_help', 'Leave blank if you do not want to change the password')}
                            </p>
                        )}
                        <InputError message={formik.touched.password ? formik.errors.password : undefined} />
                    </div>

                    {/* Role & Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Role */}
                        <div className="space-y-1.5">
                            <Label htmlFor="role_id" className="text-xs font-semibold flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                                {t('users.role', 'Role')}
                            </Label>
                            <Select
                                value={formik.values.role_id}
                                onValueChange={(val) => formik.setFieldValue('role_id', val)}
                            >
                                <SelectTrigger id="role_id" className="w-full">
                                    <SelectValue placeholder={t('users.select_role', 'Select role')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        <span className="text-muted-foreground">
                                            {t('users.no_role', 'No Role Assigned')}
                                        </span>
                                    </SelectItem>
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={String(r.id)}>
                                            {r.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={formik.touched.role_id ? formik.errors.role_id : undefined} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-semibold flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                {t('users.phone', 'Phone Number')}
                            </Label>
                            <Input
                                id="phone"
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
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs font-semibold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            {t('users.address', 'Address')}
                        </Label>
                        <Textarea
                            id="address"
                            name="address"
                            rows={3}
                            placeholder="Full address, street, city..."
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="resize-none text-sm"
                        />
                        <InputError message={formik.touched.address ? formik.errors.address : undefined} />
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
                            {formik.isSubmitting ? t('common.saving', 'Saving...') : isEdit ? t('common.save', 'Save Changes') : t('common.create', 'Create User')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
