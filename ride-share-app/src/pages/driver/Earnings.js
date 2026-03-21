import React, { useState, useEffect } from 'react';
import { TrendingUp, CalendarDays, Wallet, Activity } from 'lucide-react';
import { getDriverBookings, fetchUserProfile } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Earnings = () => {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        thisMonthEarnings: 0,
        todayEarnings: 0,
        todayRidesCount: 0
    });

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEarningsData = async () => {
            try {
                const profile = await fetchUserProfile();
                if (profile && profile.id) {
                    const bookings = await getDriverBookings(profile.id);

                    let total = 0;
                    let thisMonth = 0;
                    let today = 0;
                    let todayCount = 0;

                    const now = new Date();
                    const currentMonth = now.getMonth() + 1;
                    const currentYear = now.getFullYear();
                    const todayString = now.toISOString().split('T')[0];

                    const earningsByDate = {};
                    const countedRidesToday = new Set();

                    bookings.forEach(booking => {
                        // Earnings should count Paid or Completed bookings
                        if (booking.status === 'Paid' || booking.status === 'Completed') {
                            const price = booking.price || 0;
                            total += price;

                            const bDate = booking.date || ''; // Format YYYY-MM-DD

                            // Check This Month
                            if (bDate.startsWith(`${currentYear}-${currentMonth.toString().padStart(2, '0')}`)) {
                                thisMonth += price;
                            }

                            // Check Today
                            if (bDate === todayString) {
                                today += price;
                                if (booking.rideId) {
                                    countedRidesToday.add(booking.rideId);
                                }
                            }

                            // Aggregate for Chart
                            earningsByDate[bDate] = (earningsByDate[bDate] || 0) + price;
                        }
                    });

                    setStats({
                        totalEarnings: total,
                        thisMonthEarnings: thisMonth,
                        todayEarnings: today,
                        todayRidesCount: countedRidesToday.size
                    });

                    // Format for Recharts (Last 10 days of activity)
                    const formattedChartData = Object.keys(earningsByDate).map(date => ({
                        date: date.length >= 5 ? date.substring(5) : date,
                        fullDate: date,
                        earnings: earningsByDate[date]
                    })).sort((a, b) => a.fullDate.localeCompare(b.fullDate)).slice(-10);

                    setChartData(formattedChartData);
                }
            } catch (err) {
                console.error("Failed to load earnings data", err);
            } finally {
                setLoading(false);
            }
        };

        loadEarningsData();
    }, []);

    if (loading) {
        return <div className="p-12 text-center text-gray-500 font-medium">Loading your earnings data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Earnings Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 shadow-lg text-white transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="font-medium text-indigo-100 mb-1">Total Lifetime Earnings</p>
                            <h3 className="text-4xl font-bold">₹{stats.totalEarnings.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-white/20">
                            <Wallet size={24} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">₹{stats.thisMonthEarnings.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                            <TrendingUp size={24} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 font-medium tracking-tight">Active performance</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Today</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">₹{stats.todayEarnings.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <CalendarDays size={24} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">{stats.todayRidesCount} rides completed today</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Earnings Analytics</h2>
                <div className="h-80 w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Earnings']}
                                />
                                <Bar dataKey="earnings" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <Activity className="text-gray-400 mb-2" size={32} />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Analytics chart will populate once rides are completed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Earnings;
