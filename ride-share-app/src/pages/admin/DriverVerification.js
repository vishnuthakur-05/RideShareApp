import React from 'react';
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react';

const pendingDrivers = [
    { id: 1, name: 'Michael Scott', license: 'DL-987654321', vehicle: 'Toyota Camry (2022)', status: 'Pending Review' },
    { id: 2, name: 'Pam Beesly', license: 'DL-123456789', vehicle: 'Honda Civic (2021)', status: 'Documents Missing' },
    { id: 3, name: 'Jim Halpert', license: 'DL-456123789', vehicle: 'Tesla Model 3', status: 'Pending Review' },
];

const DriverVerification = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Driver Verification</h1>
                <p className="text-slate-500 mt-1">Review and approve driver applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingDrivers.map((driver) => (
                    <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{driver.name}</h3>
                                        <p className="text-xs text-slate-500">Applied 2 days ago</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full">
                                    {driver.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-50 p-3 rounded-lg text-sm">
                                    <p className="text-slate-500 text-xs mb-1">Vehicle Details</p>
                                    <p className="font-medium text-slate-700">{driver.vehicle}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-sm">
                                    <p className="text-slate-500 text-xs mb-1">License Number</p>
                                    <p className="font-medium text-slate-700">{driver.license}</p>
                                </div>

                                <div className="border-t border-slate-100 pt-3">
                                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Documents</p>
                                    <div className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <FileText size={16} />
                                            <span>Driving License.pdf</span>
                                        </div>
                                        <Download size={14} className="text-slate-400 group-hover:text-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                                <CheckCircle size={16} /> Approve
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 py-2 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors">
                                <XCircle size={16} /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverVerification;
