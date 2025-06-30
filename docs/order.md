# Order Module API Documentation

## Base URL
`/api/order`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all orders       |
| Create       | POST   | /                | Create an order       |
| Update       | PUT    | /:id             | Update an order       |
| Delete       | DELETE | /:id             | Delete an order       |

## Example Requests

### Create
```json
{
  "userId": 1,
  "products": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

## Example Responses

### List
```json
[
  { "id": 1, "userId": 1, "products": [ { "productId": 1, "quantity": 2 } ] }
]
```

---
[Back to main API documentation](../../README.md) 