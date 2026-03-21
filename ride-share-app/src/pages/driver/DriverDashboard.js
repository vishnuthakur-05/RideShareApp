import React, { useState, useEffect } from 'react';
import { IndianRupee, Car, CalendarClock, CheckCircle2, Star } from 'lucide-react';
import { fetchDriverRides, fetchUserProfile } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DriverDashboard = () => {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        myHostedRides: 0,
        upcomingRides: 0,
        completedRides: 0,
        averageRating: 0,
        totalReviews: 0
    });

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const profile = await fetchUserProfile();
                if (profile && profile.id) {
                    const rides = await fetchDriverRides(profile.id);

                    let earnings = 0;
                    let upcoming = 0;
                    let completed = 0;

                    // Basic aggregation for chart (group by date)
                    const earningsByDate = {};

                    rides.forEach(ride => {
                        if (ride.status === 'Completed') {
                            completed++;
                            earnings += ride.totalPrice || 0;

                            const date = ride.date || 'Unknown';
                            earningsByDate[date] = (earningsByDate[date] || 0) + (ride.totalPrice || 0);
                        } else if (ride.status === 'Upcoming') {
                            upcoming++;
                        }
                    });

                    // Use overall driver stats from the first ride if available
                    const driverRating = rides.length > 0 ? rides[0].driverRating : 0;
                    const totalReviews = rides.length > 0 ? rides[0].totalRatingCount : 0;

                    setStats({
                        totalEarnings: earnings,
                        myHostedRides: rides.length,
                        upcomingRides: upcoming,
                        completedRides: completed,
                        averageRating: driverRating || 0,
                        totalReviews: totalReviews || 0
                    });



                    // Format for Recharts
                    const formattedChartData = Object.keys(earningsByDate).map(date => ({
                        date: date.length >= 5 ? date.substring(5) : date, // Simple format MM-DD
                        earnings: earningsByDate[date]
                    })).sort((a, b) => a.date.localeCompare(b.date));

                    setChartData(formattedChartData);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const statCards = [
        {
            title: "Total Earnings",
            value: `₹${stats.totalEarnings.toLocaleString()}`,
            icon: IndianRupee,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/30",
            trend: "Lifetime earnings"
        },
        {
            title: "My Hosted Rides",
            value: stats.myHostedRides,
            icon: Car,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            trend: "Total rides posted"
        },
        {
            title: "Upcoming Rides",
            value: stats.upcomingRides,
            icon: CalendarClock,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            trend: "Scheduled trips"
        },
        {
            title: "Completed Rides",
            value: stats.completedRides,
            icon: CheckCircle2,
            color: "text-indigo-600",
            bg: "bg-indigo-100 dark:bg-indigo-900/30",
            trend: "Successfully finished"
        },
        {
            title: "Driver Rating",
            value: stats.averageRating > 0 ? stats.averageRating : 'N/A',
            icon: Star,
            color: "text-yellow-600",
            bg: "bg-yellow-100 dark:bg-yellow-900/30",
            trend: `${stats.totalReviews} total reviews`
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Overview</h1>

            {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading your dashboard insights...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((card, index) => (
                            <div key={index} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer group ${statCards.length > 4 ? 'lg:col-span-1' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
                                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{card.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${card.bg} transition-colors group-hover:bg-opacity-80`}>
                                        <card.icon size={24} className={card.color} />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {card.trend}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Earnings History</h2>
                        </div>
                        <div className="h-80 w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`₹${value}`, 'Earnings']}
                                        />
                                        <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                    <IndianRupee className="text-gray-400 mb-2" size={32} />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Complete rides to see your earnings visualized here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DriverDashboard;
