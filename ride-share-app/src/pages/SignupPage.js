import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Upload, ChevronRight, ChevronLeft, AlertCircle, MapPin, BookOpen, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const SignupPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get role from URL query parameter
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role');

    const [role, setRole] = useState(initialRole);
    const [step, setStep] = useState(1); // 1: Personal, 2: Address, 3: Education, 4: Document
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialRole) setRole(initialRole);
    }, [initialRole]);

    // Update form state structure
    const [formData, setFormData] = useState({
        // 1. Personal Details
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        gender: '',
        contactNo: '',
        password: '',
        confirmPassword: '',

        // 2. Address Details
        plotNo: '',
        areaStreet: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        country: '',

        // 3. Educational Details
        tenthSchool: '',
        tenthYear: '',
        tenthPercentage: '',
        twelfthSchool: '',
        twelfthYear: '',
        twelfthPercentage: '',
        graduationCollege: '',
        graduationYear: '',
        graduationPercentage: '',

        // 4. Document
        aadharOrPan: '', // Document Number
        documentFile: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        setError('');
    };

    const validateStep = () => {
        if (step === 1) { // Personal
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.dob || !formData.gender || !formData.contactNo)
                return "All personal details are required.";
            if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format.";
        }
        else if (step === 2) { // Address
            if (!formData.plotNo || !formData.areaStreet || !formData.pincode || !formData.city || !formData.state || !formData.country)
                return "All address fields (except landmark) are required.";
        }
        else if (step === 3) { // Education
            // Assuming required for valid profile completeness
            if (!formData.tenthSchool || !formData.tenthYear || !formData.tenthPercentage ||
                !formData.twelfthSchool || !formData.twelfthYear || !formData.twelfthPercentage)
                return "Schooling details are required.";
            // Graduation might be optional depending on logic, but prompt implied it. Let's make it required for now.
            if (!formData.graduationCollege || !formData.graduationYear || !formData.graduationPercentage)
                return "Graduation details are required.";
        }
        else if (step === 4) { // Document
            if (!formData.aadharOrPan || !formData.documentFile) return "Document number and file are required.";
        }
        return null;
    };

    const handleNext = () => {
        const validationError = validateStep();
        if (validationError) {
            setError(validationError);
            return;
        }
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        setError('');
        window.scrollTo(0, 0);
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateStep();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        // Transform simplified form data to backend DTO structure
        const backendPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: 'password123', // Default password since field is removed
            contactNo: formData.contactNo,
            dob: formData.dob,
            gender: formData.gender,
            role: role ? role.toUpperCase() : 'PASSENGER',

            address: {
                plotNo: formData.plotNo,
                areaStreet: formData.areaStreet,
                landmark: formData.landmark,
                pincode: formData.pincode,
                city: formData.city,
                state: formData.state,
                country: formData.country
            },

            education: {
                tenthSchool: formData.tenthSchool,
                tenthYear: formData.tenthYear,
                tenthPercentage: formData.tenthPercentage,
                twelfthSchool: formData.twelfthSchool,
                twelfthYear: formData.twelfthYear,
                twelfthPercentage: formData.twelfthPercentage,
                graduationCollege: formData.graduationCollege,
                graduationYear: formData.graduationYear,
                graduationPercentage: formData.graduationPercentage
            },

            docType: formData.aadharOrPan && formData.aadharOrPan.length > 10 ? "AADHAR" : "PAN",
            docNumber: formData.aadharOrPan
        };

        const data = new FormData();
        data.append('user', new Blob([JSON.stringify(backendPayload)], { type: 'application/json' }));
        if (formData.documentFile) {
            data.append('file', formData.documentFile);
        }

        try {
            const response = await registerUser(data);
            console.log('Registration Success:', response);
            setShowSuccessModal(true);
        } catch (err) {
            console.error('Registration Failed:', err);
            let errorMessage = 'Registration failed. Please try again.';
            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err.message) {
                errorMessage = err.message;
            } else if (err.error) {
                // Fallback for some Spring Boot error responses
                errorMessage = err.error;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // If no role is selected, show a message or redirect (handled by Navbar modal ideally, but good to have fallback)
    if (!role) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">No Role Selected</h2>
                    <p className="text-gray-600 mb-4">Please go back to home and select a role.</p>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
            </div>

            <div className={`max-w-4xl w-full bg-white p-6 md:p-10 rounded-2xl shadow-xl relative z-10 transition duration-300 ${showSuccessModal ? 'blur-sm pointer-events-none' : ''}`}>

                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {role === 'passenger' ? 'Passenger' : 'Partner/Driver'} Registration
                    </h2>
                    <p className="text-gray-500 mt-2">Complete your profile to get started</p>

                    {/* Progress Bar */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center w-full max-w-lg">
                            <StepIndicator step={step} target={1} label="Personal" icon={<User size={16} />} />
                            <StepConnector step={step} target={1} />
                            <StepIndicator step={step} target={2} label="Address" icon={<MapPin size={16} />} />
                            <StepConnector step={step} target={2} />
                            <StepIndicator step={step} target={3} label="Education" icon={<BookOpen size={16} />} />
                            <StepConnector step={step} target={3} />
                            <StepIndicator step={step} target={4} label="Document" icon={<FileText size={16} />} />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500 mr-2" size={20} />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Personal Details */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-6">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                                <Input label="Contact Number" type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="+1 234 567 890" />
                                <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-900">
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Address Details */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-6">Address Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Plot No / House No" name="plotNo" value={formData.plotNo} onChange={handleChange} />
                                <Input label="Area / Street" name="areaStreet" value={formData.areaStreet} onChange={handleChange} />
                                <Input label="Landmark (Optional)" name="landmark" value={formData.landmark} onChange={handleChange} />
                                <Input label="Pincode / Postcode" name="pincode" value={formData.pincode} onChange={handleChange} />
                                <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                                <Input label="State" name="state" value={formData.state} onChange={handleChange} />
                                <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {/* Section 3: Educational Details */}
                    {step === 3 && (
                        <div className="animate-fade-in space-y-8">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-4 bg-gray-50 p-2 rounded">10th Standard</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input label="School Name" name="tenthSchool" value={formData.tenthSchool} onChange={handleChange} />
                                    <Input label="Passing Year" name="tenthYear" value={formData.tenthYear} onChange={handleChange} />
                                    <Input label="Percentage (%)" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-4 bg-gray-50 p-2 rounded">12th Standard</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input label="School/College Name" name="twelfthSchool" value={formData.twelfthSchool} onChange={handleChange} />
                                    <Input label="Passing Year" name="twelfthYear" value={formData.twelfthYear} onChange={handleChange} />
                                    <Input label="Percentage (%)" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-4 bg-gray-50 p-2 rounded">Graduation</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input label="College/University" name="graduationCollege" value={formData.graduationCollege} onChange={handleChange} />
                                    <Input label="Passing Year" name="graduationYear" value={formData.graduationYear} onChange={handleChange} />
                                    <Input label="Percentage/CGPA" name="graduationPercentage" value={formData.graduationPercentage} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Document */}
                    {step === 4 && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-6">Document Verification</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Document Type</label>
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-900">
                                        <option>Aadhar Card</option>
                                        <option>PAN Card</option>
                                    </select>
                                </div>
                                <Input label="Document Number (Aadhar/PAN)" name="aadharOrPan" value={formData.aadharOrPan} onChange={handleChange} placeholder="XXXX-XXXX-XXXX" />
                                <FileInput
                                    label="Upload Document"
                                    name="documentFile"
                                    onChange={handleChange}
                                    text="Click to upload (Image/PDF)"
                                    fileName={formData.documentFile ? formData.documentFile.name : null}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t mt-8">
                        {step > 1 ? (
                            <button type="button" onClick={handleBack} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center font-medium transition">
                                <ChevronLeft className="mr-2" size={18} /> Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 4 ? (
                            <button type="button" onClick={handleNext} className="bg-indigo-900 text-white px-8 py-2 rounded-md hover:bg-indigo-800 flex items-center font-medium transition shadow-sm hover:shadow-md">
                                Save & Next <ChevronRight className="ml-2" size={18} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 flex items-center font-medium transition shadow-sm hover:shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Submitting...' : 'Submit Registration'}
                                {!loading && <CheckCircle className="ml-2" size={18} />}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"></div>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-auto relative z-10 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                        <p className="text-gray-600 mb-6">
                            Your account has been created.
                        </p>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                            <p className="text-base text-yellow-800 font-medium">
                                Kindly wait for admin approval for your password.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

// Components helpers
const StepIndicator = ({ step, target, label, icon }) => (
    <div className="flex flex-col items-center relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${step >= target ? 'bg-indigo-900 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'}`}>
            {step > target ? <CheckCircle size={20} /> : icon}
        </div>
        <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${step >= target ? 'text-indigo-900' : 'text-gray-400'}`}>{label}</span>
    </div>
);

const StepConnector = ({ step, target }) => (
    <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${step > target ? 'bg-indigo-900' : 'bg-gray-200'}`}></div>
);

const Input = ({ label, type = "text", name, value, onChange, placeholder }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent transition shadow-sm"
        />
    </div>
);

const FileInput = ({ label, name, onChange, text, fileName }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-900 transition bg-gray-50 hover:bg-white relative group">
            <input
                id={name}
                name={name}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={onChange}
                accept="image/*,.pdf"
            />
            <div className="space-y-1 text-center">
                {fileName ? (
                    <div className="text-indigo-900 flex flex-col items-center animate-fade-in">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                        <span className="font-medium text-lg">{fileName}</span>
                        <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                    </div>
                ) : (
                    <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-600 transition" />
                        <div className="flex text-sm text-gray-600 justify-center">
                            <span className="relative rounded-md font-medium text-indigo-900 hover:text-indigo-800">
                                {text}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </>
                )}
            </div>
        </div>
    </div>
);

export default SignupPage;
