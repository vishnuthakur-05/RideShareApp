import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Check, X } from 'lucide-react';
import { fetchAllUsers, verifyUser } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status, role) => {
        try {
            await verifyUser(id, status, role);
            alert(`User ${status.toLowerCase()} successfully!`);
            loadUsers(); // Refresh list
        } catch (err) {
            alert('Failed to update user status');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage passenger and driver accounts.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={`${user.role}-${user.id}`} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {user.firstName ? user.firstName.charAt(0) : 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'DRIVER' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${user.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                            user.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
                  `}>
                                        {user.status || 'PENDING'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {user.contactNo}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {user.status !== 'APPROVED' && (
                                            <button onClick={() => handleVerify(user.id, 'APPROVED', user.role)} className="p-1 hover:bg-emerald-100 rounded text-emerald-600" title="Approve">
                                                <Check size={18} />
                                            </button>
                                        )}
                                        {user.status !== 'REJECTED' && (
                                            <button onClick={() => handleVerify(user.id, 'REJECTED', user.role)} className="p-1 hover:bg-red-100 rounded text-red-600" title="Reject">
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
