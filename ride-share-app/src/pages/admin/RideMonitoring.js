import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const activeRides = [
    { id: 1, driver: 'John Doe', passenger: 'Jane Smith', from: 'Central Station', to: 'Tech Park', status: 'In Progress', eta: '5 mins' },
    { id: 2, driver: 'Mike Ross', passenger: 'Rachel Green', from: 'Airport Terminal 1', to: 'Grand Hotel', status: 'In Progress', eta: '12 mins' },
    { id: 3, driver: 'Harvey Specter', passenger: 'Donna Paulsen', from: 'Pearson Hardman', to: 'Courthouse', status: 'Arriving', eta: '2 mins' },
];

const RideMonitoring = () => {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Live Ride Monitoring</h1>
                <p className="text-slate-500 mt-1">Track active rides in real-time.</p>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                {/* Ride List */}
                <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-700">Active Rides ({activeRides.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {activeRides.map((ride, idx) => (
                            <div key={ride.id} className={`p-4 border-b border-slate-100 hover:bg-indigo-50 cursor-pointer transition-colors ${idx === 0 ? 'bg-indigo-50/50' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">#{ride.id}</span>
                                    <span className="text-xs font-medium text-slate-500">{ride.status}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-sm text-slate-700 font-medium">{ride.from}</p>
                                    </div>
                                    <div className="ml-1 border-l-2 border-indigo-100 h-4"></div>
                                    <div className="flex items-center gap-2">
                                        <Navigation size={12} className="text-rose-500" />
                                        <p className="text-sm text-slate-700 font-medium">{ride.to}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span>Start: {ride.driver}</span>
                                    <span className="font-semibold text-slate-700">ETA: {ride.eta}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="w-full md:w-2/3 bg-slate-100 relative group">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="bg-white p-4 rounded-full shadow-lg mb-4 animate-bounce">
                            <MapPin size={32} className="text-indigo-600" />
                        </div>
                        <p className="text-slate-500 font-medium">Map View Integration Placeholder</p>
                        <p className="text-slate-400 text-sm max-w-xs text-center mt-2">Interactive map will display real-time driver locations and routes.</p>
                    </div>

                    {/* Mock Map UI Elements */}
                    <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md flex flex-col gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded text-slate-600">+</button>
                        <button className="p-2 hover:bg-slate-100 rounded text-slate-600">-</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideMonitoring;
