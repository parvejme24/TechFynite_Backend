# Blog Category API Documentation

## Overview
The Blog Category API allows you to manage blog categories in the system. It supports CRUD operations for blog categories, including listing, creating, updating, and deleting categories.

---

## BlogCategory Model

A BlogCategory has the following fields:

| Field      | Type     | Description                  |
|------------|----------|------------------------------|
| id         | String   | Unique identifier (UUID)     |
| title      | String   | Category title               |
| imageUrl   | String?  | Optional image URL           |
| blogCount  | Int      | Number of blogs in category  |
| slug       | String   | Unique slug for the category |
| createdAt  | DateTime | Creation timestamp           |
| updatedAt  | DateTime | Last update timestamp        |

---

## Endpoints

### 1. Get All Blog Categories
- **URL:** `GET /blog-categories`
- **Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "imageUrl": "string",
    "blogCount": 0,
    "slug": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Get Blog Category by ID
- **URL:** `GET /blog-categories/:id`
- **Response:**
```json
{
  "id": "string",
  "title": "string",
  "imageUrl": "string",
  "blogCount": 0,
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
- **404 Response:**
```json
{ "error": "Blog category not found" }
```

---

### 3. Create Blog Category
- **URL:** `POST /blog-categories`
- **Request Body:**
```json
{
  "title": "string",
  "imageUrl": "string", // optional
  "slug": "string"
}
```
- **Response:**
```json
{
  "id": "string",
  "title": "string",
  "imageUrl": "string",
  "blogCount": 0,
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
- **Error Response:**
```json
{ "error": "Failed to create blog category" }
```

---

### 4. Update Blog Category
- **URL:** `PUT /blog-categories/:id`
- **Request Body:**
```json
{
  "title": "string", // optional
  "imageUrl": "string", // optional
  "slug": "string" // optional
}
```
- **Response:**
```json
{
  "id": "string",
  "title": "string",
  "imageUrl": "string",
  "blogCount": 0,
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
- **Error Response:**
```json
{ "error": "Failed to update blog category" }
```

---

### 5. Delete Blog Category
- **URL:** `DELETE /blog-categories/:id`
- **Response:**
- Status: 204 No Content
- **Error Response:**
```json
{ "error": "Failed to delete blog category" }
```

---

## Error Handling
All endpoints return a JSON error object with an `error` field in case of failure.

---

## Notes
- All timestamps are in ISO 8601 format.
- The `slug` field must be unique.
- The `blogCount` is managed by the system and cannot be set manually. 