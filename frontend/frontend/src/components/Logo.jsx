import { useRef } from "react";
import gsap from "gsap";

export default function Logo({ size = "default", showText = true, showTagline = false }) {
    const iconRef = useRef(null);
    const sizes = {
        small: { icon: 32, text: "text-lg" },
        default: { icon: 40, text: "text-xl" },
        large: { icon: 56, text: "text-2xl" },
        hero: { icon: 80, text: "text-4xl" }
    };

    const { icon, text } = sizes[size] || sizes.default;

    const handleLaunch = () => {
        if (!iconRef.current) return;

        const tl = gsap.timeline();
        tl.to(iconRef.current, {
            y: -100,
            scale: 1.2,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
        })
            .set(iconRef.current, { y: 100, scale: 0.5 })
            .to(iconRef.current, {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)",
            });
    };

    return (
        <div className="flex items-center gap-3 group">
            {/* Hexagonal Logo Icon */}
            <div
                ref={iconRef}
                onClick={handleLaunch}
                className="relative transition-transform duration-500 hover:scale-110 cursor-pointer"
                style={{ width: icon, height: icon }}
            >
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))' }}
                >
                    {/* Outer hexagon border */}
                    <path
                        d="M50 2 L93 27 L93 73 L50 98 L7 73 L7 27 Z"
                        fill="#1a1a24"
                        stroke="#22c55e"
                        strokeWidth="3"
                        className="transition-all duration-300"
                    />

                    {/* Inner hexagon */}
                    <path
                        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                        fill="url(#hexGradient)"
                        className="transition-all duration-300"
                    />

                    {/* Crystal/Ice shard - main */}
                    <path
                        d="M50 20 L70 45 L65 70 L50 80 L35 70 L30 45 Z"
                        fill="url(#crystalGradient)"
                        opacity="0.9"
                        className="transition-all duration-300"
                    />

                    {/* Crystal facet left */}
                    <path
                        d="M30 45 L50 20 L50 50 L35 70 Z"
                        fill="#4ade80"
                        opacity="0.7"
                    />

                    {/* Crystal facet right */}
                    <path
                        d="M70 45 L50 20 L50 50 L65 70 Z"
                        fill="#22c55e"
                        opacity="0.8"
                    />

                    {/* Crystal highlight */}
                    <path
                        d="M45 25 L55 25 L58 40 L50 50 L42 40 Z"
                        fill="#86efac"
                        opacity="0.6"
                    />

                    {/* Envelope/mail shape overlay */}
                    <path
                        d="M25 55 L50 40 L75 55 L75 75 L50 65 L25 75 Z"
                        fill="url(#mailGradient)"
                        opacity="0.4"
                    />

                    <defs>
                        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#166534" />
                            <stop offset="100%" stopColor="#14532d" />
                        </linearGradient>
                        <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="50%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                        <linearGradient id="mailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#86efac" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Text */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`${text} font-black tracking-wider text-primary transition-colors duration-300 group-hover:text-green-500`}>
                        EXPYRE
                    </span>
                    {showTagline && (
                        <span className="text-xs text-muted tracking-widest uppercase">
                            No More Spams
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
