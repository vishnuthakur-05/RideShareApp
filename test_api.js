const http = require('http');

const data = JSON.stringify({});

const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/api/rides/1/status?status=Cancelled',
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let responseData = '';

    res.on('data', d => {
        responseData += d;
    });

    res.on('end', () => {
        console.log(`Response: ${responseData}`);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
