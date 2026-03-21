import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, User, Navigation, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserProfile, getPassengerBookings, rateBooking } from '../../services/api';

const History = () => {
    const [historyRides, setHistoryRides] = useState([]);
    const [ratingModal, setRatingModal] = useState({ show: false, rideId: null, rating: 0, review: '', showReviewInput: false });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const profile = await fetchUserProfile();
                setUser(profile);
                if (profile && profile.id) {
                    const data = await getPassengerBookings(profile.id);
                    setHistoryRides(data.filter(b => b.status === 'Completed' || b.status === 'Cancelled'));
                }
            } catch (e) {
                console.error("Failed to load history", e);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const submitRating = async () => {
        if (ratingModal.rating === 0 || !ratingModal.rideId) return;

        try {
            await rateBooking(ratingModal.rideId, ratingModal.rating, ratingModal.showReviewInput ? ratingModal.review : '');
            setHistoryRides(prev => prev.map(ride => {
                if (ride.id === ratingModal.rideId) {
                    return { ...ride, rating: ratingModal.rating, review: ratingModal.showReviewInput ? ratingModal.review : '' };
                }
                return ride;
            }));
        } catch (e) {
            console.error("Failed to submit rating", e);
            alert("Could not submit rating. Please try again.");
        } finally {
            setRatingModal({ show: false, rideId: null, rating: 0, review: '', showReviewInput: false });
        }
    };

    return (
        <div className="space-y-6 relative">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Ride History</h1>

            {/* Rating Modal */}
            {ratingModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Rate your Ride</h3>
                        <p className="text-slate-500 dark:text-gray-400 mb-6 text-center text-sm">How was your experience with the driver?</p>
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={36}
                                    className={`cursor-pointer transition-colors ${star <= ratingModal.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    onClick={() => setRatingModal({ ...ratingModal, rating: star })}
                                />
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300 mb-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    checked={ratingModal.showReviewInput}
                                    onChange={(e) => setRatingModal({ ...ratingModal, showReviewInput: e.target.checked })}
                                />
                                Add a written review
                            </label>

                            {ratingModal.showReviewInput && (
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-800 dark:text-white transition-all"
                                    placeholder="Tell us about your ride..."
                                    rows="3"
                                    value={ratingModal.review}
                                    onChange={(e) => setRatingModal({ ...ratingModal, review: e.target.value })}
                                />
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setRatingModal({ show: false, rideId: null, rating: 0, review: '', showReviewInput: false })}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-800 dark:text-white rounded-xl font-bold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRating}
                                disabled={ratingModal.rating === 0}
                                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading history...</div>
            ) : historyRides.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">No history found</h3>
                    <p className="text-slate-500 dark:text-gray-400">You haven't completed any rides yet.</p>
                </div>
            ) : (
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <AnimatePresence>
                        {historyRides.map((ride) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                key={ride.id} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group cursor-default"
                            >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{ride.driverName}</h3>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 mt-1">
                                            <Car size={14} className="mr-1" />
                                            <span>{ride.carType} {ride.vehicleRegistration ? `(${ride.vehicleRegistration})` : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 px-3 py-1 rounded text-xs font-bold">
                                    {ride.status}
                                </span>
                            </div>

                            <div className="py-2 border-y border-slate-100 dark:border-gray-700 my-2">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-medium mb-1">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>{ride.date}</span>
                                    <Clock size={16} className="text-slate-400 ml-4" />
                                    <span>{ride.time}</span>
                                </div>
                                <div className="flex items-start gap-2 text-slate-600 dark:text-gray-400 text-sm mt-3">
                                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium line-clamp-1">{ride.source}</p>
                                        <div className="h-4 border-l-2 border-dashed border-slate-300 dark:border-gray-600 ml-2 my-1"></div>
                                        <p className="font-medium line-clamp-1">{ride.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start justify-between"> {/* Changed to items-start to align price and invoice at top */}
                                <div className="flex flex-col"> {/* Added a div to group price and invoice */}
                                    <div className="text-xl font-bold text-slate-800 dark:text-gray-200">
                                        ₹{ride.price ? ride.price.toFixed(2) : '0.00'}
                                    </div>

                                    {/* Detailed Invoice Breakdown */}
                                    <div className="bg-slate-50 dark:bg-gray-700/30 rounded-lg p-3 text-xs space-y-1 border border-slate-100 dark:border-gray-700 mt-2"> {/* Adjusted mt */}
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-gray-400">Base Fare:</span>
                                            <span className="font-semibold text-slate-700 dark:text-gray-200">₹{(ride.basePrice || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-gray-400">Distance Charge:</span>
                                            <span className="font-semibold text-slate-700 dark:text-gray-200">₹{((ride.distanceKm || 0) * (ride.pricePerKm || 0)).toFixed(2)} ({ride.distanceKm || 0} km)</span>
                                        </div>
                                        <div className="flex justify-between border-t border-slate-200 dark:border-gray-600 pt-1 mt-1">
                                            <span className="text-slate-500 dark:text-gray-400">Seats Booked:</span>
                                            <span className="font-semibold text-slate-700 dark:text-gray-200">{ride.seatsBooked} Passenger{ride.seatsBooked > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {ride.rating > 0 ? (
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex gap-1 items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < ride.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'} />
                                            ))}
                                        </div>
                                        {ride.review && (
                                            <p className="text-xs text-slate-500 dark:text-gray-400 italic max-w-[200px] text-right mt-1">"{ride.review}"</p>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setRatingModal({ show: true, rideId: ride.id, rating: 0 })}
                                        className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm font-bold border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                    >
                                        Rate Ride
                                    </button>
                                )}
                            </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default History;
