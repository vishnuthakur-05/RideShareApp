import sqlite3
import json

conn = sqlite3.connect('rideshare.db')
c = conn.cursor()

c.execute("SELECT vehicle_id, images FROM vehicle_images LIMIT 5")
rows = c.fetchall()

result = []
for row in rows:
    vid = row[0]
    img = row[1]
    
    start_str = img[:50]
    end_str = img[-50:]
    result.append({"vid": vid, "start": start_str, "end": end_str, "length": len(img)})

with open('db_inspect.json', 'w') as f:
    json.dump(result, f, indent=2)

conn.close()
