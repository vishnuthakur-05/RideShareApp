const axios = require('axios');

async function testCancel() {
    try {
        // Attempt to log in with driver1@example.com
        const loginRes = await axios.post('http://localhost:8081/api/auth/login', {
            email: 'driver1@example.com',
            password: 'password123'
        });
        console.log("Logged in");
        const token = loginRes.data.token;

        // Fetch rides
        const ridesRes = await axios.get('http://localhost:8081/api/rides/driver/1', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (ridesRes.data.length > 0) {
            const rideId = ridesRes.data[0].id;
            console.log("Cancelling ride", rideId);

            try {
                const patchRes = await axios.patch(`http://localhost:8081/api/rides/${rideId}/status?status=Cancelled`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Success:", patchRes.data);
            } catch (err) {
                console.log("Patch failed!", err.response ? err.response.data : err.message, err.response ? err.response.status : '');
            }
        } else {
            console.log("No rides to cancel");
        }
    } catch (e) {
        console.log("Login failed", e.response ? e.response.data : e.message);
    }
}

testCancel();
