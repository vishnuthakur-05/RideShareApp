import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchDriverVehicles, deleteVehicle } from '../../services/api';

const VehicleManagement = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await fetchDriverVehicles();
            // Map backend data to frontend structure
            const mappedVehicles = data.map(v => ({
                id: v.id,
                name: `${v.company} ${v.model}`,
                type: v.year || 'Car',
                number: v.rcNumber,
                color: v.color,
                status: v.status || 'Active',
                image: v.images && v.images.length > 0 ?
                    (v.images[0].startsWith('data:application/octet-stream') ? v.images[0].replace('data:application/octet-stream', 'data:image/jpeg') : v.images[0])
                    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=300'
            }));
            setVehicles(mappedVehicles);
        } catch (err) {
            const errorMessage = err.message || 'Failed to load vehicles';
            const errorDetails = err.response ? JSON.stringify(err.response.data) : '';
            setError(`${errorMessage} ${errorDetails}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteVehicle(id);
                setVehicles(vehicles.filter(v => v.id !== id));
            } catch (err) {
                alert('Failed to delete vehicle');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading vehicles...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Vehicle Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your fleet and add new vehicles</p>
                </div>

                <button
                    onClick={() => navigate('/driver/vehicles/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                    <Plus size={18} />
                    <span>Add New Vehicle</span>
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                        <Car size={32} />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No vehicles added</h3>
                    <p className="mt-1 text-gray-500">Get started by adding your first vehicle to the platform.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Vehicle Info</th>
                                    <th className="px-6 py-4 font-medium">Registration No.</th>
                                    <th className="px-6 py-4 font-medium">Color</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={vehicle.image}
                                                    alt={vehicle.name}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{vehicle.name}</p>
                                                    <p className="text-xs text-gray-500">{vehicle.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                            {vehicle.number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {vehicle.color}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full border ${vehicle.status === 'Active'
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400'
                                                }`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/driver/vehicles/${vehicle.id}`)}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/driver/vehicles/edit/${vehicle.id}`)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleManagement;
