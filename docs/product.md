# Product Module API Documentation

## Base URL
`/api/product`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all products     |
| Create       | POST   | /                | Create a product      |
| Update       | PUT    | /:id             | Update a product      |
| Delete       | DELETE | /:id             | Delete a product      |
| Get By ID    | GET    | /:id             | Get product by ID     |

## Example Requests

### Create
```json
{
  "name": "T-Shirt",
  "price": 19.99,
  "categoryId": 1
}
```

## Example Responses

### List
```json
[
  { "id": 1, "name": "T-Shirt", "price": 19.99, "categoryId": 1 }
]
```

---
[Back to main API documentation](../../README.md) 