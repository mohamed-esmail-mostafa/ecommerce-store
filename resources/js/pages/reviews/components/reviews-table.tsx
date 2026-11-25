import React from 'react';
import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Edit2,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Package,
    Power,
    Star,
    ThumbsUp,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NoDataFound from '@/components/no-data-found';
import useImports from '@/hooks/use-imports';
import { Review } from '@/types/review';

interface ReviewsTableProps {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onView: (review: Review) => void;
    onDelete: (review: Review) => void;
    onToggleApproval: (review: Review) => void;
}

export default function ReviewsTable({
    reviews,
    onEdit,
    onView,
    onDelete,
    onToggleApproval,
}: ReviewsTableProps) {
    const { t } = useImports();

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        try {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                            star <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-muted-foreground/30'
                        }`}
                    />
                ))}
            </div>
        );
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="py-12 bg-card border border-border/70 rounded-xl shadow-xs">
                <NoDataFound>
                    <p className="text-xs text-muted-foreground mt-2">
                        {t('reviews.no_reviews_desc', 'No customer reviews match your filter criteria.')}
                    </p>
                </NoDataFound>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop & Tablet Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right border-collapse">
                        <thead>
                            <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                <th scope="col" className="px-5 py-3.5">
                                    {t('reviews.product', 'Product')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('reviews.customer', 'Customer')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('reviews.rating', 'Rating & Review')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('reviews.status', 'Status')}
                                </th>
                                <th scope="col" className="px-4 py-3.5">
                                    {t('reviews.created_at', 'Date')}
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-right rtl:text-left">
                                    {t('reviews.actions', 'Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {reviews.map((review) => {
                                const product = review.product;
                                const user = review.user;
                                const firstImage = product?.images?.[0]?.image_url;

                                return (
                                    <tr
                                        key={review.id}
                                        className="hover:bg-muted/30 transition-colors group"
                                    >
                                        {/* Product Cell */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/40 border border-border/60 shrink-0 flex items-center justify-center">
                                                    {firstImage ? (
                                                        <img
                                                            src={firstImage}
                                                            alt={product?.title || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 max-w-[200px]">
                                                    {product ? (
                                                        <Link
                                                            href={`/products/update/${product.slug || product.id}`}
                                                            className="font-semibold text-foreground truncate block hover:text-primary transition-colors"
                                                            title={product.title}
                                                        >
                                                            {product.title}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-xs">
                                                            Product Removed
                                                        </span>
                                                    )}
                                                    {product?.price && (
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            ${product.price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Customer Cell */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="h-8 w-8 ring-1 ring-border shrink-0">
                                                    {user?.avatar && (
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                    )}
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                        {getInitials(user?.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 max-w-[160px]">
                                                    <span className="font-medium text-foreground truncate block text-xs">
                                                        {user?.name || 'Anonymous Customer'}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground truncate block">
                                                        {user?.email || '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Rating & Comment Cell */}
                                        <td className="px-4 py-3.5 max-w-[280px]">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    {renderStars(review.rating)}
                                                    <span className="text-xs font-bold text-foreground">
                                                        {review.rating}.0
                                                    </span>
                                                </div>

                                                {review.title && (
                                                    <p className="font-semibold text-xs text-foreground truncate">
                                                        {review.title}
                                                    </p>
                                                )}

                                                {review.comment && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {review.comment}
                                                    </p>
                                                )}

                                                {review.helpful_count > 0 && (
                                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5">
                                                        <ThumbsUp className="w-3 h-3" />
                                                        <span>{review.helpful_count} helpful</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <Badge
                                                variant={review.is_approved ? 'default' : 'outline'}
                                                onClick={() => onToggleApproval(review)}
                                                className={`text-[11px] font-medium cursor-pointer transition-all gap-1 ${
                                                    review.is_approved
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        : 'text-amber-600 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20'
                                                }`}
                                                title={t('reviews.status_updated', 'Click to toggle approval')}
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
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(review.created_at)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right rtl:text-left">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                                        {t('reviews.actions', 'Actions')}
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => onView(review)} className="gap-2 text-xs">
                                                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {t('reviews.view_details', 'View Details')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onEdit(review)} className="gap-2 text-xs">
                                                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {t('reviews.edit_review', 'Edit Review')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onToggleApproval(review)} className="gap-2 text-xs">
                                                        <Power className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {review.is_approved
                                                            ? t('reviews.reject', 'Unapprove')
                                                            : t('reviews.approve', 'Approve')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(review)}
                                                        className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        {t('reviews.delete_review', 'Delete Review')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
                {reviews.map((review) => {
                    const product = review.product;
                    const user = review.user;
                    const firstImage = product?.images?.[0]?.image_url;

                    return (
                        <Card key={review.id} className="p-4 border border-border/70 shadow-xs bg-card">
                            <CardContent className="p-0 space-y-3">
                                {/* Header: Product & Status */}
                                <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/40 border border-border/60 shrink-0 flex items-center justify-center">
                                            {firstImage ? (
                                                <img
                                                    src={firstImage}
                                                    alt={product?.title || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-xs text-foreground truncate">
                                                {product?.title || 'Product'}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">{user?.name || 'Customer'}</p>
                                        </div>
                                    </div>

                                    <Badge
                                        variant={review.is_approved ? 'default' : 'outline'}
                                        onClick={() => onToggleApproval(review)}
                                        className={`text-[10px] px-2 py-0.5 cursor-pointer shrink-0 ${
                                            review.is_approved
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-amber-600 border-amber-500/40 bg-amber-50/50'
                                        }`}
                                    >
                                        {review.is_approved ? t('reviews.approved', 'Approved') : t('reviews.pending', 'Pending')}
                                    </Badge>
                                </div>

                                {/* Rating & Comment */}
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        {renderStars(review.rating)}
                                        <span className="font-bold text-xs">{review.rating}.0</span>
                                    </div>
                                    {review.title && (
                                        <p className="font-semibold text-xs text-foreground">{review.title}</p>
                                    )}
                                    {review.comment && (
                                        <p className="text-xs text-muted-foreground line-clamp-3">{review.comment}</p>
                                    )}
                                </div>

                                {/* Footer & Actions */}
                                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{formatDate(review.created_at)}</span>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs gap-1"
                                            onClick={() => onView(review)}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            {t('reviews.view_details', 'View')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 text-xs gap-1"
                                            onClick={() => onEdit(review)}
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            {t('common.edit', 'Edit')}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(review)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
