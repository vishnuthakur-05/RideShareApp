import React, { useState } from 'react';
import { Mail, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const response = await loginUser(formData);
            console.log('Login Success:', response);

            // Redirect based on role
            if (response.isFirstLogin) {
                localStorage.setItem('isFirstLogin', 'true');
                localStorage.setItem('email', formData.email);
            } else {
                localStorage.removeItem('isFirstLogin');
            }

            if (response.role === 'ADMIN') {
                navigate('/admin');
            } else if (response.role === 'DRIVER') {
                navigate('/driver');
            } else if (response.role === 'PASSENGER') {
                navigate('/passenger-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login Failed:', err);
            // Backend sends simple string for error in 403, or object in other cases. 
            // Axios puts response body in err.response.data
            const msg = err && err.message ? err.message : 'Login failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">

            {/* Back to Home Button */}
            <Link to="/" className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition text-white">
                <ChevronLeft size={32} />
            </Link>

            {/* Background Image */}
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
            </div>

            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500 mr-2" size={20} />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/" className="font-medium text-indigo-900 hover:text-indigo-800">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-indigo-900 hover:text-indigo-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
