# User Module API Documentation

## Base URL
`/api/user`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| Get Profile  | GET    | /profile         | Get user profile      |
| Update       | PUT    | /update          | Update user info      |
| Delete       | DELETE | /delete          | Delete user account   |

## Example Requests

### Update
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

## Example Responses

### Get Profile
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

---
[Back to main API documentation](../../README.md) 