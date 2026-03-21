import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Car,
    MapPin,
    ShieldCheck,
    LogOut,
    Menu,
    X
} from 'lucide-react';

import ConfirmationModal from './ConfirmationModal';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Approved Users', icon: Users, path: '/admin/approved-users' },
        { name: 'Pending Approvals', icon: ShieldCheck, path: '/admin/pending-approvals' },
        { name: 'Ride Monitoring', icon: MapPin, path: '/admin/rides' },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
                onClick={toggleSidebar}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="p-6 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                                <Car className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                RideShare Admin
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${active
                                            ? 'bg-indigo-600/20 text-indigo-400 shadow-sm border border-indigo-500/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }
                  `}
                                >
                                    <item.icon
                                        size={20}
                                        className={`transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-white'}`}
                                    />
                                    <span className="font-medium">{item.name}</span>

                                    {active && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 group"
                        >
                            <LogOut size={20} className="group-hover:text-rose-400" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                confirmText="Sign Out"
                type="danger"
            />
        </>
    );
};

export default Sidebar;
