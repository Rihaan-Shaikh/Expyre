import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
    const lenisRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return lenisRef;
}

// Scroll-triggered reveal animation
export function useScrollReveal(ref, options = {}) {
    const {
        y = 60,
        opacity = 0,
        duration = 1,
        delay = 0,
        ease = "power3.out",
        start = "top 85%",
        stagger = 0.1,
        selector = null
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const elements = selector
            ? ref.current.querySelectorAll(selector)
            : [ref.current];

        gsap.fromTo(elements,
            { y, opacity, scale: 0.98 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration,
                delay,
                ease,
                stagger,
                scrollTrigger: {
                    trigger: ref.current,
                    start,
                    toggleActions: "play none none reverse"
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [ref, y, opacity, duration, delay, ease, start, stagger, selector]);
}

// Parallax effect hook
export function useParallaxEffect(ref, options = {}) {
    const { speed = 50, direction = 'y' } = options;

    useEffect(() => {
        if (!ref.current) return;

        gsap.to(ref.current, {
            [direction]: speed,
            ease: "none",
            scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }, [ref, speed, direction]);
}

// Text split and reveal animation
export function useTextReveal(ref, options = {}) {
    const { delay = 0, stagger = 0.02 } = options;

    useEffect(() => {
        if (!ref.current) return;

        const text = ref.current.textContent;
        ref.current.innerHTML = '';

        // Split into words and characters
        const words = text.split(' ');
        words.forEach((word) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '0.25em';

            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'char';
                charSpan.style.display = 'inline-block';
                wordSpan.appendChild(charSpan);
            });

            ref.current.appendChild(wordSpan);
        });

        const chars = ref.current.querySelectorAll('.char');

        gsap.fromTo(chars,
            { opacity: 0, y: 50, rotateX: -90 },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                delay,
                stagger,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 85%",
                }
            }
        );
    }, [ref, delay, stagger]);
}

// Horizontal scroll section
export function useHorizontalScroll(containerRef, options = {}) {
    const { ease = "none" } = options;

    useEffect(() => {
        if (!containerRef.current) return;

        const sections = containerRef.current.querySelectorAll('.h-scroll-section');
        const totalWidth = Array.from(sections).reduce((acc, section) => acc + section.offsetWidth, 0);

        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease,
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => "+=" + totalWidth
            }
        });
    }, [containerRef, ease]);
}

// Scale on scroll effect
export function useScaleOnScroll(ref, options = {}) {
    const { start = 0.8, end = 1 } = options;

    useEffect(() => {
        if (!ref.current) return;

        gsap.fromTo(ref.current,
            { scale: start },
            {
                scale: end,
                ease: "none",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top bottom",
                    end: "center center",
                    scrub: 1
                }
            }
        );
    }, [ref, start, end]);
}

// Rotate on scroll
export function useRotateOnScroll(ref, options = {}) {
    const { rotation = 360 } = options;

    useEffect(() => {
        if (!ref.current) return;

        gsap.to(ref.current, {
            rotation,
            ease: "none",
            scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }, [ref, rotation]);
}

// Sticky element with progress
export function useStickyProgress(triggerRef, progressRef) {
    useEffect(() => {
        if (!triggerRef.current || !progressRef.current) return;

        gsap.to(progressRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    }, [triggerRef, progressRef]);
}
