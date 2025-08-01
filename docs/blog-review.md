# Blog Review API Documentation

This document describes the API endpoints for managing blog reviews with flexible authentication.

## Base URL
```
/api/v1
```

## Authentication
- **Public endpoints**: No authentication required
- **Protected endpoints**: JWT token required in Authorization header
- **Admin endpoints**: Admin role required

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Reviews for a Blog
**GET** `/blog-review/:blogId`

Get all reviews for a specific blog post. **No authentication required.**

**Parameters:**
- `blogId` (string, required) - The ID of the blog post

**Response:**
```json
[
  {
    "id": "uuid",
    "blogId": "blog-uuid",
    "userId": "user-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "photoUrl": "https://example.com/photo.jpg",
    "commentText": "Great article!",
    "reply": {
      "userName": "Admin",
      "photoUrl": "https://example.com/admin.jpg",
      "commentText": "Thank you for your feedback!"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "displayName": "John Doe",
      "email": "john@example.com",
      "photoUrl": "https://example.com/photo.jpg"
    }
  }
]
```

### 2. Get Review by ID
**GET** `/blog-review/review/:id`

Get a specific review by its ID. **No authentication required.**

**Parameters:**
- `id` (string, required) - The ID of the review

**Response:**
```json
{
  "id": "uuid",
  "blogId": "blog-uuid",
  "userId": "user-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "photoUrl": "https://example.com/photo.jpg",
  "commentText": "Great article!",
  "reply": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "displayName": "John Doe",
    "email": "john@example.com",
    "photoUrl": "https://example.com/photo.jpg"
  }
}
```

### 3. Create Review
**POST** `/blog-review`

Create a new review for a blog post. **No authentication required - anyone can create reviews.**

**Request Body:**
```json
{
  "blogId": "blog-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "photoUrl": "https://example.com/photo.jpg",
  "commentText": "Great article! Very informative."
}
```

**Response:**
```json
{
  "id": "uuid",
  "blogId": "blog-uuid",
  "userId": "anonymous_1704067200000_abc123def",
  "fullName": "John Doe",
  "email": "john@example.com",
  "photoUrl": "https://example.com/photo.jpg",
  "commentText": "Great article! Very informative.",
  "reply": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": null
}
```

### 4. Update Review
**PUT** `/blog-review/:id`

Update an existing review. **Authentication required - users can only update their own reviews.**

**Parameters:**
- `id` (string, required) - The ID of the review to update

**Request Body:**
```json
{
  "commentText": "Updated comment text"
}
```

**Response:**
```json
{
  "id": "uuid",
  "blogId": "blog-uuid",
  "userId": "user-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "photoUrl": "https://example.com/photo.jpg",
  "commentText": "Updated comment text",
  "reply": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "displayName": "John Doe",
    "email": "john@example.com",
    "photoUrl": "https://example.com/photo.jpg"
  }
}
```

### 5. Delete Review
**DELETE** `/blog-review/:id`

Delete a review. **Authentication required - users can only delete their own reviews.**

**Parameters:**
- `id` (string, required) - The ID of the review to delete

**Response:**
```json
{
  "success": true,
  "message": "Blog review deleted successfully"
}
```

### 6. Reply to Review (Admin Only)
**POST** `/blog-review/:id/reply`

Add a reply to a review. **Admin authentication required - only admins can reply to reviews.**

**Parameters:**
- `id` (string, required) - The ID of the review to reply to

**Request Body:**
```json
{
  "commentText": "Thank you for your feedback!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "blogId": "blog-uuid",
  "userId": "user-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "photoUrl": "https://example.com/photo.jpg",
  "commentText": "Great article!",
  "reply": {
    "userName": "Admin",
    "photoUrl": "https://example.com/admin.jpg",
    "commentText": "Thank you for your feedback!"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "displayName": "John Doe",
    "email": "john@example.com",
    "photoUrl": "https://example.com/photo.jpg"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_string",
      "message": "Valid email is required",
      "path": ["email"]
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You can only modify your own reviews"
}
```

### 403 Forbidden (Admin Only)
```json
{
  "success": false,
  "message": "Only admins can reply to reviews"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Blog review not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create blog review"
}
```

## Sample Usage

### Creating a Review (No Authentication Required)
```bash
curl -X POST http://localhost:3000/api/v1/blog-review \
  -H "Content-Type: application/json" \
  -d '{
    "blogId": "blog-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "commentText": "Excellent article! Very well written."
  }'
```

### Getting Reviews for a Blog (No Authentication Required)
```bash
curl -X GET http://localhost:3000/api/v1/blog-review/blog-uuid
```

### Updating a Review (Authentication Required)
```bash
curl -X PUT http://localhost:3000/api/v1/blog-review/review-uuid \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "commentText": "Updated comment text"
  }'
```

### Admin Reply to Review (Admin Authentication Required)
```bash
curl -X POST http://localhost:3000/api/v1/blog-review/review-uuid/reply \
  -H "Authorization: Bearer admin-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "commentText": "Thank you for your valuable feedback!"
  }'
```

## Notes

- **Anyone can create reviews** without authentication
- **Anonymous reviews** get a temporary user ID
- **Authenticated users** can update/delete their own reviews
- **Only admins** can reply to reviews
- All timestamps are in ISO 8601 format
- The `reply` field contains admin responses to reviews
- User information is included in the response for better context