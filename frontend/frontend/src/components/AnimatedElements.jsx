/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Magnetic button that follows cursor
export function MagneticButton({ children, className = "", onClick }) {
    const buttonRef = useRef(null);
    const boundingRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className={`magnetic-btn ${className}`}
        >
            {children}
        </button>
    );
}

// Text reveal animation
export function AnimatedText({ text, className = "", delay = 0, as: Tag = 'span' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const chars = containerRef.current?.querySelectorAll('.char');
        if (!chars) return;

        gsap.fromTo(chars,
            {
                opacity: 0,
                y: 50,
                rotateX: -90
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.03,
                duration: 0.8,
                delay,
                ease: "back.out(1.7)"
            }
        );
    }, [delay]);

    return (
        <Tag ref={containerRef} className={`inline-block ${className}`}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="char inline-block"
                    style={{
                        transformStyle: 'preserve-3d',
                        whiteSpace: char === ' ' ? 'pre' : 'normal'
                    }}
                >
                    {char}
                </span>
            ))}
        </Tag>
    );
}

// Staggered fade-in for list items
export function useStaggerAnimation(containerRef, selector = '.stagger-item') {
    useEffect(() => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll(selector);

        gsap.fromTo(items,
            {
                opacity: 0,
                y: 30,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: "power3.out"
            }
        );
    }, [containerRef, selector]);
}

// Glitch text effect
export function GlitchText({ text, className = "" }) {
    const textRef = useRef(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const glitch = () => {
            const tl = gsap.timeline();

            tl.to(el, {
                skewX: 5,
                duration: 0.05,
                ease: "power1.inOut"
            })
                .to(el, {
                    skewX: -5,
                    duration: 0.05,
                    ease: "power1.inOut"
                })
                .to(el, {
                    skewX: 0,
                    duration: 0.05,
                    ease: "power1.inOut"
                });
        };

        // Random glitch intervals
        const interval = setInterval(() => {
            if (Math.random() > 0.7) glitch();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span ref={textRef} className={`relative inline-block ${className}`}>
            <span className="glitch-text" data-text={text}>{text}</span>
        </span>
    );
}

// Floating animation hook
export function useFloatAnimation(ref, options = {}) {
    const { amplitude = 10, duration = 3, delay = 0 } = options;

    useEffect(() => {
        if (!ref.current) return;

        gsap.to(ref.current, {
            y: `-=${amplitude}`,
            duration,
            delay,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }, [ref, amplitude, duration, delay]);
}

// Parallax scroll effect
export function useParallax(ref, speed = 0.5) {
    useEffect(() => {
        if (!ref.current) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            gsap.to(ref.current, {
                y: scrollY * speed,
                duration: 0.1,
                ease: "none"
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref, speed]);
}

// Ripple effect on click
export function RippleButton({ children, className = "", onClick }) {
    const buttonRef = useRef(null);

    const createRipple = (e) => {
        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
    `;

        button.appendChild(ripple);

        gsap.to(ripple, {
            scale: 2,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });

        onClick?.(e);
    };

    return (
        <button
            ref={buttonRef}
            onClick={createRipple}
            className={`relative overflow-hidden ${className}`}
        >
            {children}
        </button>
    );
}

// Cursor glow effect
export function useCursorGlow() {
    useEffect(() => {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 0;
      transition: opacity 0.3s;
    `;
        document.body.appendChild(cursor);

        const handleMouseMove = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cursor.remove();
        };
    }, []);
}

// Counter animation
export function AnimatedCounter({ value, duration = 2, className = "" }) {
    const counterRef = useRef(null);
    const displayValue = useRef({ value: 0 });

    useEffect(() => {
        gsap.to(displayValue.current, {
            value,
            duration,
            ease: "power2.out",
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.textContent = Math.round(displayValue.current.value);
                }
            }
        });
    }, [value, duration]);

    return <span ref={counterRef} className={className}>0</span>;
}
