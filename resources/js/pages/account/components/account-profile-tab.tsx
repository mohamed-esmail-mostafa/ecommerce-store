import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Mail, MapPin, Phone, Save, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import useImports from '@/hooks/use-imports';
import { ProfileFormValues } from '@/types/account';
import { User } from '@/types/auth';

interface AccountProfileTabProps {
    user: User;
}

export default function AccountProfileTab({ user }: AccountProfileTabProps) {
    const { t } = useImports();

    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .required(t('validation.name_required', 'Full name is required'))
            .max(255),
        email: Yup.string()
            .trim()
            .email(t('validation.invalid_email', 'Please enter a valid email address'))
            .required(t('validation.email_required', 'Email is required'))
            .max(255),
        phone: Yup.string().trim().nullable().max(20),
        address: Yup.string().trim().nullable().max(500),
    });

    const formik = useFormik<ProfileFormValues>({
        initialValues: {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            router.post('/my/account/profile', values, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        t(
                            'account_page.profile.success',
                            'Your profile information has been updated successfully.'
                        )
                    );
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    if (typeof firstError === 'string') {
                        toast.error(firstError);
                    } else {
                        toast.error(t('common.error_occurred', 'Failed to update profile.'));
                    }
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            });
        },
    });

    return (
        <Card className="border shadow-sm">
            <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <UserIcon className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">
                            {t('account_page.profile.title', 'Personal Information')}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            {t(
                                'account_page.profile.description',
                                'Update your personal identity, contact number, and default delivery address.'
                            )}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <form onSubmit={formik.handleSubmit}>
                <CardContent className="pt-6 space-y-5">
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold">
                                {t('account_page.profile.name', 'Full Name')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t(
                                        'account_page.profile.name_placeholder',
                                        'Enter your full name'
                                    )}
                                    className="ps-9"
                                    disabled={formik.isSubmitting}
                                />
                            </div>
                            <InputError
                                message={
                                    formik.touched.name && formik.errors.name
                                        ? formik.errors.name
                                        : undefined
                                }
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold">
                                {t('account_page.profile.email', 'Email Address')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t(
                                        'account_page.profile.email_placeholder',
                                        'Enter your email address'
                                    )}
                                    className="ps-9"
                                    disabled={formik.isSubmitting}
                                />
                            </div>
                            <InputError
                                message={
                                    formik.touched.email && formik.errors.email
                                        ? formik.errors.email
                                        : undefined
                                }
                            />
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold">
                            {t('account_page.profile.phone', 'Phone Number')}
                        </Label>
                        <div className="relative">
                            <Phone className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="phone"
                                name="phone"
                                type="text"
                                dir="ltr"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t(
                                    'account_page.profile.phone_placeholder',
                                    'e.g. 01012345678'
                                )}
                                className="ps-9 text-start"
                                disabled={formik.isSubmitting}
                            />
                        </div>
                        <InputError
                            message={
                                formik.touched.phone && formik.errors.phone
                                    ? formik.errors.phone
                                    : undefined
                            }
                        />
                    </div>

                    {/* Address Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs font-semibold">
                            {t('account_page.profile.address', 'Default Delivery Address')}
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute start-3 top-3 size-4 text-muted-foreground pointer-events-none" />
                            <Textarea
                                id="address"
                                name="address"
                                rows={3}
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t(
                                    'account_page.profile.address_placeholder',
                                    'Enter street name, building number, apartment, city...'
                                )}
                                className="ps-9 resize-none"
                                disabled={formik.isSubmitting}
                            />
                        </div>
                        <InputError
                            message={
                                formik.touched.address && formik.errors.address
                                    ? formik.errors.address
                                    : undefined
                            }
                        />
                    </div>
                </CardContent>

                <CardFooter className="border-t pt-4 flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting || !formik.dirty}
                        className="min-w-36 gap-2"
                    >
                        <Save className="size-4" />
                        <span>
                            {formik.isSubmitting
                                ? t('account_page.profile.saving_btn', 'Saving Changes...')
                                : t('account_page.profile.save_btn', 'Save Changes')}
                        </span>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
