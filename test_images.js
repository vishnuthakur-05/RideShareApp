const axios = require('axios');

async function check() {
    try {
        const login = await axios.post('http://localhost:8081/api/auth/login', {
            email: 'p@gmail.com', // wait, does any driver exist? let's fetch without token or find a valid driver
            password: 'p'
        });
        const token = login.data.token;

        const vehicles = await axios.get('http://localhost:8081/api/driver/vehicles', {
            headers: { Authorization: 'Bearer ' + token }
        });

        if (vehicles.data.length > 0) {
            console.log('Vehicle 0 images length:', vehicles.data[0].images.length);
            if (vehicles.data[0].images.length > 0) {
                console.log('First 50 chars of image 0:', vehicles.data[0].images[0].substring(0, 50));
                console.log('Last 50 chars of image 0:', vehicles.data[0].images[0].substring(vehicles.data[0].images[0].length - 50));
            }
        }
    } catch (e) { console.error('Error fetching cars'); }
}
check();
