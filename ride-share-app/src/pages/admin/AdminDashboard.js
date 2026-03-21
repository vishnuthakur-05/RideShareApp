import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    Users,
    Car,
    DollarSign,
    Activity
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import RecentActivity from '../../components/admin/RecentActivity';
import { fetchDashboardStats } from '../../services/api';



const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Total Users', value: '0', change: '+0%', icon: Users, color: 'indigo' },
        { label: 'Active Drivers', value: '0', change: '+0%', icon: Car, color: 'emerald' },
        { label: 'Total Revenue', value: '$0', change: '+0%', icon: DollarSign, color: 'violet' },
        { label: 'Pending Verifications', value: '0', change: '0', icon: Activity, color: 'amber' },
    ]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardStats();
                if (data.chartData && Array.isArray(data.chartData)) {
                    setChartData(data.chartData);
                }
                setStats([
                    { label: 'Total Users', value: data.totalUsers.toString(), change: '+12%', icon: Users, color: 'indigo', path: '/admin/approved-users' },
                    { label: 'Active Drivers', value: data.activeDrivers.toString(), change: '+5%', icon: Car, color: 'emerald', path: '/admin/approved-users' },
                    { label: 'Total Revenue', value: `$${data.totalRevenue}`, change: '+8.5%', icon: DollarSign, color: 'violet' }, // Use real if available or keep dummy
                    { label: 'Pending Verifications', value: data.pendingVerifications.toString(), change: '-2%', icon: Activity, color: 'amber', path: '/admin/pending-approvals' },
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const handleDownloadReport = () => {
        const input = document.getElementById('dashboard-layout');
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`dashboard_report_${new Date().toISOString().split('T')[0]}.pdf`);
            });
        }
    };

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div id="dashboard-layout" className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <button 
                    onClick={handleDownloadReport}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Ride Statistics</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="rides" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
