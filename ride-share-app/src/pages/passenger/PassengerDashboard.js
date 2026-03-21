import React, { useState, useEffect } from 'react';
import { Car, Navigation, CalendarClock, History, IndianRupee, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { fetchUserProfile, getPassengerBookings } from '../../services/api';

const PassengerDashboard = () => {
    const [stats, setStats] = useState({
        totalRides: 0,
        upcomingRides: 0,
        totalSpent: 0,
        distanceTraveled: 0
    });

    const [user, setUser] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthlyStats, setMonthlyStats] = useState({
        activity: [],
        spending: []
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const profile = await fetchUserProfile();
                setUser(profile);
                if (profile && profile.id) {
                    const bookings = await getPassengerBookings(profile.id);

                    // Filter and aggregate
                    const completed = bookings.filter(b => b.status === 'Completed');
                    const upcoming = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Pending' || b.status === 'Paid');
                    const activeRides = bookings.filter(b => b.status !== 'Cancelled');

                    const totalSpent = activeRides.reduce((sum, b) => sum + (b.price || 0), 0);
                    const totalDistance = completed.reduce((sum, b) => sum + (b.distanceKm || 0), 0);

                    setStats({
                        totalRides: completed.length,
                        upcomingRides: upcoming.length,
                        totalSpent: Math.round(totalSpent),
                        distanceTraveled: Math.round(totalDistance)
                    });

                    setRecentBookings(bookings.slice(0, 5));

                    // Process chart data (last 6 months)
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();

                    const last6Months = [];
                    for (let i = 5; i >= 0; i--) {
                        const date = new Date(currentYear, currentMonth - i, 1);
                        const m = date.getMonth();
                        const y = date.getFullYear();
                        last6Months.push({
                            name: monthNames[m],
                            monthNum: m,
                            year: y,
                            rides: 0,
                            distance: 0,
                            spent: 0
                        });
                    }

                    bookings.forEach(b => {
                        if (b.date) {
                            const bDate = new Date(b.date);
                            const bMonth = bDate.getMonth();
                            const bYear = bDate.getFullYear();
                            const chartMonth = last6Months.find(m => m.monthNum === bMonth && m.year === bYear);
                            if (chartMonth) {
                                if (b.status === 'Completed') {
                                    chartMonth.rides += 1;
                                    chartMonth.distance += b.distanceKm || 0;
                                }
                                if (b.status !== 'Cancelled') {
                                    chartMonth.spent += b.price || 0;
                                }
                            }
                        }
                    });

                    setMonthlyStats({
                        activity: last6Months.map(m => ({ name: m.name, rides: m.rides, distance: Math.round(m.distance) })),
                        spending: last6Months.map(m => ({ name: m.name, spent: Math.round(m.spent) }))
                    });
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const statCards = [
        {
            title: "Total Rides Taken",
            value: stats.totalRides,
            icon: Car,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            trend: "All-time rides"
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
            title: "Total Spent",
            value: `₹${stats.totalSpent}`,
            icon: IndianRupee,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/30",
            trend: "Lifetime spending"
        },
        {
            title: "Distance Traveled",
            value: `${stats.distanceTraveled} km`,
            icon: Navigation,
            color: "text-indigo-600",
            bg: "bg-indigo-100 dark:bg-indigo-900/30",
            trend: "Total distance covered"
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Overview</h1>

            {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading your passenger insights...</div>
            ) : (
                <>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-slate-900 text-white rounded-2xl p-8 mb-8 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-20">
                            <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Traffic" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Welcome back, {user ? user.firstName : 'Passenger'}!</h2>
                                <p className="text-slate-300 max-w-lg mb-6">Ready for your next journey? Find a ride today and save on your commute.</p>

                                <a href="/passenger/search-ride" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                                    <Car size={20} />
                                    Find a Ride
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {statCards.map((card, index) => (
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                key={index} 
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1 hover:shadow-md group"
                            >
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
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
                    >
                        {/* Ride Activity Graph */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Ride Activity</h2>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyStats.activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="rides" name="Rides Taken" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                        <Bar yAxisId="right" dataKey="distance" name="Distance (km)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Spending Graph */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Monthly Spending</h2>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyStats.spending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`₹${value}`, 'Amount Spent']}
                                        />
                                        <Area type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Recent Bookings List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <History size={20} className="text-indigo-600" />
                        Recent Bookings
                    </h2>
                    <a href="/passenger/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <th className="pb-3 px-4 font-semibold">Date</th>
                                <th className="pb-3 px-4 font-semibold">Route</th>
                                <th className="pb-3 px-4 font-semibold">Driver</th>
                                <th className="pb-3 px-4 font-semibold text-right">Fare</th>
                                <th className="pb-3 px-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 px-4 text-sm text-gray-800 dark:text-gray-200">{booking.date}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                                            <span className="truncate max-w-[100px]">{booking.source}</span>
                                            <Navigation size={12} className="text-gray-400 rotate-90 shrink-0" />
                                            <span className="truncate max-w-[100px]">{booking.destination}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-800 dark:text-gray-200">{booking.driverName}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800 dark:text-gray-200 text-right">₹{(booking.price || 0).toFixed(2)}</td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default PassengerDashboard;
