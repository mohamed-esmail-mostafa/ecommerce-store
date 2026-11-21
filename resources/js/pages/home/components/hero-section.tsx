import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import useImports from '@/hooks/use-imports';
import { Banner } from '@/types/banner';

interface HeroSectionProps {
    sliders?: Banner[];
}

export default function HeroSection({ sliders = [] }: HeroSectionProps) {
    const { t, isArabic } = useImports();

    // Filter only active sliders
    const activeSliders = sliders.filter((item) => item.is_active !== false);

    // Fallback slide if no active sliders are provided yet
    const items: Banner[] =
        activeSliders.length > 0
            ? activeSliders
            : [
                {
                    id: 0,
                    title: t('hero.default_title', 'Discover Exclusive Collections'),
                    description: t(
                        'hero.default_desc',
                        'Upgrade your lifestyle with our premium curated products and seasonal special deals.'
                    ),
                    image: '/banner.jpeg',
                    mobile_image: null,
                    public_id: null,
                    public_mobile_id: null,
                    type: 'slider',
                    link: '/shop/page',
                    button_text: t('hero.shop_now', 'Shop Now'),
                    is_active: true,
                    created_at: '',
                },
            ];

    // Embla Autoplay Plugin configuration
    const autoplayRef = useRef(
        Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: items.length > 1,
            direction: isArabic ? 'rtl' : 'ltr',
            duration: 35,
        },
        items.length > 1 ? [autoplayRef.current] : []
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="relative w-full py-3 md:py-6 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Carousel Root Frame */}
                <div
                    key={isArabic ? 'rtl' : 'ltr'}
                    className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 group"
                >
                    {/* Embla Viewport */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex touch-pan-y">
                            {items.map((slide, index) => {
                                const targetLink = slide.link && slide.link.trim() !== '' ? slide.link : '/shop/page';
                                const buttonLabel = slide.button_text && slide.button_text.trim() !== ''
                                    ? slide.button_text
                                    : t('hero.shop_now', 'Shop Now');

                                return (
                                    <div
                                        key={slide.id || index}
                                        className="relative flex-[0_0_100%] min-w-0 min-h-[440px] sm:min-h-[500px] md:min-h-[560px] lg:min-h-[600px] flex items-center select-none"
                                    >
                                        {/* Background Visual (Responsive Picture & Image) */}
                                        <div className="absolute inset-0 z-0 overflow-hidden">
                                            {slide.image || slide.mobile_image ? (
                                                <picture>
                                                    {slide.mobile_image && (
                                                        <source
                                                            media="(max-width: 640px)"
                                                            srcSet={slide.mobile_image}
                                                        />
                                                    )}
                                                    <img
                                                        src={slide.image || slide.mobile_image || ''}
                                                        alt={slide.title || 'Hero Banner'}
                                                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                                        loading={index === 0 ? 'eager' : 'lazy'}
                                                    />
                                                </picture>
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-br from-neutral-900 via-neutral-800 to-orange-950" />
                                            )}

                                            {/* Readability Gradient Overlays */}
                                            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/25 rtl:bg-linear-to-l rtl:from-black/85 rtl:via-black/55 rtl:to-black/25 z-1" />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20 z-1" />
                                        </div>

                                        {/* Slide Content */}
                                        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-20 py-12">
                                            <div className="max-w-2xl space-y-4 md:space-y-6">
                                                {/* Tag / Category Badge */}
                                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                                                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                                    <span>{t('hero.special_offer', 'Special Offer')}</span>
                                                </div>

                                                {/* Slide Title */}
                                                {slide.title && (
                                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
                                                        {slide.title}
                                                    </h1>
                                                )}

                                                {/* Slide Description */}
                                                {slide.description && (
                                                    <p className="text-sm sm:text-base md:text-lg text-gray-200/90 font-normal leading-relaxed drop-shadow max-w-xl line-clamp-3">
                                                        {slide.description}
                                                    </p>
                                                )}

                                                {/* Call To Action Buttons */}
                                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                                    <Link href={targetLink}>
                                                        <Button
                                                            size="lg"
                                                            className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 gap-2 group/btn cursor-pointer"
                                                        >
                                                            <ShoppingBag className="w-4 h-4" />
                                                            <span>{buttonLabel}</span>
                                                            {isArabic ? (
                                                                <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                                                            ) : (
                                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                                            )}
                                                        </Button>
                                                    </Link>

                                                    <Link href="/shop/page">
                                                        <Button
                                                            size="lg"
                                                            variant="outline"
                                                            className="h-11 sm:h-12 px-5 sm:px-7 text-sm sm:text-base font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                                        >
                                                            <span>{t('hero.explore_offers', 'Explore Offers')}</span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls: Prev / Next Buttons */}
                    {items.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={scrollPrev}
                                aria-label={t('hero.prev_slide', 'Previous slide')}
                                className="absolute top-1/2 -translate-y-1/2 start-4 sm:start-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            >
                                {isArabic ? (
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={scrollNext}
                                aria-label={t('hero.next_slide', 'Next slide')}
                                className="absolute top-1/2 -translate-y-1/2 end-4 sm:end-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            >
                                {isArabic ? (
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                            </button>
                        </>
                    )}

                    {/* Bottom Pagination Dots */}
                    {items.length > 1 && (
                        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                            {scrollSnaps.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={() => scrollTo(dotIdx)}
                                    aria-label={`Slide ${dotIdx + 1}`}
                                    className={`transition-all duration-300 rounded-full h-2 sm:h-2.5 cursor-pointer ${dotIdx === selectedIndex
                                            ? 'w-7 sm:w-8 bg-primary shadow-sm'
                                            : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Top-Corner Slide Counter Badge */}
                    {items.length > 1 && (
                        <div className="absolute top-4 sm:top-6 end-4 sm:end-6 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold tabular-nums tracking-wider hidden sm:flex items-center gap-1 pointer-events-none">
                            <span>0{selectedIndex + 1}</span>
                            <span className="text-white/40">/</span>
                            <span>0{items.length}</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
