import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';
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
import InputError from '@/components/input-error';
import useImports from '@/hooks/use-imports';
import { PasswordFormValues } from '@/types/account';

export default function AccountPasswordTab() {
    const { t } = useImports();

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validationSchema = Yup.object({
        current_password: Yup.string()
            .required(
                t(
                    'validation.current_password_required',
                    'Current password is required'
                )
            ),
        password: Yup.string()
            .required(t('validation.password_required', 'New password is required'))
            .min(
                8,
                t(
                    'validation.password_min',
                    'New password must be at least 8 characters'
                )
            ),
        password_confirmation: Yup.string()
            .required(
                t(
                    'validation.confirm_password_required',
                    'Please confirm your new password'
                )
            )
            .oneOf(
                [Yup.ref('password')],
                t('validation.passwords_must_match', 'Passwords must match')
            ),
    });

    const formik = useFormik<PasswordFormValues>({
        initialValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            router.post('/my/account/password', values, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        t(
                            'account_page.security.success',
                            'Your password has been updated successfully.'
                        )
                    );
                    resetForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    if (typeof firstError === 'string') {
                        toast.error(firstError);
                    } else {
                        toast.error(
                            t('common.error_occurred', 'Failed to update password.')
                        );
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
                        <Lock className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">
                            {t('account_page.security.title', 'Password & Security')}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            {t(
                                'account_page.security.description',
                                'Ensure your account is protected with a strong and secure password.'
                            )}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <form onSubmit={formik.handleSubmit}>
                <CardContent className="pt-6 space-y-5">
                    {/* Current Password Field */}
                    <div className="space-y-1.5 max-w-lg">
                        <Label htmlFor="current_password" className="text-xs font-semibold">
                            {t('account_page.security.current_password', 'Current Password')}{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="current_password"
                                name="current_password"
                                type={showCurrent ? 'text' : 'password'}
                                value={formik.values.current_password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t(
                                    'account_page.security.current_password_placeholder',
                                    'Enter your current password'
                                )}
                                className="ps-9 pe-10"
                                disabled={formik.isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showCurrent ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                        <InputError
                            message={
                                formik.touched.current_password && formik.errors.current_password
                                    ? formik.errors.current_password
                                    : undefined
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        {/* New Password Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold">
                                {t('account_page.security.new_password', 'New Password')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showNew ? 'text' : 'password'}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t(
                                        'account_page.security.new_password_placeholder',
                                        'Enter new password'
                                    )}
                                    className="ps-9 pe-10"
                                    disabled={formik.isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showNew ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={
                                    formik.touched.password && formik.errors.password
                                        ? formik.errors.password
                                        : undefined
                                }
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs font-semibold">
                                {t(
                                    'account_page.security.confirm_password',
                                    'Confirm New Password'
                                )}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={formik.values.password_confirmation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t(
                                        'account_page.security.confirm_password_placeholder',
                                        'Confirm new password'
                                    )}
                                    className="ps-9 pe-10"
                                    disabled={formik.isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={
                                    formik.touched.password_confirmation &&
                                    formik.errors.password_confirmation
                                        ? formik.errors.password_confirmation
                                        : undefined
                                }
                            />
                        </div>
                    </div>

                    {/* Password Requirements Hint */}
                    <div className="p-3.5 rounded-xl bg-muted/50 border flex items-start gap-3 max-w-2xl">
                        <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-xs text-muted-foreground space-y-0.5">
                            <p className="font-semibold text-foreground">
                                {t('account_page.security.title', 'Security Requirement')}
                            </p>
                            <p>
                                {t(
                                    'account_page.security.hint',
                                    'Password should contain at least 8 characters, including a mix of letters and numbers.'
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="border-t pt-4 flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting || !formik.dirty}
                        className="min-w-36 gap-2"
                    >
                        <Lock className="size-4" />
                        <span>
                            {formik.isSubmitting
                                ? t('account_page.security.updating_btn', 'Updating Password...')
                                : t('account_page.security.update_btn', 'Update Password')}
                        </span>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
