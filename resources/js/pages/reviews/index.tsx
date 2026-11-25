import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/page-header';
import DeleteDialog from '@/components/delete-dialog';

import useImports from '@/hooks/use-imports';
import { Review, ReviewsPageProps } from '@/types/review';

import ReviewStats from './components/review-stats';
import ReviewFiltersComponent from './components/review-filters';
import ReviewsTable from './components/reviews-table';
import ReviewPagination from './components/review-pagination';
import ReviewDetailsModal from './components/review-details-modal';
import ReviewFormModal from './components/review-form-modal';

export default function ReviewsPage({ reviews, stats, filters }: ReviewsPageProps) {
    const { t } = useImports();

    // Modals & Active Review States
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [viewReview, setViewReview] = useState<Review | null>(null);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editReview, setEditReview] = useState<Review | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteReviewItem, setDeleteReviewItem] = useState<Review | null>(null);

    // Handlers
    const handleOpenViewDetails = (review: Review) => {
        setViewReview(review);
        setDetailsModalOpen(true);
    };

    const handleOpenEdit = (review: Review) => {
        setEditReview(review);
        setFormModalOpen(true);
    };

    const handlePromptDelete = (review: Review) => {
        setDeleteReviewItem(review);
        setDeleteDialogOpen(true);
    };

    const handleToggleApproval = (review: Review) => {
        router.post(
            `/reviews/toggle-approval/${review.id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(t('reviews.status_updated', 'Review approval status updated'));
                },
                onError: () => {
                    toast.error(t('common.error', 'Failed to update review status'));
                },
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteReviewItem) return;

        router.delete(`/reviews/delete/${deleteReviewItem.id}`, {
            onSuccess: () => {
                toast.success(t('reviews.deleted_success', 'Review deleted successfully'));
                setDeleteDialogOpen(false);
                setDeleteReviewItem(null);
            },
            onError: () => {
                toast.error(t('common.error', 'Failed to delete review'));
            },
        });
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <PageHeader title={t('reviews.page_title', 'Reviews Management')}>
                <span className="text-xs text-muted-foreground">
                    {stats?.total || 0} {t('reviews.total_reviews', 'Reviews')}
                </span>
            </PageHeader>

            <div className="container mx-auto px-4 pb-12">
                {/* Metric Summary & Rating Breakdown */}
                {stats && <ReviewStats stats={stats} />}

                {/* Search & Moderation Filters */}
                <ReviewFiltersComponent filters={filters} />

                {/* Reviews Data Table & Mobile Cards */}
                <ReviewsTable
                    reviews={reviews.data}
                    onView={handleOpenViewDetails}
                    onEdit={handleOpenEdit}
                    onDelete={handlePromptDelete}
                    onToggleApproval={handleToggleApproval}
                />

                {/* Pagination */}
                <ReviewPagination reviews={reviews} />
            </div>

            {/* View Review Details Modal */}
            <ReviewDetailsModal
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
                review={viewReview}
                onEdit={handleOpenEdit}
                onToggleApproval={handleToggleApproval}
            />

            {/* Edit Review Modal */}
            <ReviewFormModal
                open={formModalOpen}
                onOpenChange={setFormModalOpen}
                review={editReview}
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
