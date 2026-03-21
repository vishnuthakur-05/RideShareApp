const axios = require('axios');

async function testBooking() {
    try {
        const login = await axios.post('http://localhost:8081/api/auth/login', {
            email: 'p@gmail.com',
            password: 'p'
        });
        const token = login.data.token;
        console.log("Token:", token);

        const profile = await axios.get('http://localhost:8081/api/auth/profile', {
            headers: { Authorization: 'Bearer ' + token }
        });
        console.log("Profile:", profile.data);

        // search ride
        const rides = await axios.get('http://localhost:8081/api/rides/search', {
            headers: { Authorization: 'Bearer ' + token }
        });
        console.log("Rides count:", rides.data.length);

        if (rides.data.length > 0) {
            const rideId = rides.data[0].id;
            console.log("Booking ride:", rideId);

            try {
                const book = await axios.post('http://localhost:8081/api/bookings', {
                    rideId: rideId,
                    passengerId: profile.data.id,
                    seatsBooked: 1,
                    price: 100
                }, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                console.log("Booked:", book.data);
            } catch (e) {
                console.log("Booking error:", e.response ? e.response.data : e.message);
            }
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}
testBooking();
