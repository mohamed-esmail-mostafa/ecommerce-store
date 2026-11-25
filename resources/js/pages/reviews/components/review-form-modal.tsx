import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
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
import { Review, ReviewFormValues } from '@/types/review';

interface ReviewFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review?: Review | null;
}

export default function ReviewFormModal({
    open,
    onOpenChange,
    review,
}: ReviewFormModalProps) {
    const { t } = useImports();

    const validationSchema = Yup.object({
        rating: Yup.number()
            .required(t('validation.rating_required', 'Rating is required'))
            .min(1)
            .max(5),
        title: Yup.string().nullable().max(255),
        comment: Yup.string().nullable().max(2000),
        is_approved: Yup.boolean(),
    });

    const formik = useFormik<ReviewFormValues>({
        initialValues: {
            rating: review?.rating || 5,
            title: review?.title || '',
            comment: review?.comment || '',
            is_approved: review?.is_approved !== false,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            if (!review) return;

            const payload = {
                rating: Number(values.rating),
                title: values.title?.trim() || null,
                comment: values.comment?.trim() || null,
                is_approved: values.is_approved,
            };

            router.post(`/reviews/update/${review.id}`, payload, {
                onSuccess: () => {
                    toast.success(t('reviews.updated_success', 'Review updated successfully'));
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
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        {t('reviews.edit_review', 'Edit Review')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('reviews.edit_desc', 'Adjust customer rating, review text, or approve visibility on product page.')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
                    {/* Interactive Star Rating Selector */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">
                            {t('reviews.rating', 'Rating')} (1 - 5 {t('reviews.stars_count', 'Stars')}) <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex items-center gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => formik.setFieldValue('rating', star)}
                                    className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            star <= formik.values.rating
                                                ? 'text-amber-500 fill-amber-500'
                                                : 'text-muted-foreground/30 hover:text-amber-400'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="text-sm font-bold ml-2 text-foreground">
                                {formik.values.rating} / 5
                            </span>
                        </div>
                        <InputError message={formik.touched.rating ? formik.errors.rating : undefined} />
                    </div>

                    {/* Review Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="review_title" className="text-xs font-semibold">
                            {t('reviews.title', 'Review Title')}
                        </Label>
                        <Input
                            id="review_title"
                            name="title"
                            type="text"
                            placeholder="e.g. Excellent sound and build quality"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <InputError message={formik.touched.title ? formik.errors.title : undefined} />
                    </div>

                    {/* Comment */}
                    <div className="space-y-1.5">
                        <Label htmlFor="review_comment" className="text-xs font-semibold">
                            {t('reviews.comment', 'Customer Comment')}
                        </Label>
                        <Textarea
                            id="review_comment"
                            name="comment"
                            rows={4}
                            placeholder="Full review text..."
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="resize-none text-sm"
                        />
                        <InputError message={formik.touched.comment ? formik.errors.comment : undefined} />
                    </div>

                    {/* Approved Checkbox */}
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="is_approved"
                            checked={formik.values.is_approved}
                            onCheckedChange={(checked) => formik.setFieldValue('is_approved', Boolean(checked))}
                        />
                        <Label
                            htmlFor="is_approved"
                            className="text-xs font-medium cursor-pointer text-foreground"
                        >
                            {t('reviews.is_approved_label', 'Approved and visible on store product page')}
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
                            {formik.isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
