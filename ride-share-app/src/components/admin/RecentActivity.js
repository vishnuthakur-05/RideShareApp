import React from 'react';
import { User, Car, AlertCircle, CheckCircle } from 'lucide-react';

const activities = [
    { id: 1, type: 'user', message: 'New user registration: Sarah Jenkins', time: '5 mins ago', icon: User, color: 'text-indigo-500 bg-indigo-50' },
    { id: 2, type: 'ride', message: 'Ride completed: Driver Mike Ross', time: '15 mins ago', icon: Car, color: 'text-emerald-500 bg-emerald-50' },
    { id: 3, type: 'alert', message: 'High demand area detected: Downtown', time: '1 hour ago', icon: AlertCircle, color: 'text-amber-500 bg-amber-50' },
    { id: 4, type: 'verification', message: 'Driver approved: John Doe', time: '2 hours ago', icon: CheckCircle, color: 'text-violet-500 bg-violet-50' },
];

const RecentActivity = () => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
            </div>

            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-100 last:border-0">
                        <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center ${activity.color}`}>
                            <activity.icon size={14} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-800 font-medium">{activity.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
