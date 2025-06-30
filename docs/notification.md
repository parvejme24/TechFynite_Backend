# Notification Module API Documentation

## Base URL
`/api/notification`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all notifications|
| Mark Read    | POST   | /read/:id        | Mark as read          |
| Delete       | DELETE | /:id             | Delete notification   |

## Example Requests

### Mark Read
```json
{
  "id": 1
}
```

## Example Responses

### List
```json
[
  { "id": 1, "message": "Order shipped", "read": false }
]
```

---
[Back to main API documentation](../../README.md) 