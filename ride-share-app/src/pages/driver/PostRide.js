import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, CheckCircle2 } from 'lucide-react';
import { createRide, fetchUserProfile, fetchDriverVehicles } from '../../services/api';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MapUpdater = ({ center, bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [20, 20] });
        } else if (center) {
            map.setView(center, 13);
        }
    }, [center, bounds, map]);
    return null;
};

// Location Autocomplete Component using Photon API
const LocationAutocomplete = ({ placeholder, value, onChange, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();
            setSuggestions(data.features || []);
        } catch (error) {
            console.error("Photon API Error:", error);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(val);
        setIsOpen(true);
        // Debounce simple implementation
        setTimeout(() => fetchSuggestions(val), 300);
    };

    const handleSelect = (feature) => {
        const name = [feature.properties.name, feature.properties.city, feature.properties.state, feature.properties.country]
            .filter(Boolean)
            .join(', ');
        const lat = feature.geometry.coordinates[1];
        const lon = feature.geometry.coordinates[0];

        onChange(name);
        onSelect({ name, lat, lon });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="flex items-center w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-gray-700 bg-white">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => { if (value.length >= 3) setIsOpen(true); }}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent dark:text-white outline-none"
                    required
                />
            </div>
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur
                                handleSelect(s);
                            }}
                            className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                            <span className="font-semibold">{s.properties.name}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                {[s.properties.city, s.properties.state, s.properties.country].filter(Boolean).join(', ')}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const PostRide = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        source: '',
        sourceCoords: null,
        destination: '',
        destCoords: null,
        vehicleId: '',
        date: '',
        time: '',
        seats: 1,
        baseFare: 0,
        perKmFare: 0,
        driverName: ''
    });

    const [routeData, setRouteData] = useState({
        distanceKm: 0,
        durationMin: 0,
        geometry: null
    });

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const profile = await fetchUserProfile();
                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        driverName: profile.firstName + ' ' + profile.lastName
                    }));
                }
                const data = await fetchDriverVehicles();
                setVehicles(data || []);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            }
        };
        loadInitialData();
    }, []);

    // Calculate Route with OSRM when both coords are available
    useEffect(() => {
        const fetchRoute = async () => {
            if (formData.sourceCoords && formData.destCoords) {
                const { lon: lon1, lat: lat1 } = formData.sourceCoords;
                const { lon: lon2, lat: lat2 } = formData.destCoords;
                try {
                    const res = await fetch(`http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`);
                    const data = await res.json();
                    if (data.routes && data.routes.length > 0) {
                        const route = data.routes[0];
                        // Convert [lon, lat] from GeoJSON to [lat, lon] for Leaflet
                        const flippedGeometry = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        setRouteData({
                            distanceKm: (route.distance / 1000).toFixed(1),
                            durationMin: Math.round(route.duration / 60),
                            geometry: flippedGeometry
                        });
                    }
                } catch (error) {
                    console.error("OSRM API Error:", error);
                }
            }
        };
        fetchRoute();
    }, [formData.sourceCoords, formData.destCoords]);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    // Nominatim Reverse Geocoding
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await res.json();

                    setFormData(prev => ({
                        ...prev,
                        source: data.display_name,
                        sourceCoords: { lat, lon }
                    }));
                } catch (error) {
                    console.error("Nominatim Reverse Geocoding Error:", error);
                }
            }, () => {
                alert("Geolocation failed or denied.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = async () => {
        if (step === 1) {
            let sCoords = formData.sourceCoords;
            let dCoords = formData.destCoords;

            // Auto geocode if user typed but didn't select from dropdown
            if (!sCoords && formData.source) {
                try {
                    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(formData.source)}&limit=1`);
                    const data = await res.json();
                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        sCoords = { lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] };
                        setFormData(p => ({ ...p, sourceCoords: sCoords }));
                    }
                } catch (e) {
                    console.error("Auto geocode source failed", e);
                }
            }
            if (!dCoords && formData.destination) {
                try {
                    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(formData.destination)}&limit=1`);
                    const data = await res.json();
                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        dCoords = { lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] };
                        setFormData(p => ({ ...p, destCoords: dCoords }));
                    }
                } catch (e) {
                    console.error("Auto geocode destination failed", e);
                }
            }

            const missing = [];
            if (!sCoords) missing.push("Valid Source Location (must be a valid place)");
            if (!dCoords) missing.push("Valid Destination Location (must be a valid place)");
            if (!formData.vehicleId) missing.push("Vehicle Selection");

            if (missing.length > 0) {
                alert("Please provide the following before proceeding:\n" + missing.map(m => "- " + m).join("\n"));
                return;
            }
        }
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handlePublish = async (e) => {
        e.preventDefault();

        try {
            const profile = await fetchUserProfile();
            const ridePayload = {
                driverId: profile.id,
                vehicleId: formData.vehicleId,
                fromLocation: formData.source,
                toLocation: formData.destination,
                routeCoordinates: JSON.stringify(routeData.geometry),
                distanceKm: parseFloat(routeData.distanceKm),
                basePrice: parseFloat(formData.baseFare),
                pricePerKm: parseFloat(formData.perKmFare),
                totalPrice: Math.round(((parseFloat(formData.baseFare) || 0) + (parseFloat(formData.perKmFare) || 0) * routeData.distanceKm) * 100) / 100,
                availableSeats: parseInt(formData.seats),
                date: formData.date,
                time: formData.time,
                status: 'Upcoming',
                driverName: formData.driverName
            };

            await createRide(ridePayload);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to publish ride", error);
            alert("Failed to publish ride. Please check connection.");
        }
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>1</div>
            <div className={`h-0.5 w-8 transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>2</div>
            <div className={`h-0.5 w-8 transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>3</div>
        </div>
    );

    // Calculate map bounds
    let mapBounds = null;
    let mapCenter = [20.5937, 78.9629]; // Default India
    if (formData.sourceCoords && formData.destCoords) {
        mapBounds = [
            [formData.sourceCoords.lat, formData.sourceCoords.lon],
            [formData.destCoords.lat, formData.destCoords.lon]
        ];
    } else if (formData.sourceCoords) {
        mapCenter = [formData.sourceCoords.lat, formData.sourceCoords.lon];
    } else if (formData.destCoords) {
        mapCenter = [formData.destCoords.lat, formData.destCoords.lon];
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {showSuccessModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Ride Posted!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            Your route has been successfully mapped and published to the live database for tracking.
                        </p>
                        <button
                            onClick={() => navigate('/driver/rides')}
                            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            Go to My Rides
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Post a New Ride</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <StepIndicator />

                <form onSubmit={step === 3 ? handlePublish : (e) => e.preventDefault()}>

                    {/* Common Route Review Block */}
                    <div className="bg-slate-50 dark:bg-gray-700/50 p-6 rounded-xl mb-6">
                        <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-4 tracking-wide flex justify-between">
                            <span>Review Your Route</span>
                            {routeData.distanceKm > 0 && (
                                <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded">
                                    {routeData.distanceKm} km (~{routeData.durationMin} mins)
                                </span>
                            )}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">
                                    {step === 1 ? 'FROM' : 'FROM CITY'}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 clamp-2">
                                    {formData.source || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">
                                    {step === 1 ? 'TO' : 'TO CITY'}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 clamp-2">
                                    {formData.destination || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Base Details */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl border border-green-100 dark:border-green-800 text-sm">
                                Note: Your saved vehicle details (photos, type, model, etc.) will be automatically used for this ride.
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Driver Name</label>
                                    <input
                                        type="text"
                                        name="driverName"
                                        value={formData.driverName}
                                        onChange={handleChange}
                                        placeholder="Enter driver's name"
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Source Location</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <LocationAutocomplete
                                                placeholder="Starting point"
                                                value={formData.source}
                                                onChange={(val) => setFormData(p => ({ ...p, source: val }))}
                                                onSelect={(loc) => setFormData(p => ({ ...p, sourceCoords: { lat: loc.lat, lon: loc.lon } }))}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLocateMe}
                                            className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 hover:bg-indigo-100 transition whitespace-nowrap"
                                        >
                                            <MapPin size={16} className="text-red-500" /> Locate Me
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Destination</label>
                                    <LocationAutocomplete
                                        placeholder="End point"
                                        value={formData.destination}
                                        onChange={(val) => setFormData(p => ({ ...p, destination: val }))}
                                        onSelect={(loc) => setFormData(p => ({ ...p, destCoords: { lat: loc.lat, lon: loc.lon } }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Select Vehicle</label>
                                    <select
                                        name="vehicleId" value={formData.vehicleId} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">-- Choose Car --</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {v.company} {v.model} ({v.rcNumber})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Extra Pickup/Drop Points */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(num => (
                                    <React.Fragment key={num}>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Pickup Location {num}</label>
                                            <LocationAutocomplete
                                                placeholder={`Search a place near ${formData.source ? formData.source.split(',')[0] : 'source'}`}
                                                value={formData[`pickup${num}`] || ''}
                                                onChange={(val) => setFormData(p => ({ ...p, [`pickup${num}`]: val }))}
                                                onSelect={(loc) => { }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Drop Location {num}</label>
                                            <LocationAutocomplete
                                                placeholder={`Search a place near ${formData.destination ? formData.destination.split(',')[0] : 'destination'}`}
                                                value={formData[`drop${num}`] || ''}
                                                onChange={(val) => setFormData(p => ({ ...p, [`drop${num}`]: val }))}
                                                onSelect={(loc) => { }}
                                            />
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Scheduling, Pricing, & Map */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl border border-green-100 dark:border-green-800 text-sm">
                                Note: Vehicle details and selected route points are ready. Add schedule and publish.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Date</label>
                                    <input
                                        type="date" name="date" value={formData.date} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Time</label>
                                    <input
                                        type="time" name="time" value={formData.time} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Available Seats</label>
                                    <input
                                        type="number" name="seats" value={formData.seats} onChange={handleChange} min="1" max="10" required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Base Fare (INR)</label>
                                    <input
                                        type="number" name="baseFare" value={formData.baseFare} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Per KM Fare (INR)</label>
                                    <input
                                        type="number" name="perKmFare" value={formData.perKmFare} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Live Interactive Map using Leaflet */}
                            <div className="h-96 mt-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-inner relative z-0">
                                <MapContainer
                                    center={mapCenter}
                                    zoom={5}
                                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />

                                    <MapUpdater center={mapCenter} bounds={mapBounds} />

                                    {formData.sourceCoords && (
                                        <Marker position={[formData.sourceCoords.lat, formData.sourceCoords.lon]} />
                                    )}

                                    {formData.destCoords && (
                                        <Marker position={[formData.destCoords.lat, formData.destCoords.lon]} />
                                    )}

                                    {routeData.geometry && (
                                        <Polyline
                                            positions={routeData.geometry}
                                            color="#4f46e5"
                                            weight={5}
                                            opacity={0.8}
                                        />
                                    )}
                                </MapContainer>
                            </div>

                            {routeData.distanceKm > 0 && (
                                <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Estimated Distance</p>
                                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{routeData.distanceKm} km</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Estimated Payout</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ₹{(parseFloat(formData.baseFare) || 0) + (parseFloat(formData.perKmFare) || 0) * routeData.distanceKm}
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-8 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-md shadow-indigo-200 dark:shadow-none"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-md shadow-indigo-200 dark:shadow-none"
                            >
                                Publish Ride
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostRide;
