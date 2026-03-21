import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api';
import {
    LayoutDashboard,
    Car,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Sun,
    Moon,
    PlusCircle,
    List,
    IndianRupee
} from 'lucide-react';
import ChangePasswordModal from '../components/ChangePasswordModal';
import EditProfileModal from '../components/EditProfileModal';

const PassengerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const profile = await fetchUserProfile();
                setUser(profile);
                if (profile.isFirstLogin) {
                    setShowChangePasswordModal(true);
                    // Update localStorage to sync
                    localStorage.setItem('isFirstLogin', 'true');
                    localStorage.setItem('email', profile.email);
                } else {
                    localStorage.removeItem('isFirstLogin');
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        checkUserStatus();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const triggerLogout = () => {
        setShowProfileMenu(false);
        setIsSidebarOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setShowLogoutModal(false);
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/passenger', icon: LayoutDashboard },
        { name: 'Search Ride', path: '/passenger/search-ride', icon: PlusCircle },
        { name: 'My Bookings', path: '/passenger/bookings', icon: List },
        { name: 'History', path: '/passenger/history', icon: List },
    ];

    return (
        <div className={`flex h-screen bg-gray-50 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'text-gray-900'}`}>
            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
            />
            <EditProfileModal
                isOpen={showEditProfileModal}
                onClose={() => setShowEditProfileModal(false)}
                user={user}
                onUpdate={async () => {
                    const profile = await fetchUserProfile();
                    setUser(profile);
                }}
            />

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <LogOut size={32} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Logout?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            Are you sure you want to end your current session and securely sign out of your account?
                        </p>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-white shadow-lg transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo/Brand */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        RideShare
                    </span>
                    <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/passenger'} // Only match exact path for dashboard root
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={triggerLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between px-6 bg-[#EBEDF5] border-b border-slate-300/50 shadow-sm z-10">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative flex items-center gap-3 pl-4 border-l dark:border-gray-700">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {user ? `${user.firstName} ${user.lastName}` : 'Passenger'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Pro Member</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm hover:ring-2 hover:ring-indigo-100 transition-all">
                                    <User size={20} />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20 animate-fade-in-down overflow-hidden">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowEditProfileModal(true);
                                                    setShowProfileMenu(false);
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                            >
                                                <User size={16} />
                                                Edit Profile
                                            </button>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <button
                                                onClick={triggerLogout}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#EBEDF5] p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PassengerLayout;
