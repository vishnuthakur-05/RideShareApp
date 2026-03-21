const axios = require('axios');

const API_URL = 'http://localhost:8080/api/auth';
const ADMIN_API_URL = 'http://localhost:8080/api/admin';

async function testApproval() {
    try {
        // 1. Login as Admin
        console.log("Logging in as Admin...");
        const loginResponse = await axios.post(`${API_URL}/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });

        const token = loginResponse.data.jwt;
        console.log("Login Successful. Token received.");

        // 2. Try to verify Driver with ID 2
        console.log("Attempting to verify Driver ID 2...");
        const verifyResponse = await axios.put(
            `${ADMIN_API_URL}/users/2/verify?status=APPROVED&role=DRIVER`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log("Verification Response:", verifyResponse.data);

    } catch (error) {
        console.error("Error occurred:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testApproval();
