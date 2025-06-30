# Newsletter Module API Documentation

## Base URL
`/api/newsletter`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| Subscribe    | POST   | /subscribe       | Subscribe to newsletter|
| Unsubscribe  | POST   | /unsubscribe     | Unsubscribe from newsletter|
| List         | GET    | /                | List all subscribers  |

## Example Requests

### Subscribe
```json
{
  "email": "user@example.com"
}
```

## Example Responses

### List
```json
[
  { "id": 1, "email": "user@example.com" }
]
```

---
[Back to main API documentation](../../README.md) 