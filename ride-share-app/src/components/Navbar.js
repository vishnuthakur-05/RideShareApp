import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoleSelectionModal from './RoleSelectionModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    // Note: In React Router v6 used here, useNavigate hook is standard. 
    // Assuming Navbar is inside Router context.
    // If not, we might need to Wrap or pass control.
    // But since it uses <Link>, it must be in Router.

    // Actually, let's use a simple state handler and Link for now, or window.location if needed, 
    // but better to use useNavigate for programmatic navigation after selection.
    // Let's import useNavigate.

    const handleRoleSelect = (role) => {
        setIsRoleModalOpen(false);
        // Navigate to signup with role state
        // We will need to update SignupPage to accept state or query param
        // For now, let's pass it via state in navigation (if using useNavigate)
        // Or just query param: /signup?role=passenger
        window.location.href = `/signup?role=${role}`;
    };

    return (
        <>
            <nav className="bg-slate-900 shadow-xl fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                                Smart Ride Share
                            </Link>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">Home</Link>
                            <Link to="/about" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">About Us</Link>
                            <Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">How it Works</Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors duration-200">
                                Login
                            </Link>
                            <button
                                onClick={() => setIsRoleModalOpen(true)}
                                className="bg-[#EBEDF5] text-indigo-900 px-5 py-2.5 rounded-xl hover:bg-white transition-all duration-200 font-bold shadow-lg shadow-white/5"
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-600 hover:text-indigo-900 focus:outline-none"
                            >
                                {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden bg-slate-900 border-t border-slate-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 text-slate-400 hover:text-white font-medium">Home</Link>
                            <Link to="/about" className="block px-3 py-2 text-slate-400 hover:text-white font-medium">About Us</Link>
                            <Link to="/how-it-works" className="block px-3 py-2 text-slate-400 hover:text-white font-medium">How it Works</Link>
                            <div className="mt-4 flex flex-col space-y-2 px-3">
                                <Link to="/login" className="text-left text-slate-400 hover:text-white font-medium py-2">Login</Link>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsRoleModalOpen(true);
                                    }}
                                    className="bg-[#EBEDF5] text-indigo-900 px-4 py-3 rounded-xl hover:bg-white block text-center w-full font-bold transition-all duration-200"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <RoleSelectionModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onSelectRole={handleRoleSelect}
            />
        </>
    );
};

export default Navbar;
