import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    ExternalLink,
    Package,
    Power,
    Star,
    ThumbsUp,
    User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import useImports from '@/hooks/use-imports';
import { Review } from '@/types/review';

interface ReviewDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review?: Review | null;
    onEdit?: (review: Review) => void;
    onToggleApproval?: (review: Review) => void;
}

export default function ReviewDetailsModal({
    open,
    onOpenChange,
    review,
    onEdit,
    onToggleApproval,
}: ReviewDetailsModalProps) {
    const { t } = useImports();

    if (!review) return null;

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '—';
        try {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-muted-foreground/30'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const product = review.product;
    const user = review.user;
    const firstImage = product?.images?.[0]?.image_url;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('reviews.view_details', 'Review Details')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Product Summary Header Card */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted/60 border border-border/60 shrink-0 flex items-center justify-center">
                            {firstImage ? (
                                <img
                                    src={firstImage}
                                    alt={product?.title || 'Product'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Package className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            <span className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider block">
                                {t('reviews.product', 'Product')}
                            </span>
                            <h4 className="font-bold text-sm text-foreground truncate">
                                {product?.title || 'Product Unavailable'}
                            </h4>
                            <div className="flex items-center justify-between text-xs">
                                {product?.price && (
                                    <span className="font-semibold text-primary">
                                        ${product.price}
                                    </span>
                                )}
                                {product?.slug && (
                                    <Link
                                        href={`/products/update/${product.slug}`}
                                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                                    >
                                        <span>{t('reviews.view_product', 'View Product')}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Profile & Rating Card */}
                    <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-1 ring-border shrink-0">
                                    {user?.avatar && (
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                    )}
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{user?.name || 'Customer'}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
                                </div>
                            </div>

                            <Badge
                                variant={review.is_approved ? 'default' : 'outline'}
                                className={`text-[11px] gap-1 ${
                                    review.is_approved
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-amber-600 border-amber-500/40 bg-amber-50/50'
                                }`}
                            >
                                {review.is_approved ? (
                                    <>
                                        <CheckCircle2 className="w-3 h-3" />
                                        {t('reviews.approved', 'Approved')}
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3" />
                                        {t('reviews.pending', 'Pending')}
                                    </>
                                )}
                            </Badge>
                        </div>

                        {/* Rating stars & score */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="font-bold text-sm text-foreground">{review.rating}.0 / 5.0</span>
                            </div>
                            {review.helpful_count > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    {review.helpful_count} {t('reviews.helpful_votes', 'helpful')}
                                </span>
                            )}
                        </div>

                        {/* Review Title & Full Comment */}
                        <div className="space-y-1.5 pt-1">
                            {review.title && (
                                <h5 className="font-bold text-sm text-foreground leading-snug">
                                    {review.title}
                                </h5>
                            )}
                            {review.comment ? (
                                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40">
                                    {review.comment}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground/50 italic">
                                    No comment provided.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Metadata Timestamps */}
                    <div className="space-y-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/20 border border-border/40">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {t('reviews.created_at', 'Submitted On')}
                            </span>
                            <span className="font-medium text-foreground">{formatDate(review.created_at)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {t('common.updated_at', 'Last Updated')}
                            </span>
                            <span className="font-medium text-foreground">{formatDate(review.updated_at)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:justify-between">
                    <div>
                        {onToggleApproval && (
                            <Button
                                type="button"
                                variant={review.is_approved ? 'outline' : 'default'}
                                size="sm"
                                onClick={() => {
                                    onToggleApproval(review);
                                }}
                                className="gap-1.5"
                            >
                                <Power className="w-3.5 h-3.5" />
                                {review.is_approved
                                    ? t('reviews.reject', 'Unapprove Review')
                                    : t('reviews.approve', 'Approve Review')}
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>
                            {t('common.close', 'Close')}
                        </Button>
                        {onEdit && (
                            <Button
                                onClick={() => {
                                    onOpenChange(false);
                                    onEdit(review);
                                }}
                                className="gap-1.5"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                {t('reviews.edit_review', 'Edit')}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
