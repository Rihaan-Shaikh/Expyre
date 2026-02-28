import { useState } from "react";
import EmailView from "./EmailView";

export default function Inbox({ messages = [], isExpired, onRefresh }) {
    const [selectedEmail, setSelectedEmail] = useState(null);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const isEmpty = messages.length === 0;

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        if (onRefresh) await onRefresh();
        // Keep animation for at least 1.5s for visual feedback
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
        <div className="card-glass p-6 md:p-8 transition-all duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-indigo/20 to-neon-sapphire/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-neon-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Inbox</h3>
                        <p className="text-sm text-secondary">
                            {isEmpty ? (isRefreshing ? "Checking for mails..." : "No messages yet") : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>

                {!isExpired && (
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-neon-indigo transition-all duration-300 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Refresh inbox"
                    >
                        <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Empty State */}
            {isEmpty && (
                <div className="py-12 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyber-card to-cyber-darker flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-primary mb-2">Your inbox is empty</h4>
                    <p className="text-sm text-secondary max-w-sm mx-auto">
                        {isExpired
                            ? "This email has expired. Generate a new one to receive messages."
                            : "Emails sent to your temporary address will appear here in real-time."}
                    </p>
                    {!isExpired && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-neon-indigo rounded-full animate-pulse"></div>
                            <span>Waiting for emails...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Email List */}
            {!isEmpty && (
                <div className="space-y-3">
                    {messages.map((message, index) => (
                        <EmailListItem
                            key={index}
                            message={message}
                            onClick={() => setSelectedEmail(message)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        />
                    ))}
                </div>
            )}

            {/* Email Detail Modal */}
            {selectedEmail && (
                <EmailView
                    email={selectedEmail}
                    onClose={() => setSelectedEmail(null)}
                />
            )}
        </div>
    );
}

function EmailListItem({ message, onClick, style }) {
    const formatTime = (dateString) => {
        const safeStr = (dateString && !dateString.endsWith('Z') && !dateString.includes('+'))
            ? `${dateString}Z`
            : dateString;
        const date = new Date(safeStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <button
            onClick={onClick}
            className="w-full p-4 rounded-xl bg-cyber-dark/50 border border-white/5 hover:border-neon-cyan/30 transition-all duration-300 text-left group animate-fade-in"
            style={style}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-emerald flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                        {message.from?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-primary truncate group-hover:text-neon-indigo transition-colors">
                            {message.from || "Unknown Sender"}
                        </span>
                        <span className="text-xs text-secondary flex-shrink-0">
                            {formatTime(message.received_at)}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-primary truncate mb-1">
                        {message.subject || "(No Subject)"}
                    </p>
                    <p className="text-sm text-secondary truncate">
                        {message.body?.substring(0, 80) || "No preview available..."}
                    </p>
                </div>

                {/* Arrow */}
                <svg className="w-5 h-5 text-slate-600 group-hover:text-neon-indigo transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}
