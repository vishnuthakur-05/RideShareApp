import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Smart Ride Share</h3>
                        <p className="text-gray-400 mb-6">
                            Connecting people, saving money, and protecting the planet, one ride at a time.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<Facebook size={20} />} />
                            <SocialIcon icon={<Twitter size={20} />} />
                            <SocialIcon icon={<Instagram size={20} />} />
                            <SocialIcon icon={<Linkedin size={20} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                            <li><Link to="/how-it-works" className="text-gray-400 hover:text-white transition">How It Works</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-white transition">Trust & Safety</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
                        <p className="text-gray-400 mb-4 text-sm">Subscribe to our newsletter for the latest updates and offers.</p>
                        <div className="flex group mt-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-800 text-white px-4 py-3 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-[#EBEDF5] w-full border border-slate-600 border-r-0 transition-all placeholder-slate-400 text-sm"
                            />
                            <button className="bg-[#EBEDF5] text-indigo-900 px-6 py-3 rounded-r-xl hover:bg-white transition-all duration-200 font-bold whitespace-nowrap shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-900 border-none">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Smart Ride Share. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
                        Made with <Heart size={14} className="text-red-500 mx-1" fill="currentColor" /> for a better future.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a href="/" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-indigo-900 transition duration-300">
        {icon}
    </a>
);

export default Footer;
