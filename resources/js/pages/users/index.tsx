import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Plus, Users } from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import DeleteDialog from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';

import useImports from '@/hooks/use-imports';
import { User, UsersPageProps } from '@/types/user';

import UserStats from './components/user-stats';
import UserFiltersComponent from './components/user-filters';
import UsersTable from './components/users-table';
import UserPagination from './components/user-pagination';
import UserFormModal from './components/user-form-modal';
import ChangeRoleModal from './components/change-role-modal';
import UserDetailsModal from './components/user-details-modal';

export default function UsersPage({ users, roles = [], filters }: UsersPageProps) {
    const { t } = useImports();
    const page = usePage<any>();
    const currentUserId = page.props?.auth?.user?.id;

    // Modals & Active User States
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
    const [roleUser, setRoleUser] = useState<User | null>(null);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteUserItem, setDeleteUserItem] = useState<User | null>(null);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditUser(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditUser(user);
        setFormModalOpen(true);
    };

    const handleOpenChangeRole = (user: User) => {
        setRoleUser(user);
        setChangeRoleModalOpen(true);
    };

    const handleOpenViewDetails = (user: User) => {
        setViewUser(user);
        setDetailsModalOpen(true);
    };

    const handlePromptDelete = (user: User) => {
        if (currentUserId === user.id) {
            toast.error(t('users.cannot_delete_self', 'You cannot delete your own account.'));
            return;
        }
        setDeleteUserItem(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteUserItem) return;

        router.delete(`/users/delete/${deleteUserItem.id}`, {
            onSuccess: () => {
                toast.success(t('users.deleted_success', 'User deleted successfully'));
                setDeleteDialogOpen(false);
                setDeleteUserItem(null);
            },
            onError: (errors) => {
                const errorMsg = errors?.delete || t('common.error', 'Failed to delete user');
                toast.error(errorMsg);
            },
        });
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <PageHeader title={t('users.page_title', 'Users Management')}>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('users.add_user', 'Add User')}
                </Button>
            </PageHeader>

            <div className="container mx-auto px-4 pb-12">
                {/* Metric Summary Cards */}
                <UserStats users={users} roles={roles} />

                {/* Search & Role Filters */}
                <UserFiltersComponent filters={filters} roles={roles} />

                {/* Users Table / Mobile Cards */}
                <UsersTable
                    users={users.data}
                    currentUserId={currentUserId}
                    onEdit={handleOpenEditModal}
                    onChangeRole={handleOpenChangeRole}
                    onView={handleOpenViewDetails}
                    onDelete={handlePromptDelete}
                    onAddUser={handleOpenCreateModal}
                />

                {/* Pagination Controls */}
                <UserPagination users={users} />
            </div>

            {/* Create / Edit User Modal */}
            <UserFormModal
                open={formModalOpen}
                onOpenChange={setFormModalOpen}
                user={editUser}
                roles={roles}
            />

            {/* Change Role Modal */}
            <ChangeRoleModal
                open={changeRoleModalOpen}
                onOpenChange={setChangeRoleModalOpen}
                user={roleUser}
                roles={roles}
            />

            {/* View User Profile Modal */}
            <UserDetailsModal
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
                user={viewUser}
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
