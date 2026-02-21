/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function EmailCard({ email, expiresAt, onExpired, onCopy }) {
    const [remaining, setRemaining] = useState(0);
    const [copied, setCopied] = useState(false);
    const cardRef = useRef(null);
    const progressRef = useRef(null);
    const timeRef = useRef(null);

    // Entrance animation
    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 50, scale: 0.9, rotateX: 15 },
                { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1, ease: "power3.out" }
            );
        }
    }, []);

    // Calculate remaining time
    useEffect(() => {
        const calculateRemaining = () => {
            const now = Date.now();
            const expiryStr = (expiresAt && !expiresAt.endsWith('Z') && !expiresAt.includes('+'))
                ? `${expiresAt}Z`
                : expiresAt;
            const expiry = new Date(expiryStr).getTime();
            return Math.max(0, Math.floor((expiry - now) / 1000));
        };

        setRemaining(calculateRemaining());

        const interval = setInterval(() => {
            const diff = calculateRemaining();
            setRemaining(diff);

            // Pulse animation when time is low
            if (diff <= 60 && diff > 0 && timeRef.current) {
                gsap.to(timeRef.current, {
                    scale: 1.08,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }

            if (diff === 0) {
                clearInterval(interval);
                onExpired?.();

                // Shake animation on expire
                if (cardRef.current) {
                    gsap.to(cardRef.current, {
                        x: [-8, 8, -6, 6, -4, 4, 0],
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpired]);

    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");
    const isExpired = remaining === 0;
    const isWarning = remaining <= 60 && remaining > 0;

    // Calculate progress for the circular timer
    const totalSeconds = 10 * 60;
    const progress = (remaining / totalSeconds) * 100;
    const circumference = 2 * Math.PI * 62;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleCopy = async () => {
        if (isExpired) return;

        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            onCopy?.();

            // Success animation
            gsap.fromTo(".copy-feedback",
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
            );

            setTimeout(() => {
                gsap.to(".copy-feedback", {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => setCopied(false)
                });
            }, 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div
            ref={cardRef}
            className="relative p-8 md:p-10 w-full max-w-xl mx-auto rounded-3xl"
            style={{ perspective: '1000px' }}
        >
            {/* Background with animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyber-card/90 to-cyber-darker/90 backdrop-blur-xl" />

            {/* Animated border */}
            <div className={`absolute inset-0 rounded-3xl p-[2px] ${isExpired ? '' : 'animate-spin-slow'}`} style={{ animationDuration: '10s' }}>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${isExpired
                    ? 'from-rose-500 via-orange-500 to-rose-500'
                    : 'from-indigo-500 via-indigo-600 to-sapphire-600'
                    }`} />
            </div>
            <div className="absolute inset-[2px] rounded-[22px] bg-cyber-card" />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isExpired
                            ? 'bg-rose-500/20'
                            : 'bg-gradient-to-br from-indigo-500/20 to-sapphire-500/20'
                            }`}>
                            <svg className={`w-6 h-6 ${isExpired ? 'text-rose-400' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold text-secondary">Your Temp Email</span>
                    </div>
                    <StatusBadge isExpired={isExpired} isWarning={isWarning} />
                </div>

                {/* Email Display */}
                <div className="relative mb-10">
                    <button
                        onClick={handleCopy}
                        disabled={isExpired}
                        className={`w-full group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 ${isExpired
                            ? 'bg-red-500/10 border border-red-500/30 cursor-not-allowed'
                            : 'bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer'
                            }`}
                    >
                        <div className="flex-1 min-w-0 text-left">
                            <p className={`font-mono text-xl md:text-2xl truncate transition-all ${isExpired
                                ? 'text-rose-400 line-through'
                                : 'text-white group-hover:text-indigo-400 font-bold'
                                }`}>
                                {email}
                            </p>
                        </div>
                        <div
                            className={`flex-shrink-0 p-4 rounded-xl transition-all duration-300 ${isExpired
                                ? 'bg-red-500/10 text-red-400'
                                : copied
                                    ? 'bg-green-500/20 text-green-400 scale-110'
                                    : 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20 group-hover:scale-110'
                                }`}
                        >
                            {copied ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Copy success tooltip */}
                    {copied && (
                        <div className="copy-feedback absolute -bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-400 whitespace-nowrap flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied to clipboard!
                        </div>
                    )}
                </div>

                {/* Countdown Timer with Technical Frame */}
                <div className="flex flex-col items-center py-6">
                    <div className="relative group/timer">
                        {/* Technical Frame - Hexagonal Glow - Scaled and positioned to prevent overflow */}
                        <div className="absolute inset-[-15px] pointer-events-none opacity-40 group-hover/timer:opacity-70 transition-opacity duration-700">
                            <svg className="w-full h-full scale-[0.9]" viewBox="0 0 200 200">
                                {/* Outer tech ring */}
                                <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" className="text-indigo-500/10 dark:text-indigo-500/20" />
                                {/* Hexagon tech frame */}
                                <path d="M100 10 L175 55 L175 145 L100 190 L25 145 L25 55 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-500/10 dark:text-indigo-500/20" />
                                {/* Corner markers */}
                                <path d="M100 15 L112 27 M100 15 L88 27" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400" />
                                <path d="M100 185 L112 173 M100 185 L88 173" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400" />
                                <path d="M20 100 L32 112 M20 100 L32 88" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400" />
                                <path d="M180 100 L168 112 M180 100 L168 88" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400" />
                            </svg>
                        </div>

                        {/* Main Timer Container */}
                        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center rounded-full bg-cyber-darker/60 backdrop-blur-lg border border-white/5 shadow-inner">
                            <svg className="w-full h-full -rotate-90 p-1.5" viewBox="0 0 140 140">
                                <defs>
                                    <linearGradient id="timerGradientIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={isWarning ? '#f59e0b' : isExpired ? '#f43f5e' : '#6366f1'} />
                                        <stop offset="50%" stopColor={isWarning ? '#fbbf24' : isExpired ? '#e11d48' : '#4f46e2'} />
                                        <stop offset="100%" stopColor={isWarning ? '#f59e0b' : isExpired ? '#f43f5e' : '#3b82f6'} />
                                    </linearGradient>
                                    <filter id="timerGlow">
                                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="10" />
                                <circle
                                    cx="70"
                                    cy="70"
                                    r="62"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="6"
                                />

                                <circle
                                    ref={progressRef}
                                    cx="70"
                                    cy="70"
                                    r="62"
                                    fill="none"
                                    stroke="url(#timerGradientIndigo)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    filter="url(#timerGlow)"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>

                            {/* Internal HUD elements */}
                            <div className="absolute inset-6 pointer-events-none rounded-full border border-indigo-500/5 rotate-12" />
                            <div className="absolute inset-10 pointer-events-none rounded-full border border-indigo-500/5 -rotate-12" />

                            {/* Time display */}
                            <div ref={timeRef} className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl md:text-5xl font-bold font-mono tracking-wider tabular-nums ${isExpired
                                    ? 'text-rose-400'
                                    : isWarning
                                        ? 'text-yellow-400'
                                        : 'bg-gradient-to-r from-indigo-400 via-sapphire-400 to-blue-400 bg-clip-text text-transparent'
                                    }`}>
                                    {isExpired ? "00:00" : `${minutes}:${seconds}`}
                                </span>
                                <div className="mt-1.5 flex flex-col items-center">
                                    <div className="w-6 h-[1px] bg-indigo-500/30 mb-1" />
                                    <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-black ${isExpired ? 'text-rose-400' : 'text-secondary font-bold'
                                        }`}>
                                        {isExpired ? "Secure Wipe" : "Active Session"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expired Message */}
                {isExpired && (
                    <div className="mt-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center animate-fade-in">
                        <div className="flex items-center justify-center gap-3 text-red-400 font-medium">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            This email has expired. Generate a new one to continue.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ isExpired, isWarning }) {
    if (isExpired) {
        return (
            <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                Expired
            </span>
        );
    }
    if (isWarning) {
        return (
            <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                </span>
                Expiring
            </span>
        );
    }
    return (
        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            Active
        </span>
    );
}
