import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { CreditCard, PackageCheck, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useImports from '@/hooks/use-imports';
import { Order } from '@/types/order';

interface OrderStatusModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
}

export default function OrderStatusModal({
    open,
    onOpenChange,
    order,
}: OrderStatusModalProps) {
    const { t } = useImports();

    const formik = useFormik({
        initialValues: {
            status: order?.status || 'pending',
            payement_status: order?.payement_status || 'pending',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            status: Yup.string().required('Order status is required'),
            payement_status: Yup.string().nullable(),
        }),
        onSubmit: (values, { setSubmitting }) => {
            if (!order) return;

            router.post(`/orders/update-status/${order.id}`, values, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        t(
                            'orders_page.status_modal.success',
                            'Order status updated successfully.'
                        )
                    );
                    onOpenChange(false);
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    toast.error(
                        typeof firstError === 'string'
                            ? firstError
                            : t('common.error_occurred', 'Failed to update status.')
                    );
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            });
        },
    });

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-primary" />
                        <span>{t('orders_page.status_modal.title', 'Update Order Status')}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {t('orders_page.status_modal.description', {
                            order_no: order.order_no,
                            defaultValue: `Modify fulfillment and payment status for order ${order.order_no}.`,
                        })}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
                    {/* Fulfillment Status */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-1.5">
                            <PackageCheck className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>
                                {t('orders_page.status_modal.order_status', 'Fulfillment Status')}
                            </span>
                        </Label>
                        <Select
                            value={formik.values.status}
                            onValueChange={(val) => formik.setFieldValue('status', val)}
                            disabled={formik.isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">
                                    {t('orders_page.statuses.pending', 'Pending')}
                                </SelectItem>
                                <SelectItem value="processing">
                                    {t('orders_page.statuses.processing', 'Processing')}
                                </SelectItem>
                                <SelectItem value="shipped">
                                    {t('orders_page.statuses.shipped', 'Shipped')}
                                </SelectItem>
                                <SelectItem value="delivered">
                                    {t('orders_page.statuses.delivered', 'Delivered')}
                                </SelectItem>
                                <SelectItem value="completed">
                                    {t('orders_page.statuses.completed', 'Completed')}
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    {t('orders_page.statuses.cancelled', 'Cancelled')}
                                </SelectItem>
                                <SelectItem value="failed">
                                    {t('orders_page.statuses.failed', 'Failed')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>
                                {t('orders_page.status_modal.payment_status', 'Payment Status')}
                            </span>
                        </Label>
                        <Select
                            value={formik.values.payement_status}
                            onValueChange={(val) => formik.setFieldValue('payement_status', val)}
                            disabled={formik.isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">
                                    {t('orders_page.payment_statuses.pending', 'Unpaid')}
                                </SelectItem>
                                <SelectItem value="paid">
                                    {t('orders_page.payment_statuses.paid', 'Paid')}
                                </SelectItem>
                                <SelectItem value="failed">
                                    {t('orders_page.payment_statuses.failed', 'Failed')}
                                </SelectItem>
                                <SelectItem value="refunded">
                                    {t('orders_page.payment_statuses.refunded', 'Refunded')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={formik.isSubmitting}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="gap-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>
                                {formik.isSubmitting
                                    ? t('orders_page.status_modal.saving', 'Updating...')
                                    : t('orders_page.status_modal.save', 'Save Status')}
                            </span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
