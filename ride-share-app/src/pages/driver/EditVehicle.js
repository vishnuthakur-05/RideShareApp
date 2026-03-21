import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, CheckCircle, Car, X } from 'lucide-react';
import { fetchVehicleDetails, updateVehicle } from '../../services/api';

const EditVehicle = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        model: '',
        rcNumber: '',
        insuranceNumber: '',
        year: '',
        ac: 'AC',
        audio: 'Yes',
        kms: '',
        color: '',
        images: []
    });

    useEffect(() => {
        const loadVehicle = async () => {
            try {
                const data = await fetchVehicleDetails(id);
                setFormData({
                    company: data.company,
                    model: data.model,
                    rcNumber: data.rcNumber,
                    insuranceNumber: data.insuranceNumber,
                    year: data.year,
                    ac: data.ac,
                    audio: data.audio,
                    kms: data.kms,
                    color: data.color,
                    images: data.images || []
                });
            } catch (error) {
                alert('Failed to load vehicle details');
                navigate('/driver/vehicles');
            } finally {
                setLoading(false);
            }
        };
        loadVehicle();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }))
            .then(base64Images => {
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...base64Images]
                }));
            })
            .catch(error => console.error("Error converting images to Base64:", error));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await updateVehicle(id, formData);
            setShowSuccessModal(true);
        } catch (error) {
            alert(error.message || 'Failed to update vehicle');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading vehicle details...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 relative">

            {showSuccessModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Vehicle Updated!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            Your vehicle specifications and details have been successfully saved to your profile.
                        </p>
                        <button
                            onClick={() => navigate('/driver/vehicles')}
                            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            Complete
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/driver/vehicles')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    &larr; Back
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Vehicle</h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between relative mb-8">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>1</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                    }`}>2</div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                            <Car className="text-indigo-500" /> Basic Vehicle Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RC Number</label>
                                <input
                                    type="text"
                                    name="rcNumber"
                                    value={formData.rcNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Policy No.</label>
                                <input
                                    type="text"
                                    name="insuranceNumber"
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Images</label>

                            {formData.images && formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-24">
                                            <img src={img} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                                title="Remove Image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition relative overflow-hidden">
                                <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="" onChange={handleImageUpload} />
                                <div className="flex flex-col items-center gap-2 pointer-events-none">
                                    <Upload size={32} className="text-gray-400" />
                                    <span className="text-indigo-600 font-medium">Click or drag new images to upload</span>
                                    <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                            <CheckCircle className="text-green-500" /> Vehicle Specifications
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year of Model</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KMs Driven</label>
                                <input
                                    type="number"
                                    name="kms"
                                    value={formData.kms}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AC / Non-AC</label>
                                <select
                                    name="ac"
                                    value={formData.ac}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="AC">AC</option>
                                    <option value="Non-AC">Non-AC</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audio System</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="audio"
                                        value="Yes"
                                        checked={formData.audio === 'Yes'}
                                        onChange={handleChange}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="audio"
                                        value="No"
                                        checked={formData.audio === 'No'}
                                        onChange={handleChange}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">No</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-4 py-2 transition"
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition shadow-md ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <CheckCircle size={18} /> {submitting ? 'Updating...' : 'Update Vehicle'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditVehicle;
