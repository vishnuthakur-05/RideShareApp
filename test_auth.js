const axios = require('axios');

async function testCancel() {
    try {
        const loginRes = await axios.post('http://localhost:8081/api/auth/login', {
            email: 'p@gmail.com', // Let's guess driver email or fetch all users?
            password: 'p'
        });
        console.log("Logged in:", loginRes.data.role);

        // not knowing the email, let's fetch from DB directly or use admin to get users
    } catch (err) {
        console.log('Login failed', err.message);
    }
}
testCancel();
