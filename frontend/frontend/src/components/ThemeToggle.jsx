import { useState, useEffect } from "react";
import gsap from "gsap";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "light") {
            root.setAttribute("data-theme", "light");
        } else {
            root.removeAttribute("data-theme");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";

        // Animation
        const icon = document.querySelector(".theme-icon");
        gsap.to(icon, {
            rotate: theme === "dark" ? 360 : 0,
            scale: 0.5,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                setTheme(newTheme);
                gsap.to(icon, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                });
            }
        });
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 group overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className="theme-icon">
                {theme === "dark" ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </div>

            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme === "dark" ? 'bg-yellow-400/10' : 'bg-orange-500/10'}`} />
        </button>
    );
}
