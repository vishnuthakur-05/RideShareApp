import React from 'react';
import { User, Car, X } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose, onSelectRole }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Smart Ride Share</h2>
                    <p className="text-gray-500 mb-8">How would you like to use the platform?</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Passenger Option */}
                        <div
                            onClick={() => onSelectRole('passenger')}
                            className="group relative p-6 bg-gray-50 rounded-xl border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
                        >
                            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                                <User className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Passenger</h3>
                            <p className="text-gray-500 text-sm">Book rides, save money on travel, and reduce your carbon footprint.</p>
                        </div>

                        {/* Driver Option */}
                        <div
                            onClick={() => onSelectRole('driver')}
                            className="group relative p-6 bg-gray-50 rounded-xl border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
                        >
                            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                                <Car className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Driver</h3>
                            <p className="text-gray-500 text-sm">Offer rides, earn money, and meet interesting people on your commute.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Already have an account? <a href="/login" className="text-indigo-600 font-medium hover:text-indigo-800">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
