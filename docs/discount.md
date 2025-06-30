# Discount Module API Documentation

## Base URL
`/api/discount`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all discounts    |
| Create       | POST   | /                | Create a discount     |
| Update       | PUT    | /:id             | Update a discount     |
| Delete       | DELETE | /:id             | Delete a discount     |

## Example Requests

### Create
```json
{
  "code": "SUMMER20",
  "amount": 20
}
```

## Example Responses

### List
```json
[
  { "id": 1, "code": "SUMMER20", "amount": 20 }
]
```

---
[Back to main API documentation](../../README.md) 