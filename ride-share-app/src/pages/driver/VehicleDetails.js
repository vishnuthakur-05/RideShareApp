import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import { ArrowLeft, Car, Shield, FileText, Settings, Palette, Gauge } from 'lucide-react';
import { fetchVehicleDetails, deleteVehicle } from '../../services/api';

const VehicleDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadVehicle = async () => {
            try {
                const data = await fetchVehicleDetails(id);
                setVehicle(data);
            } catch (err) {
                setError('Failed to load vehicle details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadVehicle();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteVehicle(id);
                navigate('/driver/vehicles');
            } catch (err) {
                alert('Failed to delete vehicle');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!vehicle) return <div className="p-8 text-center">Vehicle not found</div>;

    // Clean base64 strings that might have saved without proper MIME type
    const sanitizeImage = (img) => {
        if (!img) return '';
        if (img.startsWith('data:application/octet-stream')) {
            return img.replace('data:application/octet-stream', 'data:image/jpeg');
        }
        return img;
    };

    const handleDownloadDocuments = () => {
        if (!vehicle) return;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(22);
        pdf.text('Vehicle Official Document', 20, 20);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        
        pdf.text(`Vehicle: ${vehicle.company} ${vehicle.model} (${vehicle.year})`, 20, 40);
        pdf.text(`Status: ${vehicle.status}`, 20, 48);
        pdf.text(`RC Number: ${vehicle.rcNumber}`, 20, 56);
        pdf.text(`Insurance Policy: ${vehicle.insuranceNumber}`, 20, 64);
        
        pdf.setFont("helvetica", "bold");
        pdf.text('Specifications:', 20, 80);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Color: ${vehicle.color}`, 20, 90);
        pdf.text(`KMs Driven: ${vehicle.kms}`, 20, 98);
        pdf.text(`Transmission / AC: ${vehicle.ac}`, 20, 106);
        pdf.text(`Audio System: ${vehicle.audio}`, 20, 114);
        
        let yPos = 130;
        
        if (vehicle.images && vehicle.images.length > 0) {
            pdf.setFont("helvetica", "bold");
            pdf.text('Vehicle Photos:', 20, yPos);
            yPos += 10;
            
            vehicle.images.forEach((img, index) => {
                const clImg = sanitizeImage(img);
                try {
                    let format = 'JPEG';
                    if (clImg.includes('image/png')) format = 'PNG';
                    
                    pdf.addImage(clImg, format, 20, yPos, 160, 100);
                    yPos += 110; 
                    
                    if (yPos > 260 && index < vehicle.images.length - 1) {
                        pdf.addPage();
                        yPos = 20;
                    }
                } catch (e) {
                    console.error("Failed to add image to PDF", e);
                }
            });
        }
        
        pdf.save(`${vehicle.company}_${vehicle.model}_Documents.pdf`.replace(/\s+/g, '_'));
    };

    // Use a placeholder image if none exists or empty list
    const displayImage = (vehicle.images && vehicle.images.length > 0)
        ? sanitizeImage(vehicle.images[0])
        : 'https://images.unsplash.com/photo-1560946059-99442078519e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/driver/vehicles')}
                    className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 transition"
                >
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Vehicle Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="relative h-64 w-full">
                            <img
                                src={displayImage}
                                alt={vehicle.model}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full shadow-md ${vehicle.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}>
                                    {vehicle.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{vehicle.company} {vehicle.model}</h2>
                                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{vehicle.rcNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Model Year</p>
                                    <p className="font-semibold text-gray-800 dark:text-white">{vehicle.year}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <FileText className="text-indigo-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">RC Number</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{vehicle.rcNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="text-green-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Insurance Policy</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{vehicle.insuranceNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Images - Placeholder logic */}
                    {vehicle.images && vehicle.images.length > 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {vehicle.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={sanitizeImage(img)}
                                    alt={`Vehicle ${idx}`}
                                    className="h-24 w-full object-cover rounded-lg shadow-sm hover:opacity-90 transition cursor-pointer"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Specs Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Specifications</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Palette size={20} className="text-purple-500" />
                                    <span className="text-gray-600 dark:text-gray-300">Color</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{vehicle.color}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Gauge size={20} className="text-orange-500" />
                                    <span className="text-gray-600 dark:text-gray-300">KMs Driven</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{vehicle.kms}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Settings size={20} className="text-blue-500" />
                                    <span className="text-gray-600 dark:text-gray-300">Transmission / AC</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{vehicle.ac}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Car size={20} className="text-red-500" />
                                    <span className="text-gray-600 dark:text-gray-300">Audio System</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{vehicle.audio}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/driver/vehicles/edit/${id}`)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition font-medium mb-4"
                    >
                        Edit Vehicle Details
                    </button>
                    <button 
                        onClick={handleDownloadDocuments}
                        className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium">
                        Download Documents
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition font-medium"
                    >
                        Delete Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
