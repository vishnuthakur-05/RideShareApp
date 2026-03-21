import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, Calendar, CheckSquare } from 'lucide-react';
import { fetchDriverRides, fetchUserProfile, updateRideStatus, rescheduleRide as apiRescheduleRide } from '../../services/api';

const MyRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleData, setRescheduleData] = useState({ rideId: null, date: '', time: '' });

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [rideToCancel, setRideToCancel] = useState(null);

    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [rideToComplete, setRideToComplete] = useState(null);

    useEffect(() => {
        loadRides();
    }, []);

    const loadRides = async () => {
        setLoading(true);
        try {
            // First get driver profile to get ID
            const profile = await fetchUserProfile();
            if (profile && profile.id) {
                // Fetch actual rides attached to this driver profile
                const data = await fetchDriverRides(profile.id);
                setRides(data ? data.filter(ride => ride.status === 'Upcoming' || !ride.status) : []);
            }
        } catch (err) {
            console.error("Failed to fetch rides:", err);
            setError('Failed to fetch your rides. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const openCancelModal = (rideId) => {
        setRideToCancel(rideId);
        setShowCancelModal(true);
    };

    const confirmCancelRide = async () => {
        if (!rideToCancel) return;
        try {
            await updateRideStatus(rideToCancel, "Cancelled");
            setShowCancelModal(false);
            setRideToCancel(null);
            loadRides();
        } catch (e) {
            alert("Could not cancel ride. Try again.");
        }
    };

    const openCompleteModal = (rideId) => {
        setRideToComplete(rideId);
        setShowCompleteModal(true);
    };

    const confirmCompleteRide = async () => {
        if (!rideToComplete) return;
        try {
            await updateRideStatus(rideToComplete, "Completed");
            setShowCompleteModal(false);
            setRideToComplete(null);
            loadRides();
        } catch (e) {
            alert("Could not mark ride as completed. Try again.");
        }
    };

    const openRescheduleModal = (ride) => {
        setRescheduleData({ rideId: ride.id, date: ride.date || '', time: ride.time || '' });
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async () => {
        if (!rescheduleData.date || !rescheduleData.time) {
            alert("Please provide both date and time.");
            return;
        }
        try {
            await apiRescheduleRide(rescheduleData.rideId, rescheduleData.date, rescheduleData.time);
            setShowRescheduleModal(false);
            loadRides();
        } catch (e) {
            alert("Could not reschedule ride. Try again.");
        }
    };

    // Filtering logic
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Upcoming Hosted Rides</h1>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cancel Ride</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to cancel this ride?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={confirmCancelRide}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Ride</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to mark this ride as Completed?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCompleteRide}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                            >
                                Mark Completed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reschedule Ride</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Date</label>
                                <input
                                    type="date"
                                    value={rescheduleData.date}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Time</label>
                                <input
                                    type="time"
                                    value={rescheduleData.time}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowRescheduleModal(false)}
                                    className="px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRescheduleSubmit}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar: Search & Filter */}
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
                        disabled
                    >
                        <option value="Upcoming">Upcoming</option>
                    </select>
                </div>
            </div>

            {/* Rides Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-600 dark:text-gray-400 font-medium">Loading your rides from database...</div>
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
                                                {ride.status || 'Upcoming'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View">
                                                    <Eye size={18} />
                                                </button>
                                                {ride.status !== 'Cancelled' && (
                                                    <>
                                                        <button onClick={() => openCompleteModal(ride.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Mark as Completed">
                                                            <CheckSquare size={18} />
                                                        </button>
                                                        <button onClick={() => openRescheduleModal(ride)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Reschedule Ride">
                                                            <Calendar size={18} />
                                                        </button>
                                                        <button onClick={() => openCancelModal(ride.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Cancel Ride">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredRides.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No rides found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination placeholder */}
                {!loading && filteredRides.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">{filteredRides.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredRides.length}</span> results
                        </span>
                        <div className="flex gap-2">
                            <button className="p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                                <ChevronLeft size={18} />
                            </button>
                            <button className="p-2 border rounded-lg bg-white dark:bg-gray-800 text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm">
                                1
                            </button>
                            <button className="p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRides;
