import React, { useState, useEffect } from 'react';
import { fetchApprovedUsers } from '../../services/api'; // Ensure this uses logic fetching ?status=APPROVED
import { Search, MoreVertical, Shield, User, Trash2, Ban } from 'lucide-react';

const ApprovedUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadApprovedUsers();
    }, []);

    const loadApprovedUsers = async () => {
        try {
            const data = await fetchApprovedUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Failed to fetch approved users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = users.filter(user =>
            (user.firstName && user.firstName.toLowerCase().includes(lowerTerm)) ||
            (user.lastName && user.lastName.toLowerCase().includes(lowerTerm)) ||
            (user.email && user.email.toLowerCase().includes(lowerTerm))
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Approved Users</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Joined Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-slate-500">No approved users found.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={`${user.role}-${user.id}`} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'DRIVER' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{user.contactNo || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {user.approvedAt ? new Date(user.approvedAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Suspend">
                                                <Ban size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedUsers;
