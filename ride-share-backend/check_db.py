import sqlite3

conn = sqlite3.connect('rideshare.db')
c = conn.cursor()

c.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables:", c.fetchall())

try:
    c.execute("SELECT vehicle_id, images FROM vehicle_images LIMIT 5")
    rows = c.fetchall()
    print(f"Found {len(rows)} image rows")
    for row in rows:
        vid = row[0]
        img = row[1]
        print(f"Vehicle: {vid}, Length: {len(img)}")
        if len(img) > 100:
            print(f"Start: {img[:50]} ... End: {img[-50:]}")
        else:
            print(f"Content: {img}")
except Exception as e:
    print("Error querying vehicle_images:", e)

conn.close()
