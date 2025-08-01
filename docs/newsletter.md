# Newsletter API Documentation

This document describes the API endpoints for managing newsletter subscriptions.

## Base URL
```
/api/v1
```

## Authentication
- **Public endpoints**: No authentication required
- **Admin endpoints**: JWT token required in Authorization header

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Subscribe to Newsletter
**POST** `/newsletter`

Subscribe an email to the newsletter. **No authentication required.**

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

**Error Response (Email already subscribed):**
```json
{
  "success": false,
  "message": "Email already subscribed to Mailchimp"
}
```

### 2. Get All Newsletter Subscribers
**GET** `/newsletter/subscribers`

Get all newsletter subscribers with detailed information. **Admin authentication required.**

**Response:**
```json
[
  {
    "id": "subscriber-uuid",
    "email": "john@example.com",
    "status": "subscribed",
    "subscribedAt": "2024-01-01T00:00:00.000Z",
    "lastChanged": "2024-01-01T00:00:00.000Z",
    "firstName": "John",
    "lastName": "Doe"
  },
  {
    "id": "subscriber-uuid-2",
    "email": "jane@example.com",
    "status": "subscribed",
    "subscribedAt": "2024-01-02T00:00:00.000Z",
    "lastChanged": "2024-01-02T00:00:00.000Z",
    "firstName": "Jane",
    "lastName": "Smith"
  }
]
```

### 3. Get Newsletter Subscriber Count
**GET** `/newsletter/count`

Get newsletter subscriber statistics. **Admin authentication required.**

**Response:**
```json
{
  "total": 150,
  "subscribed": 145,
  "unsubscribed": 5
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch newsletter subscribers"
}
```

## Sample Usage

### Subscribe to Newsletter
```bash
curl -X POST http://localhost:3000/api/v1/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Get All Subscribers (Admin Only)
```bash
curl -X GET http://localhost:3000/api/v1/newsletter/subscribers \
  -H "Authorization: Bearer your-admin-jwt-token"
```

### Get Subscriber Count (Admin Only)
```bash
curl -X GET http://localhost:3000/api/v1/newsletter/count \
  -H "Authorization: Bearer your-admin-jwt-token"
```

## Notes

- **Mailchimp Integration**: This API integrates with Mailchimp for email list management
- **Public Subscription**: Anyone can subscribe to the newsletter without authentication
- **Admin Access**: Only authenticated admins can view subscriber lists and statistics
- **Email Validation**: Duplicate email subscriptions are handled gracefully
- **Status Tracking**: Subscriber status (subscribed, unsubscribed) is tracked
- **Merge Fields**: First name and last name are captured if available in Mailchimp

## Environment Variables Required

```env
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_AUDIENCE_ID=your_mailchimp_audience_id
```

## Mailchimp Configuration

The newsletter service is configured to use:
- **Server**: us18 (update this based on your Mailchimp API key)
- **Audience ID**: Set via environment variable
- **API Key**: Set via environment variable 