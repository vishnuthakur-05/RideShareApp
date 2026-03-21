import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, CheckCircle, Car } from 'lucide-react';

import { addVehicle } from '../../services/api';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
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
                    images: [...prev.images, ...base64Images]
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
            await addVehicle(formData);
            setShowSuccessModal(true);
        } catch (error) {
            alert(error.message || 'Failed to add vehicle');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 relative">

            {showSuccessModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Vehicle Added!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            Your new vehicle has been successfully registered to your account.
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Vehicle</h1>
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
                                    placeholder="e.g. Toyota"
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
                                    placeholder="e.g. Innova Crysta"
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
                                    placeholder="KA 05 AB 1234"
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
                                    placeholder="Policy Number"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Images</label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <input type="file" multiple accept="image/*" className="hidden" id="vehicle-images" onChange={handleImageUpload} />
                                <label htmlFor="vehicle-images" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload size={32} className="text-gray-400" />
                                    <span className="text-indigo-600 hover:text-indigo-500">Click to upload</span>
                                    <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                                </label>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {formData.images.length} files selected
                                </div>
                            )}
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
                                    placeholder="e.g. 2022"
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
                                    placeholder="e.g. Silver"
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
                                    placeholder="e.g. 15000"
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
                                <CheckCircle size={18} /> {submitting ? 'Submitting...' : 'Submit Vehicle'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddVehicle;
