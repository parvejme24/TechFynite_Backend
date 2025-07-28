# Pricing API Documentation

This document describes the API endpoints for managing pricing plans in the TechFynite application.

## Base URL
```
/api/v1/pricing
```

## Authentication
- Public endpoints: No authentication required
- Protected endpoints: Requires valid JWT token in Authorization header
- Admin access required for create, update, and delete operations

## Data Models

### Pricing Plan
```typescript
{
  id: string;
  title: string;
  price: number;
  license: string;
  recommended: boolean;
  duration: 'MONTHLY' | 'YEARLY' | 'HALFYEARLY';
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Endpoints

### 1. Get All Pricing Plans
**GET** `/api/v1/pricing`

Retrieve all pricing plans with pagination and optional filtering.



#### Response
```json
{
  "success": true,
  "message": "Pricing plans retrieved successfully",
  "data": [
    {
      "id": "clx1234567890",
      "title": "Basic Plan",
      "price": 29,
      "license": "Single License",
      "recommended": false,
      "duration": "MONTHLY",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],

}
```

### 2. Get Pricing Plan by ID
**GET** `/api/v1/pricing/:id`

Retrieve a specific pricing plan by its ID.

#### Response
```json
{
  "success": true,
  "message": "Pricing plan retrieved successfully",
  "data": {
    "id": "clx1234567890",
    "title": "Basic Plan",
    "price": 29,
    "license": "Single License",
    "recommended": false,
    "duration": "MONTHLY",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Recommended Pricing Plans
**GET** `/api/v1/pricing/recommended`

Retrieve all recommended pricing plans.

#### Response
```json
{
  "success": true,
  "message": "Recommended pricing plans retrieved successfully",
  "data": [
    {
      "id": "clx1234567890",
      "title": "Pro Plan",
      "price": 99,
      "license": "Extended License",
      "recommended": true,
      "duration": "YEARLY",
      "features": ["All Basic Features", "Premium Support", "Priority Updates"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```



### 4. Create Pricing Plan (Admin Only)
**POST** `/api/v1/pricing`

Create a new pricing plan.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Basic Plan",
  "price": 29,
  "license": "Single License",
  "recommended": false,
  "duration": "MONTHLY",
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

#### Validation Rules
- `title`: Required, non-empty string
- `price`: Required, positive number
- `license`: Required, non-empty string
- `recommended`: Optional boolean (default: false)
- `duration`: Required, must be MONTHLY, YEARLY, or HALFYEARLY
- `features`: Required, array of strings with at least one feature

#### Response
```json
{
  "success": true,
  "message": "Pricing plan created successfully",
  "data": {
    "id": "clx1234567890",
    "title": "Basic Plan",
    "price": 29,
    "license": "Single License",
    "recommended": false,
    "duration": "MONTHLY",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Update Pricing Plan (Admin Only)
**PUT** `/api/v1/pricing/:id`

Update an existing pricing plan.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Updated Basic Plan",
  "price": 39,
  "recommended": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Pricing plan updated successfully",
  "data": {
    "id": "clx1234567890",
    "title": "Updated Basic Plan",
    "price": 39,
    "license": "Single License",
    "recommended": true,
    "duration": "MONTHLY",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Delete Pricing Plan (Admin Only)
**DELETE** `/api/v1/pricing/:id`

Delete a pricing plan.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response
```json
{
  "success": true,
  "message": "Pricing plan deleted successfully"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["title"],
      "message": "Title is required"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Pricing plan not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to create pricing plan"
}
```

## Usage Examples

### Create a Monthly Plan
```bash
curl -X POST http://localhost:5000/api/v1/pricing \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Basic",
    "price": 29,
    "license": "Single License",
    "duration": "MONTHLY",
    "features": ["Access to all templates", "Email support", "Updates"]
  }'
```

### Get All Plans
```bash
curl -X GET "http://localhost:5000/api/v1/pricing"
```

### Get Recommended Plans
```bash
curl -X GET http://localhost:5000/api/v1/pricing/recommended
```

### Update Plan Price
```bash
curl -X PUT http://localhost:5000/api/v1/pricing/clx1234567890 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 39
  }'
```

## Notes

- All timestamps are in ISO 8601 format
- IDs are generated using cuid() for better performance
- The `recommended` field helps highlight popular or featured plans
- Duration filtering supports MONTHLY, YEARLY, and HALFYEARLY options
- Admin authentication is required for create, update, and delete operations 