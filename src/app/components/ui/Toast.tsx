'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose?: () => void;
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    };

    if (!isVisible) return null;

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertTriangle
    };

    const styles = {
        success: 'bg-green-500/20 border-green-500/30 text-green-400',
        error: 'bg-red-500/20 border-red-500/30 text-red-400',
        info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
        warning: 'bg-orange-500/20 border-orange-500/30 text-orange-400'
    };

    const Icon = icons[type];

    return (
        <div
            className={`fixed top-20 right-6 z-[100] max-w-md animate-in ${
                isExiting ? 'animate-out' : ''
            }`}
        >
            <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl ${styles[type]}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium text-white flex-1">{message}</p>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Toast Container for multiple toasts
interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed top-20 right-6 z-[100] space-y-3">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-in"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}
