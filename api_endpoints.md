# API Endpoints Documentation

## Language Selection
- **POST** `/set-language`
  ```
  Request body: { "language": "hi" }
  Response: Redirects to /search
  ```

## Property Search APIs

### DORIS API
- **GET** `/api/doris`
  ```
  Query params: 
  - propertyId: "4000015823"
  OR
  - registrationNumber: "1001202212345"

  Example: http://localhost:8080/api/doris?propertyId=4000015823

  Response:
  {
    "source": "DORIS",
    "propertyId": "4000015823",
    "registrationNumber": "1001202212345",
    "ownerName": "Rahul Sharma",
    "registrationDate": "2022-01-10",
    "encumbrances": ["Mortgage"],
    "loanStatus": "No Loan"
  }
  ```

### DLR API
- **GET** `/api/dlr`
  ```
  Query params:
  - propertyId: "5600017395"
  OR
  - registrationNumber: "1502202254321"

  Example: http://localhost:8080/api/dlr?registrationNumber=1502202254321

  Response:
  {
    "source": "DLR",
    "propertyId": "5600017395",
    "registrationNumber": "1502202254321",
    "ownerName": "Sneha Kapoor",
    "registrationDate": "2022-02-15",
    "encumbrances": ["Property Tax Pending"],
    "loanStatus": "Loan Approved"
  }
  ```

### CERSAI API
- **GET** `/api/cersai`
  ```
  Query params:
  - propertyId: "4000021234"
  OR
  - registrationNumber: "0503202256789"

  Example: http://localhost:8080/api/cersai?propertyId=4000021234

  Response:
  {
    "source": "CERSAI",
    "propertyId": "4000021234",
    "registrationNumber": "0503202256789",
    "ownerName": "Amit Deshmukh",
    "registrationDate": "2022-03-05",
    "encumbrances": ["Lien"],
    "loanStatus": "Pending Discharge"
  }
  ```

### MCA21 API
- **GET** `/api/mca21`
  ```
  Query params:
  - propertyId: "5000021111"
  OR
  - registrationNumber: "1505202222222"

  Example: http://localhost:8080/api/mca21?propertyId=5000021111

  Response:
  {
    "source": "MCA21",
    "propertyId": "5000021111",
    "registrationNumber": "1505202222222",
    "ownerName": "Sunil Kumar",
    "registrationDate": "2022-05-15",
    "encumbrances": ["Corporate Charge"],
    "loanStatus": "Loan Under Process"
  }
  ```

## Testing with cURL

Test DORIS API:
```bash
curl "http://localhost:8080/api/doris?propertyId=4000015823"
```

Test DLR API:
```bash
curl "http://localhost:8080/api/dlr?registrationNumber=1502202254321"
```

Test CERSAI API:
```bash
curl "http://localhost:8080/api/cersai?propertyId=4000021234"
```

Test MCA21 API:
```bash
curl "http://localhost:8080/api/mca21?propertyId=5000021111"
```

## Notes
- All APIs return 404 if property is not found
- Response includes encumbrances from the database
- Each API adds its own specific loan status
