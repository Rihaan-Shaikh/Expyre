import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import Logo from "../components/Logo";
import {
  MagneticButton,
  RippleButton,
  GlitchText,
  useCursorGlow,
  AnimatedCounter
} from "../components/AnimatedElements";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  // Enable smooth scrolling
  useSmoothScroll();

  // Enable cursor glow effect
  useCursorGlow();

  // Main animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations timeline
      const heroTl = gsap.timeline({ delay: 0.5 });

      heroTl
        .fromTo(".hero-badge",
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
        )
        .fromTo(".hero-title-1",
          { opacity: 0, y: 80, rotateX: -45 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: "power4.out" },
          "-=0.3"
        )
        .fromTo(".hero-title-2",
          { opacity: 0, y: 80, rotateX: -45 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: "power4.out" },
          "-=0.7"
        )
        .fromTo(".hero-subtitle",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(".hero-buttons",
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.4"
        )
        .fromTo(".hero-stats > div",
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.3"
        );

      // Scroll indicator bounce
      gsap.to(".scroll-indicator", {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Features section - cards fly in with 3D rotation
      const featureCards = gsap.utils.toArray(".feature-card");
      featureCards.forEach((card, i) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotateY: -30,
            rotateX: 15,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".features-section",
              start: "top 75%",
            }
          }
        );
      });

      // Section title reveals
      gsap.utils.toArray(".section-title").forEach(title => {
        gsap.fromTo(title,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 85%",
            }
          }
        );
      });

      // Steps section - staggered reveal with connecting line draw
      gsap.fromTo(".step-card",
        { opacity: 0, y: 60, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".steps-section",
            start: "top 70%",
          }
        }
      );

      // Draw connecting line
      gsap.fromTo(".connecting-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".steps-section",
            start: "top 60%",
          }
        }
      );

      // CTA section parallax and reveal
      gsap.fromTo(".cta-content",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 75%",
          }
        }
      );

      // Background orbs parallax
      gsap.to(".parallax-orb-1", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".parallax-orb-2", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-primary text-primary relative overflow-hidden transition-colors duration-500">
      {/* 3D Background */}
      <Background3D />

      {/* Parallax Background Orbs */}
      <div className="parallax-orb-1 absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="parallax-orb-2 absolute top-1/2 right-1/4 w-80 h-80 bg-sapphire-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-20">
          {/* Badge */}
          <div className="hero-badge mb-8">
            <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-sm text-indigo-400 hover:border-indigo-500/60 hover:bg-indigo-500/20 transition-all duration-300 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              No signup required — Completely anonymous
            </span>
          </div>

          {/* Hero Logo */}
          <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <Logo size="hero" showText={false} />
          </div>

          {/* Main Heading */}
          <h1 className="hero-title-1 text-5xl md:text-7xl lg:text-8xl font-black mb-2 leading-tight" style={{ perspective: '1000px' }}>
            <span className="block text-primary">Disposable Emails.</span>
          </h1>
          <h1 className="hero-title-2 text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-sapphire-400 to-blue-400 bg-clip-text text-transparent">
              <GlitchText text="Instant. Private." />
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle text-lg md:text-xl text-secondary max-w-2xl mb-12 leading-relaxed">
            Generate temporary email addresses in seconds. Protect your real inbox
            from spam, tracking, and unwanted newsletters.
            <span className="text-indigo-400 font-medium"> No more spam. Ever.</span>
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4">
            <MagneticButton
              onClick={() => navigate("/dashboard")}
              className="group relative px-12 py-5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-sapphire-600 rounded-2xl text-lg font-bold text-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Generate Email
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </MagneticButton>

            <RippleButton
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 rounded-2xl text-lg font-semibold text-indigo-400 border-2 border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
            >
              See How It Works
            </RippleButton>
          </div>

          {/* Stats */}
          <div className="hero-stats mt-24 grid grid-cols-3 gap-12 md:gap-24">
            <StatCard value="10" suffix="min" label="Auto Expiry" />
            <StatCard value="100" suffix="%" label="Private" />
            <StatCard value="∞" label="Unlimited" isSymbol />
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 text-secondary">
              <span className="text-xs uppercase tracking-widest text-muted">Scroll</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="features-section py-32 px-6 relative">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

          <div className="max-w-6xl mx-auto relative">
            <div className="section-title text-center mb-20">
              <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Features</span>
              <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
                Why Choose <span className="bg-gradient-to-r from-indigo-400 to-sapphire-400 bg-clip-text text-transparent">Expyre</span>?
              </h2>
              <p className="text-secondary max-w-2xl mx-auto text-lg">
                Privacy-first disposable emails with zero compromises.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon="⚡"
                title="Instant Generation"
                description="Get a working email in milliseconds. No signup, no verification, no waiting. Just click and go."
                color="blue"
              />
              <FeatureCard
                icon="🔒"
                title="Complete Privacy"
                description="We don't track you. No cookies, no analytics, no data collection. Your emails vanish forever."
                color="indigo"
              />
              <FeatureCard
                icon="⏱️"
                title="Auto-Expiry"
                description="Emails self-destruct after 10 minutes. No cleanup needed, no traces left behind."
                color="violet"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" ref={stepsRef} className="steps-section py-32 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative">
            <div className="section-title text-center mb-20">
              <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">How It Works</span>
              <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
                Three Simple <span className="bg-gradient-to-r from-indigo-400 to-sapphire-400 bg-clip-text text-transparent">Steps</span>
              </h2>
              <p className="text-secondary max-w-2xl mx-auto text-lg">
                Protect your privacy in seconds.
              </p>
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="connecting-line hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-gradient-to-r from-indigo-500 via-sapphire-500 to-blue-500 rounded-full origin-left" style={{ transform: 'translateY(-50%)' }} />

              <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                <StepCard
                  number="01"
                  title="Generate"
                  description="Click the button to instantly create a unique temporary email address."
                  icon="🎯"
                />
                <StepCard
                  number="02"
                  title="Receive"
                  description="Use your temp email anywhere. New messages appear in real-time."
                  icon="📨"
                />
                <StepCard
                  number="03"
                  title="Forget"
                  description="After 10 minutes, everything is automatically deleted. No traces."
                  icon="💨"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section ref={ctaRef} className="cta-section py-40 px-6 text-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl" />

          <div className="cta-content max-w-4xl mx-auto relative">
            <Logo size="large" showText={false} />
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-8 mb-8">
              Ready to Protect Your <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sapphire-400 to-blue-400 bg-clip-text text-transparent">Privacy</span>?
            </h2>
            <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
              Start generating disposable emails now. <br />
              It's free, instant, and completely anonymous.
            </p>
            <MagneticButton
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-3 px-14 py-6 bg-gradient-to-r from-indigo-500 to-sapphire-500 rounded-2xl text-xl font-bold text-white hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-105"
            >
              Get Your Temp Email
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </MagneticButton>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 bg-cyber-dark/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="small" showText={true} showTagline={true} />
            <p className="text-sm text-muted">
              © 2026 Expyre. No tracking. No cookies. No spam.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ value, suffix = "", label, isSymbol = false }) {
  return (
    <div className="text-center group cursor-default">
      <div className="text-3xl md:text-5xl font-bold mb-2 transition-all duration-300 group-hover:scale-110">
        <span className="bg-gradient-to-r from-indigo-400 to-sapphire-400 bg-clip-text text-transparent">
          {isSymbol ? value : <><AnimatedCounter value={parseInt(value)} />{suffix}</>}
        </span>
      </div>
      <div className="text-sm text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colors = {
    blue: "from-blue-500/20 via-indigo-500/10 hover:border-blue-500/50",
    indigo: "from-indigo-500/20 via-sapphire-500/10 hover:border-indigo-500/50",
    violet: "from-violet-500/20 via-indigo-500/10 hover:border-violet-500/50",
  };

  return (
    <div
      className={`feature-card group p-10 rounded-3xl bg-gradient-to-br ${colors[color]} to-transparent border border-white/5 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-default`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="text-6xl mb-6 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{title}</h3>
      <p className="text-secondary leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="step-card text-center group">
      <div className="relative inline-block mb-8">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyber-card to-cyber-darker border border-white/10 flex items-center justify-center text-5xl transition-all duration-500 group-hover:scale-110 group-hover:border-green-500/50 group-hover:shadow-2xl group-hover:shadow-green-500/20 group-hover:rotate-3">
          {icon}
        </div>
        <span className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sapphire-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
          {number}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{title}</h3>
      <p className="text-secondary max-w-xs mx-auto font-medium">{description}</p>
    </div>
  );
}
