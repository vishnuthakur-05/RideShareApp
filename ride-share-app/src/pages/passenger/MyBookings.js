import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, User, Navigation, CheckCircle2, CreditCard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserProfile, getPassengerBookings, updateBookingStatus } from '../../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [paymentSuccessData, setPaymentSuccessData] = useState(null);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const profile = await fetchUserProfile();
            setUser(profile);
            if (profile && profile.id) {
                const data = await getPassengerBookings(profile.id);
                // Only show active/upcoming bookings
                setBookings(data.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled'));
            }
        } catch (e) {
            console.error("Failed to load bookings", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleCancelClick = (id) => {
        setBookingToCancel(id);
    };

    const confirmCancel = async () => {
        if (!bookingToCancel) return;
        setCancelLoading(true);
        try {
            await updateBookingStatus(bookingToCancel, 'Cancelled');
            // Refresh list
            const data = await getPassengerBookings(user.id);
            setBookings(data.filter(b => b.status !== 'Completed'));
            setBookingToCancel(null);
        } catch (e) {
            console.error("Failed to cancel booking", e);
            alert("Could not cancel booking");
        } finally {
            setCancelLoading(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayClick = async (booking) => {
        setProcessingPayment(true);
        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you offline?');
            setProcessingPayment(false);
            return;
        }

        const options = {
            key: 'rzp_test_SLg82Bo58UcIoa', // Generic Test Key format - normally you'd use your actual test key
            amount: Math.round(booking.price * 100), // Amount in paise
            currency: 'INR',
            name: 'RideShare payments',
            description: `Payment for ride to ${booking.destination}`,
            image: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
            handler: async function (response) {
                try {
                    await updateBookingStatus(booking.id, 'Paid', response.razorpay_payment_id);
                    setPaymentSuccessData(response.razorpay_payment_id);
                    const data = await getPassengerBookings(user.id);
                    setBookings(data.filter(b => b.status !== 'Completed'));
                } catch (err) {
                    console.error("Failed payment status update", err);
                    alert("Payment recorded, but failed to update status.");
                }
            },
            prefill: {
                name: (user?.firstName || 'User') + ' ' + (user?.lastName || ''),
                email: user?.email || 'test@example.com',
                contact: user?.contactNo || '9999999999'
            },
            theme: {
                color: '#4f46e5'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            alert(`Payment Failed! Reason: ${response.error.description}`);
        });

        paymentObject.open();
        setProcessingPayment(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Bookings</h1>
                <button
                    onClick={loadBookings}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition shadow-sm"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">No active bookings</h3>
                    <p className="text-slate-500 dark:text-gray-400">You don't have any upcoming rides. Search and book a ride now!</p>
                </div>
            ) : (
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    <AnimatePresence>
                        {bookings.map((booking) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                key={booking.id} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 flex flex-col gap-4 relative overflow-hidden hover:shadow-md transition-shadow group"
                            >
                            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold shadow-sm text-white ${booking.status === 'Pending' ? 'bg-amber-500' :
                                booking.status === 'Paid' ? 'bg-indigo-600' :
                                    booking.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'
                                }`}>
                                {booking.status === 'Upcoming' ? 'Driver Accepted' : booking.status}
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{booking.driverName}</h3>
                                    <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                                        <Car size={14} className="mr-1" />
                                        <span>{booking.carType} {booking.vehicleRegistration ? `(${booking.vehicleRegistration})` : ''}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-medium mb-1">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>{booking.date}</span>
                                    <Clock size={16} className="text-slate-400 ml-4" />
                                    <span>{booking.time}</span>
                                </div>
                                <div className="flex items-start gap-2 text-slate-600 dark:text-gray-400 text-sm mt-3">
                                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium line-clamp-1">{booking.source}</p>
                                        </div>
                                        <div className="h-6 border-l-2 border-dashed border-slate-300 dark:border-gray-600 ml-2 my-1"></div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium line-clamp-1">{booking.destination}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-gray-700 pt-4 flex items-center justify-between mt-auto">
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex flex-col">
                                    ₹{booking.price ? booking.price.toFixed(2) : '0.00'}
                                    {booking.status === 'Paid' ? (
                                        <span className="text-xs font-bold text-green-500 mt-1 uppercase">✓ Paid</span>
                                    ) : (
                                        <span className="text-xs font-medium text-amber-500 mt-1 uppercase truncate max-w-[100px]">{booking.status === 'Pending' ? 'Awaiting Driver' : 'Payment Due'}</span>
                                    )}
                                </div>
                            </div>

                            {/* Detailed Invoice Breakdown */}
                            <div className="bg-slate-50 dark:bg-gray-700/30 rounded-lg p-3 text-xs space-y-1 border border-slate-100 dark:border-gray-700 mt-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-gray-400">Base Fare:</span>
                                    <span className="font-semibold text-slate-700 dark:text-gray-200">₹{(booking.basePrice || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-gray-400">Distance Charge:</span>
                                    <span className="font-semibold text-slate-700 dark:text-gray-200">₹{((booking.distanceKm || 0) * (booking.pricePerKm || 0)).toFixed(2)} ({booking.distanceKm || 0} km)</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 dark:border-gray-600 pt-1 mt-1">
                                    <span className="text-slate-500 dark:text-gray-400">Seats Booked:</span>
                                    <span className="font-semibold text-slate-700 dark:text-gray-200">{booking.seatsBooked} Passenger{booking.seatsBooked > 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {booking.status === 'Upcoming' && (
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-indigo-700 transition-colors shadow-sm"
                                        onClick={() => handlePayClick(booking)}>
                                        <CreditCard size={16} /> Pay Now
                                    </button>
                                )}
                                <button className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    onClick={() => handleCancelClick(booking.id)}>
                                    Cancel
                                </button>
                            </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Cancel Confirmation Modal */}
            {bookingToCancel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cancel Ride</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setBookingToCancel(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium transition duration-200 shadow-sm"
                            >
                                Keep Ride
                            </button>
                            <button
                                onClick={confirmCancel}
                                disabled={cancelLoading}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium disabled:opacity-50 transition duration-200 shadow-sm"
                            >
                                {cancelLoading ? 'Canceling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Success Modal */}
            {paymentSuccessData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Your payment was processed successfully.<br/>
                            <span className="text-xs text-gray-400 mt-2 block">Transaction ID: {paymentSuccessData}</span>
                        </p>
                        <button
                            onClick={() => setPaymentSuccessData(null)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
