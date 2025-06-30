# Review Module API Documentation

## Base URL
`/api/review`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all reviews      |
| Create       | POST   | /                | Create a review       |
| Update       | PUT    | /:id             | Update a review       |
| Delete       | DELETE | /:id             | Delete a review       |

## Example Requests

### Create
```json
{
  "productId": 1,
  "userId": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

## Example Responses

### List
```json
[
  { "id": 1, "productId": 1, "userId": 1, "rating": 5, "comment": "Great product!" }
]
```

---
[Back to main API documentation](../../README.md) 