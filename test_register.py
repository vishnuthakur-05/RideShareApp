import requests
import json

url = "http://localhost:8080/api/auth/register"

user_data = {
    "firstName": "Test",
    "lastName": "User",
    "email": "test.user.firebase.v2@example.com",
    "password": "password123",
    "role": "DRIVER",
    "contactNo": "1234567890",
    "dob": "1990-01-01",
    "gender": "Male",
    "address": {
        "plotNo": "123",
        "areaStreet": "Main St",
        "city": "Metropolis",
        "state": "NY",
        "country": "USA",
        "pincode": "10001"
    },
    "education": {
        "tenthSchool": "School Name",
        "tenthYear": "2006",
        "tenthPercentage": "90",
        "twelfthSchool": "School Name",
        "twelfthYear": "2008",
        "twelfthPercentage": "85",
        "graduationCollege": "College Name",
        "graduationYear": "2012",
        "graduationPercentage": "80"
    },
    "docType": "AADHAR",
    "docNumber": "123456789012"
}

files = {
    'user': (None, json.dumps(user_data), 'application/json'),
    'file': ('test.txt', b'dummy content', 'text/plain')
}

try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    with open("error_response.txt", "w") as f:
        f.write(response.text)
    print("Response saved to error_response.txt")
except Exception as e:
    print(f"Error: {e}")
