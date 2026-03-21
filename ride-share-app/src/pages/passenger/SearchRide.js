import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Search, Car, User, Navigation, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchRides, createBooking, fetchUserProfile } from '../../services/api';
import LocationAutocomplete from '../../components/LocationAutocomplete';

const SearchRide = () => {
    const [searchParams, setSearchParams] = useState({
        source: '',
        destination: '',
        date: ''
    });
    const [rides, setRides] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    // Booking Modal States
    const [bookingRide, setBookingRide] = useState(null);
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [userProfile, setUserProfile] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Fetch user profile on mount to get passengerId
        fetchUserProfile().then(data => setUserProfile(data)).catch(err => console.error("Error fetching profile", err));
        // Load initial random rides
        const initialRides = generateMockRides('', '', 10);
        setRides(initialRides);
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            let lat1, lon1, lat2, lon2;

            // Geocode Source
            if (searchParams.source) {
                const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchParams.source)}&limit=1`);
                const data = await res.json();
                if (data.features && data.features.length > 0) {
                    lat1 = data.features[0].geometry.coordinates[1];
                    lon1 = data.features[0].geometry.coordinates[0];
                }
            }

            // Geocode Dest
            if (searchParams.destination) {
                const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchParams.destination)}&limit=1`);
                const data = await res.json();
                if (data.features && data.features.length > 0) {
                    lat2 = data.features[0].geometry.coordinates[1];
                    lon2 = data.features[0].geometry.coordinates[0];
                }
            }

            const params = {
                source: searchParams.source,
                destination: searchParams.destination,
                date: searchParams.date || undefined,
                sourceLat: lat1,
                sourceLon: lon1,
                destLat: lat2,
                destLon: lon2
            };

            const data = await searchRides(params);
            setRides(data || []);
            setSearched(true);
        } catch (error) {
            console.error("Failed to search rides", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to generate random ride data
    const generateMockRides = (source, dest, count = 4) => {
        const drivers = ['Rahul Kumar', 'Amit Singh', 'Priya Sharma', 'Vikram Patel', 'Suresh Reddy', 'Anjali Gupta', 'Mohammed Khan', 'Rohan Mehta'];
        const carTypes = ['Maruti Swift', 'Hyundai Creta', 'Toyota Innova', 'Tata Nexon', 'Honda City', 'Mahindra XUV700'];
        const indianCities = ['Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Jaipur', 'Ahmedabad', 'Kolkata', 'Surat'];

        return Array.from({ length: count }).map((_, i) => {
            const randomSource = indianCities[Math.floor(Math.random() * indianCities.length)];
            let randomDest = indianCities[Math.floor(Math.random() * indianCities.length)];
            while (randomDest === randomSource) {
                randomDest = indianCities[Math.floor(Math.random() * indianCities.length)];
            }

            return {
                id: i + 1,
                driverName: drivers[i % drivers.length],
                rating: (4 + Math.random()).toFixed(1),
                carType: carTypes[i % carTypes.length],
                price: Math.floor(Math.random() * 800) + 200,
                time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
                source: source || randomSource,
                destination: dest || randomDest,
                seatsAvailable: Math.floor(Math.random() * 3) + 1
            };
        });
    };

    const handleBookRideClick = (ride) => {
        if (!userProfile) {
            alert("Please ensure you are logged in to book a ride.");
            return;
        }
        setBookingRide(ride);
        setSeatsToBook(1);
    };

    const confirmBooking = async () => {
        if (!bookingRide || !userProfile) return;
        setBookingLoading(true);

        try {
            const perSeatPrice = bookingRide.totalPrice || (bookingRide.pricePerKm * bookingRide.distanceKm + (bookingRide.basePrice || 0)) || (bookingRide.price || 0);
            const calcPrice = Math.round(perSeatPrice * seatsToBook * 100) / 100;

            await createBooking({
                rideId: bookingRide.id,
                passengerId: userProfile.id,
                seatsBooked: seatsToBook,
                price: calcPrice
            });

            setSuccessMessage("Your ride request has been submitted. Kindly wait for the driver to accept your ride.");
            setShowSuccessModal(true);
            setBookingRide(null); // close modal
            // Optionally, update rides to deduct available seats
            setRides(rides.map(r => r.id === bookingRide.id ? { ...r, availableSeats: (r.availableSeats || r.seatsAvailable) - seatsToBook } : r));
        } catch (error) {
            console.error("Booking error:", error);
            alert(error.message || "Failed to book ride");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Search Ride</h1>

            {/* Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">From</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-slate-400 z-10" size={20} />
                            <LocationAutocomplete
                                placeholder="Source"
                                value={searchParams.source}
                                onChange={(val) => setSearchParams({ ...searchParams, source: val })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">To</label>
                        <div className="relative">
                            <Navigation className="absolute left-3 top-2.5 text-slate-400 z-10" size={20} />
                            <LocationAutocomplete
                                placeholder="Destination"
                                value={searchParams.destination}
                                onChange={(val) => setSearchParams({ ...searchParams, destination: val })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                value={searchParams.date}
                                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-bold transition-all duration-300 hover:bg-slate-800 dark:hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : <><Search size={20} /> Search</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mt-8 mb-4">{searched ? 'Search Results' : 'Recommended Rides'}</h2>

            {rides.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">No rides found</h3>
                    <p className="text-slate-500 dark:text-gray-400">No rides available for this route. Try nearby locations or a different date.</p>
                </div>
            ) : (
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {rides.map((ride) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={ride.id} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col gap-4 group"
                            >
                            {/* Driver Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{ride.driverName}</h3>
                                    <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                                        <Car size={14} className="mr-1" />
                                        <span className="truncate max-w-[120px]">{ride.vehicleModel || ride.carType}</span>
                                        <div className="flex items-center ml-auto bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-100 dark:border-yellow-900/50">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
                                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                                                {ride.driverRating ? ride.driverRating.toFixed(1) : (ride.rating || 'N/A')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Route Info */}
                            <div className="py-2">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-medium mb-1">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>{ride.date || 'Today'}</span>
                                    <Clock size={16} className="text-slate-400 ml-2" />
                                    <span>{ride.time ? ride.time.substring(0, 5) : ''}</span>
                                </div>
                                <div className="flex items-start gap-2 text-slate-600 dark:text-gray-400 text-sm mt-2">
                                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium line-clamp-1">{ride.fromLocation || ride.source}</p>
                                        <div className="h-4 border-l-2 border-dashed border-slate-300 dark:border-gray-600 ml-2 my-1"></div>
                                        <p className="font-medium line-clamp-1">{ride.toLocation || ride.destination}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-700 p-3 rounded-lg text-sm border border-slate-100 dark:border-gray-600">
                                <div className="text-center">
                                    <p className="text-slate-500 dark:text-gray-400 text-xs uppercase font-semibold">Distance</p>
                                    <p className="font-bold text-slate-700 dark:text-gray-200">{ride.distanceKm || Object.keys(searchParams).length * 10 || 45} km</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-500 dark:text-gray-400 text-xs uppercase font-semibold">Seats left</p>
                                    <p className="font-bold text-slate-700 dark:text-gray-200">{ride.availableSeats || ride.seatsAvailable}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-500 dark:text-gray-400 text-xs uppercase font-semibold">Per seat</p>
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400">₹{(ride.totalPrice || (ride.pricePerKm * ride.distanceKm + (ride.basePrice || 0)) || ride.price || 0).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-gray-700 pt-4 flex items-center justify-between mt-auto">
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                    ₹{(ride.totalPrice || ride.price || 0).toFixed(2)} <span className="text-sm font-normal text-slate-500">Total</span>
                                </div>
                                <button
                                    onClick={() => handleBookRideClick(ride)}
                                    className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shadow-md">
                                    Book Ride
                                </button>
                            </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Booking Modal with Blurred Background */}
            {bookingRide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-indigo-600 p-4 text-white text-center shrink-0">
                            <h2 className="text-xl font-bold">Confirm Your Ride</h2>
                            <p className="text-indigo-100 text-sm mt-1">Review details before booking</p>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Driver</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{bookingRide.driverName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{bookingRide.vehicleModel || bookingRide.carType}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <MapPin className="text-indigo-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{bookingRide.fromLocation || bookingRide.source}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <Navigation className="text-indigo-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{bookingRide.toLocation || bookingRide.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Seats (Max {bookingRide.availableSeats || bookingRide.seatsAvailable})</label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={seatsToBook}
                                    onChange={(e) => setSeatsToBook(Number(e.target.value))}
                                >
                                    {[...Array(bookingRide.availableSeats || bookingRide.seatsAvailable)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Base Price</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{(bookingRide.basePrice || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Distance Charge ({bookingRide.distanceKm || 0} km × ₹{bookingRide.pricePerKm || 0})</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{((bookingRide.distanceKm || 0) * (bookingRide.pricePerKm || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t dark:border-gray-600 pt-2">
                                    <span className="text-gray-500 dark:text-gray-400">Price per Seat</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{((bookingRide.basePrice || 0) + (bookingRide.distanceKm || 0) * (bookingRide.pricePerKm || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">No. of Passengers</span>
                                    <span className="font-medium text-gray-900 dark:text-white">× {seatsToBook}</span>
                                </div>
                                <div className="flex justify-between items-center border-t dark:border-gray-600 pt-3">
                                    <span className="text-gray-800 dark:text-gray-200 font-bold">Total Amount</span>
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ₹{((bookingRide.totalPrice || (bookingRide.basePrice || 0) + (bookingRide.distanceKm || 0) * (bookingRide.pricePerKm || 0)) * seatsToBook).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex gap-3 shrink-0">
                            <button
                                onClick={() => setBookingRide(null)}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBooking}
                                disabled={bookingLoading}
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
                            >
                                {bookingLoading ? 'Booking...' : 'Confirm Book Ride'}
                            </button>
                        </div>
                    </div>
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ride Booked Successfully</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{successMessage}</p>
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

export default SearchRide;
