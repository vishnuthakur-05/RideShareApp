import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';
const ADMIN_API_URL = 'http://localhost:8081/api/admin';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role); // Store role
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};



export const changePassword = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/change-password`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
};

export const getCurrentUser = () => {
    return localStorage.getItem('token');
};

export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/profile`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
// Vehicle Endpoints

export const fetchDriverVehicles = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/driver/vehicles`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchVehicleDetails = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/driver/vehicles/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const addVehicle = async (vehicleData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:8081/api/driver/vehicles`, vehicleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const updateVehicle = async (id, vehicleData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:8081/api/driver/vehicles/${id}`, vehicleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const deleteVehicle = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:8081/api/driver/vehicles/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Ride Endpoints

export const searchRides = async (params) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/rides/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: params
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createRide = async (rideData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:8081/api/rides`, rideData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchDriverRides = async (driverId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/rides/driver/${driverId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const updateRideStatus = async (rideId, status) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`http://localhost:8081/api/rides/${rideId}/status?status=${status}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const rescheduleRide = async (rideId, date, time) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`http://localhost:8081/api/rides/${rideId}/reschedule?date=${date}&time=${time}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Admin Endpoints
export const fetchAllUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${ADMIN_API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchPendingUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${ADMIN_API_URL}/users?status=PENDING`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchApprovedUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${ADMIN_API_URL}/users?status=APPROVED`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const approveUser = async (id, role) => {
    return await verifyUser(id, 'APPROVED', role);
};

export const rejectUser = async (id, role) => {
    return await verifyUser(id, 'REJECTED', role);
};

export const verifyUser = async (id, status, role) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${ADMIN_API_URL}/users/${id}/verify?status=${status}&role=${role}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchDashboardStats = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${ADMIN_API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getPassengerBookings = async (passengerId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/bookings/passenger/${passengerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getDriverBookings = async (driverId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/bookings/driver/${driverId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createBooking = async (bookingData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:8081/api/bookings`, bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const updateBookingStatus = async (bookingId, status, transactionId = null) => {
    try {
        const token = localStorage.getItem('token');
        let url = `http://localhost:8081/api/bookings/${bookingId}/status?status=${status}`;
        if (transactionId) {
            url += `&transactionId=${encodeURIComponent(transactionId)}`;
        }
        const response = await axios.patch(url, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const rateBooking = async (bookingId, rating, review) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`http://localhost:8081/api/bookings/${bookingId}/rate?rating=${rating}${review ? `&review=${encodeURIComponent(review)}` : ''}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
