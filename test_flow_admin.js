const testFlow = async () => {
    try {
        const formData = new FormData();
        const blob = new Blob([JSON.stringify({
            firstName: 'BotAdmin',
            lastName: 'Test',
            email: 'bot_admin@example.com',
            password: 'pass',
            contactNo: '1111111111',
            role: 'ADMIN',
            gender: 'M',
            address: 'Earth'
        })], { type: 'application/json' });
        
        formData.append('user', blob);

        console.log("Registering Admin...");
        let regRes = await fetch('http://localhost:8081/api/auth/register', {
            method: 'POST',
            body: formData
        });
        console.log("Registered Admin:", regRes.status, await regRes.text());

        console.log("Logging in Admin...");
        let logRes = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: 'bot_admin@example.com', password: 'pass'})
        });
        console.log("Logged in:", logRes.status, await logRes.text());
        
    } catch (e) {
        console.log("Flow Error:", e.stack);
    }
};
testFlow();
