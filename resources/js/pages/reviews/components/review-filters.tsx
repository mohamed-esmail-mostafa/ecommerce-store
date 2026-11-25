import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { RotateCcw, Search, Star, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useImports from '@/hooks/use-imports';
import { ReviewFilters } from '@/types/review';

interface ReviewFiltersProps {
    filters?: ReviewFilters;
}

export default function ReviewFiltersComponent({ filters }: ReviewFiltersProps) {
    const { t } = useImports();
    const [search, setSearch] = useState<string>(filters?.search || '');
    const currentStatus = filters?.status || 'all';
    const currentRating = filters?.rating || 'all';

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        applyFilters(search, currentStatus, currentRating);
    };

    const handleStatusChange = (statusVal: string) => {
        applyFilters(search, statusVal, currentRating);
    };

    const handleRatingChange = (ratingVal: string) => {
        applyFilters(search, currentStatus, ratingVal);
    };

    const applyFilters = (searchVal: string, statusVal: string, ratingVal: string) => {
        const query: Record<string, string | number> = {};
        if (searchVal.trim()) query.search = searchVal.trim();
        if (statusVal !== 'all') query.status = statusVal;
        if (ratingVal !== 'all') query.rating = ratingVal;

        router.get('/reviews/page', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/reviews/page', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(
        search.trim() || currentStatus !== 'all' || currentRating !== 'all'
    );

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 bg-card p-3 rounded-lg border border-border/70 shadow-xs">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('reviews.search_placeholder', 'Search reviews, comments, customers, or products...')}
                        className="pl-9 pr-8 h-9 text-sm w-full"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                applyFilters('', currentStatus, currentRating);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <Button type="submit" size="sm" variant="secondary" className="h-9 px-3 gap-1.5 shrink-0">
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('common.search', 'Search')}</span>
                </Button>
            </form>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Status Dropdown */}
                <div className="w-36 sm:w-40">
                    <Select value={currentStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger className="h-9 text-xs w-full">
                            <SelectValue placeholder={t('reviews.status', 'Status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('reviews.all_status', 'All Statuses')}</SelectItem>
                            <SelectItem value="approved">
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    {t('reviews.approved', 'Approved')}
                                </span>
                            </SelectItem>
                            <SelectItem value="pending">
                                <span className="text-amber-600 dark:text-amber-400 font-medium">
                                    {t('reviews.pending', 'Pending')}
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rating Dropdown */}
                <div className="w-36 sm:w-40">
                    <Select value={currentRating} onValueChange={handleRatingChange}>
                        <SelectTrigger className="h-9 text-xs w-full">
                            <div className="flex items-center gap-1 truncate">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                <SelectValue placeholder={t('reviews.rating', 'Rating')} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('reviews.all_ratings', 'All Ratings')}</SelectItem>
                            <SelectItem value="5">⭐⭐⭐⭐⭐ (5 {t('reviews.stars_count', 'Stars')})</SelectItem>
                            <SelectItem value="4">⭐⭐⭐⭐ (4 {t('reviews.stars_count', 'Stars')})</SelectItem>
                            <SelectItem value="3">⭐⭐⭐ (3 {t('reviews.stars_count', 'Stars')})</SelectItem>
                            <SelectItem value="2">⭐⭐ (2 {t('reviews.stars_count', 'Stars')})</SelectItem>
                            <SelectItem value="1">⭐ (1 {t('reviews.stars_count', 'Stars')})</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
                        title={t('common.reset', 'Reset filters')}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('common.reset', 'Reset')}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
