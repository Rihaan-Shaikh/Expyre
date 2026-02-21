/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";

const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    const toast = {
        success: (message) => addToast(message, "success"),
        error: (message) => addToast(message, "error"),
        info: (message) => addToast(message, "info"),
        warning: (message) => addToast(message, "warning"),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
}

function Toast({ message, type }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const styles = {
        success: {
            bg: "bg-green-500/10 border-green-500/30",
            text: "text-green-400",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            bg: "bg-red-500/10 border-red-500/30",
            text: "text-red-400",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
        warning: {
            bg: "bg-yellow-500/10 border-yellow-500/30",
            text: "text-yellow-400",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        info: {
            bg: "bg-neon-indigo/10 border-neon-indigo/30",
            text: "text-neon-indigo",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const style = styles[type] || styles.info;

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${style.bg} backdrop-blur-sm shadow-lg transition-all duration-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
        >
            <span className={style.text}>{style.icon}</span>
            <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        </div>
    );
}

export default Toast;
