import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await changePassword({
                email: formData.email,
                newPassword: formData.newPassword
            });
            setMessage('Password changed successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Change Password</h2>
                    <p className="mt-2 text-sm text-gray-600">Please set a new password for your account.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500 mr-2" size={20} />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <p className="text-green-700 font-medium">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email validation</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Confirm your email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-900 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-900 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-900 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
