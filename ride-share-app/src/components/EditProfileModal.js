import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, User, Save, Lock } from 'lucide-react';
import { updateUserProfile } from '../services/api';
import ChangePasswordModal from './ChangePasswordModal';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNo: '',
        gender: '',
        plotNo: '',
        areaStreet: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                contactNo: user.contactNo || '',
                gender: user.gender || '',
                plotNo: user.address?.plotNo || '',
                areaStreet: user.address?.areaStreet || '',
                landmark: user.address?.landmark || '',
                pincode: user.address?.pincode || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                country: user.address?.country || ''
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Include email for identification in backend if needed by DTO (though token should suffice, backend uses email from request body or principal? 
            // AuthController uses request body email to find user. So we must include email.)
            // Wait, UpdateProfileRequest has email field. AuthController uses it to find user.
            // We should add email to the request.
            const dataToSend = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                contactNo: formData.contactNo,
                gender: formData.gender,
                email: user.email,
                address: {
                    plotNo: formData.plotNo,
                    areaStreet: formData.areaStreet,
                    landmark: formData.landmark,
                    pincode: formData.pincode,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country
                }
            };

            await updateUserProfile(dataToSend);
            setSuccess('Profile updated successfully!');
            if (onUpdate) onUpdate(); // Refresh parent state
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Change Password Modal (Nested) */}
            <ChangePasswordModal
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
                isForced={false}
            />

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all scale-100 animate-scale-up relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <User size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 mt-4 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address Details</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plot No / House No</label>
                                <input
                                    type="text"
                                    name="plotNo"
                                    value={formData.plotNo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Street</label>
                                <input
                                    type="text"
                                    name="areaStreet"
                                    value={formData.areaStreet}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setShowChangePassword(true)}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                <Lock size={18} />
                                Change Password
                            </button>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
