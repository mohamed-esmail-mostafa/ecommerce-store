import React from 'react';
import {
    AlertCircle,
    CheckCircle2,
    MessageSquareQuote,
    Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import useImports from '@/hooks/use-imports';
import { ReviewStats as ReviewStatsType } from '@/types/review';

interface ReviewStatsProps {
    stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
    const { t } = useImports();

    const total = stats.total || 0;
    const avg = stats.average_rating || 0;
    const approved = stats.approved_count || 0;
    const pending = stats.pending_count || 0;

    const topCards = [
        {
            title: t('reviews.total_reviews', 'Total Reviews'),
            value: total.toLocaleString(),
            icon: MessageSquareQuote,
            bgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
            description: t('reviews.all_customer_feedback', 'Total customer feedback submitted'),
        },
        {
            title: t('reviews.average_rating', 'Average Rating'),
            value: `${avg.toFixed(1)} / 5.0`,
            icon: Star,
            bgClass: 'bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400',
            description: `${total > 0 ? t('reviews.based_on', 'Based on {{count}} ratings', { count: total }) : 'No ratings yet'}`,
        },
        {
            title: t('reviews.approved_reviews', 'Approved Reviews'),
            value: approved.toLocaleString(),
            icon: CheckCircle2,
            bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
            description: `${total > 0 ? Math.round((approved / total) * 100) : 0}% ${t('reviews.published', 'visible to public')}`,
        },
        {
            title: t('reviews.pending_reviews', 'Pending Moderation'),
            value: pending.toLocaleString(),
            icon: AlertCircle,
            bgClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
            description: `${pending > 0 ? t('reviews.needs_review', 'Awaiting administrative review') : t('reviews.all_caught_up', 'All caught up!')}`,
        },
    ];

    const breakdown = stats.rating_breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    return (
        <div className="space-y-4 mb-6">
            {/* Top 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topCards.map((card, idx) => {
                    const IconComponent = card.icon;
                    return (
                        <Card
                            key={idx}
                            className="p-4 border border-border/60 shadow-xs hover:border-primary/30 transition-colors"
                        >
                            <CardContent className="p-0 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                                    <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                                    <p className="text-[11px] text-muted-foreground">{card.description}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bgClass}`}>
                                    <IconComponent className="w-5 h-5 fill-current" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Rating Breakdown Distribution Bar */}
            <Card className="p-4 border border-border/60 shadow-xs">
                <CardContent className="p-0 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {t('reviews.rating_breakdown', 'Rating Distribution')}
                        </span>
                        <span className="text-muted-foreground font-normal text-[11px]">
                            {t('reviews.total_ratings', '{{count}} Total Reviews', { count: total })}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-1">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = breakdown[stars as keyof typeof breakdown] || 0;
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={stars} className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-semibold flex items-center gap-1">
                                            {stars} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        </span>
                                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
