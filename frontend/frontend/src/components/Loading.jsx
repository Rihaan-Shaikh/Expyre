export function LoadingSpinner({ size = "md", className = "" }) {
    const sizes = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-3",
        lg: "w-16 h-16 border-4"
    };

    return (
        <div className={`${sizes[size]} rounded-full border-neon-indigo/20 border-t-neon-indigo animate-spin ${className}`} />
    );
}

export function SkeletonBox({ className = "" }) {
    return (
        <div className={`shimmer rounded-lg ${className}`} />
    );
}

export function SkeletonText({ lines = 1, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`shimmer h-4 rounded ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
                />
            ))}
        </div>
    );
}

export function EmailCardSkeleton() {
    return (
        <div className="card-glass p-6 md:p-8 w-full max-w-lg mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <SkeletonBox className="h-6 w-40" />
                <SkeletonBox className="h-6 w-16 rounded-full" />
            </div>

            {/* Email Display */}
            <div className="p-4 rounded-xl bg-cyber-dark/50 border border-white/5 mb-6">
                <div className="flex items-center gap-3">
                    <SkeletonBox className="h-8 flex-1" />
                    <SkeletonBox className="h-10 w-10" />
                </div>
            </div>

            {/* Countdown Skeleton */}
            <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full shimmer" />
                <SkeletonBox className="h-4 w-24 mt-4" />
            </div>
        </div>
    );
}

export function InboxSkeleton() {
    return (
        <div className="card-glass p-6 md:p-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <SkeletonBox className="w-10 h-10" />
                    <div>
                        <SkeletonBox className="h-5 w-20 mb-1" />
                        <SkeletonBox className="h-4 w-28" />
                    </div>
                </div>
                <SkeletonBox className="h-9 w-9 rounded-lg" />
            </div>

            {/* Email List Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-cyber-dark/50">
                        <div className="flex items-start gap-4">
                            <SkeletonBox className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <SkeletonBox className="h-4 w-32" />
                                    <SkeletonBox className="h-3 w-12" />
                                </div>
                                <SkeletonBox className="h-4 w-48 mb-1" />
                                <SkeletonBox className="h-3 w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Loading({ type = "spinner" }) {
    switch (type) {
        case "email-card":
            return <EmailCardSkeleton />;
        case "inbox":
            return <InboxSkeleton />;
        default:
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            );
    }
}
