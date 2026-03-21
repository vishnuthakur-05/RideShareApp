import React from 'react';
import ReactDOM from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'info', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    const colors = {
        info: {
            icon: 'text-blue-500 bg-blue-100',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
        success: {
            icon: 'text-green-500 bg-green-100',
            button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        },
        warning: {
            icon: 'text-amber-500 bg-amber-100',
            button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        },
        danger: {
            icon: 'text-rose-500 bg-rose-100',
            button: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
        },
    };

    const style = colors[type] || colors.info;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all scale-100 animate-scale-up relative z-[10000]">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${style.icon}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-600 mb-6">{message}</p>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${style.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
