import React, { useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    ChevronRight,
    FileText,
    Home,
    Info,
    ListChecks,
    MessageSquare,
    Package,
    RotateCcw,
    Send,
    ShieldCheck,
    Star,
    Truck,
    User,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useImports from '@/hooks/use-imports';
import UserLayout from '@/layouts/user-layout';
import { Product } from '@/types/product';
import ProductDetailsInfo from './components/product-details-info';
import ProductGallery from './components/product-gallery';

type TabKey = 'description' | 'reviews' | 'specifications' | 'shipping';

export default function ProductDetailsPage({ product }: { product: Product }) {
    const { t, isArabic } = useImports();
    const [activeTab, setActiveTab] = useState<TabKey>('description');
    const tabsRef = useRef<HTMLDivElement>(null);

    // Review Form State
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    // Rating label helper
    const getRatingLabel = (score: number) => {
        switch (score) {
            case 5:
                return t('products.rating_excellent', '5 - Excellent');
            case 4:
                return t('products.rating_good', '4 - Very Good');
            case 3:
                return t('products.rating_average', '3 - Average');
            case 2:
                return t('products.rating_fair', '2 - Fair');
            case 1:
                return t('products.rating_poor', '1 - Poor');
            default:
                return '';
        }
    };

    const handleOpenReviews = () => {
        setActiveTab('reviews');
        if (tabsRef.current) {
            tabsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !reviewerName.trim() ||
            !reviewerEmail.trim() ||
            !reviewComment.trim()
        ) {
            toast.error(
                t(
                    'products.fill_required_fields',
                    'Please fill in all required fields.',
                ),
            );
            return;
        }

        setIsSubmittingReview(true);

        // Simulate review submission (future backend integration)
        setTimeout(() => {
            setIsSubmittingReview(false);
            setReviewSubmitted(true);
            toast.success(
                t(
                    'products.review_submitted',
                    'Thank you! Your review has been submitted for approval.',
                ),
            );
            setReviewTitle('');
            setReviewComment('');
        }, 800);
    };

    const categoryName = isArabic
        ? product.category?.name_ar
        : product.category?.name_en || product.category?.name_ar;

    const brandName =
        product.brandModel?.name || product.brand_model?.name || product.brand;

    return (
        <UserLayout>
            <Head title={`${product.title} — Shopella`} />

            <div className="border-b border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/30">
                <div className="container mx-auto px-4 py-3">
                    {/* Breadcrumb Navigation */}
                    <nav
                        aria-label="Breadcrumb"
                        className="flex scrollbar-none items-center overflow-x-auto py-1 text-xs whitespace-nowrap text-neutral-500 sm:text-sm"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                        >
                            <Home className="h-3.5 w-3.5" />
                            <span>{t('common.home')}</span>
                        </Link>

                        <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />

                        <Link
                            href="/shop"
                            className="transition-colors hover:text-primary"
                        >
                            {t('common.shop')}
                        </Link>

                        {categoryName && (
                            <>
                                <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />
                                <Link
                                    href={
                                        product.category
                                            ? `/categories?category=${product.category.slug}`
                                            : '#'
                                    }
                                    className="transition-colors hover:text-primary"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}

                        <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-400 rtl:rotate-180" />
                        <span className="max-w-[220px] truncate font-semibold text-neutral-800 sm:max-w-md dark:text-neutral-200">
                            {product.title}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Top Product Section: Gallery + Details Info */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Gallery (5 cols on lg) */}
                    <div className="lg:sticky lg:top-24 lg:col-span-5">
                        <ProductGallery product={product} />
                    </div>

                    {/* Right Column: Info & Actions (7 cols on lg) */}
                    <div className="lg:col-span-7">
                        <ProductDetailsInfo
                            product={product}
                            onOpenReviews={handleOpenReviews}
                        />
                    </div>
                </div>

                {/* Bottom Section: Tabs */}
                <div ref={tabsRef} className="mt-14 scroll-mt-24 lg:mt-20">
                    {/* Tab Navigation Buttons */}
                    <div className="flex scrollbar-none items-center justify-start gap-2 overflow-x-auto border-b border-neutral-200 pb-px sm:justify-center sm:gap-8 dark:border-neutral-800">
                        {/* Description Tab */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('description')}
                            className={`flex cursor-pointer items-center gap-2 border-b-2 px-3 py-4 text-sm font-bold whitespace-nowrap transition-all sm:px-4 sm:text-base ${
                                activeTab === 'description'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                        >
                            <FileText className="h-4 w-4" />
                            <span>
                                {t('products.tab_description', 'Description')}
                            </span>
                        </button>

                        {/* Reviews Tab */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            className={`flex cursor-pointer items-center gap-2 border-b-2 px-3 py-4 text-sm font-bold whitespace-nowrap transition-all sm:px-4 sm:text-base ${
                                activeTab === 'reviews'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>{t('products.tab_reviews', 'Reviews')}</span>
                            <Badge
                                variant="secondary"
                                className="rounded-full px-2 py-0.5 text-xs"
                            >
                                0
                            </Badge>
                        </button>

                        {/* Specifications Tab */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('specifications')}
                            className={`flex cursor-pointer items-center gap-2 border-b-2 px-3 py-4 text-sm font-bold whitespace-nowrap transition-all sm:px-4 sm:text-base ${
                                activeTab === 'specifications'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                        >
                            <ListChecks className="h-4 w-4" />
                            <span>
                                {t(
                                    'products.tab_specifications',
                                    'Specifications',
                                )}
                            </span>
                        </button>

                        {/* Shipping & Returns Tab */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('shipping')}
                            className={`flex cursor-pointer items-center gap-2 border-b-2 px-3 py-4 text-sm font-bold whitespace-nowrap transition-all sm:px-4 sm:text-base ${
                                activeTab === 'shipping'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                        >
                            <Truck className="h-4 w-4" />
                            <span>
                                {t(
                                    'products.tab_shipping',
                                    'Shipping & Returns',
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="py-8 lg:py-10">
                        {/* 1. Long Description Tab (Formatted HTML / Rich Text) */}
                        {activeTab === 'description' && (
                            <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8 lg:p-10 dark:border-neutral-800 dark:bg-neutral-900">
                                <h3 className="mb-6 border-b border-neutral-200/80 pb-4 text-xl font-bold text-neutral-900 sm:text-2xl dark:border-neutral-800 dark:text-neutral-100">
                                    {t(
                                        'products.about_product',
                                        'Product Overview',
                                    )}
                                </h3>

                                {product.long_description ? (
                                    <div
                                        className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed text-neutral-700 dark:text-neutral-300 [&_a]:text-primary [&_a]:underline [&_a:hover]:opacity-80 [&_blockquote]:my-4 [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:ps-4 [&_blockquote]:italic [&_h1]:text-2xl [&_h1,&_h2,&_h3]:mt-6 [&_h1,&_h2,&_h3]:mb-3 [&_h1,&_h2,&_h3]:font-bold [&_h2]:text-xl [&_h3]:text-lg [&_li]:my-1.5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:my-3 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-neutral-900 dark:[&_strong]:text-neutral-100 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-neutral-50 dark:[&_th]:bg-neutral-900 [&_th,&_td]:border [&_th,&_td]:border-neutral-200 [&_th,&_td]:p-3 dark:[&_th,&_td]:border-neutral-800 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6"
                                        dangerouslySetInnerHTML={{
                                            __html: product.long_description,
                                        }}
                                    />
                                ) : product.description ? (
                                    <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                                        {product.description}
                                    </p>
                                ) : (
                                    <div className="py-10 text-center text-neutral-400">
                                        <Info className="mx-auto mb-2 h-10 w-10 opacity-50" />
                                        <p className="text-sm">
                                            {t(
                                                'products.no_detailed_description',
                                                'No detailed description available for this product.',
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. Customer Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="mx-auto max-w-5xl space-y-10">
                                {/* Reviews Summary Grid */}
                                <div className="grid grid-cols-1 gap-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8 md:grid-cols-12 dark:border-neutral-800 dark:bg-neutral-900">
                                    {/* Left Column: Average Score */}
                                    <div className="flex flex-col items-center justify-center border-b border-neutral-200 p-6 text-center md:col-span-5 md:border-e md:border-b-0 dark:border-neutral-800">
                                        <div className="mb-2 text-5xl font-black text-neutral-900 dark:text-neutral-50">
                                            5.0
                                        </div>
                                        <div className="mb-2 flex items-center gap-1 text-amber-400">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="h-5 w-5 fill-amber-400 text-amber-400"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium text-neutral-500">
                                            {t(
                                                'products.based_on_reviews',
                                                'Based on 0 customer reviews',
                                            )}
                                        </p>
                                        <span className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            100%{' '}
                                            {t(
                                                'products.recommended',
                                                'of buyers recommend this product',
                                            )}
                                        </span>
                                    </div>

                                    {/* Right Column: Breakdown Bars */}
                                    <div className="flex flex-col justify-center space-y-2.5 md:col-span-7">
                                        {[
                                            { star: 5, pct: 100, count: 0 },
                                            { star: 4, pct: 0, count: 0 },
                                            { star: 3, pct: 0, count: 0 },
                                            { star: 2, pct: 0, count: 0 },
                                            { star: 1, pct: 0, count: 0 },
                                        ].map((row) => (
                                            <div
                                                key={row.star}
                                                className="flex items-center gap-3 text-xs sm:text-sm"
                                            >
                                                <span className="flex w-12 items-center gap-1 font-medium text-neutral-600 dark:text-neutral-400">
                                                    {row.star}{' '}
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                </span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    <div
                                                        className="h-full rounded-full bg-amber-400"
                                                        style={{
                                                            width: `${row.pct}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-8 text-end font-mono text-xs text-neutral-400">
                                                    {row.pct}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reviews List & Write Review Form Layout */}
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                    {/* Reviews List (7 cols) */}
                                    <div className="space-y-6 lg:col-span-7">
                                        <h4 className="flex items-center justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                            <span>
                                                {t(
                                                    'products.recent_reviews',
                                                    'Customer Feedback',
                                                )}
                                            </span>
                                            <span className="text-xs font-normal text-neutral-500">
                                                {t(
                                                    'products.showing_reviews',
                                                    'Showing 1 review preview',
                                                )}
                                            </span>
                                        </h4>

                                        {/* Verified Review Preview Card */}
                                        <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                        A
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                                Ahmed K.
                                                            </span>
                                                            <Badge className="border-emerald-200 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-medium text-emerald-600">
                                                                <CheckCircle2 className="me-1 h-2.5 w-2.5" />
                                                                {t(
                                                                    'products.verified_purchase',
                                                                    'Verified Buyer',
                                                                )}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-xs text-neutral-400">
                                                            2 days ago
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-amber-400">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="mb-1 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                    Exceptional product & quick
                                                    delivery!
                                                </h5>
                                                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                                                    The item arrived securely
                                                    packaged and exactly as
                                                    described. The quality is
                                                    outstanding, highly
                                                    recommend to anyone
                                                    considering purchasing!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="rounded-xl bg-neutral-100/60 p-4 text-center text-xs text-neutral-500 dark:bg-neutral-800/40">
                                            {t(
                                                'products.reviews_future_note',
                                                'Live customer review moderation and pagination will be connected soon.',
                                            )}
                                        </div>
                                    </div>

                                    {/* Write a Review Form (5 cols) */}
                                    <div className="lg:col-span-5">
                                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
                                            <h4 className="mb-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                {t(
                                                    'products.write_review',
                                                    'Write a Review',
                                                )}
                                            </h4>
                                            <p className="mb-6 text-xs text-neutral-500">
                                                {t(
                                                    'products.review_guide',
                                                    'Share your honest feedback to help other shoppers.',
                                                )}
                                            </p>

                                            {reviewSubmitted ? (
                                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-800/60 dark:bg-emerald-950/40">
                                                    <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-emerald-500" />
                                                    <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                                                        {t(
                                                            'products.review_thanks',
                                                            'Thank you for your review!',
                                                        )}
                                                    </h5>
                                                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                        {t(
                                                            'products.review_under_review',
                                                            'Your review has been submitted and is awaiting approval.',
                                                        )}
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setReviewSubmitted(
                                                                false,
                                                            )
                                                        }
                                                        className="mt-4 text-xs"
                                                    >
                                                        {t(
                                                            'products.write_another_review',
                                                            'Write Another Review',
                                                        )}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <form
                                                    onSubmit={
                                                        handleReviewSubmit
                                                    }
                                                    className="space-y-4"
                                                >
                                                    {/* Rating selector */}
                                                    <div>
                                                        <Label className="mb-1.5 block text-xs font-semibold">
                                                            {t(
                                                                'products.your_rating',
                                                                'Overall Rating',
                                                            )}{' '}
                                                            *
                                                        </Label>
                                                        <div className="flex items-center gap-1.5">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <button
                                                                    type="button"
                                                                    key={star}
                                                                    onClick={() =>
                                                                        setReviewRating(
                                                                            star,
                                                                        )
                                                                    }
                                                                    onMouseEnter={() =>
                                                                        setHoverRating(
                                                                            star,
                                                                        )
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        setHoverRating(
                                                                            0,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer p-1 transition-transform hover:scale-110"
                                                                    aria-label={`Rate ${star} star`}
                                                                >
                                                                    <Star
                                                                        className={`h-6 w-6 transition-colors ${
                                                                            (hoverRating ||
                                                                                reviewRating) >=
                                                                            star
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'text-neutral-300 dark:text-neutral-700'
                                                                        }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                            <span className="ms-2 text-xs font-medium text-neutral-500">
                                                                {getRatingLabel(
                                                                    hoverRating ||
                                                                        reviewRating,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Review Title */}
                                                    <div>
                                                        <Label
                                                            htmlFor="review-title"
                                                            className="mb-1.5 block text-xs font-semibold"
                                                        >
                                                            {t(
                                                                'products.review_title',
                                                                'Review Headline',
                                                            )}
                                                        </Label>
                                                        <Input
                                                            id="review-title"
                                                            value={reviewTitle}
                                                            onChange={(e) =>
                                                                setReviewTitle(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder={t(
                                                                'products.review_title_ph',
                                                                'e.g., Exceeded my expectations!',
                                                            )}
                                                            className="h-10 rounded-xl text-xs sm:text-sm"
                                                        />
                                                    </div>

                                                    {/* Reviewer Name & Email */}
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        <div>
                                                            <Label
                                                                htmlFor="reviewer-name"
                                                                className="mb-1.5 block text-xs font-semibold"
                                                            >
                                                                {t(
                                                                    'common.name',
                                                                )}{' '}
                                                                *
                                                            </Label>
                                                            <Input
                                                                id="reviewer-name"
                                                                required
                                                                value={
                                                                    reviewerName
                                                                }
                                                                onChange={(e) =>
                                                                    setReviewerName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="John Doe"
                                                                className="h-10 rounded-xl text-xs sm:text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor="reviewer-email"
                                                                className="mb-1.5 block text-xs font-semibold"
                                                            >
                                                                Email *
                                                            </Label>
                                                            <Input
                                                                id="reviewer-email"
                                                                type="email"
                                                                required
                                                                value={
                                                                    reviewerEmail
                                                                }
                                                                onChange={(e) =>
                                                                    setReviewerEmail(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="john@example.com"
                                                                className="h-10 rounded-xl text-xs sm:text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Review Comments */}
                                                    <div>
                                                        <Label
                                                            htmlFor="review-comment"
                                                            className="mb-1.5 block text-xs font-semibold"
                                                        >
                                                            {t(
                                                                'products.review_comment',
                                                                'Detailed Review',
                                                            )}{' '}
                                                            *
                                                        </Label>
                                                        <Textarea
                                                            id="review-comment"
                                                            required
                                                            rows={4}
                                                            value={
                                                                reviewComment
                                                            }
                                                            onChange={(e) =>
                                                                setReviewComment(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder={t(
                                                                'products.review_comment_ph',
                                                                'What did you like or dislike about this item?',
                                                            )}
                                                            className="resize-y rounded-xl text-xs sm:text-sm"
                                                        />
                                                    </div>

                                                    {/* Submit Button */}
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            isSubmittingReview
                                                        }
                                                        className="h-11 w-full cursor-pointer gap-2 rounded-xl text-sm font-bold shadow-sm"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        <span>
                                                            {isSubmittingReview
                                                                ? t(
                                                                      'common.loading',
                                                                  )
                                                                : t(
                                                                      'products.submit_review',
                                                                      'Submit Review',
                                                                  )}
                                                        </span>
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Specifications Tab */}
                        {activeTab === 'specifications' && (
                            <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
                                <h3 className="mb-6 border-b border-neutral-200/80 pb-4 text-xl font-bold text-neutral-900 dark:border-neutral-800 dark:text-neutral-100">
                                    {t(
                                        'products.technical_specs',
                                        'Technical Specifications',
                                    )}
                                </h3>

                                <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                                    <div className="grid grid-cols-1 bg-neutral-50 p-3.5 text-sm sm:grid-cols-3 dark:bg-neutral-800/40">
                                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                            {t(
                                                'products.title',
                                                'Product Name',
                                            )}
                                        </span>
                                        <span className="font-bold text-neutral-900 sm:col-span-2 dark:text-neutral-100">
                                            {product.title}
                                        </span>
                                    </div>

                                    {product.sku && (
                                        <div className="grid grid-cols-1 p-3.5 text-sm sm:grid-cols-3">
                                            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                                SKU
                                            </span>
                                            <span className="font-mono font-bold text-neutral-900 sm:col-span-2 dark:text-neutral-100">
                                                {product.sku}
                                            </span>
                                        </div>
                                    )}

                                    {categoryName && (
                                        <div className="grid grid-cols-1 bg-neutral-50 p-3.5 text-sm sm:grid-cols-3 dark:bg-neutral-800/40">
                                            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                                {t('common.categories')}
                                            </span>
                                            <span className="text-neutral-800 sm:col-span-2 dark:text-neutral-200">
                                                {categoryName}
                                            </span>
                                        </div>
                                    )}

                                    {brandName && (
                                        <div className="grid grid-cols-1 p-3.5 text-sm sm:grid-cols-3">
                                            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                                {t('common.brand')}
                                            </span>
                                            <span className="text-neutral-800 sm:col-span-2 dark:text-neutral-200">
                                                {brandName}
                                            </span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 bg-neutral-50 p-3.5 text-sm sm:grid-cols-3 dark:bg-neutral-800/40">
                                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                            {t(
                                                'common.product-kind',
                                                'Product Kind',
                                            )}
                                        </span>
                                        <span className="text-neutral-800 capitalize sm:col-span-2 dark:text-neutral-200">
                                            {product.product_kind === 'physical'
                                                ? t(
                                                      'common.physical-product',
                                                      'Physical Goods',
                                                  )
                                                : t(
                                                      'common.digital-product',
                                                      'Digital Download',
                                                  )}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 p-3.5 text-sm sm:grid-cols-3">
                                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                            {t('products.type', 'Product Type')}
                                        </span>
                                        <span className="text-neutral-800 capitalize sm:col-span-2 dark:text-neutral-200">
                                            {product.product_type}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 bg-neutral-50 p-3.5 text-sm sm:grid-cols-3 dark:bg-neutral-800/40">
                                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                            {t('common.status', 'Availability')}
                                        </span>
                                        <span className="font-medium text-neutral-800 sm:col-span-2 dark:text-neutral-200">
                                            {product.stock > 0
                                                ? `${product.stock} ${t('products.in_stock_units', 'units available')}`
                                                : t(
                                                      'common.stockout',
                                                      'Out of stock',
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Shipping & Returns Tab */}
                        {activeTab === 'shipping' && (
                            <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        {t(
                                            'products.shipping_info',
                                            'Delivery & Shipping Information',
                                        )}
                                    </h3>
                                    <p className="text-sm text-neutral-500">
                                        {t(
                                            'products.shipping_desc',
                                            'We partner with premier logistics carriers to ensure fast, safe, and trackable deliveries.',
                                        )}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-800/40">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {t(
                                                'products.standard_shipping',
                                                'Standard Shipping',
                                            )}
                                        </h5>
                                        <p className="text-xs leading-relaxed text-neutral-500">
                                            Delivery in 2 to 4 business days.
                                            Free for orders over $50 or local
                                            equivalent.
                                        </p>
                                    </div>

                                    <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-800/40">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-emerald-600">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {t(
                                                'products.insured_delivery',
                                                'Insured & Tracked',
                                            )}
                                        </h5>
                                        <p className="text-xs leading-relaxed text-neutral-500">
                                            Every order includes live tracking
                                            and guaranteed door-to-door transit
                                            protection.
                                        </p>
                                    </div>

                                    <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-800/40">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-amber-600">
                                            <RotateCcw className="h-5 w-5" />
                                        </div>
                                        <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {t(
                                                'products.returns_policy',
                                                '30-Day Hassle Free Returns',
                                            )}
                                        </h5>
                                        <p className="text-xs leading-relaxed text-neutral-500">
                                            If you are not completely satisfied,
                                            return within 30 days for an
                                            exchange or full refund.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
