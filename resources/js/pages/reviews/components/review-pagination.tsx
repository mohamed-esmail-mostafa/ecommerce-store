import React from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import { Pagination } from '@/types/pagination';
import { Review } from '@/types/review';

interface ReviewPaginationProps {
    reviews: Pagination<Review>;
}

export default function ReviewPagination({ reviews }: ReviewPaginationProps) {
    const { t } = useImports();

    if (!reviews.data || reviews.data.length === 0) {
        return null;
    }

    const changePage = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const from = reviews.from ?? (reviews.current_page - 1) * reviews.per_page + 1;
    const to = reviews.to ?? Math.min(reviews.current_page * reviews.per_page, reviews.total);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border/60">
            <div className="text-xs text-muted-foreground">
                {t('common.showing', 'Showing')}{' '}
                <span className="font-semibold text-foreground">{from}</span>{' '}
                {t('common.to', 'to')}{' '}
                <span className="font-semibold text-foreground">{to}</span>{' '}
                {t('common.of', 'of')}{' '}
                <span className="font-semibold text-foreground">{reviews.total}</span>{' '}
                {t('reviews.total_reviews', 'reviews')}
            </div>

            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs gap-1"
                    disabled={!reviews.prev_page_url}
                    onClick={() => changePage(reviews.prev_page_url)}
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('common.previous', 'Previous')}</span>
                </Button>

                {/* Page link numbers */}
                <div className="flex items-center gap-1">
                    {reviews.links?.slice(1, -1).map((link, idx) => {
                        const isDots = link.label.includes('...');
                        if (isDots) {
                            return (
                                <span key={idx} className="px-2 text-xs text-muted-foreground select-none">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className={`h-8 w-8 p-0 text-xs ${
                                    link.active ? 'pointer-events-none font-bold' : ''
                                }`}
                                onClick={() => changePage(link.url)}
                                disabled={!link.url}
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs gap-1"
                    disabled={!reviews.next_page_url}
                    onClick={() => changePage(reviews.next_page_url)}
                >
                    <span className="hidden sm:inline">{t('common.next', 'Next')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    );
}
