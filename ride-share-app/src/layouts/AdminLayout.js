import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import { Bell, Search, User } from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-[#EBEDF5] relative flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">

                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-[#EBEDF5] border-b border-slate-300/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Search (Hidden on mobile for now or collapsed) */}
                        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
                            <Search className="text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search users, drivers, rides..."
                                className="bg-transparent border-none outline-none ml-2 text-sm text-slate-600 w-full placeholder:text-slate-400"
                            />
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4 ml-auto">
                            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                            </button>

                            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-semibold text-slate-700">Admin User</p>
                                    <p className="text-xs text-slate-500">Super Admin</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] cursor-pointer">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                        <User className="text-slate-400" size={24} />
                                        {/* <img src="..." alt="Admin" /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
