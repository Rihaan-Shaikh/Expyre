import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import EmailCard from "../components/EmailCard";
import Inbox from "../components/Inbox";
import Background3D from "../components/Background3D";
import Logo from "../components/Logo";
import { useToast } from "../components/Toast";
import { api } from "../services/api";

export default function Dashboard() {
  const [email, setEmail] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);

  const { success, info } = useToast();
  const pollingRef = useRef(null);
  const containerRef = useRef(null);

  // Initial animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".dashboard-header",
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Check for existing session or generate email on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedSession = localStorage.getItem('expyre_session');
      if (savedSession) {
        try {
          const { email: savedEmail } = JSON.parse(savedSession);
          setIsLoading(true);
          const details = await api.getEmailDetails(savedEmail);

          if (details.exists && !details.expired) {
            setEmail(details.email);
            setExpiresAt(details.expires_at);

            // Initial inbox fetch
            const messages = await api.getInbox(details.email);
            setInboxMessages(messages);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("Session restoration failed:", err);
        }
      }
      // If no session or invalid/expired, generate new one
      generateEmail();
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-polling for new messages
  useEffect(() => {
    if (!email || isExpired) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    // Start polling every 10 seconds
    pollingRef.current = setInterval(async () => {
      try {
        const messages = await api.getInbox(email);

        // Notify if new messages arrived
        if (messages.length > inboxMessages.length) {
          const newMsgCount = messages.length - inboxMessages.length;
          setInboxMessages(messages);
          success(`Received ${newMsgCount} new message${newMsgCount > 1 ? 's' : ''}!`);

          // Play a subtle sound or trigger a pulse animation (optional)
        } else if (JSON.stringify(messages) !== JSON.stringify(inboxMessages)) {
          // If content changed but count didn't (rare but possible)
          setInboxMessages(messages);
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 10000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, isExpired, inboxMessages.length]);

  const generateEmail = async () => {
    setIsLoading(true);
    setError(null);
    setIsExpired(false);
    setInboxMessages([]);
    localStorage.removeItem('expyre_session');

    try {
      const data = await api.generateEmail();

      setEmail(data.email);
      setExpiresAt(data.expires_at);
      info("New temporary address generated!");

      // Save session
      localStorage.setItem('expyre_session', JSON.stringify({
        email: data.email,
        expiresAt: data.expires_at
      }));
    } catch {
      setError("Failed to generate email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpired = () => {
    setIsExpired(true);
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  const handleCopy = () => {
    success("Email copied to clipboard!");
  };

  const handleRefreshInbox = async () => {
    if (!email || isExpired) return;
    try {
      const messages = await api.getInbox(email);
      if (messages.length > inboxMessages.length) {
        success("Inbox up to date!");
      }
      setInboxMessages(messages);
    } catch (err) {
      console.error("Failed to refresh inbox:", err);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-primary text-primary relative overflow-hidden transition-colors duration-500">
      {/* 3D Background */}
      <Background3D />

      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sapphire-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-12">
          {/* Header */}
          <div className="dashboard-header text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Dashboard
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary">
              Your <span className="bg-gradient-to-r from-indigo-400 via-sapphire-400 to-blue-400 bg-clip-text text-transparent">Temporary Email</span>
            </h1>
            <p className="text-secondary max-w-lg mx-auto text-lg">
              Use this email to sign up for services. Messages will appear in your inbox below.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="max-w-xl mx-auto mb-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-3 text-red-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-lg">{error}</span>
              </div>
              <button
                onClick={generateEmail}
                className="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <div className="relative w-24 h-24 mb-8">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
                {/* Inner pulsing circle */}
                <div className="absolute inset-4 rounded-full bg-indigo-500/10 animate-pulse"></div>
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Logo size="small" showText={false} />
                </div>
              </div>
              <p className="text-primary text-xl font-medium">Generating your email...</p>
              <p className="text-secondary text-sm mt-2">This won't take long</p>
            </div>
          )}

          {/* Email Card */}
          {!isLoading && email && (
            <div className="mb-12">
              <EmailCard
                email={email}
                expiresAt={expiresAt}
                onExpired={handleExpired}
                onCopy={handleCopy}
              />
            </div>
          )}

          {/* Generate New Button (when expired) */}
          {isExpired && (
            <div className="text-center mb-12 animate-fade-in-up">
              <button
                onClick={generateEmail}
                className="group relative px-12 py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl text-lg font-bold text-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 transition-transform group-hover:rotate-180 duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New Email
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          )}

          {/* Inbox Section */}
          {!isLoading && email && (
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Inbox
                messages={inboxMessages}
                isExpired={isExpired}
                onRefresh={handleRefreshInbox}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
