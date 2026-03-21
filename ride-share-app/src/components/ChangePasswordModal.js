import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Lock, AlertTriangle, Eye, EyeOff, X } from 'lucide-react';
import { changePassword } from '../services/api';

const ChangePasswordModal = ({ isOpen, onClose, isForced = true }) => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const email = localStorage.getItem('email');
            await changePassword({ email, newPassword: formData.newPassword });
            setSuccess(true);
            setTimeout(() => {
                if (isForced) {
                    localStorage.removeItem('isFirstLogin');
                    localStorage.removeItem('email'); // Optional: clear email if not needed elsewhere
                }
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 animate-scale-up relative z-[10000] border-t-4 ${isForced ? 'border-indigo-600' : 'border-blue-500'}`}>
                {!isForced && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                )}
                <div className="p-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className={`p-4 rounded-full ${isForced ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'} mb-4`}>
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Change Password</h2>
                        <p className="text-slate-500 text-center mt-2">
                            {isForced
                                ? "For security reasons, you must change your temporary password to continue."
                                : "Enter a new password to update your credentials."}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                            <div className="flex items-center">
                                <AlertTriangle className="text-red-500 mr-2 flex-shrink-0" size={20} />
                                <p className="text-red-700 font-medium text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {success ? (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg text-center">
                            <p className="text-green-700 font-bold">Password changed successfully!</p>
                            <p className="text-green-600 text-sm mt-1">Redirecting...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full pl-4 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                                    }`}
                            >
                                {loading ? 'Updating...' : 'Set New Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ChangePasswordModal;
