const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./rideshare.db');

db.serialize(() => {
    db.all("SELECT * FROM vehicle_images", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Found ${rows.length} image rows`);
        if (rows.length > 0) {
            rows.slice(0, 3).forEach(row => {
                console.log(`Row: vehicle_id=${row.vehicle_id}, string length: ${row.images ? row.images.length : 0}`);
                if (row.images) {
                    console.log(`Starts with: ${row.images.substring(0, 100)}`);
                }
            });
        }
    });
});

db.close();
