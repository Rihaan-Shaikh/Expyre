export default function EmailView({ email, onClose }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[85vh] bg-cyber-darker rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="sticky top-0 z-10 glass p-4 md:p-6 border-b border-white/10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-primary truncate mb-1">
                                {email.subject || "(No Subject)"}
                            </h2>
                            <div className="flex items-center gap-3 text-sm text-secondary">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-indigo to-neon-sapphire flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">
                                            {email.from?.charAt(0)?.toUpperCase() || "?"}
                                        </span>
                                    </div>
                                    <span className="truncate font-medium">{email.from || "Unknown Sender"}</span>
                                </div>
                                <span className="text-secondary opacity-50">•</span>
                                <span>{formatDate(email.received_at)}</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    <div className="prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-primary text-base leading-relaxed bg-transparent p-0 m-0">
                            {email.body || "No content"}
                        </pre>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 glass p-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            This is a temporary email. Content will be deleted on expiry.
                        </p>
                        <button
                            onClick={onClose}
                            className="btn-secondary text-sm px-4 py-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
