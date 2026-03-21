const testFlow = async () => {
    try {
        const formData = new FormData();
        const blob = new Blob([JSON.stringify({
            firstName: 'Bot',
            lastName: 'Test',
            email: 'bot@example.com',
            password: 'pass',
            contactNo: '1111111111',
            role: 'PASSENGER',
            gender: 'M',
            address: 'Earth'
        })], { type: 'application/json' });
        
        formData.append('user', blob);

        console.log("Registering...");
        let regRes = await fetch('http://localhost:8081/api/auth/register', {
            method: 'POST',
            body: formData
        });
        console.log("Registered:", regRes.status, await regRes.text());

        console.log("Logging in...");
        let logRes = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: 'bot@example.com', password: 'pass'})
        });
        console.log("Logged in:", logRes.status, await logRes.text());
        
    } catch (e) {
        console.log("Flow Error:", e.stack);
    }
};
testFlow();
