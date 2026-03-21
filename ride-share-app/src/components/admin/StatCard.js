import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ stat }) => {
    const navigate = useNavigate();
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        violet: 'bg-violet-50 text-violet-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div
            onClick={() => stat.path && navigate(stat.path)}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow ${stat.path ? 'cursor-pointer hover:border-indigo-200' : ''}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color] || 'bg-slate-50 text-slate-600'}`}>
                    <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.change.startsWith('+') ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
                    {stat.change}
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
