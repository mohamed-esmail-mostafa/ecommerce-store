import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import DeleteDialog from '@/components/delete-dialog';

import useImports from '@/hooks/use-imports';
import { Order, OrdersPageProps } from '@/types/order';

import OrderStats from './components/order-stats';
import OrderFiltersComponent from './components/order-filters';
import OrdersTable from './components/orders-table';
import OrderPagination from './components/order-pagination';
import OrderDetailsModal from './components/order-details-modal';
import OrderStatusModal from './components/order-status-modal';

export default function OrdersPage({ orders, stats, filters }: OrdersPageProps) {
    const { t } = useImports();

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusOrder, setStatusOrder] = useState<Order | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteOrderItem, setDeleteOrderItem] = useState<Order | null>(null);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setDetailsModalOpen(true);
    };

    const handleOpenUpdateStatus = (order: Order) => {
        setStatusOrder(order);
        setStatusModalOpen(true);
    };

    const handleOpenDelete = (order: Order) => {
        setDeleteOrderItem(order);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteOrderItem) return;

        router.delete(`/orders/delete/${deleteOrderItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('orders_page.delete.success', 'Order deleted successfully.'));
                setDeleteDialogOpen(false);
                setDeleteOrderItem(null);
            },
            onError: () => {
                toast.error(t('common.error_occurred', 'Failed to delete order.'));
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={t('orders_page.title', 'Orders Management')} />

            <div className="space-y-6">
                <PageHeader
                    title={t('orders_page.title', 'Orders Management')}
                    description={t(
                        'orders_page.subtitle',
                        'Monitor customer orders, track fulfillment stages, and manage payment statuses.'
                    )}
                    icon={ShoppingBag}
                />

                <OrderStats stats={stats} orders={orders} />

                <OrderFiltersComponent filters={filters} />

                <OrdersTable
                    orders={orders.data}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleOpenUpdateStatus}
                    onDelete={handleOpenDelete}
                />

                <OrderPagination orders={orders} />
            </div>

            <OrderDetailsModal
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
                order={selectedOrder}
                onUpdateStatus={handleOpenUpdateStatus}
            />

            <OrderStatusModal
                open={statusModalOpen}
                onOpenChange={setStatusModalOpen}
                order={statusOrder}
            />

            <DeleteDialog
                showDeleteDialog={deleteDialogOpen}
                setshowDeleteDialog={setDeleteDialogOpen}
                handleDelete={handleConfirmDelete}
            />
        </DashboardLayout>
    );
}
