import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle, Star, MessageSquare } from 'lucide-react';
import { fetchDriverRides, fetchUserProfile, updateRideStatus } from '../../services/api';

const DriverHistory = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        loadRides();
    }, []);

    const loadRides = async () => {
        setLoading(true);
        try {
            const profile = await fetchUserProfile();
            if (profile && profile.id) {
                const data = await fetchDriverRides(profile.id);
                setRides(data ? data.filter(ride => ride.status === 'Completed' || ride.status === 'Cancelled') : []);
            }
        } catch (err) {
            console.error("Failed to fetch rides:", err);
            setError('Failed to fetch your rides. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRide = async (rideId) => {
        if (window.confirm("Are you sure you want to mark this ride as completed?")) {
            try {
                await updateRideStatus(rideId, "Completed");
                loadRides();
            } catch (e) {
                alert("Could not complete ride. Try again.");
            }
        }
    }

    const filteredRides = rides.filter(ride => {
        const fromLoc = ride.fromLocation || '';
        const toLoc = ride.toLocation || '';
        const matchesSearch = fromLoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            toLoc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || ride.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Ride History</h1>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by from or to location..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="text-gray-500" size={18} />
                    <select
                        className="py-2 pl-3 pr-8 border rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-600 dark:text-gray-400 font-medium">Loading your history from database...</div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500">{error}</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Route</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Vehicle</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Ratings & Reviews</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredRides.map(ride => (
                                    <tr key={ride.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]" title={ride.fromLocation}>{ride.fromLocation?.split(',')[0]}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]" title={ride.toLocation}>to {ride.toLocation?.split(',')[0]}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">{ride.date}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{ride.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">{ride.vehicleModel || 'N/A'}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{ride.vehicleRegistration || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">₹{ride.totalPrice} ({ride.distanceKm} km)</div>
                                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{ride.availableSeats} seats left</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(ride.status)}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ride.averageRating ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg w-fit border border-yellow-100 dark:border-yellow-900/50">
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{ride.averageRating}</span>
                                                    </div>
                                                    {ride.reviews && ride.reviews.length > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400" title={ride.reviews.join('\n')}>
                                                            <MessageSquare size={12} />
                                                            <span>{ride.reviews.length} review{ride.reviews.length > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 dark:text-gray-600">No ratings yet</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View">
                                                    <Eye size={18} />
                                                </button>
                                                {ride.status !== 'Completed' && ride.status !== 'Cancelled' && (
                                                    <button onClick={() => handleCompleteRide(ride.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Mark Completed">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredRides.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div >
    );
};

export default DriverHistory;
