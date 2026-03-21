import React, { useState, useEffect } from 'react';
import { fetchPendingUsers, approveUser, rejectUser } from '../../services/api';
import { Check, X, Eye, Clock, FileText } from 'lucide-react';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const PendingApprovals = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: () => { },
    });

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        try {
            const data = await fetchPendingUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch pending users", error);
        } finally {
            setLoading(false);
        }
    };

    const openConfirmModal = (actionType, user) => {
        if (actionType === 'approve') {
            setModalConfig({
                isOpen: true,
                type: 'success',
                title: 'Approve User?',
                message: `Are you sure you want to approve ${user.firstName} ${user.lastName}? This will send an automated email with their temporary password.`,
                confirmText: 'Approve User',
                onConfirm: () => handleApprove(user.id, user.role),
            });
        } else {
            setModalConfig({
                isOpen: true,
                type: 'danger',
                title: 'Reject User?',
                message: `Are you sure you want to reject ${user.firstName} ${user.lastName}? This action cannot be undone immediately.`,
                confirmText: 'Reject User',
                onConfirm: () => handleReject(user.id, user.role),
            });
        }
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleApprove = async (id, role) => {
        try {
            await approveUser(id, role);
            setMessage({ type: 'success', text: 'User approved and email sent successfully.' });
            // Optimistic update: Remove user from list immediately
            setUsers(prevUsers => prevUsers.filter(u => !(u.id === id && u.role === role)));
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve user.' });
            loadPendingUsers(); // Revert/Refresh on error
        } finally {
            closeModal();
        }
    };

    const handleReject = async (id, role) => {
        try {
            await rejectUser(id, role);
            setMessage({ type: 'success', text: 'User rejected.' });
            // Optimistic update: Remove user from list immediately
            setUsers(prevUsers => prevUsers.filter(u => !(u.id === id && u.role === role)));
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to reject user.' });
            loadPendingUsers();
        } finally {
            closeModal();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>
            {message && (
                <div className={`p-4 rounded-lg flex justify-between items-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)} className="hover:opacity-70"><X size={16} /></button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Applied Date</th>
                            <th className="p-4 text-center">Documents</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-slate-500">No pending approvals found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={`${user.role}-${user.id}`} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800">{user.firstName} {user.lastName}</td>
                                    <td className="p-4 text-slate-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'DRIVER' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-center gap-1 mx-auto">
                                            <FileText size={16} /> View
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openConfirmModal('approve', user)}
                                                className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => openConfirmModal('reject', user)}
                                                className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-colors"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
            />
        </div>
    );
};

export default PendingApprovals;
