import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";
  const navRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  return (
    <header
      ref={navRef}
      className={`w-full px-6 py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-glass backdrop-blur-xl border-b border-primary/10 shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <Logo size="default" showText={true} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {isHome && (
            <>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it Works</NavLink>
            </>
          )}

          <ThemeToggle />

          {isHome ? (
            <Link
              to="/dashboard"
              className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          ) : (
            <Link
              to="/"
              className="text-sm text-secondary hover:text-neon-indigo transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all"
        >
          <div className="relative w-5 h-4 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>

        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-6 mt-4 border-t border-white/10">
          <div className="flex flex-col gap-2">
            {isHome && (
              <>
                <MobileNavLink href="#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
                <MobileNavLink href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</MobileNavLink>
              </>
            )}
            <Link
              to={isHome ? "/dashboard" : "/"}
              className="mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-center text-sm font-semibold text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isHome ? "Get Started →" : "← Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-sm text-secondary hover:text-neon-indigo transition-all duration-300 relative group py-2"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-gradient transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

function MobileNavLink({ href, children, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="py-3 px-4 rounded-xl text-secondary hover:text-neon-indigo hover:bg-white/5 transition-all"
    >
      {children}
    </a>
  );
}
