import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, User, MapPin, Navigation } from 'lucide-react';
import { fetchUserProfile, getDriverBookings, updateBookingStatus } from '../../services/api';

const DriverNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [driverProfile, setDriverProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const profile = await fetchUserProfile();
                setDriverProfile(profile);
                const data = await getDriverBookings(profile.id);
                // only grab pending ones
                setBookings(data.filter(b => b.status === 'Pending'));
            } catch (error) {
                console.error("Failed to load notifications", error);
            } finally {
                setLoading(false);
            }
        };
        loadNotifications();
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={24} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
            case 'booking': return <User className="text-indigo-500" size={24} />;
            case 'info':
            default: return <Info className="text-blue-500" size={24} />;
        }
    };

    const handleAcceptRide = async (bookingId) => {
        try {
            await updateBookingStatus(bookingId, 'Upcoming'); // Accepted ride
            // Remove from list
            setBookings(bookings.filter(b => b.id !== bookingId));
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to accept", error);
        }
    };

    const handleRejectRide = async (bookingId) => {
        try {
            await updateBookingStatus(bookingId, 'Cancelled'); // Rejected ride restores seats implicitly
            setBookings(bookings.filter(b => b.id !== bookingId));
            alert("Ride request rejected.");
        } catch (error) {
            console.error("Failed to reject", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length + bookings.length;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Bell className="text-indigo-600" />
                    Notifications
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs py-1 px-2 rounded-full ml-2">
                            {unreadCount} New
                        </span>
                    )}
                </h1>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium transition"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading notifications...</div>
            ) : notifications.length === 0 && bookings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">No notifications yet</h3>
                    <p className="text-slate-500 dark:text-gray-400">We'll let you know when there's something new.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={'booking-' + booking.id}
                            className={`p-5 rounded-2xl shadow-sm border transition-all bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/30`}
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="shrink-0 pt-1">
                                    {getIcon('booking')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-lg text-gray-900 dark:text-white`}>
                                            New Booking Request
                                        </h3>
                                        <span className="text-xs font-medium text-gray-500 shrink-0 ml-4">
                                            {booking.date}
                                        </span>
                                    </div>
                                    <p className={`mt-1 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1`}>
                                        A passenger requested {booking.seatsBooked} seat(s) on your route. <br />
                                        <MapPin size={14} className="inline ml-2 text-indigo-400" /> {booking.source}  <Navigation size={14} className="inline mx-1 text-indigo-400" /> {booking.destination}
                                    </p>

                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() => handleAcceptRide(booking.id)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRejectRide(booking.id)}
                                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-5 rounded-2xl shadow-sm border transition-all ${notif.read
                                ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                : 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/30'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="shrink-0 pt-1">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-lg ${notif.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs font-medium text-gray-500 shrink-0 ml-4">
                                            {notif.time}
                                        </span>
                                    </div>
                                    <p className={`mt-1 text-sm ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {notif.message}
                                    </p>

                                    <div className="mt-4 flex gap-3">
                                        {!notif.read && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 transition"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notif.id)}
                                            className="text-xs font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ride Accepted</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">The ride request has been accepted successfully. The passenger will be notified.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverNotifications;
