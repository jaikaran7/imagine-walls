"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { services as siteServices } from "@/lib/data/services";

const services = siteServices.map((s) => ({
  id: s.slug,
  tag: s.tag.toUpperCase(),
  title: s.title,
  description: s.shortDescription,
  image: s.heroImage.src,
}));

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// Animation timeline constants
const ANIMATION_DURATION = 1100;
const ANIMATION_DURATION_SECONDS = 1.1;

// Type for tracking the card position for backward-zoom animation
interface CardOrigin {
    // Transform origin as percentage of viewport (for the fullscreen to expand FROM)
    originX: number; // 0-100%
    originY: number; // 0-100%
}

// Responsive card dimensions
const getCardDimensions = (windowWidth: number) => {
    if (windowWidth >= 1024) {
        return { width: 160, height: 230, gap: 24 };
    } else if (windowWidth >= 768) {
        return { width: 140, height: 200, gap: 16 };
    }
    return { width: 100, height: 140, gap: 16 };
};

export function ServicesHeroSlider({ mode = "page" }: { mode?: "home" | "page" }) {
    // Queue-based state: services are rendered in order, first one is active
    const [serviceQueue, setServiceQueue] = useState(services);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'animating' | 'settling'>('idle');
    const [incomingServiceId, setIncomingServiceId] = useState<string | null>(null);
    const [outgoingServiceId, setOutgoingServiceId] = useState<string | null>(null);
    const [clickedThumbnailIndex, setClickedThumbnailIndex] = useState<number | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(1920);
    const [windowHeight, setWindowHeight] = useState<number>(1080);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const settleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Mobile only (max-width 768px): single card, swipe left/right to change
    const [mobileCardIndex, setMobileCardIndex] = useState(0);
    const mobileTouchStart = useRef<number | null>(null);
    const isMobile = windowWidth > 0 && windowWidth <= 768;
    const mobileViewW = isMobile ? windowWidth : Math.min(windowWidth, 768);

    // Looping navigation for mobile
    const mobileGoNext = useCallback(() => {
        setMobileCardIndex((prev) => (prev + 1) % services.length);
    }, []);

    const mobileGoPrev = useCallback(() => {
        setMobileCardIndex((prev) => (prev - 1 + services.length) % services.length);
    }, []);

    // Mobile Autoplay - 4 seconds
    useEffect(() => {
        if (!isMobile) return;
        const interval = setInterval(() => {
            mobileGoNext();
        }, 4000);
        return () => clearInterval(interval);
    }, [isMobile, mobileGoNext]);

    // BACKWARD ZOOM: Track where the fullscreen should expand FROM
    // The fullscreen uses this as transformOrigin to create the "card sinks into back layer" effect
    const [cardOrigin, setCardOrigin] = useState<CardOrigin | null>(null);

    // Refs for capturing card positions
    const cardRefsMap = useRef<Map<number, HTMLDivElement | null>>(new Map());

    // Track the previous queue for reference
    const prevQueueRef = useRef<typeof services>(services);

    // Track window dimensions for responsive calculations and FLIP transforms
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                setWindowHeight(window.innerHeight);
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Memoized card dimensions
    const cardDimensions = useMemo(() => getCardDimensions(windowWidth), [windowWidth]);

    const activeService = serviceQueue[0];

    /**
     * BACKWARD ZOOM TRANSITION
     * 
     * CRITICAL DEPTH MODEL:
     * - The card SINKS BACKWARD into the back layer
     * - The fullscreen expands FROM the card's position (using transformOrigin)
     * - The fullscreen is ALWAYS in the back layer (below thumbnails)
     * - NO front-layer transition element - everything happens in the back
     * 
     * Z-Index Stack (front to back):
     * - z-40+: Thumbnail cards (foreground)
     * - z-20: Incoming fullscreen (expanding in back layer)
     * - z-10: Outgoing fullscreen (fading out)
     * - z-1: Hidden services
     * 
     * Animation:
     * 1. Calculate card center as % of viewport
     * 2. Incoming fullscreen uses that as transformOrigin
     * 3. Incoming scales from 0.3 → 1.0 (expands FROM card position)
     * 4. Clicked card fades out (sinks into the expanding fullscreen)
     * 5. Outgoing fullscreen fades out behind
     */
    const triggerTransition = useCallback((
        direction: 'next' | 'prev',
        slotIndex: number | null,
        cardRect: { x: number; y: number; width: number; height: number } | null,
        targetService?: typeof services[0]
    ) => {
        if (animationPhase !== 'idle') return;

        prevQueueRef.current = [...serviceQueue];

        const outgoingService = serviceQueue[0];

        let incomingService: typeof services[0];
        if (targetService) {
            incomingService = targetService;
        } else {
            const nextIndex = direction === 'next' ? 1 : serviceQueue.length - 1;
            incomingService = serviceQueue[nextIndex];
        }
        const incomingId = incomingService.id;

        // PHASE 1: ANIMATE
        setAnimationPhase('animating');
        setIsAnimating(true);
        setOutgoingServiceId(outgoingService.id);
        setIncomingServiceId(incomingService.id);

        if (slotIndex !== null) {
            setClickedThumbnailIndex(slotIndex);
        }

        // CRITICAL: Calculate card center as percentage of viewport
        // This becomes the transformOrigin for the incoming fullscreen
        // The fullscreen will appear to expand FROM this point
        if (cardRect && windowWidth > 0 && windowHeight > 0) {
            const cardCenterX = cardRect.x + cardRect.width / 2;
            const cardCenterY = cardRect.y + cardRect.height / 2;
            setCardOrigin({
                originX: (cardCenterX / windowWidth) * 100,
                originY: (cardCenterY / windowHeight) * 100,
            });
        } else if (direction === 'next') {
            // Auto-rotation: get first card's position
            const firstCardRef = cardRefsMap.current.get(0);
            if (firstCardRef && windowWidth > 0 && windowHeight > 0) {
                const rect = firstCardRef.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                setCardOrigin({
                    originX: (cardCenterX / windowWidth) * 100,
                    originY: (cardCenterY / windowHeight) * 100,
                });
            }
        }

        // PHASE 2: SETTLE
        animationTimeoutRef.current = setTimeout(() => {
            setAnimationPhase('settling');
            setCardOrigin(null);

            // Reorder queue
            setServiceQueue((prev) => {
                if (targetService) {
                    const outgoing = prev[0];
                    const withoutOutgoing = prev.slice(1);
                    const targetIndexInRest = withoutOutgoing.findIndex(s => s.id === targetService.id);

                    if (targetIndexInRest === -1) return prev;

                    const target = withoutOutgoing[targetIndexInRest];
                    const before = withoutOutgoing.slice(0, targetIndexInRest);
                    const after = withoutOutgoing.slice(targetIndexInRest + 1);

                    return [target, ...before, ...after, outgoing];
                } else if (direction === 'next') {
                    const [first, ...rest] = prev;
                    return [...rest, first];
                } else {
                    const last = prev[prev.length - 1];
                    const rest = prev.slice(0, -1);
                    const [first, ...others] = rest;
                    return [last, ...others, first];
                }
            });

            // PHASE 3: IDLE
            settleTimeoutRef.current = setTimeout(() => {
                setIncomingServiceId(null);
                setOutgoingServiceId(null);
                setClickedThumbnailIndex(null);
                setIsAnimating(false);
                setAnimationPhase('idle');
            }, 50);

        }, ANIMATION_DURATION);
    }, [animationPhase, serviceQueue, windowWidth, windowHeight]);

    // Wrapper for auto-rotation and nav buttons
    const transitionToNext = useCallback((direction: 'next' | 'prev') => {
        triggerTransition(direction, direction === 'next' ? 0 : null, null);
    }, [triggerTransition]);

    const handleManualInteraction = useCallback(() => {
        setIsAutoPlaying(false);
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const nextSlide = useCallback(() => {
        handleManualInteraction();
        transitionToNext('next');
    }, [transitionToNext, handleManualInteraction]);

    const prevSlide = useCallback(() => {
        handleManualInteraction();
        transitionToNext('prev');
    }, [transitionToNext, handleManualInteraction]);

    // Auto-play with strict phase gating
    useEffect(() => {
        if (isAutoPlaying && animationPhase === 'idle') {
            autoPlayRef.current = setInterval(() => {
                transitionToNext('next');
            }, 4000);
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlaying, animationPhase, transitionToNext]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, []);

    // --- Derived State for Queue ---
    // Layout: 1 full-screen (back) + 3 thumbnail cards (fully visible) + 1 half-screen preview
    // The 4th card is positioned so exactly half is visible, with its edge flush to viewport
    const thumbnails = useMemo(() => {
        const result = [];
        for (let i = 1; i <= 4; i++) {
            result.push(serviceQueue[i % serviceQueue.length]);
        }
        return result;
    }, [serviceQueue]);

    // DETERMINISTIC TIMELINE PROGRESS CALCULATION
    // Formula: progressPercentage = (activeServiceIndex / totalServices) * 100
    // Where activeServiceIndex is 1-based (1, 2, 3, 4, 5)
    const activeIndex = services.findIndex((s) => s.id === activeService.id);

    // Get the index that should be displayed (incoming during animation, active otherwise)
    // This is 0-based, so we convert to 1-based for the formula
    const displayIndex = useMemo(() => {
        if (isAnimating && incomingServiceId) {
            const incomingIndex = services.findIndex((s) => s.id === incomingServiceId);
            return incomingIndex !== -1 ? incomingIndex : activeIndex;
        }
        return activeIndex !== -1 ? activeIndex : 0;
    }, [activeIndex, isAnimating, incomingServiceId]);

    // Calculate progress: (1-based index / total) as a ratio (0-1)
    // For index 4 (1-based) of 5: (4 / 5) = 0.8 = 80%
    const progress = useMemo(() => {
        const oneBasedIndex = displayIndex + 1; // Convert 0-based to 1-based
        const calculatedProgress = oneBasedIndex / services.length;

        return calculatedProgress;
    }, [displayIndex, services.length]);

    // Calculate total width needed for thumbnail container
    // 3 full cards + gaps + half of 4th card
    const containerWidth = useMemo(() => {
        const { width, gap } = cardDimensions;
        // 3 full cards + 2 gaps between them + half of 4th card
        return (width * 3) + (gap * 3) + (width / 2);
    }, [cardDimensions]);

    // Calculate slot positions for absolute positioning
    // Slots are positioned from RIGHT edge (slot 0 is leftmost visible card)
    const getSlotPosition = useCallback((slotIndex: number) => {
        const { width, gap } = cardDimensions;
        // Position from left edge of container
        // Each slot is card width + gap from previous
        return slotIndex * (width + gap);
    }, [cardDimensions]);

    return (
        <section className="relative w-full overflow-hidden bg-black md:h-[100dvh]">
            {/* --- Mobile only: compact swipeable cards (max-width: 768px) — dark like Arusu --- */}
            <div className="relative min-h-0 bg-black px-4 pb-10 pt-24 md:hidden">
                {/* Header - one line, larger, center aligned */}
                <div className="mb-8 flex justify-center">
                    <h2 className="whitespace-nowrap font-sans text-2xl font-bold uppercase tracking-widest text-white/90">
                        Our Services
                    </h2>
                </div>

                {/* Single card: swipe left/right to change with smooth disappear / appear */}
                <div
                    className="relative flex touch-pan-y items-start justify-center overflow-hidden"
                    style={{ minHeight: "50vh" }}
                    onTouchStart={(e) => {
                        mobileTouchStart.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                        if (mobileTouchStart.current == null) return;
                        const endX = e.changedTouches[0].clientX;
                        const diff = mobileTouchStart.current - endX;
                        const threshold = 50;
                        if (diff > threshold) mobileGoNext();
                        else if (diff < -threshold) mobileGoPrev();
                        mobileTouchStart.current = null;
                    }}
                >
                    <div
                        className="relative mx-auto aspect-[3/4] max-h-[50vh] w-full touch-manipulation"
                        style={{
                            width: isMobile ? mobileViewW * 0.78 : 320,
                            maxWidth: "85vw",
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={services[mobileCardIndex].id}
                                className="absolute inset-0 overflow-hidden rounded-2xl bg-gray-900 shadow-xl"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            >
                                <div className="absolute inset-0">
                                    <MediaImage
                                        src={services[mobileCardIndex].image}
                                        alt={services[mobileCardIndex].title}
                                        fill
                                        sizes="(max-width: 768px) 85vw, 0"
                                        className="rounded-2xl object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Side cutouts match black section */}
                                    <div className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
                                    <div className="absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 translate-x-1/2 rounded-full bg-black" />
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="space-y-2"
                                        >
                                            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FFCD00]">
                                                {services[mobileCardIndex].tag}
                                            </span>
                                            <h3 className="font-sans text-2xl font-bold leading-tight text-white">
                                                {services[mobileCardIndex].title}
                                            </h3>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Nav arrows + numbers (mobile) */}
                <div className="mt-5 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={mobileGoPrev}
                        className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-white/10 text-white"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="min-w-[3rem] text-center text-sm font-medium tabular-nums text-white">
                        {mobileCardIndex + 1} / {services.length}
                    </span>
                    <button
                        type="button"
                        onClick={mobileGoNext}
                        className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-white/10 text-white"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* CTA below card */}
                <div className="mt-4 flex justify-center">
                    <Link
                        href={mode === "home" ? "/services" : `/services/${services[mobileCardIndex].id}`}
                        className="inline-block rounded-full bg-[#FFCD00] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black"
                    >
                        {mode === "home" ? "View all services" : "Discover service"}
                    </Link>
                </div>
            </div>

            {/* --- Desktop only: fullscreen hero (md and up) --- */}
            <div className="hidden md:block absolute inset-0 h-full">
                {/* 
                SERVICES STACK - All services rendered, only one visible at a time
                Using pure CSS transforms (scale) and opacity for GPU-accelerated animations
                Depth order: front (thumbnails z-40) → active (z-10) → incoming (z-20) → back (z-5)
            */}
                {/* 
                FULLSCREEN SERVICES STACK - BACK LAYER
                
                CRITICAL DEPTH MODEL:
                All fullscreen transitions happen IN THE BACK LAYER.
                The card "sinks backward" into the fullscreen - it NEVER comes to the front.
                
                Z-Index Stack (strict):
                - z-40+: Thumbnail cards (always in front)
                - z-20: Incoming fullscreen (expanding in back, BELOW thumbnails)
                - z-10: Active/Outgoing fullscreen
                - z-1: Hidden services
                
                The incoming fullscreen uses transformOrigin set to the card's position,
                so it appears to expand FROM where the card is, creating the illusion
                that the card is sinking backward into the fullscreen.
            */}
                <div className="absolute inset-0">
                    {serviceQueue.map((service, index) => {
                        const isActive = index === 0;
                        const isIncoming = service.id === incomingServiceId;
                        const isOutgoing = service.id === outgoingServiceId;

                        // Z-INDEX: STRICT BACK-LAYER POSITIONING
                        // Incoming is z-20: above outgoing, but BELOW thumbnails (z-40)
                        // This ensures the card appears to sink INTO the fullscreen, not expand OVER it
                        let zIndex: number;
                        if (isIncoming) {
                            zIndex = 20; // Above outgoing, BELOW thumbnails
                        } else if (isOutgoing) {
                            zIndex = 10; // Behind incoming
                        } else if (isActive && !isAnimating) {
                            zIndex = 10; // Normal active state
                        } else {
                            zIndex = Math.max(1, 5 - index); // Hidden layers
                        }

                        // ANIMATION: Incoming expands from card position in the BACK layer
                        let opacity: number;
                        let scale: number;

                        if (isActive && !isAnimating) {
                            opacity = 1;
                            scale = 1.0;
                        } else if (isIncoming) {
                            // INCOMING: Expands in the BACK layer
                            // Starts small (like a card), scales to fullscreen
                            // transformOrigin is set to card position, creating "expand from card" effect
                            opacity = 1;
                            scale = 1.0; // Target: fullscreen
                        } else if (isOutgoing) {
                            // OUTGOING: Fades out behind the incoming
                            opacity = 0;
                            scale = 0.98;
                        } else {
                            // OTHERS: Hidden, but pre-scaled for smooth incoming animation
                            opacity = 0;
                            scale = 0.3; // Small scale - ready to expand when becoming incoming
                        }

                        // TRANSFORM ORIGIN: For incoming, set to card position
                        // This makes the fullscreen appear to expand FROM the card's location
                        let transformOrigin = 'center center';
                        if (isIncoming && cardOrigin) {
                            transformOrigin = `${cardOrigin.originX}% ${cardOrigin.originY}%`;
                        }

                        const EASE_CURVE: [number, number, number, number] = [0.22, 1, 0.36, 1];

                        // Custom transition for incoming: scale takes full duration, opacity snaps quickly
                        const transition = isIncoming
                            ? {
                                scale: { duration: ANIMATION_DURATION_SECONDS, ease: EASE_CURVE },
                                opacity: { duration: 0.2, ease: 'easeOut' as const },
                            }
                            : {
                                duration: ANIMATION_DURATION_SECONDS,
                                ease: EASE_CURVE,
                            };

                        return (
                            <motion.div
                                key={service.id}
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    zIndex,
                                    pointerEvents: isAnimating ? 'none' : isActive ? 'auto' : 'none',
                                    transformOrigin,
                                }}
                                initial={false}
                                animate={{ opacity, scale }}
                                transition={transition}
                            >
                                <MediaImage
                                    src={service.image}
                                    alt={`${service.title}`}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                    priority={isActive || isIncoming}
                                />
                                <div className="absolute inset-0 bg-ink/40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* --- Text Content (Animates in separately) --- */}
                <div className="relative z-30 container mx-auto px-6 h-full flex flex-col justify-center pt-20 pointer-events-none">
                    <div className="w-full lg:w-3/5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`text-${activeService.id}`}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-4 pointer-events-auto"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-[2px] w-10 bg-[#FFCD00]" />
                                    <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                                        {activeService.tag}
                                    </span>
                                </div>
                                <h1 className="font-sans text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                                    {activeService.title}
                                </h1>
                                <p className="text-base text-white/80 max-w-md font-light leading-relaxed">
                                    {activeService.description}
                                </p>
                                {/* CTA - Hidden on mobile, shown on desktop inline */}
                                <div className="pt-8 hidden md:block">
                                    <Link
                                        href={`/services/${activeService.id}`}
                                        className="inline-flex items-center justify-center rounded-full bg-[#FFCD00] px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                                    >
                                        Discover Service
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- Mobile Navigation & CTA (Bottom Center) --- */}
                <div className="absolute bottom-8 left-0 right-0 z-40 flex md:hidden flex-col items-center gap-4 px-6">
                    {/* Mobile Navigation Arrows */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={prevSlide}
                            disabled={animationPhase !== 'idle'}
                            className="w-11 h-11 rounded-full bg-ink/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Previous service"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Progress indicator */}
                        <span className="text-white font-medium text-sm">
                            {services.findIndex(s => s.id === activeService.id) + 1} / {services.length}
                        </span>

                        <button
                            onClick={nextSlide}
                            disabled={animationPhase !== 'idle'}
                            className="w-11 h-11 rounded-full bg-ink/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Next service"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile CTA - Bottom Center */}
                    <Link
                                        href={`/services/${activeService.id}`}
                                        className="inline-flex items-center justify-center rounded-full bg-[#FFCD00] px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                                    >
                                        Discover Service
                                    </Link>
                </div>

                {/* --- Thumbnail Queue (Bottom Right) --- */}
                {/* 
                CRITICAL: 4th card edge alignment
                Container width = 3 cards + gaps + half of 4th card
                Container positioned so right edge is flush with viewport
                4th card overflows container by half its width (clipped by viewport)
            */}
                <div className="absolute bottom-10 right-0 z-40 hidden md:flex flex-col items-end pointer-events-none">

                    {/* The Cards Row - Absolutely positioned slots */}
                    {/* CRITICAL: overflow: visible ensures cards can render outside container bounds during transform */}
                    <div
                        className="relative pointer-events-auto"
                        style={{
                            width: containerWidth,
                            height: cardDimensions.height,
                            // Container flush with right edge - no margin/padding
                            marginRight: 0,
                            paddingRight: 0,
                            overflow: 'visible', // Required: prevents clipping during transform animations
                        }}
                    >
                        {thumbnails.map((service, slotIndex) => {
                            const { width, gap, height } = cardDimensions;
                            const isHalfCard = slotIndex === 3;
                            const isClickedSlot = clickedThumbnailIndex === slotIndex;
                            const shouldShiftLeft = clickedThumbnailIndex !== null && slotIndex > clickedThumbnailIndex;

                            const basePosition = getSlotPosition(slotIndex);
                            const shiftAmount = width + gap;

                            // ANIMATION STATE MACHINE
                            let xTransform = 0;
                            let scaleValue = 1;
                            let opacityValue = 1;
                            // Z-INDEX FIX: Cards on the LEFT have HIGHER z-index than cards on the RIGHT
                            // This prevents the 4th card from clipping the 3rd card's border during left-shift
                            // Card 0 (leftmost) = z-100, Card 1 = z-99, Card 2 = z-98, Card 3 = z-97
                            // Using higher values for better stacking context isolation
                            const zIndexValue = 100 - slotIndex;

                            if (animationPhase === 'animating') {
                                if (isClickedSlot) {
                                    // CLICKED CARD: Sinks backward into the fullscreen
                                    // - Fades out (becoming transparent)
                                    // - Slight scale down (receding into depth)
                                    // - Stays at same z-index (the fullscreen is BEHIND it, expanding)
                                    // This creates the illusion of the card sinking INTO the back layer
                                    scaleValue = 0.9; // Slight shrink for depth effect
                                    opacityValue = 0; // Fade out as fullscreen expands behind
                                } else if (shouldShiftLeft) {
                                    // Cards after clicked: shift left to fill the gap
                                    // ALWAYS in sync with the backward zoom of the selected card
                                    xTransform = -shiftAmount;
                                }
                            }

                            const shouldAnimate = animationPhase === 'animating';

                            return (
                                <motion.div
                                    key={`slot-${slotIndex}`}
                                    ref={(el) => { cardRefsMap.current.set(slotIndex, el); }}
                                    className={`absolute cursor-pointer group border border-white/20 shadow-2xl ${isHalfCard ? 'rounded-l-xl rounded-r-none' : 'rounded-xl'
                                        }`}
                                    style={{
                                        position: 'absolute',
                                        width,
                                        height,
                                        left: basePosition,
                                        top: 0,
                                        zIndex: zIndexValue,
                                        // CRITICAL FIX: Stacking isolation prevents Framer Motion from reordering during transforms
                                        // This ensures z-index is respected even when cards are animating with translateX
                                        isolation: 'isolate', // Forces independent stacking context per card
                                        transformStyle: 'preserve-3d', // Prevents compositor flattening
                                        willChange: 'transform', // GPU acceleration hint
                                        pointerEvents: animationPhase !== 'idle' ? 'none' : 'auto',
                                        // CRITICAL: No overflow-hidden on border container - prevents border clipping during transform
                                        overflow: 'visible',
                                    }}
                                    initial={false}
                                    animate={{
                                        x: xTransform,
                                        scale: scaleValue,
                                        opacity: opacityValue,
                                    }}
                                    transition={shouldAnimate ? {
                                        duration: ANIMATION_DURATION_SECONDS,
                                        ease: [0.32, 0.72, 0, 1],
                                        // Clicked card fades out smoothly as the fullscreen expands behind it
                                        opacity: isClickedSlot ? {
                                            duration: ANIMATION_DURATION_SECONDS * 0.6,
                                            ease: [0.22, 1, 0.36, 1],
                                        } : undefined,
                                        scale: isClickedSlot ? {
                                            duration: ANIMATION_DURATION_SECONDS * 0.6,
                                            ease: [0.22, 1, 0.36, 1],
                                        } : undefined,
                                    } : {
                                        duration: 0,
                                    }}
                                    onClick={() => {
                                        if (animationPhase !== 'idle') return;

                                        const targetIndex = serviceQueue.findIndex(s => s.id === service.id);
                                        if (targetIndex === -1 || targetIndex === 0) return;

                                        handleManualInteraction();

                                        // Capture card position for backward-zoom animation
                                        const cardElement = cardRefsMap.current.get(slotIndex);
                                        let cardRect: { x: number; y: number; width: number; height: number } | null = null;

                                        if (cardElement) {
                                            const rect = cardElement.getBoundingClientRect();
                                            cardRect = {
                                                x: rect.left,
                                                y: rect.top,
                                                width: rect.width,
                                                height: rect.height,
                                            };
                                        }

                                        // Trigger backward zoom - fullscreen expands FROM card position
                                        triggerTransition('next', slotIndex, cardRect, service);
                                    }}
                                >
                                    {/* Inner wrapper with overflow-hidden for image clipping - border stays on outer div */}
                                    {/* CRITICAL: overflow-hidden is on inner div, NOT outer - prevents border clipping during transform */}
                                    <div
                                        className={`absolute inset-0 overflow-hidden bg-surface ${isHalfCard ? 'rounded-l-xl rounded-r-none' : 'rounded-xl'
                                            }`}
                                    >
                                        <MediaImage
                                            src={service.image}
                                            alt={`${service.title} thumbnail`}
                                            fill
                                            sizes="200px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                                                {service.tag}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Progress Timeline - Index count, progress bar, right arrow */}
                    {/* Aligned to first card's left edge (position 0) */}
                    <div
                        className="flex items-center gap-6 mt-8 pointer-events-auto"
                        style={{
                            width: containerWidth * 0.75,
                            alignSelf: 'flex-start', // Align to left (first card position)
                        }}
                    >
                        {/* Static Index Count (Left Side) */}
                        <div className="text-white font-bold text-lg flex-shrink-0">
                            {displayIndex + 1} / {services.length}
                        </div>

                        {/* Horizontal progress bar - Index-driven fill */}
                        <div className="flex-1 flex items-center">
                            <div className="relative h-[6px] w-full rounded-full bg-white/20 overflow-hidden">
                                {/* Progress fill - MUST have width: 100% for scaleX to work correctly */}
                                <motion.div
                                    className="absolute left-0 top-0 h-full w-full bg-white rounded-full"
                                    style={{
                                        transformOrigin: "left center",
                                    }}
                                    initial={false}
                                    animate={{ scaleX: progress }}
                                    transition={{
                                        duration: ANIMATION_DURATION_SECONDS,
                                        ease: [0.32, 0.72, 0, 1],
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Arrow Control */}
                        <button
                            onClick={nextSlide}
                            disabled={animationPhase !== 'idle' || displayIndex === services.length - 1}
                            className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                            aria-label="Next service"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
