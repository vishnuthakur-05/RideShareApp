const testAuth = async () => {
    try {
        const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: 'p@gmail.com', password: 'p'})
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.log("Fetch Error:", e.message);
    }
};
testAuth();
