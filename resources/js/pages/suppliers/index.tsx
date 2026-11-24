import React, { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import DeleteDialog from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';

import useImports from '@/hooks/use-imports';
import { Supplier, SuppliersPageProps } from '@/types/supplier';

import SupplierStats from './components/supplier-stats';
import SupplierFiltersComponent from './components/supplier-filters';
import SuppliersTable from './components/suppliers-table';
import SuppliersGrid from './components/suppliers-grid';
import SupplierFormModal from './components/supplier-form-modal';
import SupplierDetailsModal from './components/supplier-details-modal';

export default function SuppliersPage({ suppliers = [], filters }: SuppliersPageProps) {
    const { t } = useImports();

    // View & Filter States
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
        filters?.status || 'all'
    );

    // Modals & Active Supplier States
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteSupplierItem, setDeleteSupplierItem] = useState<Supplier | null>(null);

    // Client-side instant filter (with server fallback)
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            // Status check
            if (statusFilter === 'active' && supplier.is_active === false) {
                return false;
            }
            if (statusFilter === 'inactive' && supplier.is_active !== false) {
                return false;
            }

            // Search query check
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            const nameMatch = supplier.name?.toLowerCase().includes(q);
            const phoneMatch = supplier.phone?.toLowerCase().includes(q);
            const whatsupMatch = supplier.whatsup?.toLowerCase().includes(q);
            const addressMatch = supplier.address?.toLowerCase().includes(q);

            return Boolean(nameMatch || phoneMatch || whatsupMatch || addressMatch);
        });
    }, [suppliers, searchQuery, statusFilter]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditSupplier(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (supplier: Supplier) => {
        setEditSupplier(supplier);
        setFormModalOpen(true);
    };

    const handleOpenViewDetails = (supplier: Supplier) => {
        setViewSupplier(supplier);
        setDetailsModalOpen(true);
    };

    const handlePromptDelete = (supplier: Supplier) => {
        setDeleteSupplierItem(supplier);
        setDeleteDialogOpen(true);
    };

    const handleToggleStatus = (supplier: Supplier) => {
        router.post(`/suppliers/toggle-status/${supplier.slug}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('suppliers.status_updated', 'Supplier status updated successfully'));
            },
            onError: () => {
                toast.error(t('common.error', 'Failed to update supplier status'));
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteSupplierItem) return;

        router.delete(`/supplier/delete/${deleteSupplierItem.slug}`, {
            onSuccess: () => {
                toast.success(t('suppliers.deleted_success', 'Supplier deleted successfully'));
                setDeleteDialogOpen(false);
                setDeleteSupplierItem(null);
            },
            onError: () => {
                toast.error(t('common.error', 'Failed to delete supplier'));
            },
        });
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
    };

    const hasActiveFilters = Boolean(searchQuery.trim() || statusFilter !== 'all');

    return (
        <DashboardLayout>
            {/* Page Header */}
            <PageHeader title={t('suppliers.page_title', 'Suppliers Management')}>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('suppliers.add_supplier', 'Add Supplier')}
                </Button>
            </PageHeader>

            <div className="container mx-auto px-4 pb-12">
                {/* Metric Summary Cards */}
                <SupplierStats suppliers={suppliers} />

                {/* Filter Controls & View Switcher */}
                <SupplierFiltersComponent
                    search={searchQuery}
                    onSearchChange={setSearchQuery}
                    status={statusFilter}
                    onStatusChange={setStatusFilter}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onReset={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Main Content: Grid vs Table View */}
                {viewMode === 'grid' ? (
                    <SuppliersGrid
                        suppliers={filteredSuppliers}
                        onEdit={handleOpenEditModal}
                        onView={handleOpenViewDetails}
                        onDelete={handlePromptDelete}
                        onToggleStatus={handleToggleStatus}
                        onAddSupplier={handleOpenCreateModal}
                    />
                ) : (
                    <SuppliersTable
                        suppliers={filteredSuppliers}
                        onEdit={handleOpenEditModal}
                        onView={handleOpenViewDetails}
                        onDelete={handlePromptDelete}
                        onToggleStatus={handleToggleStatus}
                        onAddSupplier={handleOpenCreateModal}
                    />
                )}
            </div>

            {/* Create / Edit Supplier Modal */}
            <SupplierFormModal
                open={formModalOpen}
                onOpenChange={setFormModalOpen}
                supplier={editSupplier}
            />

            {/* View Supplier Details Modal */}
            <SupplierDetailsModal
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
                supplier={viewSupplier}
                onEdit={handleOpenEditModal}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                showDeleteDialog={deleteDialogOpen}
                setshowDeleteDialog={setDeleteDialogOpen}
                handleDelete={handleConfirmDelete}
            />
        </DashboardLayout>
    );
}
